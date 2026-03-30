import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  CheckCircle2,
  Shield,
  Clock,
  Database,
  Activity,
  Lock,
  Eye,
  FileText,
  Wifi,
  Cpu,
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

/* ── Live log message generators ─────────────────────────── */

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLiveLogEntry(): { ts: string; system: string; msg: string } {
  const now = new Date();
  const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  const templates = [
    { system: 'eCMS', msg: `Synced ${randomInt(200, 1200)} work orders (incremental)` },
    { system: 'Kronos', msg: `Synced ${randomInt(5, 40)} timesheet updates` },
    { system: 'HCSS Telematics', msg: `Real-time feed: ${randomInt(200, 400)} vehicle positions updated` },
    { system: 'FRA RISPC', msg: `Synced ${randomInt(1, 8)} new inspection records` },
    { system: 'Primavera P6', msg: `Synced ${randomInt(5, 30)} project schedule updates` },
    { system: 'PTC Signal', msg: `Synced ${randomInt(20, 150)} signal state changes` },
    { system: 'Azure AD', msg: Math.random() > 0.5 ? '0 changes detected (no sync needed)' : 'Synced 2 permission updates' },
  ];
  const pick = templates[Math.floor(Math.random() * templates.length)];
  return { ts, system: pick.system, msg: pick.msg };
}

/* ── Data ────────────────────────────────────────────────── */

const connectorConfig = `{
  "connector": "ecms",
  "version": "2.1.0",
  "auth": {
    "type": "oauth2",
    "grant": "client_credentials",
    "token_url": "https://ecms.industrialsco.com/oauth/token"
  },
  "endpoints": [
    "work_orders",
    "purchase_orders",
    "vendor_records",
    "cost_centers"
  ],
  "schedule": "*/5 * * * *",
  "read_only": true
}`;

const schemaFields = [
  { name: 'work_order_id', type: 'string', mapped: true, sample: 'WO-2024-14837' },
  { name: 'cost_center', type: 'string', mapped: true, sample: 'HCC-CONSTRUCTION-01' },
  { name: 'estimated_hours', type: 'number', mapped: true, sample: '240' },
  { name: 'actual_hours', type: 'number', mapped: true, sample: '312' },
  { name: 'status', type: 'enum', mapped: true, sample: 'in_progress' },
];

const initialCrawlLogEntries = [
  { ts: '2026-03-26 17:42:18', system: 'eCMS', msg: 'Synced 847 work orders (incremental)' },
  { ts: '2026-03-26 17:42:15', system: 'Kronos', msg: 'Synced 12 timesheet updates' },
  { ts: '2026-03-26 17:42:12', system: 'HCSS Telematics', msg: 'Real-time feed: 342 vehicle positions updated' },
  { ts: '2026-03-26 17:42:08', system: 'Azure AD', msg: '0 changes detected (no sync needed)' },
  { ts: '2026-03-26 17:37:18', system: 'eCMS', msg: 'Synced 923 work orders (incremental)' },
  { ts: '2026-03-26 17:37:14', system: 'FRA RISPC', msg: 'Synced 3 new inspection records' },
  { ts: '2026-03-26 17:37:11', system: 'Primavera P6', msg: 'Synced 14 project schedule updates' },
  { ts: '2026-03-26 17:37:08', system: 'PTC Signal', msg: 'Synced 89 signal state changes' },
  { ts: '2026-03-26 17:32:18', system: 'eCMS', msg: 'Synced 756 work orders (incremental)' },
  { ts: '2026-03-26 17:32:15', system: 'Kronos', msg: 'Synced 28 certification renewals' },
  { ts: '2026-03-26 17:32:12', system: 'HCSS Equipment360', msg: 'Synced 167 vehicle telemetry events' },
  { ts: '2026-03-26 17:32:08', system: 'eCMS', msg: 'Synced 42 purchase requisitions' },
  { ts: '2026-03-26 17:27:18', system: 'eCMS', msg: 'Synced 891 work orders (incremental)' },
  { ts: '2026-03-26 17:27:14', system: 'OSHA', msg: 'Synced 1 new compliance update' },
  { ts: '2026-03-26 17:27:11', system: 'GE SCADA', msg: 'Synced 2,341 sensor readings' },
  { ts: '2026-03-26 17:27:08', system: 'Primavera P6', msg: 'Synced 8 milestone updates' },
  { ts: '2026-03-26 17:22:18', system: 'eCMS', msg: 'Synced 812 work orders (incremental)' },
  { ts: '2026-03-26 17:22:15', system: 'Azure AD', msg: '2 role changes synced' },
  { ts: '2026-03-26 17:22:12', system: 'PTC Signal', msg: 'Synced 134 signal state changes' },
  { ts: '2026-03-26 17:22:08', system: 'HCSS Telematics', msg: 'Real-time feed: 298 vehicle positions updated' },
];

/* ── Uptime formatter ────────────────────────────────────── */

function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

const securityPoints = [
  'Read-only access \u2014 MCP never writes to source systems',
  'On-premise deployment \u2014 runs inside your firewall',
  'No data egress \u2014 AI processing happens locally',
  'Encrypted at rest (AES-256) and in transit (TLS 1.3)',
  'RBAC \u2014 each connector has minimum-privilege service account',
  'Full audit trail \u2014 every query logged with timestamp and purpose',
  'SOC 2 readiness checklist in progress',
  'Data retention: configurable, default 90 days rolling window',
];

interface ConnectorGroup {
  label: string;
  items: { name: string; connected: boolean }[];
}

const connectorGroups: ConnectorGroup[] = [
  {
    label: 'Enterprise Systems',
    items: [
      { name: 'eCMS', connected: true },
      { name: 'Primavera P6', connected: true },
      { name: 'Kronos/UKG', connected: true },
      { name: 'HCSS Telematics', connected: true },
    ],
  },
  {
    label: 'Project Management',
    items: [
      { name: 'Primavera P6', connected: true },
      { name: 'Microsoft Project', connected: false },
      { name: 'Procore', connected: false },
      { name: 'Bentley ProjectWise', connected: false },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { name: 'Kronos', connected: true },
      { name: 'ADP', connected: false },
      { name: 'Ceridian', connected: false },
      { name: 'UKG', connected: false },
    ],
  },
  {
    label: 'Fleet & Field',
    items: [
      { name: 'HCSS Telematics', connected: true },
      { name: 'HCSS Equipment360', connected: true },
      { name: 'Verizon Connect', connected: false },
      { name: 'Fleet Complete', connected: false },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { name: 'FRA RISPC', connected: true },
      { name: 'EPA ECHO', connected: false },
      { name: 'OSHA', connected: true },
      { name: 'DOT', connected: false },
    ],
  },
  {
    label: 'Identity',
    items: [
      { name: 'Azure AD', connected: true },
      { name: 'Okta', connected: false },
      { name: 'OneLogin', connected: false },
      { name: 'Ping', connected: false },
    ],
  },
  {
    label: 'Railroad-Specific',
    items: [
      { name: 'PTC Signal Systems', connected: true },
      { name: 'HYRAIL', connected: false },
      { name: 'AMOS MRO', connected: false },
      { name: 'GE SCADA', connected: true },
      { name: 'RailSight', connected: false },
    ],
  },
];

/* ── Step indicator ─────────────────────────────────────── */

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue text-white text-[11px] font-bold flex-shrink-0">
      {n}
    </span>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function MCPConfig() {
  const logRef = useRef<HTMLDivElement>(null);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [liveLogEntries, setLiveLogEntries] = useState(initialCrawlLogEntries);
  const [newestId, setNewestId] = useState<number | null>(null);

  // Base uptime: 14d 6h 23m = 1,234,980 seconds
  const [uptimeSeconds, setUptimeSeconds] = useState(14 * 86400 + 6 * 3600 + 23 * 60);

  // Tick uptime every second
  useEffect(() => {
    const id = setInterval(() => {
      setUptimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Animate initial log entries appearing one at a time
  useEffect(() => {
    if (visibleLogs < initialCrawlLogEntries.length) {
      const timer = setTimeout(() => {
        setVisibleLogs((v) => v + 1);
      }, visibleLogs === 0 ? 300 : 120);
      return () => clearTimeout(timer);
    }
  }, [visibleLogs]);

  // Add live log entries every 8-12 seconds (randomized)
  const scheduleNextEntry = useCallback(() => {
    const delay = randomInt(8000, 12000);
    return setTimeout(() => {
      const entry = generateLiveLogEntry();
      setLiveLogEntries((prev) => {
        const next = [entry, ...prev];
        return next.slice(0, 30); // keep max 30
      });
      setNewestId(Date.now());
    }, delay);
  }, []);

  useEffect(() => {
    // Only start live entries after initial animation completes
    if (visibleLogs < initialCrawlLogEntries.length) return;
    let timerId = scheduleNextEntry();
    const interval = setInterval(() => {
      clearTimeout(timerId);
      timerId = scheduleNextEntry();
    }, randomInt(8000, 12000));
    return () => {
      clearTimeout(timerId);
      clearInterval(interval);
    };
  }, [visibleLogs, scheduleNextEntry]);

  // Auto-scroll log to top when new entries appear
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [newestId]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 pb-16 space-y-8">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <PreliminaryBanner />
        <h1 className="text-xl font-semibold text-ink mt-3 tracking-[-0.02em]">MCP Server Configuration</h1>
        <p className="text-[13px] text-ink-secondary mt-1">
          Model Context Protocol &mdash; secure, read-only system integration
        </p>
      </motion.div>

      {/* ────────────── Section 1: Server Status ────────────── */}
      <motion.section custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-ink-secondary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">MCP Server Status</h2>
            <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-muted">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <span className="text-[11px] font-semibold text-green">Running</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Version', value: 'MCP v1.2.4', icon: Cpu },
              { label: 'Host', value: 'industrialsco-mcp.upskiller.internal', icon: Wifi },
              { label: 'Uptime', value: formatUptime(uptimeSeconds), icon: Clock },
              { label: 'Last Health Check', value: '30 seconds ago \u2713', icon: Activity },
              { label: 'Connections', value: '12 active / 47 configured', icon: Database },
              { label: 'Data Volume', value: '2.4M records indexed', icon: FileText },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <item.icon className="w-3.5 h-3.5 text-ink-tertiary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">{item.label}</div>
                  <div className="text-[13px] font-medium text-ink mt-0.5 tabular-nums">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ────────────── Section 2: Connection Setup Flow ────────────── */}
      <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
        <h2 className="text-[14px] font-semibold text-ink flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-ink-secondary" strokeWidth={1.7} />
          Connection Setup Flow
        </h2>

        {/* Step 1 */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={1} />
            <h3 className="text-[13px] font-semibold text-ink">Configure Connector</h3>
          </div>
          <div className="rounded-lg bg-slate-900 p-4 overflow-x-auto">
            <pre className="text-[12px] leading-relaxed font-mono text-green-400 whitespace-pre">{connectorConfig}</pre>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={2} />
            <h3 className="text-[13px] font-semibold text-ink">Schema Discovery</h3>
          </div>
          <p className="text-[12px] text-ink-secondary">
            MCP automatically discovers the data schema from each endpoint
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-surface-sunken text-ink-tertiary">
                  <th className="text-left px-3 py-2 font-medium">Field Name</th>
                  <th className="text-left px-3 py-2 font-medium">Type</th>
                  <th className="text-center px-3 py-2 font-medium">Mapped</th>
                  <th className="text-left px-3 py-2 font-medium">Sample Value</th>
                </tr>
              </thead>
              <tbody>
                {schemaFields.map((f) => (
                  <tr key={f.name} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-ink">{f.name}</td>
                    <td className="px-3 py-2 text-ink-secondary">{f.type}</td>
                    <td className="px-3 py-2 text-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green mx-auto" strokeWidth={2} />
                    </td>
                    <td className="px-3 py-2 font-mono text-ink-secondary">{f.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={3} />
            <h3 className="text-[13px] font-semibold text-ink">Data Sync</h3>
          </div>
          <p className="text-[12px] text-ink-secondary">
            First sync pulls historical data. Subsequent syncs are incremental.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-sunken p-3">
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Initial Sync</div>
              <div className="text-[15px] font-semibold text-ink mt-1">24,847 records</div>
              <div className="text-[11px] text-ink-secondary">in 4m 12s</div>
            </div>
            <div className="rounded-lg bg-surface-sunken p-3">
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Incremental</div>
              <div className="text-[15px] font-semibold text-ink mt-1">~200 records</div>
              <div className="text-[11px] text-ink-secondary">every 5 minutes</div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={4} />
            <h3 className="text-[13px] font-semibold text-ink">AI Context Window</h3>
          </div>
          <p className="text-[12px] text-ink-secondary">
            Synced data is normalized and indexed for AI model consumption.
            Each workflow gets a context window with only the data it needs.
          </p>
          <div className="rounded-lg bg-blue/5 border border-blue/10 p-3">
            <div className="text-[11px] font-medium text-blue mb-1">Example: Track Geometry AI</div>
            <div className="text-[12px] text-ink-secondary">
              Receives: inspection records, defect history, weather data, track classification
            </div>
          </div>
        </div>
      </motion.section>

      {/* ────────────── Section 3: Security Architecture ────────────── */}
      <motion.section custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
        <h2 className="text-[14px] font-semibold text-ink flex items-center gap-2">
          <Shield className="w-4 h-4 text-ink-secondary" strokeWidth={1.7} />
          Security Architecture
        </h2>

        {/* Architecture diagram */}
        <div className="rounded-xl bg-slate-900 p-6 font-mono text-[11px] leading-relaxed overflow-x-auto">
          <div className="border border-slate-600 rounded-lg p-4 min-w-[500px]">
            {/* VPN title */}
            <div className="text-slate-400 text-[10px] font-bold tracking-wider mb-4">INDUSTRIALSCO NETWORK (VPN)</div>

            <div className="flex gap-6 items-start">
              {/* Source systems */}
              <div className="space-y-1.5 flex-shrink-0">
                {['eCMS', 'Primavera', 'Kronos', 'PTC', 'AD'].map((sys) => (
                  <div key={sys} className="flex items-center gap-2">
                    <span className="text-slate-300 w-16 text-right">{sys}</span>
                    <span className="text-slate-500">&larr;</span>
                  </div>
                ))}
              </div>

              {/* MCP Server box */}
              <div className="border border-emerald-500/40 rounded-lg p-3 bg-emerald-500/5 flex-1 min-w-[220px]">
                <div className="text-emerald-400 font-bold text-[12px] mb-2">MCP Server (On-Premise)</div>
                <div className="space-y-1 text-slate-400 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-emerald-500/60" strokeWidth={1.5} />
                    Read-only access
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-500/60" strokeWidth={1.5} />
                    No data egress
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-emerald-500/60" strokeWidth={1.5} />
                    Audit logged
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-emerald-500/60" strokeWidth={1.5} />
                    Encrypted at rest
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow down to AI */}
            <div className="flex justify-center my-3">
              <div className="flex flex-col items-center text-slate-500">
                <span>|</span>
                <span>&darr;</span>
              </div>
            </div>

            {/* AI Processing */}
            <div className="flex justify-center">
              <div className="border border-blue-500/40 rounded-lg px-6 py-2.5 bg-blue-500/5">
                <span className="text-blue-400 font-bold text-[12px]">AI Process Cluster</span>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-4 flex items-center gap-1.5 text-amber-400 text-[10px]">
              <span className="text-amber-400">&#9733;</span>
              All processing stays within your network
            </div>
          </div>
        </div>

        {/* Security checklist */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {securityPoints.map((point) => (
              <div key={point} className="flex items-start gap-2 text-[12px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-green mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="text-ink-secondary">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ────────────── Section 4: Active Crawl Log ────────────── */}
      <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ink-secondary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Active Crawl Log</h2>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[11px] text-ink-tertiary">Live</span>
          </span>
        </div>

        <div
          ref={logRef}
          className="rounded-xl bg-slate-900 p-4 h-[320px] overflow-y-auto font-mono text-[11px] leading-[1.8] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {/* Live entries (newest first at top) */}
          {visibleLogs >= initialCrawlLogEntries.length &&
            liveLogEntries.slice(0, liveLogEntries.length - initialCrawlLogEntries.length).map((entry, idx) => (
              <motion.div
                key={`live-${entry.ts}-${idx}`}
                initial={{ opacity: 0, x: -8, backgroundColor: 'rgba(34,197,94,0.15)' }}
                animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(34,197,94,0)' }}
                transition={{ opacity: { duration: 0.3 }, x: { duration: 0.3 }, backgroundColor: { duration: 2 } }}
                className="text-green-400 whitespace-nowrap rounded px-1 -mx-1"
              >
                <span className="text-slate-500">[{entry.ts}]</span>{' '}
                <span className="text-emerald-300">{entry.system}</span>{' '}
                <span className="text-slate-500">&mdash;</span>{' '}
                <span className="text-green-400/80">{entry.msg}</span>
              </motion.div>
            ))}
          {/* Initial static entries */}
          {initialCrawlLogEntries.slice(0, visibleLogs).map((entry, idx) => (
            <motion.div
              key={`init-${idx}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="text-green-400 whitespace-nowrap"
            >
              <span className="text-slate-500">[{entry.ts}]</span>{' '}
              <span className="text-emerald-300">{entry.system}</span>{' '}
              <span className="text-slate-500">&mdash;</span>{' '}
              <span className="text-green-400/80">{entry.msg}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ────────────── Section 5: Connector Library ────────────── */}
      <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
        <h2 className="text-[14px] font-semibold text-ink flex items-center gap-2">
          <Database className="w-4 h-4 text-ink-secondary" strokeWidth={1.7} />
          Connector Library
        </h2>

        <div className="rounded-xl border border-border bg-surface p-5 space-y-5">
          {connectorGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item.name}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      item.connected
                        ? 'bg-green-muted border-green/20 text-green'
                        : 'bg-surface-sunken border-border text-ink-tertiary'
                    }`}
                  >
                    {item.connected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green" />
                    )}
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-border flex items-center gap-2 text-[11px] text-ink-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            <span>12 connected</span>
            <span className="text-ink-faint">/</span>
            <span>47 available</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
