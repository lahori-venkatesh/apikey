# 🎨 Frontend - API Key Management Platform

A modern, responsive React application for managing API keys with real-time monitoring and advanced analytics. Built with React 18, Tailwind CSS, and modern web technologies.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [💻 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔧 Components & Features](#-components--features)
- [🚀 Getting Started](#-getting-started)
- [🎨 Styling & Design](#-styling--design)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🧪 Testing](#-testing)
- [🚀 Build & Deployment](#-build--deployment)

## 🎯 Overview

The frontend is a single-page application (SPA) built with React that provides a comprehensive interface for API key management. It features a modern dashboard, real-time updates, responsive design, and intuitive user experience.

### Key Features
- 🎨 **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- 📱 **Responsive Design** - Mobile-first approach, works on all devices
- ⚡ **Real-time Updates** - WebSocket integration for live notifications
- 📊 **Interactive Charts** - Data visualization with Recharts
- 🔐 **Secure Authentication** - JWT-based auth with protected routes
- 🌙 **Dark/Light Mode** - Theme switching capability
- ♿ **Accessibility** - WCAG compliant components
- 🚀 **Performance** - Code splitting, lazy loading, and optimization

## 💻 Tech Stack

### Core Framework
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "react-scripts": "5.0.1"
}
```

### Styling & UI
```json
{
  "tailwindcss": "^3.3.5",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16"
}
```

### Data Visualization
```json
{
  "recharts": "^2.8.0"
}
```

### HTTP Client & Real-time
```json
{
  "axios": "^1.6.0",
  "socket.io-client": "^4.8.1"
}
```

### Testing
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/user-event": "^14.4.3"
}
```

## 🏗️ Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    App Component                            │
├─────────────────────────────────────────────────────────────┤
│  Router  │  Context Providers  │  Global State Management   │
├─────────────────────────────────────────────────────────────┤
│                    Layout Components                        │
├─────────────────────────────────────────────────────────────┤
│  Navbar  │  Sidebar  │  DashboardLayout  │  Footer         │
├─────────────────────────────────────────────────────────────┤
│                    Page Components                          │
├─────────────────────────────────────────────────────────────┤
│  Home  │  Dashboard  │  ApiKeys  │  Analytics  │  Profile   │
├─────────────────────────────────────────────────────────────┤
│                    Feature Components                       │
├─────────────────────────────────────────────────────────────┤
│  Forms  │  Charts  │  Modals  │  Tables  │  Notifications  │
└─────────────────────────────────────────────────────────────┘
```

### State Management Flow

```
User Action → Component → Custom Hook → API Service → 
Context Update → Component Re-render → UI Update
```

### Real-time Data Flow

```
WebSocket Event → WebSocket Context → Component Subscription → 
State Update → UI Refresh → User Notification
```

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── index.html                   # HTML template
│   ├── favicon.ico                  # App icon
│   ├── manifest.json               # PWA manifest
│   └── robots.txt                  # SEO robots file
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.js           # Top navigation bar
│   │   │   ├── Sidebar.js          # Dashboard sidebar
│   │   │   ├── DashboardLayout.js  # Main layout wrapper
│   │   │   └── Footer.js           # Footer component
│   │   ├── forms/                   # Form components
│   │   │   ├── CreateApiKeyModal.js # API key creation form
│   │   │   ├── EditApiKeyModal.js  # API key editing form
│   │   │   ├── LoginForm.js        # User login form
│   │   │   └── SignupForm.js       # User registration form
│   │   ├── charts/                  # Data visualization
│   │   │   ├── UsageChart.js       # Usage analytics chart
│   │   │   ├── PerformanceChart.js # Performance metrics
│   │   │   ├── TrendChart.js       # Trend analysis
│   │   │   └── PieChart.js         # Distribution charts
│   │   ├── tables/                  # Data tables
│   │   │   ├── ApiKeysTable.js     # API keys listing
│   │   │   ├── UsageTable.js       # Usage history table
│   │   │   └── DataTable.js        # Generic data table
│   │   ├── modals/                  # Modal dialogs
│   │   │   ├── ConfirmDialog.js    # Confirmation dialogs
│   │   │   ├── AlertModal.js       # Alert notifications
│   │   │   └── InfoModal.js        # Information modals
│   │   ├── notifications/           # Notification system
│   │   │   ├── Toast.js            # Toast notifications
│   │   │   ├── NotificationCenter.js # Notification hub
│   │   │   └── RealtimeNotifications.js # Live notifications
│   │   ├── cards/                   # Card components
│   │   │   ├── ApiKeyCard.js       # API key display card
│   │   │   ├── StatsCard.js        # Statistics card
│   │   │   └── DashboardCard.js    # Dashboard widgets
│   │   ├── buttons/                 # Button components
│   │   │   ├── PrimaryButton.js    # Primary action button
│   │   │   ├── SecondaryButton.js  # Secondary button
│   │   │   └── IconButton.js       # Icon-only button
│   │   ├── inputs/                  # Input components
│   │   │   ├── TextInput.js        # Text input field
│   │   │   ├── SelectInput.js      # Dropdown select
│   │   │   ├── SearchInput.js      # Search input with icon
│   │   │   └── PasswordInput.js    # Password input with toggle
│   │   ├── loading/                 # Loading components
│   │   │   ├── Spinner.js          # Loading spinner
│   │   │   ├── Skeleton.js         # Skeleton loader
│   │   │   └── ProgressBar.js      # Progress indicator
│   │   └── common/                  # Common components
│   │       ├── Badge.js            # Status badges
│   │       ├── Tooltip.js          # Tooltip component
│   │       ├── Dropdown.js         # Dropdown menu
│   │       └── Pagination.js       # Pagination component
│   ├── pages/                       # Page components
│   │   ├── public/                  # Public pages (no auth required)
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── About.js            # About page
│   │   │   ├── Features.js         # Features showcase
│   │   │   ├── Pricing.js          # Pricing plans
│   │   │   ├── Contact.js          # Contact page
│   │   │   └── NotFound.js         # 404 error page
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── Login.js            # User login page
│   │   │   ├── Signup.js           # User registration
│   │   │   ├── ForgotPassword.js   # Password reset request
│   │   │   ├── ResetPassword.js    # Password reset form
│   │   │   └── VerifyEmail.js      # Email verification
│   │   └── dashboard/               # Protected dashboard pages
│   │       ├── DashboardHome.js    # Main dashboard overview
│   │       ├── ApiKeysPage.js      # API key management
│   │       ├── AnalyticsPage.js    # Usage analytics
│   │       ├── MonitoringPage.js   # System monitoring
│   │       ├── BillingPage.js      # Billing & usage
│   │       ├── ProfilePage.js      # User profile settings
│   │       ├── SecurityPage.js     # Security settings
│   │       ├── TeamPage.js         # Team management
│   │       ├── IntegrationsPage.js # Third-party integrations
│   │       ├── HelpPage.js         # Help & support
│   │       └── SettingsPage.js     # Application settings
│   ├── contexts/                    # React contexts for state management
│   │   ├── AuthContext.js          # Authentication state
│   │   ├── ThemeContext.js         # Theme (dark/light mode)
│   │   ├── WebSocketContext.js     # WebSocket connection
│   │   ├── NotificationContext.js  # Notifications state
│   │   └── ApiKeyContext.js        # API keys state
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js              # Authentication hook
│   │   ├── useApi.js               # API calls hook
│   │   ├── useWebSocket.js         # WebSocket hook
│   │   ├── useLocalStorage.js      # Local storage hook
│   │   ├── useDebounce.js          # Debounce hook
│   │   ├── usePagination.js        # Pagination hook
│   │   ├── useSearch.js            # Search functionality
│   │   └── useTheme.js             # Theme switching hook
│   ├── services/                    # API and external services
│   │   ├── api.js                  # Base API configuration
│   │   ├── authService.js          # Authentication API calls
│   │   ├── apiKeyService.js        # API key management
│   │   ├── analyticsService.js     # Analytics data
│   │   ├── userService.js          # User profile operations
│   │   ├── billingService.js       # Billing operations
│   │   └── websocketService.js     # WebSocket management
│   ├── utils/                       # Utility functions
│   │   ├── constants.js            # Application constants
│   │   ├── helpers.js              # Helper functions
│   │   ├── formatters.js           # Data formatting utilities
│   │   ├── validators.js           # Form validation rules
│   │   ├── dateUtils.js            # Date manipulation
│   │   ├── storageUtils.js         # Local/session storage
│   │   └── errorHandlers.js        # Error handling utilities
│   ├── styles/                      # Global styles and themes
│   │   ├── globals.css             # Global CSS styles
│   │   ├── components.css          # Component-specific styles
│   │   ├── animations.css          # CSS animations
│   │   └── themes.css              # Theme variables
│   ├── assets/                      # Static assets
│   │   ├── images/                 # Image files
│   │   ├── icons/                  # Icon files
│   │   └── fonts/                  # Custom fonts
│   ├── App.js                       # Main application component
│   ├── App.css                      # App-specific styles
│   ├── index.js                     # Application entry point
│   └── index.css                    # Base styles
├── package.json                     # Dependencies and scripts
├── package-lock.json               # Dependency lock file
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── .env                            # Environment variables
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 🔧 Components & Features

### Layout Components

#### Navbar Component
```javascript
/**
 * Top navigation bar with user menu and notifications
 * Features: User avatar, notifications, theme toggle, logout
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
      {/* Navigation content */}
    </nav>
  );
};
```

#### Sidebar Component
```javascript
/**
 * Dashboard sidebar navigation
 * Features: Collapsible menu, active state, role-based visibility
 */
const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/api-keys', icon: KeyIcon, label: 'API Keys' },
    { path: '/analytics', icon: ChartIcon, label: 'Analytics' },
    // ... more items
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar content */}
    </aside>
  );
};
```

### Form Components

#### CreateApiKeyModal Component
```javascript
/**
 * Modal for creating new API keys
 * Features: Multi-step form, validation, encryption options
 */
const CreateApiKeyModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    apiKey: '',
    passphrase: '',
    environment: 'development',
    description: '',
    tags: []
  });

  const { createApiKey, isLoading } = useApiKeys();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createApiKey(formData);
      onSuccess();
      onClose();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </Modal>
  );
};
```

### Chart Components

#### UsageChart Component
```javascript
/**
 * Interactive usage analytics chart
 * Features: Time range selection, real-time updates, tooltips
 */
const UsageChart = ({ data, timeframe, onTimeframeChange }) => {
  const chartData = useMemo(() => {
    return processChartData(data, timeframe);
  }, [data, timeframe]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>API Usage Analytics</h3>
        <TimeframeSelector 
          value={timeframe} 
          onChange={onTimeframeChange} 
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#3B82F6" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="errors" 
            stroke="#EF4444" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### Custom Hooks

#### useAuth Hook
```javascript
/**
 * Authentication hook with login, logout, and user state
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token) {
      // Verify token and get user data
      authService.verifyToken(token)
        .then(setUser)
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return { user, login, logout, isLoading, isAuthenticated: !!user };
};
```

#### useWebSocket Hook
```javascript
/**
 * WebSocket hook for real-time communication
 */
const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const newSocket = io(process.env.REACT_APP_WS_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token]);

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  };

  return { socket, isConnected, emit, on };
};
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Backend API** running on port 8080

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

4. **Start development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080

# Application Settings
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DARK_MODE=true

# External Services (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_SENTRY_DSN=SENTRY_DSN_URL
```

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run dev           # Alternative development command

# Building
npm run build         # Create production build
npm run build:analyze # Build with bundle analyzer

# Testing
npm test              # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ci       # Run tests for CI/CD

# Linting & Formatting
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run format        # Format code with Prettier

# Type Checking (if using TypeScript)
npm run type-check    # Check TypeScript types
```

## 🎨 Styling & Design

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Design System

#### Color Palette
```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;
}
```

#### Typography Scale
```css
.text-xs { font-size: 0.75rem; }     /* 12px */
.text-sm { font-size: 0.875rem; }    /* 14px */
.text-base { font-size: 1rem; }      /* 16px */
.text-lg { font-size: 1.125rem; }    /* 18px */
.text-xl { font-size: 1.25rem; }     /* 20px */
.text-2xl { font-size: 1.5rem; }     /* 24px */
.text-3xl { font-size: 1.875rem; }   /* 30px */
```

#### Spacing System
```css
.space-1 { margin: 0.25rem; }   /* 4px */
.space-2 { margin: 0.5rem; }    /* 8px */
.space-4 { margin: 1rem; }      /* 16px */
.space-6 { margin: 1.5rem; }    /* 24px */
.space-8 { margin: 2rem; }      /* 32px */
```

### Component Styling Patterns

#### Button Variants
```javascript
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
};

const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  const variantClasses = buttonVariants[variant];
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## ⚡ Performance Optimizations

### Code Splitting & Lazy Loading

```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/dashboard/DashboardHome'));
const ApiKeysPage = lazy(() => import('./pages/dashboard/ApiKeysPage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));

// Component lazy loading with error boundary
const LazyComponent = ({ component: Component, fallback, ...props }) => (
  <Suspense fallback={fallback || <LoadingSpinner />}>
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  </Suspense>
);
```

### Memoization Strategies

```javascript
// Memoized expensive components
const ApiKeyCard = memo(({ apiKey, onUpdate, onDelete }) => {
  const handleUpdate = useCallback((updates) => {
    onUpdate(apiKey.id, updates);
  }, [apiKey.id, onUpdate]);

  const handleDelete = useCallback(() => {
    onDelete(apiKey.id);
  }, [apiKey.id, onDelete]);

  return (
    <div className="api-key-card">
      {/* Card content */}
    </div>
  );
});

// Memoized computed values
const useMemoizedStats = (data) => {
  return useMemo(() => {
    return {
      totalRequests: data.reduce((sum, item) => sum + item.requests, 0),
      averageResponseTime: data.reduce((sum, item) => sum + item.responseTime, 0) / data.length,
      errorRate: (data.filter(item => item.errors > 0).length / data.length) * 100
    };
  }, [data]);
};
```

### Virtual Scrolling for Large Lists

```javascript
// Virtual scrolling for large API key lists
const VirtualizedApiKeyList = ({ apiKeys }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const containerRef = useRef();

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = 80; // Height of each item
    const containerHeight = container.clientHeight;

    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 5, apiKeys.length);

    setVisibleRange({ start, end });
  }, [apiKeys.length]);

  const visibleItems = apiKeys.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      ref={containerRef}
      className="virtual-list"
      onScroll={handleScroll}
      style={{ height: '400px', overflowY: 'auto' }}
    >
      <div style={{ height: visibleRange.start * 80 }} />
      {visibleItems.map((apiKey, index) => (
        <ApiKeyCard 
          key={apiKey.id} 
          apiKey={apiKey}
          style={{ height: '80px' }}
        />
      ))}
      <div style={{ height: (apiKeys.length - visibleRange.end) * 80 }} />
    </div>
  );
};
```

### Image Optimization

```javascript
// Lazy loading images with intersection observer
const LazyImage = ({ src, alt, className, placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {!isLoaded && placeholder && (
        <div className="placeholder">{placeholder}</div>
      )}
    </div>
  );
};
```

## 🧪 Testing

### Testing Strategy

#### Unit Tests
```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApiKeyCard from '../components/cards/ApiKeyCard';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ApiKeyCard', () => {
  const mockApiKey = {
    id: '1',
    name: 'Test API Key',
    service: 'OpenAI',
    status: 'active',
    environment: 'development',
    lastUsed: '2024-01-15T10:30:00Z',
    usageCount: 150
  };

  it('renders API key information correctly', () => {
    renderWithRouter(
      <ApiKeyCard apiKey={mockApiKey} />
    );

    expect(screen.getByText('Test API Key')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('calls onUpdate when edit button is clicked', async () => {
    const mockOnUpdate = jest.fn();
    
    renderWithRouter(
      <ApiKeyCard apiKey={mockApiKey} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(mockApiKey.id);
    });
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    const mockOnDelete = jest.fn();
    
    renderWithRouter(
      <ApiKeyCard apiKey={mockApiKey} onDelete={mockOnDelete} />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });
});
```

#### Hook Testing
```javascript
// Custom hook testing
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

jest.mock('../services/authService');

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should login user successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockResponse = { user: mockUser, token: 'mock-token' };
    
    authService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('mock-token');
  });

  it('should logout user and clear storage', () => {
    localStorage.setItem('token', 'mock-token');
    
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
```

#### Integration Tests
```javascript
// Integration testing with MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token'
      })
    );
  }),
  rest.get('/api/keys', (req, res, ctx) => {
    return res(
      ctx.json({
        keys: [
          {
            id: '1',
            name: 'Test Key',
            service: 'OpenAI',
            status: 'active'
          }
        ],
        pagination: { page: 1, total: 1, pages: 1 }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Integration', () => {
  it('should complete login flow and show dashboard', async () => {
    const user = userEvent.setup();
    
    render(<App />);

    // Navigate to login
    await user.click(screen.getByRole('link', { name: /login/i }));

    // Fill login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Should show API keys
    await waitFor(() => {
      expect(screen.getByText('Test Key')).toBeInTheDocument();
    });
  });
});
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.stories.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Setup Tests
```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🚀 Build & Deployment

### Build Configuration

#### Production Build
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run build:analyze

# Build with specific environment
REACT_APP_ENV=production npm run build
```

#### Build Optimization
```javascript
// webpack.config.js (if ejected)
const path = require('path');

module.exports = {
  // ... other config
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};
```

### Deployment Options

#### Static Hosting (Netlify/Vercel)
```bash
# Build and deploy to Netlify
npm run build
netlify deploy --prod --dir=build

# Deploy to Vercel
npm run build
vercel --prod
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### Environment-Specific Builds

#### Development
```json
{
  "scripts": {
    "start": "react-scripts start",
    "dev": "REACT_APP_ENV=development react-scripts start"
  }
}
```

#### Staging
```json
{
  "scripts": {
    "build:staging": "REACT_APP_ENV=staging react-scripts build"
  }
}
```

#### Production
```json
{
  "scripts": {
    "build:prod": "REACT_APP_ENV=production react-scripts build"
  }
}
```

### Performance Monitoring

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.js'
```

## 📈 Performance Metrics

### Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Size Targets
- **Initial Bundle**: < 250KB gzipped
- **Vendor Bundle**: < 500KB gzipped
- **Total Bundle**: < 1MB gzipped

### Optimization Checklist
- ✅ Code splitting implemented
- ✅ Lazy loading for routes and components
- ✅ Image optimization and lazy loading
- ✅ Memoization for expensive operations
- ✅ Virtual scrolling for large lists
- ✅ Service worker for caching
- ✅ Preloading critical resources
- ✅ Tree shaking enabled

---

**Built with ❤️ using React and modern web technologies** - A responsive, performant frontend for secure API key management.