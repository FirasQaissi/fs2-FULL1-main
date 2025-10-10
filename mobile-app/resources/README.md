# App Resources

Place your app icons and splash screens here for easy generation.

## Required Files

### 1. Icon

- **File name:** `icon.png`
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency (optional)
- **Content:** Your app logo/icon

### 2. Splash Screen

- **File name:** `splash.png`
- **Size:** 2732x2732 pixels
- **Format:** PNG
- **Content:** Centered logo on solid background

## Generate Assets

After placing `icon.png` and `splash.png` in this folder, run:

```bash
npx @capacitor/assets generate
```

This will automatically generate all required sizes for Android and iOS!

## Manual Icon Creation

If you don't have icon files yet:

1. **Use your website logo/favicon**
2. **Or create using:**

   - [Canva](https://www.canva.com) - Free design tool
   - [Figma](https://www.figma.com) - Professional design
   - [Photoshop/GIMP](https://www.gimp.org) - Image editing

3. **Or use online generators:**
   - [Icon Kitchen](https://icon.kitchen/)
   - [App Icon Generator](https://www.appicon.co/)

## Tips

- **Icon:** Simple, recognizable, works at small sizes
- **Splash:** Minimal design with centered logo
- **Colors:** Match your brand
- **Safe area:** Keep important content in center 80%



