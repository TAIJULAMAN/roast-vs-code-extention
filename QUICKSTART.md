# 🚀 Quick Start Guide

## Testing the Extension

### Option 1: Press F5 (Recommended)
1. Open the `vs-roast` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. In the new window, open `test-roast.ts`
4. Watch the roasts appear! 🔥

### Option 2: Manual Steps
```bash
cd c:\Projects\roast-vs-code-extention\vs-roast
code .
# Then press F5
```

## What You Should See

When you open `test-roast.ts`, you'll see grey italic comments like:
- `var x = 10;` << var? seriously? ok boomer.
- `console.log(x);` << classic debugger technique.
- `function test(data: any)` << 'any'? just say you gave up.

## Commands to Try

1. **Toggle Roast Mode**
   - Press `Ctrl+Shift+P`
   - Type "VS Roast: Toggle"
   - Click to enable/disable

2. **Show Statistics**
   - Press `Ctrl+Shift+P`
   - Type "VS Roast: Show Statistics"
   - View your roast count and achievements

3. **Status Bar**
   - Look at bottom-right corner
   - Click the "🔥 Roasts: X" to toggle

## Configuration

Open Settings (`Ctrl+,`) and search for "VS Roast" to customize:
- Enable/disable specific rules
- Adjust debounce delay
- Set max file size

## Next Steps for Publishing

1. **Create Visual Assets**
   - Icon (128x128px)
   - Banner (1280x640px)
   - Demo GIF

2. **Set Up Publisher**
   ```bash
   npm install -g vsce
   # Create Azure DevOps account
   # Generate Personal Access Token
   ```

3. **Update package.json**
   - Replace `your-publisher-name`
   - Add real repository URL
   - Add your details

4. **Package & Publish**
   ```bash
   vsce package
   vsce publish
   ```

## Troubleshooting

**Roasts not appearing?**
- Check status bar shows "ON" not "OFF"
- Verify file is .ts or .js
- Check file size < 100KB

**Extension not loading?**
- Run `npm run compile` first
- Check for TypeScript errors
- Restart Extension Development Host

## Files Overview

- `src/extension.ts` - Main logic
- `src/roastRules.ts` - Rule definitions
- `src/roastCounter.ts` - Statistics
- `src/statusBar.ts` - Status bar
- `test-roast.ts` - Test file with examples

Enjoy roasting your code! 🔥
