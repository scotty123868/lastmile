import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calculator,
  Package,
  Briefcase,
  Mic,
  Radio,
  User,
  X,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* -- Animation variants ------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* -- Types -------------------------------------------------------------- */

interface ActivityEntry {
  time: string;
  type: 'CHECK' | 'PASS' | 'WARN' | 'PREVENT' | 'REPORT';
  message: string;
}

interface AgentDef {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  status: 'active' | 'running';
  statusLabel: string;
  accent: 'blue' | 'green';
  metrics: { label: string; value: string }[];
  description: string;
  deepDiveLink?: string;
}

/* -- Data --------------------------------------------------------------- */

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
  'FRA Part 228.12(a)', 'FRA Part 228.405', 'FRA \u00A7228.405(a)(1)',
  'UTU Agreement \u00A74.2', 'IBEW Local 948 \u00A712.1', 'LIUNA District Council \u00A78.3',
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
    return { time, type: 'CHECK', message: `${div} \u2014 Verified ${empCount} crew schedules against ${rule}` };
  } else if (rand < 0.65) {
    return { time, type: 'PASS', message: `${name} (${div}, Crew ${crew}) \u2014 ${hours}hr shift, ${rest}hr rest. Within spec.` };
  } else if (rand < 0.80) {
    const mgr = crewNames[Math.floor(Math.random() * crewNames.length)];
    return { time, type: 'WARN', message: `${name} (${div}, Crew ${crew}) \u2014 Approaching 276hr monthly limit (${monthHours}/276). Alert sent to ${div} Crew Manager ${mgr}.` };
  } else if (rand < 0.93) {
    return { time, type: 'PREVENT', message: `${name} (${div}, Crew ${crew}) \u2014 Would exceed 12hr limit at ${Math.floor(Math.random() * 12) + 12}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}. Reassigned to relief crew. Notified Dispatch Supervisor.` };
  } else {
    return { time, type: 'REPORT', message: `Monthly HOS summary for ${div} filed with FRA (0 violations, ${Math.floor(Math.random() * 8) + 1} prevented)` };
  }
}

function initialFeed(): ActivityEntry[] {
  return [
    { time: '3:42:18 PM', type: 'CHECK', message: 'HCC \u2014 Verified 432 crew schedules against FRA Part 228.12(a)' },
    { time: '3:42:16 PM', type: 'PASS', message: 'J. Rodriguez (HCC, Crew 7) \u2014 9.5hr shift, 14.5hr rest. Within spec.' },
    { time: '3:42:14 PM', type: 'WARN', message: 'M. Thompson (HTSI, Crew 12) \u2014 Approaching 276hr monthly limit (271/276). Alert sent to HTSI Crew Manager S. Williams.' },
    { time: '3:42:11 PM', type: 'CHECK', message: 'HRSI \u2014 Verified 129 crew schedules against UTU Agreement \u00A74.2' },
    { time: '3:42:08 PM', type: 'PREVENT', message: 'K. Nguyen (HCC, Crew 3) \u2014 Would exceed 12hr limit at 14:30. Reassigned to relief crew. Notified Dispatch Supervisor.' },
    { time: '3:42:05 PM', type: 'PASS', message: 'Batch: HSI ultrasonic testing crews (106 employees) \u2014 All compliant' },
    { time: '3:42:02 PM', type: 'CHECK', message: 'HTI \u2014 Cross-referencing PTC maintenance windows with crew rest periods' },
    { time: '3:41:58 PM', type: 'PASS', message: 'D. Kowalski (HTI, Signal Crew 2) \u2014 5 consecutive days, 2-day rest scheduled' },
    { time: '3:41:55 PM', type: 'REPORT', message: 'Monthly HOS summary for HCC filed with FRA (0 violations, 23 prevented)' },
  ];
}

/* -- Agent Definitions -------------------------------------------------- */

const operationsAgents: AgentDef[] = [
  {
    id: 'dispatch',
    name: 'Dispatch',
    subtitle: 'HOS Compliance Monitor',
    icon: Shield,
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    metrics: [
      { label: 'Watching', value: '2,800 employees across 7 divisions' },
      { label: 'Violations prevented', value: '23 this month' },
      { label: 'Savings this month', value: '$368,000' },
    ],
    description: 'Monitors FRA Hours-of-Service compliance across all 7 Herzog divisions in real time. Catches violations before they happen, automatically reassigns crew, and files FRA reports. Zero violations since deployment in October 2025.',
    deepDiveLink: '#dispatch-deep-dive',
  },
  {
    id: 'scout',
    name: 'Scout',
    subtitle: 'Track Defect Early Warning',
    icon: Eye,
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    metrics: [
      { label: 'Monitoring', value: '4,200 track miles' },
      { label: 'Defects predicted this week', value: '3 (all scheduled)' },
      { label: 'False alarm rate', value: '0.8%' },
    ],
    description: 'Combines geometry car data, weather patterns, tonnage history, and inspection records to predict track defects 2-3 weeks before they become safety issues. Prioritizes maintenance crew deployment across the network.',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    subtitle: 'License Waste Scanner',
    icon: Search,
    status: 'running',
    statusLabel: 'Running (weekly scan)',
    accent: 'blue',
    metrics: [
      { label: 'Last scan', value: 'March 24 \u2014 found $47K unused' },
      { label: 'Coverage', value: '47 software platforms' },
      { label: 'Next scan', value: 'March 31' },
    ],
    description: 'Audits software license usage across all divisions weekly. Identifies unused seats, duplicate subscriptions, and consolidation opportunities. Has recovered $312K in wasted software spend since October.',
  },
  {
    id: 'estimator',
    name: 'Estimator',
    subtitle: 'Project Bid Intelligence',
    icon: Calculator,
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    metrics: [
      { label: 'Watching', value: '14 active bid packages' },
      { label: 'Accuracy', value: '94% within \u00B18% of winning bid' },
      { label: 'Last analysis', value: 'I-70 Bridge Rehab \u2014 flagged $180K underestimate' },
      { label: 'Savings this quarter', value: '$420,000 in avoided overruns' },
    ],
    description: 'Analyzes project bid packages against historical data to catch cost estimation errors before submission. Rail projects have 44.7% average cost overrun \u2014 Estimator reduces this to under 12%. Compares material costs, labor rates, and timeline assumptions against 15 years of completed projects.',
  },
  {
    id: 'quartermaster',
    name: 'Quartermaster',
    subtitle: 'Cross-Division Procurement',
    icon: Package,
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    metrics: [
      { label: 'Duplicate orders caught', value: '7 this month ($34K saved)' },
      { label: 'Volume discount opportunities', value: '3 active negotiations' },
      { label: 'Material catalog coverage', value: '73% standardized' },
    ],
    description: 'Monitors purchasing across all 7 divisions to catch duplicate orders, negotiate volume discounts, and standardize material catalogs. When HCC orders rail ties and HRSI orders the same ties from a different vendor at a higher price, Quartermaster catches it.',
  },
];

const intelligenceAgents: AgentDef[] = [
  {
    id: 'chief',
    name: 'Chief',
    subtitle: 'Executive Briefing Agent',
    icon: Briefcase,
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    metrics: [
      { label: "Today's briefing", value: '3 items flagged \u2014 HCC I-70 bridge 8-day slip, HTSI cert expiring Apr 2, HTI conflict resolved' },
      { label: 'Briefings generated', value: '127 (since October)' },
      { label: 'CEO read rate', value: '94%' },
    ],
    description: 'Monitors all 7 divisions daily and generates an executive briefing for the CEO every morning at 7:00 AM. Summarizes key metrics changes, compliance alerts, project milestones, budget variances, and personnel issues. The executive team gets a 2-minute read instead of 45 minutes of division reports.',
  },
  {
    id: 'relay',
    name: 'Relay',
    subtitle: 'Meeting Intelligence',
    icon: Mic,
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    metrics: [
      { label: 'Meetings processed this week', value: '34' },
      { label: 'Action items extracted', value: '87 (23 overdue)' },
      { label: 'Commitment tracking', value: 'VP Ops audit due March 28 \u2014 1 day remaining' },
    ],
    description: 'Attends all internal meetings via calendar integration, generates transcripts, extracts action items, tracks commitments across meetings, and flags when deadlines are missed. Named after the railroad relay signal.',
  },
  {
    id: 'signal',
    name: 'Signal',
    subtitle: 'Communications Intelligence',
    icon: Radio,
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    metrics: [
      { label: 'Threads monitored today', value: '1,240' },
      { label: 'Escalations triggered', value: '3 (safety, vendor dispute, overtime)' },
      { label: 'Pattern detected', value: '4 crews reported GPS drift \u2014 possible firmware issue' },
    ],
    description: 'Monitors internal email and Slack for mentions of safety concerns, compliance issues, equipment problems, or customer complaints that need escalation. Surfaces patterns that would take weeks to notice manually. Named after the railroad signal system.',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    subtitle: 'Personal AI Assistant',
    icon: User,
    status: 'active',
    statusLabel: 'Active (per-user)',
    accent: 'green',
    metrics: [
      { label: 'Active personal instances', value: '847 of 2,800 employees' },
      { label: 'Queries answered today', value: '2,340' },
      { label: 'Avg response time', value: '1.2 seconds' },
      { label: 'Top queries', value: 'Project status (34%), compliance (22%), resources (18%)' },
    ],
    description: 'Each employee\'s personal AI assistant connected to their role-specific data. A track inspector asks "what\'s the defect history at MP 247?" and gets an instant answer pulling from inspection records, weather data, and maintenance history. A PM asks "how\'s my project tracking?" and gets budget, schedule, and risk in one answer.',
    deepDiveLink: '#atlas-deep-dive',
  },
];

/* -- Elapsed timer hook ------------------------------------------------- */

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

/* -- Activity Feed Row -------------------------------------------------- */

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

/* -- Violations Prevented Card ------------------------------------------ */

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

/* -- Agent Card Component ----------------------------------------------- */

function AgentCard({
  agent,
  index,
  onOpenDetail,
}: {
  agent: AgentDef;
  index: number;
  onOpenDetail: (agent: AgentDef) => void;
}) {
  const pulsingDot = 'relative after:absolute after:inset-0 after:rounded-full after:bg-green after:animate-ping after:opacity-30';
  const gradientColor = agent.accent === 'blue'
    ? 'from-blue to-blue/40'
    : 'from-emerald-500 to-emerald-500/40';
  const iconColor = agent.accent === 'blue' ? 'text-blue' : 'text-emerald-500';

  const Icon = agent.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`bg-surface-raised border border-border rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-ink-tertiary/40 transition-colors ${agent.accent === 'blue' ? 'border-l-4 border-l-blue' : 'border-l-4 border-l-emerald-500'}`}
      onClick={() => onOpenDetail(agent)}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor}`} />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.8} />
          <span className="text-[13px] font-semibold text-ink tracking-tight">&quot;{agent.name}&quot;</span>
        </div>
        <div className="flex items-center gap-1.5">
          {agent.status === 'active' ? (
            <>
              <span className={`w-2 h-2 rounded-full bg-green ${pulsingDot}`} />
              <span className="text-[11px] font-medium text-green">{agent.statusLabel}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber" />
              <span className="text-[11px] font-medium text-amber">{agent.statusLabel}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-[12px] font-medium text-ink-secondary mb-4">{agent.subtitle}</p>

      <div className="space-y-2.5 text-[12px]">
        {agent.metrics.map((m, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="text-ink-tertiary flex-shrink-0">{m.label}</span>
            <span className="font-medium text-ink text-right">{m.value}</span>
          </div>
        ))}
      </div>

      {agent.deepDiveLink && (
        <div className="mt-4 pt-3 border-t border-border">
          <a href={agent.deepDiveLink} className={`flex items-center gap-1 text-[11px] font-medium ${agent.accent === 'blue' ? 'text-blue' : 'text-emerald-500'} hover:underline`} onClick={(e) => e.stopPropagation()}>
            Deep dive <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

/* -- Agent Detail Panel ------------------------------------------------- */

function AgentDetailPanel({ agent, onClose }: { agent: AgentDef; onClose: () => void }) {
  const Icon = agent.icon;
  const accentColor = agent.accent === 'blue' ? 'text-blue' : 'text-emerald-500';
  const borderAccent = agent.accent === 'blue' ? 'border-l-blue' : 'border-l-emerald-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className={`bg-surface-raised border border-border rounded-xl p-6 border-l-4 ${borderAccent}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${accentColor}`} strokeWidth={1.8} />
          <div>
            <h3 className="text-[16px] font-semibold text-ink tracking-tight">&quot;{agent.name}&quot; &mdash; {agent.subtitle}</h3>
          </div>
        </div>
        <button onClick={onClose} className="text-ink-tertiary hover:text-ink transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[13px] text-ink-secondary leading-relaxed mb-4">{agent.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {agent.metrics.map((m, i) => (
          <div key={i} className="bg-surface-sunken rounded-lg p-3">
            <div className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">{m.label}</div>
            <div className="text-[13px] font-semibold text-ink">{m.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* -- Main Page Component ------------------------------------------------ */

export default function Agents() {
  const lastCheck = useElapsedTimer(47);
  const nextCheck = useCountdown(780);
  const [feed, setFeed] = useState<ActivityEntry[]>(initialFeed);
  const feedRef = useRef<HTMLDivElement>(null);
  const [openDetail, setOpenDetail] = useState<AgentDef | null>(null);

  // Override Dispatch metrics with live timers
  const dispatchWithTimers = {
    ...operationsAgents[0],
    metrics: [
      { label: 'Watching', value: '2,800 employees across 7 divisions' },
      { label: 'Last check', value: lastCheck },
      { label: 'Violations prevented', value: '23 this month' },
      { label: 'Savings this month', value: '$368,000' },
      { label: 'Next scheduled check', value: nextCheck },
    ],
  };

  const liveOpsAgents = [dispatchWithTimers, ...operationsAgents.slice(1)];

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

  const pulsingDot = 'relative after:absolute after:inset-0 after:rounded-full after:bg-green after:animate-ping after:opacity-30';

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <PreliminaryBanner />

      {/* ============ SECTION 0: Header + Summary Bar ============ */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="flex items-center gap-3 mb-1">
          <Bot className="w-5 h-5 text-blue" strokeWidth={1.8} />
          <h1 className="text-[22px] font-semibold text-ink tracking-tight">AI Agents</h1>
        </div>
        <p className="text-[13px] text-ink-tertiary mb-6">
          Named agents deployed across Herzog operations. Monitoring, analyzing, and acting 24/7.
        </p>

        {/* Summary Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 bg-gray-900 rounded-xl p-6">
          {[
            { label: 'Active Agents', value: '9', sub: 'monitoring across 7 divisions' },
            { label: 'Saved This Quarter', value: '$1.2M', sub: 'sum of all agent savings' },
            { label: 'FRA Violations', value: 'Zero', sub: 'since deployment (Oct 2025)' },
            { label: 'Queries Answered Today', value: '2,340', sub: 'Atlas personal assistant' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white tracking-tight">{s.value}</div>
              <div className="text-[12px] font-semibold text-gray-300">{s.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ============ SECTION 1A: Operations Agents ============ */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue" />
          <h2 className="text-[16px] font-semibold text-ink tracking-tight">Operations Agents</h2>
        </div>
        <p className="text-[12px] text-ink-tertiary mb-4">Automating safety-critical railroad workflows</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {liveOpsAgents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i + 2} onOpenDetail={setOpenDetail} />
          ))}
        </div>
      </motion.div>

      {/* ============ SECTION 1B: Intelligence Agents ============ */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h2 className="text-[16px] font-semibold text-ink tracking-tight">Intelligence Agents</h2>
        </div>
        <p className="text-[12px] text-ink-tertiary mb-4">Your organization&apos;s nervous system</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {intelligenceAgents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i + 7} onOpenDetail={setOpenDetail} />
          ))}
        </div>
      </motion.div>

      {/* ============ Agent Detail Panel (expandable) ============ */}
      <AnimatePresence>
        {openDetail && (
          <AgentDetailPanel agent={openDetail} onClose={() => setOpenDetail(null)} />
        )}
      </AnimatePresence>

      {/* ============ SECTION 2: Deep Dive -- Dispatch ============ */}
      <div id="dispatch-deep-dive" className="scroll-mt-20">
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue" strokeWidth={1.8} />
            <h2 className="text-[22px] font-bold text-ink tracking-tight">Deep Dive &mdash; &quot;Dispatch&quot; HOS Compliance Agent</h2>
          </div>
          <p className="text-[13px] text-ink-tertiary mb-6">
            How Dispatch monitors FRA Hours-of-Service compliance across all 7 Herzog divisions in real time.
          </p>
        </motion.div>

        {/* 2A: How Dispatch Works -- Technical Architecture Pipeline */}
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
          <div className="bg-[#060d11] rounded-xl border border-[#0f2a1a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Live Feed &mdash; Dispatch</span>
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

        {/* 2C: Violations Prevented -- Evidence Cards */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Violations Prevented &mdash; Evidence Cards</h3>
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
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Agent Info</div>
                  <div className="space-y-1.5 text-[12px] font-mono">
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Agent</span><span className="text-ink">Dispatch</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Version</span><span className="text-ink">2.4.1</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Deployed</span><span className="text-ink">October 14, 2025</span></div>
                    <div className="flex gap-3"><span className="text-ink-tertiary w-24">Last Updated</span><span className="text-ink">March 22, 2026</span></div>
                  </div>
                </div>

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
                <div>
                  <div className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">Compliance Rules Active</div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      '12-hour on-duty limit (FRA \u00A7228.405)',
                      '10-hour minimum off-duty (FRA \u00A7228.405)',
                      '276 monthly hour cap (FRA \u00A7228.405)',
                      '6/2 consecutive day rule (FRA \u00A7228.405)',
                      '30-hour limbo time (Company policy)',
                      'UTU Agreement \u00A74.2 (rest period provisions)',
                      'IBEW Local 948 \u00A712.1 (signal maintainer limits)',
                      'LIUNA District Council \u00A78.3 (track worker provisions)',
                    ].map((rule) => (
                      <div key={rule} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-ink">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

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

      {/* ============ SECTION 3: Deep Dive -- Atlas ============ */}
      <div id="atlas-deep-dive" className="scroll-mt-20">
        <motion.div variants={fadeUp} custom={10} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-emerald-500" strokeWidth={1.8} />
            <h2 className="text-[18px] font-semibold text-ink tracking-tight">Deep Dive &mdash; &quot;Atlas&quot; Personal AI Assistant</h2>
          </div>
          <p className="text-[13px] text-ink-tertiary mb-6">
            Every employee&apos;s personal AI assistant, connected to their role-specific data. 847 active instances serving 2,800 employees.
          </p>
        </motion.div>

        {/* Atlas Demo */}
        <motion.div variants={fadeUp} custom={11} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Live Demo &mdash; Atlas Answering a Query</h3>
          <div className="bg-[#0B1120] rounded-xl border border-[#1E293B] overflow-hidden">
            {/* User Query Header */}
            <div className="px-5 py-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">User Query</span>
              </div>
              <div className="font-mono text-[12px] text-slate-400">
                <span className="text-emerald-400">USER:</span> Sarah Chen (Track Inspector, HSI)
              </div>
              <div className="font-mono text-[13px] text-ink mt-1">
                &quot;What should I prioritize today?&quot;
              </div>
            </div>

            {/* Context Sources */}
            <div className="px-5 py-3 border-b border-[#1E293B] bg-[#0D1424]">
              <div className="text-[10px] font-bold text-blue uppercase tracking-widest mb-2">Context Window &mdash; Sources Loaded</div>
              <div className="font-mono text-[11px] text-slate-500 space-y-0.5">
                <div><span className="text-slate-600">\u251C\u2500</span> Track inspection database <span className="text-slate-700">(HSI assignments, defect history)</span></div>
                <div><span className="text-slate-600">\u251C\u2500</span> FRA defect log <span className="text-slate-700">(active defects, compliance deadlines)</span></div>
                <div><span className="text-slate-600">\u251C\u2500</span> Weather API <span className="text-slate-700">(current conditions, 48hr forecast)</span></div>
                <div><span className="text-slate-600">\u251C\u2500</span> HR training system <span className="text-slate-700">(certifications, renewals)</span></div>
                <div><span className="text-slate-600">\u251C\u2500</span> Maintenance work orders <span className="text-slate-700">(recent emergency repairs)</span></div>
                <div><span className="text-slate-600">\u2514\u2500</span> Inspection assignment queue <span className="text-slate-700">(today&apos;s route)</span></div>
              </div>
            </div>

            {/* Atlas Response */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${pulsingDot}`} />
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Atlas Response</span>
              </div>
              <div className="font-mono text-[12px] leading-relaxed space-y-4">
                <div className="text-slate-300">
                  Based on your inspection assignments and current conditions:
                </div>

                <div className="border-l-2 border-red-500 pl-3">
                  <div className="text-red-400 font-semibold">1. PRIORITY: MP 247.1 &mdash; Surface deviation at 2.1&quot;</div>
                  <div className="text-slate-400 mt-1">
                    Exceeds Class 4 limit. Last 3 inspections show accelerating trend.
                    <br />Recommend immediate assessment.
                  </div>
                </div>

                <div className="border-l-2 border-amber-500 pl-3">
                  <div className="text-amber-400 font-semibold">2. ATTENTION: MP 312.4 &mdash; Ballast repair follow-up</div>
                  <div className="text-slate-400 mt-1">
                    March 25 emergency work needs follow-up inspection per FRA &sect;213.233(c).
                    <br />Due by April 1.
                  </div>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3">
                  <div className="text-emerald-400 font-semibold">3. ROUTINE: MP 180&ndash;195 &mdash; Scheduled monthly inspection</div>
                  <div className="text-slate-400 mt-1">
                    No known defects. Weather forecast: clear, 58&deg;F.
                    <br />Good conditions for visual inspection.
                  </div>
                </div>

                <div className="border-l-2 border-blue-500 pl-3">
                  <div className="text-blue-400 font-semibold">4. NOTE: FRA certification renewal due May 15</div>
                  <div className="text-slate-400 mt-1">
                    HR has scheduled the training module &mdash; check your email.
                  </div>
                </div>
              </div>

              {/* Context Freshness Footer */}
              <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] text-slate-600">
                <span>Context freshness: <span className="text-slate-500">2 minutes ago</span></span>
                <span>Sources: <span className="text-slate-500">14 data sources</span></span>
                <span>Tokens: <span className="text-slate-500">4,247</span></span>
                <span>Response time: <span className="text-emerald-600">1.1s</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Atlas Usage Stats */}
        <motion.div variants={fadeUp} custom={12} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Atlas Deployment Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Instances', value: '847', sub: 'of 2,800 employees' },
              { label: 'Queries Today', value: '2,340', sub: 'avg 2.8 per user' },
              { label: 'Avg Response Time', value: '1.2s', sub: '14 data sources per query' },
              { label: 'Satisfaction', value: '4.6/5', sub: 'from 312 user surveys' },
            ].map((s, i) => (
              <div key={i} className="bg-surface-raised border border-border rounded-lg p-4">
                <div className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-[20px] font-semibold text-ink tracking-tight">{s.value}</div>
                <div className="text-[11px] text-ink-tertiary">{s.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Atlas Query Breakdown */}
        <motion.div variants={fadeUp} custom={13} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Most Common Query Types</h3>
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <div className="space-y-3">
              {[
                { type: 'Project status', pct: 34, color: 'bg-blue' },
                { type: 'Compliance lookups', pct: 22, color: 'bg-emerald-500' },
                { type: 'Resource availability', pct: 18, color: 'bg-amber-500' },
                { type: 'Equipment history', pct: 12, color: 'bg-purple-500' },
                { type: 'Schedule queries', pct: 8, color: 'bg-red-500' },
                { type: 'Other', pct: 6, color: 'bg-slate-400' },
              ].map((q) => (
                <div key={q.type} className="flex items-center gap-3">
                  <span className="text-[12px] text-ink-secondary w-40 flex-shrink-0">{q.type}</span>
                  <div className="flex-1 h-5 bg-surface-sunken rounded-full overflow-hidden">
                    <div className={`h-full ${q.color} rounded-full`} style={{ width: `${q.pct}%` }} />
                  </div>
                  <span className="text-[12px] font-semibold text-ink w-10 text-right">{q.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============ SECTION 4: The Pitch Line ============ */}
      <motion.div variants={fadeUp} custom={14} initial="hidden" animate="visible">
        <div className="bg-surface-sunken border border-border rounded-xl p-8 text-center">
          <p className="text-[18px] font-semibold text-ink tracking-tight mb-2">
            9 agents. 7 divisions. 2,800 employees served.
          </p>
          <p className="text-[13px] text-ink-tertiary max-w-2xl mx-auto">
            From FRA compliance to executive briefings, from project estimation to personal AI assistants &mdash;
            this is what the Last Mile of AI looks like. Not a dashboard. A workforce multiplier.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
