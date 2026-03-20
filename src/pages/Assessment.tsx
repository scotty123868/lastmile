import { motion } from 'framer-motion';
import {
  Cpu,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
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

/* ── Types ───────────────────────────────────────────────── */

interface TechTool {
  name: string;
  category: string;
  current: number;
  target: number;
}

interface LicenseEntry {
  vendor: string;
  total: number;
  active: number;
  waste: number;
  action: string;
}

interface TimelineMonth {
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

interface CompanyAssessmentData {
  techStack: TechTool[];
  licenses: LicenseEntry[];
  timeline: TimelineMonth[];
  breakEvenMonth: number;
  breakEvenLabel: string;
  payback: PaybackData;
}

/* ── Company-specific data ───────────────────────────────── */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildTimeline(costs: number[], savings: number[]): TimelineMonth[] {
  return months.map((m, i) => ({
    month: m,
    costs: costs[i],
    savings: savings[i],
    net: savings[i] - costs[i],
  }));
}

const assessmentData: Record<string, CompanyAssessmentData> = {
  meridian: {
    techStack: [
      { name: 'SAP Business One', category: 'ERP', current: 3, target: 7 },
      { name: 'Salesforce', category: 'CRM', current: 5, target: 8 },
      { name: 'No Data Lake', category: 'Analytics', current: 1, target: 9 },
      { name: 'Tableau', category: 'BI', current: 6, target: 8 },
      { name: 'ServiceTitan', category: 'Field Ops', current: 4, target: 8 },
      { name: 'ADP', category: 'HR/Payroll', current: 5, target: 7 },
    ],
    licenses: [
      { vendor: 'Salesforce CRM', total: 280, active: 185, waste: 340000, action: 'Downgrade 95 seats to Platform licenses' },
      { vendor: 'Tableau', total: 120, active: 62, waste: 195000, action: 'Convert 40 to Viewer-only licenses' },
      { vendor: 'SAP Business One', total: 85, active: 71, waste: 148000, action: 'Consolidate 2 unused OpCo instances' },
      { vendor: 'Microsoft 365 E5', total: 450, active: 390, waste: 117000, action: 'Downgrade 60 to E3 tier' },
    ],
    timeline: buildTimeline(
      [580, 520, 380, 280, 180, 120, 80, 60, 45, 35, 30, 25],
      [0, 40, 120, 240, 380, 520, 580, 620, 640, 660, 670, 680],
    ),
    breakEvenMonth: 5,
    breakEvenLabel: 'May',
    payback: { paybackMonths: 4.2, year1ROI: 150, year2Projected: '$6.1M' },
  },
  oakwood: {
    techStack: [
      { name: 'Guidewire ClaimCenter', category: 'Claims', current: 4, target: 8 },
      { name: 'AS/400 Legacy', category: 'Policy Admin', current: 1, target: 6 },
      { name: 'Salesforce', category: 'CRM', current: 5, target: 8 },
      { name: 'SAS Analytics', category: 'BI', current: 3, target: 7 },
      { name: 'Availity', category: 'Provider Network', current: 4, target: 7 },
      { name: 'Custom Portal', category: 'Agent Portal', current: 2, target: 7 },
    ],
    licenses: [
      { vendor: 'Guidewire Suite', total: 150, active: 98, waste: 260000, action: 'Consolidate test environments' },
      { vendor: 'SAS Analytics', total: 80, active: 35, waste: 185000, action: 'Migrate 30 seats to Power BI' },
      { vendor: 'Salesforce', total: 200, active: 142, waste: 108000, action: 'Remove inactive agent accounts' },
      { vendor: 'Legacy AS/400 terminals', total: 60, active: 28, waste: 67000, action: 'Decommission unused terminals' },
    ],
    timeline: buildTimeline(
      [640, 580, 440, 320, 200, 140, 95, 70, 50, 40, 35, 30],
      [0, 30, 100, 200, 340, 480, 560, 600, 630, 650, 660, 670],
    ),
    breakEvenMonth: 6,
    breakEvenLabel: 'Jun',
    payback: { paybackMonths: 5.1, year1ROI: 128, year2Projected: '$5.4M' },
  },
  pinnacle: {
    techStack: [
      { name: 'Epic EHR', category: 'Clinical', current: 7, target: 9 },
      { name: 'Athenahealth', category: 'Billing', current: 5, target: 8 },
      { name: 'Custom Scheduling', category: 'Operations', current: 3, target: 8 },
      { name: 'Surescripts', category: 'Pharmacy', current: 6, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 4, target: 7 },
      { name: 'Workday', category: 'HR', current: 6, target: 8 },
    ],
    licenses: [
      { vendor: 'Epic Add-on Modules', total: 45, active: 28, waste: 85000, action: 'Audit unused clinical modules' },
      { vendor: 'Athenahealth', total: 60, active: 44, waste: 48000, action: 'Consolidate billing workflows' },
      { vendor: 'Power BI Pro', total: 35, active: 18, waste: 27000, action: 'Switch to shared capacity model' },
      { vendor: 'Zoom Healthcare', total: 80, active: 65, waste: 20000, action: 'Downgrade to basic for non-clinical' },
    ],
    timeline: buildTimeline(
      [280, 240, 180, 130, 80, 50, 35, 25, 20, 15, 12, 10],
      [0, 20, 60, 120, 180, 220, 250, 270, 280, 285, 290, 295],
    ),
    breakEvenMonth: 4,
    breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.1, year1ROI: 185, year2Projected: '$1.8M' },
  },
  atlas: {
    techStack: [
      { name: 'SAP S/4HANA', category: 'ERP', current: 4, target: 8 },
      { name: 'Siemens MindSphere', category: 'IoT', current: 3, target: 9 },
      { name: 'Oracle SCM', category: 'Supply Chain', current: 3, target: 7 },
      { name: 'Aveva', category: 'Plant Ops', current: 2, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 5, target: 8 },
      { name: 'SAP SuccessFactors', category: 'HR', current: 5, target: 7 },
    ],
    licenses: [
      { vendor: 'SAP S/4HANA', total: 320, active: 245, waste: 480000, action: 'Harmonize cross-plant user roles' },
      { vendor: 'Siemens MindSphere', total: 180, active: 95, waste: 340000, action: 'Consolidate sensor gateway licenses' },
      { vendor: 'Oracle SCM', total: 150, active: 108, waste: 210000, action: 'Migrate 3 plants to unified instance' },
      { vendor: 'Aveva', total: 90, active: 52, waste: 170000, action: 'Retire legacy plant modules' },
    ],
    timeline: buildTimeline(
      [720, 650, 500, 380, 250, 170, 110, 80, 60, 45, 38, 32],
      [0, 50, 140, 280, 440, 620, 720, 780, 820, 850, 870, 880],
    ),
    breakEvenMonth: 5,
    breakEvenLabel: 'May',
    payback: { paybackMonths: 4.8, year1ROI: 142, year2Projected: '$7.2M' },
  },
  northbridge: {
    techStack: [
      { name: 'SAP S/4HANA Cloud', category: 'ERP', current: 6, target: 9 },
      { name: 'Workday', category: 'HR/Finance', current: 7, target: 9 },
      { name: 'Palantir Foundry', category: 'Analytics', current: 5, target: 9 },
      { name: 'Salesforce', category: 'CRM', current: 6, target: 8 },
      { name: 'Siemens Xcelerator', category: 'Industrial IoT', current: 4, target: 9 },
      { name: 'ServiceNow', category: 'IT/Ops', current: 7, target: 9 },
    ],
    licenses: [
      { vendor: 'SAP S/4HANA', total: 2400, active: 1680, waste: 3800000, action: 'Harmonize 12 OpCo instances to unified tenant' },
      { vendor: 'Workday', total: 1800, active: 1420, waste: 1400000, action: 'Consolidate legacy HRIS systems' },
      { vendor: 'Palantir Foundry', total: 340, active: 180, waste: 840000, action: 'Migrate 8 OpCos to shared analytics layer' },
      { vendor: 'Salesforce Enterprise', total: 4200, active: 3100, waste: 2200000, action: 'Downgrade 1,100 to Platform licenses' },
    ],
    timeline: buildTimeline(
      [3200, 2800, 2100, 1600, 1000, 680, 440, 320, 240, 180, 140, 110],
      [0, 200, 800, 1800, 3200, 5400, 7200, 9400, 11800, 14200, 16800, 18600],
    ),
    breakEvenMonth: 5,
    breakEvenLabel: 'May',
    payback: { paybackMonths: 5.4, year1ROI: 122, year2Projected: '$42M' },
  },
  estonia: {
    techStack: [
      { name: 'X-Road', category: 'Data Exchange', current: 8, target: 10 },
      { name: 'RIHA', category: 'Info System Registry', current: 7, target: 9 },
      { name: 'eID / Smart-ID', category: 'Identity', current: 9, target: 10 },
      { name: 'TEHIK', category: 'Health IT', current: 6, target: 9 },
      { name: 'SAP', category: 'Financial Mgmt', current: 5, target: 8 },
      { name: 'Custom Legacy', category: 'Social Services', current: 3, target: 8 },
    ],
    licenses: [
      { vendor: 'SAP Financial Suite', total: 840, active: 520, waste: 1200000, action: 'Migrate 4 ministries to shared instance' },
      { vendor: 'Oracle Database', total: 280, active: 140, waste: 680000, action: 'Consolidate to PostgreSQL + X-Road' },
      { vendor: 'Microsoft 365 E5', total: 12000, active: 8400, waste: 540000, action: 'Downgrade non-ministry staff to E3' },
      { vendor: 'Custom Legacy Systems', total: 42, active: 18, waste: 380000, action: 'Decommission post-X-Road migration' },
    ],
    timeline: buildTimeline(
      [2400, 2100, 1600, 1200, 780, 520, 340, 240, 180, 140, 110, 90],
      [0, 180, 640, 1400, 2600, 4200, 5800, 7400, 9200, 11400, 14000, 16200],
    ),
    breakEvenMonth: 5,
    breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 138, year2Projected: '$28M' },
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function formatDollars(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(abs / 1000).toFixed(0)}K`;
  return `$${abs.toLocaleString()}`;
}

function scoreColor(score: number): { text: string; bg: string; bar: string } {
  if (score >= 7) return { text: 'text-green', bg: 'bg-green-muted', bar: 'bg-green' };
  if (score >= 4) return { text: 'text-amber', bg: 'bg-amber-muted', bar: 'bg-amber' };
  return { text: 'text-red', bg: 'bg-red-muted', bar: 'bg-red' };
}

function categoryBadgeColor(category: string): string {
  const map: Record<string, string> = {
    ERP: 'bg-blue-muted text-blue',
    CRM: 'bg-green-muted text-green',
    Analytics: 'bg-amber-muted text-amber',
    BI: 'bg-amber-muted text-amber',
    'HR/Payroll': 'bg-surface-sunken text-ink-tertiary',
    HR: 'bg-surface-sunken text-ink-tertiary',
    'Field Ops': 'bg-red-muted text-red',
    Claims: 'bg-red-muted text-red',
    'Policy Admin': 'bg-surface-sunken text-ink-tertiary',
    'Provider Network': 'bg-green-muted text-green',
    'Agent Portal': 'bg-amber-muted text-amber',
    Clinical: 'bg-green-muted text-green',
    Billing: 'bg-amber-muted text-amber',
    Operations: 'bg-blue-muted text-blue',
    Pharmacy: 'bg-green-muted text-green',
    IoT: 'bg-blue-muted text-blue',
    'Supply Chain': 'bg-amber-muted text-amber',
    'Plant Ops': 'bg-red-muted text-red',
    'HR/Finance': 'bg-surface-sunken text-ink-tertiary',
    'Industrial IoT': 'bg-blue-muted text-blue',
    'IT/Ops': 'bg-amber-muted text-amber',
    'Data Exchange': 'bg-green-muted text-green',
    'Info System Registry': 'bg-blue-muted text-blue',
    Identity: 'bg-green-muted text-green',
    'Health IT': 'bg-red-muted text-red',
    'Financial Mgmt': 'bg-amber-muted text-amber',
    'Social Services': 'bg-red-muted text-red',
  };
  return map[category] || 'bg-surface-sunken text-ink-tertiary';
}

/* ── Custom Tooltip ──────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
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

export default function Assessment() {
  const { company } = useCompany();
  const data = assessmentData[company.id] || assessmentData.meridian;

  const avgReadiness = Math.round(data.techStack.reduce((s, t) => s + t.current, 0) / data.techStack.length * 10) / 10;
  const totalWaste = data.licenses.reduce((s, l) => s + l.waste, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Assessment</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Diagnostic assessment and implementation roadmap for {company.shortName}
        </p>
      </div>

      {/* ── Section 1: Tech Stack Readiness ────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">Tech Stack Readiness</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-ink-tertiary uppercase tracking-wider font-medium">Avg Score</span>
            <span className={`text-[16px] font-semibold tabular-nums tracking-tight ${scoreColor(avgReadiness).text}`}>
              {avgReadiness}
            </span>
            <span className="text-[11px] text-ink-faint">/ 10</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.techStack.map((tool, i) => {
            const colors = scoreColor(tool.current);
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
                className="bg-surface-raised border border-border rounded-xl px-4 py-3.5"
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-ink truncate">{tool.name}</div>
                  </div>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium flex-shrink-0 ${categoryBadgeColor(tool.category)}`}>
                    {tool.category}
                  </span>
                </div>

                {/* Score bar */}
                <div className="relative h-2 rounded-full bg-surface-sunken overflow-visible mb-1.5">
                  <motion.div
                    className={`absolute left-0 top-0 h-full rounded-full ${colors.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(tool.current / 10) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-[-2px] w-[2px] h-[12px] rounded-full bg-ink-tertiary"
                    style={{ left: `${(tool.target / 10) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] text-ink-tertiary">
                  <span className={`font-semibold tabular-nums ${colors.text}`}>{tool.current}</span>
                  <ChevronRight className="w-3 h-3 text-ink-faint" />
                  <span className="font-semibold tabular-nums text-green">{tool.target}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: License Waste Analysis ──────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">License Waste</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-ink-tertiary uppercase tracking-wider font-medium">Total Waste</span>
            <span className="text-[16px] font-semibold tabular-nums tracking-tight text-red">
              {formatDollars(totalWaste)}
            </span>
            <span className="text-[11px] text-ink-faint">/ yr</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.licenses.map((lic, i) => {
            const utilization = Math.round((lic.active / lic.total) * 100);
            return (
              <motion.div
                key={lic.vendor}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-ink">{lic.vendor}</span>
                  <span className="text-[14px] font-semibold font-mono tabular-nums text-red">
                    -{formatDollars(lic.waste)}
                  </span>
                </div>

                {/* Utilization bar */}
                <div className="relative h-2 rounded-full bg-surface-sunken overflow-hidden mb-1.5">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${utilization}%` }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-ink-tertiary">
                    <span className="font-semibold tabular-nums text-ink-secondary">{lic.active}</span>
                    {' / '}
                    <span className="tabular-nums">{lic.total}</span>
                    {' licenses active'}
                    <span className="mx-1.5 text-ink-faint">&middot;</span>
                    <span className={`font-semibold tabular-nums ${utilization >= 80 ? 'text-green' : utilization >= 60 ? 'text-amber' : 'text-red'}`}>
                      {utilization}%
                    </span>
                    {' utilized'}
                  </span>
                </div>

                <p className="text-[11px] text-ink-tertiary italic mt-1.5">{lic.action}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Implementation Cost Curve ───────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Implementation Timeline & Cost Curve</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-5"
        >
          <div className="h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeline} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradCosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
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
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#52525B' }}
                />
                <ReferenceLine
                  x={data.breakEvenLabel}
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
                  fill="url(#gradCosts)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="Cumulative Savings"
                  stroke="#16A34A"
                  strokeWidth={2}
                  fill="url(#gradSavings)"
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
      </section>

      {/* ── Section 4: Payback Analysis ────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Payback Analysis</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-muted rounded-xl p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payback Period */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-blue-muted">
                  <Clock className="w-4 h-4 text-blue" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Payback Period</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-blue leading-none">
                {data.payback.paybackMonths}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">months to break even</div>
            </motion.div>

            {/* Year 1 ROI */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <TrendingUp className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 1 ROI</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {data.payback.year1ROI}%
              </div>
              <div className="text-[11px] text-ink-faint mt-1">return on investment</div>
            </motion.div>

            {/* Year 2 Projected */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <DollarSign className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 2 Projected</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {data.payback.year2Projected}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">cumulative savings</div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
