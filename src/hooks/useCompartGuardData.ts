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

const MAX_POINTS = 120;

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
  const mockPRef = useRef(initP);

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
      const interval = setInterval(() => {
        mockPRef.current += 0.3 + Math.random() * 0.2;
        if (mockPRef.current > 45) mockPRef.current = 0;

        const p = mockPRef.current;
        const c = p * 0.4 + Math.random() * 2;
        const t = p > 15 ? (p - 15) * 0.15 : Math.random() * 0.2;
        let s: SensorData['s'] = 'NORMAL';
        if (c > 10) s = 'WATCH';
        if (p > 20) s = 'WARNING';
        if (p > 30 && t > 2) s = 'CRITICAL';

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
