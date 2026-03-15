# CompartGuard

> Real-time compartment syndrome monitoring dashboard for orthopedic casts — built for clinicians who need answers at a glance.

<p align="center">
  <img src="public/demo.gif" alt="CompartGuard dashboard cycling through NORMAL, WATCH, WARNING, and CRITICAL states" width="390" />
</p>

---

## What Is This?

Compartment syndrome is a serious surgical emergency where pressure builds up inside a muscle compartment, cutting off blood flow. **CompartGuard** is a web dashboard that pairs with an ESP32-based sensor array embedded in an orthopedic cast to track three key vitals in real time:

| Metric | Sensor | What It Tells You |
|---|---|---|
| **Intracast Pressure** | BMP280 barometric | Direct pressure inside the cast (mmHg) |
| **Capacitance** | Capacitive touch pads | Tissue swelling / fluid accumulation (%) |
| **Temp Gradient** | 2x DS18B20 probes | Temperature difference between proximal and distal limb (°C) |

When readings cross clinical thresholds, the dashboard escalates through four status tiers:

```
NORMAL  →  WATCH  →  WARNING  →  CRITICAL
```

A **CRITICAL** alert means: seek immediate medical attention.

---

## Features

- **Live sensor readings** updating every 500 ms with smooth animated transitions
- **4-tier status system** — color-coded status banner that escalates from green to red
- **60-second trend chart** — canvas-rendered line chart showing pressure, capacitance, and temperature over time
- **Sensor health panel** — at-a-glance view of all connected sensors and their current values
- **Mobile-first design** — optimized for bedside phone/tablet use (dark theme, high contrast)
- **Mock mode** — runs with simulated sensor data when not connected to hardware, great for demos
- **Hardware mode** — fetches live data from the ESP32 `/data` endpoint when accessed on the local network

---

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000?logo=shadcnui&logoColor=white)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the dev server (opens on port 8080)
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) — the dashboard launches in **mock mode** with simulated sensor data that cycles through all four status states automatically.

### Connecting to Hardware

When accessed from the ESP32's local network (IP starting with `192.168.*`), the dashboard automatically switches to **hardware mode** and polls the `/data` endpoint for live sensor readings.

---

## Project Structure

```
src/
├── pages/
│   └── Index.tsx              # Main dashboard page
├── components/
│   ├── TrendChart.tsx         # Canvas-rendered 60s trend chart
│   └── ui/                    # shadcn/ui component library
├── hooks/
│   └── useCompartGuardData.ts # Sensor data hook (mock + hardware)
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Router setup
└── main.tsx                   # Entry point
```

---

## How It Works

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│  ESP32 MCU  │──WiFi──▶│  /data endpoint  │──fetch──▶│  React App  │
│  + Sensors  │         │  (JSON over HTTP) │         │  Dashboard  │
└─────────────┘         └──────────────────┘         └─────────────┘

Sensors:                 JSON payload:                 Display:
• BMP280 (pressure)      { p, c, t, s }               • Big number readouts
• Cap-touch (swelling)                                 • Status banner
• 2x DS18B20 (temp)                                   • Trend chart
                                                       • Sensor health
```

The `useCompartGuardData` hook handles both modes:
- **Mock mode** (default): generates synthetic pressure ramps with correlated capacitance and temperature data
- **Hardware mode**: polls the ESP32 at 500 ms intervals when on the `192.168.*` network

Status classification logic:
- `NORMAL` — all readings within safe range
- `WATCH` — capacitance > 10% (early swelling)
- `WARNING` — pressure > 20 mmHg
- `CRITICAL` — pressure > 30 mmHg AND temperature gradient > 2°C

---

## License

MIT
