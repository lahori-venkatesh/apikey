# Database Setup Guide

## 🗄️ MongoDB Setup for User Authentication

This guide will help you set up MongoDB to store user login details and other data persistently.

## 📋 Prerequisites

### Option 1: Install MongoDB Locally (Recommended for Development)

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

#### Ubuntu/Debian
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a Windows service

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (free tier: M0 Sandbox)
4. Get your connection string
5. Update your `.env` file with the Atlas connection string

## 🚀 Quick Setup

### 1. Start MongoDB (if using local installation)
```bash
# macOS
brew services start mongodb/brew/mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows - MongoDB should start automatically
```

### 2. Configure Environment Variables
Create or update `backend/.env`:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/apikey_management

# For MongoDB Atlas (cloud), use your connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apikey_management

# Other required variables
JWT_SECRET=your-super-secret-jwt-key-for-development-only
AES_SECRET=your-aes-secret-key-for-development-32chars
FRONTEND_URL=http://localhost:3000
PORT=8080
NODE_ENV=development
```

### 3. Setup Database Schema and Indexes
```bash
cd backend
npm run setup:db
```

### 4. Start the Application
```bash
# Start backend
cd backend
npm start

# Start frontend (in another terminal)
cd frontend
npm start
```

## 🔍 Verify Database Connection

### Check if MongoDB is Running
```bash
# Connect to MongoDB shell
mongosh

# Or check if the service is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
net start | findstr MongoDB
```

### Check Database from Application
1. Start the backend server
2. Look for this message in the console:
   ```
   ✅ Connected to MongoDB
   ✅ Database connected and ready for user authentication
   ```

### Test User Registration
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create a new account
4. Check the console for:
   ```
   ✅ User registered successfully: user@example.com
   ```

## 📊 Database Structure

### Collections Created:
- **users** - User accounts and profiles
- **apikeys** - Encrypted API keys
- **usages** - API usage tracking

### User Document Example:
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "plan": "Free",
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

#### Error: "MongoNetworkError: connect ECONNREFUSED"
```bash
# Check if MongoDB is running
# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Check the status
mongosh --eval "db.runCommand('ping')"
```

#### Error: "Authentication failed"
- Check your MongoDB URI in `.env`
- Ensure username/password are correct (for Atlas)
- For local MongoDB, authentication is usually not required

#### Error: "Database not found"
- MongoDB creates databases automatically
- The database will be created when you first insert data

### Application Issues

#### Users not persisting after server restart
- ✅ **Fixed!** Users are now stored in MongoDB
- Data will persist between server restarts
- Check MongoDB connection in server logs

#### Login not working
1. Check MongoDB connection
2. Verify user exists: `mongosh apikey_management --eval "db.users.find()"`
3. Check server logs for authentication errors

## 🔒 Security Best Practices

### Development
- Use strong JWT secrets
- Keep MongoDB on localhost
- Use environment variables for sensitive data

### Production
- Use MongoDB Atlas or secure MongoDB installation
- Enable authentication and authorization
- Use SSL/TLS connections
- Regular backups
- Monitor access logs

## 📈 Database Management

### View Users
```bash
mongosh apikey_management
db.users.find().pretty()
```

### Count Documents
```bash
mongosh apikey_management
db.users.countDocuments()
db.apikeys.countDocuments()
```

### Backup Database
```bash
mongodump --db apikey_management --out ./backup
```

### Restore Database
```bash
mongorestore --db apikey_management ./backup/apikey_management
```

## 🎯 What's Now Working

✅ **Persistent User Accounts** - Users stored in MongoDB
✅ **Secure Authentication** - Bcrypt password hashing
✅ **Profile Management** - User data persists
✅ **Login Sessions** - JWT tokens with database validation
✅ **Account Recovery** - Foundation for password reset
✅ **User Statistics** - Track user activity
✅ **Data Integrity** - Database constraints and validation

Your login details are now safely stored in MongoDB and will persist between server restarts!