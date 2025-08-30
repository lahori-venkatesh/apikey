const jwtService = require('../services/jwtService');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied. No token provided.',
          timestamp: new Date().toISOString()
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwtService.verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token. User not found.',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id.toString();
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    let message = 'Invalid token';
    if (error.message.includes('expired')) {
      message = 'Token has expired';
    } else if (error.message.includes('Invalid token')) {
      message = 'Invalid token format';
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwtService.verifyToken(token);
    
    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = user;
      req.userId = user._id.toString();
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

/**
 * Middleware to check if user owns the resource
 */
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied. You can only access your own resources.',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  checkResourceOwnership
};