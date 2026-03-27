import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Database,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Package,
  Layers,
  ChevronDown,
  FileSpreadsheet,
  FileImage,
  Server,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Types ───────────────────────────────────────────────── */

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

interface ContextPack {
  id: string;
  name: string;
  description: string;
  sources: number;
  fields: number;
  freshness: string;
  status: 'ready' | 'building' | 'stale';
  lastUpdated: string;
  usedBy: string[];
}

interface PipelineStage {
  label: string;
  count: number;
  status: 'active' | 'idle';
}

interface CompanyPipelineData {
  stages: PipelineStage[];
  documents: SourceDocument[];
  contextPacks: ContextPack[];
  stats: { ingested: number; normalized: number; packed: number; failed: number };
}

/* ── Company-specific data ───────────────────────────────── */

const pipelineData: Record<string, CompanyPipelineData> = {
  meridian: {
    stages: [
      { label: 'Ingestion', count: 4280, status: 'active' },
      { label: 'Normalization', count: 4120, status: 'active' },
      { label: 'Entity Resolution', count: 3980, status: 'active' },
      { label: 'Context Packing', count: 18, status: 'active' },
    ],
    stats: { ingested: 4280, normalized: 4120, packed: 18, failed: 12 },
    documents: [
      { id: 'd1', name: 'TrackGeometry_NEC_Segment-47.csv', type: 'csv', origin: 'RailSentry LIDAR Export — Northeast Corridor', size: '48 MB', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd2', name: 'GPS_Ballast_Fleet_Q1.api', type: 'api', origin: 'GPS Ballast Train Telemetry API', size: '—', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd3', name: 'FRA_Compliance_Inspection_2026-03.pdf', type: 'pdf', origin: 'FRA Track Safety Standards Portal', size: '4.8 MB', status: 'processing', fields: 86, confidence: 94 },
      { id: 'd4', name: 'CrewDispatch_Midwest_Division.xlsx', type: 'spreadsheet', origin: 'HRSI Dispatch System Export', size: '12.4 MB', status: 'ready', fields: 3200, confidence: 97 },
      { id: 'd5', name: 'PTC_Signal_Logs_HTI-0312.api', type: 'api', origin: 'Positive Train Control Signal System', size: '—', status: 'ready', fields: 24800, confidence: 99 },
      { id: 'd6', name: 'VideoTrackChart_Segment_NE-22.scan', type: 'scan', origin: 'HSI Video Track Chart System', size: '2.4 GB', status: 'processing', fields: 420, confidence: 91 },
      { id: 'd7', name: 'TAM4_SurfaceMeasurements_Q1.csv', type: 'csv', origin: 'TAM-4 Track Assessment Machine', size: '34 MB', status: 'ready', fields: 6200, confidence: 97 },
      { id: 'd8', name: 'Handwritten_Track_Inspector_Notes.scan', type: 'scan', origin: 'Field Tablet Upload — Track Crew', size: '2.1 MB', status: 'processing', fields: 12, confidence: 74 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Track Intelligence', description: 'LIDAR geometry data + Video Track Chart + TAM-4 surface measurements + FRA classification standards', sources: 6, fields: 24800, freshness: 'Real-time', status: 'ready', lastUpdated: '3 min ago', usedBy: ['Track Geometry Analysis', 'Defect Detection & Classification'] },
      { id: 'cp2', name: 'Crew Operations', description: 'Crew roster + certifications + HOS records + dispatch history + equipment qualifications', sources: 4, fields: 8400, freshness: 'Hourly', status: 'ready', lastUpdated: '18 min ago', usedBy: ['Crew Dispatch Optimization', 'HOS Compliance Monitoring'] },
      { id: 'cp3', name: 'Fleet & Equipment', description: 'GPS ballast trains + tampers + regulators + tie cranes + maintenance schedules + utilization logs', sources: 5, fields: 14200, freshness: 'Real-time', status: 'building', lastUpdated: '8 min ago', usedBy: ['Equipment Utilization Report', 'Predictive Maintenance'] },
      { id: 'cp4', name: 'FRA Safety & Compliance', description: '49 CFR Part 213 standards + track classifications + inspection schedules + defect thresholds + PTC requirements', sources: 4, fields: 2400, freshness: 'Weekly', status: 'ready', lastUpdated: '2 days ago', usedBy: ['Track Geometry Analysis', 'FRA Compliance Reporting'] },
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
      { id: 'd2', name: 'Police_Report_24-08812.scan', type: 'scan', origin: 'Fax Gateway — Fairfield PD', size: '4.2 MB', status: 'processing', fields: 42, confidence: 78 },
      { id: 'd3', name: 'AS400_PolicyBatch_14.dat', type: 'legacy', origin: 'AS/400 Mainframe Export', size: '142 MB', status: 'ready', fields: 8420, confidence: 92 },
      { id: 'd4', name: 'Coverage_Schedule_Batch14.ebcdic', type: 'legacy', origin: 'AS/400 — EBCDIC encoded', size: '34 MB', status: 'processing', fields: 2340, confidence: 89 },
      { id: 'd5', name: 'Weather_Events_CT_2025.api', type: 'api', origin: 'NOAA Weather API', size: '—', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd6', name: 'PropertyVal_Zillow_Batch.csv', type: 'csv', origin: 'Zillow API Export', size: '28 MB', status: 'ready', fields: 48000, confidence: 98 },
      { id: 'd7', name: 'SIU_PatternDB_2026Q1.xlsx', type: 'spreadsheet', origin: 'Special Investigations Unit', size: '2.1 MB', status: 'ready', fields: 847, confidence: 97 },
      { id: 'd8', name: 'Handwritten_Adjuster_Notes.scan', type: 'scan', origin: 'Scanner — Claims Dept', size: '5.4 MB', status: 'failed', fields: 0, confidence: 34 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Claims Processing', description: 'Policy details + claims history + vehicle data + repair networks + fraud signals', sources: 8, fields: 24000, freshness: 'Real-time', status: 'ready', lastUpdated: '1 min ago', usedBy: ['Claims Intake', 'Fraud Detection', 'Adjuster Assignment'] },
      { id: 'cp2', name: 'Policy Migration', description: 'Legacy policy structures + coverage schedules + named insureds + endorsements + rate tables', sources: 4, fields: 18400, freshness: 'Batch (daily)', status: 'building', lastUpdated: '8 min ago', usedBy: ['Legacy Policy Migration'] },
      { id: 'cp3', name: 'Underwriting Intelligence', description: 'Risk models + loss ratios + weather data + property values + regulatory constraints', sources: 6, fields: 62000, freshness: 'Daily', status: 'ready', lastUpdated: '4 hrs ago', usedBy: ['Renewal Risk Reassessment', 'New Business Pricing'] },
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
      { id: 'd2', name: 'EHR_PatientChart_8847.api', type: 'api', origin: 'Epic EHR API', size: '—', status: 'ready', fields: 142, confidence: 99 },
      { id: 'd3', name: 'Aetna_PA_Requirements.pdf', type: 'pdf', origin: 'Payer Portal Download', size: '8.4 MB', status: 'ready', fields: 2400, confidence: 96 },
      { id: 'd4', name: 'PT_Notes_12Sessions.pdf', type: 'pdf', origin: 'Referring Provider Fax', size: '1.2 MB', status: 'processing', fields: 48, confidence: 88 },
      { id: 'd5', name: 'Insurance_Eligibility.api', type: 'api', origin: 'Availity Eligibility API', size: '—', status: 'ready', fields: 24, confidence: 99 },
      { id: 'd6', name: 'Provider_Schedule_Mar.csv', type: 'csv', origin: 'Practice Management System', size: '420 KB', status: 'ready', fields: 840, confidence: 99 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Clinical Documentation', description: 'Patient charts + encounter history + medication lists + allergies + care plans', sources: 4, fields: 8400, freshness: 'Real-time', status: 'ready', lastUpdated: '3 min ago', usedBy: ['Clinical Note Summarization', 'ICD-10 Coding'] },
      { id: 'cp2', name: 'Prior Authorization', description: 'Payer requirements + clinical evidence + treatment history + approval patterns', sources: 5, fields: 4200, freshness: 'Daily', status: 'ready', lastUpdated: '2 hrs ago', usedBy: ['Prior Auth Automation'] },
      { id: 'cp3', name: 'Scheduling Intelligence', description: 'Provider availability + patient preferences + insurance verification + no-show patterns', sources: 3, fields: 2100, freshness: 'Real-time', status: 'ready', lastUpdated: '5 min ago', usedBy: ['Patient Scheduling'] },
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
      { id: 'd1', name: 'CNC_Telemetry_AK-07.stream', type: 'api', origin: 'IoT Sensor Gateway — Akron', size: '—', status: 'ready', fields: 14400, confidence: 99 },
      { id: 'd2', name: 'SAP_Inventory_AllPlants.api', type: 'api', origin: 'SAP S/4HANA API', size: '—', status: 'ready', fields: 14200, confidence: 98 },
      { id: 'd3', name: 'WMS_Legacy_Guadalajara.csv', type: 'csv', origin: 'Legacy WMS Export (manual)', size: '18 MB', status: 'processing', fields: 4800, confidence: 91 },
      { id: 'd4', name: 'Mill_Test_Cert_DET-0312.pdf', type: 'pdf', origin: 'Supplier Portal — ArcelorMittal', size: '840 KB', status: 'ready', fields: 28, confidence: 97 },
      { id: 'd5', name: 'AMS6415_Spec_RevH.pdf', type: 'pdf', origin: 'Engineering Library', size: '2.4 MB', status: 'ready', fields: 142, confidence: 99 },
      { id: 'd6', name: 'Maintenance_History_3yr.xlsx', type: 'spreadsheet', origin: 'SAP PM Module Export', size: '24 MB', status: 'ready', fields: 8400, confidence: 96 },
      { id: 'd7', name: 'OEM_CNC_Specs_Haas.pdf', type: 'pdf', origin: 'Haas Automation Portal', size: '14 MB', status: 'ready', fields: 420, confidence: 99 },
      { id: 'd8', name: 'Shift_Logs_Akron_Feb.scan', type: 'scan', origin: 'Scanner — Akron Floor', size: '8.2 MB', status: 'processing', fields: 240, confidence: 82 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Predictive Maintenance', description: 'Sensor baselines + maintenance history + OEM specs + part lifecycle data + operator logs', sources: 6, fields: 24000, freshness: 'Real-time', status: 'ready', lastUpdated: '1 min ago', usedBy: ['Predictive Maintenance — CNC Fleet'] },
      { id: 'cp2', name: 'Cross-Plant Inventory', description: 'Unified SKU taxonomy + vendor pricing + lead times + consumption patterns + warehouse locations', sources: 5, fields: 42000, freshness: 'Hourly', status: 'ready', lastUpdated: '22 min ago', usedBy: ['Cross-Plant Inventory Optimization'] },
      { id: 'cp3', name: 'Quality Assurance', description: 'Material specs + supplier certs + inspection history + non-conformance records + customer requirements', sources: 4, fields: 8400, freshness: 'Per-shipment', status: 'building', lastUpdated: '9 min ago', usedBy: ['Quality Inspection'] },
      { id: 'cp4', name: 'Production Planning', description: 'Machine capacity + order backlog + material availability + shift schedules + tooling inventory', sources: 6, fields: 18000, freshness: 'Real-time', status: 'ready', lastUpdated: '4 min ago', usedBy: ['Production Scheduling', 'Capacity Planning'] },
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
      { id: 'd1', name: 'SAP_MasterData_7Divisions.api', type: 'api', origin: 'SAP S/4HANA Cloud — All Instances', size: '—', status: 'ready', fields: 142000, confidence: 98 },
      { id: 'd2', name: 'IoT_SensorStream_6Plants.stream', type: 'api', origin: 'Siemens Xcelerator Gateway', size: '—', status: 'ready', fields: 84000, confidence: 99 },
      { id: 'd3', name: 'Supplier_Contracts_2026.pdf', type: 'pdf', origin: 'SharePoint — Corporate Procurement', size: '248 MB', status: 'processing', fields: 4200, confidence: 92 },
      { id: 'd4', name: 'Consolidated_Financials_Q4.xlsx', type: 'spreadsheet', origin: 'Workday Financial Mgmt', size: '34 MB', status: 'ready', fields: 48000, confidence: 97 },
      { id: 'd5', name: 'CrossDivision_Inventory_Daily.csv', type: 'csv', origin: 'SAP Inventory Module — All Plants', size: '82 MB', status: 'ready', fields: 24800, confidence: 96 },
      { id: 'd6', name: 'Palantir_Analytics_Export.api', type: 'api', origin: 'Palantir Foundry', size: '—', status: 'ready', fields: 62000, confidence: 98 },
      { id: 'd7', name: 'Workforce_Data_Global.api', type: 'api', origin: 'Workday HCM', size: '—', status: 'ready', fields: 42000, confidence: 99 },
      { id: 'd8', name: 'ServiceNow_Tickets_AllDivisions.api', type: 'api', origin: 'ServiceNow REST API', size: '—', status: 'ready', fields: 18400, confidence: 97 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Cross-Division Procurement', description: 'Unified supplier master + PO history + price benchmarks + volume discounts + contract terms across 7 divisions', sources: 8, fields: 84000, freshness: 'Hourly', status: 'ready', lastUpdated: '12 min ago', usedBy: ['Cross-Division Procurement Consolidation'] },
      { id: 'cp2', name: 'Predictive Maintenance', description: 'IoT sensor baselines + maintenance history + OEM specs + part lifecycle + operator logs across 6 plants', sources: 6, fields: 124000, freshness: 'Real-time', status: 'ready', lastUpdated: '1 min ago', usedBy: ['Predictive Maintenance — Industrial Fleet'] },
      { id: 'cp3', name: 'Financial Consolidation', description: 'Chart of accounts + intercompany agreements + FX rates + elimination rules + audit standards', sources: 5, fields: 48000, freshness: 'Daily', status: 'building', lastUpdated: '8 min ago', usedBy: ['Financial Close Automation'] },
      { id: 'cp4', name: 'Workforce Analytics', description: 'Employee master + skills matrix + utilization rates + training records + attrition data across 42K employees', sources: 4, fields: 42000, freshness: 'Daily', status: 'ready', lastUpdated: '4 hrs ago', usedBy: ['Workforce Optimization', 'Adoption Tracking'] },
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
      { id: 'd1', name: 'XRoad_DataFeed_AllMinistries.api', type: 'api', origin: 'X-Road 7.0 Security Server', size: '—', status: 'ready', fields: 248000, confidence: 99 },
      { id: 'd2', name: 'EMTA_TaxFilings_2026Q1.api', type: 'api', origin: 'Tax & Revenue Board (EMTA)', size: '—', status: 'ready', fields: 142000, confidence: 98 },
      { id: 'd3', name: 'TEHIK_HealthRecords_Batch.api', type: 'api', origin: 'TEHIK — Health Information System', size: '—', status: 'ready', fields: 84000, confidence: 97 },
      { id: 'd4', name: 'Population_Registry_Feed.api', type: 'api', origin: 'Population Registry (RR)', size: '—', status: 'ready', fields: 62000, confidence: 99 },
      { id: 'd5', name: 'eResidency_Applications.csv', type: 'csv', origin: 'e-Residency Program Portal', size: '24 MB', status: 'ready', fields: 18400, confidence: 96 },
      { id: 'd6', name: 'Budget_Documents_2026.pdf', type: 'pdf', origin: 'Ministry of Finance', size: '142 MB', status: 'processing', fields: 4800, confidence: 94 },
      { id: 'd7', name: 'Social_Insurance_Records.api', type: 'api', origin: 'Social Insurance Board (SKA)', size: '—', status: 'ready', fields: 94000, confidence: 98 },
      { id: 'd8', name: 'Employment_Board_Data.api', type: 'api', origin: 'Estonian Unemployment Insurance Fund', size: '—', status: 'ready', fields: 28000, confidence: 97 },
    ],
    contextPacks: [
      { id: 'cp1', name: 'Citizen Services', description: 'Population registry + benefit history + employment status + family data + residence permits via X-Road', sources: 6, fields: 148000, freshness: 'Real-time', status: 'ready', lastUpdated: '2 min ago', usedBy: ['Citizen Benefits Eligibility Engine'] },
      { id: 'cp2', name: 'Tax Intelligence', description: 'Income declarations + employer reports + property transactions + bank interest + VAT returns', sources: 5, fields: 142000, freshness: 'Daily', status: 'ready', lastUpdated: '1 hr ago', usedBy: ['Tax Return Auto-Assessment'] },
      { id: 'cp3', name: 'Healthcare', description: 'Patient records + prescriptions + lab results + provider directory + insurance coverage via TEHIK', sources: 4, fields: 84000, freshness: 'Real-time', status: 'ready', lastUpdated: '5 min ago', usedBy: ['Healthcare Records Integration'] },
      { id: 'cp4', name: 'Cross-Ministry Analytics', description: 'Budget execution + procurement data + performance indicators + policy impact metrics across all ministries', sources: 8, fields: 62000, freshness: 'Weekly', status: 'building', lastUpdated: '2 days ago', usedBy: ['Cross-Ministry Data Platform', 'Policy Impact Analysis'] },
    ],
  },
};

/* ── Components ──────────────────────────────────────────── */

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  legacy: Server,
  api: Database,
  scan: FileImage,
  spreadsheet: FileSpreadsheet,
};

const statusStyles: Record<string, { color: string; label: string }> = {
  ingested: { color: 'text-ink-tertiary', label: 'Ingested' },
  processing: { color: 'text-blue', label: 'Processing' },
  ready: { color: 'text-green', label: 'Ready' },
  failed: { color: 'text-red', label: 'Failed' },
};

function DocumentRow({ doc }: { doc: SourceDocument }) {
  const Icon = typeIcons[doc.type] || FileText;
  const st = statusStyles[doc.status];

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border-subtle last:border-0 hover:bg-surface-sunken/40 transition-colors">
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
}

function ContextPackCard({ pack }: { pack: ContextPack }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = pack.status === 'ready' ? 'bg-green' : pack.status === 'building' ? 'bg-blue' : 'bg-amber';

  return (
    <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 hover:bg-surface-sunken/40 transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 p-1.5 rounded-lg bg-blue-muted flex-shrink-0">
              <Package className="w-4 h-4 text-blue" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-ink">{pack.name}</h3>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColor} ${pack.status === 'building' ? 'animate-pulse-live' : ''}`} />
              </div>
              <p className="text-[12px] text-ink-secondary mt-0.5 line-clamp-1">{pack.description}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-ink-tertiary flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>

        <div className="flex items-center gap-4 mt-3 ml-10">
          <span className="text-[11px] text-ink-tertiary"><strong className="text-ink font-medium">{pack.sources}</strong> sources</span>
          <span className="text-[11px] text-ink-tertiary"><strong className="text-ink font-medium">{pack.fields.toLocaleString()}</strong> fields</span>
          <span className="text-[11px] text-ink-tertiary">Updated {pack.lastUpdated}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            pack.freshness === 'Real-time' ? 'text-green bg-green-muted' : 'text-ink-tertiary bg-surface-sunken'
          }`}>{pack.freshness}</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-border-subtle pt-3">
              <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Used by workflows</div>
              <div className="flex flex-wrap gap-1.5">
                {pack.usedBy.map((w) => (
                  <span key={w} className="text-[11px] text-ink-secondary px-2 py-1 rounded-md bg-surface-sunken border border-border-subtle">{w}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function ContextPipeline() {
  const { company } = useCompany();
  const data = pipelineData[company.id] || pipelineData.meridian;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Context Pipeline</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Data flowing in, getting cleaned, normalized, and packaged into AI-ready Context Packs</p>
      </div>

      {/* Pipeline stages visualization */}
      <div className="mb-8 p-5 bg-surface-raised border border-border rounded-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          {data.stages.map((stage, i) => (
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
              {i < data.stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-ink-faint mx-2 flex-shrink-0" strokeWidth={1.5} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-border text-center">
          <div className="text-[18px] font-semibold tabular-nums text-ink">{data.stats.ingested.toLocaleString()}</div>
          <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Ingested</div>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-border text-center">
          <div className="text-[18px] font-semibold tabular-nums text-ink">{data.stats.normalized.toLocaleString()}</div>
          <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Normalized</div>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-border text-center">
          <div className="text-[18px] font-semibold tabular-nums text-green">{data.stats.packed}</div>
          <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Context Packs</div>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-surface-raised border border-border text-center">
          <div className="text-[18px] font-semibold tabular-nums text-red">{data.stats.failed}</div>
          <div className="text-[10px] text-ink-tertiary font-medium mt-0.5">Failed</div>
        </div>
      </div>

      {/* Two sections: Documents and Context Packs */}
      <div className="space-y-8">
        {/* Source Documents */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">Source Documents</h2>
            <span className="text-[11px] text-ink-tertiary tabular-nums">{data.documents.length} documents</span>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
            {data.documents.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        </section>

        {/* Context Packs */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">Context Packs</h2>
            <span className="text-[11px] text-ink-tertiary">AI-ready knowledge bundles</span>
          </div>
          <div className="space-y-3">
            {data.contextPacks.map((pack) => (
              <ContextPackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
