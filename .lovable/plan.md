

# Fix the AI-Slop Aesthetic

## Problem
The dashboard looks like a generic dark-mode SaaS template. Too much padding, too-clean card borders, weak information density. Needs to feel like an ICU bedside monitor.

## Changes

### 1. Layout & Density (`Index.tsx`)
- Hard cap `max-w-md` (448px) centered — this is a phone dashboard, not a desktop app
- Cut padding from `p-3` to `p-2`, card internal padding from `p-4`/`p-3` to `p-2`
- Remove `rounded` from status banner — make it full-bleed, sharp edges
- Reduce all `mb-3` gaps to `mb-2`
- Remove visible card borders in NORMAL/WATCH/WARNING states — use `border-transparent` so cards blend into background. Only show borders in CRITICAL (red)
- Cards should use `bg-card/50` (semi-transparent) instead of solid `bg-card` — subtler separation

### 2. Typography Punch
- Primary pressure number: bump to `text-[64px]` and `font-black` (900 weight)
- Secondary metrics: bump to `text-[38px]`
- Status banner text: `text-3xl` with `tracking-[4px]`
- Unit labels (mmHg, %, °C) smaller and more muted — `text-[10px]`
- "INTRACAST PRESSURE" label: tighter, `text-[10px]` with `tracking-[2px]`

### 3. Progress Bars → Segmented Gauges
- Replace smooth progress bars with a more clinical look: thinner (`h-1`), sharper corners (`rounded-none`), remove the percentage text on the right — let the bar speak for itself
- Or keep minimal but make them `h-[3px]` with `rounded-sm` — razor thin like real instrument displays

### 4. Status Banner
- Remove `rounded` — full width, no border-radius
- Increase vertical padding slightly for impact
- Make the background color more saturated/vivid
- CRITICAL pulse speed: currently fine at 0.5s

### 5. Chart Cleanup (`TrendChart.tsx`)
- Reduce canvas container padding
- Tighter vertical spacing

### 6. Sensor Status Section
- Tighter row spacing — `space-y-1` instead of `space-y-1.5`
- Smaller text: `text-[11px]`
- Remove card border, use subtle top separator line instead

### 7. CSS Cleanup
- Remove `App.css` boilerplate entirely (leftover Vite styles)
- Remove `src/App.css` import if present

## Files Modified
- `src/pages/Index.tsx` — layout density, typography, card styling
- `src/components/TrendChart.tsx` — tighter padding
- `src/index.css` — minor tweaks
- `src/App.css` — delete or empty out

