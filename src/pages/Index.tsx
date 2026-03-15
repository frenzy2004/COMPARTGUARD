import { useCompartGuardData } from '@/hooks/useCompartGuardData';
import TrendChart from '@/components/TrendChart';

const STATUS_STYLES = {
  NORMAL: { bg: 'bg-[hsl(142,40%,94%)]', text: 'text-cg-normal', border: 'border-transparent' },
  WATCH: { bg: 'bg-[hsl(38,50%,92%)]', text: 'text-cg-watch', border: 'border-transparent' },
  WARNING: { bg: 'bg-[hsl(24,60%,92%)]', text: 'text-cg-warning', border: 'border-transparent' },
  CRITICAL: { bg: 'bg-[hsl(0,60%,94%)]', text: 'text-cg-critical', border: 'border-cg-critical' },
};

const Index = () => {
  const { current, history, connected } = useCompartGuardData();
  const { p, c, t, s } = current;
  const style = STATUS_STYLES[s];
  const isCritical = s === 'CRITICAL';
  const isWarning = s === 'WARNING';

  const pPercent = Math.min((p / 70) * 100, 100);
  const cPercent = Math.min((c / 30) * 100, 100);
  const tPercent = Math.min((t / 5) * 100, 100);

  const proximalTemp = 32.1 + t * 0.3;
  const distalTemp = proximalTemp - t;

  return (
    <div className="h-screen bg-background overflow-hidden">
    <div className={`h-full text-foreground p-2 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] max-w-md mx-auto flex flex-col ${isCritical ? 'border-x-2 border-cg-critical' : ''}`}>
      {/* Status Banner */}
      <div
        className={`${style.bg} ${style.text} -mx-2 py-2 text-center mb-0.5 transition-colors duration-300 ${isCritical ? 'animate-pulse-critical' : ''}`}
      >
        <p className="text-3xl font-black tracking-[4px] font-mono-data">{s}</p>
        {isCritical && (
          <p className="text-[10px] mt-1 tracking-[2px] opacity-90">SEEK IMMEDIATE MEDICAL ATTENTION</p>
        )}
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        <span
          className={`block w-2 h-2 rounded-full ${connected ? 'bg-cg-normal animate-pulse-dot' : 'bg-destructive'}`}
        />
        <span className="text-[11px] font-mono-data text-muted-foreground font-semibold tracking-wider">
          {connected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Primary Metric */}
      <div className="border-t border-border pt-1.5 mb-0.5">
        <p className="text-[13px] uppercase tracking-[2px] text-foreground font-bold mb-1">Intracast Pressure</p>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-[72px] leading-none font-black font-mono-data text-cg-pressure ${isWarning ? 'animate-pulse-warning' : ''}`}
          >
            {p.toFixed(1)}
          </span>
          <span className="text-[13px] text-foreground font-semibold font-mono-data">mmHg</span>
        </div>
        <div className="w-full h-[3px] bg-muted overflow-hidden">
          <div
            className="h-full bg-cg-pressure transition-all duration-300"
            style={{ width: `${pPercent}%` }}
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-2 border-t border-border pt-1.5 mb-0.5">
        <div>
          <p className="text-[13px] uppercase tracking-[2px] text-foreground font-bold mb-1">Capacitance</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[44px] leading-none font-black font-mono-data text-cg-capacitance">
              {c.toFixed(1)}
            </span>
            <span className="text-[13px] text-foreground font-semibold font-mono-data">%</span>
          </div>
          <div className="w-full h-[3px] bg-muted overflow-hidden">
            <div
              className="h-full bg-cg-capacitance transition-all duration-300"
              style={{ width: `${cPercent}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-[13px] uppercase tracking-[2px] text-foreground font-bold mb-1">Temp Gradient</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[44px] leading-none font-black font-mono-data text-cg-temperature">
              {t.toFixed(1)}
            </span>
            <span className="text-[13px] text-foreground font-semibold font-mono-data">°C</span>
          </div>
          <div className="w-full h-[3px] bg-muted overflow-hidden">
            <div
              className="h-full bg-cg-temperature transition-all duration-300"
              style={{ width: `${tPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-0.5">
        <TrendChart history={history} />
      </div>

      {/* Sensor Status */}
      <div className="border-t border-border pt-1.5 mb-0.5">
        <p className="text-[14px] uppercase tracking-[2px] text-foreground font-bold mb-1">SENSOR STATUS</p>
        <div className="space-y-1">
          {[
            { name: 'BMP280 Pressure', status: 'ACTIVE', ok: true },
            { name: 'Capacitive Touch', status: 'ACTIVE', ok: true },
            { name: 'DS18B20 Proximal', status: `${proximalTemp.toFixed(1)}°C`, ok: true },
            { name: 'DS18B20 Distal', status: `${distalTemp.toFixed(1)}°C`, ok: true },
            
          ].map(sensor => (
            <div key={sensor.name} className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-2">
                <span className={`block w-2.5 h-2.5 rounded-full ${sensor.ok ? 'bg-cg-normal' : 'bg-destructive'}`} />
                <span className="text-foreground font-semibold">{sensor.name}</span>
              </div>
              <span className="font-mono-data text-foreground font-bold">{sensor.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  );
};
export default Index;
