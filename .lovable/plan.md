

# CompartGuard Dashboard — Implementation Plan

## What We're Building
A single `index.html` file containing a clinical-grade real-time monitoring dashboard for the CompartGuard compartment syndrome detection device. Zero dependencies, works offline, served directly from an ESP32.

**Note:** Since Lovable uses React/Vite, we'll build this as a React page that matches the exact spec — same dark clinical aesthetic, same data flow, same mock mode. The visual output will be identical. You can later extract the compiled HTML if needed for ESP32, or copy the design patterns into a standalone file.

## Pages & Components

### Single Dashboard Page (`/`)
1. **Header** — "COMPARTGUARD" branding + green pulsing connection dot labeled "LIVE"
2. **Status Banner** — Full-width, changes background/text color across 4 states (NORMAL/WATCH/WARNING/CRITICAL), pulses at 2Hz in CRITICAL
3. **Primary Metric** — Intracast Pressure: 56px monospaced number, mmHg unit, progress bar showing % toward danger (30 mmHg)
4. **Secondary Metrics Row** — Capacitance (%) and Temp Gradient (°C) side-by-side, 34px monospaced, each with progress bars
5. **Trend Chart** — Canvas-based 60-second live chart (120 data points), 3 color-coded line series with smooth bezier curves, dashed WARNING (y=20) and DANGER (y=30) reference lines, subtle area fills
6. **Sensor Status Table** — 5 rows: BMP280, Capacitive Touch, DS18B20 Proximal, DS18B20 Distal, Buzzer — each with status indicator
7. **Footer** — "MIT GrandHack 2026 · v1.0"

## Design System
- **Background:** `#0B0F19`, Surface: `#111827`, Border: `#1F2937`
- **Monospaced font** for ALL numeric values (clinical, not decorative)
- **Metric colors:** Pressure `#3B82F6`, Capacitance `#8B5CF6`, Temp `#F59E0B`
- **State colors:** Normal `#22C55E`, Watch `#F59E0B`, Warning `#F97316`, Critical `#EF4444`
- Dense layout, no gradients, no glassmorphism, no shadows — ICU monitor aesthetic
- Mobile-first portrait layout

## State Transitions
- **NORMAL** → green banner, calm display
- **WATCH** (cap > 10%) → amber banner, capacitance highlights
- **WARNING** (pressure > 20) → orange banner, pressure pulses, buzzer shows "BEEPING"
- **CRITICAL** (pressure > 30 AND temp > 2°C) → red pulsing banner, red borders on all cards, "SEEK IMMEDIATE MEDICAL ATTENTION"

## Data & Mock Mode
- Mock mode auto-activates (simulates pressure rising 0→45 then resetting)
- Cycles through all 4 states naturally every ~75 seconds
- Same `updateDashboard()` function handles both real and mock data
- Real mode: fetches `GET /data` every 500ms, expects `{"p","c","t","s"}`

