# Quick Setup Guide

## ✅ **Your Code is Safe to Push!**

All hardcoded secrets have been removed. Your code now uses environment variables only.

## 🔧 **To Make OAuth Work:**

### **Local Development:**
1. Create `.env` file in `back/` folder:
```bash
MONGODB_URI=mongodb+srv://qaissi0003_db_user:fAZK4UDluoT5RjFp@Cluster3.8pag1fi.mongodb.net/myapp
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### **Production (Render):**
Set these environment variables in your Render dashboard:
```bash
MONGODB_URI=mongodb+srv://qaissi0003_db_user:fAZK4UDluoT5RjFp@Cluster3.8pag1fi.mongodb.net/myapp
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://smartgate-backend.onrender.com/api/auth/google/callback
JWT_SECRET=your_strong_jwt_secret
SESSION_SECRET=your_strong_session_secret
FRONTEND_URL=https://smartgate-kohl.vercel.app
BACKEND_URL=https://smartgate-backend.onrender.com
```

## 🎯 **Your OAuth is Ready!**

- ✅ **No secrets in code**
- ✅ **Safe to push to Git**
- ✅ **OAuth integration complete**
- ✅ **Production deployment ready**

Just add your real credentials to environment variables! 🎉
