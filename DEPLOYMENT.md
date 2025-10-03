# Production Deployment Guide

## 🚀 Vercel + Render Deployment

### 1. Vercel Configuration (Frontend)

The `vercel.json` file is already configured to handle React Router deep links:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

**Deploy to Vercel:**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. The `vercel.json` will automatically handle routing

### 2. Render Configuration (Backend)

#### Environment Variables Required:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartgate

# JWT Secret
JWT_SECRET=your_strong_jwt_secret_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Logging
LOG_LEVEL=info
NODE_ENV=production
```

#### Setting up Cloudinary:

1. Go to [Cloudinary.com](https://cloudinary.com) and create a free account
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your Render environment variables

#### Render Deployment Steps:

1. **Connect Repository**: Link your GitHub repo to Render
2. **Build Command**: `npm install`
3. **Start Command**: `node server.js`
4. **Environment Variables**: Add all the variables above
5. **Deploy**: Render will automatically deploy on git push

### 3. Logging in Production

#### Where to See Logs in Render:

1. **Render Dashboard**: Go to your service → "Logs" tab
2. **Real-time Logs**: You'll see all console output and Winston logs
3. **Log Files**: Winston creates daily rotating log files in the `logs/` directory

#### Log Types:

- **Application Logs**: `logs/application-YYYY-MM-DD.log`
- **Error Logs**: `logs/error-YYYY-MM-DD.log`
- **Console Output**: Visible in Render dashboard

#### Log Levels:

- `info`: General application flow
- `warn`: Warning messages
- `error`: Error messages
- `debug`: Detailed debugging (development only)

### 4. Image Uploads in Production

#### How It Works:

1. **Frontend**: User uploads image via form
2. **Backend**: Image temporarily stored, then uploaded to Cloudinary
3. **Database**: Cloudinary URL stored in MongoDB
4. **Access**: Images accessible via Cloudinary URLs

#### Benefits:

- ✅ **Permanent Storage**: Images survive server restarts
- ✅ **CDN Delivery**: Fast global image delivery
- ✅ **Automatic Optimization**: Images optimized for web
- ✅ **No Server Storage**: Reduces server disk usage

### 5. Testing Your Deployment

#### Frontend (Vercel):

- ✅ Navigate to `/products` directly in browser
- ✅ Refresh any page (should not show 404)
- ✅ All React Router links work

#### Backend (Render):

- ✅ Check logs in Render dashboard
- ✅ Test image upload via SMARTLOCK form
- ✅ Verify images appear in Cloudinary dashboard

### 6. Troubleshooting

#### Vercel 404 Issues:

- Ensure `vercel.json` is in the root directory
- Check that the rewrite rule excludes `/api/` paths
- Redeploy after making changes

#### Render Log Issues:

- Check environment variables are set correctly
- Look for Winston initialization errors in console
- Verify `logs/` directory permissions

#### Image Upload Issues:

- Verify Cloudinary credentials in Render environment
- Check Cloudinary dashboard for uploaded images
- Test with small images first (< 1MB)

### 7. Production Checklist

- [ ] Vercel deployment successful
- [ ] Render deployment successful
- [ ] Environment variables configured
- [ ] Cloudinary account set up
- [ ] Direct URL navigation works
- [ ] Image uploads work
- [ ] Logs are being written
- [ ] Database connection working

## 🔧 Development vs Production

| Feature          | Development      | Production            |
| ---------------- | ---------------- | --------------------- |
| **File Storage** | Local `/uploads` | Cloudinary            |
| **Logging**      | Console + Files  | Winston + Render Logs |
| **Routing**      | React Router     | Vercel rewrites       |
| **Database**     | Local MongoDB    | MongoDB Atlas         |

## 📞 Support

If you encounter issues:

1. Check Render logs first
2. Verify environment variables
3. Test Cloudinary connection
4. Check Vercel function logs
