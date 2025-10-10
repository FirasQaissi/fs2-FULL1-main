# Mobile App Wrapper

This is a Capacitor-based mobile app that wraps your existing web application in a WebView for Android and iOS.

## 🚀 Quick Start

### 1. Configure Your Website URL

Edit `www/index.html` and update:

```javascript
const WEBSITE_URL = "https://your-deployed-website.com";
```

### 2. Update App Identity

Edit `capacitor.config.json`:

```json
{
  "appId": "com.yourcompany.appname",
  "appName": "Your App Name"
}
```

### 3. Sync Changes

```bash
npm run sync
```

### 4. Build

**For Android:**

```bash
npm run open:android
```

Then build in Android Studio

**For iOS (Mac only):**

```bash
npm run open:ios
```

Then build in Xcode

## 📚 Documentation

- **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - Complete build guide for Android and iOS
- **[APP_CONFIG.md](APP_CONFIG.md)** - Configuration guide
- **[ICONS_AND_SPLASH.md](ICONS_AND_SPLASH.md)** - How to add app icons and splash screens

## 📱 What This Does

This mobile app:

- ✅ Loads your existing website in a WebView
- ✅ Works on Android and iOS
- ✅ Provides a native app experience
- ✅ Can be published to app stores
- ✅ Requires NO changes to your website

## 🛠️ Available Commands

```bash
npm run sync          # Sync web changes to native platforms
npm run open:android  # Open in Android Studio
npm run open:ios      # Open in Xcode
npm run copy          # Copy web assets to native projects
npm run update        # Update Capacitor
```

## ⚙️ Requirements

### For Android

- Node.js and npm
- Android Studio
- Java JDK 11+

### For iOS (Mac only)

- Xcode
- CocoaPods
- Apple Developer account (for distribution)

## 📦 What's Included

```
mobile-app/
├── www/                    # Web assets (your website wrapper)
│   └── index.html         # Main HTML that loads your website
├── android/               # Android native project
├── ios/                   # iOS native project (Mac only)
├── capacitor.config.json  # Capacitor configuration
├── package.json          # Dependencies
└── docs/                 # Documentation
```

## 🔧 Customization

### Change Website URL

Update `WEBSITE_URL` in `www/index.html`

### Change App Name/Icon

See `APP_CONFIG.md` and `ICONS_AND_SPLASH.md`

### Add Native Features

Install Capacitor plugins as needed:

```bash
npm install @capacitor/camera
npm run sync
```

## 📤 Publishing

### Android - Google Play Store

1. Build signed APK/AAB (see BUILD_INSTRUCTIONS.md)
2. Create Play Store account ($25 one-time)
3. Upload and publish

### iOS - Apple App Store

1. Build IPA in Xcode (Mac required)
2. Create App Store Connect account ($99/year)
3. Upload and publish

## 🆘 Need Help?

1. Check `BUILD_INSTRUCTIONS.md` for detailed steps
2. See [Capacitor Docs](https://capacitorjs.com/docs)
3. For Android issues, see [Android Developer Docs](https://developer.android.com)
4. For iOS issues, see [Apple Developer Docs](https://developer.apple.com)

## ⚠️ Important Notes

- **iOS builds require a Mac** with Xcode
- **Website must use HTTPS** for proper WebView functionality
- **Test on real devices** before publishing
- **Keep signing keys secure** - never commit to git

## 🎯 Next Steps

1. [ ] Update website URL in `www/index.html`
2. [ ] Update app name and bundle ID in `capacitor.config.json`
3. [ ] Add app icons and splash screens (optional)
4. [ ] Run `npm run sync`
5. [ ] Build for Android/iOS
6. [ ] Test on real devices
7. [ ] Publish to app stores

## 📝 License

Same as your main project.



