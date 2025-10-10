# Mobile App Build Instructions

## Prerequisites

### For Android (Windows, Mac, or Linux)
- ✅ Node.js and npm (already installed)
- ✅ Android Studio ([Download here](https://developer.android.com/studio))
- Java JDK 11 or higher
- Android SDK (installed with Android Studio)

### For iOS (Mac only)
- Xcode (from Mac App Store)
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account (for distribution)

---

## Step 1: Configure Your App

### 1.1 Update Website URL
Edit `www/index.html` and replace:
```javascript
const WEBSITE_URL = 'YOUR_WEBSITE_URL_HERE';
```
With your actual URL:
```javascript
const WEBSITE_URL = 'https://your-deployed-website.com';
```

### 1.2 Update App Identity
Edit `capacitor.config.json`:
```json
{
  "appId": "com.yourcompany.appname",  // Unique bundle ID
  "appName": "Your App Name",          // Display name
  ...
}
```

### 1.3 Sync Changes
After making changes, run:
```bash
cd mobile-app
npm run sync
```

---

## Step 2: Build for Android

### 2.1 Open Android Studio
```bash
cd mobile-app
npm run open:android
```
Or manually open: `mobile-app/android` folder in Android Studio

### 2.2 Configure Gradle (First Time Only)
1. Wait for Gradle sync to complete
2. If prompted, update Gradle or Android SDK
3. Accept licenses if needed

### 2.3 Build Debug APK (for testing)
**Option A: Using Android Studio**
1. Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Terminal**
```bash
cd mobile-app/android
gradlew assembleDebug
```

### 2.4 Build Release APK (for production)
**Important: You need a signing key**

1. **Generate a Keystore (first time only):**
```bash
cd mobile-app/android/app
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
Enter a password and fill in the details.

2. **Configure Signing:**
Create `android/app/build.gradle` signing config:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'my-key-alias'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

3. **Build Release APK:**
```bash
cd mobile-app/android
gradlew assembleRelease
```

4. **APK Location:**
`android/app/build/outputs/apk/release/app-release.apk`

---

## Step 3: Build for iOS (Mac Only)

### 3.1 Install CocoaPods Dependencies
```bash
cd mobile-app/ios/App
pod install
```

### 3.2 Open Xcode
```bash
cd mobile-app
npm run open:ios
```
Or manually open: `mobile-app/ios/App/App.xcworkspace` (NOT .xcodeproj)

### 3.3 Configure Signing
1. Select the `App` target in Xcode
2. Go to `Signing & Capabilities` tab
3. Select your Team (Apple Developer Account)
4. Xcode will automatically manage signing

### 3.4 Build for Simulator (Testing)
1. Select a simulator from the device dropdown
2. Click the Play button (▶️) or `Product` → `Run`

### 3.5 Build for Real Device (Testing)
1. Connect your iPhone/iPad
2. Select it from the device dropdown
3. Click Run

### 3.6 Build IPA for Distribution
**Archive the App:**
1. Select `Any iOS Device` or a real device
2. Go to `Product` → `Archive`
3. Wait for archive to complete
4. Organizer window will open

**Export IPA:**
1. Select your archive
2. Click `Distribute App`
3. Choose distribution method:
   - **App Store Connect**: For App Store
   - **Ad Hoc**: For testing on specific devices
   - **Enterprise**: For in-house distribution
   - **Development**: For testing
4. Follow the wizard and export IPA

**IPA Location:** Xcode will show the export location

---

## Step 4: Testing

### Android
1. Install APK on device:
   ```bash
   adb install path/to/app-debug.apk
   ```
2. Or transfer APK to phone and install manually
3. Enable "Install from Unknown Sources" if needed

### iOS
- Simulator: Already runs after build
- Real Device: Installed automatically when running from Xcode
- IPA: Install via TestFlight or deployment tools

---

## Step 5: Distribution

### Android - Google Play Store
1. Create a Google Play Developer account ($25 one-time fee)
2. Create a new app in Play Console
3. Upload the signed release APK/AAB
4. Fill in store listing details
5. Submit for review

**Build AAB (Android App Bundle - Recommended):**
```bash
cd mobile-app/android
gradlew bundleRelease
```
Location: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS - Apple App Store
1. Create an Apple Developer account ($99/year)
2. Create an App ID in Apple Developer Portal
3. Create app in App Store Connect
4. Upload IPA using Xcode or Transporter app
5. Fill in app metadata
6. Submit for review

---

## Troubleshooting

### Android Issues

**Gradle Build Failed:**
- Check Java version: `java -version` (needs JDK 11+)
- Update Gradle in Android Studio
- Clean build: `gradlew clean`

**Signing Issues:**
- Verify keystore path in build.gradle
- Check passwords are correct
- Ensure keystore file exists

### iOS Issues

**Pod Install Failed:**
- Update CocoaPods: `sudo gem install cocoapods`
- Clean pod cache: `pod cache clean --all`
- Try: `pod install --repo-update`

**Signing Issues:**
- Check Apple Developer account is active
- Verify Bundle ID matches your App ID
- Regenerate provisioning profiles

**Build Failed:**
- Clean build folder: `Product` → `Clean Build Folder`
- Delete `DerivedData` folder
- Restart Xcode

---

## Quick Commands Reference

```bash
# Sync changes to native projects
npm run sync

# Open Android Studio
npm run open:android

# Open Xcode
npm run open:ios

# Copy web assets
npm run copy

# Update Capacitor
npm run update
```

---

## Important Notes

1. **Always test on real devices** before publishing
2. **Keep your signing keys secure** - never commit them to git
3. **Update version numbers** in:
   - `package.json`
   - `capacitor.config.json` (if you add version field)
   - Android: `android/app/build.gradle` (versionCode and versionName)
   - iOS: In Xcode project settings
4. **Website must support HTTPS** for the WebView to work properly
5. **Test offline behavior** - add appropriate error handling
6. **iOS requires Mac** - you cannot build iOS apps on Windows/Linux

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [iOS Publishing Guide](https://developer.apple.com/app-store/submissions/)
- [React Native WebView Docs](https://github.com/react-native-webview/react-native-webview)




