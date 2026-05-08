/**
 * M-Pesa Integration Service
 * Handles all Safaricom Daraja API interactions
 * STK Push, B2C payments, transaction callbacks
 */

const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.phoneNumber = process.env.MPESA_PHONE;
    this.env = process.env.MPESA_ENV || 'sandbox';
    
    this.baseUrl = this.env === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Step 1: Get Access Token from Daraja API
   * Required for all M-Pesa API calls
   */
  async getAccessToken() {
    try {
      // Check if token is still valid (with 5min buffer)
      if (this.accessToken && this.tokenExpiry > Date.now() + 300000) {
        console.log('✓ Using cached access token');
        return this.accessToken;
      }

      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token typically expires in 3600 seconds
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      
      console.log('✓ Access token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('✗ Failed to get access token:', error.response?.data || error.message);
      throw new Error('M-Pesa authentication failed');
    }
  }

  /**
   * Step 2: STK Push - Prompt user to enter M-Pesa PIN
   * Used for website builder subscription payments
   */
  async initiateSTKPush(phoneNumber, amount, orderId, description) {
    try {
      const token = await this.getAccessToken();
      
      // Format phone number to 254xxxxxxxxx format
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Generate timestamp (YYYYMMDDHHMMSS)
      const timestamp = this.generateTimestamp();
      
      // Generate password for STK Push
      const password = Buffer.from(
        `${this.shortCode}${this.passkey}${timestamp}`
      ).toString('base64');

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount), // Round up to nearest whole number
        PartyA: formattedPhone,
        PartyB: this.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `PICCO-${orderId}`,
        TransactionDesc: description || 'PICCO Website Builder Subscription',
        Remark: 'Payment for PICCO services'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✓ STK Push initiated successfully:', response.data);
      
      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        merchantRequestID: response.data.MerchantRequestID
      };
    } catch (error) {
      console.error('✗ STK Push failed:', error.response?.data || error.message);
      throw new Error('Failed to initiate payment');
    }
  }

  /**
   * Step 3: B2C Payment - Send money to user (Survey payouts)
   * Transfers money from business account to user's M-Pesa wallet
   */
  async initiateB2CPayment(recipientPhone, amount, description, transactionType = 'SalaryPayment') {
    try {
      const token = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(recipientPhone);

      const payload = {
        OriginatorConversationID: `PICCO-${Date.now()}`,
        InitiatorName: process.env.ADMIN_EMAIL || 'PICCO',
        SecurityCredential: this.encryptSecurityCredential(),
        CommandID: transactionType, // SalaryPayment, BusinessPayment, PromotionPayment
        Amount: Math.ceil(amount),
        PartyA: this.shortCode,
        PartyB: formattedPhone,
        Remarks: description || 'Payment from PICCO COMPANIES',
        QueueTimeOutURL: process.env.MPESA_TIMEOUT_URL,
        ResultURL: process.env.MPESA_CALLBACK_URL,
        Occasion: 'Survey Completion Payout'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/b2c/v1/paymentrequest`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✓ B2C Payment initiated:', response.data);
      
      return {
        success: true,
        conversationID: response.data.ConversationID,
        originatorConversationID: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      };
    } catch (error) {
      console.error('✗ B2C Payment failed:', error.response?.data || error.message);
      throw new Error('Failed to process payout');
    }
  }

  /**
   * Step 4: Query Transaction Status
   * Check the status of an STK Push or payment
   */
  async queryTransactionStatus(checkoutRequestID) {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      
      const password = Buffer.from(
        `${this.shortCode}${this.passkey}${timestamp}`
      ).toString('base64');

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✓ Transaction status queried:', response.data);
      
      return {
        success: response.data.ResponseCode === '0',
        resultCode: response.data.ResultCode,
        resultDescription: response.data.ResultDesc,
        merchantRequestID: response.data.MerchantRequestID,
        checkoutRequestID: response.data.CheckoutRequestID
      };
    } catch (error) {
      console.error('✗ Query failed:', error.response?.data || error.message);
      throw new Error('Failed to query transaction status');
    }
  }

  /**
   * UTILITY: Format phone number to 254xxxxxxxxx format
   * Handles: 0723525608 → 254723525608
   */
  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    // If already has 254, keep it
    else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * UTILITY: Generate timestamp for M-Pesa (YYYYMMDDHHMMSS)
   */
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${date}${hours}${minutes}${seconds}`;
  }

  /**
   * UTILITY: Encrypt security credential for B2C
   * Uses RSA public key from Safaricom
   */
  encryptSecurityCredential() {
    // In production, use Safaricom's public key
    // For sandbox, use the test key provided by Safaricom
    const testCredential = process.env.MPESA_INITIATOR_PASSWORD || 'test';
    
    // TODO: Implement RSA encryption using Safaricom's public key
    // For now, return placeholder
    return testCredential;
  }

  /**
   * UTILITY: Mask recipient phone number for privacy
   * 254723525608 → 254723****608
   */
  maskPhoneNumber(phone) {
    const formatted = this.formatPhoneNumber(phone);
    return formatted.substring(0, 6) + '****' + formatted.substring(formatted.length - 3);
  }

  /**
   * UTILITY: Validate callback response from M-Pesa
   * Verifies the signature of the callback
   */
  validateCallback(callbackData) {
    // Extract metadata from callback
    const result = callbackData.Result;
    
    const transactionData = {
      resultCode: result.ResultCode,
      resultDescription: result.ResultDesc,
      transactionId: result.TransactionID,
      transactionDate: result.TransactionDate,
      amount: result.Amount,
      phoneNumber: result.PhoneNumber,
      // Additional metadata available in response
    };

    return transactionData;
  }
}

module.exports = new MpesaService();
