import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plug,
  Database,
  Brain,
  ShieldCheck,
  Users,
  Activity,
  Cpu,
  Lock,
  Zap,
  Clock,
  BarChart3,
  Server,
  Cloud,
  Eye,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { COMMAND_CENTER_URL } from '../data/crosslinks';
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

/* ── Pipeline Stages ─────────────────────────────────────── */

interface PipelineStage {
  id: string;
  label: string;
  sublabel: string;
  details: string[];
  stats: [string, string];
  icon: React.ElementType;
  route: string | null;
  tooltip?: string;
  active?: boolean;
}

/* ── Division-specific connected systems ─────────────────── */

interface DivisionInfra {
  connectedSystems: string;
  systemsList: string[];
  records: string;
  activeWorkflows: string;
  trustScore: string;
  adoption: string;
}

const divisionInfra: Record<string, DivisionInfra> = {
  meridian: { connectedSystems: '12 / 47', systemsList: ['MCP', 'eCMS', 'Primavera P6', 'HCSS Telematics', 'RailSentry LIDAR', 'PTC Signal System'], records: '2.4M records', activeWorkflows: '62 active', trustScore: '94.2% trust', adoption: '38% adopted' },
  hcc: { connectedSystems: '8 / 24', systemsList: ['Primavera P6', 'HCSS Telematics', 'eCMS', 'HCSS HeavyJob', 'AutoCAD', 'B2W Estimate'], records: '890K records', activeWorkflows: '20 active', trustScore: '96.8% trust', adoption: '42% adopted' },
  hrsi: { connectedSystems: '5 / 14', systemsList: ['MCP', 'GPS Ballast Telemetry', 'CMMS', 'Equipment Tracker', 'Dispatch System'], records: '340K records', activeWorkflows: '9 active', trustScore: '93.1% trust', adoption: '31% adopted' },
  hsi: { connectedSystems: '6 / 16', systemsList: ['TAM-4 Ultrasonic', 'LIDAR', 'GPS Fleet', 'RailSentry', 'Video Track Chart', 'FRA Compliance DB'], records: '420K records', activeWorkflows: '6 active', trustScore: '94.2% trust', adoption: '35% adopted' },
  hti: { connectedSystems: '7 / 18', systemsList: ['PTC Signal System', 'Wayside Telemetry', 'CAD Signal Design', 'Fiber Optic OTDR', 'Radio System', 'SCADA'], records: '560K records', activeWorkflows: '11 active', trustScore: '97.4% trust', adoption: '44% adopted' },
  htsi: { connectedSystems: '6 / 15', systemsList: ['Trapeze OPS', 'MCP', 'Vehicle Tracking', 'Ridership Analytics', 'Fare Collection', 'Maintenance DB'], records: '310K records', activeWorkflows: '9 active', trustScore: '91.8% trust', adoption: '36% adopted' },
  he: { connectedSystems: '4 / 10', systemsList: ['SCADA', 'Solar Monitoring', 'CMMS', 'Weather API'], records: '120K records', activeWorkflows: '4 active', trustScore: '95.6% trust', adoption: '28% adopted' },
  gg: { connectedSystems: '3 / 8', systemsList: ['EPA Compliance DB', 'Lab Information Mgmt', 'Wetland Monitoring'], records: '85K records', activeWorkflows: '3 active', trustScore: '98.1% trust', adoption: '52% adopted' },
};

const stagesDefault: PipelineStage[] = [
  {
    id: 'connect',
    label: 'CONNECT',
    sublabel: 'MCP Server',
    details: ['Connectors', 'Schema Map', 'Auth Layer'],
    stats: ['12 / 47', 'systems'],
    icon: Plug,
    route: '/connectors',
    active: true,
  },
  {
    id: 'ingest',
    label: 'INGEST',
    sublabel: 'Data Lake',
    details: ['Schema Map', 'Transform', 'Normalize'],
    stats: ['2.4M records', 'normalized'],
    icon: Database,
    route: null,
    tooltip: 'Data pipeline — coming soon',
  },
  {
    id: 'analyze',
    label: 'ANALYZE',
    sublabel: 'AI Models',
    details: ['Context', 'Windows', 'Inference'],
    stats: ['62 active', 'workflows'],
    icon: Brain,
    route: '/operations',
  },
  {
    id: 'verify',
    label: 'VERIFY',
    sublabel: 'Reliability',
    details: ['Testing', 'Human Loop', 'Audit'],
    stats: ['94.2% trust', 'score'],
    icon: ShieldCheck,
    route: '/reliability',
  },
  {
    id: 'deploy',
    label: 'DEPLOY',
    sublabel: 'User Tools',
    details: ['Adoption', 'Monitoring', 'Feedback'],
    stats: ['38% adopted', 'org-wide'],
    icon: Users,
    route: '/adoption',
  },
];

function buildStages(infra: DivisionInfra): PipelineStage[] {
  return stagesDefault.map((s) => {
    if (s.id === 'connect') return { ...s, stats: [infra.connectedSystems, 'systems'] as [string, string] };
    if (s.id === 'ingest') return { ...s, stats: [infra.records, 'normalized'] as [string, string] };
    if (s.id === 'analyze') return { ...s, stats: [infra.activeWorkflows, 'workflows'] as [string, string] };
    if (s.id === 'verify') return { ...s, stats: [infra.trustScore, 'score'] as [string, string] };
    if (s.id === 'deploy') return { ...s, stats: [infra.adoption, 'org-wide'] as [string, string] };
    return s;
  });
}

/* ── Platform Metrics ────────────────────────────────────── */

interface Metric {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ElementType;
  sparkline?: number[];
}

/* metrics are now generated dynamically inside the component */

/* ── Tech Stack ──────────────────────────────────────────── */

interface TechItem {
  name: string;
  desc: string;
}

const techStack: { category: string; icon: React.ElementType; color: string; items: TechItem[] }[] = [
  {
    category: 'AI Layer',
    icon: Brain,
    color: 'text-purple-500',
    items: [
      { name: 'Claude API (Anthropic)', desc: 'Reasoning, analysis & recommendations' },
      { name: 'MCP', desc: 'Model Context Protocol for system integration' },
      { name: 'PostgreSQL pgvector', desc: 'Vector search for context retrieval' },
    ],
  },
  {
    category: 'Infrastructure',
    icon: Server,
    color: 'text-blue',
    items: [
      { name: 'PostgreSQL (Supabase)', desc: 'Primary database & metrics storage' },
      { name: 'Node.js + cron', desc: 'Agent runtime scheduling' },
      { name: 'Railway', desc: 'Agent runtime hosting' },
      { name: 'Vercel', desc: 'Dashboard hosting' },
      { name: 'In-memory cache', desc: 'Node.js process-level caching' },
    ],
  },
  {
    category: 'Security & Compliance',
    icon: Lock,
    color: 'text-green',
    items: [
      { name: 'SOC 2 readiness checklist', desc: 'In progress' },
      { name: 'FRA Part 213', desc: 'Compliance validated' },
      { name: 'AES-256', desc: 'End-to-end encryption' },
      { name: 'RBAC', desc: 'Role-based access control' },
      { name: 'Audit logging', desc: 'All AI decisions tracked' },
    ],
  },
];

/* ── Sparkline Component ─────────────────────────────────── */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = color === 'text-blue' ? '#2563EB' : '#16A34A';
  return (
    <svg width={w} height={h} className="ml-2 flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Animated Counter ────────────────────────────────────── */

function AnimatedValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Subtle increment animation for "AI Queries" value
    if (!value.includes(',')) {
      setDisplay(value);
      return;
    }
    const num = parseInt(value.replace(/,/g, ''), 10);
    let current = num - 12;
    const timer = setInterval(() => {
      current += 1;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      setDisplay(current.toLocaleString());
    }, 120);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}</span>;
}

/* ── Pipeline Stage Card ─────────────────────────────────── */

function StageCard({ stage, index }: { stage: PipelineStage; index: number }) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = stage.icon;
  const isClickable = stage.route !== null;

  const handleClick = () => {
    if (stage.route) {
      navigate(stage.route);
    }
  };

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <div
        onClick={isClickable ? handleClick : undefined}
        onMouseEnter={() => !isClickable && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative flex flex-col rounded-lg border p-4 min-w-[180px] transition-all duration-200
          ${stage.active
            ? 'border-blue/40 bg-blue-muted shadow-[0_0_20px_rgba(37,99,235,0.08)] ring-1 ring-blue/20'
            : 'border-border bg-surface-raised hover:border-border hover:shadow-sm'
          }
          ${isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : 'cursor-default'}
        `}
      >
        {/* Active glow pulse */}
        {stage.active && (
          <div className="absolute inset-0 rounded-lg border border-blue/20 animate-pulse-live pointer-events-none" />
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
            stage.active ? 'bg-blue/10' : 'bg-surface-sunken'
          }`}>
            <Icon className={`w-3.5 h-3.5 ${stage.active ? 'text-blue' : 'text-ink-tertiary'}`} strokeWidth={1.8} />
          </div>
          <div>
            <div className={`text-[11px] font-bold tracking-[0.08em] font-mono ${
              stage.active ? 'text-blue' : 'text-ink-secondary'
            }`}>
              {stage.label}
            </div>
            <div className="text-[10px] text-ink-tertiary">{stage.sublabel}</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 mb-3">
          {stage.details.map((d) => (
            <div key={d} className="text-[11px] text-ink-tertiary flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-ink-faint flex-shrink-0" />
              {d}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-auto pt-2 border-t border-border-subtle">
          <div className="text-[13px] font-semibold font-mono text-ink">{stage.stats[0]}</div>
          <div className="text-[10px] text-ink-tertiary">{stage.stats[1]}</div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && stage.tooltip && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-md bg-nav-bg text-white text-[11px] font-medium whitespace-nowrap shadow-lg">
          {stage.tooltip}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-nav-bg rotate-45" />
        </div>
      )}
    </motion.div>
  );
}

/* ── Arrow Connector ─────────────────────────────────────── */

function ArrowConnector() {
  return (
    <div className="flex items-center justify-center self-center min-w-[32px] py-6">
      <div className="relative w-8 h-[2px] bg-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue/60 to-transparent animate-flow" />
      </div>
      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-blue/40" />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Infrastructure() {
  const { company } = useCompany();
  const infra = divisionInfra[company.id] || divisionInfra.meridian;
  const stages = buildStages(infra);

  // Live metric state
  const [aiQueries, setAiQueries] = useState(1247);
  const [throughput, setThroughput] = useState(847);
  const [activeSessions, setActiveSessions] = useState(127);
  const [queueDepth, setQueueDepth] = useState(3);

  // AI Queries: +1-3 every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setAiQueries((v) => v + randomInt(1, 3));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Data Throughput: fluctuate ±50 every 10 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setThroughput((v) => Math.max(600, v + randomInt(-50, 50)));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Active Sessions: fluctuate ±1-3 every 15 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSessions((v) => Math.max(100, v + randomInt(-3, 3)));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  // Queue Depth: random 1-5 every 30 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setQueueDepth(randomInt(1, 5));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Build live metrics array
  const liveMetrics: Metric[] = [
    { label: 'Data Throughput', value: throughput.toLocaleString(), unit: 'records/min', color: 'text-blue', icon: Activity, sparkline: [4, 6, 5, 8, 7, 9, 6, 8, 10, 7, 9, 11, 8, 10, 9] },
    { label: 'AI Queries', value: aiQueries.toLocaleString(), unit: 'today', color: 'text-green', icon: Brain },
    { label: 'Avg Response Time', value: '340', unit: 'ms', color: 'text-green', icon: Clock },
    { label: 'Uptime', value: '99.97', unit: '% (30d)', color: 'text-green', icon: Zap },
    { label: 'Active Sessions', value: activeSessions.toLocaleString(), unit: 'users now', color: 'text-blue', icon: Users },
    { label: 'Queue Depth', value: String(queueDepth), unit: 'pending review', color: 'text-amber', icon: Eye },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <PreliminaryBanner />
        <h1 className="text-2xl font-semibold tracking-tight text-ink mt-3">AI Infrastructure</h1>
        <p className="text-[14px] text-ink-secondary mt-1">
          End-to-end platform architecture for enterprise AI deployment
        </p>
      </motion.div>

      {/* ── Section 1: Platform Architecture Diagram ────── */}
      <motion.section variants={fadeUp} custom={1} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-ink-tertiary" strokeWidth={1.8} />
          <h2 className="text-[15px] font-semibold text-ink">Platform Architecture</h2>
        </div>

        {/* Pipeline Diagram */}
        <div className="rounded-xl border border-border bg-surface-raised p-6 overflow-x-auto">
          <div className="flex items-stretch gap-0 min-w-[900px]">
            {stages.map((stage, i) => (
              <div key={stage.id} className="contents">
                <StageCard stage={stage} index={i} />
                {i < stages.length - 1 && <ArrowConnector />}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse-live" />
              <span className="text-[10px] text-ink-tertiary">Active stage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-[2px] bg-border relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue/60 to-transparent animate-flow" />
              </span>
              <span className="text-[10px] text-ink-tertiary">Data flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-ink-faint font-medium">Click a stage to drill in</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Section 2: Real-Time Platform Metrics ────────── */}
      <motion.section variants={fadeUp} custom={2} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.8} />
          <h2 className="text-[15px] font-semibold text-ink">Real-Time Platform Metrics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {liveMetrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-lg border border-border bg-surface-raised p-3"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3 h-3 text-ink-faint" strokeWidth={1.8} />
                  <span className="text-[10px] text-ink-tertiary font-medium">{m.label}</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className={`text-xl font-bold font-mono tracking-tight ${m.color}`}>
                    <AnimatedValue value={m.value} />
                  </span>
                  <span className="text-[10px] text-ink-tertiary mb-0.5">{m.unit}</span>
                </div>
                {m.sparkline && <Sparkline data={m.sparkline} color={m.color} />}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Section 3: Technology Stack ──────────────────── */}
      <motion.section variants={fadeUp} custom={3} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-ink-tertiary" strokeWidth={1.8} />
          <h2 className="text-[15px] font-semibold text-ink">Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techStack.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                custom={catIdx + 6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-lg border border-border bg-surface-raised p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CatIcon className={`w-4 h-4 ${cat.color}`} strokeWidth={1.8} />
                  <h3 className="text-[13px] font-semibold text-ink">{cat.category}</h3>
                </div>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-ink-faint mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-[12px] font-medium font-mono text-ink">{item.name}</span>
                        <span className="text-[11px] text-ink-tertiary ml-1.5">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Section 4: Deployment Architecture ───────────── */}
      <motion.section variants={fadeUp} custom={4} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="w-4 h-4 text-ink-tertiary" strokeWidth={1.8} />
          <h2 className="text-[15px] font-semibold text-ink">Deployment Architecture</h2>
        </div>

        <div className="rounded-xl bg-[#0F172A] border border-slate-700/50 p-6 font-mono text-[12px] overflow-x-auto">
          {/* VPN/VPC Container */}
          <div className="border border-slate-600/50 rounded-lg p-5 min-w-[600px]">
            <div className="text-slate-400 text-[11px] font-bold tracking-[0.1em] mb-4 flex items-center gap-2">
              <Lock className="w-3 h-3" strokeWidth={2} />
              INDUSTRIALSCO VPN / VPC
            </div>

            {/* Top row: MCP Gateway + AI Cluster */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 border border-slate-600/40 rounded-md p-3 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Plug className="w-3 h-3 text-blue" strokeWidth={2} />
                  <span className="text-slate-300 font-semibold text-[11px]">MCP Gateway</span>
                </div>
                <div className="text-slate-500 text-[10px] space-y-0.5">
                  <div>Protocol handlers</div>
                  <div>Auth middleware</div>
                  <div>Rate limiting</div>
                </div>
              </div>

              {/* Arrow between boxes */}
              <div className="flex items-center">
                <div className="w-6 h-[1px] bg-slate-600" />
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-blue/50" />
              </div>

              <div className="flex-1 border border-slate-600/40 rounded-md p-3 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-3 h-3 text-purple-400" strokeWidth={2} />
                  <span className="text-slate-300 font-semibold text-[11px]">AI Processing (Node.js + Claude API)</span>
                </div>
                <div className="text-slate-500 text-[10px] space-y-0.5">
                  <div>Agent runtime (cron)</div>
                  <div>Claude API calls</div>
                  <div>pgvector context retrieval</div>
                </div>
              </div>
            </div>

            {/* Down arrows */}
            <div className="flex justify-around mb-2">
              <div className="flex flex-col items-center">
                <div className="w-[1px] h-4 bg-slate-600" />
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-500" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[1px] h-4 bg-slate-600" />
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-500" />
              </div>
            </div>

            {/* Data Lake */}
            <div className="border border-slate-600/40 rounded-md p-3 bg-slate-800/50 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-3 h-3 text-amber" strokeWidth={2} />
                <span className="text-slate-300 font-semibold text-[11px]">Data Layer (PostgreSQL / Supabase)</span>
              </div>
              <div className="flex gap-4 text-slate-500 text-[10px]">
                <span>Structured data store</span>
                <span className="text-slate-700">|</span>
                <span>pgvector embeddings</span>
                <span className="text-slate-700">|</span>
                <span>Encrypted at rest</span>
              </div>
            </div>

            {/* Monitoring */}
            <div className="border border-slate-600/40 rounded-md p-3 bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-green" strokeWidth={2} />
                <span className="text-slate-300 font-semibold text-[11px]">Monitoring & Observability</span>
              </div>
              <div className="flex gap-4 text-slate-500 text-[10px]">
                <span>Grafana dashboards</span>
                <span className="text-slate-700">|</span>
                <span>Prometheus metrics</span>
                <span className="text-slate-700">|</span>
                <span>OpenTelemetry traces</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Cross-link to Command Center Tech Stack ────────────── */}
      <a
        href={`${COMMAND_CENTER_URL}/tech-stack?company=${company.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-ink-tertiary hover:text-blue-400 transition-colors"
      >
        View Tech Stack mapping
        <ExternalLink className="w-3 h-3" strokeWidth={2} />
      </a>
    </div>
  );
}
