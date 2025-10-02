# Development Startup Guide

## Quick Start Commands

### Terminal 1 - Backend Server:
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend Server:
```bash
cd frontend
npm install
npm start
```

## What You'll See:

1. **Backend** starts on `http://localhost:8080`
   - API endpoints available
   - Authentication system ready
   - In-memory storage initialized

2. **Frontend** starts on `http://localhost:3000`
   - React app with authentication
   - Automatic proxy to backend
   - Google OAuth demo ready

## Test the Authentication:

### Option 1: Email/Password
1. Go to `http://localhost:3000/signup`
2. Create account: name, email, password
3. Login with your credentials

### Option 2: Google OAuth (Demo)
1. Go to `http://localhost:3000/login`
2. Click "Demo: Sign in with Google"
3. Automatically creates Google user

### Then Test API Keys:
1. After login, you'll see the dashboard
2. Click "Add API Key"
3. Add keys for OpenAI, Anthropic, etc.
4. Test the 5-key free limit

## Ready to Go! 🚀

Your authentication system is fully functional with:
- ✅ Email/password authentication
- ✅ Google OAuth (demo mode)
- ✅ Secure API key storage
- ✅ User session management
- ✅ Protected routes and features