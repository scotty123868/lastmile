import { motion } from 'framer-motion';
import {
  Cpu,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
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

interface CompanyAssessmentData {
  techStack: TechTool[];
  licenses: LicenseEntry[];
}

/* ── Company-specific data ───────────────────────────────── */

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
  },
};

/* ── Integration & Remediation types ─────────────────── */

interface IntegrationPair {
  from: string;
  to: string;
  status: 'connected' | 'partial' | 'siloed';
  dataFlow: string;
}

interface RemediationStep {
  priority: number;
  action: string;
  category: 'integration' | 'migration' | 'optimization' | 'training';
  effort: 'Low' | 'Medium' | 'High';
  timeline: string;
  impact: string;
}

interface ExtendedAssessmentData {
  integrations: IntegrationPair[];
  remediation: RemediationStep[];
}

const extendedData: Record<string, ExtendedAssessmentData> = {
  meridian: {
    integrations: [
      { from: 'SAP Business One', to: 'Salesforce', status: 'partial', dataFlow: 'Manual CSV export weekly' },
      { from: 'ServiceTitan', to: 'SAP Business One', status: 'siloed', dataFlow: 'No integration — rekeyed manually' },
      { from: 'Tableau', to: 'SAP Business One', status: 'connected', dataFlow: 'ODBC direct connection' },
      { from: 'ADP', to: 'SAP Business One', status: 'partial', dataFlow: 'Monthly batch file upload' },
      { from: 'Salesforce', to: 'ServiceTitan', status: 'siloed', dataFlow: 'Phone/email handoff only' },
    ],
    remediation: [
      { priority: 1, action: 'Deploy data lake to unify field ops and financial data', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$920K savings unlock' },
      { priority: 2, action: 'Integrate ServiceTitan ↔ SAP via API middleware', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate manual rekeying' },
      { priority: 3, action: 'Downgrade 95 unused Salesforce CRM seats', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '$340K annual savings' },
      { priority: 4, action: 'Migrate Tableau viewers to Power BI embedded', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: '$195K annual savings' },
      { priority: 5, action: 'AI readiness training for field operations teams', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 20-30%' },
    ],
  },
  oakwood: {
    integrations: [
      { from: 'Guidewire', to: 'AS/400', status: 'partial', dataFlow: 'Nightly batch ETL — 18hr lag' },
      { from: 'Salesforce', to: 'Guidewire', status: 'connected', dataFlow: 'API integration (limited fields)' },
      { from: 'SAS Analytics', to: 'Guidewire', status: 'partial', dataFlow: 'Weekly data extract' },
      { from: 'Availity', to: 'Custom Portal', status: 'siloed', dataFlow: 'Manual lookup required' },
      { from: 'AS/400', to: 'SAS Analytics', status: 'siloed', dataFlow: 'Ad-hoc queries by IT only' },
    ],
    remediation: [
      { priority: 1, action: 'Replace AS/400 batch ETL with real-time event streaming', category: 'migration', effort: 'High', timeline: '4-5 months', impact: 'Eliminate 18hr data lag' },
      { priority: 2, action: 'Unify Guidewire + portal into single claims workspace', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$860K claims automation' },
      { priority: 3, action: 'Migrate SAS seats to Power BI with Guidewire connector', category: 'migration', effort: 'Medium', timeline: '6-8 weeks', impact: '$185K annual savings' },
      { priority: 4, action: 'Consolidate Guidewire test environments', category: 'optimization', effort: 'Low', timeline: '3 weeks', impact: '$260K annual savings' },
      { priority: 5, action: 'Claims adjuster AI workflow training program', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 25-35%' },
    ],
  },
  pinnacle: {
    integrations: [
      { from: 'Epic EHR', to: 'Athenahealth', status: 'connected', dataFlow: 'HL7 FHIR integration' },
      { from: 'Epic EHR', to: 'Surescripts', status: 'connected', dataFlow: 'Real-time e-prescribing' },
      { from: 'Custom Scheduling', to: 'Epic EHR', status: 'partial', dataFlow: 'Hourly sync — occasional conflicts' },
      { from: 'Power BI', to: 'Epic EHR', status: 'partial', dataFlow: 'Daily data warehouse refresh' },
      { from: 'Workday', to: 'Custom Scheduling', status: 'siloed', dataFlow: 'Staff roster emailed weekly' },
    ],
    remediation: [
      { priority: 1, action: 'Replace custom scheduling with Epic Cadence module', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: 'Eliminate sync conflicts' },
      { priority: 2, action: 'Connect Workday → Epic for real-time staff rostering', category: 'integration', effort: 'Medium', timeline: '6 weeks', impact: '$220K scheduling savings' },
      { priority: 3, action: 'Audit and remove unused Epic add-on modules', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '$85K annual savings' },
      { priority: 4, action: 'Upgrade Power BI to real-time Epic streaming', category: 'integration', effort: 'Low', timeline: '3 weeks', impact: 'Same-day clinical insights' },
      { priority: 5, action: 'Provider AI adoption coaching program', category: 'training', effort: 'Low', timeline: '3 weeks', impact: 'Adoption uplift 15-25%' },
    ],
  },
  atlas: {
    integrations: [
      { from: 'SAP S/4HANA', to: 'Siemens MindSphere', status: 'partial', dataFlow: 'Batch upload every 4 hours' },
      { from: 'Oracle SCM', to: 'SAP S/4HANA', status: 'partial', dataFlow: 'Daily reconciliation file' },
      { from: 'Aveva', to: 'Siemens MindSphere', status: 'siloed', dataFlow: 'Separate plant-level systems' },
      { from: 'Power BI', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'Direct OData connection' },
      { from: 'SAP SuccessFactors', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'Native SAP integration' },
    ],
    remediation: [
      { priority: 1, action: 'Deploy IoT gateway for real-time MindSphere ↔ SAP streaming', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$1.34M maintenance savings' },
      { priority: 2, action: 'Migrate 3 plants to unified Oracle SCM instance', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '$210K + procurement visibility' },
      { priority: 3, action: 'Consolidate Aveva into MindSphere unified plant ops', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: '$170K + cross-plant analytics' },
      { priority: 4, action: 'Harmonize SAP user roles across 4 plants', category: 'optimization', effort: 'Medium', timeline: '6 weeks', impact: '$480K license savings' },
      { priority: 5, action: 'Floor worker AI tools training program', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 20-30%' },
    ],
  },
  northbridge: {
    integrations: [
      { from: 'SAP S/4HANA', to: 'Workday', status: 'partial', dataFlow: '8 of 12 OpCos integrated — 4 on legacy HRIS' },
      { from: 'Palantir Foundry', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'API ingestion from 9 OpCos' },
      { from: 'Salesforce', to: 'ServiceNow', status: 'partial', dataFlow: '6 OpCos connected — 6 manual handoff' },
      { from: 'Siemens Xcelerator', to: 'Palantir Foundry', status: 'partial', dataFlow: 'Industrial OpCos only — 4 of 12' },
      { from: 'ServiceNow', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'Enterprise ITSM integration' },
    ],
    remediation: [
      { priority: 1, action: 'Harmonize all 12 OpCos onto unified SAP S/4HANA tenant', category: 'migration', effort: 'High', timeline: '6-8 months', impact: '$3.8M license + ops savings' },
      { priority: 2, action: 'Extend Palantir Foundry ingestion to remaining 3 OpCos', category: 'integration', effort: 'Medium', timeline: '2-3 months', impact: 'Full cross-OpCo analytics' },
      { priority: 3, action: 'Consolidate 4 legacy HRIS systems into Workday', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '$1.4M annual savings' },
      { priority: 4, action: 'Downgrade 1,100 Salesforce seats to Platform licenses', category: 'optimization', effort: 'Low', timeline: '3 weeks', impact: '$2.2M annual savings' },
      { priority: 5, action: 'Enterprise-wide AI change management program', category: 'training', effort: 'Medium', timeline: '3 months', impact: 'Adoption uplift across 42K employees' },
    ],
  },
  estonia: {
    integrations: [
      { from: 'X-Road', to: 'RIHA', status: 'connected', dataFlow: 'Real-time registry queries' },
      { from: 'X-Road', to: 'TEHIK', status: 'connected', dataFlow: 'Health data exchange via X-Road v7' },
      { from: 'SAP', to: 'X-Road', status: 'partial', dataFlow: '4 of 8 ministries connected' },
      { from: 'Custom Legacy', to: 'X-Road', status: 'siloed', dataFlow: 'Social services still paper-based in 3 regions' },
      { from: 'eID / Smart-ID', to: 'TEHIK', status: 'connected', dataFlow: 'Digital identity verification layer' },
    ],
    remediation: [
      { priority: 1, action: 'Migrate remaining 4 ministries to SAP via X-Road', category: 'integration', effort: 'High', timeline: '5-6 months', impact: '€1.2M savings + full fiscal visibility' },
      { priority: 2, action: 'Decommission legacy social services systems', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '€380K + digitize 3 regions' },
      { priority: 3, action: 'Consolidate Oracle databases to PostgreSQL + X-Road', category: 'migration', effort: 'Medium', timeline: '3-4 months', impact: '€680K annual savings' },
      { priority: 4, action: 'Downgrade non-ministry M365 E5 to E3', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '€540K annual savings' },
      { priority: 5, action: 'Civil servant AI literacy program across 8 agencies', category: 'training', effort: 'Medium', timeline: '3 months', impact: 'Adoption uplift across 28.5K staff' },
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function formatDollars(n: number, symbol: string = '$'): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${symbol}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${symbol}${(abs / 1000).toFixed(0)}K`;
  return `${symbol}${abs.toLocaleString()}`;
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

/* ── Main ────────────────────────────────────────────────── */

export default function Assessment() {
  const { company } = useCompany();
  const data = assessmentData[company.id] || assessmentData.meridian;

  const avgReadiness = Math.round(data.techStack.reduce((s, t) => s + t.current, 0) / data.techStack.length * 10) / 10;
  const totalWaste = data.licenses.reduce((s, l) => s + l.waste, 0);
  const ext = extendedData[company.id] || extendedData.meridian;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Assessment</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Tech stack diagnostic and license waste analysis — {company.employees.toLocaleString()} employees across {company.opCos} {company.category === 'sovereign' ? 'agencies' : company.opCos > 1 ? 'operating companies' : 'entity'}
        </p>
      </div>

      {/* ── Summary Stats ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-surface-raised border border-border rounded-xl px-4 py-3 text-center">
          <div className="text-[20px] font-semibold tabular-nums text-ink">{data.techStack.length}</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Systems Assessed</div>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl px-4 py-3 text-center">
          <div className={`text-[20px] font-semibold tabular-nums ${avgReadiness >= 7 ? 'text-green' : avgReadiness >= 4 ? 'text-amber' : 'text-red'}`}>{avgReadiness}</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Avg Readiness</div>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl px-4 py-3 text-center">
          <div className="text-[20px] font-semibold tabular-nums text-ink">{data.licenses.reduce((s, l) => s + l.total, 0).toLocaleString()}</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Total Licenses</div>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl px-4 py-3 text-center">
          <div className="text-[20px] font-semibold tabular-nums text-red">{formatDollars(totalWaste, company.currency)}</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Annual Waste</div>
        </div>
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
              {formatDollars(totalWaste, company.currency)}
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
                    -{formatDollars(lic.waste, company.currency)}
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

      {/* ── Section 3: Integration Readiness ─────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">System Integration Map</h2>
        </div>
        <div className="space-y-2">
          {ext.integrations.map((pair, i) => {
            const statusColor = pair.status === 'connected' ? 'bg-green-muted text-green' : pair.status === 'partial' ? 'bg-amber-muted text-amber' : 'bg-red-muted text-red';
            return (
              <motion.div
                key={`${pair.from}-${pair.to}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[12px] font-semibold text-ink truncate">{pair.from}</span>
                  <ChevronRight className="w-3 h-3 text-ink-faint flex-shrink-0" />
                  <span className="text-[12px] font-semibold text-ink truncate">{pair.to}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor}`}>
                  {pair.status}
                </span>
                <span className="text-[11px] text-ink-tertiary italic flex-shrink-0 sm:text-right">{pair.dataFlow}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Remediation Roadmap ───────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Remediation Roadmap</h2>
        </div>
        <div className="space-y-2">
          {ext.remediation.map((step, i) => {
            const catColor: Record<string, string> = {
              integration: 'bg-blue-muted text-blue',
              migration: 'bg-amber-muted text-amber',
              optimization: 'bg-green-muted text-green',
              training: 'bg-surface-sunken text-ink-tertiary',
            };
            const effortColor = step.effort === 'Low' ? 'text-green' : step.effort === 'Medium' ? 'text-amber' : 'text-red';
            return (
              <motion.div
                key={step.priority}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-muted text-blue text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-ink mb-1">{step.action}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catColor[step.category] || 'bg-surface-sunken text-ink-tertiary'}`}>
                        {step.category}
                      </span>
                      <span className="text-[11px] text-ink-tertiary">
                        Effort: <span className={`font-semibold ${effortColor}`}>{step.effort}</span>
                      </span>
                      <span className="text-[11px] text-ink-tertiary">Timeline: <span className="font-semibold text-ink-secondary">{step.timeline}</span></span>
                      <span className="text-[11px] text-ink-tertiary">Impact: <span className="font-semibold text-green">{step.impact}</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
