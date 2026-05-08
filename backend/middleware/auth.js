/**
 * Authentication Middleware
 * Validates JWT tokens and user sessions
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 */
const authenticateUser = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Middleware to verify admin access
 */
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

/**
 * Middleware to verify subscription status
 * Checks if user has active Pro/Plus subscription
 */
const verifySubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if user is admin (lifetime free access)
    if (req.user.email === process.env.ADMIN_EMAIL) {
      req.user.subscription = { tier: 'plus', status: 'active', expiresAt: null };
      return next();
    }

    // TODO: Query database for subscription status
    // const subscription = await getSubscriptionStatus(req.user.email);
    // if (!subscription || subscription.status !== 'active') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Active subscription required to access this feature'
    //   });
    // }
    // req.user.subscription = subscription;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Subscription verification failed'
    });
  }
};

/**
 * Middleware to verify @gmail.com email
 */
const verifyGmailOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!req.user.email.endsWith('@gmail.com')) {
      return res.status(403).json({
        success: false,
        message: 'Only Gmail accounts are allowed'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

module.exports = {
  authenticateUser,
  verifyAdmin,
  verifySubscription,
  verifyGmailOnly
};
