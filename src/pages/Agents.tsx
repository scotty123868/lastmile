import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Bot,
  Activity,
  Shield,
  Eye,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowRight,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Animation variants ──────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ── Types ────────────────────────────────────────────────── */

interface ActivityEntry {
  time: string;
  type: 'CHECK' | 'PASS' | 'WARN' | 'PREVENT' | 'REPORT';
  message: string;
}

/* ── Data ─────────────────────────────────────────────────── */

const performanceData = [
  { month: 'Oct', prevented: 8, falseAlarms: 5 },
  { month: 'Nov', prevented: 12, falseAlarms: 4 },
  { month: 'Dec', prevented: 15, falseAlarms: 3 },
  { month: 'Jan', prevented: 19, falseAlarms: 2 },
  { month: 'Feb', prevented: 21, falseAlarms: 1 },
  { month: 'Mar', prevented: 23, falseAlarms: 1 },
];

const divisions = ['HCC', 'HTSI', 'HSI', 'HTI', 'HRSI', 'HES', 'HTS'];
const crewNames = [
  'J. Rodriguez', 'M. Thompson', 'K. Nguyen', 'D. Kowalski', 'S. Williams',
  'L. Chen', 'R. Patel', 'A. Martinez', 'T. Jackson', 'B. O\'Connor',
  'C. Washington', 'P. Kim', 'E. Davis', 'N. Garcia', 'H. Wilson',
  'F. Brown', 'G. Taylor', 'I. Anderson', 'W. Thomas', 'V. Robinson',
];
const fraRules = [
  'FRA Part 228.12(a)', 'FRA Part 228.405', 'FRA §228.405(a)(1)',
  'UTU Agreement §4.2', 'IBEW Local 948 §12.1', 'LIUNA District Council §8.3',
];

function generateActivity(): ActivityEntry {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const div = divisions[Math.floor(Math.random() * divisions.length)];
  const name = crewNames[Math.floor(Math.random() * crewNames.length)];
  const crew = Math.floor(Math.random() * 15) + 1;
  const rule = fraRules[Math.floor(Math.random() * fraRules.length)];
  const empCount = Math.floor(Math.random() * 400) + 80;
  const hours = (Math.random() * 4 + 7).toFixed(1);
  const rest = (Math.random() * 6 + 10).toFixed(1);
  const monthHours = Math.floor(Math.random() * 30) + 250;

  const rand = Math.random();
  if (rand < 0.35) {
    return { time, type: 'CHECK', message: `${div} — Verified ${empCount} crew schedules against ${rule}` };
  } else if (rand < 0.65) {
    return { time, type: 'PASS', message: `${name} (${div}, Crew ${crew}) — ${hours}hr shift, ${rest}hr rest. Within spec.` };
  } else if (rand < 0.80) {
    const mgr = crewNames[Math.floor(Math.random() * crewNames.length)];
    return { time, type: 'WARN', message: `${name} (${div}, Crew ${crew}) — Approaching 276hr monthly limit (${monthHours}/276). Alert sent to ${div} Crew Manager ${mgr}.` };
  } else if (rand < 0.93) {
    return { time, type: 'PREVENT', message: `${name} (${div}, Crew ${crew}) — Would exceed 12hr limit at ${Math.floor(Math.random() * 12) + 12}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}. Reassigned to relief crew. Notified Dispatch Supervisor.` };
  } else {
    return { time, type: 'REPORT', message: `Monthly HOS summary for ${div} filed with FRA (0 violations, ${Math.floor(Math.random() * 8) + 1} prevented)` };
  }
}

function initialFeed(): ActivityEntry[] {
  return [
    { time: '3:42:18 PM', type: 'CHECK', message: 'HCC — Verified 432 crew schedules against FRA Part 228.12(a)' },
    { time: '3:42:16 PM', type: 'PASS', message: 'J. Rodriguez (HCC, Crew 7) — 9.5hr shift, 14.5hr rest. Within spec.' },
    { time: '3:42:14 PM', type: 'WARN', message: 'M. Thompson (HTSI, Crew 12) — Approaching 276hr monthly limit (271/276). Alert sent to HTSI Crew Manager S. Williams.' },
    { time: '3:42:11 PM', type: 'CHECK', message: 'HRSI — Verified 129 crew schedules against UTU Agreement §4.2' },
    { time: '3:42:08 PM', type: 'PREVENT', message: 'K. Nguyen (HCC, Crew 3) — Would exceed 12hr limit at 14:30. Reassigned to relief crew. Notified Dispatch Supervisor.' },
    { time: '3:42:05 PM', type: 'PASS', message: 'Batch: HSI ultrasonic testing crews (106 employees) — All compliant' },
    { time: '3:42:02 PM', type: 'CHECK', message: 'HTI — Cross-referencing PTC maintenance windows with crew rest periods' },
    { time: '3:41:58 PM', type: 'PASS', message: 'D. Kowalski (HTI, Signal Crew 2) — 5 consecutive days, 2-day rest scheduled' },
    { time: '3:41:55 PM', type: 'REPORT', message: 'Monthly HOS summary for HCC filed with FRA (0 violations, 23 prevented)' },
  ];
}

/* ── Elapsed timer hook ───────────────────────────────────── */

function useElapsedTimer(startSeconds: number) {
  const [elapsed, setElapsed] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return mins > 0 ? `${mins}m ${secs}s ago` : `${secs}s ago`;
}

function useCountdown(startSeconds: number) {
  const [remaining, setRemaining] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => (s <= 0 ? 780 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return `in ${mins}m ${secs}s`;
}

/* ── Pipeline stage component ─────────────────────────────── */

/* ── Activity Feed Row ────────────────────────────────────── */

function FeedRow({ entry, isNew }: { entry: ActivityEntry; isNew: boolean }) {
  const typeColors: Record<string, string> = {
    CHECK: 'text-slate-500',
    PASS: 'text-emerald-400',
    WARN: 'text-amber-400',
    PREVENT: 'text-red-400 font-semibold',
    REPORT: 'text-blue-400',
  };

  const typeIcons: Record<string, string> = {
    CHECK: 'CHECK  ',
    PASS: '\u2713 PASS  ',
    WARN: '\u26A0 WARN  ',
    PREVENT: '\uD83D\uDEA8 PREVENT',
    REPORT: '\uD83D\uDCCB REPORT ',
  };

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -8, backgroundColor: 'rgba(37, 99, 235, 0.08)' } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0, 0, 0, 0)' }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 py-1.5 font-mono text-[12px] leading-relaxed border-b border-white/[0.03] last:border-0"
    >
      <span className="text-slate-600 whitespace-nowrap flex-shrink-0">[{entry.time}]</span>
      <span className={`whitespace-nowrap flex-shrink-0 ${typeColors[entry.type]}`}>
        {typeIcons[entry.type]}
      </span>
      <span className={typeColors[entry.type]}>{entry.message}</span>
    </motion.div>
  );
}

/* ── Violations Prevented Card ────────────────────────────── */

interface ViolationCase {
  severity: 'green' | 'amber' | 'red';
  title: string;
  date: string;
  employee: string;
  situation: string;
  agentAction: string;
  outcome: string;
  costAvoided: string;
  timeToDetect: string;
  humanReview: string;
}

const violationCases: ViolationCase[] = [
  {
    severity: 'green',
    title: '12-Hour Limit Prevention',
    date: 'March 25, 2026 at 06:14 AM',
    employee: 'Kevin Nguyen, Track Foreman, HCC Crew 3',
    situation: 'Crew 3 scheduled for emergency ballast repair at MP 312.4. K. Nguyen already logged 11.2 hours from overnight shift ending at 22:00. New assignment would start at 06:30, exceeding 12-hour limit by 2:30.',
    agentAction: 'Blocked assignment. Identified J. Ramirez (Crew 7, 0 hours today) as qualified replacement. Notified HCC Dispatch Supervisor.',
    outcome: 'Emergency repair started on time with compliant crew. No FRA violation.',
    costAvoided: '$16,000 FRA penalty + $5,000 est. legal/admin costs',
    timeToDetect: '0.3 seconds (vs. ~45 minutes manual review)',
    humanReview: 'Approved by S. Williams, HCC Crew Manager',
  },
  {
    severity: 'amber',
    title: 'Monthly Hour Limit Warning',
    date: 'March 22, 2026 at 14:30 PM',
    employee: 'Maria Thompson, Conductor, HTSI Crew 12',
    situation: 'M. Thompson at 271 of 276 monthly hours with 9 days remaining. Current schedule would put her at 283 hours by month end.',
    agentAction: 'Generated optimized schedule redistributing 3 shifts to available crew members. Sent proposed schedule to HTSI Crew Manager for approval.',
    outcome: 'Schedule adjusted. M. Thompson will finish month at 274 hours.',
    costAvoided: '$16,000 FRA penalty',
    timeToDetect: 'Caught 9 days before potential violation (manual review typically catches these with <48 hours warning)',
    humanReview: 'Approved with modification by R. Patel, HTSI Ops Manager',
  },
  {
    severity: 'red',
    title: 'Consecutive Days Off Violation',
    date: 'March 19, 2026 at 20:45 PM',
    employee: 'David Kowalski, Signal Maintainer, HTI Signal Crew 2',
    situation: 'D. Kowalski scheduled for 7th consecutive work day. FRA requires minimum 2 consecutive days off after 6 days. Overtime request filed by HTI field supervisor for PTC maintenance window.',
    agentAction: 'Denied overtime assignment. Found that PTC maintenance window could be rescheduled to Thursday (D. Kowalski\'s first day back after mandatory rest). Proposed revised maintenance schedule to HTI planning.',
    outcome: 'PTC maintenance completed Thursday, one day later than requested. No FRA violation. No disruption to revenue service.',
    costAvoided: '$32,000 (FRA penalty + pattern violation multiplier)',
    timeToDetect: '0.1 seconds',
    humanReview: 'Approved by L. Chen, HTI Division Manager',
  },
];

function ViolationCard({ c }: { c: ViolationCase }) {
  const borderColor = c.severity === 'green' ? 'border-l-emerald-500' : c.severity === 'amber' ? 'border-l-amber-500' : 'border-l-red-500';
  return (
    <div className={`bg-surface-raised border border-border rounded-lg border-l-4 ${borderColor} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[14px] font-semibold text-ink">{c.title}</h4>
        <span className="text-[11px] text-ink-tertiary">AGENT: Dispatch | {c.date}</span>
      </div>

      <div className="space-y-3 text-[13px]">
        <div>
          <span className="font-semibold text-ink-secondary">EMPLOYEE:</span>{' '}
          <span className="text-ink">{c.employee}</span>
        </div>
        <div>
          <span className="font-semibold text-ink-secondary">SITUATION:</span>{' '}
          <span className="text-ink-secondary">{c.situation}</span>
        </div>
        <div>
          <span className="font-semibold text-ink-secondary">AGENT ACTION:</span>{' '}
          <span className="text-ink">{c.agentAction}</span>
        </div>
        <div>
          <span className="font-semibold text-ink-secondary">OUTCOME:</span>{' '}
          <span className="text-green">{c.outcome}</span>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 border-t border-border">
          <div>
            <span className="text-[11px] text-ink-tertiary uppercase tracking-wider">Cost Avoided</span>
            <div className="text-[13px] font-semibold text-ink">{c.costAvoided}</div>
          </div>
          <div>
            <span className="text-[11px] text-ink-tertiary uppercase tracking-wider">Time to Detect</span>
            <div className="text-[13px] font-mono text-ink">{c.timeToDetect}</div>
          </div>
          <div>
            <span className="text-[11px] text-ink-tertiary uppercase tracking-wider">Human Review</span>
            <div className="text-[13px] text-ink">{c.humanReview}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page Component ──────────────────────────────────── */

export default function Agents() {
  const lastCheck = useElapsedTimer(47);
  const nextCheck = useCountdown(780);
  const [feed, setFeed] = useState<ActivityEntry[]>(initialFeed);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-generate feed entries
  useEffect(() => {
    const addEntry = () => {
      setFeed((prev) => {
        const entry = generateActivity();
        const next = [entry, ...prev];
        if (next.length > 50) next.length = 50;
        return next;
      });
    };
    const id = setInterval(addEntry, 4000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);

  // Pulsing dot animation class
  const pulsingDot = 'relative after:absolute after:inset-0 after:rounded-full after:bg-green after:animate-ping after:opacity-30';

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <PreliminaryBanner />

      {/* ──────────── SECTION 1: Agent Control Plane ──────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="flex items-center gap-3 mb-1">
          <Bot className="w-5 h-5 text-blue" strokeWidth={1.8} />
          <h1 className="text-[22px] font-semibold text-ink tracking-tight">AI Agents</h1>
        </div>
        <p className="text-[13px] text-ink-tertiary mb-6">
          Named agents deployed across Herzog operations. Monitoring, analyzing, and acting 24/7.
        </p>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Dispatch — HOS Compliance Monitor */}
          <motion.div variants={fadeUp} custom={1} className="bg-surface-raised border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue to-blue/40" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue" strokeWidth={1.8} />
                <span className="text-[13px] font-semibold text-ink tracking-tight">&quot;Dispatch&quot;</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-green ${pulsingDot}`} />
                <span className="text-[11px] font-medium text-green">Active</span>
              </div>
            </div>
            <p className="text-[12px] font-medium text-ink-secondary mb-4">HOS Compliance Monitor</p>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Watching</span>
                <span className="font-medium text-ink">2,800 employees across 7 divisions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Last check</span>
                <span className="font-mono text-ink">{lastCheck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Violations prevented</span>
                <span className="font-semibold text-green">23 this month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Savings this month</span>
                <span className="font-semibold text-ink">$368,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Next scheduled check</span>
                <span className="font-mono text-ink">{nextCheck}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <a href="#dispatch-deep-dive" className="flex items-center gap-1 text-[11px] font-medium text-blue hover:underline">
                Deep dive <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Scout — Track Defect Early Warning */}
          <motion.div variants={fadeUp} custom={2} className="bg-surface-raised border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-500/40" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" strokeWidth={1.8} />
                <span className="text-[13px] font-semibold text-ink tracking-tight">&quot;Scout&quot;</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-green ${pulsingDot}`} />
                <span className="text-[11px] font-medium text-green">Active</span>
              </div>
            </div>
            <p className="text-[12px] font-medium text-ink-secondary mb-4">Track Defect Early Warning</p>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Monitoring</span>
                <span className="font-medium text-ink">4,200 track miles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Defects predicted this week</span>
                <span className="font-medium text-ink">3 (all scheduled)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">False alarm rate</span>
                <span className="font-medium text-green">0.8%</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Ledger — License Waste Scanner */}
          <motion.div variants={fadeUp} custom={3} className="bg-surface-raised border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-500/40" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600" strokeWidth={1.8} />
                <span className="text-[13px] font-semibold text-ink tracking-tight">&quot;Ledger&quot;</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber" />
                <span className="text-[11px] font-medium text-amber">Running (weekly scan)</span>
              </div>
            </div>
            <p className="text-[12px] font-medium text-ink-secondary mb-4">License Waste Scanner</p>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Last scan</span>
                <span className="font-medium text-ink">March 24 — found $47K unused</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Coverage</span>
                <span className="font-medium text-ink">47 software platforms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Next scan</span>
                <span className="font-medium text-ink">March 31</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ──────────── SECTION 2: Deep Dive — Dispatch ──────────── */}
      <div id="dispatch-deep-dive" className="scroll-mt-20">
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue" strokeWidth={1.8} />
            <h2 className="text-[18px] font-semibold text-ink tracking-tight">Deep Dive — &quot;Dispatch&quot; HOS Compliance Agent</h2>
          </div>
          <p className="text-[13px] text-ink-tertiary mb-6">
            How Dispatch monitors FRA Hours-of-Service compliance across all 7 Herzog divisions in real time.
          </p>
        </motion.div>

        {/* 2A: How Dispatch Works — Technical Architecture Pipeline */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">How Dispatch Works</h3>
          <div className="bg-[#0B1120] rounded-xl border border-[#1E293B] p-6 overflow-x-auto">
            <div className="flex gap-3 min-w-[780px]">
              {/* Stage 1: Data Inputs */}
              <div className="flex-1">
                <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 h-full relative">
                  <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-blue/60 to-transparent animate-pulse" />
                  <div className="text-[10px] font-bold text-blue uppercase tracking-widest mb-3">Data Inputs</div>
                  <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                    <div>Kronos/UKG time entries</div>
                    <div>Crew assignments from dispatch</div>
                    <div>Division schedules</div>
                    <div>Union agreements (UTU, IBEW, LIUNA)</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center text-slate-600">
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </div>

              {/* Stage 2: Compliance Engine */}
              <div className="flex-1">
                <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 h-full relative">
                  <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Compliance Engine</div>
                  <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                    <div>FRA Part 228 rules:</div>
                    <div className="pl-2">&bull; 12hr on / 10hr off</div>
                    <div className="pl-2">&bull; 276hr/mo cap</div>
                    <div className="pl-2">&bull; 6 days on / 2 days off</div>
                    <div className="pl-2">&bull; 30hr limbo time</div>
                    <div className="mt-1">UTU/IBEW/LIUNA rules</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center text-slate-600">
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </div>

              {/* Stage 3: Decision Logic */}
              <div className="flex-1">
                <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 h-full relative">
                  <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Decision Logic</div>
                  <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                    <div className="text-emerald-400">Within spec: PASS</div>
                    <div className="text-amber-400">Approaching limit: WARN</div>
                    <div className="text-red-400">Would exceed: PREVENT</div>
                    <div className="text-blue-400">Already over: REPORT</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center text-slate-600">
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </div>

              {/* Stage 4: Action */}
              <div className="flex-1">
                <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 h-full relative">
                  <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Action</div>
                  <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                    <div><span className="text-emerald-400">&check;</span> Clear: Log &amp; move</div>
                    <div><span className="text-amber-400">&triangledown;</span> Warning: Alert crew mgr</div>
                    <div><span className="text-red-400">&times;</span> Violation: Block + escalate</div>
                    <div><span className="text-blue-400">&#9634;</span> Report: FRA filing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2B: Live Agent Activity Feed */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Live Agent Activity Feed</h3>
          <div className="bg-[#0B1120] rounded-xl border border-[#1E293B] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Live Feed — Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${pulsingDot}`} />
                <span className="text-[10px] text-emerald-400 font-mono">streaming</span>
              </div>
            </div>
            <div ref={feedRef} className="px-5 py-3 max-h-[360px] overflow-y-auto">
              {feed.map((entry, i) => (
                <FeedRow key={`${entry.time}-${i}`} entry={entry} isNew={i === 0} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 2C: Violations Prevented — Evidence Cards */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Violations Prevented — Evidence Cards</h3>
          <div className="space-y-4">
            {violationCases.map((c, i) => (
              <ViolationCard key={i} c={c} />
            ))}
          </div>
        </motion.div>

        {/* 2D: Agent Performance Dashboard */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Agent Performance Dashboard</h3>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Violations Prevented', value: '23', sub: 'this month', trend: 'up', trendVal: 'from 18 last month' },
              { label: 'Time to Detect', value: '0.2s', sub: 'avg', trend: 'down', trendVal: 'vs. 42min manual' },
              { label: 'False Alarm Rate', value: '1.2%', sub: '', trend: 'down', trendVal: 'from 3.8% in Oct' },
              { label: 'Crew Utilization', value: '+4.7%', sub: '', trend: 'up', trendVal: 'optimized scheduling' },
              { label: 'FRA Compliance', value: '100%', sub: '0 violations in 6 months', trend: null, trendVal: '' },
            ].map((m, i) => (
              <div key={i} className="bg-surface-raised border border-border rounded-lg p-4">
                <div className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-[20px] font-semibold text-ink tracking-tight">{m.value}</div>
                {m.sub && <div className="text-[11px] text-ink-tertiary">{m.sub}</div>}
                {m.trend && (
                  <div className={`flex items-center gap-1 mt-1 text-[11px] ${m.trend === 'up' ? 'text-green' : 'text-green'}`}>
                    {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{m.trendVal}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[13px] font-semibold text-ink">Agent Performance Over Time</h4>
                <p className="text-[11px] text-ink-tertiary mt-0.5">Agent improves through continuous learning from human review feedback</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={performanceData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="preventedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #E4E4E7',
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="prevented"
                  name="Violations Prevented"
                  stroke="#2563EB"
                  fill="url(#preventedGrad)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="falseAlarms"
                  name="False Alarms"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#DC2626' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 2E: Agent Configuration */}
        <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Agent Configuration</h3>
          <div className="bg-surface-raised border border-border rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Basic Info + Data Sources */}
              <div className="space-y-5">
                {/* Basic Info */}
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Agent Info</div>
                  <div className="space-y-1.5 text-[12px] font-mono">
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Agent</span><span className="text-ink">Dispatch</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Version</span><span className="text-ink">2.4.1</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Deployed</span><span className="text-ink">October 14, 2025</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Last Updated</span><span className="text-ink">March 22, 2026</span></div>
                  </div>
                </div>

                {/* Data Sources */}
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Data Sources</div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      ['Kronos/UKG Time & Attendance', 'real-time sync'],
                      ['Crew Management System', '5-minute polling'],
                      ['Division Schedules', 'daily import'],
                      ['Union Agreements Database', 'manual update, last: Feb 2026'],
                      ['FRA Part 228 Rules Engine', 'auto-updated with regulatory changes'],
                    ].map(([name, detail]) => (
                      <div key={name} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-ink">{name} <span className="text-ink-tertiary">({detail})</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Channels */}
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Notification Channels</div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      ['Crew Manager', 'direct alert, <30 sec'],
                      ['Division Ops Manager', 'daily digest'],
                      ['FRA Compliance Officer', 'weekly summary'],
                      ['VP Operations', 'monthly board report'],
                    ].map(([name, detail]) => (
                      <div key={name} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-ink">{name} <span className="text-ink-tertiary">({detail})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Compliance Rules + Human Review */}
              <div className="space-y-5">
                {/* Compliance Rules Active */}
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Compliance Rules Active</div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      '12-hour on-duty limit (FRA §228.405)',
                      '10-hour minimum off-duty (FRA §228.405)',
                      '276 monthly hour cap (FRA §228.405)',
                      '6/2 consecutive day rule (FRA §228.405)',
                      '30-hour limbo time (Company policy)',
                      'UTU Agreement §4.2 (rest period provisions)',
                      'IBEW Local 948 §12.1 (signal maintainer limits)',
                      'LIUNA District Council §8.3 (track worker provisions)',
                    ].map((rule) => (
                      <div key={rule} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-ink">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Human Review Required For */}
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Human Review Required For</div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      'Assignment blocks (PREVENT actions)',
                      'Schedule modifications affecting >3 employees',
                      'Override requests from field supervisors',
                      'FRA filing submissions',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="text-amber mt-0.5 flex-shrink-0">&bull;</span>
                        <span className="text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ──────────── SECTION 3: The Pitch Line ──────────── */}
      <motion.div variants={fadeUp} custom={10} initial="hidden" animate="visible">
        <div className="bg-surface-sunken border border-border rounded-xl p-8 text-center">
          <p className="text-[18px] font-semibold text-ink tracking-tight mb-2">
            Your workforce didn&apos;t double. It got smarter.
          </p>
          <p className="text-[13px] text-ink-tertiary max-w-2xl mx-auto">
            Dispatch monitors 2,800 employees 24/7 at 0.2-second response time — something that would
            require 12 full-time compliance officers doing manual schedule reviews.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
