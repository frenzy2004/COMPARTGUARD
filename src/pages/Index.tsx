import { useCompartGuardData } from '@/hooks/useCompartGuardData';
import TrendChart from '@/components/TrendChart';

const STATUS_STYLES = {
  NORMAL: { bg: 'bg-[hsl(142,50%,10%)]', text: 'text-cg-normal', borderClass: '' },
  WATCH: { bg: 'bg-[hsl(38,50%,10%)]', text: 'text-cg-watch', borderClass: '' },
  WARNING: { bg: 'bg-[hsl(25,50%,10%)]', text: 'text-cg-warning', borderClass: '' },
  CRITICAL: { bg: 'bg-[hsl(0,50%,10%)]', text: 'text-cg-critical', borderClass: 'border-cg-critical' },
};

const Index = () => {
  const { current, history, connected } = useCompartGuardData();
  const { p, c, t, s } = current;
  const style = STATUS_STYLES[s];
  const isCritical = s === 'CRITICAL';
  const isWarning = s === 'WARNING';

  const pPercent = Math.min((p / 30) * 100, 100);
  const cPercent = Math.min((c / 30) * 100, 100);
  const tPercent = Math.min((t / 5) * 100, 100);

  const proximalTemp = 32.1 + t * 0.3;
  const distalTemp = proximalTemp - t;

  return (
    <div className="min-h-screen bg-background text-foreground p-3 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <h1 className="text-sm font-bold tracking-[3px] text-foreground">COMPARTGUARD</h1>
        <div className="flex items-center gap-1.5">
          <span
            className={`block w-2 h-2 rounded-full ${connected ? 'bg-cg-normal animate-pulse-dot' : 'bg-destructive'}`}
          />
          <span className="text-[10px] font-mono-data text-muted-foreground tracking-wider">
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      {/* Status Banner */}
      <div
        className={`${style.bg} ${style.text} rounded py-3 text-center mb-3 transition-colors duration-300 ${isCritical ? 'animate-pulse-critical' : ''}`}
      >
        <p className="text-2xl font-extrabold tracking-[3px] font-mono-data">{s}</p>
        {isCritical && (
          <p className="text-xs mt-1 tracking-wider opacity-90">SEEK IMMEDIATE MEDICAL ATTENTION</p>
        )}
      </div>

      {/* Primary Metric */}
      <div className={`border rounded p-4 mb-3 ${isCritical ? 'border-cg-critical' : 'border-border'} bg-card`}>
        <p className="label-text mb-1">Intracast Pressure</p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-[56px] leading-none font-bold font-mono-data text-cg-pressure ${isWarning ? 'animate-pulse-warning' : ''}`}
          >
            {p.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground font-mono-data">mmHg</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-cg-pressure transition-all duration-300"
              style={{ width: `${pPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono-data text-muted-foreground w-10 text-right">
            {Math.round(pPercent)}%
          </span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={`border rounded p-3 ${isCritical ? 'border-cg-critical' : 'border-border'} bg-card`}>
          <p className="label-text mb-1">Capacitance</p>
          <span className="text-[34px] leading-none font-semibold font-mono-data text-cg-capacitance">
            {c.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground font-mono-data ml-1">%</span>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-cg-capacitance transition-all duration-300"
                style={{ width: `${cPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono-data text-muted-foreground">{Math.round(cPercent)}%</span>
          </div>
        </div>
        <div className={`border rounded p-3 ${isCritical ? 'border-cg-critical' : 'border-border'} bg-card`}>
          <p className="label-text mb-1">Temp Gradient</p>
          <span className="text-[34px] leading-none font-semibold font-mono-data text-cg-temperature">
            {t.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground font-mono-data ml-1">°C</span>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-cg-temperature transition-all duration-300"
                style={{ width: `${tPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono-data text-muted-foreground">{Math.round(tPercent)}%</span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-3">
        <TrendChart history={history} />
      </div>

      {/* Sensor Status */}
      <div className="border border-border rounded bg-card p-3 mb-3">
        <p className="label-text mb-2">SENSOR STATUS</p>
        <div className="space-y-1.5">
          {[
            { name: 'BMP280 Pressure', status: 'ACTIVE', ok: true },
            { name: 'Capacitive Touch', status: 'ACTIVE', ok: true },
            { name: 'DS18B20 Proximal', status: `${proximalTemp.toFixed(1)}°C`, ok: true },
            { name: 'DS18B20 Distal', status: `${distalTemp.toFixed(1)}°C`, ok: true },
            { name: 'Buzzer', status: isWarning || isCritical ? 'BEEPING' : 'ARMED', ok: true },
          ].map(sensor => (
            <div key={sensor.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`block w-1.5 h-1.5 rounded-full ${sensor.ok ? 'bg-cg-normal' : 'bg-destructive'}`} />
                <span className="text-muted-foreground">{sensor.name}</span>
              </div>
              <span className="font-mono-data text-foreground">{sensor.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-2">
        <p className="text-[10px] text-muted-foreground tracking-wider">MIT GrandHack 2026 · v1.0</p>
      </footer>
    </div>
  );
};

export default Index;
