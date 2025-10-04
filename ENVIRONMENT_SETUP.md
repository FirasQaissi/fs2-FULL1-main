# Environment Variables Setup Guide

## 🔒 **SECURE ENVIRONMENT VARIABLES**

Your `.env` file contains sensitive secrets and should NEVER be pushed to GitHub. Here's how to set up your environment variables securely:

## 📋 **Your Current .env File (Local Only)**

Keep this file local and never commit it:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT & Session
JWT_SECRET=your_long_secret
SESSION_SECRET=your_session_secret

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Optional
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

## 🚀 **Production Environment Variables**

### **Backend (Render Dashboard)**

Go to your Render dashboard and add these environment variables:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT & Session
JWT_SECRET=your_long_secret
SESSION_SECRET=your_session_secret

# URLs
FRONTEND_URL=https://smartgate-kohl.vercel.app
BACKEND_URL=https://smartgate-backend.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://smartgate-backend.onrender.com/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Optional
NODE_ENV=production
ALLOWED_ORIGINS=https://smartgate-kohl.vercel.app
```

### **Frontend (Vercel Dashboard)**

Go to your Vercel dashboard and add these environment variables:

```bash
# API Configuration
VITE_API_URL=https://smartgate-backend.onrender.com
VITE_FRONTEND_URL=https://smartgate-kohl.vercel.app
```

## 🔧 **Google OAuth Provider Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create OAuth 2.0 Credentials**:
   - Application type: Web application
   - Name: SmartGate OAuth
3. **Add Authorized Redirect URIs**:
   ```
   Development: http://localhost:3000/api/auth/google/callback
   Production:  https://smartgate-backend.onrender.com/api/auth/google/callback
   ```

## ✅ **Security Best Practices**

- ✅ **Never commit `.env` files to Git**
- ✅ **Use environment variables in production**
- ✅ **Keep secrets secure and private**
- ✅ **Use different secrets for development and production**

## 🎯 **Your Code is Safe**

- ✅ **All OAuth code is pushed to GitHub**
- ✅ **`.env` files are ignored by Git**
- ✅ **Secrets are kept local only**
- ✅ **Production deployment ready**

Your Google OAuth integration is complete and secure! 🎉
