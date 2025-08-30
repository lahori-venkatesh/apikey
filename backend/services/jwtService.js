const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'mySecretKey123456789012345678901234567890';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Generates a JWT token for the given user ID
   * @param {string} userId - The user ID
   * @param {Object} extraClaims - Additional claims to include
   * @returns {string} JWT token
   */
  generateToken(userId, extraClaims = {}) {
    try {
      const payload = {
        userId,
        ...extraClaims,
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn,
        issuer: 'api-key-management',
        audience: 'api-key-management-users'
      });
    } catch (error) {
      throw new Error(`Error generating token: ${error.message}`);
    }
  }

  /**
   * Verifies and decodes a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret, {
        issuer: 'api-key-management',
        audience: 'api-key-management-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error(`Token verification failed: ${error.message}`);
      }
    }
  }

  /**
   * Extracts the user ID from a JWT token without verification
   * @param {string} token - JWT token
   * @returns {string|null} User ID or null if invalid
   */
  extractUserId(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded ? decoded.userId : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Checks if a token is expired without verification
   * @param {string} token - JWT token
   * @returns {boolean} True if expired, false otherwise
   */
  isTokenExpired(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Gets the expiration time of a token
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null if invalid
   */
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generates a refresh token (longer expiration)
   * @param {string} userId - The user ID
   * @returns {string} Refresh token
   */
  generateRefreshToken(userId) {
    try {
      const payload = {
        userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(payload, this.secret, {
        expiresIn: '7d', // 7 days for refresh token
        issuer: 'api-key-management',
        audience: 'api-key-management-users'
      });
    } catch (error) {
      throw new Error(`Error generating refresh token: ${error.message}`);
    }
  }

  /**
   * Validates a refresh token
   * @param {string} refreshToken - Refresh token to validate
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }
      
      return decoded;
    } catch (error) {
      throw new Error(`Refresh token verification failed: ${error.message}`);
    }
  }
}

module.exports = new JwtService();