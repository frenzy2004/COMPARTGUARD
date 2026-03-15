import { useState, useEffect, useCallback, useRef } from 'react';

export interface SensorData {
  p: number; // pressure mmHg
  c: number; // capacitance %
  t: number; // temperature differential °C
  s: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
}

export interface DataPoint extends SensorData {
  ts: number;
}

const MAX_POINTS = 60;

export function useCompartGuardData() {
  const initP = 5;
  const initC = initP * 0.4 + 1;
  const initT = Math.random() * 0.2;
  const initData: SensorData = { p: initP, c: initC, t: initT, s: 'NORMAL' };
  const now = Date.now();
  const initHistory: DataPoint[] = Array.from({ length: 10 }, (_, i) => ({
    p: initP + (Math.random() - 0.5),
    c: initC + (Math.random() - 0.5),
    t: initT + Math.random() * 0.1,
    s: 'NORMAL' as const,
    ts: now - (10 - i) * 500,
  }));

  const [current, setCurrent] = useState<SensorData>(initData);
  const [history, setHistory] = useState<DataPoint[]>(initHistory);
  const [connected, setConnected] = useState(false);
  const mockTickRef = useRef(0);
  const mockCapRef = useRef(1);

  const pushData = useCallback((data: SensorData) => {
    setCurrent(data);
    setHistory(prev => {
      const next = [...prev, { ...data, ts: Date.now() }];
      return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
    });
  }, []);

  useEffect(() => {
    const isMock = !window.location.hostname.startsWith('192.168');

    if (isMock) {
      setConnected(true);
      // Full cycle: 30s ramp (60 ticks) + 10s decay (20 ticks) + 5s baseline (10 ticks) = 45s (90 ticks)
      // Full cycle: 30s ramp (60 ticks) + 10s decay (20 ticks) + 5s baseline (10 ticks) = 45s
      const RAMP_TICKS = 60;
      const DECAY_TICKS = 20;
      const REST_TICKS = 10;
      const CYCLE = RAMP_TICKS + DECAY_TICKS + REST_TICKS;

      const interval = setInterval(() => {
        mockTickRef.current = (mockTickRef.current + 1) % CYCLE;
        const tick = mockTickRef.current;
        const noise = () => (Math.random() - 0.5) * 0.8;

        let p: number;
        let t: number;

        if (tick < RAMP_TICKS) {
          // Balloon inflation — exponential curve like real swelling
          const progress = tick / RAMP_TICKS; // 0 to 1
          const curve = progress * progress * progress;
          p = 5 + curve * 65 + noise(); // 5 → ~70 mmHg
          p = Math.max(0, p);
        } else if (tick < RAMP_TICKS + DECAY_TICKS) {
          // Balloon deflation — pressure gradually drops
          const decayProgress = (tick - RAMP_TICKS) / DECAY_TICKS;
          const easeOut = 1 - (1 - decayProgress) * (1 - decayProgress);
          p = 70 - easeOut * 60 + noise(); // 70 → ~10 mmHg
          p = Math.max(0, p);
        } else {
          // Rest at baseline
          p = 5 + noise() * 0.5;
          p = Math.max(0, p);
        }

        // Capacitance — lags behind pressure (swelling doesn't reabsorb instantly)
        const targetCap = p * 0.4 + 1;
        mockCapRef.current += (targetCap - mockCapRef.current) * 0.06 + noise() * 0.2;
        mockCapRef.current = Math.max(0, mockCapRef.current);
        const c = mockCapRef.current;

        // Temperature gradient — clinically accurate:
        // Low pressure = warm limb (good blood flow), near-zero gradient
        // As pressure rises past ~30 mmHg, blood flow starts restricting → distal cools → gradient rises
        // At 60+ mmHg blood flow is cut off → large gradient (cold distal)
        if (p > 30) {
          t = ((p - 30) / 40) * 4.0 + noise() * 0.1;
        } else {
          t = Math.random() * 0.15;
        }
        t = Math.max(0, t);

        // Status thresholds
        let s: SensorData['s'] = 'NORMAL';
        if (p > 15 || c > 8) s = 'WATCH';
        if (p > 30) s = 'WARNING';
        if (p > 50 && t > 1.5) s = 'CRITICAL';

        pushData({ p, c, t, s });
      }, 500);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(async () => {
        try {
          const res = await fetch('/data');
          const data: SensorData = await res.json();
          setConnected(true);
          pushData(data);
        } catch {
          setConnected(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [pushData]);

  return { current, history, connected };
}
