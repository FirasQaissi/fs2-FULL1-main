# 🔑 Keytool Fix Guide

## Problem

The `keytool` command is not recognized because it's not in your system PATH.

---

## ⚠️ IMPORTANT: You Need Java JDK 11+

Your system has **Java 8**, but Android builds require **Java 11 or higher**.

**You should upgrade Java first before creating a keystore!**

Download JDK 11+: https://adoptium.net/

---

## Quick Fix Options

### Option 1: Use Full Path to Keytool (Temporary)

Find your Java installation and use the full path:

**Common Java 8 locations:**

- `C:\Program Files\Java\jdk1.8.0_xxx\bin\keytool.exe`
- `C:\Program Files (x86)\Java\jdk1.8.0_xxx\bin\keytool.exe`

**Example command:**

```powershell
cd C:\Users\Firas\Downloads\fs2-FULL1-main\mobile-app\android\app

"C:\Program Files\Java\jdk1.8.0_451\bin\keytool.exe" -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Option 2: Set JAVA_HOME and Update PATH (Recommended)

1. **Find your Java installation:**

   ```powershell
   Get-ChildItem "C:\Program Files\Java" -Directory
   ```

2. **Set JAVA_HOME:**

   ```powershell
   setx JAVA_HOME "C:\Program Files\Java\jdk1.8.0_451"
   ```

3. **Add to PATH:**

   ```powershell
   setx PATH "%PATH%;%JAVA_HOME%\bin"
   ```

4. **Restart PowerShell** and try again:
   ```powershell
   keytool -version
   ```

### Option 3: Use Android Studio's JDK (Best for Android)

Android Studio comes with its own JDK. Use that instead:

1. **Find Android Studio's JDK:**

   - Usually at: `C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe`

2. **Use full path:**
   ```powershell
   "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

---

## 🎯 Recommended Solution

**Don't create a keystore yet!** Here's why:

1. **Install Java JDK 11+ first** (required for Android builds)
2. **Build and test a debug APK first** (no keystore needed)
3. **Create keystore later** when ready for release

---

## How to Build Without Keystore (Debug APK)

You don't need a keystore for testing! Just build a debug APK:

### Step 1: Sync Your Changes

```bash
cd C:\Users\Firas\Downloads\fs2-FULL1-main\mobile-app
npm run sync
```

### Step 2: Open in Android Studio

```bash
npm run open:android
```

### Step 3: Build Debug APK

In Android Studio:

- Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**No keystore needed for debug builds!**

---

## When You Need a Keystore

You only need a keystore when:

- Building a **release APK** for production
- Publishing to **Google Play Store**

For now, focus on:

1. ✅ Updating website URL in `www/index.html`
2. ✅ Installing Java JDK 11+
3. ✅ Building debug APK
4. ✅ Testing the app

---

## Next Steps

1. **Update website URL** in `www/index.html`:

   ```javascript
   const WEBSITE_URL = "https://your-actual-deployed-website.com";
   ```

2. **Sync changes:**

   ```bash
   cd mobile-app
   npm run sync
   ```

3. **Install Java JDK 11+:**

   - Download: https://adoptium.net/
   - Install
   - Set JAVA_HOME
   - Restart terminal

4. **Build debug APK** in Android Studio (no keystore needed!)

5. **Test on your Android device**

6. **Create keystore later** when ready for production release

---

## Summary

❌ **Don't worry about keytool right now**
✅ **Focus on building a debug APK first**
✅ **Upgrade to Java 11+ for Android builds**
✅ **Test with debug APK (no signing needed)**

**Keystore is only for production release, not for testing!**

---

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help.


