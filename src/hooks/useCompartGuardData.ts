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
  const [current, setCurrent] = useState<SensorData>({ p: 0, c: 0, t: 0, s: 'NORMAL' });
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [connected, setConnected] = useState(false);
  const mockPRef = useRef(0);

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
