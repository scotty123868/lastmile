import { useState, useEffect, useRef, useMemo } from 'react';
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
  Truck,
  MapPin,
  Wrench,
  Layers,
  ScanLine,
  ClipboardCheck,
  Gauge,
  GitBranch,
  FileCheck,
  Route,
  Users,
  BarChart3,
  ShieldAlert,
  Zap,
  FileText,
  Leaf,
  Thermometer,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';
import { useCompany } from '../data/CompanyContext';
import {
  getAgentsForDivision,
  getAllAgents,
  divisionMeta,
  type AgentDef,
} from '../data/divisionAgents';

/* -- Icon lookup -------------------------------------------------------- */

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Eye,
  Search,
  Calculator,
  Package,
  Briefcase,
  Mic,
  Radio,
  User,
  Bot,
  Activity,
  Truck,
  MapPin,
  Wrench,
  Layers,
  ScanLine,
  ClipboardCheck,
  Gauge,
  GitBranch,
  FileCheck,
  Route,
  Users,
  BarChart3,
  ShieldAlert,
  Zap,
  FileText,
  Leaf,
  Thermometer,
};

function getIcon(name: string): React.ElementType {
  return iconMap[name] ?? Bot;
}

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

/* -- Violations Prevented Data ------------------------------------------ */

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

/* -- Violation Card ----------------------------------------------------- */

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

/* -- Accent helpers ----------------------------------------------------- */

const accentStyles: Record<string, { gradient: string; icon: string; border: string; dot: string }> = {
  blue: {
    gradient: 'from-blue to-blue/40',
    icon: 'text-blue',
    border: 'border-l-blue',
    dot: 'bg-blue',
  },
  green: {
    gradient: 'from-emerald-500 to-emerald-500/40',
    icon: 'text-emerald-500',
    border: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-500/40',
    icon: 'text-amber-500',
    border: 'border-l-amber-500',
    dot: 'bg-amber-500',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-500/40',
    icon: 'text-purple-500',
    border: 'border-l-purple-500',
    dot: 'bg-purple-500',
  },
};

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
  const style = accentStyles[agent.accent] ?? accentStyles.blue;
  const Icon = getIcon(agent.icon);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`bg-surface-raised border border-border rounded-xl p-5 relative overflow-hidden cursor-pointer hover:border-ink-tertiary/40 transition-colors border-l-4 ${style.border}`}
      onClick={() => onOpenDetail(agent)}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`} />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${style.icon}`} strokeWidth={1.8} />
          <span className="text-[13px] font-semibold text-ink tracking-tight">&quot;{agent.name}&quot;</span>
        </div>
        <div className="flex items-center gap-1.5">
          {agent.status === 'active' ? (
            <>
              <span className={`w-2 h-2 rounded-full bg-green ${pulsingDot}`} />
              <span className="text-[11px] font-medium text-green">{agent.statusLabel}</span>
            </>
          ) : agent.status === 'running' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber" />
              <span className="text-[11px] font-medium text-amber">{agent.statusLabel}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-[11px] font-medium text-slate-400">{agent.statusLabel}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-[12px] font-medium text-ink-secondary mb-1">{agent.subtitle}</p>
      <p className="text-[10px] text-ink-tertiary mb-4 uppercase tracking-wider">{agent.divisionName}</p>

      <div className="space-y-2.5 text-[12px]">
        {agent.metrics.map((m, i) => (
          <div key={i} className="flex justify-between gap-3">
            <span className="text-ink-tertiary whitespace-nowrap">{m.label}</span>
            <span className="font-semibold text-ink text-right font-mono tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>

      {agent.deepDiveLink && (
        <div className="mt-4 pt-3 border-t border-border">
          <a href={agent.deepDiveLink} className={`flex items-center gap-1 text-[11px] font-medium ${style.icon} hover:underline`} onClick={(e) => e.stopPropagation()}>
            Deep dive <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

/* -- Agent Detail Panel ------------------------------------------------- */

function AgentDetailPanel({ agent, onClose }: { agent: AgentDef; onClose: () => void }) {
  const Icon = getIcon(agent.icon);
  const style = accentStyles[agent.accent] ?? accentStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className={`bg-surface-raised border border-border rounded-xl p-6 border-l-4 ${style.border}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${style.icon}`} strokeWidth={1.8} />
          <div>
            <h3 className="text-[16px] font-semibold text-ink tracking-tight">&quot;{agent.name}&quot; &mdash; {agent.subtitle}</h3>
            <p className="text-[11px] text-ink-tertiary uppercase tracking-wider mt-0.5">{agent.divisionName}</p>
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
  const { company } = useCompany();
  const isParent = company.id === 'meridian';

  const [feed, setFeed] = useState<ActivityEntry[]>(initialFeed);
  const feedRef = useRef<HTMLDivElement>(null);
  const [openDetail, setOpenDetail] = useState<AgentDef | null>(null);

  // Get agents based on current division
  const visibleAgents = useMemo(() => getAgentsForDivision(company.id), [company.id]);
  const totalAll = getAllAgents().length;

  // Group agents by division for parent view
  const groupedByDivision = useMemo(() => {
    if (!isParent) return null;
    const groups: Record<string, AgentDef[]> = {};
    for (const agent of visibleAgents) {
      if (!groups[agent.division]) groups[agent.division] = [];
      groups[agent.division].push(agent);
    }
    return groups;
  }, [isParent, visibleAgents]);

  // For division view, separate shared from division-specific
  const divisionSpecificAgents = useMemo(
    () => (isParent ? [] : visibleAgents.filter((a) => a.division !== 'shared')),
    [isParent, visibleAgents],
  );
  const sharedAgentsForDivision = useMemo(
    () => (isParent ? [] : visibleAgents.filter((a) => a.division === 'shared')),
    [isParent, visibleAgents],
  );

  // Show Dispatch deep dive when HCC or parent is selected
  const showDispatchDeepDive = isParent || company.id === 'hcc';

  // Live query counter
  const [queryCount, setQueryCount] = useState(2340);
  useEffect(() => {
    const id = setInterval(() => {
      setQueryCount((c) => c + 1);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);

  // Interactive Atlas demo state
  const [atlasInput, setAtlasInput] = useState('');
  const [atlasStreaming, setAtlasStreaming] = useState(false);
  const [atlasResponse, setAtlasResponse] = useState('');
  const [, setAtlasFullResponse] = useState('');
  const [atlasQuestion, setAtlasQuestion] = useState('');
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamIdxRef = useRef(0);

  const atlasQA: Record<string, string> = {
    'What should I prioritize today?': `Based on your inspection assignments and current conditions:\n\n\uD83D\uDD34 PRIORITY: MP 247.1 \u2014 Surface deviation trending toward Class 4 limit. Last 3 inspections show accelerating degradation. Recommend immediate assessment.\n\n\uD83D\uDFE1 ATTENTION: MP 312.4 \u2014 Ballast repair from March 25 needs follow-up inspection per FRA \u00A7213.233(c). Due by April 1.\n\n\uD83D\uDFE2 ROUTINE: MP 180-195 \u2014 Scheduled monthly inspection. Clear weather, good conditions.\n\nSources: Track inspection database, FRA defect log, weather API, your assignment queue\nContext: 14 data sources | Updated 2 min ago`,
    'How are we tracking on the I-70 bridge?': `I-70 Bridge Rehabilitation (WO-2025-08834):\n\n\uD83D\uDCCA Budget: 69% spent ($2.14M of $3.1M) vs 71% schedule elapsed \u2014 slightly ahead on spend\n\u26A0\uFE0F Schedule: 8-day slip on critical path (bearing installation)\n\uD83D\uDCB0 Contingency: $120K remaining, one pending change order for $45K\n\uD83D\uDCCB Comparable projects averaged 12% over budget \u2014 you're tracking within range\n\nRecommendation: Expedite bearing shipment \u2014 that's your critical path constraint. Current 2-week lead time puts August 15 deadline at risk.\n\nSources: Primavera P6, SAP financials, procurement system\nContext: 8 data sources | Updated 7 min ago`,
    'Are we FRA compliant across all divisions?': `FRA Compliance Status \u2014 All Divisions:\n\n\u2705 Overall: 98.3% compliant (349 current, 6 overdue inspections)\n\nBy Division:\n\u2022 HCC: 47 current, 2 overdue (MP 247, MP 312)\n\u2022 HRSI: 23 current, 0 overdue \u2713\n\u2022 HSI: 89 current, 1 overdue\n\u2022 HTI: 34 current, 0 overdue \u2713\n\u2022 HTSI: 156 current, 3 overdue\n\n\uD83D\uDEA8 Critical Items:\n1. Signal fault in Zone 8 (HTI) \u2014 needs immediate attention\n2. Signal maintainer certification expiring April 2 \u2014 6 days away, flagged to HR\n\nSources: FRA compliance database, HR training system, division inspection logs\nContext: 23 data sources | Updated 1 min ago`,
  };

  const startAtlasStream = (question: string) => {
    const response = atlasQA[question] || `Connecting to Herzog systems... This query requires live system access. In production, Atlas would answer this in ~1.2 seconds using 14 connected data sources.`;
    setAtlasQuestion(question);
    setAtlasFullResponse(response);
    setAtlasResponse('');
    setAtlasStreaming(true);
    streamIdxRef.current = 0;

    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = setInterval(() => {
      streamIdxRef.current += 1;
      if (streamIdxRef.current >= response.length) {
        if (streamRef.current) clearInterval(streamRef.current);
        setAtlasResponse(response);
        setAtlasStreaming(false);
      } else {
        setAtlasResponse(response.slice(0, streamIdxRef.current));
      }
    }, 18);
  };

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

  // Division group order for parent view
  const divisionOrder = ['shared', 'hcc', 'hrsi', 'hsi', 'hti', 'htsi', 'he', 'gg'];

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
          {isParent
            ? 'Named agents deployed across all Herzog divisions. Monitoring, analyzing, and acting 24/7.'
            : `Named agents serving ${company.shortName}. Monitoring, analyzing, and acting 24/7.`}
        </p>

        {/* Summary Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 bg-gray-900 rounded-xl p-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-3xl font-bold text-white tracking-tight">{visibleAgents.length}</span>
            </div>
            <div className="text-[12px] font-semibold text-gray-300">Active Agents</div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {isParent ? `across ${company.opCos} divisions` : `${visibleAgents.filter(a => a.division !== 'shared').length} division + ${visibleAgents.filter(a => a.division === 'shared').length} shared`}
            </div>
          </div>
          {[
            { label: 'Saved This Quarter', value: '$1.2M', sub: 'sum of all agent savings' },
            { label: 'FRA Violations', value: 'Zero', sub: 'since deployment (Oct 2025)' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white tracking-tight">{s.value}</div>
              <div className="text-[12px] font-semibold text-gray-300">{s.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white tracking-tight">{queryCount.toLocaleString()}</div>
            <div className="text-[12px] font-semibold text-gray-300">Queries Answered Today</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Atlas personal assistant</div>
          </div>
        </div>
      </motion.div>

      {/* ============ AGENT CARDS ============ */}

      {/* Parent view: agents grouped by division */}
      {isParent && groupedByDivision && divisionOrder.map((divId) => {
        const agents = groupedByDivision[divId];
        if (!agents || agents.length === 0) return null;
        const meta = divisionMeta[divId];
        const dotColor = accentStyles[meta.accent]?.dot ?? 'bg-blue';

        return (
          <motion.div key={divId} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              <h2 className="text-[16px] font-semibold text-ink tracking-tight">{meta.name}</h2>
              <span className="text-[12px] text-ink-tertiary ml-1">({agents.length} agent{agents.length !== 1 ? 's' : ''})</span>
            </div>
            <p className="text-[12px] text-ink-tertiary mb-4">
              {divId === 'shared' ? 'Cross-division platform agents serving all of Herzog' : `Division-specific agents for ${meta.name}`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i + 2} onOpenDetail={setOpenDetail} />
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Division view: division-specific agents then shared */}
      {!isParent && (
        <>
          {divisionSpecificAgents.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${accentStyles[divisionSpecificAgents[0].accent]?.dot ?? 'bg-blue'}`} />
                <h2 className="text-[16px] font-semibold text-ink tracking-tight">{company.shortName} Agents</h2>
                <span className="text-[12px] text-ink-tertiary ml-1">({divisionSpecificAgents.length})</span>
              </div>
              <p className="text-[12px] text-ink-tertiary mb-4">Division-specific agents for {company.shortName}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {divisionSpecificAgents.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i + 2} onOpenDetail={setOpenDetail} />
                ))}
              </div>
            </motion.div>
          )}

          {sharedAgentsForDivision.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue" />
                <h2 className="text-[16px] font-semibold text-ink tracking-tight">Shared Platform Agents</h2>
                <span className="text-[12px] text-ink-tertiary ml-1">({sharedAgentsForDivision.length})</span>
              </div>
              <p className="text-[12px] text-ink-tertiary mb-4">Cross-division platform agents available to {company.shortName}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedAgentsForDivision.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i + 7} onOpenDetail={setOpenDetail} />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ============ Agent Detail Panel (expandable) ============ */}
      <AnimatePresence>
        {openDetail && (
          <AgentDetailPanel agent={openDetail} onClose={() => setOpenDetail(null)} />
        )}
      </AnimatePresence>

      {/* ============ SECTION 2: Deep Dive -- Dispatch ============ */}
      {showDispatchDeepDive && (
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
                { label: 'Violations Prevented', value: '23', sub: 'this month', trend: 'up' as const, trendVal: 'from 18 last month' },
                { label: 'Time to Detect', value: '0.2s', sub: 'avg', trend: 'down' as const, trendVal: 'vs. 42min manual' },
                { label: 'False Alarm Rate', value: '1.2%', sub: '', trend: 'down' as const, trendVal: 'from 3.8% in Oct' },
                { label: 'Crew Utilization', value: '+4.7%', sub: '', trend: 'up' as const, trendVal: 'optimized scheduling' },
                { label: 'FRA Compliance', value: '100%', sub: '0 violations in 6 months', trend: null, trendVal: '' },
              ].map((m, i) => (
                <div key={i} className="bg-surface-raised border border-border rounded-lg p-4">
                  <div className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">{m.label}</div>
                  <div className="text-[20px] font-semibold text-ink tracking-tight">{m.value}</div>
                  {m.sub && <div className="text-[11px] text-ink-tertiary">{m.sub}</div>}
                  {m.trend && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-green">
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
      )}

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

        {/* Interactive Atlas Demo */}
        <motion.div variants={fadeUp} custom={11} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Try It &mdash; Ask Atlas Anything</h3>
          <div className="bg-[#0B1120] rounded-xl border border-[#1E293B] overflow-hidden">
            {/* Suggested Questions */}
            <div className="px-5 py-4 border-b border-[#1E293B]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Suggested Questions</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(atlasQA).map((q) => (
                  <button
                    key={q}
                    onClick={() => { setAtlasInput(q); startAtlasStream(q); }}
                    disabled={atlasStreaming}
                    className="px-3 py-1.5 rounded-full bg-[#1E293B] text-[12px] text-slate-300 hover:bg-[#2D3B4F] hover:text-white transition-colors disabled:opacity-50 cursor-pointer border border-[#2D3B4F]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="px-5 py-3 border-b border-[#1E293B] bg-[#0D1424]">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-mono text-[12px] flex-shrink-0">&gt;</span>
                <input
                  type="text"
                  value={atlasInput}
                  onChange={(e) => setAtlasInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && atlasInput.trim() && !atlasStreaming) startAtlasStream(atlasInput.trim()); }}
                  placeholder="Ask Atlas anything about Herzog operations..."
                  className="flex-1 bg-transparent border-none outline-none text-[13px] font-mono text-white placeholder:text-slate-600"
                  disabled={atlasStreaming}
                />
              </div>
            </div>

            {/* Atlas Response Area */}
            {(atlasResponse || atlasStreaming) && (
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Q:</span>
                  <span className="text-[12px] text-slate-400 font-mono">{atlasQuestion}</span>
                </div>
                <div className="flex items-center gap-2 mb-3 mt-3">
                  <span className={`w-2 h-2 rounded-full bg-emerald-400 ${pulsingDot}`} />
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Atlas</span>
                  {atlasStreaming && <span className="text-[10px] text-slate-600 font-mono">streaming...</span>}
                </div>
                <div className="font-mono text-[12px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {atlasResponse}
                  {atlasStreaming && (
                    <span className="inline-block w-[2px] h-[14px] bg-emerald-400 ml-0.5 align-middle" style={{ animation: 'blink 0.8s step-end infinite' }} />
                  )}
                </div>
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>

                {/* Context footer (shown after streaming completes) */}
                {!atlasStreaming && atlasResponse && (
                  <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] text-slate-600">
                    <span>Context freshness: <span className="text-slate-500">2 minutes ago</span></span>
                    <span>Sources: <span className="text-slate-500">14 data sources</span></span>
                    <span>Response time: <span className="text-emerald-600">1.2s</span></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Atlas Usage Stats */}
        <motion.div variants={fadeUp} custom={12} initial="hidden" animate="visible" className="mb-8">
          <h3 className="text-[14px] font-semibold text-ink mb-4">Atlas Deployment Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Instances', value: '847', sub: 'of 2,800 employees' },
              { label: 'Queries Today', value: queryCount.toLocaleString(), sub: 'avg 2.8 per user' },
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
            {isParent
              ? `${totalAll} agents. ${company.opCos} divisions. ${company.employees.toLocaleString()} employees served.`
              : `${visibleAgents.length} agents. ${company.employees.toLocaleString()} employees served.`}
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
