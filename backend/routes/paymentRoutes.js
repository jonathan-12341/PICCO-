/**
 * Payment Routes
 * Handles M-Pesa STK Push, callbacks, and transaction queries
 */

const express = require('express');
const router = express.Router();
const mpesaService = require('../services/mpesaService');
const { authenticateUser } = require('../middleware/auth');
const { logTransaction } = require('../controllers/transactionController');

/**
 * POST /api/payments/initiate-stk
 * Initiate STK Push for subscription payment
 * Body: { phoneNumber, amount, tier, orderId }
 */
router.post('/initiate-stk', authenticateUser, async (req, res) => {
  try {
    const { phoneNumber, amount, tier, orderId } = req.body;
    const userEmail = req.user.email;

    // Validate inputs
    if (!phoneNumber || !amount || !tier) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phoneNumber, amount, tier'
      });
    }

    // Validate tier (Pro or Plus)
    const validTiers = ['pro', 'plus'];
    if (!validTiers.includes(tier.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tier. Choose: pro or plus'
      });
    }

    // Validate amount is reasonable (between 1 and 100,000 KES)
    if (amount < 1 || amount > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be between 1 and 100,000 KES'
      });
    }

    // Initiate STK Push
    const stkResponse = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      orderId || `${userEmail}-${Date.now()}`,
      `PICCO ${tier.toUpperCase()} Tier Subscription`
    );

    // Store payment initiation in database
    await logTransaction({
      email: userEmail,
      type: 'STK_INITIATED',
      tier: tier,
      amount: amount,
      phoneNumber: mpesaService.maskPhoneNumber(phoneNumber),
      checkoutRequestID: stkResponse.checkoutRequestID,
      status: 'PENDING',
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Payment prompt sent. Please enter your M-Pesa PIN',
      data: {
        checkoutRequestID: stkResponse.checkoutRequestID,
        merchantRequestID: stkResponse.merchantRequestID,
        responseCode: stkResponse.responseCode
      }
    });
  } catch (error) {
    console.error('STK Push error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
});

/**
 * POST /api/payments/query-status
 * Query the status of a payment (for polling)
 * Body: { checkoutRequestID }
 */
router.post('/query-status', authenticateUser, async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;

    if (!checkoutRequestID) {
      return res.status(400).json({
        success: false,
        message: 'checkoutRequestID is required'
      });
    }

    const queryResponse = await mpesaService.queryTransactionStatus(checkoutRequestID);

    res.json({
      success: queryResponse.success,
      data: queryResponse
    });
  } catch (error) {
    console.error('Query status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.message
    });
  }
});

/**
 * POST /api/payments/callback
 * M-Pesa STK Push Callback
 * This endpoint receives results after user enters PIN or cancels
 * NO AUTHENTICATION - M-Pesa calls this directly
 */
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    console.log('📱 M-Pesa Callback received:', callbackData);

    // Parse the callback response
    const result = callbackData.Body?.stkCallback?.CallbackMetadata;
    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const checkoutRequestID = callbackData.Body?.stkCallback?.CheckoutRequestID;
    const merchantRequestID = callbackData.Body?.stkCallback?.MerchantRequestID;

    // Result code 0 = Success, 1 = User cancelled
    if (resultCode === 0) {
      // Extract transaction details
      const metadata = result?.CallbackMetadata?.Item;
      const transactionData = {};
      
      metadata?.forEach(item => {
        if (item.Name === 'Amount') transactionData.amount = item.Value;
        if (item.Name === 'MpesaReceiptNumber') transactionData.mpesaRef = item.Value;
        if (item.Name === 'TransactionDate') transactionData.transactionDate = item.Value;
        if (item.Name === 'PhoneNumber') transactionData.phoneNumber = item.Value;
      });

      console.log('✓ Payment successful:', transactionData);

      // Update transaction in database to 'COMPLETED'
      await logTransaction({
        checkoutRequestID: checkoutRequestID,
        status: 'COMPLETED',
        mpesaRef: transactionData.mpesaRef,
        amount: transactionData.amount,
        transactionDate: transactionData.transactionDate
      });

      // Unlock subscription tier for user
      // TODO: Implement subscription unlock logic

    } else if (resultCode === 1) {
      console.log('⚠ Payment cancelled by user');
      
      await logTransaction({
        checkoutRequestID: checkoutRequestID,
        status: 'CANCELLED'
      });
    } else {
      console.log('✗ Payment failed:', resultDesc);
      
      await logTransaction({
        checkoutRequestID: checkoutRequestID,
        status: 'FAILED',
        resultDescription: resultDesc
      });
    }

    // Always respond with success to M-Pesa
    // If we don't, M-Pesa will keep retrying
    res.json({ success: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    // Still respond success to avoid M-Pesa retries
    res.json({ success: true });
  }
});

/**
 * POST /api/payments/timeout
 * M-Pesa Timeout Callback
 * Called if callback URL doesn't respond within specified time
 */
router.post('/timeout', async (req, res) => {
  try {
    console.log('⏱ M-Pesa Timeout received:', req.body);
    
    // Log timeout event
    await logTransaction({
      originatorConversationID: req.body.Body?.resultHeader?.originatorConversationID,
      status: 'TIMEOUT',
      timestamp: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Timeout processing error:', error);
    res.json({ success: true });
  }
});

/**
 * POST /api/payments/survey-payout
 * Initiate B2C payout for survey completion
 * Body: { userPhone, amount }
 * ADMIN ONLY
 */
router.post('/survey-payout', authenticateUser, async (req, res) => {
  try {
    const { userPhone, amount } = req.body;
    const adminEmail = req.user.email;

    // Verify admin
    if (adminEmail !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    if (!userPhone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userPhone and amount are required'
      });
    }

    // Initiate B2C payment
    const b2cResponse = await mpesaService.initiateB2CPayment(
      userPhone,
      amount,
      'Survey Completion Payout',
      'SalaryPayment'
    );

    // Log transaction
    await logTransaction({
      email: adminEmail,
      type: 'B2C_PAYOUT',
      recipientPhone: mpesaService.maskPhoneNumber(userPhone),
      amount: amount,
      conversationID: b2cResponse.conversationID,
      status: 'INITIATED',
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Payout initiated successfully',
      data: {
        conversationID: b2cResponse.conversationID,
        responseCode: b2cResponse.responseCode
      }
    });
  } catch (error) {
    console.error('B2C payout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payout',
      error: error.message
    });
  }
});

module.exports = router;
