# 🚀 Quick Publishing Steps

## ✅ What's Already Done
- [x] Extension code complete
- [x] package.json updated with your name (TAIJULAMAN)
- [x] Repository URL set
- [x] vsce installed globally

## 📋 Next Steps (In Order)

### Step 1: Create Azure DevOps Account & Get Token (5 minutes)

1. Go to https://dev.azure.com
2. Sign in with Microsoft account (create one if needed)
3. Click your profile icon (top right) → **Personal Access Tokens**
4. Click **+ New Token**
5. Settings:
   - Name: `vscode-marketplace`
   - Expiration: 1 year
   - Scopes: Click "Show all scopes" → Check **Marketplace (Manage)**
6. Click **Create** and **COPY THE TOKEN** (save it somewhere safe!)

### Step 2: Create Publisher Account (2 minutes)

Open PowerShell and run:

```powershell
cd c:\Projects\roast-vs-code-extention\vs-roast
vsce create-publisher TAIJULAMAN
```

When prompted:
- Paste your Personal Access Token
- Enter display name: TAIJULAMAN
- Enter your email

### Step 3: Create Icon (Optional but Recommended)

**Quick Option**: Use AI to generate
- Prompt: "Simple flat icon, fire emoji with code brackets, 128x128px, transparent background"
- Save as `icon.png` in the root folder

**Skip for now**: You can publish without an icon and add it later

If you create an icon, add to package.json:
```json
"icon": "icon.png"
```

### Step 4: Test Package Locally (1 minute)

```powershell
npm run compile
vsce package
```

This creates `vs-roast-0.0.1.vsix` file.

### Step 5: Login to Publisher (1 minute)

```powershell
vsce login TAIJULAMAN
```

Paste your Personal Access Token when prompted.

### Step 6: PUBLISH! 🎉

```powershell
vsce publish
```

That's it! Your extension will be live in 5-10 minutes.

---

## 🔗 Your Extension URL (After Publishing)

```
https://marketplace.visualstudio.com/items?itemName=TAIJULAMAN.vs-roast
```

---

## 🎯 Minimal Publishing (Right Now)

If you want to publish immediately without icon:

```powershell
# 1. Get PAT from Azure DevOps (see Step 1 above)

# 2. Create publisher
vsce create-publisher TAIJULAMAN

# 3. Login
vsce login TAIJULAMAN

# 4. Publish
cd c:\Projects\roast-vs-code-extention\vs-roast
npm run compile
vsce publish
```

Done! You can add icon/banner/demo later with an update.

---

## 📝 After Publishing

Share your extension:
- Twitter: "Just published my VS Code extension 🔥 VS Roast - A linter that hurts your feelings!"
- Reddit: r/vscode, r/programming
- LinkedIn: Add to your projects

---

## 🔄 To Update Later

1. Make changes to code
2. Update version in package.json (e.g., "0.0.2")
3. Update CHANGELOG.md
4. Run:
   ```powershell
   npm run compile
   vsce publish
   ```
