# Web Clipper — Second Brain

Universal Web Clipper for Chrome. Capture anything from the web in under 1 second.

![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **Quick Capture** — Save text, links, images, and notes with keyboard shortcuts
- **Side Panel UI** — Clean, modern interface accessible from any webpage
- **Multiple Content Types** — Supports text snippets, URLs, images, and quick notes
- **Spaces** — Organize clips into different spaces
- **Search** — Find your clips instantly with full-text search
- **Drag & Drop** — Drop images and files directly into the clipper
- **Dark/Light Theme** — Choose your preferred appearance
- **Keyboard Shortcuts**
  - `Cmd/Ctrl + Shift + S` — Open Web Clipper
  - `Cmd/Ctrl + Shift + E` — Capture selection

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **Chrome Extension API** — Side Panel, Context Menus, Service Worker
- **IndexedDB** (via `idb`) — Local storage

## Getting Started

### Prerequisites

- Node.js 18+
- Chrome 114+ (for Side Panel support)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ArtemKx1/web-clipper.git
cd web-clipper
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development

```bash
npm run dev
```

Then reload the extension in `chrome://extensions`.

## Project Structure

```
├── public/
│   └── manifest.json          # Chrome extension manifest
├── src/
│   ├── components/            # React components
│   ├── lib/                    # Utilities (db, settings)
│   ├── types/                 # TypeScript types
│   ├── App.tsx                 # Main sidebar UI
│   └── index.css              # Tailwind styles
├── background/
│   └── service-worker.ts      # Background service worker
├── content/
│   └── content-script.ts      # Content script for capture
└── scripts/
    └── build-all.mjs          # Build scripts
```

## License

MIT
