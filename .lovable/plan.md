

# Lock Layout to Mobile

The dashboard already looks solid at 390px. The issue is that on desktop (1032px wide), the `max-w-md` container floats in the center with wasted space on both sides, making it look like a mobile mockup rather than a real app.

## Changes

### 1. Force mobile viewport feel on all screens (`Index.tsx`)
- Keep `max-w-md mx-auto` but add `min-h-screen` and remove any extra outer padding that creates a "floating card" look on desktop
- Add `meta viewport` lock in `index.html` if not already present

### 2. Add viewport meta tag (`index.html`)
- Ensure `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">` is set — prevents pinch zoom, locks scale like a native app

### 3. Hide desktop awkwardness (`Index.tsx`)
- On screens wider than `md`, add a dark background that fills the full viewport so the dashboard doesn't look like it's floating — or stretch the dark background full-width behind the constrained content
- The outer wrapper should be `min-h-screen bg-background` with the content constrained inside

### 4. Safe area padding for notched phones (`index.css`)
- Add `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` padding so content doesn't hide behind notches/home indicators
- Add `viewport-fit=cover` to the viewport meta tag

## Files Modified
- `index.html` — viewport meta tag update
- `src/pages/Index.tsx` — outer wrapper styling
- `src/index.css` — safe area insets

