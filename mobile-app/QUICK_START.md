# 🚀 Quick Start Guide

Get your mobile app up and running in 5 minutes!

---

## Step 1: Update Website URL (Required)

Open `www/index.html` and find this line:

```javascript
const WEBSITE_URL = "YOUR_WEBSITE_URL_HERE";
```

Replace with your actual website:

```javascript
const WEBSITE_URL = "https://your-actual-website.com";
```

**Example:**

```javascript
const WEBSITE_URL = "https://myapp.vercel.app";
```

---

## Step 2: Update App Details (Required)

Open `capacitor.config.json` and update:

```json
{
  "appId": "com.mycompany.myapp",      // Your unique bundle ID
  "appName": "My App Name",            // Your app's display name
  ...
}
```

**Important:**

- Bundle ID must be unique (reverse domain format)
- Can't change after publishing to stores

---

## Step 3: Sync Changes

Run this command:

```bash
cd mobile-app
npm run sync
```

---

## Step 4: Build Your App

### For Android (Windows/Mac/Linux)

1. **Open in Android Studio:**

```bash
npm run open:android
```

2. **Wait for Gradle sync** (first time takes a few minutes)

3. **Build APK:**

   - Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK saved to: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install on Android device:**
   - Transfer APK to phone
   - Enable "Install from Unknown Sources"
   - Install and test!

### For iOS (Mac only)

1. **Open in Xcode:**

```bash
npm run open:ios
```

2. **Select a simulator** or connect real device

3. **Click Run (▶️)**

4. **App launches** - test it!

---

## Step 5: Test Your App ✅

- [ ] App launches successfully
- [ ] Website loads correctly
- [ ] All pages/features work
- [ ] Responsive on mobile screen
- [ ] Works offline (shows error)
- [ ] Back button works (Android)

---

## Next Steps

### Ready for Production?

1. **Add app icons and splash screens**

   - See [ICONS_AND_SPLASH.md](ICONS_AND_SPLASH.md)

2. **Build signed release**

   - See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

3. **Publish to app stores**
   - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Common Issues

### ❌ Website doesn't load

**Solution:** Check that:

- Website URL is correct
- Website uses HTTPS (required)
- Internet connection is active

### ❌ Gradle sync failed (Android)

**Solution:**

- Install Java JDK 11+
- Update Android Studio
- Click "Sync Project with Gradle Files"

### ❌ Build failed (iOS)

**Solution:**

- Run `pod install` in `ios/App/`
- Clean build folder: `Product` → `Clean Build Folder`
- Restart Xcode

### ❌ App crashes on launch

**Solution:**

- Check browser console for errors
- Verify website URL is accessible
- Look at Android Logcat or Xcode console

---

## Quick Commands

```bash
# Sync changes to native projects
npm run sync

# Open Android Studio
npm run open:android

# Open Xcode
npm run open:ios

# Copy web assets only
npm run copy

# Update Capacitor
npm run update
```

---

## File Structure

```
mobile-app/
├── www/
│   └── index.html          ← Update website URL here
├── android/                ← Android project
├── ios/                    ← iOS project
├── capacitor.config.json   ← Update app details here
└── package.json
```

---

## Need More Help?

📖 **Full documentation:**

- [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) - Detailed build steps
- [APP_CONFIG.md](APP_CONFIG.md) - All configuration options
- [ICONS_AND_SPLASH.md](ICONS_AND_SPLASH.md) - Add icons
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Publish to stores

🌐 **Online resources:**

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developers](https://developer.android.com)
- [iOS Developers](https://developer.apple.com)

---

## That's it! 🎉

You now have a mobile app that wraps your website.

**What you have:**
✅ Android app (can build on Windows/Mac/Linux)
✅ iOS app (needs Mac to build)
✅ WebView loading your live website
✅ No changes to your website code
✅ Ready to publish to app stores

**Happy building! 📱**



