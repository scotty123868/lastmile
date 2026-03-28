import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Database,
  Plug,
  Activity,
  Clock,
} from 'lucide-react';
import { useCompany, companies } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Types ───────────────────────────────────────────────── */

interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'syncing' | 'error';
  lastSync: string;
  recordsSynced: number;
}

interface CompanyIntegrationData {
  integrations: Integration[];
  totalConnected: number;
  dataPointsPerDay: string;
  uptime: number;
}

/* ── Company-specific data ───────────────────────────────── */

const integrationData: Record<string, CompanyIntegrationData> = {
  meridian: {
    totalConnected: 7,
    dataPointsPerDay: '680K',
    uptime: 99.6,
    integrations: [
      { id: 'i1', name: 'RailSentry / LIDAR Platform', category: 'Track Inspection', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 1420000 },
      { id: 'i2', name: 'Wabtec PTC Signal System', category: 'Positive Train Control', status: 'connected', lastSync: '3 min ago', recordsSynced: 842000 },
      { id: 'i3', name: 'SAP ECC', category: 'ERP', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 248000 },
      { id: 'i4', name: 'Trimble GPS Fleet Tracking', category: 'Fleet Telematics', status: 'connected', lastSync: '1 min ago', recordsSynced: 2400000 },
      { id: 'i5', name: 'HRSI Crew Dispatch System', category: 'Workforce Management', status: 'connected', lastSync: '8 min ago', recordsSynced: 84200 },
      { id: 'i6', name: 'FRA Safety Portal', category: 'Regulatory Compliance', status: 'connected', lastSync: '4 hrs ago', recordsSynced: 14800 },
      { id: 'i7', name: 'SharePoint — Engineering', category: 'Document Storage', status: 'connected', lastSync: '18 min ago', recordsSynced: 42000 },
    ],
  },
  hcc: {
    totalConnected: 6,
    dataPointsPerDay: '320K',
    uptime: 99.7,
    integrations: [
      { id: 'i1', name: 'HCSS HeavyJob', category: 'Construction Management', status: 'connected', lastSync: '2 min ago', recordsSynced: 842000 },
      { id: 'i2', name: 'Primavera P6', category: 'Project Controls', status: 'connected', lastSync: '7 min ago', recordsSynced: 248000 },
      { id: 'i3', name: 'SAP ECC — HCC Instance', category: 'ERP', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 124000 },
      { id: 'i4', name: 'Samsara GPS Fleet', category: 'Fleet Telematics', status: 'connected', lastSync: '1 min ago', recordsSynced: 1420000 },
      { id: 'i5', name: 'Trimble Earthworks', category: 'Machine Control', status: 'connected', lastSync: '4 min ago', recordsSynced: 84200 },
      { id: 'i6', name: 'FRA Safety Portal', category: 'Regulatory Compliance', status: 'connected', lastSync: '4 hrs ago', recordsSynced: 8400 },
    ],
  },
  hrsi: {
    totalConnected: 5,
    dataPointsPerDay: '180K',
    uptime: 99.5,
    integrations: [
      { id: 'i1', name: 'GPS Ballast Train Telemetry', category: 'Equipment Control', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 420000 },
      { id: 'i2', name: 'SAP Plant Maintenance', category: 'Work Orders', status: 'connected', lastSync: '5 min ago', recordsSynced: 84200 },
      { id: 'i3', name: 'Kronos / UKG', category: 'Workforce Management', status: 'connected', lastSync: '3 min ago', recordsSynced: 48000 },
      { id: 'i4', name: 'Equipment Tracking System', category: 'Asset Management', status: 'connected', lastSync: '2 min ago', recordsSynced: 124000 },
      { id: 'i5', name: 'Track Renewal Planner', category: 'Project Planning', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 14200 },
    ],
  },
  hsi: {
    totalConnected: 5,
    dataPointsPerDay: '240K',
    uptime: 99.8,
    integrations: [
      { id: 'i1', name: 'RailSentry LIDAR Platform', category: 'Track Inspection', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 1420000 },
      { id: 'i2', name: 'TAM-4 Ultrasonic System', category: 'Rail Testing', status: 'connected', lastSync: '2 min ago', recordsSynced: 842000 },
      { id: 'i3', name: 'Video Track Chart', category: 'Visual Inspection', status: 'connected', lastSync: '8 min ago', recordsSynced: 248000 },
      { id: 'i4', name: 'FRA Defect Database', category: 'Regulatory Compliance', status: 'connected', lastSync: '1 hr ago', recordsSynced: 14800 },
      { id: 'i5', name: 'GIS Track Mapping', category: 'Geospatial', status: 'connected', lastSync: '12 min ago', recordsSynced: 42000 },
    ],
  },
  hti: {
    totalConnected: 5,
    dataPointsPerDay: '280K',
    uptime: 99.9,
    integrations: [
      { id: 'i1', name: 'Wabtec PTC Signal System', category: 'Positive Train Control', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 842000 },
      { id: 'i2', name: 'SCADA Signal Control', category: 'Signal Monitoring', status: 'connected', lastSync: '1 min ago', recordsSynced: 420000 },
      { id: 'i3', name: 'Wayside Device Telemetry', category: 'Field Equipment', status: 'connected', lastSync: '2 min ago', recordsSynced: 248000 },
      { id: 'i4', name: 'Fiber Optic OTDR', category: 'Communications Testing', status: 'connected', lastSync: '15 min ago', recordsSynced: 24800 },
      { id: 'i5', name: 'Radio System Diagnostics', category: 'Communications', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 84200 },
    ],
  },
  htsi: {
    totalConnected: 5,
    dataPointsPerDay: '190K',
    uptime: 99.6,
    integrations: [
      { id: 'i1', name: 'Trapeze OPS', category: 'Transit Planning', status: 'connected', lastSync: '1 min ago', recordsSynced: 248000 },
      { id: 'i2', name: 'Vehicle Tracking System', category: 'Fleet Management', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 420000 },
      { id: 'i3', name: 'Fare Collection System', category: 'Revenue Management', status: 'connected', lastSync: '3 min ago', recordsSynced: 124000 },
      { id: 'i4', name: 'Kronos / UKG', category: 'Workforce Management', status: 'connected', lastSync: '5 min ago', recordsSynced: 48000 },
      { id: 'i5', name: 'Ridership Analytics Platform', category: 'Business Intelligence', status: 'connected', lastSync: '8 min ago', recordsSynced: 84200 },
    ],
  },
  he: {
    totalConnected: 4,
    dataPointsPerDay: '86K',
    uptime: 99.7,
    integrations: [
      { id: 'i1', name: 'SCADA Solar Monitoring', category: 'Energy Production', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 248000 },
      { id: 'i2', name: 'Grid Interconnection Tools', category: 'Compliance', status: 'connected', lastSync: '12 min ago', recordsSynced: 42000 },
      { id: 'i3', name: 'Weather Forecasting API', category: 'External Data', status: 'connected', lastSync: '6 min ago', recordsSynced: 84200 },
      { id: 'i4', name: 'Permit Tracking System', category: 'Regulatory', status: 'connected', lastSync: '2 hrs ago', recordsSynced: 4800 },
    ],
  },
  gg: {
    totalConnected: 4,
    dataPointsPerDay: '42K',
    uptime: 99.8,
    integrations: [
      { id: 'i1', name: 'Environmental Sensor Network', category: 'Compliance Monitoring', status: 'connected', lastSync: '2 min ago', recordsSynced: 124000 },
      { id: 'i2', name: 'EPA Reporting Portal', category: 'Regulatory', status: 'connected', lastSync: '1 hr ago', recordsSynced: 14800 },
      { id: 'i3', name: 'Lab Data Management', category: 'Testing', status: 'connected', lastSync: '18 min ago', recordsSynced: 24800 },
      { id: 'i4', name: 'GIS Remediation Mapping', category: 'Geospatial', status: 'connected', lastSync: '8 min ago', recordsSynced: 42000 },
    ],
  },
  oakwood: {
    totalConnected: 5,
    dataPointsPerDay: '284K',
    uptime: 99.4,
    integrations: [
      { id: 'i1', name: 'Guidewire ClaimCenter', category: 'Claims Management', status: 'connected', lastSync: '1 min ago', recordsSynced: 248000 },
      { id: 'i2', name: 'AS/400 Legacy System', category: 'Policy Administration', status: 'syncing', lastSync: 'Batch syncing', recordsSynced: 1420000 },
      { id: 'i3', name: 'Availity', category: 'Provider Network', status: 'connected', lastSync: '34 min ago', recordsSynced: 42000 },
      { id: 'i4', name: 'NOAA Weather API', category: 'External Data', status: 'connected', lastSync: '6 min ago', recordsSynced: 84200 },
      { id: 'i5', name: 'Zillow API', category: 'Property Valuation', status: 'connected', lastSync: '4 hrs ago', recordsSynced: 148000 },
      { id: 'i6', name: 'Salesforce', category: 'CRM', status: 'error', lastSync: 'Failed 2 hrs ago', recordsSynced: 24800 },
    ],
  },
  pinnacle: {
    totalConnected: 6,
    dataPointsPerDay: '86K',
    uptime: 99.9,
    integrations: [
      { id: 'i1', name: 'Epic EHR', category: 'Electronic Health Records', status: 'connected', lastSync: '1 min ago', recordsSynced: 142000 },
      { id: 'i2', name: 'Availity', category: 'Eligibility & Benefits', status: 'connected', lastSync: '3 min ago', recordsSynced: 28400 },
      { id: 'i3', name: 'Aetna Provider Portal', category: 'Payer Integration', status: 'connected', lastSync: '18 min ago', recordsSynced: 8400 },
      { id: 'i4', name: 'Practice Fusion', category: 'Practice Management', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 34200 },
      { id: 'i5', name: 'Twilio', category: 'Patient Communications', status: 'connected', lastSync: '8 min ago', recordsSynced: 12400 },
      { id: 'i6', name: 'RingCentral', category: 'Voice & Messaging', status: 'connected', lastSync: '12 min ago', recordsSynced: 4800 },
    ],
  },
  atlas: {
    totalConnected: 5,
    dataPointsPerDay: '1.2M',
    uptime: 99.6,
    integrations: [
      { id: 'i1', name: 'SAP S/4HANA', category: 'ERP & Inventory', status: 'connected', lastSync: '3 min ago', recordsSynced: 842000 },
      { id: 'i2', name: 'IoT Sensor Gateway', category: 'Machine Telemetry', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 4200000 },
      { id: 'i3', name: 'Haas CNC Controller', category: 'Machine Interface', status: 'connected', lastSync: '1 min ago', recordsSynced: 148000 },
      { id: 'i4', name: 'Legacy WMS', category: 'Warehouse Management', status: 'error', lastSync: 'Failed 45 min ago', recordsSynced: 24800 },
      { id: 'i5', name: 'ArcelorMittal Portal', category: 'Supplier Portal', status: 'connected', lastSync: '2 hrs ago', recordsSynced: 4200 },
      { id: 'i6', name: 'Jira', category: 'Project Management', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 8400 },
    ],
  },
  northbridge: {
    totalConnected: 7,
    dataPointsPerDay: '14.2M',
    uptime: 99.7,
    integrations: [
      { id: 'i1', name: 'SAP S/4HANA Cloud', category: 'ERP (12 instances)', status: 'connected', lastSync: '2 min ago', recordsSynced: 4200000 },
      { id: 'i2', name: 'Workday', category: 'HR & Finance', status: 'connected', lastSync: '8 min ago', recordsSynced: 842000 },
      { id: 'i3', name: 'Palantir Foundry', category: 'Analytics Platform', status: 'connected', lastSync: '1 min ago', recordsSynced: 2400000 },
      { id: 'i4', name: 'Salesforce', category: 'CRM', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 480000 },
      { id: 'i5', name: 'Siemens Xcelerator', category: 'Industrial IoT', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 8400000 },
      { id: 'i6', name: 'ServiceNow', category: 'IT Service Management', status: 'connected', lastSync: '4 min ago', recordsSynced: 148000 },
      { id: 'i7', name: 'Snowflake', category: 'Data Warehouse', status: 'connected', lastSync: '12 min ago', recordsSynced: 24800000 },
      { id: 'i8', name: 'Azure Active Directory', category: 'Identity & Access', status: 'syncing', lastSync: 'Syncing now', recordsSynced: 42000 },
    ],
  },
  estonia: {
    totalConnected: 8,
    dataPointsPerDay: '4.8M',
    uptime: 99.9,
    integrations: [
      { id: 'i1', name: 'X-Road 7.0', category: 'National Data Exchange', status: 'connected', lastSync: '< 1 min ago', recordsSynced: 12400000 },
      { id: 'i2', name: 'RIHA', category: 'Info System Registry', status: 'connected', lastSync: '14 min ago', recordsSynced: 248000 },
      { id: 'i3', name: 'eID / Smart-ID', category: 'Digital Identity', status: 'connected', lastSync: '1 min ago', recordsSynced: 1420000 },
      { id: 'i4', name: 'TEHIK', category: 'Health Information System', status: 'connected', lastSync: '3 min ago', recordsSynced: 842000 },
      { id: 'i5', name: 'SAP', category: 'Financial Management', status: 'connected', lastSync: '22 min ago', recordsSynced: 148000 },
      { id: 'i6', name: 'e-Residency Platform', category: 'Digital Residency', status: 'connected', lastSync: '8 min ago', recordsSynced: 84000 },
      { id: 'i7', name: 'EMTA (Tax Board)', category: 'Tax Administration', status: 'connected', lastSync: '2 min ago', recordsSynced: 2400000 },
      { id: 'i8', name: 'Population Registry', category: 'Civil Registry', status: 'connected', lastSync: '6 min ago', recordsSynced: 1840000 },
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

const statusConfig = {
  connected: { label: 'Connected', color: 'text-green', bg: 'bg-green-muted', dotColor: 'bg-green' },
  syncing: { label: 'Syncing', color: 'text-blue', bg: 'bg-blue-muted', dotColor: 'bg-blue' },
  error: { label: 'Error', color: 'text-red', bg: 'bg-red-muted', dotColor: 'bg-red' },
};

function StatusIcon({ status }: { status: Integration['status'] }) {
  switch (status) {
    case 'connected':
      return <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" strokeWidth={2} />;
    case 'syncing':
      return <Loader2 className="w-4 h-4 text-blue flex-shrink-0 animate-spin" strokeWidth={2} />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red flex-shrink-0" strokeWidth={2} />;
  }
}

function formatRecords(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ── Main ────────────────────────────────────────────────── */

export default function Integrations() {
  const { company } = useCompany();
  const hasOwnData = !!integrationData[company.id];
  const parentCompany = company.parentId ? companies.find((c) => c.id === company.parentId) : null;
  const data = integrationData[company.id] || (company.parentId ? integrationData[company.parentId] : null) || integrationData.meridian;

  const errorCount = data.integrations.filter((i) => i.status === 'error').length;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {!hasOwnData && parentCompany && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-muted border border-amber/20 text-[12px] text-amber font-medium">
          Showing {parentCompany.shortName} aggregate data — division-specific integrations not yet available.
        </div>
      )}
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Integrations</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Connected data sources powering {company.shortName}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Connected</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">{data.totalConnected}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Data Points / Day</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">{data.dataPointsPerDay}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Uptime</div>
          <div className="text-[24px] font-semibold text-green tabular-nums tracking-tight mt-0.5">{data.uptime}%</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Errors</div>
          <div className="text-[24px] font-semibold tabular-nums tracking-tight mt-0.5" style={{ color: errorCount > 0 ? '#DC2626' : undefined }}>{errorCount}</div>
        </motion.div>
      </div>

      {/* Integration list */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Plug className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Data Sources</h2>
          <span className="text-[11px] text-ink-tertiary tabular-nums">{data.integrations.length} integrations</span>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          {data.integrations.map((integ, i) => {
            const sc = statusConfig[integ.status];
            return (
              <motion.div
                key={integ.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-border-subtle last:border-0 hover:bg-surface-sunken/40 transition-colors"
              >
                {/* Icon */}
                <div className="p-1.5 rounded-lg bg-surface-sunken flex-shrink-0">
                  <Database className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
                </div>

                {/* Name & category */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">{integ.name}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc.color} ${sc.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dotColor} ${integ.status === 'syncing' ? 'animate-pulse-live' : ''}`} />
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-tertiary mt-0.5">{integ.category}</p>
                </div>

                {/* Records synced */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Activity className="w-3 h-3 text-ink-faint" strokeWidth={1.7} />
                    <span className="text-[12px] tabular-nums text-ink-secondary font-medium">{formatRecords(integ.recordsSynced)}</span>
                  </div>
                  <span className="text-[10px] text-ink-faint">records</span>
                </div>

                {/* Last sync */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-ink-faint" strokeWidth={1.7} />
                  <span className={`text-[11px] tabular-nums ${integ.status === 'error' ? 'text-red' : 'text-ink-tertiary'}`}>{integ.lastSync}</span>
                </div>

                {/* Status icon */}
                <StatusIcon status={integ.status} />
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
