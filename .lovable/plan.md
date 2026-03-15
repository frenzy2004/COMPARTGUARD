

# Lovable-Hosted vs Single HTML: Tradeoffs

## Option A: Keep Using Lovable (Published URL)

**How it works:** Publish the dashboard on Lovable (`yourapp.lovable.app`). The ESP32 only serves the `/data` JSON endpoint. The phone opens the Lovable URL and fetches sensor data from the ESP32's local IP.

**Problems:**
1. **Mixed content block** — Lovable serves over HTTPS. The ESP32 is on local WiFi at `http://192.168.x.x`. Browsers block HTTPS pages from fetching HTTP endpoints. This is a hard browser security restriction — no workaround without a proxy.
2. **Requires internet** — The patient/doctor needs internet access to load the dashboard. In a field hospital, disaster zone, or rural clinic, this defeats the purpose.
3. **Needs ESP32 IP hardcoded or discovered** — The Lovable-hosted page has no way to know what local IP the ESP32 is on without manual configuration.

## Option B: ESP32 Serves Everything (Single HTML)

**How it works:** The ESP32 serves both the dashboard HTML and the `/data` endpoint. Phone connects to ESP32's WiFi hotspot, opens `192.168.4.1`, gets everything locally.

**Why it works better:**
- Zero internet dependency — works in any environment
- No CORS/mixed-content issues — same origin
- No configuration needed — one IP, one device
- Fully self-contained medical device

## Recommendation

**Stick with the single HTML export.** The ESP32-as-server architecture is fundamental to this being a reliable medical device. Lovable is perfect as your design/prototyping tool — keep iterating here, then export the final design to vanilla HTML when you're ready.

You're already well under the 30KB limit (~9-12KB estimated). There's no technical pressure to avoid the single file approach.

