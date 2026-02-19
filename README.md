# CW Trainer

A browser-based Morse code training app. Words appear on screen and you tap them out in Morse code using the spacebar. Short press for dit, long press for dah. Letters are decoded and validated in real-time.

## Features

- 5 difficulty levels controlling word length (3-4 letters up to 12 letters)
- Timed rounds (2 minutes) with 10 seconds per word
- Live morse decode with per-letter validation
- Score tracking with end-of-round summary
- Player name and difficulty persisted in localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in your terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

React 19, TypeScript, Vite
