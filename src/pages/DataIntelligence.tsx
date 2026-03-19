import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Lock,
  AlertTriangle,
  Server,
  Layers,
  ShieldCheck,
  Activity,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

/* ── Types ───────────────────────────────────────────────── */

interface StatusCard {
  label: string;
  value: string;
  color: 'blue' | 'green' | 'amber' | 'red';
  icon: typeof Database;
}

interface DataGap {
  name: string;
  severity: 'Critical' | 'High' | 'Medium';
  sources: string[];
  gapLine: string;
  blockedCapabilities: string[];
  recommendedSolution: string;
  annualImpact: number;
}

interface ArchitectureData {
  sourceSystems: string[];
  platformName: string;
  capabilities: string[];
}

interface ROIData {
  investment: number;
  annualReturn: number;
  multiplier: string;
}

interface CompanyDataIntel {
  statusCards: StatusCard[];
  gaps: DataGap[];
  architecture: ArchitectureData;
  roi: ROIData;
}

/* ── Helpers ─────────────────────────────────────────────── */

function formatDollars(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(abs / 1000).toFixed(0)}K`;
  return `$${abs.toLocaleString()}`;
}

const severityConfig = {
  Critical: { bg: 'bg-red-muted', text: 'text-red', border: 'border-red/20' },
  High: { bg: 'bg-amber-muted', text: 'text-amber', border: 'border-amber/20' },
  Medium: { bg: 'bg-blue-muted', text: 'text-blue', border: 'border-blue/20' },
};

/* ── Company-specific data ───────────────────────────────── */

const dataIntelData: Record<string, CompanyDataIntel> = {
  meridian: {
    statusCards: [
      { label: 'Systems Mapped', value: '15', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '23', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '14', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$3.8M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Unified General Ledger',
        severity: 'Critical',
        sources: ['QuickBooks', 'Sage', 'NetSuite'],
        gapLine: 'Three disconnected GL systems with no cross-OpCo consolidation layer',
        blockedCapabilities: [
          'Real-time consolidated P&L across all 4 operating companies',
          'Automated intercompany elimination entries',
          'Cross-OpCo margin analysis and cost allocation',
          'Unified cash flow forecasting',
        ],
        recommendedSolution: 'Deploy a consolidation middleware (e.g., Workiva or Planful) with bi-directional sync to all three GL platforms, creating a unified chart of accounts.',
        annualImpact: 1200000,
      },
      {
        name: 'Centralized Equipment Catalog',
        severity: 'Critical',
        sources: ['ServiceTitan', 'Manual Spreadsheets'],
        gapLine: 'Equipment records split between field service platform and offline tracking sheets',
        blockedCapabilities: [
          'Predictive maintenance scheduling across all assets',
          'Equipment utilization and ROI tracking',
          'Automated warranty and compliance alerting',
        ],
        recommendedSolution: 'Consolidate equipment master data into ServiceTitan with API-driven ingestion from spreadsheet sources. Establish single equipment ID schema.',
        annualImpact: 840000,
      },
      {
        name: 'Cross-OpCo Workforce Data',
        severity: 'High',
        sources: ['ADP', 'Paychex', 'BambooHR', 'Gusto'],
        gapLine: 'Four separate HR/payroll systems with no unified employee master',
        blockedCapabilities: [
          'Cross-OpCo resource allocation and skills matching',
          'Unified labor cost analysis by project or client',
          'Enterprise-wide attrition prediction and workforce planning',
        ],
        recommendedSolution: 'Implement a people data hub (Merge or Finch) to unify employee records across all HR platforms into a single canonical model.',
        annualImpact: 680000,
      },
      {
        name: 'Real-time Field Telemetry',
        severity: 'Medium',
        sources: ['Samsara (partial)', 'No unified dashboard'],
        gapLine: 'GPS and sensor data only partially collected with no centralized visibility layer',
        blockedCapabilities: [
          'Live fleet and crew location tracking',
          'Automated dispatch optimization based on proximity',
          'Job site safety monitoring and incident response',
        ],
        recommendedSolution: 'Expand Samsara deployment to full fleet coverage and build a real-time telemetry dashboard using Samsara APIs + a lightweight data pipeline.',
        annualImpact: 520000,
      },
    ],
    architecture: {
      sourceSystems: ['QuickBooks', 'Sage', 'NetSuite', 'ServiceTitan', 'Samsara', 'ADP'],
      platformName: 'Databricks Lakehouse',
      capabilities: ['Cross-OpCo visibility', 'AI/ML model training', 'Automated compliance'],
    },
    roi: { investment: 420000, annualReturn: 3800000, multiplier: '9.0x' },
  },
  oakwood: {
    statusCards: [
      { label: 'Systems Mapped', value: '12', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '18', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '9', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$2.4M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Claims-to-Policy Linkage',
        severity: 'Critical',
        sources: ['Guidewire', 'AS/400 Legacy'],
        gapLine: 'Modern claims platform cannot reliably join to legacy policy records',
        blockedCapabilities: [
          'Automated claims-to-policy validation at intake',
          'Historical loss ratio analysis by policy vintage',
          'Seamless subrogation and recovery tracking',
          'End-to-end audit trail for regulatory review',
        ],
        recommendedSolution: 'Build an event-driven policy cache that syncs AS/400 policy records into a queryable store accessible by Guidewire via API.',
        annualImpact: 1100000,
      },
      {
        name: 'Fraud Signal Aggregation',
        severity: 'Critical',
        sources: ['SIU Tools', 'NICB Database', 'Internal Rules Engine'],
        gapLine: 'Fraud detection signals siloed across three separate systems with no unified scoring',
        blockedCapabilities: [
          'Real-time composite fraud risk score at FNOL',
          'Cross-claim pattern detection and network analysis',
          'Automated SIU referral prioritization',
        ],
        recommendedSolution: 'Deploy a fraud analytics layer that ingests signals from all three sources and produces a single confidence-weighted fraud score per claim.',
        annualImpact: 680000,
      },
      {
        name: 'Agent Performance Analytics',
        severity: 'High',
        sources: ['Agency Portal', 'Call Center CRM', 'Direct Digital'],
        gapLine: 'No unified view of agent productivity across distribution channels',
        blockedCapabilities: [
          'Cross-channel agent conversion rate analysis',
          'Commission optimization and incentive modeling',
          'Agent book-of-business risk profiling',
        ],
        recommendedSolution: 'Create an agent analytics data mart combining production data from all three channels with a standardized agent ID and performance schema.',
        annualImpact: 420000,
      },
    ],
    architecture: {
      sourceSystems: ['Guidewire', 'AS/400', 'Duck Creek', 'NICB', 'Salesforce'],
      platformName: 'Snowflake Data Cloud',
      capabilities: ['Real-time risk scoring', 'Claims intelligence', 'Regulatory reporting'],
    },
    roi: { investment: 380000, annualReturn: 2400000, multiplier: '6.3x' },
  },
  pinnacle: {
    statusCards: [
      { label: 'Systems Mapped', value: '8', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '14', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '4', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$680K', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Clinical-Financial Bridge',
        severity: 'Critical',
        sources: ['Epic EHR', 'Waystar Billing'],
        gapLine: 'Clinical encounter data disconnected from billing and revenue cycle workflows',
        blockedCapabilities: [
          'Automated charge capture from clinical documentation',
          'Real-time denial prediction based on clinical context',
          'Revenue leakage detection across service lines',
        ],
        recommendedSolution: 'Implement an HL7 FHIR integration layer between Epic and Waystar to synchronize encounter, diagnosis, and charge data in near real-time.',
        annualImpact: 340000,
      },
      {
        name: 'Patient Journey Continuity',
        severity: 'High',
        sources: ['Epic Scheduling', 'Referral Management', 'Patient Portal'],
        gapLine: 'Scheduling, referrals, and patient communication operate as disconnected workflows',
        blockedCapabilities: [
          'End-to-end patient journey visualization',
          'Automated referral loop closure tracking',
          'Proactive care gap identification and outreach',
        ],
        recommendedSolution: 'Build a patient journey data model that stitches scheduling, referral, and portal engagement events into a unified longitudinal record.',
        annualImpact: 220000,
      },
      {
        name: 'Provider Utilization Dashboard',
        severity: 'Medium',
        sources: ['Manual Tracking', 'Excel Reports'],
        gapLine: 'Provider schedules and utilization tracked manually with no real-time visibility',
        blockedCapabilities: [
          'Real-time provider utilization and capacity monitoring',
          'Template optimization based on historical demand patterns',
          'Burnout risk indicators from scheduling data',
        ],
        recommendedSolution: 'Connect Epic scheduling APIs to a lightweight analytics dashboard that computes utilization metrics in real-time.',
        annualImpact: 120000,
      },
    ],
    architecture: {
      sourceSystems: ['Epic EHR', 'Waystar', 'Phreesia', 'Tableau', 'DocuSign'],
      platformName: 'Azure Health Data Lake',
      capabilities: ['Clinical decision support', 'Population health analytics', 'Quality reporting'],
    },
    roi: { investment: 160000, annualReturn: 680000, multiplier: '4.3x' },
  },
  atlas: {
    statusCards: [
      { label: 'Systems Mapped', value: '22', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '31', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '18', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$4.6M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Cross-Plant Inventory Visibility',
        severity: 'Critical',
        sources: ['SAP Plant 1', 'SAP Plant 2', 'SAP Plant 3', 'SAP Plant 4'],
        gapLine: 'Four separate SAP instances with no real-time cross-plant inventory view',
        blockedCapabilities: [
          'Enterprise-wide available-to-promise calculations',
          'Cross-plant stock rebalancing and transfer optimization',
          'Unified demand planning and safety stock modeling',
          'Consolidated procurement leverage across all plants',
        ],
        recommendedSolution: 'Deploy SAP Central Inventory or a custom integration layer to create a real-time federated inventory view across all four plant instances.',
        annualImpact: 1800000,
      },
      {
        name: 'Predictive Maintenance Data Lake',
        severity: 'Critical',
        sources: ['Vibration Sensors', 'Thermal Cameras', 'PLC Historians', 'CMMS'],
        gapLine: 'IoT sensor data fragmented across siloed collection systems with no unified analytics',
        blockedCapabilities: [
          'ML-driven failure prediction models across equipment types',
          'Condition-based maintenance scheduling optimization',
          'Equipment health scoring and remaining useful life estimation',
        ],
        recommendedSolution: 'Build an industrial data lake ingesting all sensor streams via MQTT/OPC-UA, with a feature store for ML model training and inference.',
        annualImpact: 1200000,
      },
      {
        name: 'Supplier Quality Scorecards',
        severity: 'High',
        sources: ['Manual Vendor Assessments', 'Incoming QC Logs', 'ERP Receiving'],
        gapLine: 'Vendor quality tracked through manual spreadsheets with no automated scoring',
        blockedCapabilities: [
          'Automated supplier quality scoring based on defect rates',
          'Predictive supplier risk assessment',
          'Data-driven supplier negotiation and consolidation',
        ],
        recommendedSolution: 'Create an automated supplier scorecard system that pulls receiving inspection data, defect rates, and delivery performance into a composite quality score.',
        annualImpact: 860000,
      },
      {
        name: 'Energy & Sustainability Tracking',
        severity: 'Medium',
        sources: ['Utility Meters', 'BMS Systems', 'Manual Reporting'],
        gapLine: 'No centralized energy monitoring or emissions tracking across facilities',
        blockedCapabilities: [
          'Real-time energy consumption monitoring by line and shift',
          'Carbon footprint calculation and ESG reporting automation',
          'Energy cost optimization through demand response',
        ],
        recommendedSolution: 'Deploy IoT energy monitors connected to a sustainability analytics platform for real-time tracking and automated ESG reporting.',
        annualImpact: 540000,
      },
    ],
    architecture: {
      sourceSystems: ['SAP (x4)', 'Siemens PLC', 'OSIsoft PI', 'Maximo', 'Arena PLM'],
      platformName: 'AWS Industrial Data Fabric',
      capabilities: ['Predictive maintenance', 'Supply chain optimization', 'Quality traceability'],
    },
    roi: { investment: 580000, annualReturn: 4600000, multiplier: '7.9x' },
  },
};

/* ── Sub-components ──────────────────────────────────────── */

function GapCard({ gap, index }: { gap: DataGap; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[gap.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      className="bg-surface-raised border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-surface-sunken/50 transition-colors cursor-pointer"
      >
        <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${sev.bg}`}>
          <Lock className={`w-4 h-4 ${sev.text}`} strokeWidth={1.7} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-ink">{gap.name}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${sev.bg} ${sev.text}`}>
              {gap.severity}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {gap.sources.map((src) => (
              <span key={src} className="text-[10px] font-medium text-ink-tertiary bg-surface-sunken px-1.5 py-0.5 rounded">
                {src}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-ink-secondary mt-1.5 leading-relaxed">{gap.gapLine}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
          <span className="text-[14px] font-semibold text-red tabular-nums">{formatDollars(gap.annualImpact)}</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-0 border-t border-border-subtle">
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
                    Blocked Capabilities
                  </div>
                  <ul className="space-y-1.5">
                    {gap.blockedCapabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-[12px] text-ink-secondary leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-red mt-1.5 flex-shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
                    Recommended Solution
                  </div>
                  <p className="text-[12px] text-ink-secondary leading-relaxed">{gap.recommendedSolution}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber" strokeWidth={1.7} />
                    <span className="text-[12px] font-semibold text-amber tabular-nums">
                      {formatDollars(gap.annualImpact)}/yr at risk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function DataIntelligence() {
  const { company } = useCompany();
  const data = dataIntelData[company.id] || dataIntelData.meridian;

  const cardColorMap = {
    blue: { bg: 'bg-blue-muted', text: 'text-blue' },
    green: { bg: 'bg-green-muted', text: 'text-green' },
    amber: { bg: 'bg-amber-muted', text: 'text-amber' },
    red: { bg: 'bg-red-muted', text: 'text-red' },
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Data Intelligence</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Data infrastructure gaps and integration opportunities for {company.shortName}
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {data.statusCards.map((card, i) => {
          const colors = cardColorMap[card.color];
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className="bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-center"
            >
              <div className={`inline-flex p-1.5 rounded-lg ${colors.bg} mb-2`}>
                <Icon className={`w-4 h-4 ${colors.text}`} strokeWidth={1.7} />
              </div>
              <div className="text-[20px] font-semibold text-ink tabular-nums tracking-tight">{card.value}</div>
              <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Data Gap Cards */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Identified Data Gaps</h2>
          <span className="text-[11px] font-medium text-ink-tertiary ml-auto">
            {data.gaps.length} gaps &middot; {formatDollars(data.gaps.reduce((s, g) => s + g.annualImpact, 0))} total exposure
          </span>
        </div>
        <div className="space-y-3">
          {data.gaps.map((gap, i) => (
            <GapCard key={gap.name} gap={gap} index={i} />
          ))}
        </div>
      </section>

      {/* Recommended Architecture */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Recommended Architecture</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-6"
        >
          {/* Source systems row */}
          <div className="mb-2">
            <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Source Systems</div>
            <div className="flex flex-wrap gap-2">
              {data.architecture.sourceSystems.map((sys) => (
                <span
                  key={sys}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-secondary bg-surface-sunken border border-border-subtle px-2.5 py-1.5 rounded-lg"
                >
                  <Database className="w-3 h-3 text-ink-tertiary" strokeWidth={1.7} />
                  {sys}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow connector */}
          <div className="flex justify-center py-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-4 bg-border" />
              <ArrowDown className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
              <div className="w-px h-4 bg-border" />
            </div>
          </div>

          {/* Unified Data Layer */}
          <div className="bg-nav-bg rounded-xl px-6 py-5 text-center mb-0">
            <div className="inline-flex p-2 rounded-lg bg-nav-surface mb-2">
              <Layers className="w-5 h-5 text-nav-text-active" strokeWidth={1.7} />
            </div>
            <div className="text-[16px] font-semibold text-nav-text-active tracking-tight">
              {data.architecture.platformName}
            </div>
            <div className="text-[11px] text-nav-text mt-1">Unified Data Layer</div>
          </div>

          {/* Arrow connector */}
          <div className="flex justify-center py-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-4 bg-border" />
              <ArrowDown className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
              <div className="w-px h-4 bg-border" />
            </div>
          </div>

          {/* Unlocked capabilities */}
          <div>
            <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Unlocked Capabilities</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.architecture.capabilities.map((cap, i) => {
                const icons = [ShieldCheck, Activity, Database];
                const CapIcon = icons[i % icons.length];
                return (
                  <div
                    key={cap}
                    className="flex items-center gap-2.5 bg-green-muted border border-green/10 rounded-lg px-3.5 py-3"
                  >
                    <CapIcon className="w-4 h-4 text-green flex-shrink-0" strokeWidth={1.7} />
                    <span className="text-[12px] font-medium text-green">{cap}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ROI Footer */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Investment Summary</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-surface-raised border border-border rounded-xl px-4 py-4 text-center">
            <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Investment</div>
            <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight">
              {formatDollars(data.roi.investment)}
            </div>
            <div className="text-[11px] text-ink-tertiary mt-0.5">one-time cost</div>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl px-4 py-4 text-center">
            <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Annual Return</div>
            <div className="text-[22px] font-semibold text-green tabular-nums tracking-tight">
              {formatDollars(data.roi.annualReturn)}
            </div>
            <div className="text-[11px] text-ink-tertiary mt-0.5">projected savings</div>
          </div>
          <div className="bg-blue-muted border border-blue/10 rounded-xl px-4 py-4 text-center">
            <div className="text-[11px] font-semibold text-blue uppercase tracking-wider mb-1">ROI Multiplier</div>
            <div className="text-[22px] font-semibold text-blue tabular-nums tracking-tight">
              {data.roi.multiplier}
            </div>
            <div className="text-[11px] text-ink-tertiary mt-0.5">return on investment</div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
