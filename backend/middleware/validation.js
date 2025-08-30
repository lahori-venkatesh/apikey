const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errorDetails,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  next();
};

/**
 * User registration validation rules
 */
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * User login validation rules
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * API key creation validation rules
 */
const validateApiKeyCreation = [
  body('serviceName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Service name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Service name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('apiKey')
    .notEmpty()
    .withMessage('API key is required')
    .isLength({ min: 10 })
    .withMessage('API key must be at least 10 characters long'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * API key update validation rules
 */
const validateApiKeyUpdate = [
  body('serviceName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Service name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

/**
 * Subscription creation validation rules
 */
const validateSubscriptionCreation = [
  body('serviceName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Service name must be between 2 and 50 characters'),
  
  body('planType')
    .isIn(['free', 'pro', 'enterprise'])
    .withMessage('Plan type must be free, pro, or enterprise'),
  
  body('monthlyLimit')
    .isInt({ min: 1 })
    .withMessage('Monthly limit must be a positive integer'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  
  handleValidationErrors
];

/**
 * Usage tracking validation
 */
const validateUsageTracking = [
  body('count')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Count must be a positive integer'),
  
  handleValidationErrors
];

/**
 * Date range validation for analytics
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (req.query.startDate && new Date(endDate) <= new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateApiKeyCreation,
  validateApiKeyUpdate,
  validateSubscriptionCreation,
  validateObjectId,
  validateUsageTracking,
  validateDateRange
};