# APIKey Pro - Frontend

A modern, responsive React application for API key management with enterprise-grade security features.

## 🚀 Features

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Clean, accessible interface
- **Dark Mode Ready**: Prepared for future dark mode implementation
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading indicators and skeleton screens

### 🔐 Authentication
- **Secure Login/Signup**: JWT-based authentication
- **Social Login Ready**: Google and GitHub integration prepared
- **Protected Routes**: Automatic redirection based on auth state
- **Token Management**: Automatic token refresh and validation

### 📊 Dashboard Features
- **API Key Management**: Create, view, and delete API keys
- **Usage Analytics**: Real-time statistics and metrics
- **Copy to Clipboard**: One-click API key copying
- **Search & Filter**: Find keys quickly (ready for implementation)
- **Bulk Operations**: Multi-select actions (ready for implementation)

### 📱 Pages Included
- **Landing Page**: Hero section with features and benefits
- **Features Page**: Detailed feature explanations with examples
- **Pricing Page**: Flexible pricing tiers with annual discounts
- **Authentication**: Login and signup with validation
- **Dashboard**: Complete API key management interface
- **404 Page**: User-friendly error handling

## 🛠 Tech Stack

- **React 18**: Latest React with hooks and concurrent features
- **React Router v6**: Modern routing with nested routes
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management for authentication and notifications
- **Fetch API**: HTTP client for backend communication

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.js       # Site footer
│   ├── Navbar.js       # Navigation bar
│   ├── Toast.js        # Notification component
│   └── LoadingSpinner.js # Loading indicator
├── contexts/           # React contexts
│   └── ToastContext.js # Toast notification management
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Features.js     # Features showcase
│   ├── Pricing.js      # Pricing plans
│   ├── Login.js        # User login
│   ├── Signup.js       # User registration
│   ├── Dashboard.js    # Main dashboard
│   └── NotFound.js     # 404 error page
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Error**: Red (#dc2626)
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Monospace font for API keys and code snippets

### Components
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean input fields with validation states
- **Cards**: Subtle shadows with hover effects
- **Modals**: Centered overlays with backdrop blur

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
```

### Proxy Configuration
The `package.json` includes a proxy configuration for development:

```json
{
  "proxy": "http://localhost:8080"
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key mobile optimizations:
- Touch-friendly buttons and inputs
- Collapsible navigation menu
- Optimized typography scaling
- Gesture-friendly interactions

## 🔒 Security Features

- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based requests
- **Secure Headers**: Content Security Policy ready
- **Input Validation**: Client-side validation with server verification
- **Secure Storage**: JWT tokens in localStorage with expiration

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Responsive images with proper formats
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Service worker ready for PWA features
- **Minification**: Production builds are minified and optimized

## 🔄 State Management

### Authentication State
- User authentication status
- JWT token management
- Automatic token refresh
- Route protection

### Toast Notifications
- Success, error, warning, and info messages
- Auto-dismiss with configurable duration
- Queue management for multiple toasts
- Accessible notifications

## 🎨 Customization

### Tailwind Configuration
Extend the default Tailwind config in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Custom CSS Classes
Add custom utilities in `src/index.css`:

```css
.btn-brand {
  @apply bg-brand-500 text-white hover:bg-brand-600;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Proxy not working**: Ensure backend is running on port 8080
2. **Build fails**: Check for TypeScript errors or missing dependencies
3. **Styles not loading**: Verify Tailwind CSS is properly configured
4. **API calls failing**: Check CORS configuration on backend

### Debug Mode
Enable debug logging:

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@apikeypro.com
- Documentation: https://docs.apikeypro.com

---

Built with ❤️ using React and Tailwind CSS