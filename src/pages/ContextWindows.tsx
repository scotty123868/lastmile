import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  Clock,
  Users,
  Database,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Cpu,
  RefreshCw,
  Search,
} from 'lucide-react';

/* ── Animation ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ── Helpers ──────────────────────────────────────────────── */

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

/* ── Pipeline log generator ──────────────────────────────── */

type OpType = 'PROCESS' | 'ENRICH' | 'MERGE' | 'REFRESH' | 'SCORE' | 'CLEAN' | 'MAP' | 'TOKEN';

interface LogEntry {
  ts: string;
  op: OpType;
  msg: string;
}

const opColors: Record<OpType, string> = {
  PROCESS: 'text-blue',
  ENRICH: 'text-green',
  MERGE: 'text-purple-400',
  REFRESH: 'text-cyan-400',
  SCORE: 'text-amber',
  CLEAN: 'text-red-400',
  MAP: 'text-ink-tertiary',
  TOKEN: 'text-yellow-400',
};

function generateLogEntry(): LogEntry {
  const templates: { op: OpType; msg: string }[] = [
    { op: 'PROCESS', msg: `SAP work orders → normalized ${randomInt(400, 1200)} records (${randomInt(1, 8)} duplicates removed)` },
    { op: 'ENRICH', msg: `Added weather data to ${randomInt(8, 24)} track inspection contexts` },
    { op: 'MERGE', msg: `Cross-referenced Kronos certifications with ${randomInt(8, 22)} crew assignments` },
    { op: 'REFRESH', msg: `Updated ${randomInt(110, 145)} active context windows (avg freshness: ${(Math.random() * 2 + 1.5).toFixed(1)} min)` },
    { op: 'SCORE', msg: `Relevance scoring complete for ${randomInt(2800, 4200).toLocaleString()} data points` },
    { op: 'CLEAN', msg: `Removed ${randomInt(12, 35)} stale records (>24h without update)` },
    { op: 'MAP', msg: `Schema mapped ${randomInt(8, 20)} new Primavera fields to unified model` },
    { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(8, 18)} contexts (saved ${randomInt(5000, 12000).toLocaleString()} tokens)` },
    { op: 'PROCESS', msg: `FRA inspection data → normalized ${randomInt(30, 120)} records` },
    { op: 'ENRICH', msg: `Attached GPS coordinates to ${randomInt(40, 200)} equipment records` },
    { op: 'MERGE', msg: `Linked ${randomInt(5, 15)} P6 schedule updates to active work orders` },
    { op: 'REFRESH', msg: `Refreshed ${randomInt(30, 80)} safety context windows (avg freshness: ${(Math.random() * 1.5 + 0.8).toFixed(1)} min)` },
    { op: 'SCORE', msg: `Priority re-ranked ${randomInt(50, 150)} defect records by severity` },
    { op: 'CLEAN', msg: `Archived ${randomInt(5, 20)} resolved defect records` },
    { op: 'MAP', msg: `Mapped ${randomInt(3, 12)} new PTC signal fields to telemetry schema` },
    { op: 'TOKEN', msg: `Context window trimming: ${randomInt(4, 10)} windows reduced to fit budget` },
  ];
  const pick = templates[Math.floor(Math.random() * templates.length)];
  return { ts: formatTime(new Date()), op: pick.op, msg: pick.msg };
}

/* ── Initial log entries ──────────────────────────────────── */

function generateInitialLogs(): LogEntry[] {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now - (11 - i) * 7000);
    const entry = generateLogEntry();
    return { ...entry, ts: formatTime(d) };
  });
}

/* ── Division data ────────────────────────────────────────── */

interface DivisionRow {
  name: string;
  fullName: string;
  activeUsers: number;
  avgFreshness: number;
  completeness: number;
  queriesPerDay: number;
  successRate: number;
}

const divisionData: DivisionRow[] = [
  { name: 'HCC', fullName: 'Herzog Contracting', activeUsers: 432, avgFreshness: 2.1, completeness: 87, queriesPerDay: 1240, successRate: 99.4 },
  { name: 'HTSI', fullName: 'Herzog Tech Services', activeUsers: 202, avgFreshness: 1.8, completeness: 91, queriesPerDay: 680, successRate: 99.6 },
  { name: 'HTI', fullName: 'Herzog Transit', activeUsers: 161, avgFreshness: 3.2, completeness: 82, queriesPerDay: 420, successRate: 98.8 },
  { name: 'HRSI', fullName: 'Herzog Railroad Services', activeUsers: 129, avgFreshness: 2.4, completeness: 85, queriesPerDay: 340, successRate: 99.1 },
  { name: 'HSI', fullName: 'Herzog Services', activeUsers: 106, avgFreshness: 1.5, completeness: 94, queriesPerDay: 290, successRate: 99.7 },
  { name: 'HE', fullName: 'Herzog Energy', activeUsers: 34, avgFreshness: 4.7, completeness: 72, queriesPerDay: 89, successRate: 97.2 },
  { name: 'GG', fullName: 'Green Group', activeUsers: 20, avgFreshness: 5.1, completeness: 68, queriesPerDay: 45, successRate: 96.8 },
];

/* ── Query type chart data ────────────────────────────────── */

const queryTypes = [
  { label: 'Project status inquiries', pct: 34, color: 'bg-blue' },
  { label: 'Compliance / inspection lookups', pct: 22, color: 'bg-green' },
  { label: 'Resource availability', pct: 18, color: 'bg-purple-400' },
  { label: 'Cost analysis', pct: 14, color: 'bg-amber' },
  { label: 'Safety reporting', pct: 8, color: 'bg-red-400' },
  { label: 'Other', pct: 4, color: 'bg-ink-tertiary' },
];

/* ── Pipeline stages ──────────────────────────────────────── */

interface PipelineStage {
  title: string;
  items: string[];
  stat: string;
}

const pipelineStages: PipelineStage[] = [
  { title: 'SOURCE DATA', items: ['SAP Work Orders', 'P6 Schedules', 'GPS Feeds', 'Kronos', 'FRA Data', 'PTC Logs'], stat: '47 systems' },
  { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Dedup & merge', 'Enrich w/ metadata', 'Schema map to unified model'], stat: '2.4M records' },
  { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '1,084 windows' },
  { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: '127 active now' },
];

/* ── Context example data ─────────────────────────────────── */

interface ContextExample {
  id: string;
  user: string;
  role: string;
  division: string;
  query: string;
  contextTree: string;
  aiResponse: string;
  quality: string;
  sources: number;
  updated: string;
  tokensUsed: number;
  tokenBudget: number;
}

const contextExamples: ContextExample[] = [
  {
    id: 'track-inspector',
    user: 'Sarah Chen',
    role: 'Track Inspector',
    division: 'HSI Division',
    query: 'What\'s the defect history for MP 247?',
    contextTree: `├── Track Classification: FRA Class 4, BNSF Mainline
├── Last 12 Inspections (MP 245-250):
│   ├── 2026-03-18: Surface 2.1" (exceeds 2.0" limit)
│   ├── 2026-02-22: Surface 1.8" (within spec)
│   ├── 2026-01-15: Surface 1.6" (within spec)
│   └── ... 9 more
├── Active Defects in Range:
│   ├── Cracked joint bar @ MP 249.1 (reported 3/22)
│   ├── Fouled ballast MP 248.5-248.8 (reported 3/22)
│   └── 4 defective ties near MP 248.2 (reported 3/22)
├── Weather Data: 2.3" rain last 7 days (impacts drainage)
├── Traffic Density: 28 trains/day, 45 MGT annual
├── Maintenance History: Last surfacing 2024-08-14
└── FRA Standards Reference: Part 213 Class 4 limits`,
    aiResponse: `MP 247 shows an accelerating surface degradation trend. Three inspections show 1.6" \u2192 1.8" \u2192 2.1" over 90 days. At this rate, you'll exceed emergency limits within 3 weeks. Combined with the fouled ballast at MP 248.5 and recent heavy rainfall, I recommend prioritizing this section for surfacing. There's also an open cracked joint bar at MP 249.1 that needs attention within 30 days per FRA \u00a7213.121.`,
    quality: '96%',
    sources: 12,
    updated: '3 min ago',
    tokensUsed: 4247,
    tokenBudget: 8192,
  },
  {
    id: 'project-manager',
    user: 'Mike Torres',
    role: 'Senior PM',
    division: 'HCC Division',
    query: 'How are we tracking on the I-70 bridge project?',
    contextTree: `├── Project: I-70 Bridge Rehabilitation (WO-2025-08834)
├── Budget: $3.1M approved | $2.14M spent (69%)
├── Schedule: Day 127 of 180 (71% elapsed)
│   ├── Critical Path: Bearing installation (12 days remaining)
│   ├── 3 tasks behind schedule (total 8 day slip)
│   └── Weather delays: 5 days lost in February
├── Resources:
│   ├── 14 crew assigned (12 active today)
│   ├── Equipment: 2 cranes, 1 concrete pump on-site
│   └── Subcontractors: 3 active (steel, electrical, painting)
├── Financials:
│   ├── Materials: $1.2M spent / $1.4M budgeted (86%)
│   ├── Labor: $680K spent / $900K budgeted (76%)
│   ├── Equipment: $180K spent / $200K budgeted (90%)
│   └── Contingency: $120K remaining of $300K
├── Risk Register: 2 active risks (material delays, weather)
├── Change Orders: 2 approved (+$180K), 1 pending ($45K)
└── Comparable Projects: 3 similar bridges (avg. 12% over budget)`,
    aiResponse: `I-70 bridge is tracking at 69% budget consumed vs 71% schedule elapsed \u2014 slightly ahead on spend. However, the 8-day schedule slip on critical path tasks puts the August 15 deadline at risk. Your contingency is at $120K with one pending change order for $45K. Based on comparable projects, you're within the typical variance range, but I'd recommend requesting the bearing shipment be expedited \u2014 that's your critical path constraint.`,
    quality: '91%',
    sources: 8,
    updated: '7 min ago',
    tokensUsed: 3891,
    tokenBudget: 8192,
  },
  {
    id: 'safety-officer',
    user: 'Jennifer Walsh',
    role: 'Safety Director',
    division: 'Herzog Companies',
    query: 'Are we FRA compliant across all divisions?',
    contextTree: `├── FRA Inspection Status (all divisions):
│   ├── HCC: 47 inspections current, 2 overdue (MP 247, MP 312)
│   ├── HRSI: 23 inspections current, 0 overdue
│   ├── HSI: 89 inspections current, 1 overdue (car #4421)
│   ├── HTI: 34 signal inspections current, 0 overdue
│   ├── HTSI: 156 inspections current, 3 overdue
│   └── Total: 349 current, 6 overdue (98.3% compliant)
├── Open Defects by Severity:
│   ├── Critical: 2 (cracked joint bar MP 249.1, signal fault Zone 8)
│   ├── Moderate: 14
│   └── Minor: 47
├── Hours of Service Violations (last 30 days): 0
├── Drug & Alcohol Testing: 100% compliant, last random: 3/20
├── Certification Expirations (next 30 days):
│   ├── 3 locomotive engineers (renewal scheduled)
│   └── 1 signal maintainer (URGENT \u2014 expires 4/2)
└── FRA Audit History: Last audit 2025-11-14 (passed, 2 findings resolved)`,
    aiResponse: `Overall FRA compliance is at 98.3% with 6 overdue inspections across 3 divisions. Two critical items need immediate attention: the cracked joint bar at MP 249.1 (HCC) and signal fault in Zone 8 (HTI). Most urgent non-inspection item: a signal maintainer certification expiring April 2 \u2014 that's 7 days away. I've flagged this to HR for emergency renewal processing.`,
    quality: '99%',
    sources: 23,
    updated: '1 min ago',
    tokensUsed: 5102,
    tokenBudget: 8192,
  },
];

/* ── Data Quality Alerts ──────────────────────────────────── */

interface DataAlert {
  severity: 'yellow' | 'green';
  title: string;
  detail: string;
  impact: string;
  action: string;
}

const dataAlerts: DataAlert[] = [
  {
    severity: 'yellow',
    title: 'Herzog Energy \u2014 Low Completeness (72%)',
    detail: 'Missing: Equipment serial numbers for 28% of assets',
    impact: 'AI can\'t cross-reference maintenance history for those assets',
    action: 'Data entry campaign scheduled for April 7-11',
  },
  {
    severity: 'yellow',
    title: 'Green Group \u2014 Stale GPS Data',
    detail: '12 vehicles with GPS feeds >10 minutes old',
    impact: 'Fleet optimization queries may use outdated positions',
    action: 'GPS firmware update in progress',
  },
  {
    severity: 'green',
    title: 'PTC Signal Data \u2014 Quality Improved',
    detail: 'Schema mapping improved from 73% to 91% after maintenance log integration',
    impact: 'Signal anomaly detection accuracy improved by 14%',
    action: 'Resolved: March 24',
  },
];

/* ════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════ */

export default function ContextWindows() {
  /* ── Live counter ───────────────────────────────────────── */
  const [activeUsers, setActiveUsers] = useState(127);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveUsers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(118, Math.min(142, prev + delta));
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* ── Pipeline log ───────────────────────────────────────── */
  const [logEntries, setLogEntries] = useState<LogEntry[]>(generateInitialLogs);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLogEntries(prev => [...prev.slice(-30), generateLogEntry()]);
    }, randomInt(6000, 10000));
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  /* ── Expanded example cards ─────────────────────────────── */
  const [expandedExample, setExpandedExample] = useState<string | null>('track-inspector');

  /* ── Expanded pipeline stage ────────────────────────────── */
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  /* ── Animated dots for pipeline ─────────────────────────── */
  const [dotPhase, setDotPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDotPhase(p => (p + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  /* ── Helper: freshness color ────────────────────────────── */
  const freshnessColor = useCallback((v: number) => (v < 3 ? 'text-green' : v <= 5 ? 'text-amber' : 'text-red-400'), []);
  const successColor = useCallback((v: number) => (v >= 99 ? 'text-green' : v >= 97 ? 'text-amber' : 'text-red-400'), []);

  let sectionIdx = 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-3 mb-1">
          <Layers className="w-5 h-5 text-blue" strokeWidth={1.7} />
          <h1 className="text-xl font-semibold text-ink tracking-tight">Context Windows</h1>
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed max-w-2xl">
          How the right data reaches the right people's AI tools. Every query is powered by a
          managed context window — role-filtered, freshness-guaranteed, and token-budget-optimized.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 1: Health Dashboard
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Freshness */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Context Freshness</span>
            </div>
            <div className="text-2xl font-bold text-green tracking-tight">97.3%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Data &lt; 5 min old</p>
          </div>
          {/* Success Rate */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Query Success</span>
            </div>
            <div className="text-2xl font-bold text-green tracking-tight">99.1%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Returned useful results</p>
          </div>
          {/* Completeness */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Data Completeness</span>
            </div>
            <div className="text-2xl font-bold text-blue tracking-tight">84.7%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Required fields populated</p>
          </div>
          {/* Active Users */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Active Users Now</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 tracking-tight flex items-center gap-2">
              {activeUsers}
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            </div>
            <p className="text-[11px] text-ink-tertiary mt-1">Using managed context</p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 2: How Context Windows Work (Pipeline)
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-4">How Context Windows Work</h2>
        <div className="rounded-lg bg-surface-raised border border-border p-5 overflow-hidden">
          {/* Pipeline stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {pipelineStages.map((stage, idx) => (
              <div key={stage.title} className="relative">
                {/* Arrow connector */}
                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <div className="relative w-8 flex items-center justify-center">
                      {/* Animated dots */}
                      {[0, 1, 2].map(dotIdx => {
                        const offset = ((dotPhase + dotIdx * 33) % 100) / 100;
                        return (
                          <span
                            key={dotIdx}
                            className="absolute w-1.5 h-1.5 rounded-full bg-blue"
                            style={{
                              left: `${offset * 100}%`,
                              opacity: 0.3 + offset * 0.7,
                            }}
                          />
                        );
                      })}
                      <ArrowRight className="w-4 h-4 text-border relative z-10" />
                    </div>
                  </div>
                )}
                {/* Mobile arrow */}
                {idx < pipelineStages.length - 1 && (
                  <div className="md:hidden flex justify-center py-2">
                    <div className="w-px h-6 bg-border relative">
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-border text-xs">&darr;</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                  className={`w-full text-left p-4 rounded-md border transition-colors ${
                    expandedStage === idx
                      ? 'border-blue/40 bg-blue/5'
                      : 'border-border/50 hover:border-border hover:bg-surface-sunken/30'
                  }`}
                >
                  <div className="text-[10px] font-bold tracking-widest text-blue uppercase mb-2">{stage.title}</div>
                  <ul className="space-y-1">
                    {stage.items.map(item => (
                      <li key={item} className="text-[11px] text-ink-secondary flex items-start gap-1.5">
                        <span className="text-ink-faint mt-0.5">&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-[12px] font-semibold text-ink">{stage.stat}</div>
                </button>

                {/* Expanded detail */}
                {expandedStage === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 p-3 rounded bg-surface-sunken border border-border text-[11px] text-ink-secondary leading-relaxed"
                  >
                    {idx === 0 && 'Connects to 47 enterprise systems via read-only MCP connectors. Each connector authenticates via OAuth2 or service accounts with minimum-privilege access. Data is pulled on schedules ranging from real-time (GPS) to every 5 minutes (SAP).'}
                    {idx === 1 && 'Incoming data is cleaned, deduplicated, and normalized into a unified schema. 2.4 million records are maintained with full lineage tracking. Schema mapping handles differences between SAP, Primavera, Kronos, and other source formats.'}
                    {idx === 2 && 'The context engine builds role-specific views of the data. A Track Inspector sees defect history and FRA standards; a Project Manager sees budgets and schedules. Each context window has a token budget and freshness guarantee.'}
                    {idx === 3 && 'End users query AI tools naturally. The AI has exactly the right context for their role, location, and task — no hallucination from missing data, no irrelevant noise from data overload.'}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 3: Live Context Window Examples
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-1">Live Context Window Examples</h2>
        <p className="text-[12px] text-ink-tertiary mb-4">
          Different users get different context. Click to see what the AI sees when each role asks a question.
        </p>
        <div className="space-y-3">
          {contextExamples.map(ex => {
            const isOpen = expandedExample === ex.id;
            const tokenPct = Math.round((ex.tokensUsed / ex.tokenBudget) * 100);
            return (
              <div
                key={ex.id}
                className={`rounded-lg border transition-colors ${
                  isOpen ? 'border-blue/30 bg-surface-raised' : 'border-border bg-surface-raised/60 hover:bg-surface-raised'
                }`}
              >
                {/* Card header */}
                <button
                  onClick={() => setExpandedExample(isOpen ? null : ex.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-blue">{ex.user.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink">{ex.user} <span className="text-ink-tertiary font-normal">&middot; {ex.role}, {ex.division}</span></div>
                      <div className="text-[12px] text-ink-secondary truncate mt-0.5">
                        <Search className="w-3 h-3 inline-block mr-1 -mt-0.5 text-ink-faint" />
                        &ldquo;{ex.query}&rdquo;
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-ink-tertiary hidden sm:inline">{ex.quality} complete</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-ink-faint" /> : <ChevronDown className="w-4 h-4 text-ink-faint" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* Context tree */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" />
                        Context Window Contents
                      </div>
                      <div className="rounded-md bg-[#0d1117] border border-[#1e2936] p-4 overflow-x-auto">
                        <pre className="text-[11px] font-mono text-[#c9d1d9] leading-[1.65] whitespace-pre">{ex.contextTree}</pre>
                      </div>
                    </div>

                    {/* AI response */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2 flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5" />
                        AI Response
                      </div>
                      <div className="rounded-md bg-[#111827] border border-[#1e293b] p-4">
                        <p className="text-[12px] text-[#e2e8f0] leading-relaxed font-[system-ui]">{ex.aiResponse}</p>
                      </div>
                    </div>

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink-tertiary">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green" />
                        {ex.quality} complete
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        {ex.sources} sources
                      </span>
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Updated {ex.updated}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        {ex.tokensUsed.toLocaleString()} / {ex.tokenBudget.toLocaleString()} tokens ({tokenPct}%)
                      </span>
                    </div>

                    {/* Token budget bar */}
                    <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${tokenPct > 80 ? 'bg-amber' : 'bg-blue'}`}
                        style={{ width: `${tokenPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 4: Data Processing Pipeline (Live Log)
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">Data Processing Pipeline</h2>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[11px] font-medium text-green">Live</span>
          </div>
        </div>
        <div className="rounded-lg bg-[#0d1117] border border-[#1e2936] overflow-hidden">
          <div ref={logRef} className="p-4 h-[320px] overflow-y-auto font-mono text-[11px] leading-[1.8] space-y-0">
            {logEntries.map((entry, idx) => (
              <div key={`${entry.ts}-${idx}`} className="flex gap-2">
                <span className="text-[#6e7681] flex-shrink-0">[{entry.ts}]</span>
                <span className={`font-bold flex-shrink-0 w-[60px] text-right ${opColors[entry.op]}`}>{entry.op}</span>
                <span className="text-[#c9d1d9] ml-1">{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 5: Context Window Analytics
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-4">Context Window Analytics</h2>

        {/* Division table */}
        <div className="rounded-lg bg-surface-raised border border-border overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-surface-sunken/50">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Division</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Active Users</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Avg Freshness</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Completeness</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Queries/Day</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {divisionData.map((row, idx) => (
                  <tr key={row.name} className={`border-b border-border/50 ${idx % 2 === 0 ? '' : 'bg-surface-sunken/20'}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-ink">{row.name}</span>
                      <span className="text-ink-tertiary ml-1.5 hidden sm:inline">{row.fullName}</span>
                    </td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.activeUsers}</td>
                    <td className={`text-right px-4 py-2.5 font-medium ${freshnessColor(row.avgFreshness)}`}>{row.avgFreshness} min</td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.completeness}%</td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.queriesPerDay.toLocaleString()}</td>
                    <td className={`text-right px-4 py-2.5 font-medium ${successColor(row.successRate)}`}>{row.successRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Types horizontal bar chart */}
        <div className="rounded-lg bg-surface-raised border border-border p-4">
          <h3 className="text-[13px] font-semibold text-ink mb-4">Common Query Types</h3>
          <div className="space-y-3">
            {queryTypes.map(qt => (
              <div key={qt.label} className="flex items-center gap-3">
                <span className="text-[11px] text-ink-secondary w-[200px] flex-shrink-0 text-right">{qt.label}</span>
                <div className="flex-1 h-5 bg-surface-sunken rounded overflow-hidden">
                  <div className={`h-full rounded ${qt.color}`} style={{ width: `${qt.pct}%` }} />
                </div>
                <span className="text-[11px] font-medium text-ink w-[36px] text-right">{qt.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 6: Data Quality Alerts
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible" className="pb-8">
        <h2 className="text-[15px] font-semibold text-ink mb-4">Data Quality Alerts</h2>
        <div className="space-y-3">
          {dataAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${
                alert.severity === 'yellow'
                  ? 'border-amber/20 bg-amber/[0.04]'
                  : 'border-green/20 bg-green/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {alert.severity === 'yellow' ? (
                    <AlertTriangle className="w-4 h-4 text-amber" strokeWidth={1.7} />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green" strokeWidth={1.7} />
                  )}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="text-[13px] font-medium text-ink">{alert.title}</div>
                  <div className="text-[12px] text-ink-secondary">{alert.detail}</div>
                  <div className="text-[11px] text-ink-tertiary">
                    <span className="font-medium">Impact:</span> {alert.impact}
                  </div>
                  <div className="text-[11px] text-ink-tertiary">
                    <span className="font-medium">Action:</span> {alert.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
