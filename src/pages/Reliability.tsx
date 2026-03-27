import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Settings,
  TrendingUp,
  Target,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Data ────────────────────────────────────────────────── */

const workflowData = [
  { name: 'Track Geometry Analysis', testsPerDay: 124, accuracy: 98.2, falsePos: 0.3, falseNeg: 0.1, fraCompliant: true, status: 'Certified' as const },
  { name: 'Crew Scheduling Optimization', testsPerDay: 89, accuracy: 95.4, falsePos: 1.2, falseNeg: 0.8, fraCompliant: true, status: 'Certified' as const },
  { name: 'Equipment Failure Prediction', testsPerDay: 67, accuracy: 94.1, falsePos: 2.3, falseNeg: 1.1, fraCompliant: true, status: 'Certified' as const },
  { name: 'Project Cost Estimation', testsPerDay: 112, accuracy: 93.8, falsePos: 1.8, falseNeg: 1.4, fraCompliant: null, status: 'Monitoring' as const },
  { name: 'Safety Compliance Reporting', testsPerDay: 156, accuracy: 97.9, falsePos: 0.4, falseNeg: 0.2, fraCompliant: true, status: 'Certified' as const },
  { name: 'Material & Ballast Logistics', testsPerDay: 78, accuracy: 92.6, falsePos: 2.8, falseNeg: 1.6, fraCompliant: null, status: 'Monitoring' as const },
  { name: 'PTC Signal Verification', testsPerDay: 98, accuracy: 99.1, falsePos: 0.1, falseNeg: 0.05, fraCompliant: true, status: 'Certified' as const },
  { name: 'Environmental Compliance', testsPerDay: 45, accuracy: 96.3, falsePos: 0.9, falseNeg: 0.5, fraCompliant: true, status: 'Certified' as const },
  { name: 'Fleet Utilization Analysis', testsPerDay: 56, accuracy: 94.7, falsePos: 1.5, falseNeg: 0.9, fraCompliant: null, status: 'Monitoring' as const },
  { name: 'Dispatch Route Optimization', testsPerDay: 22, accuracy: 91.2, falsePos: 3.1, falseNeg: 2.0, fraCompliant: null, status: 'In Review' as const },
];

function generateTrendData() {
  const data = [];
  const now = new Date();
  const startScore = 91.8;
  const endScore = 94.2;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const progress = (29 - i) / 29;
    const noise = (Math.sin(i * 1.3) * 0.4) + (Math.cos(i * 0.7) * 0.3);
    const score = Math.round((startScore + (endScore - startScore) * progress + noise) * 10) / 10;
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.min(Math.max(score, 90.5), 96),
    });
  }
  return data;
}

const trendData = generateTrendData();

const reviewQueue = [
  {
    title: 'Track Defect Classification',
    flag: 'Flagged for Review',
    confidence: 78,
    details: [
      { label: 'Location', value: 'Mile marker 247.3, BNSF mainline' },
      { label: 'AI says', value: '"Class B defect — monitor within 30 days"' },
      { label: 'Reviewer', value: 'Pending assignment' },
    ],
    priority: 'High' as const,
  },
  {
    title: 'Crew Certification Expiry',
    flag: 'Automated Override',
    confidence: 92,
    details: [
      { label: 'Employee', value: '[REDACTED] — Locomotive Engineer' },
      { label: 'AI says', value: '"Certification expires in 14 days — auto-scheduled renewal"' },
      { label: 'Status', value: 'Auto-approved (above 90% threshold)' },
    ],
    priority: 'Medium' as const,
  },
  {
    title: 'Cost Estimate Variance',
    flag: 'Manual Check Required',
    confidence: 71,
    details: [
      { label: 'Project', value: 'I-70 Bridge Rehabilitation' },
      { label: 'AI says', value: '"$2.4M estimate (23% above historical average)"' },
      { label: 'Reviewer', value: 'Pending — PM review required' },
    ],
    priority: 'Medium' as const,
  },
  {
    title: 'Signal System Anomaly',
    flag: 'Flagged',
    confidence: 84,
    details: [
      { label: 'Location', value: 'PTC Zone 12, MP 89-94' },
      { label: 'AI says', value: '"Intermittent signal degradation — possible wayside device failure"' },
      { label: 'Reviewer', value: 'Assigned to HTI signal team' },
    ],
    priority: 'Critical' as const,
  },
  {
    title: 'Environmental Report',
    flag: 'Auto-Approved',
    confidence: 97,
    details: [
      { label: 'Project', value: 'Green Group — wetland mitigation compliance' },
      { label: 'AI says', value: '"All parameters within EPA/state limits"' },
      { label: 'Status', value: 'Auto-approved' },
    ],
    priority: 'Low' as const,
  },
];

const configItems = [
  { label: 'Confidence Threshold', value: '85%', note: 'Auto-approve above, flag below', icon: Target },
  { label: 'Test Frequency', value: 'Continuous', note: 'Every AI output tested', icon: Activity },
  { label: 'Drift Alert', value: '>3% in 7 days', note: 'Trigger when accuracy drops', icon: AlertTriangle },
  { label: 'FRA Compliance Mode', value: 'Enabled', note: 'Safety-critical outputs require 95%+ confidence', icon: ShieldCheck },
  { label: 'Human Review SLA', value: 'Critical < 2h', note: 'Standard < 24 hours', icon: Clock },
];

/* ── Helpers ──────────────────────────────────────────────── */

function statusBadge(status: 'Certified' | 'Monitoring' | 'In Review') {
  const styles = {
    Certified: 'bg-[#22C55E]/10 text-[#22C55E]',
    Monitoring: 'bg-blue/10 text-blue',
    'In Review': 'bg-[#F59E0B]/10 text-[#F59E0B]',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[status]}`}>
      {status === 'Certified' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'Monitoring' && <Eye className="w-3 h-3" />}
      {status === 'In Review' && <Clock className="w-3 h-3" />}
      {status}
    </span>
  );
}

function priorityBadge(priority: 'Critical' | 'High' | 'Medium' | 'Low') {
  const styles = {
    Critical: 'bg-[#EF4444]/10 text-[#EF4444]',
    High: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    Medium: 'bg-blue/10 text-blue',
    Low: 'bg-ink-faint/20 text-ink-tertiary',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function confidenceColor(c: number) {
  if (c >= 90) return '#22C55E';
  if (c >= 80) return '#F59E0B';
  return '#EF4444';
}

function CountUp({ end, duration = 1.2 }: { end: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <>{value.toFixed(1)}</>;
}

/* ── Component ───────────────────────────────────────────── */

export default function Reliability() {
  const heroMetrics = [
    { label: 'Accuracy', value: 96.8, suffix: '%', color: '#22C55E' },
    { label: 'Consistency', value: 93.1, suffix: '%', color: '#22C55E' },
    { label: 'Compliance', value: 97.4, suffix: '%', color: '#22C55E' },
    { label: 'Drift Detection', value: 2.1, suffix: '% drift', color: '#F59E0B' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <h1 className="text-2xl font-semibold text-ink tracking-tight mt-2">AI Reliability Testing</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Continuous validation ensuring AI outputs meet FRA safety standards
        </p>
      </div>

      {/* ── Section 1: Trust Score Hero ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6 lg:p-8"
      >
        <div className="text-center mb-6">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-widest mb-2">
            Overall Trust Score
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#22C55E' }}>
              <CountUp end={94.2} />
            </span>
            <span className="text-2xl font-semibold" style={{ color: '#22C55E' }}>%</span>
          </div>
          <p className="text-xs text-ink-tertiary mt-2">
            Across 62 active workflows, 847 test cases executed daily
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((m) => (
            <div key={m.label} className="text-center p-3 rounded-lg bg-surface/60 border border-border/50">
              <p className="text-[11px] font-medium text-ink-tertiary mb-1">{m.label}</p>
              <p className="text-xl font-bold" style={{ color: m.color }}>
                {m.value}{m.suffix}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 2: Workflow Reliability Matrix ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-border bg-surface-raised overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Workflow Reliability Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-surface/40">
                <th className="text-left px-4 py-2.5 font-medium text-ink-tertiary">Workflow</th>
                <th className="text-right px-4 py-2.5 font-medium text-ink-tertiary">Tests/Day</th>
                <th className="text-right px-4 py-2.5 font-medium text-ink-tertiary">Accuracy</th>
                <th className="text-right px-4 py-2.5 font-medium text-ink-tertiary">False Positive</th>
                <th className="text-right px-4 py-2.5 font-medium text-ink-tertiary">False Negative</th>
                <th className="text-center px-4 py-2.5 font-medium text-ink-tertiary">FRA Compliant</th>
                <th className="text-center px-4 py-2.5 font-medium text-ink-tertiary">Status</th>
              </tr>
            </thead>
            <tbody>
              {workflowData.map((w, i) => (
                <tr
                  key={w.name}
                  className={`border-b border-border/50 hover:bg-surface/60 transition-colors ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surface/20'
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-ink">{w.name}</td>
                  <td className="px-4 py-2.5 text-right text-ink-secondary tabular-nums">{w.testsPerDay}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    <span style={{ color: w.accuracy >= 95 ? '#22C55E' : w.accuracy >= 93 ? '#F59E0B' : '#EF4444' }}>
                      {w.accuracy}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-secondary tabular-nums">{w.falsePos}%</td>
                  <td className="px-4 py-2.5 text-right text-ink-secondary tabular-nums">{w.falseNeg}%</td>
                  <td className="px-4 py-2.5 text-center">
                    {w.fraCompliant === true && (
                      <span className="text-[#22C55E]">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      </span>
                    )}
                    {w.fraCompliant === null && (
                      <span className="text-ink-faint text-[11px]">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">{statusBadge(w.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Section 3: Reliability Trend Chart ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">30-Day Reliability Trend</h2>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                interval={4}
              />
              <YAxis
                domain={[90, 100]}
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20,22,28,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E2E8F0',
                }}
                formatter={(value) => [`${value}%`, 'Trust Score']}
              />
              <ReferenceArea y1={90} y2={95} fill="#EF4444" fillOpacity={0.04} />
              <ReferenceArea y1={95} y2={100} fill="#22C55E" fillOpacity={0.04} />
              <ReferenceLine
                y={95}
                stroke="#F59E0B"
                strokeDasharray="6 3"
                label={{
                  value: 'Target: 95%',
                  position: 'right',
                  fill: '#F59E0B',
                  fontSize: 10,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#22C55E"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#22C55E', stroke: '#1a1c24', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Section 4: Human-in-the-Loop Queue ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Human-in-the-Loop Review Queue</h2>
          <span className="ml-auto text-[11px] text-ink-tertiary">{reviewQueue.length} items</span>
        </div>
        <div className="space-y-3">
          {reviewQueue.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface-raised overflow-hidden"
            >
              {/* Confidence bar */}
              <div className="h-1 bg-surface">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.confidence}%`,
                    backgroundColor: confidenceColor(item.confidence),
                  }}
                />
              </div>
              <div className="p-4 lg:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-[13px] font-semibold text-ink">
                      {item.title}
                      <span className="ml-2 text-[11px] font-normal text-ink-tertiary">
                        — {item.flag}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium" style={{ color: confidenceColor(item.confidence) }}>
                        AI confidence: {item.confidence}%
                      </span>
                      {item.confidence < 85 && (
                        <span className="text-[10px] text-ink-faint">(below 85% threshold)</span>
                      )}
                    </div>
                  </div>
                  {priorityBadge(item.priority)}
                </div>
                <div className="space-y-1">
                  {item.details.map((d) => (
                    <div key={d.label} className="flex gap-2 text-[12px]">
                      <span className="text-ink-tertiary min-w-[70px]">{d.label}:</span>
                      <span className="text-ink-secondary">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 5: Testing Configuration ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Testing Configuration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {configItems.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="p-3 rounded-lg bg-surface/60 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-ink-tertiary" strokeWidth={1.7} />
                  <span className="text-[11px] font-medium text-ink-tertiary">{c.label}</span>
                </div>
                <p className="text-[14px] font-semibold text-ink">{c.value}</p>
                <p className="text-[10px] text-ink-faint mt-0.5">{c.note}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
