import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Check if user has analyses remaining
 */
export const checkAnalysisQuota = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user.canAnalyze()) {
      return res.status(403).json({
        success: false,
        message: 'Analysis quota exceeded. Please upgrade your plan or wait for quota reset.',
        quota: {
          remaining: user.subscription.analysesRemaining,
          resetDate: user.subscription.resetDate,
          plan: user.subscription.plan
        }
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking analysis quota'
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
