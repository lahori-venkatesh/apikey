# API Key Management Platform

A secure web platform for storing, managing, and tracking API keys across multiple services with automated rotation capabilities.

## Features

- 🔑 **Secure API Key Storage** - AES-256 encrypted storage with user-scoped access
- 🔄 **Automated Key Rotation** - Scheduled rotation with configurable intervals
- 📊 **Real-time Analytics** - Usage tracking, rate limiting, and performance metrics
- 🚨 **Smart Monitoring** - Alerts for usage spikes, failures, and security events
- 👤 **User Authentication** - JWT-based secure authentication system
- 🎨 **Modern Dashboard** - Responsive React interface with Tailwind CSS
- 💳 **Subscription Management** - Tiered pricing with usage quotas
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication & session management
- **bcrypt** for password hashing
- **AES-256** encryption for API key security
- **node-cron** for automated rotation scheduling

### Frontend
- **React 18** with functional components & hooks
- **React Router** for client-side navigation
- **Tailwind CSS** for modern, responsive styling
- **Recharts** for analytics visualization
- **Axios** for API communication
- **Context API** for state management

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** 5.0+ (local or cloud)
- **Git** for version control

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd api-key-management-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

4. **Database Setup**
- Ensure MongoDB is running on `localhost:27017`
- Or update the connection string in `backend/config/database.js`
- Database and collections will be created automatically

### Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apikey-management
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key
NODE_ENV=development
```

## Project Structure

```
├── backend/                    # Node.js Express backend
│   ├── config/                # Database and app configuration
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware (auth, validation)
│   ├── models/               # MongoDB schemas (User, ApiKey, Usage)
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions (encryption, etc.)
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express server entry point
├── frontend/                  # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.js     # Navigation with user profile
│   │   │   ├── Sidebar.js    # Dashboard navigation
│   │   │   └── DashboardLayout.js # Main layout wrapper
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js       # Landing page
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   ├── Login.js      # Authentication
│   │   │   ├── Signup.js     # User registration
│   │   │   └── Pricing.js    # Subscription plans
│   │   ├── services/         # API communication
│   │   ├── utils/            # Helper functions
│   │   └── App.js            # Main app component
│   └── package.json          # Frontend dependencies
├── .kiro/                    # Kiro IDE configuration
│   └── specs/                # Project specifications
└── README.md                 # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with email/password
- `POST /api/auth/login` - User login with JWT token response
- `POST /api/auth/logout` - User logout (token invalidation)

### API Key Management
- `GET /api/keys` - List user's API keys with metadata
- `POST /api/keys` - Create new API key with service configuration
- `PUT /api/keys/{id}` - Update API key settings
- `DELETE /api/keys/{id}` - Delete API key (secure removal)
- `POST /api/keys/{id}/rotate` - Manual key rotation

### Usage Analytics
- `POST /api/usage/{keyId}` - Record API usage event
- `GET /api/usage/{keyId}` - Get usage statistics and trends
- `GET /api/usage/{keyId}/analytics` - Detailed analytics dashboard data

### Rotation Management
- `GET /api/rotation` - List rotation schedules
- `POST /api/rotation` - Create rotation schedule
- `PUT /api/rotation/{id}` - Update rotation settings
- `DELETE /api/rotation/{id}` - Remove rotation schedule

### Monitoring & Alerts
- `GET /api/monitoring` - System health and key status
- `POST /api/alerts` - Configure usage alerts
- `GET /api/alerts` - List active alerts

### Subscription Management
- `GET /api/subscriptions` - Current subscription details
- `POST /api/subscriptions/upgrade` - Upgrade to Pro plan
- `GET /api/subscriptions/usage` - Current usage vs limits

## Security Features

- **Password Security** - BCrypt hashing with salt rounds
- **API Key Encryption** - AES-256 encryption for stored keys
- **JWT Authentication** - Secure token-based session management
- **User Isolation** - Strict user-scoped data access
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - API endpoint protection
- **HTTPS Enforcement** - Secure data transmission
- **Audit Logging** - Security event tracking

## Current Implementation Status

### ✅ Completed Features
- **User Authentication** - Login/Signup with JWT
- **Responsive UI** - Modern React dashboard with Tailwind CSS
- **Navigation System** - Navbar with user profile, sidebar navigation
- **Landing Pages** - Home, Features, Pricing pages
- **Dashboard Layout** - Professional admin interface
- **User Profile** - Dynamic user data display in navbar
- **Routing** - Complete navigation flow between pages

### 🚧 In Development
- API Key CRUD operations
- Usage tracking and analytics
- Automated rotation scheduling
- Monitoring and alerting system
- Subscription management backend

### 📋 Planned Features
- Advanced analytics dashboard
- Multi-service API key support
- Team collaboration features
- Advanced security monitoring
- Mobile app companion

## Development

### Running in Development Mode
```bash
# Start backend (runs on http://localhost:5000)
cd backend && npm run dev

# Start frontend (runs on http://localhost:3000)
cd frontend && npm start
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational and portfolio 