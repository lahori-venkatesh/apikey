#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const Usage = require('../models/Usage');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up MongoDB database...');
    
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apikey_management';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create indexes
    console.log('📊 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ googleId: 1 }, { sparse: true });
    await User.collection.createIndex({ createdAt: -1 });
    
    // API Key indexes
    await ApiKey.collection.createIndex({ userId: 1 });
    await ApiKey.collection.createIndex({ userId: 1, status: 1 });
    await ApiKey.collection.createIndex({ keyId: 1 }, { unique: true });
    
    // Usage indexes
    await Usage.collection.createIndex({ keyId: 1, date: 1 }, { unique: true });
    await Usage.collection.createIndex({ userId: 1, date: 1 });
    
    console.log('✅ Database indexes created');
    
    // Get database statistics
    const userCount = await User.countDocuments();
    const apiKeyCount = await ApiKey.countDocuments();
    const usageCount = await Usage.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   API Keys: ${apiKeyCount}`);
    console.log(`   Usage Records: ${usageCount}`);
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;