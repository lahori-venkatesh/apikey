# Setup Guide - No Docker Required

## 🚀 Quick Start (No Docker Needed)

This application runs perfectly on your local machine without Docker. Here's how to get started:

### Prerequisites
- ✅ Node.js (v16 or higher) - You already have this
- ✅ npm (comes with Node.js) - You already have this
- ❌ Docker - NOT REQUIRED
- ❌ Redis - NOT REQUIRED (uses memory cache)
- ❌ MongoDB - NOT REQUIRED (uses temporary storage)

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:8080` and use:
- **Memory-based storage** (no database required)
- **Memory-based caching** (no Redis required)
- **File-based sessions** (no external dependencies)

### 2. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and automatically connect to the backend.

### 3. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/health

## 🔧 Development Mode Features

### What Works Without External Dependencies:
- ✅ **User Authentication** (JWT tokens)
- ✅ **API Key Management** (encrypted storage)
- ✅ **Real-time Features** (WebSocket connections)
- ✅ **Notifications** (in-memory)
- ✅ **Usage Tracking** (temporary storage)
- ✅ **Profile Management** (all features)
- ✅ **Billing & Usage** (mock data)
- ✅ **API Documentation** (full docs)
- ✅ **Help & Support** (complete system)

### Data Persistence:
- **Development**: Data is stored in memory (resets on server restart)
- **Production**: Can be configured with MongoDB and Redis later

## 🚀 Starting the Application

### Option 1: Manual Start (Recommended)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Option 2: Using npm scripts
```bash
# Backend with auto-restart
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## 🔍 Troubleshooting

### Port Already in Use?
```bash
# Kill processes on port 8080 (backend)
lsof -ti:8080 | xargs kill -9

# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Backend Won't Start?
```bash
cd backend
npm install  # Reinstall dependencies
npm start    # Try starting again
```

### Frontend Won't Start?
```bash
cd frontend
npm install  # Reinstall dependencies
npm start    # Try starting again
```

## 📊 What You'll See

### 1. **Login/Signup** - Create your account
### 2. **Dashboard** - Real-time usage monitoring
### 3. **API Keys** - Add and manage your API keys
### 4. **Analytics** - Usage statistics and charts
### 5. **Profile** - Account settings and billing
### 6. **Real-time Notifications** - Live updates
### 7. **System Monitoring** - Live system stats

## 🔒 Security Features (No External Dependencies)

- **JWT Authentication** - Secure token-based auth
- **AES-256 Encryption** - API keys encrypted with your passphrase
- **Rate Limiting** - Memory-based request limiting
- **Input Validation** - All forms validated
- **CORS Protection** - Cross-origin request security

## 🎯 Production Deployment (Optional)

When you're ready for production, you can optionally add:
- **MongoDB** - For persistent data storage
- **Redis** - For distributed caching
- **Docker** - For containerized deployment

But for development and testing, none of these are required!

## 🆘 Need Help?

If you encounter any issues:

1. **Check the console** - Look for error messages
2. **Restart the servers** - Stop and start both backend and frontend
3. **Clear browser cache** - Refresh the page
4. **Check ports** - Make sure 3000 and 8080 are available

The application is designed to work out-of-the-box with just Node.js and npm!