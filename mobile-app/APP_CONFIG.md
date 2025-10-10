# Mobile App Configuration Guide

## IMPORTANT: Update These Settings Before Building

### 1. Update Your Website URL

Edit `www/index.html` and replace `YOUR_WEBSITE_URL_HERE` with your actual deployed website URL:

```javascript
const WEBSITE_URL = "https://your-actual-website.com";
```

### 2. Update App Identity in `capacitor.config.json`

Update these fields:

- **appId**: Change `com.yourcompany.mobileapp` to your unique bundle ID (e.g., `com.mycompany.smartlock`)
- **appName**: Change `Your App Name` to your actual app name (e.g., `Smart Lock App`)

Example:

```json
{
  "appId": "com.mycompany.smartlock",
  "appName": "Smart Lock App",
  ...
}
```

### 3. Update Android-Specific Settings

Edit `android/app/src/main/res/values/strings.xml`:

- Update `app_name` to your app name
- Update `title_activity_main` if needed

### 4. Update iOS-Specific Settings (on Mac)

When you build on Mac, update:

- Open `ios/App/App.xcworkspace` in Xcode
- Update Display Name, Bundle Identifier, Version, and Build Number

## Current Configuration Status

✅ Capacitor project created
✅ Android platform added
✅ iOS platform added
⚠️ **REQUIRED**: Update website URL in www/index.html
⚠️ **REQUIRED**: Update app identity in capacitor.config.json
⚠️ **OPTIONAL**: Add custom app icons and splash screens

## Next Steps

1. Update the configuration as described above
2. Run `npm run sync` to sync changes to native projects
3. Build for Android (can be done on Windows)
4. Build for iOS (requires Mac with Xcode)

See BUILD_INSTRUCTIONS.md for detailed build steps.



