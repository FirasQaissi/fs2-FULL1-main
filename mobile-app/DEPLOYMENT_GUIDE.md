# Mobile App Deployment Guide

Complete guide for deploying your mobile app to Google Play Store and Apple App Store.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Google Play Store Deployment](#google-play-store-deployment)
3. [Apple App Store Deployment](#apple-app-store-deployment)
4. [Version Management](#version-management)
5. [Post-Launch](#post-launch)

---

## Pre-Deployment Checklist

Before submitting to app stores:

### ✅ Configuration

- [ ] Website URL is correct in `www/index.html`
- [ ] App name is set in `capacitor.config.json`
- [ ] Bundle ID is unique (e.g., `com.yourcompany.appname`)
- [ ] Version number is set correctly

### ✅ Assets

- [ ] App icon added (1024x1024)
- [ ] Splash screen added
- [ ] Screenshots prepared (required for stores)

### ✅ Testing

- [ ] Tested on real Android device
- [ ] Tested on real iOS device
- [ ] Verified website loads correctly
- [ ] Tested offline behavior
- [ ] Checked performance and responsiveness

### ✅ Legal & Content

- [ ] Privacy policy created and hosted
- [ ] Terms of service ready
- [ ] App description written
- [ ] Keywords researched (for ASO)
- [ ] Screenshots and marketing assets ready

---

## Google Play Store Deployment

### Step 1: Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with Google account
3. Pay $25 one-time registration fee
4. Complete account setup

### Step 2: Prepare Release Build

1. **Build signed AAB (recommended):**

```bash
cd mobile-app/android
gradlew bundleRelease
```

Or **signed APK:**

```bash
cd mobile-app/android
gradlew assembleRelease
```

2. **File locations:**
   - AAB: `android/app/build/outputs/bundle/release/app-release.aab`
   - APK: `android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Create App in Play Console

1. Click **"Create app"**
2. Fill in:
   - App name
   - Default language
   - App or game type
   - Free or paid
3. Accept declarations

### Step 4: Complete Store Listing

**Main Store Listing:**

- App name (30 chars)
- Short description (80 chars)
- Full description (4000 chars)
- App icon (512x512 PNG)
- Feature graphic (1024x500)
- Screenshots (required):
  - Phone: At least 2 (16:9 or 9:16)
  - 7-inch tablet: At least 2
  - 10-inch tablet: At least 2

**Categorization:**

- App category
- Tags (optional)
- Contact details
- Privacy policy URL (required)

### Step 5: Content Rating

1. Go to **"Content rating"**
2. Fill out questionnaire
3. Get rating (e.g., Everyone, Teen, etc.)

### Step 6: App Pricing & Distribution

1. Select countries (or select all)
2. Choose pricing (free or paid)
3. Mark as ads/no ads
4. Accept content policies

### Step 7: Release

**Internal Testing (Optional but Recommended):**

1. Go to **"Internal testing"**
2. Create release
3. Upload AAB
4. Add testers (by email)
5. Test thoroughly

**Production Release:**

1. Go to **"Production"**
2. Create release
3. Upload AAB/APK
4. Add release notes
5. Review and rollout

**Review Time:** 1-7 days (usually < 48 hours)

---

## Apple App Store Deployment

### Step 1: Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete enrollment (may take 1-2 days)

### Step 2: Create App ID

1. Go to [Certificates, IDs & Profiles](https://developer.apple.com/account/resources)
2. Click **Identifiers** → **+**
3. Select **App IDs** → **Continue**
4. Select **App** → **Continue**
5. Fill in:
   - Description: Your app name
   - Bundle ID: Explicit (e.g., com.yourcompany.appname)
   - Capabilities: (select if needed)
6. Click **Continue** → **Register**

### Step 3: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: Your app name
   - Primary language
   - Bundle ID: Select the one you created
   - SKU: Unique identifier (e.g., yourapp001)
   - User access: Full or Limited

### Step 4: Prepare Build in Xcode

**On Mac:**

1. Open project:

```bash
cd mobile-app
npm run open:ios
```

2. **Configure in Xcode:**

   - Select `App` target
   - Go to **Signing & Capabilities**
   - Select your Team
   - Ensure Bundle ID matches

3. **Set version:**

   - Version: 1.0
   - Build: 1

4. **Archive:**

   - Select **Any iOS Device** (Generic)
   - Go to **Product** → **Archive**
   - Wait for archive to complete

5. **Upload to App Store:**
   - Organizer opens automatically
   - Select your archive
   - Click **Distribute App**
   - Select **App Store Connect**
   - Click **Upload**
   - Wait for processing (10-30 min)

### Step 5: Complete App Information

**In App Store Connect:**

1. **App Information:**

   - Privacy Policy URL (required)
   - Category (Primary and Secondary)
   - Content rights (yes/no)

2. **Pricing:**

   - Price tier (or free)
   - Countries/regions

3. **App Privacy:**

   - Complete privacy questionnaire
   - List data collected (if any)

4. **Version Information:**

   - Screenshots (required):
     - 6.5" iPhone: At least 1 (1284x2778)
     - 5.5" iPhone: At least 1 (1242x2208)
     - iPad Pro: At least 1 (2048x2732)
   - Promotional text (170 chars, optional)
   - Description (4000 chars)
   - Keywords (100 chars, comma-separated)
   - Support URL
   - Marketing URL (optional)

5. **Build:**

   - Select the uploaded build
   - Export compliance: Answer questions

6. **Version Release:**

   - Automatic or manual

7. **Age Rating:**
   - Complete questionnaire

### Step 6: Submit for Review

1. Click **Add for Review**
2. Click **Submit to App Review**
3. Answer any final questions

**Review Time:** 1-7 days (usually 24-48 hours)

---

## Version Management

### Updating Your App

**Version Numbering:**

- Major.Minor.Patch (e.g., 1.0.0)
- Major: Big changes, new features
- Minor: Small features, improvements
- Patch: Bug fixes

**Update Process:**

1. **Update version in:**

   - `package.json`
   - Android: `android/app/build.gradle`
     ```gradle
     versionCode 2  // Increment by 1
     versionName "1.0.1"  // Your version
     ```
   - iOS: Xcode project settings

2. **Make your changes**

3. **Build new release**

4. **Upload to stores**

5. **Add release notes** (what's new)

### Release Notes Best Practices

✅ Keep it concise
✅ Highlight new features
✅ Mention bug fixes
✅ Use bullet points
✅ Be user-friendly (not technical)

Example:

```
What's New in v1.1.0:
• Added dark mode support
• Improved loading speed
• Fixed login issue
• Minor bug fixes and improvements
```

---

## Post-Launch

### Monitor Performance

**Android (Play Console):**

- Check crash reports
- Monitor ANRs (App Not Responding)
- Review user feedback
- Track installations

**iOS (App Store Connect):**

- Check crash reports in Xcode Organizer
- Monitor user reviews
- Track downloads
- Check metrics

### Respond to Reviews

- Reply to user reviews (both stores support this)
- Address issues quickly
- Thank users for feedback
- Fix bugs and release updates

### App Store Optimization (ASO)

1. **Keywords:**

   - Research relevant keywords
   - Update every few months
   - Monitor ranking

2. **Screenshots:**

   - Update with new features
   - A/B test different designs
   - Show key functionality

3. **Description:**
   - Clear and concise
   - Highlight benefits
   - Include keywords naturally

### Regular Updates

- Release updates every 4-8 weeks
- Keep app compatible with latest OS
- Add requested features
- Fix reported bugs

---

## Troubleshooting

### Play Store Rejection Reasons

- Broken functionality
- Privacy policy missing
- Misleading content
- Copyright issues
- Inappropriate content
- Technical issues

**Solution:** Fix issues and resubmit

### App Store Rejection Reasons

- Crashes or bugs
- Incomplete information
- Privacy violations
- Design violations
- Business model issues
- Legal issues

**Solution:** Address guideline violations and resubmit

---

## Resources

### Documentation

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [iOS App Distribution](https://developer.apple.com/distribute/)

### Tools

- [Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Developer API](https://developers.google.com/android-publisher)
- [App Store Connect API](https://developer.apple.com/app-store-connect/api/)

### Design Resources

- [Material Design](https://material.io/)
- [iOS Design Guidelines](https://developer.apple.com/design/)
- [Screenshot Templates](https://www.figma.com/community/search?resource_type=mixed&sort_by=relevancy&query=app%20store%20screenshots)

---

## Quick Checklist for First Release

### Before Submission

- [ ] App fully tested on real devices
- [ ] All assets prepared (icons, screenshots)
- [ ] Privacy policy URL ready
- [ ] App description written
- [ ] Developer accounts created and paid

### Android Submission

- [ ] Signed AAB/APK built
- [ ] Store listing complete
- [ ] Content rating obtained
- [ ] Pricing and distribution set
- [ ] Release submitted

### iOS Submission

- [ ] App ID created
- [ ] App in App Store Connect created
- [ ] Build uploaded from Xcode
- [ ] All metadata complete
- [ ] App privacy filled
- [ ] Submitted for review

### After Approval

- [ ] Monitor crash reports
- [ ] Respond to reviews
- [ ] Plan updates
- [ ] Track performance metrics

---

**Good luck with your app launch! 🚀**



