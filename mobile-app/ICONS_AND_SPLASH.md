# App Icons and Splash Screens Guide

## Overview

To make your app look professional, you should add custom icons and splash screens. This guide will help you add them to both Android and iOS.

## Quick Setup (Recommended)

### Option 1: Use Capacitor Assets Generator (Easiest)

1. **Install the tool:**

```bash
npm install -g @capacitor/assets
```

2. **Prepare your images:**

   - Create a 1024x1024 PNG icon (named `icon.png`)
   - Create a 2732x2732 PNG splash screen (named `splash.png`)
   - Place both in `mobile-app/resources/` folder

3. **Generate all assets:**

```bash
cd mobile-app
npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#000000'
```

This will automatically generate all required sizes for both platforms!

---

## Manual Setup

### Android Icons

#### 1. Required Icon Sizes

Place icons in `android/app/src/main/res/`:

- `mipmap-mdpi/ic_launcher.png` - 48x48
- `mipmap-hdpi/ic_launcher.png` - 72x72
- `mipmap-xhdpi/ic_launcher.png` - 96x96
- `mipmap-xxhdpi/ic_launcher.png` - 144x144
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192

#### 2. Splash Screen

Edit `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

Create `android/app/src/main/res/drawable/splash.png` (or splash.xml for custom)

### iOS Icons and Splash

#### 1. App Icons

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select `Assets.xcassets` in the project navigator
3. Click on `AppIcon`
4. Drag and drop your icon images for each size

Required sizes:

- 20x20 (2x and 3x)
- 29x29 (2x and 3x)
- 40x40 (2x and 3x)
- 60x60 (2x and 3x)
- 76x76 (1x and 2x)
- 83.5x83.5 (2x)
- 1024x1024 (1x)

#### 2. Launch Screen (Splash)

1. In Xcode, select `LaunchScreen.storyboard`
2. Add an image view
3. Set constraints to fill the screen
4. Add your splash image to Assets.xcassets
5. Set the image view's image to your splash

---

## Image Specifications

### App Icon

- **Format:** PNG (with transparency if needed)
- **Size:** 1024x1024 (master, will be resized)
- **Content:** Logo/brand, simple design
- **Safe area:** Keep important content in center 80%
- **No text:** iOS may add effects; use images only

### Splash Screen

- **Format:** PNG or JPG
- **Size:** 2732x2732 (will be cropped/scaled)
- **Content:** Logo centered, solid background
- **Safe area:** Keep logo in center 50%
- **Design tip:** Use simple, centered logo on solid color

---

## Using Online Icon Generators

### Recommended Tools:

1. **Icon Kitchen** (Android)

   - URL: https://icon.kitchen/
   - Upload 1024x1024 icon
   - Download Android icon pack
   - Extract to `android/app/src/main/res/`

2. **App Icon Generator** (iOS)

   - URL: https://www.appicon.co/
   - Upload 1024x1024 icon
   - Download iOS icon set
   - Import to Xcode Assets.xcassets

3. **Capacitor Assets (Both)**
   - Best option for automatic generation
   - See Option 1 above

---

## Adaptive Icons (Android 8.0+)

Modern Android uses adaptive icons (foreground + background).

1. Create `ic_launcher_foreground.xml` in `drawable/`
2. Create `ic_launcher_background.xml` in `drawable/`
3. Update `mipmap-anydpi-v26/ic_launcher.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## After Adding Icons/Splash

### Sync and Build

```bash
cd mobile-app
npm run sync
```

### Test

- **Android:** Rebuild in Android Studio
- **iOS:** Clean build in Xcode (`Product` → `Clean Build Folder`)

---

## Common Issues

### Android

- **Icon not showing:** Clear app data and reinstall
- **Wrong size:** Ensure all densities are provided
- **Blurry:** Use higher resolution source image

### iOS

- **Icon not updating:** Clean build folder
- **Rounded corners:** iOS adds automatically, use square images
- **Splash not showing:** Check LaunchScreen.storyboard constraints

---

## Quick Checklist

- [ ] Create 1024x1024 icon image (PNG)
- [ ] Create 2732x2732 splash image (PNG)
- [ ] Install @capacitor/assets: `npm install -g @capacitor/assets`
- [ ] Create `mobile-app/resources/` folder
- [ ] Add icon.png and splash.png to resources/
- [ ] Run: `npx @capacitor/assets generate`
- [ ] Sync: `npm run sync`
- [ ] Build and test on both platforms

---

## Design Tips

### Icon Design

✅ Simple and recognizable
✅ Works at small sizes
✅ Consistent with brand
✅ High contrast
❌ Too detailed
❌ Small text
❌ Complex gradients

### Splash Screen

✅ Fast loading experience
✅ Minimal design
✅ Brand logo centered
✅ Solid or simple background
❌ Too much text
❌ Complex animations (use simple fade)
❌ Different look from app

---

## Resources

- [Android Icon Design](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [iOS Icon Design](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Capacitor Assets Tool](https://github.com/ionic-team/capacitor-assets)
- [Icon Kitchen](https://icon.kitchen/)
- [App Icon Generator](https://www.appicon.co/)



