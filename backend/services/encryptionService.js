const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.secretKey = process.env.AES_SECRET || 'myAESSecretKey123456789012345678901234567890';
    this.key = crypto.scryptSync(this.secretKey, 'salt', 32);
  }

  /**
   * Encrypts an API key using AES encryption
   * @param {string} plainKey - The plain text API key
   * @returns {string} The encrypted API key
   */
  encryptApiKey(plainKey) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
      
      let encrypted = cipher.update(plainKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine IV and encrypted data
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      throw new Error(`Error encrypting API key: ${error.message}`);
    }
  }

  /**
   * Decrypts an API key using AES decryption
   * @param {string} encryptedKey - The encrypted API key
   * @returns {string} The decrypted plain text API key
   */
  decryptApiKey(encryptedKey) {
    try {
      const parts = encryptedKey.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted key format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encryptedData = parts[1];
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Error decrypting API key: ${error.message}`);
    }
  }

  /**
   * Encrypts an API key using a user-provided passphrase
   * @param {string} plainKey - The plain text API key
   * @param {string} passphrase - User-provided passphrase
   * @returns {string} The encrypted API key
   */
  encryptApiKeyWithPassphrase(plainKey, passphrase) {
    try {
      const iv = crypto.randomBytes(16);
      const salt = crypto.randomBytes(32);
      
      // Derive key from passphrase using PBKDF2
      const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');
      
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      
      let encrypted = cipher.update(plainKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine salt, IV, and encrypted data
      return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      throw new Error(`Error encrypting API key with passphrase: ${error.message}`);
    }
  }

  /**
   * Decrypts an API key using a user-provided passphrase
   * @param {string} encryptedKey - The encrypted API key
   * @param {string} passphrase - User-provided passphrase
   * @returns {string} The decrypted plain text API key
   */
  decryptApiKeyWithPassphrase(encryptedKey, passphrase) {
    try {
      const parts = encryptedKey.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted key format');
      }

      const salt = Buffer.from(parts[0], 'hex');
      const iv = Buffer.from(parts[1], 'hex');
      const encryptedData = parts[2];
      
      // Derive key from passphrase using same parameters
      const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Error decrypting API key with passphrase: ${error.message}`);
    }
  }

  /**
   * Hashes a password using BCrypt
   * @param {string} plainPassword - The plain text password
   * @returns {Promise<string>} The hashed password
   */
  async hashPassword(plainPassword) {
    try {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(plainPassword, salt);
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  /**
   * Verifies a password against its hash
   * @param {string} plainPassword - The plain text password
   * @param {string} hashedPassword - The hashed password
   * @returns {Promise<boolean>} True if password matches, false otherwise
   */
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }

  /**
   * Generates a random API key
   * @param {number} length - Length of the API key
   * @returns {string} Random API key
   */
  generateRandomKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Creates a hash of data for integrity checking
   * @param {string} data - Data to hash
   * @returns {string} SHA-256 hash
   */
  createHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

module.exports = new EncryptionService();