# Authentication Setup Guide

This guide explains how to set up both email/password authentication and Google OAuth in your API Key Management Platform.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:8080`

### 2. Start the Frontend Server
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

## 🔐 Authentication Methods

### Email/Password Authentication
✅ **Already Working** - Users can:
- Sign up with email, name, and password
- Log in with email and password
- Passwords are securely hashed with bcrypt
- JWT tokens for session management

### Google OAuth Authentication
🔧 **Setup Required** - Two options:

#### Option 1: Use Demo Mode (No Setup Required)
- Click "Demo: Sign in with Google" button
- Creates a test Google user automatically
- Perfect for development and testing

#### Option 2: Real Google OAuth Setup
1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`

4. **Update Environment Variables**
   ```bash
   # In frontend/.env
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

## 🧪 Testing Authentication

### Test Email/Password Auth:
1. Go to `/signup`
2. Create account with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Log in with the same credentials

### Test Google Auth (Demo):
1. Go to `/login` or `/signup`
2. Click "Demo: Sign in with Google"
3. Automatically creates and logs in a Google user

### Test API Key Management:
1. After logging in, go to dashboard
2. Click "Add API Key"
3. Add up to 5 API keys (free limit)
4. Test different services (OpenAI, Anthropic, etc.)

## 🔧 Backend API Endpoints

### Authentication Endpoints:
- `POST /api/auth/register` - Email/password signup
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

### API Key Endpoints:
- `GET /api/keys` - Get user's API keys
- `POST /api/keys` - Create new API key
- `PUT /api/keys/:id` - Update API key
- `DELETE /api/keys/:id` - Delete API key
- `POST /api/keys/:id/regenerate` - Regenerate API key

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **API Key Encryption**: AES-256 encryption for stored keys
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend domain only

## 📁 Project Structure

```
├── backend/
│   ├── routes/auth.js          # Authentication routes
│   ├── routes/keys.js          # API key management
│   ├── middleware/auth.js      # JWT authentication middleware
│   ├── services/
│   │   ├── jwtService.js       # JWT token management
│   │   └── encryptionService.js # API key encryption
│   └── temp-storage.js         # In-memory data storage
├── frontend/
│   ├── src/pages/
│   │   ├── Login.js            # Login page with both auth methods
│   │   ├── Signup.js           # Signup page with both auth methods
│   │   └── Dashboard.js        # Protected dashboard
│   └── .env                    # Environment variables
└── AUTHENTICATION_SETUP.md     # This file
```

## 🚨 Production Considerations

### For Production Deployment:
1. **Replace temp-storage** with MongoDB/PostgreSQL
2. **Set up real Google OAuth** credentials
3. **Use environment variables** for all secrets
4. **Enable HTTPS** for secure authentication
5. **Set up proper CORS** for your domain
6. **Add rate limiting** and security headers
7. **Implement password reset** functionality
8. **Add email verification** for new accounts

### Environment Variables Needed:
```bash
# Backend (.env)
JWT_SECRET=your-super-secret-jwt-key
AES_SECRET=your-aes-encryption-key
MONGODB_URI=mongodb://localhost:27017/apikey_management
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend (.env)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_API_URL=https://your-api-domain.com
```

## 🎯 Current Status

✅ **Working Features:**
- Email/password registration and login
- Google OAuth (demo mode)
- JWT authentication
- API key storage and management
- User session management
- Protected routes
- 5-key limit for free users

🔄 **Ready for Production:**
- Replace in-memory storage with database
- Set up real Google OAuth credentials
- Deploy to production servers
- Add additional security measures

## 🆘 Troubleshooting

### Common Issues:

1. **"No token found" error**
   - Make sure you're logged in
   - Check if token exists in localStorage
   - Try logging in again

2. **Google OAuth not working**
   - Use the "Demo" button for testing
   - Check Google Client ID in .env file
   - Verify Google Cloud Console setup

3. **API key creation fails**
   - Ensure you're authenticated
   - Check if you've reached the 5-key limit
   - Verify backend server is running

4. **CORS errors**
   - Make sure backend is running on port 8080
   - Check proxy setting in frontend package.json
   - Verify CORS configuration in backend

Need help? Check the console logs for detailed error messages!