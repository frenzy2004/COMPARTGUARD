

# Kill the Remaining AI-Slop

## Root Cause
The dashboard still uses "component-based" visual hierarchy (cards, gaps, backgrounds) instead of "instrument-based" hierarchy (one surface, thin dividers, packed data).

## Changes

### 1. Seed Initial Data (`useCompartGuardData.ts`)
- Initialize `mockPRef` to `5` instead of `0` so the first render shows real-looking values (~5 mmHg, ~3% cap, ~0.1°C temp, NORMAL state)
- Pre-fill the history array with a few initial data points so the chart isn't empty on load

### 2. Remove All Card Backgrounds (`Index.tsx`)
- Remove `bg-card/50` from every section — let everything sit directly on `bg-background`
- Replace card borders with `border-t border-border` thin separator lines between sections only
- Remove the `cardBg` and `cardBorder` variables entirely
- In CRITICAL state, add red border to the OUTER container, not individual cards

### 3. Full-Bleed Status Banner
- Remove all horizontal padding/margin from the banner — it should touch the edges of the container
- Use negative margins (`-mx-2`) so it bleeds past the container padding

### 4. Tighter Vertical Rhythm
- Change all `mb-2` to `mb-1` between sections
- Remove `mt-2` from progress bar wrappers — put them directly under the number
- Sensor status: reduce `space-y-1` to `space-y-0.5`

### 5. Chart Container (`TrendChart.tsx`)
- Remove `bg-card/50` background from chart wrapper — transparent, part of the surface
- Keep only the `border-t border-border` separator

### 6. CRITICAL State = Outer Border Only
- Instead of bordering each card, put a single `border-2 border-cg-critical` on the outermost `div` when critical — the whole screen gets a red frame, like an alarm state on a real monitor

## Files
- `src/hooks/useCompartGuardData.ts` — seed initial mock value, pre-fill history
- `src/pages/Index.tsx` — remove card backgrounds, tighten spacing, full-bleed banner, outer critical border
- `src/components/TrendChart.tsx` — remove card background

