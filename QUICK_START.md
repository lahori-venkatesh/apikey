# 🚀 Quick Start Guide

## Get Started in 2 Minutes (No Database Required)

The application works immediately without any database setup. User data will be stored temporarily and can be upgraded to persistent storage later.

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm start
```

### 3. Open the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080/api/health

## ✅ What Works Immediately

- ✅ **User Registration & Login** (temporary storage)
- ✅ **API Key Management** (encrypted storage)
- ✅ **Real-time Features** (WebSocket connections)
- ✅ **All Dashboard Features** (analytics, monitoring, etc.)
- ✅ **Profile Management** (settings, billing, etc.)

## 📊 Data Storage Options

### Current: Temporary Storage
- **Pros**: Works immediately, no setup required
- **Cons**: Data resets when server restarts
- **Best for**: Development, testing, demos

### Upgrade: MongoDB (Persistent Storage)
- **Pros**: Data persists forever, production-ready
- **Cons**: Requires MongoDB installation
- **Best for**: Production use, long-term storage

## 🔄 Upgrade to Persistent Storage (Optional)

When you're ready for persistent data storage:

### Install MongoDB
```bash
# macOS
brew install mongodb-community
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### Update Configuration
```bash
# The app will automatically detect MongoDB and use it
# No code changes needed!
```

## 🎯 User Experience

### Registration Flow
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. ✅ Account created instantly

### Login Flow
1. Enter your email and password
2. ✅ Logged in with JWT token
3. Access all dashboard features

### Data Persistence
- **Without MongoDB**: Data stored in memory (resets on restart)
- **With MongoDB**: Data stored permanently in database

## 🔒 Security Features (Always Active)

- ✅ **Password Hashing** (bcrypt with salt)
- ✅ **JWT Authentication** (secure tokens)
- ✅ **API Key Encryption** (AES-256 with user passphrase)
- ✅ **Input Validation** (all forms protected)
- ✅ **Rate Limiting** (prevent abuse)

## 🛠️ Troubleshooting

### Backend Won't Start
```bash
cd backend
npm install
npm start
```

### Frontend Won't Start
```bash
cd frontend
npm install
npm start
```

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Or open in incognito/private mode

## 📱 Features Available

### 🏠 Dashboard
- Real-time usage monitoring
- API key statistics
- System health monitoring

### 🔑 API Key Management
- Add/edit/delete API keys
- Encrypted storage with passphrase
- Usage tracking per key

### 📊 Analytics
- Usage charts and statistics
- Performance monitoring
- Error tracking

### 👤 Profile Management
- Account settings
- Billing & usage information
- Notification preferences

### 🔔 Real-time Features
- Live notifications
- WebSocket connections
- Instant updates

### 📚 Documentation & Support
- Complete API documentation
- Help & support system
- FAQ and guides

## 🎉 You're Ready!

The application is now running with full functionality. User accounts will work immediately, and you can upgrade to persistent storage anytime without losing features.

**Next Steps:**
1. Create your account at http://localhost:3000
2. Add your first API key
3. Explore the dashboard features
4. (Optional) Install MongoDB for persistent storage

Enjoy your API Key Management Platform! 🚀