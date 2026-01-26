# 📦 VS-Roast Publishing Guide

Complete step-by-step guide to publish your VS Code extension to the marketplace.

---

## 🎯 Prerequisites Checklist

Before publishing, ensure you have:

- [x] Updated `package.json` with your publisher name (mdshahamanpatwary) ✅
- [x] Updated repository URL ✅
- [ ] Created extension icon (128x128px PNG)
- [ ] Created marketplace banner (1280x640px PNG)
- [ ] Recorded demo GIF/video
- [ ] Microsoft/Azure account
- [ ] Personal Access Token (PAT)

---

## Step 1: Install Publishing Tool

Install `vsce` (Visual Studio Code Extensions) globally:

```bash
npm install -g @vscode/vsce
```

Verify installation:
```bash
vsce --version
```

---

## Step 2: Create Azure DevOps Account

### 2.1 Sign Up
1. Go to [Azure DevOps](https://dev.azure.com)
2. Click **Start free**
3. Sign in with your Microsoft account (or create one)
4. Create an organization (any name is fine)

### 2.2 Create Personal Access Token (PAT)

1. Click on **User Settings** (top right) → **Personal Access Tokens**
2. Click **+ New Token**
3. Configure:
   - **Name**: `vscode-marketplace` (or any name)
   - **Organization**: All accessible organizations
   - **Expiration**: Custom defined (1 year recommended)
   - **Scopes**: Click **Show all scopes**
   - ✅ Check **Marketplace** → **Manage**
4. Click **Create**
5. **IMPORTANT**: Copy the token immediately (you won't see it again!)
6. Save it somewhere safe (password manager recommended)

---

## Step 3: Create Publisher Profile

### Option A: Using vsce (Recommended)

```bash
vsce create-publisher mdshahamanpatwary
```

When prompted:
- Enter your **Personal Access Token** (from Step 2)
- Enter **display name**: mdshahamanpatwary (or your preferred name)
- Enter **email**: your email address

### Option B: Using Web Interface

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Click **Create publisher**
4. Fill in:
   - **ID**: mdshahamanpatwary (must match package.json)
   - **Display name**: mdshahamanpatwary
   - **Email**: your email
5. Click **Create**

---

## Step 4: Create Visual Assets

### 4.1 Extension Icon (Required)

Create a **128x128px PNG** file:

**Quick Option**: Use an online tool
1. Go to [Canva](https://canva.com) or [Figma](https://figma.com)
2. Create 128x128px design
3. Use fire emoji 🔥 + code brackets `{}`
4. Export as PNG
5. Save as `icon.png` in the root folder

**AI Option**: Use image generation
```
Prompt: "A simple, clean icon for a VS Code extension called VS Roast. 
Features a fire emoji or flame with code brackets. Flat design, 
vibrant colors, 128x128px, transparent background."
```

### 4.2 Marketplace Banner (Optional but Recommended)

Create a **1280x640px PNG** file:
- Background: Gradient (orange/red fire theme)
- Text: "VS Roast - A linter that hurts your feelings"
- Save as `banner.png`

### 4.3 Update package.json

Add icon reference:
```json
{
  "icon": "icon.png",
  "galleryBanner": {
    "color": "#FF6B35",
    "theme": "dark"
  }
}
```

---

## Step 5: Create Demo GIF/Video

### Option A: Using LICEcap (Free)

1. Download [LICEcap](https://www.cockos.com/licecap/)
2. Open VS Code with your extension
3. Open `test-roast.ts`
4. Start LICEcap recording
5. Show:
   - Roasts appearing in real-time
   - Toggle command
   - Statistics view
6. Save as `demo.gif`
7. Add to README:
   ```markdown
   ![VS Roast Demo](demo.gif)
   ```

### Option B: Using ScreenToGif (Windows)

1. Download [ScreenToGif](https://www.screentogif.com/)
2. Record your screen showing the extension
3. Edit and optimize
4. Export as GIF

---

## Step 6: Test Package Locally

Before publishing, test the package:

```bash
# Navigate to extension folder
cd c:\Projects\roast-vs-code-extention\vs-roast

# Compile TypeScript
npm run compile

# Package the extension
vsce package
```

This creates a `.vsix` file (e.g., `vs-roast-0.0.1.vsix`)

### Install and Test Locally

```bash
code --install-extension vs-roast-0.0.1.vsix
```

Test the installed extension:
1. Reload VS Code
2. Open a TypeScript file
3. Verify roasts appear
4. Test commands and settings

If everything works, proceed to publishing!

---

## Step 7: Publish to Marketplace

### First-Time Login

```bash
vsce login mdshahamanpatwary
```

Enter your **Personal Access Token** when prompted.

### Publish the Extension

```bash
vsce publish
```

This will:
1. ✅ Validate your extension
2. ✅ Compile TypeScript
3. ✅ Package the extension
4. ✅ Upload to marketplace
5. ✅ Publish (may take 5-10 minutes to appear)

### Publish Specific Version (Alternative)

```bash
# Publish as patch version (0.0.1 → 0.0.2)
vsce publish patch

# Publish as minor version (0.0.1 → 0.1.0)
vsce publish minor

# Publish as major version (0.0.1 → 1.0.0)
vsce publish major
```

---

## Step 8: Verify Publication

1. Go to [VS Code Marketplace](https://marketplace.visualstudio.com/vscode)
2. Search for "VS Roast"
3. Verify your extension appears
4. Check all details are correct

Your extension URL will be:
```
https://marketplace.visualstudio.com/items?itemName=TAIJULAMAN.vs-roast
```

---

## 🔄 Updating Your Extension

When you make changes:

1. **Update version** in `package.json`:
   ```json
   "version": "0.0.2"
   ```

2. **Update CHANGELOG.md**:
   ```markdown
   ## [0.0.2] - 2026-01-26
   ### Fixed
   - Bug fixes
   ### Added
   - New features
   ```

3. **Compile and publish**:
   ```bash
   npm run compile
   vsce publish
   ```

---

## 🚨 Common Issues & Solutions

### Issue: "Publisher not found"
**Solution**: Create publisher first (Step 3)

### Issue: "Icon not found"
**Solution**: Ensure `icon.png` exists in root folder and is referenced in package.json

### Issue: "PAT expired"
**Solution**: Create new PAT in Azure DevOps and login again:
```bash
vsce login TAIJULAMAN
```

### Issue: "Validation failed"
**Solution**: Run `vsce package` first to see detailed errors

### Issue: "README too large"
**Solution**: Move images to external hosting or reduce file sizes

---

## 📊 Post-Publishing Checklist

After publishing:

- [ ] Share on Twitter/X with demo GIF
- [ ] Post on Reddit (r/vscode, r/programming)
- [ ] Write blog post about building it
- [ ] Add to your portfolio
- [ ] Submit to VS Code newsletter
- [ ] Monitor reviews and feedback
- [ ] Respond to issues on GitHub

---

## 🎯 Quick Commands Reference

```bash
# Install vsce
npm install -g @vscode/vsce

# Login to publisher
vsce login TAIJULAMAN

# Package locally
vsce package

# Publish to marketplace
vsce publish

# Publish with version bump
vsce publish patch   # 0.0.1 → 0.0.2
vsce publish minor   # 0.0.1 → 0.1.0
vsce publish major   # 0.0.1 → 1.0.0

# Unpublish (use carefully!)
vsce unpublish TAIJULAMAN.vs-roast
```

---

## 📝 Before You Publish - Final Checklist

- [ ] Extension compiles without errors (`npm run compile`)
- [ ] All features tested in Extension Development Host
- [ ] README.md is complete with examples
- [ ] CHANGELOG.md is updated
- [ ] Icon and banner created
- [ ] Demo GIF/video recorded
- [ ] package.json has correct publisher name
- [ ] Repository URL is correct
- [ ] Version number is correct
- [ ] .vscodeignore excludes unnecessary files
- [ ] Personal Access Token is ready

---

## 🎉 You're Ready!

Once you complete all steps, run:

```bash
cd c:\Projects\roast-vs-code-extention\vs-roast
vsce publish
```

Your extension will be live on the VS Code Marketplace! 🚀

---

## 📞 Need Help?

- [VS Code Publishing Docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce GitHub](https://github.com/microsoft/vscode-vsce)
- [Marketplace Management](https://marketplace.visualstudio.com/manage)
