import { useRef, useEffect } from 'react';
import type { DataPoint } from '@/hooks/useCompartGuardData';

interface TrendChartProps {
  history: DataPoint[];
}

const COLORS = {
  pressure: '#3B82F6',
  capacitance: '#8B5CF6',
  temperature: '#F59E0B',
  warning: '#F59E0B',
  danger: '#EF4444',
  grid: 'rgba(255,255,255,0.06)',
  text: '#6B7280',
};

const Y_MAX = 50;
const PADDING = { top: 16, right: 12, bottom: 32, left: 36 };

export default function TrendChart({ history }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const plotW = w - PADDING.left - PADDING.right;
    const plotH = h - PADDING.top - PADDING.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let y = 0; y <= Y_MAX; y += 10) {
      const py = PADDING.top + plotH - (y / Y_MAX) * plotH;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, py);
      ctx.lineTo(w - PADDING.right, py);
      ctx.stroke();

      ctx.fillStyle = COLORS.text;
      ctx.font = '10px "SF Mono", "JetBrains Mono", "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(y), PADDING.left - 6, py + 3);
    }

    // Reference lines
    const drawRefLine = (yVal: number, color: string, label: string) => {
      const py = PADDING.top + plotH - (yVal / Y_MAX) * plotH;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, py);
      ctx.lineTo(w - PADDING.right, py);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.font = '9px "SF Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(label, w - PADDING.right, py - 4);
    };
    drawRefLine(20, COLORS.warning, 'WARNING');
    drawRefLine(30, COLORS.danger, 'DANGER');

    // X axis labels
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px "SF Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('-60s', PADDING.left, h - 8);
    ctx.textAlign = 'right';
    ctx.fillText('NOW', w - PADDING.right, h - 8);

    // Draw series
    const drawLine = (
      getValue: (d: DataPoint) => number,
      color: string,
      fillOpacity: number
    ) => {
      if (history.length < 2) return;
      const points: [number, number][] = history.map((d, i) => {
        const x = PADDING.left + (i / 119) * plotW;
        const v = Math.min(getValue(d), Y_MAX);
        const y = PADDING.top + plotH - (v / Y_MAX) * plotH;
        return [x, y];
      });

      // Area fill
      ctx.beginPath();
      ctx.moveTo(points[0][0], PADDING.top + plotH);
      points.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(points[points.length - 1][0], PADDING.top + plotH);
      ctx.closePath();
      ctx.fillStyle = color.replace(')', `, ${fillOpacity})`).replace('rgb', 'rgba');
      // Use hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      ctx.fillStyle = `rgba(${r},${g},${b},${fillOpacity})`;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Smooth bezier
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev[0] + curr[0]) / 2;
        ctx.bezierCurveTo(cpx, prev[1], cpx, curr[1], curr[0], curr[1]);
      }
      ctx.stroke();
    };

    drawLine(d => d.p, COLORS.pressure, 0.06);
    drawLine(d => d.c, COLORS.capacitance, 0.05);
    drawLine(d => d.t * 10, COLORS.temperature, 0.05); // scale temp for visibility
  }, [history]);

  return (
    <div className="border border-border rounded bg-card p-3">
      <p className="label-text mb-2">TREND — LAST 60 SECONDS</p>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 200 }}
      />
      <div className="flex items-center gap-4 mt-2">
        {[
          { label: 'Pressure', color: 'bg-cg-pressure' },
          { label: 'Capacitance', color: 'bg-cg-capacitance' },
          { label: 'Temp (×10)', color: 'bg-cg-temperature' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`block w-3 h-[2px] ${item.color}`} />
            <span className="text-[10px] font-mono-data text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
