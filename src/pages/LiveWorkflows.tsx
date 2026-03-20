import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ChevronDown,
  Zap,
  ArrowRight,
  Database,
  FileText,
  FileSpreadsheet,
  FileImage,
  Server,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { type LiveWorkflow, type WorkflowStep } from '../data/workflows';
import { useSimulation } from '../data/SimulationEngine';

/* ── Workflow status config ──────────────────────────────── */

const statusConfig = {
  running: { label: 'Running', color: 'bg-blue', textColor: 'text-blue', bgColor: 'bg-blue-muted' },
  verified: { label: 'Verified', color: 'bg-green', textColor: 'text-green', bgColor: 'bg-green-muted' },
  flagged: { label: 'Flagged', color: 'bg-red', textColor: 'text-red', bgColor: 'bg-red-muted' },
  queued: { label: 'Queued', color: 'bg-ink-tertiary', textColor: 'text-ink-tertiary', bgColor: 'bg-surface-sunken' },
};

/* ── Context Pipeline data ───────────────────────────────── */

interface PipelineStage {
  label: string;
  count: number;
  status: 'active' | 'idle';
}

interface PipelineStats {
  ingested: number;
  normalized: number;
  packed: number;
  failed: number;
}

interface SourceDocument {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'legacy' | 'api' | 'scan' | 'spreadsheet';
  origin: string;
  size: string;
  status: 'ingested' | 'processing' | 'ready' | 'failed';
  fields?: number;
  confidence?: number;
}

interface PipelineData {
  stages: PipelineStage[];
  stats: PipelineStats;
  documents: SourceDocument[];
}

const pipelineData: Record<string, PipelineData> = {
  meridian: {
    stages: [
      { label: 'Ingestion', count: 847, status: 'active' },
      { label: 'Normalization', count: 812, status: 'active' },
      { label: 'Entity Resolution', count: 798, status: 'active' },
      { label: 'Context Packing', count: 14, status: 'active' },
    ],
    stats: { ingested: 847, normalized: 812, packed: 14, failed: 3 },
    documents: [
      { id: 'd1', name: 'Field_Inspection_NE-4412.pdf', type: 'pdf', origin: 'Field Tablet Upload', size: '2.4 MB', status: 'processing', fields: 42, confidence: 94 },
      { id: 'd2', name: 'Grainger_Invoice_GR-88421.pdf', type: 'pdf', origin: 'AP Email Inbox', size: '180 KB', status: 'ready', fields: 18, confidence: 98 },
      { id: 'd3', name: 'Fleet_Telematics_Q1.csv', type: 'csv', origin: 'Samsara API Export', size: '14.2 MB', status: 'ready', fields: 2847, confidence: 99 },
      { id: 'd4', name: 'Equipment_Catalog_2026.xlsx', type: 'spreadsheet', origin: 'SharePoint \u2014 Operations', size: '8.7 MB', status: 'ready', fields: 1420, confidence: 97 },
      { id: 'd5', name: 'NFPA_Compliance_Checklist.scan', type: 'scan', origin: 'Scanner \u2014 Hartford Office', size: '3.1 MB', status: 'processing', fields: 14, confidence: 87 },
      { id: 'd6', name: 'ServiceTitan_WorkOrders.api', type: 'api', origin: 'ServiceTitan REST API', size: '\u2014', status: 'ready', fields: 4210, confidence: 99 },
    ],
  },
  oakwood: {
    stages: [
      { label: 'Ingestion', count: 12840, status: 'active' },
      { label: 'Normalization', count: 12210, status: 'active' },
      { label: 'Entity Resolution', count: 11980, status: 'active' },
      { label: 'Context Packing', count: 8, status: 'active' },
    ],
    stats: { ingested: 12840, normalized: 12210, packed: 8, failed: 47 },
    documents: [
      { id: 'd1', name: 'FNOL_Claim_88741.pdf', type: 'pdf', origin: 'Mobile App Submission', size: '340 KB', status: 'processing', fields: 28, confidence: 87 },
      { id: 'd2', name: 'Police_Report_24-08812.scan', type: 'scan', origin: 'Fax Gateway \u2014 Fairfield PD', size: '4.2 MB', status: 'processing', fields: 42, confidence: 78 },
      { id: 'd3', name: 'AS400_PolicyBatch_14.dat', type: 'legacy', origin: 'AS/400 Mainframe Export', size: '142 MB', status: 'ready', fields: 8420, confidence: 92 },
      { id: 'd4', name: 'Coverage_Schedule_Batch14.ebcdic', type: 'legacy', origin: 'AS/400 \u2014 EBCDIC encoded', size: '34 MB', status: 'processing', fields: 2340, confidence: 89 },
      { id: 'd5', name: 'Weather_Events_CT_2025.api', type: 'api', origin: 'NOAA Weather API', size: '\u2014', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd6', name: 'PropertyVal_Zillow_Batch.csv', type: 'csv', origin: 'Zillow API Export', size: '28 MB', status: 'ready', fields: 48000, confidence: 98 },
    ],
  },
  pinnacle: {
    stages: [
      { label: 'Ingestion', count: 2140, status: 'active' },
      { label: 'Normalization', count: 2080, status: 'active' },
      { label: 'Entity Resolution', count: 2040, status: 'active' },
      { label: 'Context Packing', count: 6, status: 'active' },
    ],
    stats: { ingested: 2140, normalized: 2080, packed: 6, failed: 12 },
    documents: [
      { id: 'd1', name: 'Encounter_Audio_PH-8847.wav', type: 'scan', origin: 'Ambient Recording Device', size: '24 MB', status: 'ready', fields: 1, confidence: 99 },
      { id: 'd2', name: 'EHR_PatientChart_8847.api', type: 'api', origin: 'Epic EHR API', size: '\u2014', status: 'ready', fields: 142, confidence: 99 },
      { id: 'd3', name: 'Aetna_PA_Requirements.pdf', type: 'pdf', origin: 'Payer Portal Download', size: '8.4 MB', status: 'ready', fields: 2400, confidence: 96 },
      { id: 'd4', name: 'PT_Notes_12Sessions.pdf', type: 'pdf', origin: 'Referring Provider Fax', size: '1.2 MB', status: 'processing', fields: 48, confidence: 88 },
      { id: 'd5', name: 'Insurance_Eligibility.api', type: 'api', origin: 'Availity Eligibility API', size: '\u2014', status: 'ready', fields: 24, confidence: 99 },
      { id: 'd6', name: 'Provider_Schedule_Mar.csv', type: 'csv', origin: 'Practice Management System', size: '420 KB', status: 'ready', fields: 840, confidence: 99 },
    ],
  },
  atlas: {
    stages: [
      { label: 'Ingestion', count: 24800, status: 'active' },
      { label: 'Normalization', count: 23400, status: 'active' },
      { label: 'Entity Resolution', count: 22100, status: 'active' },
      { label: 'Context Packing', count: 12, status: 'active' },
    ],
    stats: { ingested: 24800, normalized: 23400, packed: 12, failed: 84 },
    documents: [
      { id: 'd1', name: 'CNC_Telemetry_AK-07.stream', type: 'api', origin: 'IoT Sensor Gateway \u2014 Akron', size: '\u2014', status: 'ready', fields: 14400, confidence: 99 },
      { id: 'd2', name: 'SAP_Inventory_AllPlants.api', type: 'api', origin: 'SAP S/4HANA API', size: '\u2014', status: 'ready', fields: 14200, confidence: 98 },
      { id: 'd3', name: 'WMS_Legacy_Guadalajara.csv', type: 'csv', origin: 'Legacy WMS Export (manual)', size: '18 MB', status: 'processing', fields: 4800, confidence: 91 },
      { id: 'd4', name: 'Mill_Test_Cert_DET-0312.pdf', type: 'pdf', origin: 'Supplier Portal \u2014 ArcelorMittal', size: '840 KB', status: 'ready', fields: 28, confidence: 97 },
      { id: 'd5', name: 'AMS6415_Spec_RevH.pdf', type: 'pdf', origin: 'Engineering Library', size: '2.4 MB', status: 'ready', fields: 142, confidence: 99 },
      { id: 'd6', name: 'Maintenance_History_3yr.xlsx', type: 'spreadsheet', origin: 'SAP PM Module Export', size: '24 MB', status: 'ready', fields: 8400, confidence: 96 },
    ],
  },
  northbridge: {
    stages: [
      { label: 'Ingestion', count: 48200, status: 'active' },
      { label: 'Normalization', count: 46100, status: 'active' },
      { label: 'Entity Resolution', count: 44800, status: 'active' },
      { label: 'Context Packing', count: 24, status: 'active' },
    ],
    stats: { ingested: 48200, normalized: 46100, packed: 24, failed: 142 },
    documents: [
      { id: 'd1', name: 'SAP_MasterData_12OpCos.api', type: 'api', origin: 'SAP S/4HANA Cloud \u2014 All Instances', size: '\u2014', status: 'ready', fields: 142000, confidence: 98 },
      { id: 'd2', name: 'IoT_SensorStream_6Plants.stream', type: 'api', origin: 'Siemens Xcelerator Gateway', size: '\u2014', status: 'ready', fields: 84000, confidence: 99 },
      { id: 'd3', name: 'Supplier_Contracts_2026.pdf', type: 'pdf', origin: 'SharePoint \u2014 Corporate Procurement', size: '248 MB', status: 'processing', fields: 4200, confidence: 92 },
      { id: 'd4', name: 'Consolidated_Financials_Q4.xlsx', type: 'spreadsheet', origin: 'Workday Financial Mgmt', size: '34 MB', status: 'ready', fields: 48000, confidence: 97 },
      { id: 'd5', name: 'CrossOpCo_Inventory_Daily.csv', type: 'csv', origin: 'SAP Inventory Module \u2014 All Plants', size: '82 MB', status: 'ready', fields: 24800, confidence: 96 },
      { id: 'd6', name: 'Palantir_Analytics_Export.api', type: 'api', origin: 'Palantir Foundry', size: '\u2014', status: 'ready', fields: 62000, confidence: 98 },
    ],
  },
  estonia: {
    stages: [
      { label: 'Ingestion', count: 84200, status: 'active' },
      { label: 'Normalization', count: 82400, status: 'active' },
      { label: 'Entity Resolution', count: 80100, status: 'active' },
      { label: 'Context Packing', count: 18, status: 'active' },
    ],
    stats: { ingested: 84200, normalized: 82400, packed: 18, failed: 28 },
    documents: [
      { id: 'd1', name: 'XRoad_DataFeed_AllMinistries.api', type: 'api', origin: 'X-Road 7.0 Security Server', size: '\u2014', status: 'ready', fields: 248000, confidence: 99 },
      { id: 'd2', name: 'EMTA_TaxFilings_2026Q1.api', type: 'api', origin: 'Tax & Revenue Board (EMTA)', size: '\u2014', status: 'ready', fields: 142000, confidence: 98 },
      { id: 'd3', name: 'TEHIK_HealthRecords_Batch.api', type: 'api', origin: 'TEHIK \u2014 Health Information System', size: '\u2014', status: 'ready', fields: 84000, confidence: 97 },
      { id: 'd4', name: 'Population_Registry_Feed.api', type: 'api', origin: 'Population Registry (RR)', size: '\u2014', status: 'ready', fields: 62000, confidence: 99 },
      { id: 'd5', name: 'eResidency_Applications.csv', type: 'csv', origin: 'e-Residency Program Portal', size: '24 MB', status: 'ready', fields: 18400, confidence: 96 },
      { id: 'd6', name: 'Budget_Documents_2026.pdf', type: 'pdf', origin: 'Ministry of Finance', size: '142 MB', status: 'processing', fields: 4800, confidence: 94 },
    ],
  },
};

/* ── Verification Ledger mini data ───────────────────────── */

interface MiniLedgerEntry {
  id: string;
  workflow: string;
  type: 'correction' | 'escalation' | 'approval' | 'flag';
  timestamp: string;
  corrected: string;
}

const miniLedgerData: Record<string, MiniLedgerEntry[]> = {
  meridian: [
    { id: 'VL-2026-0847', workflow: 'Field Service Report Processing', type: 'correction', timestamp: '3 min ago', corrected: 'Inspection interval: 6 months (NFPA 17A \u00a76.1.2 \u2014 commercial kitchen)' },
    { id: 'VL-2026-0846', workflow: 'Invoice Reconciliation', type: 'escalation', timestamp: '14 min ago', corrected: 'PO price: $7,750.00 \u2014 $750 overcharge flagged' },
    { id: 'VL-2026-0845', workflow: 'Equipment Utilization Analysis', type: 'approval', timestamp: '28 min ago', corrected: 'Vehicle NE-142: Utilization 38%, recommend reallocation to Southeast division' },
  ],
  oakwood: [
    { id: 'VL-2026-1204', workflow: 'Claims Intake Processing', type: 'correction', timestamp: '1 min ago', corrected: 'Vehicle: 2022 Honda Accord EX-L \u2014 VIN: 1HGCV2F34NA012847, Obsidian Blue Pearl' },
    { id: 'VL-2026-1203', workflow: 'Legacy Policy Migration', type: 'correction', timestamp: '8 min ago', corrected: 'Coverage: Business Personal Property \u2014 Flood Extension (Guidewire: CovType.BPP_FLOOD_EXT)' },
    { id: 'VL-2026-1202', workflow: 'Renewal Risk Reassessment', type: 'escalation', timestamp: '22 min ago', corrected: 'Rate increase capped at 25% per state regulation. Exception filed.' },
  ],
  pinnacle: [
    { id: 'VL-2026-0512', workflow: 'Clinical Note Summarization', type: 'correction', timestamp: '3 min ago', corrected: 'Assessment: Acute bronchitis (viral, likely). No antibiotic indicated per guidelines.' },
    { id: 'VL-2026-0511', workflow: 'Prior Authorization', type: 'correction', timestamp: '11 min ago', corrected: 'Patient has experienced chronic lumbar pain for 8+ months with documented failed conservative treatment' },
    { id: 'VL-2026-0510', workflow: 'Patient Scheduling', type: 'approval', timestamp: '24 min ago', corrected: 'Confirmed. Insurance verified: Aetna PPO, copay $30, no referral required.' },
  ],
  atlas: [
    { id: 'VL-2026-0923', workflow: 'Predictive Maintenance', type: 'flag', timestamp: '4 min ago', corrected: 'Spindle vibration 2.3\u03c3 above baseline. Bearing wear pattern consistent with L10 life prediction.' },
    { id: 'VL-2026-0922', workflow: 'Cross-Plant Inventory', type: 'correction', timestamp: '18 min ago', corrected: 'Consolidate 3 plants to Timken. Guadalajara keeps local supplier \u2014 import duty + 3-week lead time.' },
    { id: 'VL-2026-0921', workflow: 'Quality Inspection', type: 'escalation', timestamp: '9 min ago', corrected: 'HOLD \u2014 tensile strength 122 ksi below AMS-6415 minimum 125 ksi. Engineering disposition required.' },
  ],
  northbridge: [
    { id: 'VL-2026-1842', workflow: 'Cross-OpCo Procurement Consolidation', type: 'correction', timestamp: '2 min ago', corrected: 'Matched to existing vendor #VS-8841 "Titanium Metals Corporation" \u2014 active across 3 OpCos' },
    { id: 'VL-2026-1843', workflow: 'Predictive Maintenance \u2014 Industrial Fleet', type: 'flag', timestamp: '8 min ago', corrected: 'Bearing vibration 3.1\u03c3 above baseline \u2014 replacement recommended within 72 hours' },
    { id: 'VL-2026-1844', workflow: 'Financial Close Automation', type: 'correction', timestamp: '14 min ago', corrected: 'Reclassified as intercompany loan \u2014 eliminated in consolidation per IFRS 10' },
  ],
  estonia: [
    { id: 'VL-2026-2201', workflow: 'Tax Return Auto-Assessment', type: 'correction', timestamp: '3 min ago', corrected: 'Deduction reduced to \u20ac2,800 \u2014 property registry shows apartment sold in August, 8 months eligible not 12' },
    { id: 'VL-2026-2202', workflow: 'Citizen Benefits Eligibility Engine', type: 'flag', timestamp: '7 min ago', corrected: 'Income mismatch \u2014 Tax Board reports \u20ac42,000 vs Social Insurance \u20ac28,000. Benefit suspended pending investigation.' },
    { id: 'VL-2026-2203', workflow: 'Healthcare Records Integration', type: 'correction', timestamp: '18 min ago', corrected: 'Mapped to ICD-10-EE code J06.9 with Estonian clinical modifier' },
  ],
};

/* ── Verification type config ────────────────────────────── */

const verTypeConfig = {
  correction: { label: 'Correction', color: 'text-blue', bg: 'bg-blue-muted' },
  escalation: { label: 'Escalation', color: 'text-amber', bg: 'bg-amber-muted' },
  approval: { label: 'Approved', color: 'text-green', bg: 'bg-green-muted' },
  flag: { label: 'Flag', color: 'text-red', bg: 'bg-red-muted' },
};

/* ── Document type icons ─────────────────────────────────── */

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  legacy: Server,
  api: Database,
  scan: FileImage,
  spreadsheet: FileSpreadsheet,
};

const docStatusStyles: Record<string, { color: string; label: string }> = {
  ingested: { color: 'text-ink-tertiary', label: 'Ingested' },
  processing: { color: 'text-blue', label: 'Processing' },
  ready: { color: 'text-green', label: 'Ready' },
  failed: { color: 'text-red', label: 'Failed' },
};

/* ── Collapsible Section ─────────────────────────────────── */

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }: { title: string; icon: React.ElementType; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mt-8">
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

/* ── Step icon ───────────────────────────────────────────── */

function StepIcon({ status }: { status: WorkflowStep['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" strokeWidth={2} />;
    case 'active':
      return <Loader2 className="w-4 h-4 text-blue flex-shrink-0 animate-spin" strokeWidth={2} />;
    case 'verification':
      return <ShieldCheck className="w-4 h-4 text-amber flex-shrink-0" strokeWidth={2} />;
    case 'pending':
      return <Circle className="w-4 h-4 text-ink-faint flex-shrink-0" strokeWidth={1.5} />;
  }
}

function VerificationCard({ check }: { check: NonNullable<WorkflowStep['check']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="ml-7 mt-2 rounded-lg border border-amber/20 bg-amber-muted/50 p-3 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle className="w-3 h-3 text-amber" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">{check.flag}</span>
      </div>
      <div className="space-y-1.5">
        <div>
          <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Original Output</span>
          <p className="text-[12px] text-ink-secondary leading-relaxed mt-0.5 line-through decoration-red/30">{check.original}</p>
        </div>
        {check.corrected && (
          <div>
            <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Corrected</span>
            <p className="text-[12px] text-ink font-medium leading-relaxed mt-0.5">{check.corrected}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function WorkflowCard({ workflow }: { workflow: LiveWorkflow }) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[workflow.status];
  const completedSteps = workflow.steps.filter((s) => s.status === 'completed').length;
  const progress = (completedSteps / workflow.steps.length) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-raised border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 cursor-pointer hover:bg-surface-sunken/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${sc.textColor} ${sc.bgColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.color} ${workflow.status === 'running' ? 'animate-pulse-live' : ''}`} />
                {sc.label}
              </span>
              <span className="text-[11px] text-ink-tertiary">{workflow.startedAt}</span>
            </div>
            <h3 className="text-[14px] font-semibold text-ink leading-snug">{workflow.name}</h3>
            <p className="text-[12px] text-ink-tertiary mt-0.5">{workflow.department}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-ink-tertiary">Cycle time</div>
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-ink-tertiary line-through">{workflow.cycleTime.before}</span>
                <ArrowRight className="w-3 h-3 text-ink-faint" />
                <span className="text-green font-semibold">{workflow.cycleTime.after}</span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-ink-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-surface-sunken overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${workflow.status === 'flagged' ? 'bg-red' : 'bg-blue'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-ink-tertiary font-medium w-12 text-right">
            {completedSteps}/{workflow.steps.length}
          </span>
        </div>
      </button>

      {/* Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border-subtle pt-4">
              <div className="space-y-0">
                {workflow.steps.map((step, i) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-3 py-2">
                      <div className="flex flex-col items-center">
                        <StepIcon status={step.status} />
                        {i < workflow.steps.length - 1 && (
                          <div className={`w-px flex-1 min-h-[16px] mt-1 ${
                            step.status === 'completed' ? 'bg-green/20' : 'bg-border'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-medium ${
                            step.status === 'pending' ? 'text-ink-tertiary' : 'text-ink'
                          }`}>
                            {step.label}
                          </span>
                          {step.duration && step.duration !== '\u2014' && (
                            <span className="text-[10px] tabular-nums text-ink-faint font-mono">{step.duration}</span>
                          )}
                          {step.confidence && (
                            <span className="text-[10px] font-medium text-ink-tertiary px-1 py-0.5 rounded bg-surface-sunken">
                              {step.confidence}% confidence
                            </span>
                          )}
                        </div>
                        <p className={`text-[12px] leading-relaxed mt-0.5 ${
                          step.status === 'pending' ? 'text-ink-faint' : 'text-ink-secondary'
                        }`}>
                          {step.detail}
                        </p>
                        {step.agent && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-ink-tertiary">
                            <Zap className="w-2.5 h-2.5" strokeWidth={2} />
                            {step.agent}
                          </span>
                        )}
                      </div>
                    </div>

                    {step.check && (step.status === 'verification' || step.status === 'completed') && (
                      <VerificationCard check={step.check} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function LiveWorkflows() {
  const { company } = useCompany();
  const { liveWorkflows } = useSimulation();
  const workflows = liveWorkflows;

  const running = workflows.filter((w) => w.status === 'running').length;
  const verified = workflows.filter((w) => w.status === 'verified').length;
  const flagged = workflows.filter((w) => w.status === 'flagged').length;
  const totalSavings = workflows.reduce((sum, w) => sum + w.savings, 0);

  const pipeline = pipelineData[company.id] || pipelineData.meridian;
  const recentVerifications = miniLedgerData[company.id] || miniLedgerData.meridian;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Operations</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">{company.tagline}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Running</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">{running}</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Verified</div>
          <div className="text-[24px] font-semibold text-green tabular-nums tracking-tight mt-0.5">{verified}</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Flagged</div>
          <div className="text-[24px] font-semibold tabular-nums tracking-tight mt-0.5" style={{ color: flagged > 0 ? '#DC2626' : undefined }}>{flagged}</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Savings / yr</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">
            ${(totalSavings / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="space-y-3">
        {workflows.map((workflow, i) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <WorkflowCard workflow={workflow} />
          </motion.div>
        ))}
      </div>

      {/* ── Context Pipeline (collapsible) ─────────────────── */}
      <CollapsibleSection title="Context Pipeline" icon={Database} defaultOpen={false}>
        {/* Pipeline stages visualization */}
        <div className="mb-4 p-5 bg-surface-raised border border-border rounded-xl">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
            {pipeline.stages.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 flex-shrink-0">
                <div className="text-center">
                  <div className="text-[22px] font-semibold tabular-nums text-ink tracking-tight">
                    {stage.count.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-ink-tertiary font-medium mt-0.5">{stage.label}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${stage.status === 'active' ? 'bg-green animate-pulse-live' : 'bg-ink-faint'}`} />
                    <span className="text-[10px] text-ink-tertiary">{stage.status === 'active' ? 'Active' : 'Idle'}</span>
                  </div>
                </div>
                {i < pipeline.stages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-ink-faint mx-2 flex-shrink-0" strokeWidth={1.5} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-center">
            <div className="text-[18px] font-semibold tabular-nums text-ink">{pipeline.stats.ingested.toLocaleString()}</div>
            <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Ingested</div>
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-center">
            <div className="text-[18px] font-semibold tabular-nums text-ink">{pipeline.stats.normalized.toLocaleString()}</div>
            <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Normalized</div>
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-center">
            <div className="text-[18px] font-semibold tabular-nums text-green">{pipeline.stats.packed}</div>
            <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Context Packs</div>
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-surface-raised border border-border text-center">
            <div className="text-[18px] font-semibold tabular-nums text-red">{pipeline.stats.failed}</div>
            <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Failed</div>
          </div>
        </div>

        {/* Source documents list */}
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          {pipeline.documents.map((doc) => {
            const Icon = typeIcons[doc.type] || FileText;
            const st = docStatusStyles[doc.status];
            return (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border-subtle last:border-0 hover:bg-surface-sunken/40 transition-colors">
                <Icon className="w-4 h-4 text-ink-tertiary flex-shrink-0" strokeWidth={1.7} />
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-mono text-ink truncate block">{doc.name}</span>
                  <span className="text-[11px] text-ink-tertiary">{doc.origin}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {doc.confidence && doc.confidence < 85 && (
                    <span className="text-[10px] font-medium text-amber px-1.5 py-0.5 rounded bg-amber-muted">{doc.confidence}%</span>
                  )}
                  {doc.fields && doc.fields > 0 && (
                    <span className="text-[11px] tabular-nums text-ink-tertiary hidden sm:block">{doc.fields.toLocaleString()} fields</span>
                  )}
                  <div className="flex items-center gap-1.5">
                    {doc.status === 'processing' && <Loader2 className="w-3 h-3 text-blue animate-spin" />}
                    {doc.status === 'ready' && <CheckCircle2 className="w-3 h-3 text-green" />}
                    {doc.status === 'failed' && <AlertCircle className="w-3 h-3 text-red" />}
                    <span className={`text-[11px] font-medium ${st.color}`}>{st.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ── Recent Verifications (collapsible) ─────────────── */}
      <CollapsibleSection title="Recent Verifications" icon={ShieldCheck} defaultOpen={false}>
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          {recentVerifications.map((entry, i) => {
            const tc = verTypeConfig[entry.type];
            return (
              <div key={entry.id} className={`px-5 py-3.5 ${i < recentVerifications.length - 1 ? 'border-b border-border-subtle' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-medium text-ink">{entry.workflow}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tc.color} ${tc.bg}`}>{tc.label}</span>
                  <span className="ml-auto flex items-center gap-1 text-ink-faint">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] tabular-nums">{entry.timestamp}</span>
                  </span>
                </div>
                <p className="text-[12px] text-ink-secondary leading-relaxed">{entry.corrected}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <Link
            to="/verification"
            className="text-[12px] font-medium text-blue hover:text-blue/80 transition-colors"
          >
            View full ledger &rarr;
          </Link>
        </div>
      </CollapsibleSection>
    </div>
  );
}
