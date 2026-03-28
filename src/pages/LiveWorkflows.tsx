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
import { useCompany, companies } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';
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
      { label: 'Ingestion', count: 4280, status: 'active' },
      { label: 'Normalization', count: 4120, status: 'active' },
      { label: 'Entity Resolution', count: 3980, status: 'active' },
      { label: 'Context Packing', count: 18, status: 'active' },
    ],
    stats: { ingested: 4280, normalized: 4120, packed: 18, failed: 12 },
    documents: [
      { id: 'd1', name: 'TrackGeometry_NEC_Segment-47.csv', type: 'csv', origin: 'RailSentry LIDAR Export \u2014 Northeast Corridor', size: '48 MB', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd2', name: 'GPS_Ballast_Fleet_Q1.api', type: 'api', origin: 'GPS Ballast Train Telemetry API', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd3', name: 'FRA_Compliance_Inspection_2026-03.pdf', type: 'pdf', origin: 'FRA Track Safety Standards Portal', size: '4.8 MB', status: 'processing', fields: 86, confidence: 94 },
      { id: 'd4', name: 'CrewDispatch_Midwest_Division.xlsx', type: 'spreadsheet', origin: 'HRSI Dispatch System Export', size: '12.4 MB', status: 'ready', fields: 3200, confidence: 97 },
      { id: 'd5', name: 'PTC_Signal_Logs_HTI-0312.api', type: 'api', origin: 'Positive Train Control Signal System', size: '\u2014', status: 'ready', fields: 24800, confidence: 99 },
      { id: 'd6', name: 'VideoTrackChart_Segment_NE-22.scan', type: 'scan', origin: 'HSI Video Track Chart System', size: '2.4 GB', status: 'processing', fields: 420, confidence: 91 },
    ],
  },
  hcc: {
    stages: [
      { label: 'Ingestion', count: 1840, status: 'active' },
      { label: 'Normalization', count: 1780, status: 'active' },
      { label: 'Entity Resolution', count: 1720, status: 'active' },
      { label: 'Context Packing', count: 8, status: 'active' },
    ],
    stats: { ingested: 1840, normalized: 1780, packed: 8, failed: 4 },
    documents: [
      { id: 'd1', name: 'HeavyJob_DailyLogs_I70.csv', type: 'csv', origin: 'HCSS HeavyJob — I-70 Rehabilitation', size: '24 MB', status: 'ready', fields: 4200, confidence: 97 },
      { id: 'd2', name: 'Primavera_Schedule_Q1.api', type: 'api', origin: 'Primavera P6 — Project Controls', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd3', name: 'Samsara_Fleet_GPS_Daily.api', type: 'api', origin: 'Samsara GPS Fleet Tracking', size: '\u2014', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd4', name: 'SAP_CostCenter_HCC.api', type: 'api', origin: 'SAP Financial Module', size: '\u2014', status: 'ready', fields: 6400, confidence: 98 },
      { id: 'd5', name: 'BridgeInspection_I70_Mar.pdf', type: 'pdf', origin: 'Structural Engineering Reports', size: '8.2 MB', status: 'processing', fields: 142, confidence: 94 },
      { id: 'd6', name: 'EquipmentMaint_CAT_Fleet.xlsx', type: 'spreadsheet', origin: 'Fleet Maintenance System', size: '4.8 MB', status: 'ready', fields: 2400, confidence: 96 },
    ],
  },
  hrsi: {
    stages: [
      { label: 'Ingestion', count: 980, status: 'active' },
      { label: 'Normalization', count: 940, status: 'active' },
      { label: 'Entity Resolution', count: 910, status: 'active' },
      { label: 'Context Packing', count: 4, status: 'active' },
    ],
    stats: { ingested: 980, normalized: 940, packed: 4, failed: 3 },
    documents: [
      { id: 'd1', name: 'GPS_Ballast_Fleet_Telemetry.api', type: 'api', origin: 'GPS Ballast Train Telemetry', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd2', name: 'CrewDispatch_Midwest.xlsx', type: 'spreadsheet', origin: 'HRSI Dispatch System', size: '12.4 MB', status: 'ready', fields: 3200, confidence: 97 },
      { id: 'd3', name: 'EquipmentTracker_BallastUnits.api', type: 'api', origin: 'Equipment Tracking System', size: '\u2014', status: 'ready', fields: 4800, confidence: 99 },
      { id: 'd4', name: 'SAP_PM_WorkOrders.api', type: 'api', origin: 'SAP Plant Maintenance', size: '\u2014', status: 'ready', fields: 2400, confidence: 96 },
      { id: 'd5', name: 'TrackRenewal_Schedule_Q1.pdf', type: 'pdf', origin: 'Track Renewal Planning', size: '2.1 MB', status: 'ready', fields: 84, confidence: 95 },
      { id: 'd6', name: 'Kronos_CrewHours_HRSI.csv', type: 'csv', origin: 'Kronos Time & Attendance', size: '8.4 MB', status: 'ready', fields: 4200, confidence: 98 },
    ],
  },
  hsi: {
    stages: [
      { label: 'Ingestion', count: 1220, status: 'active' },
      { label: 'Normalization', count: 1180, status: 'active' },
      { label: 'Entity Resolution', count: 1140, status: 'active' },
      { label: 'Context Packing', count: 4, status: 'active' },
    ],
    stats: { ingested: 1220, normalized: 1180, packed: 4, failed: 2 },
    documents: [
      { id: 'd1', name: 'TAM4_Ultrasonic_NEC_Seg47.csv', type: 'csv', origin: 'TAM-4 Ultrasonic Test Car', size: '48 MB', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd2', name: 'LIDAR_RailProfile_MP280.api', type: 'api', origin: 'LIDAR Rail Profile Scanner', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd3', name: 'GPS_TestCar_Fleet.api', type: 'api', origin: 'GPS Fleet Tracking — Test Cars', size: '\u2014', status: 'ready', fields: 4800, confidence: 99 },
      { id: 'd4', name: 'VideoTrackChart_NE22.scan', type: 'scan', origin: 'Video Track Chart System', size: '2.4 GB', status: 'processing', fields: 420, confidence: 91 },
      { id: 'd5', name: 'FRA_DefectLog_Q1.pdf', type: 'pdf', origin: 'FRA Compliance Database', size: '4.2 MB', status: 'ready', fields: 248, confidence: 96 },
      { id: 'd6', name: 'RailSentry_Readings_Mar.api', type: 'api', origin: 'RailSentry LIDAR Export', size: '\u2014', status: 'ready', fields: 12400, confidence: 98 },
    ],
  },
  hti: {
    stages: [
      { label: 'Ingestion', count: 1640, status: 'active' },
      { label: 'Normalization', count: 1580, status: 'active' },
      { label: 'Entity Resolution', count: 1520, status: 'active' },
      { label: 'Context Packing', count: 5, status: 'active' },
    ],
    stats: { ingested: 1640, normalized: 1580, packed: 5, failed: 3 },
    documents: [
      { id: 'd1', name: 'PTC_Signal_Logs_Zone12.api', type: 'api', origin: 'Positive Train Control System', size: '\u2014', status: 'ready', fields: 24800, confidence: 99 },
      { id: 'd2', name: 'Wayside_Device_Telemetry.api', type: 'api', origin: 'Wayside Equipment Monitoring', size: '\u2014', status: 'ready', fields: 14200, confidence: 98 },
      { id: 'd3', name: 'CAD_Signal_Designs_2026.pdf', type: 'pdf', origin: 'Signal Design CAD Library', size: '18.4 MB', status: 'ready', fields: 420, confidence: 96 },
      { id: 'd4', name: 'FiberOptic_OTDR_Results.csv', type: 'csv', origin: 'Fiber Optic Test Equipment', size: '8.4 MB', status: 'ready', fields: 4800, confidence: 97 },
      { id: 'd5', name: 'RadioSystem_Diagnostics.api', type: 'api', origin: 'Radio Communication System', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd6', name: 'SCADA_SignalControl.api', type: 'api', origin: 'SCADA Signal Control System', size: '\u2014', status: 'ready', fields: 12400, confidence: 99 },
    ],
  },
  htsi: {
    stages: [
      { label: 'Ingestion', count: 1120, status: 'active' },
      { label: 'Normalization', count: 1080, status: 'active' },
      { label: 'Entity Resolution', count: 1040, status: 'active' },
      { label: 'Context Packing', count: 4, status: 'active' },
    ],
    stats: { ingested: 1120, normalized: 1080, packed: 4, failed: 5 },
    documents: [
      { id: 'd1', name: 'Trapeze_OPS_Schedule.api', type: 'api', origin: 'Trapeze Operations Planning', size: '\u2014', status: 'ready', fields: 8400, confidence: 98 },
      { id: 'd2', name: 'VehicleTracking_Fleet.api', type: 'api', origin: 'Vehicle Tracking System', size: '\u2014', status: 'ready', fields: 14200, confidence: 99 },
      { id: 'd3', name: 'Ridership_Analytics_Daily.csv', type: 'csv', origin: 'Ridership Analytics Platform', size: '12 MB', status: 'ready', fields: 4800, confidence: 97 },
      { id: 'd4', name: 'FareCollection_Revenue.api', type: 'api', origin: 'Fare Collection System', size: '\u2014', status: 'ready', fields: 6400, confidence: 98 },
      { id: 'd5', name: 'Kronos_CrewHours_HTSI.csv', type: 'csv', origin: 'Kronos Time & Attendance', size: '8.4 MB', status: 'ready', fields: 3200, confidence: 97 },
      { id: 'd6', name: 'MaintenanceDB_FleetHealth.api', type: 'api', origin: 'Fleet Maintenance Database', size: '\u2014', status: 'processing', fields: 2400, confidence: 94 },
    ],
  },
  he: {
    stages: [
      { label: 'Ingestion', count: 480, status: 'active' },
      { label: 'Normalization', count: 460, status: 'active' },
      { label: 'Entity Resolution', count: 440, status: 'active' },
      { label: 'Context Packing', count: 2, status: 'active' },
    ],
    stats: { ingested: 480, normalized: 460, packed: 2, failed: 1 },
    documents: [
      { id: 'd1', name: 'SCADA_SolarArray_Daily.api', type: 'api', origin: 'SCADA Solar Monitoring', size: '\u2014', status: 'ready', fields: 4800, confidence: 99 },
      { id: 'd2', name: 'WeatherAPI_SiteForecasts.api', type: 'api', origin: 'Weather Forecast API', size: '\u2014', status: 'ready', fields: 2400, confidence: 98 },
      { id: 'd3', name: 'SAP_PM_Energy_Assets.api', type: 'api', origin: 'SAP Plant Maintenance', size: '\u2014', status: 'ready', fields: 1200, confidence: 96 },
      { id: 'd4', name: 'SolarPanel_Performance.csv', type: 'csv', origin: 'Solar Monitoring Platform', size: '4.2 MB', status: 'ready', fields: 2400, confidence: 97 },
    ],
  },
  gg: {
    stages: [
      { label: 'Ingestion', count: 320, status: 'active' },
      { label: 'Normalization', count: 310, status: 'active' },
      { label: 'Entity Resolution', count: 300, status: 'active' },
      { label: 'Context Packing', count: 2, status: 'active' },
    ],
    stats: { ingested: 320, normalized: 310, packed: 2, failed: 1 },
    documents: [
      { id: 'd1', name: 'EPA_ComplianceDB_Q1.api', type: 'api', origin: 'EPA Compliance Database', size: '\u2014', status: 'ready', fields: 2400, confidence: 98 },
      { id: 'd2', name: 'LabResults_WaterQuality.csv', type: 'csv', origin: 'Lab Information Mgmt System', size: '4.8 MB', status: 'ready', fields: 1200, confidence: 97 },
      { id: 'd3', name: 'WetlandMonitoring_Site7.api', type: 'api', origin: 'Wetland Monitoring Sensors', size: '\u2014', status: 'ready', fields: 840, confidence: 96 },
      { id: 'd4', name: 'Remediation_Progress_Mar.pdf', type: 'pdf', origin: 'Remediation Project Reports', size: '2.1 MB', status: 'processing', fields: 84, confidence: 93 },
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
      { id: 'd1', name: 'SAP_MasterData_7Divisions.api', type: 'api', origin: 'SAP S/4HANA Cloud \u2014 All Instances', size: '\u2014', status: 'ready', fields: 142000, confidence: 98 },
      { id: 'd2', name: 'IoT_SensorStream_6Plants.stream', type: 'api', origin: 'Siemens Xcelerator Gateway', size: '\u2014', status: 'ready', fields: 84000, confidence: 99 },
      { id: 'd3', name: 'Supplier_Contracts_2026.pdf', type: 'pdf', origin: 'SharePoint \u2014 Corporate Procurement', size: '248 MB', status: 'processing', fields: 4200, confidence: 92 },
      { id: 'd4', name: 'Consolidated_Financials_Q4.xlsx', type: 'spreadsheet', origin: 'Workday Financial Mgmt', size: '34 MB', status: 'ready', fields: 48000, confidence: 97 },
      { id: 'd5', name: 'CrossDivision_Inventory_Daily.csv', type: 'csv', origin: 'SAP Inventory Module \u2014 All Plants', size: '82 MB', status: 'ready', fields: 24800, confidence: 96 },
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
  'nb-aerospace': {
    stages: [
      { label: 'Ingestion', count: 6420, status: 'active' },
      { label: 'Normalization', count: 6180, status: 'active' },
      { label: 'Entity Resolution', count: 6040, status: 'active' },
      { label: 'Context Packing', count: 8, status: 'active' },
    ],
    stats: { ingested: 6420, normalized: 6180, packed: 8, failed: 18 },
    documents: [
      { id: 'd1', name: 'FlightTest_Report_FT-2026-0441.pdf', type: 'pdf', origin: 'Flight Test Engineering', size: '18.4 MB', status: 'ready', fields: 248, confidence: 97 },
      { id: 'd2', name: 'Supplier_Cert_AS9100_Pratt.pdf', type: 'pdf', origin: 'Supplier Quality Portal', size: '2.1 MB', status: 'ready', fields: 84, confidence: 98 },
      { id: 'd3', name: 'MRO_MaintenanceLog_Tail-N842.csv', type: 'csv', origin: 'AMOS MRO System Export', size: '8.4 MB', status: 'ready', fields: 4200, confidence: 96 },
      { id: 'd4', name: 'Airworthiness_Directive_AD-2026-04.pdf', type: 'pdf', origin: 'FAA Airworthiness Database', size: '1.4 MB', status: 'processing', fields: 42, confidence: 94 },
      { id: 'd5', name: 'Engine_Telemetry_GE9X_Stream.api', type: 'api', origin: 'GE Digital Twin Platform', size: '—', status: 'ready', fields: 24800, confidence: 99 },
      { id: 'd6', name: 'NDI_Inspection_Results_Wing.scan', type: 'scan', origin: 'Ultrasonic NDI Scanner — Hangar 4', size: '4.8 MB', status: 'processing', fields: 128, confidence: 91 },
    ],
  },
  'nb-energy': {
    stages: [
      { label: 'Ingestion', count: 14980, status: 'active' },
      { label: 'Normalization', count: 14560, status: 'active' },
      { label: 'Entity Resolution', count: 14160, status: 'active' },
      { label: 'Context Packing', count: 6, status: 'active' },
    ],
    stats: { ingested: 14980, normalized: 14560, packed: 6, failed: 32 },
    documents: [
      { id: 'd1', name: 'SCADA_Readings_Pipeline_NE-7.api', type: 'api', origin: 'SCADA Gateway — Northeast Corridor', size: '—', status: 'ready', fields: 48000, confidence: 99 },
      { id: 'd2', name: 'Pipeline_Inspection_ILI-2026-03.pdf', type: 'pdf', origin: 'In-Line Inspection Vendor', size: '42 MB', status: 'processing', fields: 840, confidence: 93 },
      { id: 'd3', name: 'Grid_Monitoring_ERCOT_Feed.api', type: 'api', origin: 'ERCOT Grid Operations', size: '—', status: 'ready', fields: 84000, confidence: 98 },
      { id: 'd4', name: 'Wellhead_Pressure_Daily.csv', type: 'csv', origin: 'Field SCADA — Permian Basin', size: '24 MB', status: 'ready', fields: 12400, confidence: 97 },
      { id: 'd5', name: 'EPA_Compliance_Report_Q1.pdf', type: 'pdf', origin: 'Environmental Compliance System', size: '8.2 MB', status: 'ready', fields: 420, confidence: 96 },
      { id: 'd6', name: 'Transformer_Health_Index.xlsx', type: 'spreadsheet', origin: 'Asset Health Monitoring Platform', size: '14 MB', status: 'ready', fields: 6200, confidence: 95 },
    ],
  },
  'nb-financial': {
    stages: [
      { label: 'Ingestion', count: 18400, status: 'active' },
      { label: 'Normalization', count: 17900, status: 'active' },
      { label: 'Entity Resolution', count: 17200, status: 'active' },
      { label: 'Context Packing', count: 10, status: 'active' },
    ],
    stats: { ingested: 18400, normalized: 17900, packed: 10, failed: 68 },
    documents: [
      { id: 'd1', name: 'TradeConfirm_FX_Batch_0321.pdf', type: 'pdf', origin: 'Bloomberg TOMS', size: '4.2 MB', status: 'ready', fields: 2400, confidence: 98 },
      { id: 'd2', name: 'SEC_Filing_10K_2025.pdf', type: 'pdf', origin: 'EDGAR Filing System', size: '28 MB', status: 'ready', fields: 4800, confidence: 97 },
      { id: 'd3', name: 'AML_SuspiciousActivity_Q1.csv', type: 'csv', origin: 'AML Monitoring Platform', size: '12 MB', status: 'processing', fields: 8400, confidence: 94 },
      { id: 'd4', name: 'OCC_RegExam_Response.pdf', type: 'pdf', origin: 'Regulatory Affairs Portal', size: '14 MB', status: 'ready', fields: 1200, confidence: 96 },
      { id: 'd5', name: 'RiskCalc_CreditModel_Feed.api', type: 'api', origin: 'Moody\'s Analytics RiskCalc', size: '—', status: 'ready', fields: 24000, confidence: 99 },
      { id: 'd6', name: 'KYC_EntityScreening_Batch.api', type: 'api', origin: 'Refinitiv World-Check', size: '—', status: 'ready', fields: 14200, confidence: 98 },
    ],
  },
  'nb-health': {
    stages: [
      { label: 'Ingestion', count: 8400, status: 'active' },
      { label: 'Normalization', count: 8120, status: 'active' },
      { label: 'Entity Resolution', count: 7840, status: 'active' },
      { label: 'Context Packing', count: 5, status: 'active' },
    ],
    stats: { ingested: 8400, normalized: 8120, packed: 5, failed: 24 },
    documents: [
      { id: 'd1', name: 'ClinicalTrial_Phase3_NB-4412.csv', type: 'csv', origin: 'Medidata Rave EDC', size: '42 MB', status: 'ready', fields: 24800, confidence: 98 },
      { id: 'd2', name: 'BatchRecord_API_Lot-2026-0847.pdf', type: 'pdf', origin: 'MES — Dublin Manufacturing', size: '8.4 MB', status: 'processing', fields: 420, confidence: 95 },
      { id: 'd3', name: 'FDA_510k_Submission_Draft.pdf', type: 'pdf', origin: 'Regulatory Affairs — FDA Team', size: '124 MB', status: 'ready', fields: 2400, confidence: 96 },
      { id: 'd4', name: 'Adverse_Event_Reports_Q1.api', type: 'api', origin: 'FDA FAERS Database', size: '—', status: 'ready', fields: 14200, confidence: 97 },
      { id: 'd5', name: 'QC_LabResults_Stability.xlsx', type: 'spreadsheet', origin: 'LIMS — Quality Control Lab', size: '18 MB', status: 'ready', fields: 8400, confidence: 99 },
      { id: 'd6', name: 'GMP_Audit_Findings_2026.pdf', type: 'pdf', origin: 'Quality Assurance Portal', size: '4.2 MB', status: 'ready', fields: 148, confidence: 94 },
    ],
  },
  'ee-finance': {
    stages: [
      { label: 'Ingestion', count: 24800, status: 'active' },
      { label: 'Normalization', count: 24200, status: 'active' },
      { label: 'Entity Resolution', count: 23600, status: 'active' },
      { label: 'Context Packing', count: 6, status: 'active' },
    ],
    stats: { ingested: 24800, normalized: 24200, packed: 6, failed: 8 },
    documents: [
      { id: 'd1', name: 'EMTA_TaxReturns_Individual_Q1.api', type: 'api', origin: 'Tax & Revenue Board (EMTA)', size: '—', status: 'ready', fields: 84000, confidence: 99 },
      { id: 'd2', name: 'State_Budget_Execution_2026.pdf', type: 'pdf', origin: 'Ministry of Finance Portal', size: '48 MB', status: 'ready', fields: 4200, confidence: 96 },
      { id: 'd3', name: 'Fiscal_Audit_StateEntities.pdf', type: 'pdf', origin: 'National Audit Office (Riigikontroll)', size: '84 MB', status: 'processing', fields: 2400, confidence: 94 },
      { id: 'd4', name: 'VAT_Declarations_Monthly.csv', type: 'csv', origin: 'EMTA e-Services', size: '28 MB', status: 'ready', fields: 42000, confidence: 98 },
      { id: 'd5', name: 'Customs_Revenue_Feed.api', type: 'api', origin: 'Tax & Customs Board', size: '—', status: 'ready', fields: 24800, confidence: 97 },
      { id: 'd6', name: 'Municipal_Budget_Reports.xlsx', type: 'spreadsheet', origin: 'Local Government Financial Portal', size: '18 MB', status: 'ready', fields: 8400, confidence: 95 },
    ],
  },
  'ee-social': {
    stages: [
      { label: 'Ingestion', count: 18200, status: 'active' },
      { label: 'Normalization', count: 17800, status: 'active' },
      { label: 'Entity Resolution', count: 17200, status: 'active' },
      { label: 'Context Packing', count: 4, status: 'active' },
    ],
    stats: { ingested: 18200, normalized: 17800, packed: 4, failed: 10 },
    documents: [
      { id: 'd1', name: 'BenefitApplications_Family_Q1.api', type: 'api', origin: 'Social Insurance Board (SKA)', size: '—', status: 'ready', fields: 48000, confidence: 98 },
      { id: 'd2', name: 'TEHIK_HealthRecords_PatientBatch.api', type: 'api', origin: 'TEHIK — Health Information System', size: '—', status: 'ready', fields: 62000, confidence: 97 },
      { id: 'd3', name: 'CaseFile_ChildWelfare_2026.pdf', type: 'pdf', origin: 'Child Protection Registry', size: '12 MB', status: 'processing', fields: 840, confidence: 92 },
      { id: 'd4', name: 'Disability_Assessments_Q1.csv', type: 'csv', origin: 'Social Insurance Board (SKA)', size: '8.4 MB', status: 'ready', fields: 14200, confidence: 96 },
      { id: 'd5', name: 'Pension_Eligibility_Feed.api', type: 'api', origin: 'Pension Registry', size: '—', status: 'ready', fields: 24800, confidence: 99 },
      { id: 'd6', name: 'Unemployment_Claims_Weekly.csv', type: 'csv', origin: 'Unemployment Insurance Fund (KELA)', size: '4.2 MB', status: 'ready', fields: 8400, confidence: 97 },
    ],
  },
  'ee-economic': {
    stages: [
      { label: 'Ingestion', count: 12400, status: 'active' },
      { label: 'Normalization', count: 12100, status: 'active' },
      { label: 'Entity Resolution', count: 11800, status: 'active' },
      { label: 'Context Packing', count: 5, status: 'active' },
    ],
    stats: { ingested: 12400, normalized: 12100, packed: 5, failed: 6 },
    documents: [
      { id: 'd1', name: 'TradePermits_Export_Q1.api', type: 'api', origin: 'Ministry of Economic Affairs', size: '—', status: 'ready', fields: 24000, confidence: 98 },
      { id: 'd2', name: 'BusinessRegistry_NewEntities.api', type: 'api', origin: 'Centre of Registers (RIK)', size: '—', status: 'ready', fields: 42000, confidence: 99 },
      { id: 'd3', name: 'eResidency_Applications_March.csv', type: 'csv', origin: 'e-Residency Program Portal', size: '14 MB', status: 'ready', fields: 8400, confidence: 96 },
      { id: 'd4', name: 'EU_Structural_Funds_Report.pdf', type: 'pdf', origin: 'State Shared Service Centre', size: '24 MB', status: 'processing', fields: 1200, confidence: 93 },
      { id: 'd5', name: 'Fleet_Management_Reports.pdf', type: 'pdf', origin: 'Herzog Fleet Management System', size: '8.4 MB', status: 'ready', fields: 420, confidence: 95 },
      { id: 'd6', name: 'Division_Ops_Submissions.xlsx', type: 'spreadsheet', origin: 'Division Operations Portal', size: '4.8 MB', status: 'ready', fields: 2400, confidence: 97 },
    ],
  },
  'ee-ria': {
    stages: [
      { label: 'Ingestion', count: 28800, status: 'active' },
      { label: 'Normalization', count: 28200, status: 'active' },
      { label: 'Entity Resolution', count: 27600, status: 'active' },
      { label: 'Context Packing', count: 7, status: 'active' },
    ],
    stats: { ingested: 28800, normalized: 28200, packed: 7, failed: 4 },
    documents: [
      { id: 'd1', name: 'SecurityIncident_CERT-EE_Q1.csv', type: 'csv', origin: 'CERT-EE Incident Tracker', size: '4.2 MB', status: 'ready', fields: 2400, confidence: 97 },
      { id: 'd2', name: 'XRoad_Traffic_Analytics_Daily.api', type: 'api', origin: 'X-Road Monitoring — RIA', size: '—', status: 'ready', fields: 142000, confidence: 99 },
      { id: 'd3', name: 'VulnScan_GovInfra_March.csv', type: 'csv', origin: 'RIA Vulnerability Scanner', size: '18 MB', status: 'processing', fields: 8400, confidence: 94 },
      { id: 'd4', name: 'DDoS_Mitigation_Log_Q1.api', type: 'api', origin: 'RIA Cyber Defence Centre', size: '—', status: 'ready', fields: 48000, confidence: 98 },
      { id: 'd5', name: 'eID_Auth_AuditTrail.api', type: 'api', origin: 'SK ID Solutions — eID Platform', size: '—', status: 'ready', fields: 84000, confidence: 99 },
      { id: 'd6', name: 'Penetration_Test_Report_Gov.pdf', type: 'pdf', origin: 'RIA Red Team — Classified', size: '24 MB', status: 'ready', fields: 248, confidence: 96 },
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
    { id: 'VL-2026-0847', workflow: 'Track Geometry Analysis \u2014 NEC Segment 47', type: 'correction', timestamp: '3 min ago', corrected: 'MP 144.8: Cross-level 1.82\u2033 \u2014 reclassified Urgent per FRA 49 CFR \u00a7213.63' },
    { id: 'VL-2026-0846', workflow: 'Crew Dispatch Optimization \u2014 Midwest', type: 'escalation', timestamp: '18 min ago', corrected: 'Crew #MW-34: Start shifted to 7:30 AM \u2014 FRA HOS 10-hour rest required (49 CFR \u00a7228)' },
    { id: 'VL-2026-0845', workflow: 'Equipment Utilization Report \u2014 Q1', type: 'approval', timestamp: '32 min ago', corrected: 'GPS Ballast Train #BT-18: Utilization 34%, recommend redeployment to BNSF Southwest window' },
  ],
  hcc: [
    { id: 'VL-2026-0901', workflow: 'Bridge Load Analysis \u2014 I-70 Rehabilitation', type: 'correction', timestamp: '2 min ago', corrected: 'Bearing pad compression 16.2% \u2014 reclassified to Priority 1 replacement per AASHTO LRFD' },
    { id: 'VL-2026-0902', workflow: 'Equipment Utilization \u2014 Excavator Fleet', type: 'flag', timestamp: '14 min ago', corrected: 'CAT 349F #E22: idle 68% over 14 days. Recommend redeployment to Highway 65 project.' },
    { id: 'VL-2026-0903', workflow: 'Project Cost Tracking \u2014 I-70 Phase 2', type: 'approval', timestamp: '28 min ago', corrected: 'Monthly burn rate $1.2M within 3% of forecast. No variance escalation needed.' },
  ],
  hrsi: [
    { id: 'VL-2026-0904', workflow: 'Ballast Train Deployment \u2014 BNSF Southwest', type: 'correction', timestamp: '5 min ago', corrected: 'GPS Ballast Train #BT-18: route adjusted for track window change \u2014 arrival delayed 4 hours' },
    { id: 'VL-2026-0905', workflow: 'Crew HOS Compliance \u2014 Midwest', type: 'escalation', timestamp: '22 min ago', corrected: 'Crew #MW-34: 8.5 hours into shift, projected to exceed 12hr limit. Relief crew dispatched.' },
    { id: 'VL-2026-0906', workflow: 'Equipment Maintenance \u2014 Unit 4402', type: 'approval', timestamp: '41 min ago', corrected: 'Scheduled service at 4,800 hours. Parts confirmed in stock. April 2 maintenance window.' },
  ],
  hsi: [
    { id: 'VL-2026-0907', workflow: 'Rail Defect Classification \u2014 NEC Seg 47', type: 'correction', timestamp: '3 min ago', corrected: 'MP 312.4: transverse defect confirmed via manual hand test. Rail replacement ordered.' },
    { id: 'VL-2026-0908', workflow: 'Test Car Calibration \u2014 TAM-4 Unit', type: 'approval', timestamp: '18 min ago', corrected: 'Calibration check passed. All 12 ultrasonic channels within 0.5dB of reference.' },
    { id: 'VL-2026-0909', workflow: 'FRA Compliance Report \u2014 Q1 Testing', type: 'flag', timestamp: '35 min ago', corrected: '3 segments below minimum testing frequency. Priority scheduling needed for MP 140-155.' },
  ],
  hti: [
    { id: 'VL-2026-0910', workflow: 'PTC Wayside Device Health \u2014 Zone 12', type: 'flag', timestamp: '4 min ago', corrected: 'WD-4472 communication latency 180ms (limit 200ms). Trending upward. Antenna inspection recommended.' },
    { id: 'VL-2026-0911', workflow: 'Signal System Firmware Update \u2014 Zone 8', type: 'approval', timestamp: '16 min ago', corrected: 'Firmware v4.2.1 validated on 12 units. All responding within spec. Update approved.' },
    { id: 'VL-2026-0912', workflow: 'Fiber Optic Link Test \u2014 Corridor 14', type: 'correction', timestamp: '29 min ago', corrected: 'OTDR reading shows 0.8dB loss at splice point #47. Acceptable but added to monitoring list.' },
  ],
  htsi: [
    { id: 'VL-2026-0913', workflow: 'Service Schedule Optimization \u2014 Weekday', type: 'correction', timestamp: '6 min ago', corrected: 'Off-peak headway adjusted from 15min to 18min. Ridership data shows 22% below threshold.' },
    { id: 'VL-2026-0914', workflow: 'Crew Scheduling \u2014 Weekend Service', type: 'escalation', timestamp: '19 min ago', corrected: 'Concert event March 28 \u2014 ridership surge expected. Additional trainset and crew assigned.' },
    { id: 'VL-2026-0915', workflow: 'Vehicle Maintenance \u2014 Train #HTSI-44', type: 'approval', timestamp: '38 min ago', corrected: 'Brake inspection passed. All 8 cars within wear limits. Next inspection at 15,000 miles.' },
  ],
  he: [
    { id: 'VL-2026-0916', workflow: 'Solar Array Performance \u2014 Site 3', type: 'flag', timestamp: '8 min ago', corrected: 'Panel cluster B7 output 12% below expected. Possible soiling or degradation. Inspection ordered.' },
    { id: 'VL-2026-0917', workflow: 'Energy Production Forecast', type: 'approval', timestamp: '24 min ago', corrected: 'Weekly forecast within 4% of actual. Model accuracy trending upward.' },
    { id: 'VL-2026-0918', workflow: 'SCADA Alert Review', type: 'correction', timestamp: '42 min ago', corrected: 'Inverter #INV-22 temperature alert \u2014 caused by ambient conditions, not fault. Alert threshold adjusted.' },
  ],
  gg: [
    { id: 'VL-2026-0919', workflow: 'Wetland Compliance \u2014 Site 7 Quarterly', type: 'approval', timestamp: '12 min ago', corrected: 'All 14 parameters within EPA/state limits. Report auto-generated for submission.' },
    { id: 'VL-2026-0920', workflow: 'Water Quality Monitoring', type: 'flag', timestamp: '28 min ago', corrected: 'Dissolved oxygen at Site 7 trending downward \u2014 2.4mg/L above minimum. Added to watch list.' },
    { id: 'VL-2026-0921', workflow: 'Remediation Progress \u2014 Phase 2', type: 'correction', timestamp: '45 min ago', corrected: 'Soil sample results: contaminant levels reduced 34% vs baseline. On track for Phase 3.' },
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
    { id: 'VL-2026-1842', workflow: 'Cross-Division Procurement Consolidation', type: 'correction', timestamp: '2 min ago', corrected: 'Matched to existing vendor #VS-8841 "Titanium Metals Corporation" \u2014 active across 3 divisions' },
    { id: 'VL-2026-1843', workflow: 'Predictive Maintenance \u2014 Industrial Fleet', type: 'flag', timestamp: '8 min ago', corrected: 'Bearing vibration 3.1\u03c3 above baseline \u2014 replacement recommended within 72 hours' },
    { id: 'VL-2026-1844', workflow: 'Financial Close Automation', type: 'correction', timestamp: '14 min ago', corrected: 'Reclassified as intercompany loan \u2014 eliminated in consolidation per IFRS 10' },
  ],
  estonia: [
    { id: 'VL-2026-2201', workflow: 'Tax Return Auto-Assessment', type: 'correction', timestamp: '3 min ago', corrected: 'Deduction reduced to \u20ac2,800 \u2014 property registry shows apartment sold in August, 8 months eligible not 12' },
    { id: 'VL-2026-2202', workflow: 'Citizen Benefits Eligibility Engine', type: 'flag', timestamp: '7 min ago', corrected: 'Income mismatch \u2014 Tax Board reports \u20ac42,000 vs Social Insurance \u20ac28,000. Benefit suspended pending investigation.' },
    { id: 'VL-2026-2203', workflow: 'Healthcare Records Integration', type: 'correction', timestamp: '18 min ago', corrected: 'Mapped to ICD-10-EE code J06.9 with Estonian clinical modifier' },
  ],
  'nb-aerospace': [
    { id: 'VL-2026-2301', workflow: 'Flight Test Data Verification', type: 'correction', timestamp: '4 min ago', corrected: 'Flutter onset speed corrected to Mach 0.82 — original telemetry had sensor calibration offset' },
    { id: 'VL-2026-2302', workflow: 'Supplier Certification Tracking', type: 'flag', timestamp: '12 min ago', corrected: 'AS9100D cert for supplier #SP-4412 expires in 14 days — renewal not yet filed with Nadcap' },
    { id: 'VL-2026-2303', workflow: 'Maintenance Log Reconciliation', type: 'escalation', timestamp: '22 min ago', corrected: 'Discrepancy: logbook shows engine wash at 2,400 hrs but AMOS records 2,200 hrs — requires QA review' },
  ],
  'nb-energy': [
    { id: 'VL-2026-2401', workflow: 'SCADA Anomaly Detection', type: 'flag', timestamp: '2 min ago', corrected: 'Pipeline pressure drop 18 PSI in 4 hours — exceeds PHMSA threshold. Leak detection protocol initiated.' },
    { id: 'VL-2026-2402', workflow: 'Pipeline Inspection Compliance', type: 'correction', timestamp: '9 min ago', corrected: 'Wall thickness reading corrected from 0.28" to 0.31" — ILI tool recalibration applied per ASME B31.8' },
    { id: 'VL-2026-2403', workflow: 'Grid Load Forecasting', type: 'escalation', timestamp: '16 min ago', corrected: 'ERCOT demand forecast revised up 8% — extreme heat advisory for West Texas through Friday' },
  ],
  'nb-financial': [
    { id: 'VL-2026-2501', workflow: 'Trade Confirmation Matching', type: 'correction', timestamp: '1 min ago', corrected: 'FX trade #TC-88421: settlement date corrected to T+2 (March 23) per CLS standard' },
    { id: 'VL-2026-2502', workflow: 'Regulatory Filing Validation', type: 'flag', timestamp: '8 min ago', corrected: 'SEC 10-K footnote 14: lease obligation understated by $4.2M — ASC 842 remeasurement required' },
    { id: 'VL-2026-2503', workflow: 'AML Transaction Screening', type: 'escalation', timestamp: '19 min ago', corrected: 'SAR filed — structuring pattern detected: 12 deposits of $9,800-$9,950 across 3 accounts in 48 hours' },
  ],
  'nb-health': [
    { id: 'VL-2026-2601', workflow: 'Clinical Trial Data Validation', type: 'correction', timestamp: '5 min ago', corrected: 'Patient #4412 BMI recalculated: 28.4 (not 24.8) — height entered in cm, not inches. Protocol deviation filed.' },
    { id: 'VL-2026-2602', workflow: 'Batch Record Review', type: 'flag', timestamp: '11 min ago', corrected: 'Lot 2026-0847: pH drift from 6.8 to 7.4 during hold time — exceeds validated range of 6.5-7.2' },
    { id: 'VL-2026-2603', workflow: 'FDA Submission Assembly', type: 'escalation', timestamp: '24 min ago', corrected: 'Module 2.7 clinical summary missing 3-month interim analysis — PDUFA date June 15, submission at risk' },
  ],
  'ee-finance': [
    { id: 'VL-2026-2701', workflow: 'Tax Return Auto-Assessment', type: 'correction', timestamp: '3 min ago', corrected: 'Self-employed income reclassified: €14,200 from Platform A not reported — cross-referenced with EMTA data' },
    { id: 'VL-2026-2702', workflow: 'Budget Execution Monitoring', type: 'flag', timestamp: '10 min ago', corrected: 'Ministry of Education Q1 spending at 34% of annual budget — 9% above projected trajectory' },
    { id: 'VL-2026-2703', workflow: 'Fiscal Audit Trail Verification', type: 'escalation', timestamp: '20 min ago', corrected: 'State enterprise dividend payment €2.4M recorded twice — duplicate entry in Treasury settlement system' },
  ],
  'ee-social': [
    { id: 'VL-2026-2801', workflow: 'Benefits Eligibility Processing', type: 'correction', timestamp: '2 min ago', corrected: 'Family benefit recalculated: 3rd child born Feb 2026, household now qualifies for large family supplement €420/month' },
    { id: 'VL-2026-2802', workflow: 'Health Records Cross-Linking', type: 'flag', timestamp: '8 min ago', corrected: 'Prescription conflict: patient prescribed warfarin and aspirin concurrently — interaction alert sent to GP' },
    { id: 'VL-2026-2803', workflow: 'Case File Assessment', type: 'escalation', timestamp: '15 min ago', corrected: 'Child welfare case #CW-2026-441: school absence threshold exceeded (18 days) — mandatory review triggered' },
  ],
  'ee-economic': [
    { id: 'VL-2026-2901', workflow: 'Trade Permit Processing', type: 'correction', timestamp: '4 min ago', corrected: 'Export permit #EP-8842: HS code corrected from 8471.30 to 8471.41 — dual-use screening re-triggered' },
    { id: 'VL-2026-2902', workflow: 'Business Registration Validation', type: 'flag', timestamp: '12 min ago', corrected: 'New OÜ registration: beneficial owner matches PEP list — enhanced due diligence required per EU AMLD6' },
    { id: 'VL-2026-2903', workflow: 'e-Residency Application Review', type: 'escalation', timestamp: '18 min ago', corrected: 'Applicant #eR-28441: address verification failed — registered address is a virtual office, policy requires physical presence confirmation' },
  ],
  'ee-ria': [
    { id: 'VL-2026-3001', workflow: 'Security Incident Triage', type: 'flag', timestamp: '1 min ago', corrected: 'CERT-EE alert: phishing campaign targeting gov.ee domains — 142 emails blocked, 3 clicked through, accounts locked' },
    { id: 'VL-2026-3002', workflow: 'X-Road Traffic Analysis', type: 'correction', timestamp: '6 min ago', corrected: 'Anomalous query volume from consumer "EMTA-prod-3": 48,000 queries/hr vs baseline 12,000 — legitimate batch job confirmed' },
    { id: 'VL-2026-3003', workflow: 'Vulnerability Assessment', type: 'escalation', timestamp: '14 min ago', corrected: 'CVE-2026-1847 (CVSS 9.1) affects 4 government web servers — critical patch deployment escalated to 24-hour SLA' },
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

  const hasOwnPipeline = !!pipelineData[company.id];
  const parentCompany = company.parentId ? companies.find((c) => c.id === company.parentId) : null;
  const pipeline = pipelineData[company.id] || (company.parentId ? pipelineData[company.parentId] : null) || pipelineData.meridian;
  const recentVerifications = miniLedgerData[company.id] || (company.parentId ? miniLedgerData[company.parentId] : null) || miniLedgerData.meridian;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {!hasOwnPipeline && parentCompany && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-muted border border-amber/20 text-[12px] text-amber font-medium">
          Showing {parentCompany.shortName} aggregate data — division-specific workflows not yet available.
        </div>
      )}
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Operations</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Live AI workflow execution — {company.employees.toLocaleString()} employees across {company.industry}</p>
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
