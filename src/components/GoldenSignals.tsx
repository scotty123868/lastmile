import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { getGoldenSignals } from '../data/goldenSignals';
import type { GoldenSignal } from '../data/goldenSignals';

/* ── Mini Sparkline SVG ───────────────────────────────── */

function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-fill-${color.replace('#', '')})`}
      />
      {/* line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* dot at end */}
      {(() => {
        const lastPt = points.split(' ').pop()?.split(',');
        if (!lastPt) return null;
        return <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} />;
      })()}
    </svg>
  );
}

/* ── Gauge bar for saturation ─────────────────────────── */

function GaugeBar({ percent }: { percent: number }) {
  const color = percent > 80 ? '#F59E0B' : percent > 90 ? '#EF4444' : '#10B981';
  return (
    <div className="w-full mt-2">
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ── Trend icon ───────────────────────────────────────── */

function TrendIcon({ direction, positive }: { direction: 'up' | 'down' | 'flat'; positive: boolean }) {
  const color = positive ? 'text-green-400' : 'text-amber-400';
  if (direction === 'up') return <TrendingUp className={`w-3 h-3 ${color}`} />;
  if (direction === 'down') return <TrendingDown className={`w-3 h-3 ${color}`} />;
  return <Minus className={`w-3 h-3 text-gray-400`} />;
}

/* ── Badge ────────────────────────────────────────────── */

function Badge({ text, color }: { text: string; color: 'green' | 'amber' | 'red' }) {
  const styles: Record<string, string> = {
    green: 'bg-green-500/15 text-green-400',
    amber: 'bg-amber-500/15 text-amber-400',
    red: 'bg-red-500/15 text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[color]}`}>
      {text}
    </span>
  );
}

/* ── Signal Card ──────────────────────────────────────── */

function SignalCard({ signal, index, sparkColor }: { signal: GoldenSignal; index: number; sparkColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="bg-surface-raised border border-border rounded-xl px-4 py-3.5 flex flex-col gap-2 min-w-0"
    >
      {/* Header: name + badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">{signal.name}</span>
        {signal.badge && <Badge text={signal.badge.text} color={signal.badge.color} />}
      </div>

      {/* Value + trend */}
      <div className="flex items-center gap-2">
        <span className="text-[17px] font-bold text-ink leading-tight">{signal.value}</span>
      </div>

      {/* Sparkline + trend indicator */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <Sparkline data={signal.sparkline} color={sparkColor} />
        <div className="flex items-center gap-1 shrink-0">
          <TrendIcon direction={signal.trend.direction} positive={signal.trend.positive} />
          <span className={`text-[10px] font-medium ${signal.trend.positive ? 'text-green-400' : 'text-amber-400'}`}>
            {signal.trend.value}
          </span>
        </div>
      </div>

      {/* Gauge bar for saturation */}
      {signal.gauge !== undefined && <GaugeBar percent={signal.gauge} />}
    </motion.div>
  );
}

/* ── Golden Signals Section ───────────────────────────── */

export default function GoldenSignals() {
  const { company } = useCompany();
  const signals = getGoldenSignals(company.id);

  const cards: { signal: GoldenSignal; color: string }[] = [
    { signal: signals.throughput, color: '#3B82F6' },
    { signal: signals.errorRate, color: '#10B981' },
    { signal: signals.latency, color: '#8B5CF6' },
    { signal: signals.saturation, color: signals.saturation.gauge && signals.saturation.gauge > 80 ? '#F59E0B' : '#10B981' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[14px] font-semibold text-ink">Platform Health — Golden Signals</h2>
        <span className="text-[11px] text-ink-faint">7-day trend</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <SignalCard key={c.signal.name} signal={c.signal} index={i} sparkColor={c.color} />
        ))}
      </div>
    </motion.div>
  );
}
