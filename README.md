# 🏠 Smart Gate - Advanced Smart Lock Management System

## 🚀 Overview

Smart Gate is a cutting-edge smart lock management platform that revolutionizes home security through advanced technology. Built with modern web technologies and integrated with cloud services, it provides a seamless experience for users, administrators, and businesses.

### 🎯 **Key Highlights**

- **Multi-Language Support** - Hebrew, English, Arabic with real-time translation
- **Google OAuth Integration** - Seamless authentication with Google accounts
- **Mobile-Ready** - Responsive design with React Native wrapper
- **Admin Dashboard** - Complete user and product management system
- **Cloud Integration** - MongoDB Atlas database with Cloudinary image storage
- **E-Commerce Platform** - Full shopping cart and product management

---

## 🔐 Authentication & Security

### **Google OAuth 2.0 Integration**

- Seamless login with Google accounts
- JWT token-based authentication
- Automatic session management
- Password reset via email
- Multi-factor authentication support

### **User Management**

- **Role-Based Access Control** - Admin, Business, and Regular users
- **Profile Management** - Edit personal information and change passwords
- **Session Security** - Automatic expiration with user notifications
- **Account Protection** - Password strength validation and lockout protection

---

## 🛡️ Admin Panel

### **User Management**

- View, edit, and delete users with admin password protection
- Bulk user operations and role management
- User activity monitoring and analytics
- Account security oversight

### **Product Management**

- Complete CRUD operations for smart lock products
- Bulk import/export capabilities
- Image management with Cloudinary integration
- Inventory tracking and price management

### **Analytics Dashboard**

- User activity tracking and login patterns
- Sales analytics and revenue metrics
- System performance monitoring
- Security event logging

---

## 🌐 Multi-Language Support

### **Supported Languages**

- **Hebrew (עברית)** - Default language with RTL support
- **English** - Full LTR translation
- **Arabic (العربية)** - RTL support with proper text direction

### **Features**

- Real-time language switching without page reload
- Contextual translations for all UI elements
- Currency formatting in Israeli Shekels (₪)
- Locale-specific date and time formatting

---

## 📱 Mobile Application

### **React Native Wrapper**

- Cross-platform mobile app for iOS and Android
- Offline capabilities with cached data
- Push notifications for security alerts
- Biometric authentication support
- Mobile-optimized touch interface

### **Mobile Features**

- Offline product browsing
- Real-time security notifications
- Camera integration for QR code scanning
- Location services for store locator

---

## 🛒 E-Commerce Platform

### **Product Catalog**

- Advanced smart lock product showcase
- Multi-criteria search and filtering
- Product comparison and recommendations
- High-quality images with Cloudinary integration

### **Shopping Experience**

- Persistent shopping cart across sessions
- Wishlist and favorites system
- Guest checkout option
- Order tracking and management

### **Payment Integration**

- Multiple payment methods support
- Secure payment processing
- Order confirmation and receipts
- Invoice generation

---

## 📁 Project Structure

```
smart-gate/
├── 📁 back/                          # Backend Server (Node.js + Express)
│   ├── 📁 config/                    # Configuration files
│   │   ├── db.js                    # Database connection
│   │   └── passport.js               # Google OAuth configuration
│   ├── 📁 controllers/               # API Controllers
│   │   ├── adminController.js       # Admin operations
│   │   ├── authController.js        # Authentication logic
│   │   ├── productController.js     # Product management
│   │   ├── userController.js        # User management
│   │   └── favoritesController.js   # Favorites system
│   ├── 📁 models/                    # Database Models (MongoDB)
│   │   ├── User.js                  # User schema
│   │   ├── Product.js               # Product schema
│   │   ├── CustomerMessage.js       # Contact messages
│   │   └── Lead.js                  # Lead management
│   ├── 📁 routes/                    # API Routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── products.js              # Product routes
│   │   ├── admin.js                 # Admin routes
│   │   └── user.js                  # User routes
│   ├── 📁 middleware/                # Custom middleware
│   │   └── auth.js                  # JWT authentication
│   ├── 📁 utils/                      # Utility functions
│   │   ├── cloudinary.js            # Image upload service
│   │   ├── emailService.js          # Email notifications
│   │   └── logger.js                # Logging system
│   ├── 📁 public/images/             # Static images
│   │   └── productsImages/          # Product photos
│   ├── 📁 logs/                       # Application logs
│   └── server.js                    # Main server file
│
├── 📁 front/                         # Frontend Application (React + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 components/            # React Components
│   │   │   ├── 📁 auth/              # Authentication components
│   │   │   │   ├── AuthModal.tsx     # Login/Register modal
│   │   │   │   ├── LoginForm.tsx     # Login form
│   │   │   │   ├── RegisterForm.tsx # Registration form
│   │   │   │   └── OAuthButtons.tsx # Google OAuth buttons
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── Footer.tsx            # Footer component
│   │   │   ├── ProductCard.tsx      # Product display card
│   │   │   └── CouponBar.tsx         # Promotional banner
│   │   ├── 📁 pages/                 # Application Pages
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Products.tsx         # Product catalog
│   │   │   ├── ProductDetail.tsx    # Product details
│   │   │   ├── Cart.tsx             # Shopping cart
│   │   │   ├── Favorites.tsx        # User favorites
│   │   │   ├── Admin.tsx            # Admin dashboard
│   │   │   ├── UserProfile.tsx      # User profile
│   │   │   └── Contact.tsx           # Contact page
│   │   ├── 📁 services/              # API Services
│   │   │   ├── http.ts              # HTTP client
│   │   │   ├── authService.ts       # Authentication API
│   │   │   ├── productService.ts    # Product API
│   │   │   ├── cartService.ts       # Shopping cart API
│   │   │   └── oauthService.ts      # OAuth integration
│   │   ├── 📁 locales/               # Multi-language support
│   │   │   ├── he.json              # Hebrew translations
│   │   │   ├── en.json              # English translations
│   │   │   └── ar.json              # Arabic translations
│   │   ├── 📁 types/                 # TypeScript definitions
│   │   │   ├── auth.ts              # Authentication types
│   │   │   └── product.ts           # Product types
│   │   ├── 📁 providers/             # React Context providers
│   │   │   └── SettingsProvider.tsx # App settings & theme
│   │   └── App.tsx                   # Main application
│   └── package.json                 # Frontend dependencies
│
├── 📁 mobile-app/                    # Mobile Application (React Native)
│   ├── 📁 android/                   # Android build files
│   ├── 📁 ios/                       # iOS build files
│   ├── 📁 www/                       # Web build for mobile
│   └── capacitor.config.json         # Mobile app configuration
│
├── 📄 README.md                      # Project documentation
├── 📄 ENVIRONMENT_SETUP.md           # Environment configuration
├── 📄 GOOGLE_OAUTH_SETUP.md          # OAuth setup guide
├── 📄 MOBILE_APP_WRAPPER_GUIDE.md    # Mobile app guide
└── 📄 VERCEL_DEPLOYMENT_FIX.md       # Deployment guide
```

### 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Gate Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)     │  Backend (Node.js)     │
│  ┌─────────────────────────────┐   │  ┌─────────────────┐   │
│  │ • React 18 Components       │   │  │ • Express.js    │   │
│  │ • Material-UI Design        │   │  │ • JWT Auth      │   │
│  │ • TypeScript Safety         │   │  │ • Google OAuth  │   │
│  │ • Multi-language Support    │   │  │ • API Routes    │   │
│  │ • Responsive Design         │   │  │ • Middleware    │   │
│  └─────────────────────────────┘   │  └─────────────────┘   │
│           │                        │           │           │
│           └────────────────────────┼───────────┘           │
│                                    │                       │
│  ┌─────────────────────────────────┼─────────────────────┐ │
│  │           Cloud Services         │                     │ │
│  │  ┌─────────────┐ ┌─────────────┐ │ ┌─────────────────┐ │ │
│  │  │ MongoDB     │ │ Cloudinary │ │ │ Google OAuth    │ │ │
│  │  │ Atlas       │ │ Images     │ │ │ Authentication  │ │ │
│  │  │ Database    │ │ Storage    │ │ │ Service         │ │ │
│  │  └─────────────┘ └─────────────┘ │ └─────────────────┘ │ │
│  └─────────────────────────────────┼─────────────────────┘ │
│                                    │                       │
│  ┌─────────────────────────────────┼─────────────────────┐ │
│  │         Deployment               │                     │ │
│  │  ┌─────────────┐ ┌─────────────┐ │ ┌─────────────────┐ │ │
│  │  │ Vercel.com  │ │ Render.com  │ │ │ Mobile App     │ │ │
│  │  │ Frontend    │ │ Backend     │ │ │ React Native   │ │ │
│  │  │ Hosting     │ │ Hosting     │ │ │ iOS/Android    │ │ │
│  │  └─────────────┘ └─────────────┘ │ └─────────────────┘ │ │
│  └─────────────────────────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Technical Architecture

### **Backend Technology**

- **Node.js & Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud database with automatic scaling
- **JWT Authentication** - Secure token-based auth
- **Google OAuth 2.0** - Social authentication
- **Cloudinary** - Image storage and optimization

### **Frontend Technology**

- **React 18** - Modern component-based UI
- **TypeScript** - Type-safe development
- **Material-UI** - Professional design system
- **Vite** - Fast build tool and development server

### **Cloud Services**

- **MongoDB Atlas** - Database hosting and management
- **Cloudinary** - Image storage, optimization, and CDN
- **Render.com** - Backend hosting and deployment
- **Vercel.com** - Frontend hosting and deployment

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console account
- Cloudinary account
- Git


## 🔧 Environment Configuration

### **Backend Environment Variables**

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartgate
DB_NAME=smartgate

# Server
PORT=5000
NODE_ENV=production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.com/api/auth/google/callback

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# URLs
FRONTEND_URL=https://your-frontend-url.com
BACKEND_URL=https://your-backend-url.com
```

### **Frontend Environment Variables**

```env
# API Configuration
VITE_API_BASE=https://your-backend-url.com
VITE_API_URL=https://your-backend-url.com/api
VITE_FRONTEND_URL=https://your-frontend-url.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App Configuration
VITE_APP_NAME=Smart Gate
VITE_APP_VERSION=1.0.0
```

---

## 📦 Deployment

### **Backend Deployment (Render.com)**

1. Connect GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables
5. Deploy automatically on git push

### **Frontend Deployment (Vercel.com)**

1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables
5. Deploy automatically on git push

### **Database Setup (MongoDB Atlas)**

1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access
4. Create database user
5. Get connection string and update MONGODB_URI

### **Image Storage (Cloudinary)**

1. Create Cloudinary account
2. Get cloud name, API key, and API secret
3. Configure upload presets
4. Update environment variables

---

## 🛡️ Security Features

### **Authentication Security**

- JWT tokens with automatic refresh
- Password hashing with bcrypt
- Session management with expiration
- Rate limiting and CORS protection

### **Data Protection**

- Input validation and sanitization
- SQL injection prevention
- XSS protection with CSP headers
- CSRF protection
- Data encryption at rest

### **Admin Security**

- Role-based access control
- Admin password protection for sensitive operations
- Audit logging for all admin actions
- IP whitelisting (optional)

---

## 📊 Performance & Monitoring

### **Performance Optimizations**

- Image optimization with Cloudinary
- Lazy loading for components
- Caching strategy with Redis
- CDN integration for static assets
- Database indexing optimization

### **Monitoring & Analytics**

- Error tracking and logging
- Performance metrics monitoring
- User analytics and usage patterns
- Security event monitoring

---

## 🤝 Contributing

### **Development Workflow**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Standards**

- TypeScript with strict type checking
- ESLint for code quality
- Prettier for code formatting
- Conventional commit messages

---

## 📞 Support & Contact

### **Technical Support**

- **Email**: support@smartgate.com
- **Documentation**: [docs.smartgate.com](https://docs.smartgate.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/smart-gate/issues)

### **Business Inquiries**

- **Email**: business@smartgate.com
- **Phone**: +972-XX-XXXXXXX
- **Address**: Tel Aviv, Israel

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ in Israel**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Made with MongoDB](https://img.shields.io/badge/Made%20with-MongoDB-47a248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)

</div>
