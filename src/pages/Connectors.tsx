import { useState, useEffect, useRef } from 'react';
import {
  Plug,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Database,
  Layers,
  Brain,
  FileCheck,
  Server,
  ExternalLink,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';
import { useCompany } from '../data/CompanyContext';
import { COMMAND_CENTER_URL } from '../data/crosslinks';

/* ── Types ───────────────────────────────────────────────── */

type ConnectionStatus = 'connected' | 'syncing' | 'pending';

interface Connection {
  name: string;
  division?: string;
  status: ConnectionStatus;
  lastSync: string;
  lastSyncMinutes?: number; // initial offset in minutes for live ticking
  records: string;
  schema: number;
  auth: string;
  dataFlowing: string;
  note?: string;
}

interface PendingSystem {
  name: string;
  division: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedSetup: string;
}

/* ── Data ────────────────────────────────────────────────── */

const connections: Connection[] = [
  {
    name: 'SAP ERP (S/4HANA)',
    status: 'connected',
    lastSync: '3 min ago',
    lastSyncMinutes: 3,
    records: '24,847 work orders',
    schema: 94,
    auth: 'OAuth 2.0 / Service Account',
    dataFlowing: 'Project costs, PO data, vendor records',
  },
  {
    name: 'Primavera P6',
    status: 'connected',
    lastSync: '7 min ago',
    lastSyncMinutes: 7,
    records: '1,247 active projects',
    schema: 87,
    auth: 'API Key + SSL cert',
    dataFlowing: 'Project schedules, resource allocation, critical paths',
  },
  {
    name: 'Trimble Fleet GPS',
    status: 'connected',
    lastSync: 'Real-time',
    records: '342 active vehicles',
    schema: 92,
    auth: 'API Key',
    dataFlowing: 'Vehicle locations, fuel consumption, idle time',
  },
  {
    name: 'Kronos Workforce',
    status: 'connected',
    lastSync: '12 min ago',
    lastSyncMinutes: 12,
    records: '2,800 employees',
    schema: 81,
    auth: 'OAuth 2.0',
    dataFlowing: 'Timesheets, certifications, crew assignments',
  },
  {
    name: 'PTC Signal Systems',
    division: 'HTI division',
    status: 'syncing',
    lastSync: '22 min ago',
    lastSyncMinutes: 22,
    records: '4,200 track-miles of signal data',
    schema: 73,
    auth: 'VPN + Certificate',
    dataFlowing: 'Signal states, wayside device health, PTC compliance',
  },
  {
    name: 'FRA RISPC Database',
    status: 'connected',
    lastSync: '1 hour ago',
    lastSyncMinutes: 60,
    records: '12,400 inspection records',
    schema: 96,
    auth: 'FRA API credentials',
    dataFlowing: 'Track geometry, defect reports, compliance status',
  },
  {
    name: 'Custom Dispatch System',
    status: 'connected',
    lastSync: '12 min ago',
    lastSyncMinutes: 12,
    records: '8,400 dispatch records',
    schema: 92,
    auth: 'OAuth 2.0 (via Kronos/UKG API)',
    dataFlowing: 'Crew schedules, shift assignments, HOS compliance data',
    note: 'Integrated via Kronos/UKG API (shared data source with crew-management connector)',
  },
  {
    name: 'Active Directory / Azure AD',
    status: 'connected',
    lastSync: '5 min ago',
    lastSyncMinutes: 5,
    records: '2,800 user accounts',
    schema: 100,
    auth: 'Azure AD Graph API',
    dataFlowing: 'User roles, department mapping, license assignments',
  },
];

const pendingSystems: PendingSystem[] = [
  { name: 'HYRAIL Inspection System', division: 'HSI', priority: 'High', estimatedSetup: '2 days' },
  { name: 'AMOS MRO', division: 'HRSI', priority: 'High', estimatedSetup: '3 days' },
  { name: 'Bentley ProjectWise', division: 'HCC', priority: 'Medium', estimatedSetup: '1 day' },
  { name: 'GE SCADA', division: 'Herzog Energy', priority: 'Medium', estimatedSetup: '2 days' },
  { name: 'RailSight Analytics', division: 'HTSI', priority: 'Medium', estimatedSetup: '1 day' },
  { name: 'Wabtec Trip Optimizer', division: 'HTSI', priority: 'Medium', estimatedSetup: '2 days' },
  { name: 'Hexagon Geospatial', division: 'HCC', priority: 'Low', estimatedSetup: '3 days' },
  { name: 'Oracle Fusion HR', division: 'Corporate', priority: 'High', estimatedSetup: '4 days' },
  { name: 'Maximo Asset Mgmt', division: 'HSI', priority: 'High', estimatedSetup: '3 days' },
  { name: 'Power BI Reporting', division: 'Corporate', priority: 'Low', estimatedSetup: '1 day' },
];

/* ── Helpers ──────────────────────────────────────────────── */

const statusConfig: Record<ConnectionStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  connected: {
    label: 'Connected',
    dotClass: 'bg-[#22C55E] animate-pulse-live',
    bgClass: 'bg-green-muted',
    textClass: 'text-green',
  },
  syncing: {
    label: 'Syncing',
    dotClass: 'bg-[#F59E0B] animate-pulse-live',
    bgClass: 'bg-amber-muted',
    textClass: 'text-amber',
  },
  pending: {
    label: 'Pending Setup',
    dotClass: 'bg-[#6B7280]',
    bgClass: 'bg-surface-sunken',
    textClass: 'text-ink-tertiary',
  },
};

const priorityStyle: Record<string, string> = {
  High: 'bg-red-muted text-red',
  Medium: 'bg-amber-muted text-amber',
  Low: 'bg-surface-sunken text-ink-tertiary',
};

/* ── Sub-components ──────────────────────────────────────── */

function StatusOverviewCard({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-surface-raised rounded-xl border border-border p-5 flex items-center gap-4 min-w-0">
      {children}
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">{label}</p>
        <p className="text-[20px] font-semibold text-ink tracking-tight leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[12px] text-ink-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function CircularProgress({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="52" height="52" className="flex-shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 26 26)"
        className="transition-all duration-700"
      />
      <text x="26" y="30" textAnchor="middle" className="fill-ink text-[11px] font-semibold">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function formatSyncAge(minutes: number): string {
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${hours}h ${mins}m ago`;
}

function ConnectionCard({ conn, tickOffset }: { conn: Connection; tickOffset: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[conn.status];
  const displaySync = conn.lastSyncMinutes != null
    ? formatSyncAge(conn.lastSyncMinutes + tickOffset)
    : conn.lastSync;
  return (
    <div
      className="bg-surface-raised rounded-xl border border-border hover:border-blue/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-ink leading-tight">{conn.name}</h3>
            {conn.division && (
              <span className="text-[11px] text-ink-tertiary">{conn.division}</span>
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full flex-shrink-0 ${cfg.bgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
            <span className={`text-[11px] font-medium ${cfg.textClass}`}>{cfg.label}</span>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
          <div>
            <span className="text-ink-tertiary">Last sync</span>
            <p className="text-ink font-medium tabular-nums">{displaySync}</p>
          </div>
          <div>
            <span className="text-ink-tertiary">Records</span>
            <p className="text-ink font-medium">{conn.records}</p>
          </div>
          <div>
            <span className="text-ink-tertiary">Schema</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue transition-all duration-500"
                  style={{ width: `${conn.schema}%` }}
                />
              </div>
              <span className="text-ink font-medium text-[11px]">{conn.schema}%</span>
            </div>
          </div>
          <div>
            <span className="text-ink-tertiary">Auth</span>
            <p className="text-ink font-medium">{conn.auth}</p>
          </div>
        </div>

        {/* Note for pending */}
        {conn.note && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-amber-muted border border-amber/20">
            <p className="text-[11px] text-amber font-medium">{conn.note}</p>
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && conn.dataFlowing && (
        <div className="px-5 pb-4 pt-0 border-t border-border-subtle">
          <p className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider mt-3 mb-1">Data Flowing</p>
          <p className="text-[12px] text-ink-secondary leading-relaxed">{conn.dataFlowing}</p>
        </div>
      )}

      {/* Expand indicator */}
      {conn.dataFlowing && (
        <div className="flex justify-center pb-2">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-ink-faint" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-ink-faint" />
          )}
        </div>
      )}
    </div>
  );
}

function PipelineStage({
  icon: Icon,
  label,
  stat,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  stat: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center text-center min-w-[120px]">
      <div className="w-12 h-12 rounded-xl bg-blue-muted border border-blue/20 flex items-center justify-center mb-2">
        <Icon className="w-5 h-5 text-blue" strokeWidth={1.7} />
      </div>
      <p className="text-[13px] font-semibold text-ink">{label}</p>
      <p className="text-[12px] font-medium text-blue mt-0.5">{stat}</p>
      <p className="text-[11px] text-ink-tertiary">{sub}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function Connectors() {
  const { company } = useCompany();
  const [tickOffset, setTickOffset] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setTickOffset((t) => t + 1);
    }, 60000); // tick every minute
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const headerSyncMinutes = 4 + tickOffset; // "Last sync 4m ago" ticks forward

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <h1 className="text-[22px] font-bold text-ink tracking-tight mt-3">System Connectors</h1>
        <p className="text-[14px] text-ink-secondary mt-1">
          MCP-powered integrations pulling live data from Herzog infrastructure
        </p>
      </div>

      {/* Section 1: Connection Status Overview */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusOverviewCard label="Connected Systems" value="12 / 47" sub="25% onboarded">
            <CircularProgress value={12} max={47} />
          </StatusOverviewCard>

          <StatusOverviewCard label="Data Freshness" value={`Last sync ${headerSyncMinutes}m ago`}>
            <div className="w-10 h-10 rounded-lg bg-green-muted flex items-center justify-center flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse-live" />
            </div>
          </StatusOverviewCard>

          <StatusOverviewCard label="Schema Coverage" value="78%" sub="of fields mapped">
            <div className="w-10 h-10 rounded-lg bg-blue-muted flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5 text-blue" strokeWidth={1.7} />
            </div>
          </StatusOverviewCard>

          <StatusOverviewCard label="Auth Status" value="All tokens valid">
            <div className="w-10 h-10 rounded-lg bg-green-muted flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green" strokeWidth={1.7} />
            </div>
          </StatusOverviewCard>
        </div>
      </section>

      {/* Section 2: Active Connections Grid */}
      <section>
        <h2 className="text-[16px] font-semibold text-ink tracking-tight mb-4">Active Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <ConnectionCard key={conn.name} conn={conn} tickOffset={tickOffset} />
          ))}
        </div>
      </section>

      {/* Section 3: Data Pipeline Visualization */}
      <section>
        <h2 className="text-[16px] font-semibold text-ink tracking-tight mb-4">Data Pipeline</h2>
        <div className="bg-surface-raised rounded-xl border border-border p-6 overflow-x-auto">
          <div className="flex items-center justify-between gap-3 min-w-[700px]">
            <PipelineStage icon={Server} label="Source Systems" stat="12 / 47" sub="connected" />
            <ArrowRight className="w-5 h-5 text-ink-faint flex-shrink-0" />
            <PipelineStage icon={Plug} label="MCP Connectors" stat="Schema Mapping" sub="+ Transform" />
            <ArrowRight className="w-5 h-5 text-ink-faint flex-shrink-0" />
            <PipelineStage icon={Database} label="Data Lake" stat="Normalized" sub="+ Indexed" />
            <ArrowRight className="w-5 h-5 text-ink-faint flex-shrink-0" />
            <PipelineStage icon={Brain} label="AI Context Windows" stat="Per-workflow" sub="context" />
            <ArrowRight className="w-5 h-5 text-ink-faint flex-shrink-0" />
            <PipelineStage icon={FileCheck} label="Verified Outputs" stat="Reliability" sub="tested" />
          </div>
        </div>
      </section>

      {/* Section 4: Pending Connections */}
      <section>
        <h2 className="text-[16px] font-semibold text-ink tracking-tight mb-4">
          Pending Connections
          <span className="text-[13px] font-normal text-ink-tertiary ml-2">35 systems remaining</span>
        </h2>
        <div className="bg-surface-raised rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-sunken/50">
                  <th className="px-5 py-3 font-medium text-ink-tertiary text-[11px] uppercase tracking-wider">System Name</th>
                  <th className="px-5 py-3 font-medium text-ink-tertiary text-[11px] uppercase tracking-wider">Division</th>
                  <th className="px-5 py-3 font-medium text-ink-tertiary text-[11px] uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 font-medium text-ink-tertiary text-[11px] uppercase tracking-wider">Est. Setup</th>
                </tr>
              </thead>
              <tbody>
                {pendingSystems.map((sys, i) => (
                  <tr
                    key={sys.name}
                    className={`border-b border-border-subtle last:border-0 hover:bg-surface-sunken/30 transition-colors ${
                      i % 2 === 0 ? '' : 'bg-surface-sunken/20'
                    }`}
                  >
                    <td className="px-5 py-3 font-medium text-ink">{sys.name}</td>
                    <td className="px-5 py-3 text-ink-secondary">{sys.division}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${priorityStyle[sys.priority]}`}>
                        {sys.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-secondary">{sys.estimatedSetup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
