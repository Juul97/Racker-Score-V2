# RacketScore - Professional Score Tracker

A mobile-first Progressive Web App (PWA) for tracking scores across multiple racket sports.

## 🚀 How to Run the App

### ⚠️ IMPORTANT: Do NOT Use "Go Live"

**"Go Live" (Live Server extension) will NOT work!** This is a Vite + React + TypeScript app that requires compilation. You must use the Vite development server.

### ✅ Correct Steps:

1. **Open Terminal** in the project folder:
   ```bash
   cd "/Users/juulderijcke/Desktop/NXT Link/PROJECTEN/RACKET SCORE"
   ```

2. **Install dependencies** (if not done already):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   - Look for the URL in the terminal output (usually `http://localhost:5173`)
   - Copy and paste it into your browser
   - Or click the link if your terminal supports it

### 📖 Need More Help?

See **[QUICK_START.md](QUICK_START.md)** for detailed step-by-step instructions, troubleshooting tips, and common issues.

### 🔗 Quick URLs

- **Development:** http://localhost:5173 (after `npm run dev`)
- **Production Preview:** http://localhost:4173 (after `npm run build && npm run preview`)

---

## Supported Sports

- **Tennis** 🎾
- **Padel** 🎾
- **Badminton** 🏸
- **Table Tennis** 🏓
- **Squash** 🎾
- **Pickleball** 🥎

## Features

- ✅ Sport-specific scoring rules
- ✅ Match history with LocalStorage persistence
- ✅ Dark/Light theme support
- ✅ Haptic feedback and sound effects
- ✅ PWA support (installable, offline-capable)
- ✅ Mobile-first responsive design
- ✅ Match summary with sharing
- ✅ Configurable settings per sport

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

> **Note:** Keep the terminal open while developing. The server needs to stay running.

### Build

Create a production build:

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run build
npm run preview
```

Then open **http://localhost:4173** in your browser.

## Project Structure

```
src/
├── components/
│   ├── sports/          # Sport-specific dashboards
│   ├── Layout.tsx       # Main layout with header
│   ├── HamburgerMenu.tsx
│   ├── MatchHistory.tsx
│   ├── MatchSummary.tsx
│   ├── Settings.tsx
│   ├── Timer.tsx
│   └── PlayerButton.tsx
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Scoring logic utilities
└── App.tsx              # Main app component
```

## Scoring Rules

### Tennis/Padel
- Game scoring: 0 → 15 → 30 → 40 → Game
- Deuce/Advantage system (or No-Ad mode)
- Sets to 6 games (win by 2)
- Tiebreak at 6-6 (first to 7, win by 2)
- Best of 3 or 5 sets

### Badminton
- Rally scoring (first to 21, win by 2)
- Maximum 30 points
- Best of 3 games
- Side switch at 11 points

### Table Tennis
- Rally scoring (first to 11, win by 2)
- Serve changes every 2 points (every 1 point at deuce)
- Best of 3, 5, or 7 games

### Squash
- Rally scoring (first to 11, win by 2)
- Best of 3 or 5 games

### Pickleball
- Side-out scoring (only serving team scores)
- Singles or doubles mode
- Target score: 11, 15, or 21 (win by 2)
- Best of 3 games

## 🔧 Troubleshooting

### Common Issues

**Problem: Blank page or "Cannot find module"**
- Make sure you ran `npm install` first
- Restart the dev server: `npm run stop && npm run dev`
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

**Problem: Port 5173 already in use**
- Stop all servers: `npm run stop`
- Or use a different port: `npm run dev -- --port 3000`

**Problem: "Go Live" doesn't work**
- This is expected! Vite apps require the Vite dev server
- Always use `npm run dev` instead

**Problem: Multiple servers running**
- Stop all: `npm run stop`
- Start fresh: `npm run dev`

For more detailed troubleshooting, see [QUICK_START.md](QUICK_START.md).

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` or `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run stop` | Stop all Vite servers |
| `npm run check-port` | Check if port 5173 is available |
| `npm run clean` | Clean build cache |

## Technologies

- React 18+ with TypeScript
- Tailwind CSS
- Zustand for state management
- Vite for build tooling
- vite-plugin-pwa for PWA support

## License

MIT
