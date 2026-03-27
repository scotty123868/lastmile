import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Workflow,
  DollarSign,
  Gauge,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Cpu,
  Trash2,
  Table2,
  Clock,
  Users,
  Building2,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useCompany } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Types ───────────────────────────────────────────────── */

interface ReadinessData {
  score: number;
  label: string;
}

interface KPIData {
  savings: number;
  scoreBefore: number;
  scoreAfter: number;
  workflows: number;
  workflowsReady: number;
  waste: number;
}

interface TimelineStop {
  savings: number;
  score: number;
  workflows: number;
  waste: number;
}

interface Opportunity {
  priority: number;
  name: string;
  savings: number;
  status: 'Automated' | 'In Progress' | 'Identified';
}

interface InactionData {
  year1: number;
  year2: number;
  year3: number;
  total: number;
}

interface CompanyAnalyticsData {
  readiness: ReadinessData;
  kpis: KPIData;
  timeline: [TimelineStop, TimelineStop, TimelineStop];
  opportunities: Opportunity[];
  inaction: InactionData;
}

/* ── Cost curve types ────────────────────────────────────── */

interface CostCurveMonth {
  month: string;
  costs: number;
  savings: number;
  net: number;
}

interface PaybackData {
  paybackMonths: number;
  year1ROI: number;
  year2Projected: string;
}

interface CostCurveData {
  timeline: CostCurveMonth[];
  breakEvenMonth: number;
  breakEvenLabel: string;
  payback: PaybackData;
}

const COMMAND_CENTER_URL = 'https://command-center-git-main-scotty123868s-projects.vercel.app';

/* ── Company-specific data ───────────────────────────────── */

const analyticsData: Record<string, CompanyAnalyticsData> = {
  meridian: {
    readiness: { score: 38, label: 'Critical \u2014 legacy railroad systems limit AI integration' },
    kpis: { savings: 5800000, scoreBefore: 38, scoreAfter: 84, workflows: 62, workflowsReady: 16, waste: 2800000 },
    timeline: [
      { savings: 0, score: 38, workflows: 0, waste: 2800000 },
      { savings: 2900000, score: 62, workflows: 34, waste: 1400000 },
      { savings: 5800000, score: 84, workflows: 62, waste: 320000 },
    ],
    opportunities: [
      { priority: 1, name: 'Track Geometry Defect Detection — RailSentry + LIDAR', savings: 1380000, status: 'In Progress' },
      { priority: 2, name: 'Crew Dispatch & Scheduling Optimization', savings: 1120000, status: 'Identified' },
      { priority: 3, name: 'GPS Ballast Train Fleet Utilization', savings: 940000, status: 'In Progress' },
      { priority: 4, name: 'FRA Safety Compliance Automation', savings: 780000, status: 'Automated' },
      { priority: 5, name: 'Equipment Maintenance Cycle Prediction — TAM-4 / SpeedTrax', savings: 620000, status: 'Identified' },
    ],
    inaction: { year1: 1200000, year2: 1440000, year3: 1730000, total: 4370000 },
  },
  hcc: {
    readiness: { score: 35, label: 'Critical \u2014 heavy equipment and field ops lack digital integration' },
    kpis: { savings: 2100000, scoreBefore: 35, scoreAfter: 82, workflows: 22, workflowsReady: 6, waste: 980000 },
    timeline: [
      { savings: 0, score: 35, workflows: 0, waste: 980000 },
      { savings: 1050000, score: 58, workflows: 12, waste: 490000 },
      { savings: 2100000, score: 82, workflows: 22, waste: 110000 },
    ],
    opportunities: [
      { priority: 1, name: 'Heavy Equipment GPS Tracking & Utilization AI', savings: 620000, status: 'In Progress' },
      { priority: 2, name: 'Project Cost Estimation AI \u2014 Rail & Highway', savings: 540000, status: 'Identified' },
      { priority: 3, name: 'Subcontractor Management & Compliance Platform', savings: 480000, status: 'In Progress' },
      { priority: 4, name: 'Paving & Grading Optimization System', savings: 460000, status: 'Identified' },
    ],
    inaction: { year1: 420000, year2: 505000, year3: 605000, total: 1530000 },
  },
  hrsi: {
    readiness: { score: 40, label: 'Below Average \u2014 railcar fleet data siloed across regions' },
    kpis: { savings: 820000, scoreBefore: 40, scoreAfter: 83, workflows: 8, workflowsReady: 2, waste: 380000 },
    timeline: [
      { savings: 0, score: 40, workflows: 0, waste: 380000 },
      { savings: 410000, score: 62, workflows: 4, waste: 190000 },
      { savings: 820000, score: 83, workflows: 8, waste: 42000 },
    ],
    opportunities: [
      { priority: 1, name: 'Class 1 Railroad Scheduling Optimization', savings: 310000, status: 'In Progress' },
      { priority: 2, name: 'Railcar Repair Cycle Prediction', savings: 280000, status: 'Identified' },
      { priority: 3, name: 'Equipment Leasing & Utilization Optimization', savings: 230000, status: 'Identified' },
    ],
    inaction: { year1: 160000, year2: 192000, year3: 230000, total: 582000 },
  },
  hsi: {
    readiness: { score: 42, label: 'Below Average \u2014 manual defect classification limits throughput' },
    kpis: { savings: 680000, scoreBefore: 42, scoreAfter: 86, workflows: 6, workflowsReady: 2, waste: 240000 },
    timeline: [
      { savings: 0, score: 42, workflows: 0, waste: 240000 },
      { savings: 340000, score: 64, workflows: 3, waste: 120000 },
      { savings: 680000, score: 86, workflows: 6, waste: 26000 },
    ],
    opportunities: [
      { priority: 1, name: 'AI-Enhanced Ultrasonic Rail Flaw Analysis', savings: 280000, status: 'In Progress' },
      { priority: 2, name: 'Automated FRA Defect Reporting & Classification', savings: 220000, status: 'Identified' },
      { priority: 3, name: 'Route Prioritization & Testing Schedule AI', savings: 180000, status: 'Automated' },
    ],
    inaction: { year1: 100000, year2: 120000, year3: 144000, total: 364000 },
  },
  hti: {
    readiness: { score: 44, label: 'Below Average \u2014 PTC data fragmented across signal territories' },
    kpis: { savings: 740000, scoreBefore: 44, scoreAfter: 87, workflows: 10, workflowsReady: 3, waste: 420000 },
    timeline: [
      { savings: 0, score: 44, workflows: 0, waste: 420000 },
      { savings: 370000, score: 66, workflows: 5, waste: 210000 },
      { savings: 740000, score: 87, workflows: 10, waste: 46000 },
    ],
    opportunities: [
      { priority: 1, name: 'PTC Deployment Optimization & Scheduling', savings: 280000, status: 'In Progress' },
      { priority: 2, name: 'Signal Design Automation Platform', savings: 220000, status: 'Identified' },
      { priority: 3, name: 'GIS Data Management & Territory Mapping AI', savings: 240000, status: 'In Progress' },
    ],
    inaction: { year1: 175000, year2: 210000, year3: 252000, total: 637000 },
  },
  htsi: {
    readiness: { score: 36, label: 'Critical \u2014 transit scheduling relies on legacy dispatching' },
    kpis: { savings: 860000, scoreBefore: 36, scoreAfter: 80, workflows: 10, workflowsReady: 2, waste: 480000 },
    timeline: [
      { savings: 0, score: 36, workflows: 0, waste: 480000 },
      { savings: 430000, score: 58, workflows: 5, waste: 240000 },
      { savings: 860000, score: 80, workflows: 10, waste: 52000 },
    ],
    opportunities: [
      { priority: 1, name: 'Transit Schedule Optimization Engine', savings: 320000, status: 'In Progress' },
      { priority: 2, name: 'Passenger Load Prediction & Capacity AI', savings: 280000, status: 'Identified' },
      { priority: 3, name: 'Rolling Stock Maintenance Forecasting', savings: 260000, status: 'Identified' },
    ],
    inaction: { year1: 200000, year2: 240000, year3: 288000, total: 728000 },
  },
  he: {
    readiness: { score: 48, label: 'Moderate \u2014 newer systems but limited AI-readiness' },
    kpis: { savings: 360000, scoreBefore: 48, scoreAfter: 88, workflows: 4, workflowsReady: 1, waste: 180000 },
    timeline: [
      { savings: 0, score: 48, workflows: 0, waste: 180000 },
      { savings: 180000, score: 68, workflows: 2, waste: 90000 },
      { savings: 360000, score: 88, workflows: 4, waste: 20000 },
    ],
    opportunities: [
      { priority: 1, name: 'Solar & Wind Project Planning Optimization', savings: 200000, status: 'In Progress' },
      { priority: 2, name: 'Grid Compliance & Interconnection Automation', savings: 160000, status: 'Identified' },
    ],
    inaction: { year1: 75000, year2: 90000, year3: 108000, total: 273000 },
  },
  gg: {
    readiness: { score: 46, label: 'Below Average \u2014 compliance tracking mostly manual' },
    kpis: { savings: 240000, scoreBefore: 46, scoreAfter: 85, workflows: 2, workflowsReady: 0, waste: 120000 },
    timeline: [
      { savings: 0, score: 46, workflows: 0, waste: 120000 },
      { savings: 120000, score: 66, workflows: 1, waste: 60000 },
      { savings: 240000, score: 85, workflows: 2, waste: 14000 },
    ],
    opportunities: [
      { priority: 1, name: 'Environmental Compliance Automation & Reporting', savings: 140000, status: 'Identified' },
      { priority: 2, name: 'Waste Stream Optimization & Tracking', savings: 100000, status: 'Identified' },
    ],
    inaction: { year1: 50000, year2: 60000, year3: 72000, total: 182000 },
  },
};

/* ── Cost curve data (from Assessment) ───────────────────── */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildTimeline(costs: number[], savings: number[]): CostCurveMonth[] {
  return months.map((m, i) => ({
    month: m,
    costs: costs[i],
    savings: savings[i],
    net: savings[i] - costs[i],
  }));
}

const costCurveData: Record<string, CostCurveData> = {
  meridian: {
    timeline: buildTimeline(
      [820, 740, 560, 420, 260, 170, 110, 80, 60, 45, 38, 32],
      [0, 50, 160, 320, 520, 740, 860, 940, 1000, 1040, 1070, 1090],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 148, year2Projected: '$8.4M' },
  },
  hcc: {
    timeline: buildTimeline(
      [320, 280, 210, 160, 100, 65, 42, 30, 22, 17, 14, 12],
      [0, 20, 60, 130, 210, 300, 350, 380, 400, 415, 425, 432],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.4, year1ROI: 152, year2Projected: '$3.2M' },
  },
  hrsi: {
    timeline: buildTimeline(
      [110, 96, 72, 54, 34, 22, 14, 10, 8, 6, 5, 4],
      [0, 8, 24, 50, 80, 112, 130, 142, 150, 155, 159, 162],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.8, year1ROI: 138, year2Projected: '$1.2M' },
  },
  hsi: {
    timeline: buildTimeline(
      [62, 54, 40, 30, 19, 12, 8, 6, 4, 3, 3, 2],
      [0, 5, 18, 38, 60, 84, 98, 108, 114, 118, 121, 124],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 142, year2Projected: '$1.0M' },
  },
  hti: {
    timeline: buildTimeline(
      [88, 76, 58, 44, 28, 18, 12, 8, 6, 5, 4, 3],
      [0, 7, 22, 46, 72, 102, 118, 130, 138, 143, 147, 150],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 140, year2Projected: '$1.1M' },
  },
  htsi: {
    timeline: buildTimeline(
      [102, 88, 66, 50, 32, 20, 13, 10, 7, 5, 4, 4],
      [0, 8, 26, 52, 84, 118, 138, 152, 160, 166, 170, 174],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.8, year1ROI: 136, year2Projected: '$1.3M' },
  },
  he: {
    timeline: buildTimeline(
      [42, 36, 27, 20, 13, 8, 5, 4, 3, 2, 2, 1],
      [0, 3, 10, 22, 34, 48, 56, 62, 66, 68, 70, 72],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.4, year1ROI: 148, year2Projected: '$0.5M' },
  },
  gg: {
    timeline: buildTimeline(
      [28, 24, 18, 14, 8, 5, 4, 3, 2, 1, 1, 1],
      [0, 2, 6, 14, 22, 32, 38, 42, 44, 46, 47, 48],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 140, year2Projected: '$0.3M' },
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function formatDollars(n: number, symbol: string = '$'): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${symbol}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${symbol}${(abs / 1000).toFixed(0)}K`;
  return `${symbol}${abs.toLocaleString()}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateTimeline(stops: [TimelineStop, TimelineStop, TimelineStop], month: number): TimelineStop {
  const t = month / 12;
  if (t <= 0.5) {
    const segT = t / 0.5;
    return {
      savings: lerp(stops[0].savings, stops[1].savings, segT),
      score: lerp(stops[0].score, stops[1].score, segT),
      workflows: lerp(stops[0].workflows, stops[1].workflows, segT),
      waste: lerp(stops[0].waste, stops[1].waste, segT),
    };
  }
  const segT = (t - 0.5) / 0.5;
  return {
    savings: lerp(stops[1].savings, stops[2].savings, segT),
    score: lerp(stops[1].score, stops[2].score, segT),
    workflows: lerp(stops[1].workflows, stops[2].workflows, segT),
    waste: lerp(stops[1].waste, stops[2].waste, segT),
  };
}

function generateSparklineData(start: number, end: number, points: number = 8): { v: number }[] {
  const data: { v: number }[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = start + (end - start) * t;
    const noise = (Math.sin(i * 2.3) * 0.08 + Math.cos(i * 1.7) * 0.05) * Math.abs(end - start);
    data.push({ v: base + noise });
  }
  return data;
}

function scoreColor(score: number): string {
  if (score >= 70) return '#16A34A';
  if (score >= 50) return '#D97706';
  return '#DC2626';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-green-muted';
  if (score >= 50) return 'bg-amber-muted';
  return 'bg-red-muted';
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  Automated: { bg: 'bg-green-muted', text: 'text-green' },
  'In Progress': { bg: 'bg-amber-muted', text: 'text-amber' },
  Identified: { bg: 'bg-surface-sunken', text: 'text-ink-tertiary' },
};

/* ── Collapsible Section ─────────────────────────────────── */

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }: { title: string; icon: React.ElementType; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-3 cursor-pointer group w-full text-left"
      >
        <Icon className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
        <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
        <ChevronDown className={`w-4 h-4 text-ink-tertiary transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Sparkline component ─────────────────────────────────── */

function Sparkline({ data, color, width = 100, height = 36 }: { data: { v: number }[]; color: string; width?: number; height?: number }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace('#', '')})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Custom Tooltip (cost curve) ─────────────────────────── */

function CostCurveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised border border-border rounded-lg shadow-lg px-4 py-3">
      <div className="text-[12px] font-semibold text-ink mb-2">{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-ink-secondary">{entry.name}</span>
          </div>
          <span className="font-mono font-semibold tabular-nums text-ink">
            {entry.value < 0 ? '-' : ''}${Math.abs(entry.value)}k
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function Analytics() {
  const { company, companies, setCompanyId } = useCompany();
  const data = analyticsData[company.id] || analyticsData.meridian;
  const curve = costCurveData[company.id] || costCurveData.meridian;

  const [timelineMonth, setTimelineMonth] = useState(12);
  const [showInaction, setShowInaction] = useState(false);

  const timelineValues = useMemo(
    () => interpolateTimeline(data.timeline, timelineMonth),
    [data.timeline, timelineMonth],
  );

  const savingsSparkline = useMemo(
    () => generateSparklineData(0, data.kpis.savings),
    [data],
  );
  const scoreSparkline = useMemo(
    () => generateSparklineData(data.kpis.scoreBefore, data.kpis.scoreAfter),
    [data.kpis.scoreBefore, data.kpis.scoreAfter],
  );
  const workflowSparkline = useMemo(
    () => generateSparklineData(0, data.kpis.workflows),
    [data.kpis.workflows],
  );
  const wasteSparkline = useMemo(
    () => generateSparklineData(data.kpis.waste, data.kpis.waste * 0.15),
    [data.kpis.waste],
  );

  const radialData = [
    { name: 'score', value: data.readiness.score, fill: scoreColor(data.readiness.score) },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Overview</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          AI readiness and transformation overview for {company.shortName}
        </p>
      </div>

      {/* ── Company Profile ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 bg-surface-raised border border-border rounded-xl px-6 py-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            company.category === 'conglomerate' ? 'bg-purple-500/15' :
            company.category === 'sovereign' ? 'bg-emerald-500/15' :
            'bg-blue-muted'
          }`}>
            <span className={`text-[14px] font-bold ${
              company.category === 'conglomerate' ? 'text-purple-400' :
              company.category === 'sovereign' ? 'text-emerald-400' :
              'text-blue'
            }`}>{company.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-semibold text-ink truncate">{company.name}</h2>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                company.category === 'conglomerate' ? 'bg-purple-500/10 text-purple-400' :
                company.category === 'sovereign' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-blue-muted text-blue'
              }`}>
                {company.category === 'sovereign' ? 'Sovereign' : company.category === 'conglomerate' ? 'Conglomerate' : 'Enterprise'}
              </span>
            </div>
            <p className="text-[12px] text-ink-tertiary mb-3">{company.tagline}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.industry}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.revenue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.employees.toLocaleString()} employees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.opCos} {company.category === 'sovereign' ? 'agencies' : company.category === 'conglomerate' ? 'operating companies' : company.opCos > 1 ? 'operating companies' : 'entity'}</span>
              </div>
            </div>
            {company.subEntities && company.subEntities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {company.subEntities.map((entity) => (
                  <span
                    key={entity}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      company.category === 'conglomerate' ? 'bg-purple-500/8 text-purple-400/80' :
                      'bg-emerald-500/8 text-emerald-400/80'
                    }`}
                  >
                    {entity}
                  </span>
                ))}
                {company.subEntities.length < company.opCos && (
                  <span className="text-[10px] text-ink-faint px-2 py-0.5">
                    +{company.opCos - company.subEntities.length} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Sub-Entity Breakdown (conglomerate/sovereign only) ── */}
      {companies.filter(c => c.parentId === company.id).length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">
              {company.category === 'sovereign' ? 'Agencies' : 'Operating Companies'}
            </h2>
            <span className="text-[11px] text-ink-faint">
              {companies.filter(c => c.parentId === company.id).length} of {company.opCos} shown
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {companies.filter(c => c.parentId === company.id).map((sub, i) => {
              const subData = analyticsData[sub.id];
              const subCurve = costCurveData[sub.id];
              if (!subData || !subCurve) return null;
              return (
                <motion.button
                  key={sub.id}
                  type="button"
                  onClick={() => setCompanyId(sub.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="bg-surface-raised border border-border rounded-xl px-5 py-4 text-left hover:border-blue/30 hover:bg-blue/[0.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        company.category === 'conglomerate' ? 'bg-purple-500/15' : 'bg-emerald-500/15'
                      }`}>
                        <span className={`text-[11px] font-bold ${
                          company.category === 'conglomerate' ? 'text-purple-400' : 'text-emerald-400'
                        }`}>{sub.initials}</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-ink group-hover:text-blue transition-colors">{sub.shortName}</div>
                        <div className="text-[11px] text-ink-tertiary">{sub.industry}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-blue transition-colors mt-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Savings</div>
                      <div className="text-[15px] font-semibold tabular-nums text-green">{formatDollars(subData.kpis.savings, sub.currency)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Readiness</div>
                      <div className="text-[15px] font-semibold tabular-nums text-ink">
                        <span className="text-ink-tertiary text-[12px]">{subData.kpis.scoreBefore}</span>
                        <ChevronRight className="inline w-3 h-3 text-ink-faint mx-0.5" />
                        <span>{subData.kpis.scoreAfter}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Workflows</div>
                      <div className="text-[15px] font-semibold tabular-nums text-ink">{subData.kpis.workflows}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                    <span className="text-[11px] text-ink-tertiary">{sub.employees.toLocaleString()} employees</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-[11px] text-ink-tertiary">{sub.revenue}</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-[11px] text-ink-tertiary">ROI {subCurve.payback.year1ROI}%</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── AI Readiness Score ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 bg-surface-raised border border-border rounded-xl px-6 py-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">AI Readiness Score</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Radial gauge */}
          <div className="relative w-[160px] h-[160px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="100%"
                startAngle={225}
                endAngle={-45}
                data={radialData}
                barSize={12}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: '#F4F4F5' }}
                  isAnimationActive
                  animationDuration={1200}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight text-ink leading-none">
                {data.readiness.score}
              </span>
              <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-1">
                / 100
              </span>
            </div>
          </div>
          {/* Label */}
          <div className="flex-1 text-center sm:text-left">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-2 ${scoreBg(data.readiness.score)}`}
              style={{ color: scoreColor(data.readiness.score) }}
            >
              <Sparkles className="w-3 h-3" />
              {data.readiness.score >= 70 ? 'Good' : data.readiness.score >= 50 ? 'Below Average' : 'Critical'}
            </div>
            <p className="text-[13px] text-ink-secondary leading-relaxed">
              {data.readiness.label}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Sparkline Cards ─────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Identified Savings */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-green-muted">
                    <DollarSign className="w-3.5 h-3.5 text-green" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Savings</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  {formatDollars(data.kpis.savings, company.currency)}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">identified to date</div>
              </div>
              <Sparkline data={savingsSparkline} color="#16A34A" />
            </div>
          </motion.div>

          {/* Tech Stack Score */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-blue-muted">
                    <Cpu className="w-3.5 h-3.5 text-blue" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Tech Stack</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  <span className="text-ink-tertiary text-[16px]">{data.kpis.scoreBefore}</span>
                  <ChevronRight className="inline w-4 h-4 text-ink-faint mx-0.5 -mt-0.5" />
                  <span>{data.kpis.scoreAfter}</span>
                </div>
                <div className="text-[11px] text-ink-faint mt-1">readiness score</div>
              </div>
              <Sparkline data={scoreSparkline} color="#2563EB" />
            </div>
          </motion.div>

          {/* Workflows Analyzed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-green-muted">
                    <Workflow className="w-3.5 h-3.5 text-green" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Workflows</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  {data.kpis.workflows}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">
                  <span className="text-green font-medium">{data.kpis.workflowsReady} ready</span> for automation
                </div>
              </div>
              <Sparkline data={workflowSparkline} color="#16A34A" />
            </div>
          </motion.div>

          {/* License Waste */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-red-muted">
                    <Trash2 className="w-3.5 h-3.5 text-red" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">License Waste</span>
                </div>
                <div className="text-[22px] font-semibold text-red tabular-nums tracking-tight leading-none mt-2">
                  {formatDollars(data.kpis.waste, company.currency)}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">annual waste identified</div>
              </div>
              <Sparkline data={wasteSparkline} color="#DC2626" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Implementation Cost Curve (promoted from Assessment) ── */}
      <CollapsibleSection title="Implementation Cost Curve" icon={TrendingUp}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-5"
        >
          <div className="h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve.timeline} margin={{ top: 24, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradCostsOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradSavingsOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#A1A1AA' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#A1A1AA' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${Math.abs(v)}k`}
                  width={54}
                />
                <Tooltip content={<CostCurveTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#52525B' }}
                />
                <ReferenceLine
                  x={curve.breakEvenLabel}
                  stroke="#2563EB"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Break-even',
                    position: 'top',
                    fill: '#2563EB',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Implementation Costs"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fill="url(#gradCostsOverview)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="Cumulative Savings"
                  stroke="#16A34A"
                  strokeWidth={2}
                  fill="url(#gradSavingsOverview)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net Value"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  fill="none"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payback Analysis cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-muted rounded-xl p-5 mt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-blue-muted">
                  <Clock className="w-4 h-4 text-blue" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Payback Period</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-blue leading-none">
                {curve.payback.paybackMonths}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">months to break even</div>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <TrendingUp className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 1 ROI</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {curve.payback.year1ROI}%
              </div>
              <div className="text-[11px] text-ink-faint mt-1">return on investment</div>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <DollarSign className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 2 Projected</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {curve.payback.year2Projected}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">cumulative savings</div>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* ── Transformation Timeline ────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Transformation Timeline</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-5"
        >
          {/* Slider */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Today</span>
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Month 6</span>
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Month 12</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={timelineMonth}
              onChange={(e) => setTimelineMonth(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-sunken cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-surface-raised [&::-webkit-slider-thumb]:shadow-sm
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-raised"
            />
            <div className="text-center mt-1">
              <span className="text-[12px] font-semibold text-blue tabular-nums">
                Month {timelineMonth % 1 === 0 ? timelineMonth : timelineMonth.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Interpolated values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-green tabular-nums tracking-tight">
                {formatDollars(timelineValues.savings, company.currency)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Savings</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-blue tabular-nums tracking-tight">
                {Math.round(timelineValues.score)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Tech Score</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-ink tabular-nums tracking-tight">
                {Math.round(timelineValues.workflows)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Workflows</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-red tabular-nums tracking-tight">
                {formatDollars(timelineValues.waste, company.currency)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Waste</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Top Opportunities Table ────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Table2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Top Opportunities</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-raised border border-border rounded-xl overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_100px_100px] sm:grid-cols-[48px_1fr_120px_120px] px-5 py-2.5 border-b border-border-subtle bg-surface-sunken">
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">#</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">Opportunity</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Est. Savings</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Status</span>
          </div>
          {/* Table rows */}
          {data.opportunities.map((opp, i) => {
            const style = statusStyles[opp.status];
            return (
              <motion.div
                key={opp.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className={`grid grid-cols-[40px_1fr_100px_100px] sm:grid-cols-[48px_1fr_120px_120px] px-5 py-3 items-center ${
                  i < data.opportunities.length - 1 ? 'border-b border-border-subtle' : ''
                }`}
              >
                <span className="text-[12px] font-semibold text-ink-tertiary tabular-nums">{opp.priority}</span>
                <span className="text-[13px] font-medium text-ink truncate pr-2">{opp.name}</span>
                <span className="text-[13px] font-semibold text-ink tabular-nums text-right">
                  {formatDollars(opp.savings, company.currency)}
                </span>
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
                  >
                    {opp.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Cost of Inaction Toggle ────────────────────────── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowInaction(!showInaction)}
            className="flex items-center gap-2 mb-3 group cursor-pointer"
          >
            {showInaction ? (
              <ToggleRight className="w-5 h-5 text-red" strokeWidth={1.7} />
            ) : (
              <ToggleLeft className="w-5 h-5 text-ink-tertiary" strokeWidth={1.7} />
            )}
            <AlertTriangle className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink group-hover:text-ink-secondary transition-colors">
              Cost of Inaction
            </h2>
            <span className="text-[11px] text-ink-faint ml-1">
              {showInaction ? 'Hide' : 'Show'} 3-year projection
            </span>
          </button>

          <AnimatePresence>
            {showInaction && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-red-muted border border-red/15 rounded-xl px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red" strokeWidth={1.7} />
                    <span className="text-[13px] font-semibold text-red">
                      Projected wasted spend without action
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 1</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year1, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 2</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year2, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 3</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year3, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised rounded-lg px-4 py-3 text-center border border-red/10">
                      <div className="text-[10px] font-semibold text-red uppercase tracking-wider mb-1">3-Year Total</div>
                      <div className="text-[24px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.total, company.currency)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-red/70 mt-3 leading-relaxed">
                    Without AI transformation, {company.shortName} risks accumulating {formatDollars(data.inaction.total, company.currency)} in
                    preventable costs from license waste, manual process overhead, and missed automation opportunities over the
                    next three years.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Cross-link to Command Center ──────────────────────── */}
      <a
        href={COMMAND_CENTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 transition-colors"
      >
        View full assessment
        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
      </a>
    </div>
  );
}
