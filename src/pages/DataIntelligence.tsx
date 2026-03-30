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
  ExternalLink,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { COMMAND_CENTER_URL } from '../data/crosslinks';
import PreliminaryBanner from '../components/PreliminaryBanner';

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
      { label: 'Systems Mapped', value: '22', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '18', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '11', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$5.2M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Unified Track Intelligence Platform',
        severity: 'Critical',
        sources: ['RailSentry LIDAR', 'Video Track Chart', 'TAM-4 Surface Measurements'],
        gapLine: 'Three incompatible track inspection data systems with no geospatial correlation layer',
        blockedCapabilities: [
          'Multi-sensor defect correlation across LIDAR, video, and surface data',
          'AI-powered defect classification per FRA 49 CFR §213 standards',
          'Predictive track degradation modeling for maintenance planning',
          'Automated FRA compliance reporting across all corridor segments',
        ],
        recommendedSolution: 'Deploy a unified geospatial data lake (e.g., Databricks + PostGIS) to correlate RailSentry, Video Track Chart, and TAM-4 data by milepost reference. Enable ML-based defect classification.',
        annualImpact: 1800000,
      },
      {
        name: 'Cross-Division Dispatch System',
        severity: 'Critical',
        sources: ['HRSI HCSS Field', 'HTI Signal Crew Scheduling', 'Manual Spreadsheets'],
        gapLine: 'Crew dispatch runs on disconnected legacy systems with no shared availability view across divisions',
        blockedCapabilities: [
          'Cross-division crew optimization for multi-skill work orders',
          'Real-time HOS compliance monitoring across all 84 crews',
          'Predictive crew pre-positioning for Class I railroad maintenance windows',
        ],
        recommendedSolution: 'Implement a unified workforce management platform with API integrations to HRSI dispatch and HTI scheduling. Enable real-time HOS tracking per 49 CFR §228.',
        annualImpact: 1400000,
      },
      {
        name: 'Centralized Equipment Registry',
        severity: 'High',
        sources: ['eCMS (HCC)', 'Access DB (HRSI)', 'Spreadsheets (HSI/HTI)'],
        gapLine: 'Each division tracks 320+ heavy equipment units in separate, incompatible systems',
        blockedCapabilities: [
          'Fleet-wide utilization tracking and redeployment optimization',
          'Predictive maintenance scheduling across GPS ballast trains, tampers, and regulators',
          'Automated Class I railroad equipment certification tracking',
        ],
        recommendedSolution: 'Consolidate to eCMS integrated maintenance module with API-driven ingestion from all division sources. Establish unified equipment ID schema tied to HCSS Telematics data.',
        annualImpact: 1200000,
      },
      {
        name: 'Real-time PTC & Signal Telemetry',
        severity: 'Medium',
        sources: ['Wabtec I-ETMS (partial)', 'No unified dashboard'],
        gapLine: 'PTC and signal system data captured per-corridor with no centralized visibility across HTI operations',
        blockedCapabilities: [
          'Enterprise-wide signal system health monitoring',
          'Automated PTC firmware compliance tracking across installations',
          'Predictive signal failure detection and preventive maintenance',
        ],
        recommendedSolution: 'Build a real-time telemetry aggregation layer using Wabtec APIs + a lightweight streaming pipeline (Kafka/Flink) to create a unified signal health dashboard.',
        annualImpact: 800000,
      },
    ],
    architecture: {
      sourceSystems: ['RailSentry', 'Wabtec PTC', 'eCMS', 'HCSS Telematics', 'HRSI HCSS Field', 'FRA Portal'],
      platformName: 'Databricks Lakehouse',
      capabilities: ['Cross-division visibility', 'AI/ML defect detection', 'FRA compliance automation'],
    },
    roi: { investment: 580000, annualReturn: 5200000, multiplier: '9.0x' },
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
  northbridge: {
    statusCards: [
      { label: 'Systems Mapped', value: '84', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '62', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '38', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$18.2M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'Cross-Division Data Unification',
        severity: 'Critical',
        sources: ['SAP Instance 1-12', 'Workday', 'Palantir Foundry'],
        gapLine: '7 division SAP instances with no unified data layer — 340TB across systems with major cross-division visibility gaps',
        blockedCapabilities: [
          'Real-time consolidated reporting across all 7 divisions',
          'Cross-division procurement intelligence and volume leverage',
          'Enterprise-wide workforce analytics and skills matching across divisions',
          'Unified customer 360 across overlapping division client bases',
        ],
        recommendedSolution: 'Deploy a Palantir Foundry enterprise ontology layer connecting all 7 division SAP instances with real-time data federation and a unified semantic model.',
        annualImpact: 6400000,
      },
      {
        name: 'Industrial IoT Data Lake',
        severity: 'Critical',
        sources: ['Siemens Xcelerator', 'ABB Controllers', 'Honeywell DCS', 'Custom PLCs'],
        gapLine: 'IoT sensor data from 6 plants collected by 4 different control systems with no unified analytics layer',
        blockedCapabilities: [
          'Cross-plant predictive maintenance model training',
          'Fleet-wide equipment health scoring and benchmarking',
          'Energy optimization across manufacturing operations',
          'Real-time production quality correlation with sensor data',
        ],
        recommendedSolution: 'Build an industrial data lake on Snowflake ingesting all sensor streams via Siemens Xcelerator, with ML feature store for cross-plant model training.',
        annualImpact: 4800000,
      },
      {
        name: 'ERP Fragmentation',
        severity: 'High',
        sources: ['SAP S/4HANA (8)', 'SAP ECC (3)', 'Oracle EBS (1)'],
        gapLine: 'Mixed ERP landscape with 7 instances across 3 platforms — no harmonized chart of accounts or master data',
        blockedCapabilities: [
          'Automated intercompany elimination and financial consolidation',
          'Cross-division inventory visibility and transfer optimization',
          'Unified procurement and supplier management',
        ],
        recommendedSolution: 'Implement SAP Central Finance as a consolidation layer with harmonized chart of accounts across 7 divisions, enabling real-time financial visibility without full ERP migration.',
        annualImpact: 3800000,
      },
      {
        name: 'Workforce Data Silos',
        severity: 'High',
        sources: ['Workday (Corporate)', 'Legacy HRIS (3 divisions)', 'Manual Systems (2 divisions)'],
        gapLine: 'Only corporate and 4 divisions on Workday — remaining divisions operate on legacy or manual HR systems',
        blockedCapabilities: [
          'Enterprise-wide talent mobility and skills matching across divisions',
          'Cross-division resource allocation for projects',
          'Unified compensation benchmarking and equity analysis',
        ],
        recommendedSolution: 'Accelerate Workday rollout to remaining divisions with integration hub for legacy system data during transition period.',
        annualImpact: 3200000,
      },
    ],
    architecture: {
      sourceSystems: ['SAP (x7)', 'Workday', 'Palantir', 'Siemens', 'Salesforce', 'ServiceNow'],
      platformName: 'Snowflake + Palantir Foundry',
      capabilities: ['Cross-division intelligence', 'Predictive maintenance', 'Financial consolidation'],
    },
    roi: { investment: 2400000, annualReturn: 18200000, multiplier: '7.6x' },
  },
  estonia: {
    statusCards: [
      { label: 'Systems Mapped', value: '42', color: 'blue', icon: Server },
      { label: 'Active Connections', value: '38', color: 'green', icon: Activity },
      { label: 'Missing Connections', value: '8', color: 'red', icon: Lock },
      { label: 'Annual Impact', value: '$14.8M', color: 'amber', icon: AlertTriangle },
    ],
    gaps: [
      {
        name: 'AI-Ready Data Layer on X-Road',
        severity: 'Critical',
        sources: ['X-Road 7.0', 'Ministry Databases', 'Agency Systems'],
        gapLine: 'X-Road provides excellent interoperability for transactional queries but lacks an AI/ML-ready analytical layer — ~28TB across ministries',
        blockedCapabilities: [
          'Cross-ministry predictive analytics and policy modeling',
          'AI-driven citizen service personalization',
          'Real-time fraud detection across tax and benefits systems',
          'Population-level health trend analysis and resource allocation',
        ],
        recommendedSolution: 'Build an AI Data Commons layer on top of X-Road with anonymized, aggregated datasets for ML model training while maintaining X-Road privacy guarantees.',
        annualImpact: 5200000,
      },
      {
        name: 'Legacy System Modernization',
        severity: 'High',
        sources: ['Custom Legacy (Social Services)', 'Oracle DB (3 agencies)', 'Manual Systems'],
        gapLine: 'Several agencies still operate custom legacy systems that predate X-Road integration standards',
        blockedCapabilities: [
          'Full automation of social services eligibility determination',
          'Real-time data exchange between all government agencies',
          'Unified case management across social welfare programs',
        ],
        recommendedSolution: 'Accelerate legacy decommission with X-Road adapter layer for immediate connectivity, followed by phased migration to modern microservices architecture.',
        annualImpact: 3800000,
      },
      {
        name: 'Healthcare AI Readiness',
        severity: 'High',
        sources: ['TEHIK', 'Hospital Information Systems', 'GP Practice Software'],
        gapLine: 'Health data well-structured but AI readiness varies significantly across 42 healthcare providers',
        blockedCapabilities: [
          'AI-assisted clinical decision support across all providers',
          'Population health predictive modeling',
          'Automated drug interaction and prescription safety checks',
        ],
        recommendedSolution: 'Extend TEHIK with AI inference endpoints and standardize HL7 FHIR R4 across all providers for consistent AI model deployment.',
        annualImpact: 3400000,
      },
    ],
    architecture: {
      sourceSystems: ['X-Road', 'TEHIK', 'EMTA', 'SKA', 'Population Registry', 'eID'],
      platformName: 'X-Road AI Commons',
      capabilities: ['Cross-ministry AI', 'Citizen service automation', 'Privacy-preserving analytics'],
    },
    roi: { investment: 1800000, annualReturn: 14800000, multiplier: '8.2x' },
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
      <PreliminaryBanner />
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
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

      {/* ── Cross-link to Command Center ROI ────────────────────── */}
      <a
        href={`${COMMAND_CENTER_URL}/roi-summary?company=${company.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-ink-tertiary hover:text-blue-400 transition-colors"
      >
        View ROI breakdown in Command Center
        <ExternalLink className="w-3 h-3" strokeWidth={2} />
      </a>
    </div>
  );
}
