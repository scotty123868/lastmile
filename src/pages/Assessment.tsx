import { motion } from 'framer-motion';
import {
  Cpu,
  DollarSign,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCompany, companies } from '../data/CompanyContext';
import { COMMAND_CENTER_URL } from '../data/crosslinks';
import PreliminaryBanner from '../components/PreliminaryBanner';

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
      { name: 'RailSentry / LIDAR', category: 'Track Inspection', current: 5, target: 9 },
      { name: 'Wabtec PTC Platform', category: 'Signal & PTC', current: 4, target: 8 },
      { name: 'SAP ECC', category: 'ERP', current: 3, target: 7 },
      { name: 'Custom Dispatch System', category: 'Crew Ops', current: 2, target: 8 },
      { name: 'Trimble / GPS Fleet', category: 'Fleet Tracking', current: 5, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 4, target: 8 },
    ],
    licenses: [
      { vendor: 'SAP ECC', total: 420, active: 310, waste: 480000, action: 'Consolidate 4 division instances to single tenant' },
      { vendor: 'Trimble Fleet Manager', total: 380, active: 260, waste: 320000, action: 'Remove inactive vehicle licenses post-fleet audit' },
      { vendor: 'Microsoft 365 E5', total: 850, active: 680, waste: 280000, action: 'Downgrade 120 field accounts to F3 Frontline tier' },
      { vendor: 'Power BI Pro', total: 240, active: 145, waste: 190000, action: 'Convert 60 to Viewer-only; migrate 35 to shared capacity' },
    ],
  },
  hcc: {
    techStack: [
      { name: 'HCSS HeavyJob', category: 'Construction Mgmt', current: 6, target: 9 },
      { name: 'Primavera P6', category: 'Project Controls', current: 5, target: 8 },
      { name: 'SAP ECC', category: 'ERP', current: 3, target: 7 },
      { name: 'Samsara GPS', category: 'Fleet Tracking', current: 7, target: 9 },
      { name: 'Trimble Earthworks', category: 'Machine Control', current: 6, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 4, target: 8 },
    ],
    licenses: [
      { vendor: 'HCSS HeavyJob', total: 180, active: 142, waste: 76000, action: 'Remove inactive field licenses from completed projects' },
      { vendor: 'Primavera P6', total: 85, active: 62, waste: 92000, action: 'Downgrade 15 seats to viewer-only' },
      { vendor: 'Samsara', total: 220, active: 200, waste: 24000, action: 'Decommission 20 retired vehicle trackers' },
      { vendor: 'AutoCAD', total: 45, active: 28, waste: 68000, action: 'Consolidate with HTI shared license pool' },
    ],
  },
  hrsi: {
    techStack: [
      { name: 'GPS Ballast Train System', category: 'Equipment Control', current: 7, target: 9 },
      { name: 'SAP Plant Maintenance', category: 'Maintenance', current: 4, target: 8 },
      { name: 'Kronos / UKG', category: 'Workforce Mgmt', current: 6, target: 8 },
      { name: 'Custom Dispatch System', category: 'Crew Ops', current: 3, target: 8 },
      { name: 'Equipment Tracker', category: 'Asset Mgmt', current: 5, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'SAP PM Module', total: 65, active: 48, waste: 34000, action: 'Consolidate with HCC SAP instance' },
      { vendor: 'Kronos / UKG', total: 140, active: 129, waste: 11000, action: 'Remove inactive seasonal workers' },
      { vendor: 'Equipment Tracker', total: 80, active: 68, waste: 18000, action: 'Migrate 12 unused mobile licenses' },
    ],
  },
  hsi: {
    techStack: [
      { name: 'RailSentry LIDAR', category: 'Track Inspection', current: 8, target: 9 },
      { name: 'Video Track Chart', category: 'Visual Inspection', current: 6, target: 8 },
      { name: 'TAM-4 Ultrasonic', category: 'Rail Testing', current: 7, target: 9 },
      { name: 'FRA Compliance Portal', category: 'Regulatory', current: 5, target: 8 },
      { name: 'GIS Mapping', category: 'Geospatial', current: 4, target: 8 },
      { name: 'Power BI', category: 'Analytics', current: 4, target: 7 },
    ],
    licenses: [
      { vendor: 'RailSentry Software', total: 24, active: 22, waste: 8000, action: 'Align licenses to active geometry car count' },
      { vendor: 'ESRI ArcGIS', total: 18, active: 10, waste: 32000, action: 'Migrate field staff to ArcGIS Online tier' },
      { vendor: 'FRA Portal Access', total: 40, active: 34, waste: 12000, action: 'Remove departed analyst accounts' },
    ],
  },
  hti: {
    techStack: [
      { name: 'Wabtec PTC Platform', category: 'Signal & PTC', current: 7, target: 9 },
      { name: 'SCADA Signal Control', category: 'Signal Monitoring', current: 6, target: 9 },
      { name: 'AutoCAD / MicroStation', category: 'Design', current: 5, target: 8 },
      { name: 'Fiber Optic OTDR', category: 'Testing', current: 7, target: 8 },
      { name: 'Radio System Diagnostics', category: 'Communications', current: 6, target: 8 },
      { name: 'GIS Territory Mapping', category: 'Geospatial', current: 4, target: 8 },
    ],
    licenses: [
      { vendor: 'AutoCAD / MicroStation', total: 60, active: 42, waste: 72000, action: 'Consolidate with HCC shared license pool' },
      { vendor: 'Wabtec PTC Suite', total: 35, active: 32, waste: 18000, action: 'Remove test environment surplus' },
      { vendor: 'SCADA HMI Licenses', total: 28, active: 24, waste: 16000, action: 'Decommission legacy monitoring stations' },
    ],
  },
  htsi: {
    techStack: [
      { name: 'Trapeze OPS', category: 'Transit Planning', current: 6, target: 9 },
      { name: 'Vehicle Tracking System', category: 'Fleet Mgmt', current: 7, target: 9 },
      { name: 'Fare Collection System', category: 'Revenue', current: 5, target: 8 },
      { name: 'Kronos / UKG', category: 'Workforce Mgmt', current: 6, target: 8 },
      { name: 'Ridership Analytics', category: 'Analytics', current: 4, target: 8 },
      { name: 'Maintenance DB', category: 'Fleet Maintenance', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'Trapeze OPS Suite', total: 45, active: 38, waste: 28000, action: 'Remove 7 inactive dispatcher seats' },
      { vendor: 'Kronos / UKG', total: 200, active: 180, waste: 20000, action: 'Consolidate with HRSI Kronos instance' },
      { vendor: 'Ridership Analytics', total: 30, active: 18, waste: 24000, action: 'Migrate to Power BI dashboards' },
    ],
  },
  he: {
    techStack: [
      { name: 'SCADA Solar/Wind', category: 'Energy Monitoring', current: 7, target: 9 },
      { name: 'Grid Interconnection Tools', category: 'Compliance', current: 5, target: 8 },
      { name: 'Permit Tracking System', category: 'Regulatory', current: 4, target: 7 },
      { name: 'Weather Forecasting API', category: 'External Data', current: 6, target: 8 },
      { name: 'SAP ECC', category: 'ERP', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'SCADA HMI', total: 18, active: 16, waste: 8000, action: 'Remove 2 decommissioned site licenses' },
      { vendor: 'SAP ECC', total: 30, active: 22, waste: 16000, action: 'Consolidate into parent SAP tenant' },
    ],
  },
  gg: {
    techStack: [
      { name: 'Environmental Monitoring', category: 'Compliance', current: 6, target: 8 },
      { name: 'EPA Reporting Portal', category: 'Regulatory', current: 5, target: 8 },
      { name: 'Waste Stream Tracker', category: 'Operations', current: 4, target: 7 },
      { name: 'GIS Remediation Mapping', category: 'Geospatial', current: 5, target: 8 },
      { name: 'Lab Data Management', category: 'Testing', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'ESRI ArcGIS', total: 12, active: 8, waste: 16000, action: 'Consolidate with HSI GIS licenses' },
      { vendor: 'Lab Data Software', total: 8, active: 5, waste: 9000, action: 'Remove 3 inactive analyst seats' },
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
      { vendor: 'SAP S/4HANA', total: 2400, active: 1680, waste: 3800000, action: 'Harmonize 7 division instances to unified tenant' },
      { vendor: 'Workday', total: 1800, active: 1420, waste: 1400000, action: 'Consolidate legacy HRIS systems' },
      { vendor: 'Palantir Foundry', total: 340, active: 180, waste: 840000, action: 'Migrate 7 divisions to shared analytics layer' },
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
  'nb-aerospace': {
    techStack: [
      { name: 'Windchill PLM', category: 'PLM', current: 6, target: 9 },
      { name: 'TeamCenter', category: 'Engineering', current: 5, target: 8 },
      { name: 'SAP S/4HANA', category: 'ERP', current: 7, target: 9 },
      { name: 'DOORS', category: 'Requirements', current: 4, target: 8 },
      { name: 'Comply365', category: 'Flight Certification', current: 5, target: 9 },
      { name: 'MES (Apriso)', category: 'Manufacturing', current: 3, target: 8 },
    ],
    licenses: [
      { vendor: 'Windchill PLM', total: 320, active: 210, waste: 580000, action: 'Consolidate 4 division instances' },
      { vendor: 'TeamCenter', total: 180, active: 120, waste: 360000, action: 'Migrate legacy CAD users to Windchill' },
      { vendor: 'SAP S/4HANA', total: 450, active: 380, waste: 245000, action: 'Downgrade 70 seats to Viewer tier' },
      { vendor: 'DOORS', total: 90, active: 48, waste: 168000, action: 'Retire post-Windchill requirements migration' },
    ],
  },
  'nb-energy': {
    techStack: [
      { name: 'OSIsoft PI', category: 'Historian', current: 7, target: 9 },
      { name: 'SCADA (Schneider)', category: 'Control Systems', current: 5, target: 8 },
      { name: 'GE Digital APM', category: 'Asset Mgmt', current: 4, target: 8 },
      { name: 'SAP PM', category: 'Maintenance', current: 6, target: 9 },
      { name: 'PowerWorld', category: 'Grid Simulation', current: 5, target: 8 },
      { name: 'Maximo', category: 'Work Orders', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'OSIsoft PI', total: 280, active: 195, waste: 425000, action: 'Consolidate 3 regional PI servers' },
      { vendor: 'GE Digital APM', total: 160, active: 92, waste: 340000, action: 'Migrate legacy asset records to unified instance' },
      { vendor: 'Maximo', total: 120, active: 65, waste: 220000, action: 'Replace with SAP PM work order module' },
      { vendor: 'SAP PM', total: 340, active: 280, waste: 180000, action: 'Harmonize maintenance configs across 5 plants' },
    ],
  },
  'nb-financial': {
    techStack: [
      { name: 'Bloomberg Terminal', category: 'Market Data', current: 8, target: 9 },
      { name: 'Murex', category: 'Trading', current: 6, target: 9 },
      { name: 'Salesforce Financial', category: 'CRM', current: 5, target: 8 },
      { name: 'Actimize', category: 'Compliance', current: 7, target: 9 },
      { name: 'Calypso', category: 'Risk', current: 4, target: 8 },
      { name: 'SAP FICO', category: 'Finance', current: 6, target: 8 },
    ],
    licenses: [
      { vendor: 'Bloomberg Terminal', total: 420, active: 310, waste: 2640000, action: 'Audit inactive terminals — $24K/seat/yr' },
      { vendor: 'Murex', total: 180, active: 130, waste: 750000, action: 'Consolidate test + UAT environments' },
      { vendor: 'Salesforce Financial', total: 600, active: 420, waste: 540000, action: 'Downgrade 180 to Platform licenses' },
      { vendor: 'Calypso', total: 95, active: 58, waste: 370000, action: 'Migrate legacy risk models to unified instance' },
    ],
  },
  'nb-health': {
    techStack: [
      { name: 'Veeva Vault', category: 'Doc Mgmt', current: 7, target: 9 },
      { name: 'LIMS (LabWare)', category: 'Laboratory', current: 5, target: 8 },
      { name: 'SAP ECC', category: 'ERP', current: 4, target: 8 },
      { name: 'Medidata Rave', category: 'Clinical Trials', current: 6, target: 9 },
      { name: 'TraceLink', category: 'Supply Chain', current: 5, target: 8 },
      { name: 'Veeva CRM', category: 'Sales/Medical', current: 6, target: 8 },
    ],
    licenses: [
      { vendor: 'Veeva Vault', total: 350, active: 240, waste: 660000, action: 'Consolidate 3 Vault instances across divisions' },
      { vendor: 'LIMS (LabWare)', total: 140, active: 85, waste: 385000, action: 'Migrate 2 legacy QC systems into LabWare' },
      { vendor: 'SAP ECC', total: 280, active: 210, waste: 315000, action: 'Upgrade to S/4HANA — retire dual-run cost' },
      { vendor: 'Medidata Rave', total: 90, active: 62, waste: 224000, action: 'Decommission completed trial environments' },
    ],
  },
  'ee-finance': {
    techStack: [
      { name: 'SAP FICO', category: 'Financial Mgmt', current: 6, target: 9 },
      { name: 'e-MTA Tax Portal', category: 'Tax Processing', current: 7, target: 9 },
      { name: 'Qlik Sense', category: 'Budget Analytics', current: 4, target: 8 },
      { name: 'SAP BPC', category: 'Budget Planning', current: 5, target: 8 },
      { name: 'e-Filing Gateway', category: 'Digital Filing', current: 8, target: 10 },
      { name: 'X-Road Connector', category: 'Data Exchange', current: 7, target: 9 },
    ],
    licenses: [
      { vendor: 'SAP FICO', total: 180, active: 120, waste: 360000, action: 'Consolidate 3 ministry budget instances' },
      { vendor: 'Qlik Sense', total: 95, active: 48, waste: 188000, action: 'Migrate 30 seats to shared dashboard tier' },
      { vendor: 'SAP BPC', total: 60, active: 38, waste: 132000, action: 'Replace with S/4HANA embedded planning' },
      { vendor: 'Oracle DB (Legacy)', total: 40, active: 15, waste: 96000, action: 'Migrate to PostgreSQL via X-Road adapter' },
    ],
  },
  'ee-social': {
    techStack: [
      { name: 'SKAIS2', category: 'Case Management', current: 5, target: 8 },
      { name: 'TEHIK Health IS', category: 'Health IT', current: 6, target: 9 },
      { name: 'STAR', category: 'Benefit Processing', current: 4, target: 8 },
      { name: 'X-Road Connector', category: 'Data Exchange', current: 7, target: 9 },
      { name: 'Power BI', category: 'Analytics', current: 3, target: 7 },
      { name: 'DocLogix', category: 'Document Mgmt', current: 4, target: 7 },
    ],
    licenses: [
      { vendor: 'SKAIS2', total: 220, active: 150, waste: 280000, action: 'Consolidate regional case worker instances' },
      { vendor: 'STAR Benefit Engine', total: 80, active: 55, waste: 125000, action: 'Automate 40% of manual benefit calculations' },
      { vendor: 'Power BI Pro', total: 60, active: 28, waste: 51000, action: 'Switch to shared capacity model' },
      { vendor: 'DocLogix', total: 45, active: 22, waste: 46000, action: 'Migrate to centralized DMS via X-Road' },
    ],
  },
  'ee-economic': {
    techStack: [
      { name: 'eesti.ee Portal', category: 'Trade Portal', current: 7, target: 9 },
      { name: 'e-Residency Platform', category: 'Digital Identity', current: 8, target: 10 },
      { name: 'e-Business Registry', category: 'Business Registry', current: 7, target: 9 },
      { name: 'X-Road Connector', category: 'Data Exchange', current: 8, target: 9 },
      { name: 'Tableau', category: 'Analytics', current: 4, target: 8 },
      { name: 'Custom CMS', category: 'Content Mgmt', current: 3, target: 7 },
    ],
    licenses: [
      { vendor: 'e-Residency Platform', total: 45, active: 35, waste: 84000, action: 'Decommission legacy onboarding modules' },
      { vendor: 'Tableau', total: 55, active: 28, waste: 91000, action: 'Consolidate to shared government BI layer' },
      { vendor: 'Custom CMS', total: 30, active: 12, waste: 72000, action: 'Migrate to shared gov CMS platform' },
      { vendor: 'Oracle DB (Legacy)', total: 25, active: 10, waste: 58000, action: 'Migrate to PostgreSQL via X-Road' },
    ],
  },
  'ee-ria': {
    techStack: [
      { name: 'X-Road Monitor', category: 'Infrastructure', current: 8, target: 10 },
      { name: 'Splunk SIEM', category: 'Security', current: 7, target: 9 },
      { name: 'Nessus', category: 'Vulnerability Scanning', current: 6, target: 9 },
      { name: 'eID Management', category: 'Identity', current: 8, target: 10 },
      { name: 'Zabbix', category: 'Monitoring', current: 6, target: 8 },
      { name: 'TheHive', category: 'Incident Response', current: 5, target: 8 },
    ],
    licenses: [
      { vendor: 'Splunk SIEM', total: 120, active: 80, waste: 320000, action: 'Consolidate 4 agency Splunk instances' },
      { vendor: 'Nessus Pro', total: 85, active: 50, waste: 175000, action: 'Migrate to centralized scanning cluster' },
      { vendor: 'Zabbix Enterprise', total: 60, active: 38, waste: 88000, action: 'Consolidate monitoring to unified dashboard' },
      { vendor: 'TheHive', total: 40, active: 22, waste: 54000, action: 'Automate tier-1 incident triage workflows' },
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
      { from: 'RailSentry LIDAR', to: 'SAP ECC', status: 'siloed', dataFlow: 'No integration \u2014 manual GIS overlay by HSI engineers' },
      { from: 'Wabtec PTC', to: 'HRSI Dispatch', status: 'partial', dataFlow: 'Signal status exported as CSV, emailed daily' },
      { from: 'Trimble GPS', to: 'SAP ECC', status: 'partial', dataFlow: 'Weekly fleet position batch upload' },
      { from: 'HRSI Dispatch', to: 'SAP ECC', status: 'siloed', dataFlow: 'Crew hours rekeyed manually into SAP payroll module' },
      { from: 'Power BI', to: 'SAP ECC', status: 'connected', dataFlow: 'ODBC direct connection' },
    ],
    remediation: [
      { priority: 1, action: 'Deploy track intelligence data lake to unify RailSentry + Video Track Chart + TAM-4 data', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$1.38M defect detection savings' },
      { priority: 2, action: 'Integrate HRSI Dispatch \u2194 SAP ECC via API middleware with real-time HOS tracking', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate 2.4-hr dispatch bottleneck' },
      { priority: 3, action: 'Consolidate 4 SAP ECC division instances to single tenant', category: 'optimization', effort: 'High', timeline: '4-5 months', impact: '$480K annual license savings' },
      { priority: 4, action: 'Remove 120 inactive Trimble fleet licenses post equipment audit', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '$320K annual savings' },
      { priority: 5, action: 'RailSentry mobile app training for track maintenance crews', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 20-30%' },
    ],
  },
  hcc: {
    integrations: [
      { from: 'HCSS HeavyJob', to: 'SAP ECC', status: 'partial', dataFlow: 'Daily batch upload of cost data' },
      { from: 'Primavera P6', to: 'SAP ECC', status: 'connected', dataFlow: 'Bi-directional sync via middleware' },
      { from: 'Samsara GPS', to: 'Equipment Tracker', status: 'connected', dataFlow: 'Real-time fleet telemetry' },
      { from: 'Trimble Earthworks', to: 'HCSS HeavyJob', status: 'siloed', dataFlow: 'Manual grade data export' },
    ],
    remediation: [
      { priority: 1, action: 'Integrate Trimble machine control data into HeavyJob for automated grade reporting', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate 3-hr daily manual reconciliation' },
      { priority: 2, action: 'Consolidate AutoCAD licenses with HTI shared pool', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '$68K annual savings' },
      { priority: 3, action: 'Deploy mobile HCSS for field superintendents', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 15-25%' },
    ],
  },
  hrsi: {
    integrations: [
      { from: 'GPS Ballast System', to: 'SAP PM', status: 'partial', dataFlow: 'Weekly position batch upload' },
      { from: 'Kronos / UKG', to: 'Custom Dispatch', status: 'connected', dataFlow: 'Shared API data source' },
      { from: 'Equipment Tracker', to: 'SAP PM', status: 'siloed', dataFlow: 'Manual work order entry' },
    ],
    remediation: [
      { priority: 1, action: 'Integrate Equipment Tracker with SAP PM for automated work order generation', category: 'integration', effort: 'Medium', timeline: '8 weeks', impact: 'Reduce work order entry time by 4 hrs/day' },
      { priority: 2, action: 'Deploy real-time GPS ballast telemetry to SAP PM', category: 'integration', effort: 'Medium', timeline: '6 weeks', impact: '$89K maintenance cost avoidance' },
    ],
  },
  hsi: {
    integrations: [
      { from: 'RailSentry LIDAR', to: 'Video Track Chart', status: 'siloed', dataFlow: 'Manual GIS overlay — 4-6 hrs per corridor' },
      { from: 'TAM-4 Ultrasonic', to: 'FRA Portal', status: 'partial', dataFlow: 'Semi-automated defect upload' },
      { from: 'GIS Mapping', to: 'RailSentry', status: 'partial', dataFlow: 'Monthly batch coordinate sync' },
    ],
    remediation: [
      { priority: 1, action: 'Build unified track intelligence data lake for LIDAR + Video + TAM-4', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$1.38M defect detection savings' },
      { priority: 2, action: 'Automate FRA defect classification from TAM-4 data', category: 'integration', effort: 'Medium', timeline: '8 weeks', impact: 'Reduce classification time 82%' },
    ],
  },
  hti: {
    integrations: [
      { from: 'Wabtec PTC', to: 'SCADA', status: 'connected', dataFlow: 'Real-time signal telemetry' },
      { from: 'AutoCAD', to: 'GIS Territory', status: 'partial', dataFlow: 'Manual design export to GIS' },
      { from: 'Fiber OTDR', to: 'SCADA', status: 'siloed', dataFlow: 'Test results entered manually' },
    ],
    remediation: [
      { priority: 1, action: 'Automate OTDR test result ingestion into SCADA monitoring', category: 'integration', effort: 'Medium', timeline: '6 weeks', impact: 'Real-time fiber health monitoring' },
      { priority: 2, action: 'Consolidate CAD licenses with HCC', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '$72K annual savings' },
    ],
  },
  htsi: {
    integrations: [
      { from: 'Trapeze OPS', to: 'Vehicle Tracking', status: 'connected', dataFlow: 'Real-time schedule adherence' },
      { from: 'Fare Collection', to: 'Ridership Analytics', status: 'partial', dataFlow: 'Daily batch revenue data' },
      { from: 'Kronos / UKG', to: 'Trapeze OPS', status: 'siloed', dataFlow: 'Manual crew schedule sync' },
    ],
    remediation: [
      { priority: 1, action: 'Integrate Kronos crew data with Trapeze for automated rostering', category: 'integration', effort: 'Medium', timeline: '8 weeks', impact: 'Reduce scheduling errors 40%' },
      { priority: 2, action: 'Real-time fare data to ridership analytics', category: 'integration', effort: 'Low', timeline: '3 weeks', impact: 'Same-day revenue visibility' },
    ],
  },
  he: {
    integrations: [
      { from: 'SCADA Solar', to: 'Grid Tools', status: 'connected', dataFlow: 'Real-time production data' },
      { from: 'Permit Tracking', to: 'SAP ECC', status: 'siloed', dataFlow: 'Manual cost allocation' },
      { from: 'Weather API', to: 'SCADA', status: 'connected', dataFlow: 'Hourly forecast integration' },
    ],
    remediation: [
      { priority: 1, action: 'Automate permit cost tracking in SAP', category: 'integration', effort: 'Low', timeline: '4 weeks', impact: 'Eliminate 6 hrs/week manual entry' },
      { priority: 2, action: 'Consolidate SAP into parent tenant', category: 'optimization', effort: 'Medium', timeline: '8 weeks', impact: '$16K annual savings' },
    ],
  },
  gg: {
    integrations: [
      { from: 'Environmental Monitoring', to: 'EPA Portal', status: 'connected', dataFlow: 'Automated compliance reports' },
      { from: 'Waste Stream Tracker', to: 'Lab Data Mgmt', status: 'partial', dataFlow: 'Weekly batch sample results' },
      { from: 'GIS Remediation', to: 'Environmental Monitoring', status: 'siloed', dataFlow: 'Manual coordinate entry' },
    ],
    remediation: [
      { priority: 1, action: 'Integrate GIS with environmental monitoring for automated site mapping', category: 'integration', effort: 'Medium', timeline: '6 weeks', impact: 'Eliminate 4 hrs/site manual mapping' },
      { priority: 2, action: 'Real-time lab data to waste stream tracker', category: 'integration', effort: 'Low', timeline: '3 weeks', impact: 'Same-day compliance visibility' },
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
      { from: 'SAP S/4HANA', to: 'Workday', status: 'partial', dataFlow: '5 of 7 divisions integrated — 2 on legacy HRIS' },
      { from: 'Palantir Foundry', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'API ingestion from 6 divisions' },
      { from: 'Salesforce', to: 'ServiceNow', status: 'partial', dataFlow: '5 divisions connected — 2 manual handoff' },
      { from: 'Siemens Xcelerator', to: 'Palantir Foundry', status: 'partial', dataFlow: 'Industrial divisions only — 3 of 7' },
      { from: 'ServiceNow', to: 'SAP S/4HANA', status: 'connected', dataFlow: 'Enterprise ITSM integration' },
    ],
    remediation: [
      { priority: 1, action: 'Harmonize all 7 divisions onto unified SAP S/4HANA tenant', category: 'migration', effort: 'High', timeline: '6-8 months', impact: '$3.8M license + ops savings' },
      { priority: 2, action: 'Extend Palantir Foundry ingestion to remaining division', category: 'integration', effort: 'Medium', timeline: '2-3 months', impact: 'Full cross-division analytics' },
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
  'nb-aerospace': {
    integrations: [
      { from: 'Windchill PLM', to: 'TeamCenter', status: 'partial', dataFlow: 'Manual CAD file exchange between divisions' },
      { from: 'SAP S/4HANA', to: 'Windchill PLM', status: 'connected', dataFlow: 'BOM sync via SAP PLM connector' },
      { from: 'DOORS', to: 'Windchill PLM', status: 'siloed', dataFlow: 'Requirements traced manually in spreadsheets' },
      { from: 'Comply365', to: 'DOORS', status: 'partial', dataFlow: 'Certification docs linked but not automated' },
      { from: 'MES (Apriso)', to: 'SAP S/4HANA', status: 'siloed', dataFlow: 'Shop floor data rekeyed into SAP daily' },
    ],
    remediation: [
      { priority: 1, action: 'Unify Windchill + TeamCenter into single PLM backbone', category: 'migration', effort: 'High', timeline: '5-6 months', impact: '$580K license savings + unified BOM' },
      { priority: 2, action: 'Integrate DOORS requirements into Windchill lifecycle', category: 'integration', effort: 'Medium', timeline: '2-3 months', impact: '$168K savings + traceability' },
      { priority: 3, action: 'Connect MES (Apriso) to SAP via real-time API', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate daily rekeying delays' },
      { priority: 4, action: 'Automate Comply365 certification workflow', category: 'optimization', effort: 'Low', timeline: '4 weeks', impact: '60% faster certification cycles' },
      { priority: 5, action: 'Digital thread training for aerospace engineering teams', category: 'training', effort: 'Low', timeline: '3 weeks', impact: 'Adoption uplift 25-35%' },
    ],
  },
  'nb-energy': {
    integrations: [
      { from: 'OSIsoft PI', to: 'GE Digital APM', status: 'partial', dataFlow: 'Historian data piped to 2 of 5 plants' },
      { from: 'SCADA', to: 'OSIsoft PI', status: 'connected', dataFlow: 'Real-time sensor ingestion' },
      { from: 'SAP PM', to: 'GE Digital APM', status: 'siloed', dataFlow: 'Work orders created manually from APM alerts' },
      { from: 'Maximo', to: 'SAP PM', status: 'siloed', dataFlow: 'Duplicate work order systems — no sync' },
      { from: 'PowerWorld', to: 'SCADA', status: 'partial', dataFlow: 'Simulation results imported manually' },
    ],
    remediation: [
      { priority: 1, action: 'Extend OSIsoft PI historian to all 5 plants', category: 'integration', effort: 'High', timeline: '4-5 months', impact: '$425K savings + unified analytics' },
      { priority: 2, action: 'Connect GE Digital APM alerts to SAP PM work orders', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate manual work order creation' },
      { priority: 3, action: 'Retire Maximo — migrate to SAP PM module', category: 'migration', effort: 'High', timeline: '3-4 months', impact: '$220K annual savings' },
      { priority: 4, action: 'Consolidate 3 regional PI server instances', category: 'optimization', effort: 'Medium', timeline: '6 weeks', impact: '$180K infrastructure savings' },
      { priority: 5, action: 'Predictive maintenance AI training for plant operators', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 20-30%' },
    ],
  },
  'nb-financial': {
    integrations: [
      { from: 'Bloomberg Terminal', to: 'Murex', status: 'connected', dataFlow: 'Real-time market data feed' },
      { from: 'Murex', to: 'SAP FICO', status: 'partial', dataFlow: 'End-of-day P&L batch reconciliation' },
      { from: 'Salesforce Financial', to: 'Actimize', status: 'siloed', dataFlow: 'KYC data copied manually per client' },
      { from: 'Calypso', to: 'Murex', status: 'partial', dataFlow: 'Risk positions synced every 4 hours' },
      { from: 'Actimize', to: 'SAP FICO', status: 'siloed', dataFlow: 'Compliance reports emailed to finance' },
    ],
    remediation: [
      { priority: 1, action: 'Deploy real-time P&L streaming from Murex to SAP FICO', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '$750K savings + real-time risk view' },
      { priority: 2, action: 'Audit and reclaim 110 inactive Bloomberg terminals', category: 'optimization', effort: 'Low', timeline: '3 weeks', impact: '$2.64M annual savings' },
      { priority: 3, action: 'Integrate Salesforce KYC with Actimize compliance', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Eliminate manual KYC duplication' },
      { priority: 4, action: 'Migrate Calypso risk models to unified Murex instance', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '$370K + consolidated risk' },
      { priority: 5, action: 'AI-assisted trading compliance training program', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift 15-25%' },
    ],
  },
  'nb-health': {
    integrations: [
      { from: 'Veeva Vault', to: 'Medidata Rave', status: 'partial', dataFlow: 'Trial documents linked but not version-synced' },
      { from: 'LIMS (LabWare)', to: 'Veeva Vault', status: 'siloed', dataFlow: 'QC results attached manually to submissions' },
      { from: 'SAP ECC', to: 'TraceLink', status: 'connected', dataFlow: 'Serialization data via EDI' },
      { from: 'Medidata Rave', to: 'SAP ECC', status: 'siloed', dataFlow: 'Trial cost data rekeyed into SAP monthly' },
      { from: 'Veeva CRM', to: 'Veeva Vault', status: 'connected', dataFlow: 'Approved content sync for field reps' },
    ],
    remediation: [
      { priority: 1, action: 'Consolidate 3 Veeva Vault instances into single GxP-validated tenant', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '$660K savings + unified submissions' },
      { priority: 2, action: 'Integrate LIMS QC results into Veeva Vault submission workflow', category: 'integration', effort: 'Medium', timeline: '2-3 months', impact: '$385K savings + faster release' },
      { priority: 3, action: 'Upgrade SAP ECC to S/4HANA — eliminate dual-run', category: 'migration', effort: 'High', timeline: '5-6 months', impact: '$315K annual savings' },
      { priority: 4, action: 'Automate Medidata trial cost posting to SAP', category: 'integration', effort: 'Low', timeline: '4 weeks', impact: 'Eliminate monthly rekeying' },
      { priority: 5, action: 'Clinical data science AI literacy program', category: 'training', effort: 'Medium', timeline: '6 weeks', impact: 'Adoption uplift 20-30%' },
    ],
  },
  'ee-finance': {
    integrations: [
      { from: 'SAP FICO', to: 'e-MTA Tax Portal', status: 'connected', dataFlow: 'Tax declaration data via X-Road' },
      { from: 'SAP BPC', to: 'SAP FICO', status: 'partial', dataFlow: 'Budget allocations synced quarterly' },
      { from: 'Qlik Sense', to: 'SAP FICO', status: 'partial', dataFlow: 'Daily data warehouse extract' },
      { from: 'e-Filing Gateway', to: 'e-MTA Tax Portal', status: 'connected', dataFlow: 'Real-time digital filing via X-Road' },
      { from: 'Oracle DB', to: 'Qlik Sense', status: 'siloed', dataFlow: 'Legacy fiscal data requires manual export' },
    ],
    remediation: [
      { priority: 1, action: 'Consolidate 3 SAP FICO ministry instances to shared tenant', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '€360K savings + unified fiscal view' },
      { priority: 2, action: 'Migrate Oracle legacy fiscal data to PostgreSQL via X-Road', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: '€96K annual savings' },
      { priority: 3, action: 'Replace SAP BPC with S/4HANA embedded planning', category: 'optimization', effort: 'Medium', timeline: '6-8 weeks', impact: '€132K annual savings' },
      { priority: 4, action: 'Consolidate Qlik Sense to shared government BI tier', category: 'optimization', effort: 'Low', timeline: '3 weeks', impact: '€188K annual savings' },
      { priority: 5, action: 'Finance ministry AI-assisted budgeting training', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift across 1.2K staff' },
    ],
  },
  'ee-social': {
    integrations: [
      { from: 'SKAIS2', to: 'X-Road Connector', status: 'connected', dataFlow: 'Case data exchanged with other registries' },
      { from: 'TEHIK Health IS', to: 'SKAIS2', status: 'partial', dataFlow: 'Health data pulled on-demand — no push sync' },
      { from: 'STAR', to: 'SKAIS2', status: 'partial', dataFlow: 'Benefit eligibility checked manually per case' },
      { from: 'DocLogix', to: 'SKAIS2', status: 'siloed', dataFlow: 'Documents uploaded manually to case files' },
      { from: 'Power BI', to: 'SKAIS2', status: 'siloed', dataFlow: 'Weekly CSV export for reporting' },
    ],
    remediation: [
      { priority: 1, action: 'Integrate STAR benefit engine with SKAIS2 for auto-eligibility', category: 'integration', effort: 'High', timeline: '3-4 months', impact: '€280K savings + faster benefit decisions' },
      { priority: 2, action: 'Connect TEHIK health data push-sync to SKAIS2', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Real-time health data for case workers' },
      { priority: 3, action: 'Migrate DocLogix to centralized DMS via X-Road', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: '€46K savings + unified documents' },
      { priority: 4, action: 'Consolidate regional SKAIS2 case worker instances', category: 'optimization', effort: 'Low', timeline: '4 weeks', impact: '€125K annual savings' },
      { priority: 5, action: 'Social worker AI-assisted case management training', category: 'training', effort: 'Low', timeline: '3 weeks', impact: 'Adoption uplift across 2.4K staff' },
    ],
  },
  'ee-economic': {
    integrations: [
      { from: 'eesti.ee Portal', to: 'e-Business Registry', status: 'connected', dataFlow: 'Real-time company registration via X-Road' },
      { from: 'e-Residency Platform', to: 'e-Business Registry', status: 'connected', dataFlow: 'Digital identity → company formation flow' },
      { from: 'Tableau', to: 'e-Business Registry', status: 'partial', dataFlow: 'Nightly data warehouse refresh' },
      { from: 'Custom CMS', to: 'eesti.ee Portal', status: 'siloed', dataFlow: 'Content published manually — no API' },
      { from: 'X-Road Connector', to: 'e-Residency Platform', status: 'connected', dataFlow: 'Cross-border identity verification' },
    ],
    remediation: [
      { priority: 1, action: 'Replace Custom CMS with shared gov CMS platform', category: 'migration', effort: 'Medium', timeline: '2-3 months', impact: '€72K savings + automated publishing' },
      { priority: 2, action: 'Migrate Oracle legacy DB to PostgreSQL via X-Road', category: 'migration', effort: 'Medium', timeline: '6-8 weeks', impact: '€58K annual savings' },
      { priority: 3, action: 'Consolidate Tableau to shared government BI layer', category: 'optimization', effort: 'Low', timeline: '3 weeks', impact: '€91K annual savings' },
      { priority: 4, action: 'Decommission legacy e-Residency onboarding modules', category: 'optimization', effort: 'Low', timeline: '2 weeks', impact: '€84K annual savings' },
      { priority: 5, action: 'Economic affairs digital services AI training', category: 'training', effort: 'Low', timeline: '4 weeks', impact: 'Adoption uplift across 800 staff' },
    ],
  },
  'ee-ria': {
    integrations: [
      { from: 'X-Road Monitor', to: 'Splunk SIEM', status: 'connected', dataFlow: 'Real-time X-Road traffic logs ingested' },
      { from: 'Nessus', to: 'Splunk SIEM', status: 'partial', dataFlow: 'Scan results imported daily — not real-time' },
      { from: 'eID Management', to: 'X-Road Monitor', status: 'connected', dataFlow: 'Identity event monitoring via API' },
      { from: 'TheHive', to: 'Splunk SIEM', status: 'partial', dataFlow: 'Alerts forwarded — manual triage required' },
      { from: 'Zabbix', to: 'X-Road Monitor', status: 'siloed', dataFlow: 'Separate infra monitoring — no correlation' },
    ],
    remediation: [
      { priority: 1, action: 'Consolidate 4 agency Splunk instances to unified SOC', category: 'migration', effort: 'High', timeline: '4-5 months', impact: '€320K savings + centralized threat view' },
      { priority: 2, action: 'Integrate Nessus real-time scanning into Splunk pipeline', category: 'integration', effort: 'Medium', timeline: '6-8 weeks', impact: 'Real-time vulnerability correlation' },
      { priority: 3, action: 'Automate TheHive tier-1 incident triage via SOAR playbooks', category: 'optimization', effort: 'Medium', timeline: '2-3 months', impact: '€54K savings + 70% faster triage' },
      { priority: 4, action: 'Unify Zabbix infra monitoring with X-Road Monitor', category: 'integration', effort: 'Low', timeline: '4 weeks', impact: '€88K savings + correlated alerts' },
      { priority: 5, action: 'National cyber defense AI threat detection training', category: 'training', effort: 'Medium', timeline: '6 weeks', impact: 'Adoption uplift across 450 analysts' },
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
    PLM: 'bg-blue-muted text-blue',
    Engineering: 'bg-blue-muted text-blue',
    Requirements: 'bg-amber-muted text-amber',
    'Flight Certification': 'bg-red-muted text-red',
    Manufacturing: 'bg-amber-muted text-amber',
    Historian: 'bg-green-muted text-green',
    'Control Systems': 'bg-red-muted text-red',
    'Asset Mgmt': 'bg-amber-muted text-amber',
    Maintenance: 'bg-amber-muted text-amber',
    'Grid Simulation': 'bg-blue-muted text-blue',
    'Work Orders': 'bg-surface-sunken text-ink-tertiary',
    'Market Data': 'bg-green-muted text-green',
    Trading: 'bg-blue-muted text-blue',
    Compliance: 'bg-red-muted text-red',
    Risk: 'bg-red-muted text-red',
    Finance: 'bg-amber-muted text-amber',
    'Doc Mgmt': 'bg-blue-muted text-blue',
    Laboratory: 'bg-green-muted text-green',
    'Clinical Trials': 'bg-green-muted text-green',
    'Sales/Medical': 'bg-amber-muted text-amber',
    'Tax Processing': 'bg-amber-muted text-amber',
    'Budget Analytics': 'bg-blue-muted text-blue',
    'Budget Planning': 'bg-blue-muted text-blue',
    'Digital Filing': 'bg-green-muted text-green',
    'Case Management': 'bg-red-muted text-red',
    'Benefit Processing': 'bg-amber-muted text-amber',
    'Document Mgmt': 'bg-blue-muted text-blue',
    'Trade Portal': 'bg-green-muted text-green',
    'Digital Identity': 'bg-green-muted text-green',
    'Business Registry': 'bg-blue-muted text-blue',
    'Content Mgmt': 'bg-surface-sunken text-ink-tertiary',
    Infrastructure: 'bg-blue-muted text-blue',
    Security: 'bg-red-muted text-red',
    'Vulnerability Scanning': 'bg-red-muted text-red',
    Monitoring: 'bg-amber-muted text-amber',
    'Incident Response': 'bg-red-muted text-red',
  };
  return map[category] || 'bg-surface-sunken text-ink-tertiary';
}

/* ── Main ────────────────────────────────────────────────── */

export default function Assessment() {
  const { company } = useCompany();
  const hasOwnData = !!assessmentData[company.id];
  const parentCompany = company.parentId ? companies.find((c) => c.id === company.parentId) : null;
  const data = assessmentData[company.id] || (company.parentId ? assessmentData[company.parentId] : null) || assessmentData.meridian;

  const avgReadiness = Math.round(data.techStack.reduce((s, t) => s + t.current, 0) / data.techStack.length * 10) / 10;
  const totalWaste = data.licenses.reduce((s, l) => s + l.waste, 0);
  const ext = extendedData[company.id] || (company.parentId ? extendedData[company.parentId] : null) || extendedData.meridian;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {!hasOwnData && parentCompany && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-muted border border-amber/20 text-[12px] text-amber font-medium">
          Showing {parentCompany.shortName} aggregate data — division-specific assessment not yet available.
        </div>
      )}
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Assessment</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Tech stack diagnostic and license waste analysis — {company.employees.toLocaleString()} employees across {company.opCos} {company.category === 'sovereign' ? 'agencies' : company.opCos > 1 ? 'divisions' : 'entity'}
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

      {/* ── Cross-link to Command Center Assessment ────────────── */}
      <a
        href={`${COMMAND_CENTER_URL}/assessment?company=${company.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-ink-tertiary hover:text-blue-400 transition-colors"
      >
        View full assessment in Command Center
        <ExternalLink className="w-3 h-3" strokeWidth={2} />
      </a>

    </div>
  );
}
