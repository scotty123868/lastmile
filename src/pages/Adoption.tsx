import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Zap,
  Star,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Data ─────────────────────────────────────────────────── */

const divisions = [
  { name: 'Herzog Technologies', abbr: 'HTI', industry: 'Technology & PTC Systems', adoption: 52, aiUsers: 161, totalUsers: 310, deployed: 7, scoped: 10, status: 'Leading' as const },
  { name: 'Herzog Services - Rail Testing', abbr: 'HSI', industry: 'Rail Testing & Inspection', adoption: 48, aiUsers: 106, totalUsers: 220, deployed: 4, scoped: 6, status: 'Leading' as const },
  { name: 'Herzog Transit Services', abbr: 'HTSI', industry: 'Transit Operations', adoption: 42, aiUsers: 202, totalUsers: 480, deployed: 5, scoped: 10, status: 'On Track' as const },
  { name: 'Herzog Contracting Corp', abbr: 'HCC', industry: 'Railroad Construction', adoption: 36, aiUsers: 432, totalUsers: 1200, deployed: 8, scoped: 22, status: 'On Track' as const },
  { name: 'Herzog Railroad Services', abbr: 'HRSI', industry: 'Railroad Maintenance', adoption: 34, aiUsers: 129, totalUsers: 380, deployed: 3, scoped: 8, status: 'On Track' as const },
  { name: 'Herzog Energy', abbr: 'HE', industry: 'Energy Services', adoption: 28, aiUsers: 34, totalUsers: 120, deployed: 1, scoped: 4, status: 'Needs Attention' as const },
  { name: 'Green Group LLC', abbr: 'GG', industry: 'Environmental Services', adoption: 22, aiUsers: 20, totalUsers: 90, deployed: 0, scoped: 2, status: 'Needs Attention' as const },
];

const timelineData = [
  { month: 'Oct 2025', actual: 8 },
  { month: 'Nov', actual: 14 },
  { month: 'Dec', actual: 19 },
  { month: 'Jan 2026', actual: 26 },
  { month: 'Feb', actual: 32 },
  { month: 'Mar', actual: 38 },
  { month: 'Apr', projected: 45 },
  { month: 'May', projected: 52 },
  { month: 'Jun', projected: 58 },
  { month: 'Jul', projected: 65 },
  { month: 'Aug', projected: 72 },
  { month: 'Sep', projected: 78 },
];

const aiTools = [
  { name: 'Crew Scheduler Pro', users: 124, usage: '2,100 schedules', satisfaction: 4.2, divisions: 'HCC, HTSI' },
  { name: 'Compliance Reporter', users: 112, usage: '890 reports', satisfaction: 4.5, divisions: 'All' },
  { name: 'Track Geometry AI', users: 89, usage: '340 analyses', satisfaction: 4.6, divisions: 'HSI' },
  { name: 'Project Estimator', users: 78, usage: '156 estimates', satisfaction: 3.9, divisions: 'HCC' },
  { name: 'Equipment Predictor', users: 67, usage: '890 predictions', satisfaction: 4.4, divisions: 'HRSI' },
  { name: 'PTC Signal Assistant', users: 52, usage: '420 checks', satisfaction: 4.8, divisions: 'HTI' },
  { name: 'Fleet Optimizer', users: 45, usage: '1,200 routes', satisfaction: 4.1, divisions: 'HCC, HTSI' },
];

const blockers = [
  {
    color: 'red' as const,
    title: 'Custom Dispatch System',
    desc: 'Not yet connected (blocks 8 workflows in HCC)',
    action: 'IT credentials requested — ETA 1 week',
  },
  {
    color: 'amber' as const,
    title: 'Herzog Energy training',
    desc: 'Only 28% adoption, teams unfamiliar with tools',
    action: 'Training sessions scheduled for April 7-11',
  },
  {
    color: 'amber' as const,
    title: 'Green Group data quality',
    desc: 'Environmental data needs cleanup before AI can process',
    action: 'Data normalization in progress — 60% complete',
  },
  {
    color: 'green' as const,
    title: 'PTC Signal confidence',
    desc: 'AI model accuracy improved from 96.2% to 99.1%',
    action: 'FRA certification submitted — awaiting approval',
  },
];

/* ── Helpers ───────────────────────────────────────────────── */

const statusBadge = (status: 'Leading' | 'On Track' | 'Needs Attention') => {
  if (status === 'Leading') return 'bg-green-muted text-green';
  if (status === 'On Track') return 'bg-blue-muted text-blue';
  return 'bg-amber-muted text-amber';
};

const blockerDot = (color: 'red' | 'amber' | 'green') => {
  if (color === 'red') return 'bg-red';
  if (color === 'amber') return 'bg-amber';
  return 'bg-green';
};

const blockerBorder = (color: 'red' | 'amber' | 'green') => {
  if (color === 'red') return 'border-red/20';
  if (color === 'amber') return 'border-amber/20';
  return 'border-green/20';
};

function AnimatedNumber({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}{suffix}</>;
}

/* ── Component ─────────────────────────────────────────────── */

export default function Adoption() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">AI Adoption Dashboard</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-muted border border-green/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
            </span>
            <span className="text-[11px] font-semibold text-green">Live</span>
          </span>
        </div>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Enterprise-wide AI deployment progress across 7 divisions
        </p>
      </div>

      {/* ─── Section 1: Overall Adoption Hero ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-surface-raised rounded-xl border border-border p-6"
      >
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium text-ink-secondary">Overall AI Adoption</p>
            <p className="text-4xl font-bold text-ink tracking-tight mt-1">
              <AnimatedNumber value={38} />
            </p>
          </div>
          <p className="text-[12px] text-ink-tertiary">Target: 80% by Q4 2026</p>
        </div>

        {/* Main progress bar */}
        <div className="relative w-full h-4 rounded-full bg-surface-sunken overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '38%' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #D97706 0%, #16A34A 100%)' }}
          />
          {/* Target marker */}
          <div className="absolute top-0 bottom-0 w-px bg-ink-faint" style={{ left: '80%' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-ink-faint">0%</span>
          <span className="text-[10px] text-ink-faint" style={{ marginRight: '16%' }}>80% target</span>
          <span className="text-[10px] text-ink-faint">100%</span>
        </div>

        {/* Phase indicators */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* Phase 1 */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-green-muted border border-green/10">
            <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" strokeWidth={2} />
            <div>
              <p className="text-[12px] font-semibold text-ink">Phase 1: Assessment</p>
              <p className="text-[11px] text-green font-medium">Complete</p>
            </div>
          </div>
          {/* Phase 2 */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-muted border border-blue/10">
            <span className="w-2 h-2 rounded-full bg-blue animate-pulse-live flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-ink">Phase 2: Pilot Deployments</p>
              <p className="text-[11px] text-blue font-medium">In Progress</p>
            </div>
          </div>
          {/* Phase 3 */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-sunken border border-border">
            <Clock className="w-4 h-4 text-ink-faint flex-shrink-0" strokeWidth={2} />
            <div>
              <p className="text-[12px] font-semibold text-ink-tertiary">Phase 3: Enterprise Rollout</p>
              <p className="text-[11px] text-ink-faint font-medium">Upcoming</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Section 2: Division Breakdown ───────────────────── */}
      <div>
        <h2 className="text-[15px] font-semibold text-ink mb-4">Division Adoption Breakdown</h2>
        <div className="grid gap-3">
          {divisions.map((div, i) => (
            <motion.div
              key={div.abbr}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="bg-surface-raised rounded-xl border border-border p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Name + badge */}
                <div className="sm:w-56 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">{div.name}</span>
                    <span className="text-[10px] text-ink-tertiary font-mono">({div.abbr})</span>
                  </div>
                  <p className="text-[11px] text-ink-tertiary mt-0.5">{div.industry}</p>
                </div>

                {/* Progress bar + percentage */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full bg-surface-sunken overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${div.adoption}%` }}
                        transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${div.status === 'Leading' ? 'bg-green' : div.status === 'On Track' ? 'bg-blue' : 'bg-amber'}`}
                      />
                    </div>
                    <span className="text-[14px] font-bold text-ink w-10 text-right tabular-nums">
                      <AnimatedNumber value={div.adoption} />
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[12px] font-semibold text-ink tabular-nums">{div.aiUsers}/{div.totalUsers}</p>
                    <p className="text-[10px] text-ink-faint">AI Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-semibold text-ink tabular-nums">{div.deployed}/{div.scoped}</p>
                    <p className="text-[10px] text-ink-faint">Workflows</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBadge(div.status)}`}>
                    {div.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Section 3: Adoption Timeline ────────────────────── */}
      <div>
        <h2 className="text-[15px] font-semibold text-ink mb-4">Adoption Timeline</h2>
        <div className="bg-surface-raised rounded-xl border border-border p-5">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="adoptionActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adoptionProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E4E4E7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A1A1AA' }} tickLine={false} axisLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#A1A1AA' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E4E7' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <ReferenceLine y={80} stroke="#D97706" strokeDasharray="6 3" label={{ value: '80% Target', position: 'right', fontSize: 10, fill: '#D97706' }} />
              <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} fill="url(#adoptionActual)" dot={{ r: 3, fill: '#2563EB' }} connectNulls={false} />
              <Area type="monotone" dataKey="projected" stroke="#16A34A" strokeWidth={2} strokeDasharray="6 3" fill="url(#adoptionProjected)" dot={{ r: 3, fill: '#16A34A', strokeDasharray: '0' }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 px-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-blue" />
              <span className="text-[11px] text-ink-tertiary">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-green border-dashed" style={{ borderTop: '1.5px dashed #16A34A', background: 'transparent' }} />
              <span className="text-[11px] text-ink-tertiary">Projected</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section 4: Active AI Tools ──────────────────────── */}
      <div>
        <h2 className="text-[15px] font-semibold text-ink mb-4">Active AI Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {aiTools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * i }}
              className="bg-surface-raised rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[13px] font-semibold text-ink">{tool.name}</p>
                  <p className="text-[11px] text-ink-tertiary mt-0.5">{tool.divisions}</p>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-muted">
                  <Star className="w-3 h-3 text-amber" fill="currentColor" strokeWidth={0} />
                  <span className="text-[11px] font-semibold text-amber tabular-nums">{tool.satisfaction}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <div>
                  <span className="font-semibold text-ink tabular-nums">{tool.users}</span>
                  <span className="text-ink-tertiary ml-1">users</span>
                </div>
                <div>
                  <span className="font-semibold text-ink tabular-nums">{tool.usage}</span>
                  <span className="text-ink-tertiary ml-1">/week</span>
                </div>
              </div>
              {/* Satisfaction bar */}
              <div className="mt-3 h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber"
                  style={{ width: `${(tool.satisfaction / 5) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Section 5: Key Blockers & Actions ───────────────── */}
      <div>
        <h2 className="text-[15px] font-semibold text-ink mb-4">Key Blockers & Actions</h2>
        <div className="grid gap-3">
          {blockers.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 * i }}
              className={`bg-surface-raised rounded-xl border ${blockerBorder(b.color)} p-4`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${blockerDot(b.color)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink">{b.title}</p>
                  <p className="text-[12px] text-ink-secondary mt-0.5">{b.desc}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-tertiary">
                    <Zap className="w-3 h-3" strokeWidth={2} />
                    <span>{b.action}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
