# 🚀 Quick Start Guide - RacketScore

## ⚠️ IMPORTANT: Why "Go Live" Doesn't Work

**DO NOT use "Go Live" or Live Server extension!** 

This is a **Vite + React + TypeScript** app. It requires the Vite development server to:
- Compile TypeScript to JavaScript
- Bundle React components
- Process JSX syntax
- Handle module imports

"Go Live" is just a static file server - it cannot compile your code, so you'll see a blank page or errors.

---

## ✅ Correct Way to Run the App

### Step 1: Open Terminal in Project Folder

1. Open your terminal/command prompt
2. Navigate to the project folder:
   ```bash
   cd "/Users/juulderijcke/Desktop/NXT Link/PROJECTEN/RACKET SCORE"
   ```

### Step 2: Start the Development Server

Run this command:
```bash
npm run dev
```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

**Copy and paste this URL into your browser:**
```
http://localhost:5173
```

**OR** click the link if your terminal supports it.

---

## 🎯 What You Should See

When you open `http://localhost:5173`, you should see:
- The RacketScore app with a header
- Hamburger menu (☰) in the top left
- Tennis dashboard (default sport)
- "No active match" message with a "Start New Match" button

---

## 🔧 Troubleshooting

### Problem: "Cannot find module" or blank page

**Solution:**
1. Make sure you ran `npm install` first
2. Stop the server (Ctrl+C) and restart with `npm run dev`
3. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Problem: Port 5173 is already in use

**Solution:**
1. Find and stop the process using port 5173:
   ```bash
   lsof -ti:5173 | xargs kill
   ```
2. Or use a different port:
   ```bash
   npm run dev -- --port 3000
   ```
3. Then open `http://localhost:3000`

### Problem: "npm: command not found"

**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Problem: Multiple servers running

**Solution:**
Use the helper script to stop all Vite servers:
```bash
npm run stop
```
Or manually:
```bash
pkill -f vite
```
Then start fresh:
```bash
npm run dev
```

### Problem: Check if port is available

**Solution:**
Check if port 5173 is in use:
```bash
npm run check-port
```

### Problem: Still seeing blank page

**Solution:**
1. Open browser Developer Tools (F12 or Cmd+Option+I)
2. Check the Console tab for errors
3. Check the Network tab to see if files are loading
4. Make sure you're opening `http://localhost:5173` (not `file://`)

---

## 📝 Quick Reference

| Action | Command |
|--------|---------|
| Start dev server | `npm run dev` or `npm start` |
| Stop all Vite servers | `npm run stop` |
| Check if port is available | `npm run check-port` |
| Clean build cache | `npm run clean` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Install dependencies | `npm install` |

---

## 🌐 URLs

- **Development:** http://localhost:5173
- **Production Preview:** http://localhost:4173 (after `npm run build && npm run preview`)

---

## 💡 Tips

1. **Keep the terminal open** - The dev server needs to keep running
2. **Hot reload works** - Changes to code will automatically refresh in the browser
3. **Check the terminal** - Error messages will appear there
4. **Use the browser console** - Press F12 to see JavaScript errors

---

## 🆘 Still Having Issues?

1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

**Remember:** Always use `npm run dev` and open `http://localhost:5173` in your browser! 🎾
