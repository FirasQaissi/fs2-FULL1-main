# Troubleshooting Guide

Common issues and solutions when building the mobile app.

---

## Android Build Issues

### ❌ "Compatible with Java 11 and the consumer needed Java 8"

**Problem:** Your system has Java 8, but Android Gradle Plugin requires Java 11+

**Solution 1: Install Java JDK 11 or higher**

1. Download JDK 11 (or newer):

   - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
   - [OpenJDK](https://adoptium.net/) (Recommended, free)

2. Install the JDK

3. Set JAVA_HOME environment variable:

   **Windows:**

   ```powershell
   # Check current Java version
   java -version

   # Set JAVA_HOME (replace path with your JDK installation)
   setx JAVA_HOME "C:\Program Files\Java\jdk-11"

   # Add to PATH
   setx PATH "%PATH%;%JAVA_HOME%\bin"

   # Restart terminal and verify
   java -version
   ```

   **Mac/Linux:**

   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export JAVA_HOME=/path/to/jdk-11
   export PATH=$JAVA_HOME/bin:$PATH

   # Reload and verify
   source ~/.bashrc  # or ~/.zshrc
   java -version
   ```

4. Restart your terminal/IDE and try building again

**Solution 2: Use Android Studio's embedded JDK**

1. Open Android Studio
2. Go to `File` → `Project Structure` → `SDK Location`
3. Check "Use embedded JDK"
4. Build from Android Studio instead of command line

---

### ❌ Gradle Sync Failed

**Problem:** Gradle can't download dependencies or sync project

**Solutions:**

1. **Check internet connection**

2. **Update Gradle:**

   ```bash
   cd mobile-app/android
   gradlew wrapper --gradle-version 8.4
   ```

3. **Clear Gradle cache:**

   ```bash
   # Windows
   rmdir /s /q %USERPROFILE%\.gradle\caches

   # Mac/Linux
   rm -rf ~/.gradle/caches
   ```

4. **In Android Studio:**
   - `File` → `Invalidate Caches` → `Invalidate and Restart`

---

### ❌ SDK Not Found

**Problem:** Android SDK is not installed or not found

**Solution:**

1. **Install via Android Studio:**

   - Open Android Studio
   - `Tools` → `SDK Manager`
   - Install latest Android SDK
   - Note the SDK location

2. **Set ANDROID_HOME:**

   **Windows:**

   ```powershell
   setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
   setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
   ```

   **Mac/Linux:**

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
   ```

---

### ❌ Build Tools Version Not Found

**Problem:** Required build tools version is missing

**Solution:**

1. Open Android Studio
2. `Tools` → `SDK Manager` → `SDK Tools` tab
3. Install required build tools version
4. Sync project again

---

### ❌ Keystore Issues (Release Build)

**Problem:** Can't sign release APK

**Solutions:**

1. **Keystore file not found:**

   - Verify keystore path in `android/app/build.gradle`
   - Use absolute path or relative to `app/` directory

2. **Wrong password:**

   - Double-check password when creating keystore
   - Update password in build.gradle

3. **Create new keystore:**
   ```bash
   cd mobile-app/android/app
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

---

## iOS Build Issues

### ❌ Pod Install Failed

**Problem:** CocoaPods can't install dependencies

**Solutions:**

1. **Install/Update CocoaPods:**

   ```bash
   sudo gem install cocoapods
   ```

2. **Update pod repo:**

   ```bash
   pod repo update
   ```

3. **Clean and reinstall:**

   ```bash
   cd mobile-app/ios/App
   rm -rf Pods
   rm Podfile.lock
   pod install
   ```

4. **Use Rosetta (Apple Silicon Mac):**
   ```bash
   sudo arch -x86_64 gem install ffi
   arch -x86_64 pod install
   ```

---

### ❌ Signing Issues

**Problem:** Can't sign the app in Xcode

**Solutions:**

1. **Select a Team:**

   - Open project in Xcode
   - Select `App` target
   - Go to `Signing & Capabilities`
   - Select your Apple Developer team

2. **Bundle ID conflict:**

   - Change Bundle ID to something unique
   - Update in `capacitor.config.json`
   - Sync: `npm run sync`

3. **Provisioning profile issues:**
   - In Xcode, select `Automatically manage signing`
   - Or create profiles manually in Apple Developer portal

---

### ❌ "Command PhaseScriptExecution failed"

**Problem:** Build script error during Xcode build

**Solutions:**

1. **Clean build folder:**

   - In Xcode: `Product` → `Clean Build Folder`
   - Or: Shift + Cmd + K

2. **Delete DerivedData:**

   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

3. **Update CocoaPods:**
   ```bash
   cd ios/App
   pod update
   ```

---

### ❌ "Module not found"

**Problem:** Swift/Objective-C modules can't be found

**Solutions:**

1. **Install dependencies:**

   ```bash
   cd ios/App
   pod install
   ```

2. **Open correct workspace:**

   - Use `App.xcworkspace` NOT `App.xcodeproj`

3. **Clean and rebuild**

---

## App Runtime Issues

### ❌ Website Doesn't Load

**Problem:** Blank screen or error in app

**Solutions:**

1. **Check website URL:**

   - Verify URL in `www/index.html` is correct
   - Must be HTTPS (not HTTP)
   - Test URL in browser first

2. **Check internet connection:**

   - Ensure device has internet
   - Test on WiFi and mobile data

3. **Check CSP (Content Security Policy):**

   - Website may block iframe embedding
   - Check website's CSP headers
   - May need to whitelist app domain

4. **Check browser console:**
   - Android: Chrome DevTools (chrome://inspect)
   - iOS: Safari Web Inspector

---

### ❌ App Crashes on Launch

**Problem:** App closes immediately after opening

**Solutions:**

1. **Check logs:**

   **Android:**

   ```bash
   adb logcat | grep -i error
   ```

   **iOS:**

   - Open Xcode
   - Window → Devices and Simulators
   - Select device → View Device Logs

2. **Common causes:**

   - Invalid website URL
   - Missing internet permission (Android)
   - SSL certificate issues
   - JavaScript errors on website

3. **Debug mode:**
   - Build debug version
   - Use Android Studio or Xcode debugger
   - Check error messages

---

### ❌ Blank White Screen

**Problem:** App loads but shows blank screen

**Solutions:**

1. **Enable WebView debugging:**

   **Android:**
   Add to `MainActivity.java`:

   ```java
   import android.webkit.WebView;

   @Override
   public void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       WebView.setWebContentsDebuggingEnabled(true);
   }
   ```

2. **Check URL in iframe:**

   - Verify `WEBSITE_URL` in `www/index.html`
   - Test URL directly in browser

3. **Check network requests:**
   - Use Chrome DevTools (Android)
   - Use Safari Inspector (iOS)
   - Look for failed requests

---

## Capacitor Issues

### ❌ "Could not find capacitor.config.json"

**Problem:** Capacitor can't find config file

**Solution:**

1. Ensure `capacitor.config.json` is in root of `mobile-app/`
2. Run commands from `mobile-app/` directory
3. Verify file is not `.json.txt` or similar

---

### ❌ "webDir does not exist"

**Problem:** Web directory not found

**Solution:**

1. Ensure `www/` folder exists in `mobile-app/`
2. Ensure `index.html` is in `www/`
3. Run `npm run sync` to copy files

---

### ❌ Plugins Not Working

**Problem:** Capacitor plugins don't work

**Solutions:**

1. **Install plugin properly:**

   ```bash
   npm install @capacitor/camera
   npm run sync
   ```

2. **Import in app:**

   ```javascript
   import { Camera } from "@capacitor/camera";
   ```

3. **Check permissions:**
   - Android: Update `AndroidManifest.xml`
   - iOS: Update `Info.plist`

---

## Environment Issues

### ❌ "Command not found: npx"

**Problem:** npm/npx not installed

**Solution:**

1. Install Node.js: https://nodejs.org/
2. Verify: `node -v` and `npm -v`
3. Restart terminal

---

### ❌ Permission Denied (Mac/Linux)

**Problem:** Don't have permission to execute

**Solution:**

```bash
# Make gradlew executable
chmod +x android/gradlew

# Or use sudo for global installs
sudo npm install -g @capacitor/cli
```

---

### ❌ "Cannot find module" (Node)

**Problem:** npm packages not installed

**Solution:**

```bash
cd mobile-app
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Store Submission Issues

### ❌ Google Play Rejection

**Common reasons:**

- Privacy policy missing
- Content rating incomplete
- App crashes during testing
- Violates policies

**Solution:**

- Address specific issues mentioned
- Update app and resubmit
- Respond to review team

---

### ❌ App Store Rejection

**Common reasons:**

- App crashes or bugs
- Incomplete metadata
- Design guideline violations
- Business model issues

**Solution:**

- Fix issues mentioned in rejection
- Update app version
- Resubmit for review

---

## Getting More Help

### Check Logs

**Android:**

```bash
# Full logcat
adb logcat

# Filter errors
adb logcat | findstr ERROR

# Specific app
adb logcat | findstr com.yourapp
```

**iOS:**

- Xcode → Window → Devices and Simulators
- Select device → Open Console

### Debug Tools

**Android:**

- Chrome DevTools: `chrome://inspect`
- Android Studio Logcat
- Layout Inspector

**iOS:**

- Safari → Develop → [Your Device]
- Xcode Debugger
- Instruments

### Online Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Community](https://github.com/capacitor-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
- [Ionic Forum](https://forum.ionicframework.com/)

---

## Still Stuck?

1. **Check Capacitor docs:** https://capacitorjs.com/docs
2. **Search GitHub issues:** https://github.com/ionic-team/capacitor/issues
3. **Ask on Stack Overflow:** Tag with `capacitor`
4. **Ionic Community Forum:** https://forum.ionicframework.com/

---

**Remember:** Most issues are environment-related (Java version, SDK paths, etc.). Double-check your setup first!



