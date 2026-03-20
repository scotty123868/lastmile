/** Live workflow demo data — each company has unique, industry-specific workflows */

export interface WorkflowStep {
  id: string;
  label: string;
  detail: string;
  status: 'completed' | 'active' | 'pending' | 'verification';
  duration?: string;
  agent?: string;
  verifiedBy?: string;
  confidence?: number;
  /** For verification steps: what was checked */
  check?: { original: string; corrected?: string; flag?: string };
}

export interface LiveWorkflow {
  id: string;
  name: string;
  department: string;
  status: 'running' | 'verified' | 'flagged' | 'queued';
  startedAt: string;
  steps: WorkflowStep[];
  savings: number;
  cycleTime: { before: string; after: string };
}

// ─── MERIDIAN: Verification Ops ─────────────────────────────

export const meridianWorkflows: LiveWorkflow[] = [
  {
    id: 'mer-001',
    name: 'Field Service Report Processing',
    department: 'Operations — Northeast Division',
    status: 'running',
    startedAt: '2 min ago',
    savings: 340000,
    cycleTime: { before: '4.2 hours', after: '18 min' },
    steps: [
      {
        id: 's1', label: 'Ingest Service Report', detail: 'PDF uploaded from field tablet — technician J. Morales, site #NE-4412',
        status: 'completed', duration: '0.3s', agent: 'Ingestion Agent',
      },
      {
        id: 's2', label: 'Extract Structured Data', detail: 'Equipment ID, service codes, parts used, labor hours, compliance checkboxes',
        status: 'completed', duration: '1.2s', agent: 'GPT-4o Extraction',
      },
      {
        id: 's3', label: 'Cross-Reference Equipment Catalog', detail: 'Matched to Asset #FA-2847 — Ansul R-102 fire suppression, last serviced 2025-09-14',
        status: 'completed', duration: '0.8s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Verify Compliance Fields', detail: 'NFPA 17A compliance checklist — 14 of 14 fields populated',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 94,
        check: {
          original: 'Inspection interval: 12 months',
          corrected: 'Inspection interval: 6 months (NFPA 17A §6.1.2 requires semi-annual for commercial kitchen)',
          flag: 'Compliance — interval mismatch',
        },
      },
      {
        id: 's5', label: 'Generate Work Order', detail: 'Pending verification clearance',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
      {
        id: 's6', label: 'Push to ServiceTitan', detail: 'Awaiting upstream completion',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'mer-002',
    name: 'Invoice Reconciliation — Q1 Vendor Batch',
    department: 'Finance — Shared Services',
    status: 'verified',
    startedAt: '14 min ago',
    savings: 180000,
    cycleTime: { before: '3 days', after: '22 min' },
    steps: [
      {
        id: 's1', label: 'Ingest 47 Vendor Invoices', detail: 'Batch upload from AP inbox — mixed PDF, CSV, EDI formats',
        status: 'completed', duration: '2.1s', agent: 'Ingestion Agent',
      },
      {
        id: 's2', label: 'Extract Line Items', detail: '312 line items across 47 invoices — 98.4% extraction confidence',
        status: 'completed', duration: '8.4s', agent: 'GPT-4o Extraction',
      },
      {
        id: 's3', label: 'Match to Purchase Orders', detail: '298 of 312 auto-matched. 14 flagged for manual review.',
        status: 'completed', duration: '3.2s', agent: 'Reconciliation Agent',
      },
      {
        id: 's4', label: 'Verify Discrepancies', detail: '3 pricing variances >5% escalated and resolved. 11 formatting mismatches auto-corrected.',
        status: 'completed', duration: '6 min', agent: 'Verification Queue',
        confidence: 97,
        check: {
          original: 'Grainger Invoice #GR-88421: Unit price $42.50 × 200 = $8,500.00',
          corrected: 'PO price $38.75 × 200 = $7,750.00 — $750 overcharge flagged to AP manager',
          flag: 'Pricing variance — escalated',
        },
      },
      {
        id: 's5', label: 'Post to NetSuite', detail: 'All 47 invoices posted. 3 held for manager approval.',
        status: 'completed', duration: '1.8s', agent: 'Integration Agent',
      },
      {
        id: 's6', label: 'Archive + Ledger Entry', detail: 'Decision trace recorded: 14 corrections, 3 escalations, 0 unresolved',
        status: 'completed', duration: '0.4s', agent: 'Audit Logger',
      },
    ],
  },
  {
    id: 'mer-003',
    name: 'Equipment Utilization Analysis',
    department: 'Operations — Fleet Management',
    status: 'running',
    startedAt: '6 min ago',
    savings: 520000,
    cycleTime: { before: '2 weeks', after: '45 min' },
    steps: [
      {
        id: 's1', label: 'Pull Telematics Data', detail: 'Samsara API — 142 vehicles, last 90 days GPS + engine hours',
        status: 'completed', duration: '4.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Cross-Reference Service Schedules', detail: 'ServiceTitan maintenance logs matched to fleet IDs',
        status: 'completed', duration: '2.8s', agent: 'Entity Resolution',
      },
      {
        id: 's3', label: 'Calculate Utilization Rates', detail: 'Fleet avg: 61%. 23 vehicles below 40% threshold.',
        status: 'active', duration: '—', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Generate Reallocation Plan', detail: 'Pending analysis completion',
        status: 'pending', agent: 'Optimization Agent',
      },
      {
        id: 's5', label: 'Verify Recommendations', detail: 'Human review required for asset reallocation >$50K',
        status: 'pending', agent: 'Verification Queue',
      },
    ],
  },
];

// ─── OAKWOOD: Readiness Ops ─────────────────────────────────

export const oakwoodWorkflows: LiveWorkflow[] = [
  {
    id: 'oak-001',
    name: 'Claims Intake — Auto Collision Batch',
    department: 'Claims Processing',
    status: 'running',
    startedAt: '1 min ago',
    savings: 890000,
    cycleTime: { before: '5.2 days', after: '3.4 hours' },
    steps: [
      {
        id: 's1', label: 'Receive Claim Submission', detail: 'FNOL via mobile app — Policy #OAK-2024-88741, claimant: redacted',
        status: 'completed', duration: '0.1s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'OCR Police Report', detail: 'Scanned PDF — Fairfield PD incident #24-08812. 3 pages, handwritten sections detected.',
        status: 'completed', duration: '3.4s', agent: 'Document Intelligence',
        confidence: 87,
      },
      {
        id: 's3', label: 'Normalize to Claims Schema', detail: 'Mapping 42 extracted fields to ACORD P&C standard. 3 fields require disambiguation.',
        status: 'active', duration: '—', agent: 'Schema Mapper',
        check: {
          original: 'Vehicle: 2022 Hnd Acc — blue',
          corrected: 'Vehicle: 2022 Honda Accord EX-L — VIN matched to policy, color: Obsidian Blue Pearl',
          flag: 'OCR abbreviation — entity resolved via policy lookup',
        },
      },
      {
        id: 's4', label: 'Build Context Pack', detail: 'Assembling: policy details + prior claims history + vehicle valuation + repair network',
        status: 'pending', agent: 'Context Assembler',
      },
      {
        id: 's5', label: 'Run Fraud Signals', detail: 'Cross-reference against SIU patterns and prior claim frequency',
        status: 'pending', agent: 'Risk Engine',
      },
      {
        id: 's6', label: 'Route to Adjuster Queue', detail: 'With complete Context Pack attached — adjuster sees full picture, not raw documents',
        status: 'pending', agent: 'Workflow Router',
      },
    ],
  },
  {
    id: 'oak-002',
    name: 'Legacy Policy Migration — Batch 14',
    department: 'Underwriting Operations',
    status: 'running',
    startedAt: '8 min ago',
    savings: 1200000,
    cycleTime: { before: '6 months (manual)', after: '2 weeks' },
    steps: [
      {
        id: 's1', label: 'Extract from AS/400 Export', detail: 'Batch 14: 2,340 commercial property policies, EBCDIC → UTF-8 conversion',
        status: 'completed', duration: '12s', agent: 'Legacy Extractor',
      },
      {
        id: 's2', label: 'Parse Coverage Schedules', detail: 'Nested coverage structures — 8,420 coverage lines across 2,340 policies',
        status: 'completed', duration: '34s', agent: 'Document Intelligence',
        confidence: 92,
      },
      {
        id: 's3', label: 'Reconcile Entity References', detail: '147 named insureds with multiple format variations. Dedup to 131 unique entities.',
        status: 'completed', duration: '18s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Map to Modern Schema', detail: 'ACORD 2.0 → Guidewire PolicyCenter format. 96% auto-mapped, 4% flagged.',
        status: 'active', duration: '—', agent: 'Schema Mapper',
        check: {
          original: 'Coverage code: BPP-FL (legacy internal code)',
          corrected: 'Coverage: Business Personal Property — Flood Extension. Mapped to Guidewire CovType.BPP_FLOOD_EXT',
          flag: 'Legacy code translation — verified against coverage manual',
        },
      },
      {
        id: 's5', label: 'Validate Business Rules', detail: 'Check premium calculations, deductible logic, endorsement consistency',
        status: 'pending', agent: 'Validation Engine',
      },
      {
        id: 's6', label: 'Load to Guidewire Staging', detail: 'Dry-run import with rollback capability',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'oak-003',
    name: 'Renewal Risk Reassessment',
    department: 'Actuarial',
    status: 'verified',
    startedAt: '22 min ago',
    savings: 340000,
    cycleTime: { before: '3 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Pull Renewal Cohort', detail: 'Q2 2026 renewals: 1,847 policies, $142M total premium',
        status: 'completed', duration: '2.1s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Aggregate External Data', detail: 'Weather events, property value changes, claims trends by ZIP code',
        status: 'completed', duration: '8.6s', agent: 'Context Assembler',
      },
      {
        id: 's3', label: 'Run Loss Ratio Models', detail: '4 model variants. Ensemble prediction: avg loss ratio 62.4% (±3.1%)',
        status: 'completed', duration: '14s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Verify Outlier Flags', detail: '23 policies with >20% rate change recommendation. All 23 reviewed.',
        status: 'completed', duration: '18 min', agent: 'Verification Queue',
        confidence: 96,
        check: {
          original: 'Policy #OAK-2023-14422: Recommended 34% rate increase',
          corrected: 'Rate increase capped at 25% per state reg. Filed exception with Actuarial Director.',
          flag: 'Regulatory constraint — rate cap applied',
        },
      },
      {
        id: 's5', label: 'Generate Renewal Notices', detail: '1,847 notices generated. 23 with manual cover letters.',
        status: 'completed', duration: '6s', agent: 'Document Generator',
      },
    ],
  },
];

// ─── PINNACLE: Adoption Ops ─────────────────────────────────

export const pinnacleWorkflows: LiveWorkflow[] = [
  {
    id: 'pin-001',
    name: 'Clinical Note Summarization',
    department: 'Primary Care — 12 Providers',
    status: 'running',
    startedAt: '3 min ago',
    savings: 420000,
    cycleTime: { before: '12 min/note', after: '45 sec/note' },
    steps: [
      {
        id: 's1', label: 'Capture Encounter Audio', detail: 'Ambient recording — Dr. Patel, Patient #PH-2024-8847, 14-minute visit',
        status: 'completed', duration: '14 min', agent: 'Audio Capture',
      },
      {
        id: 's2', label: 'Transcribe + Diarize', detail: 'Speaker separation: provider (62%), patient (34%), medical assistant (4%)',
        status: 'completed', duration: '8s', agent: 'Whisper v3',
      },
      {
        id: 's3', label: 'Generate SOAP Note', detail: 'Structured note with ICD-10 codes, CPT suggestions, medication reconciliation',
        status: 'active', duration: '—', agent: 'Clinical AI',
        confidence: 91,
      },
      {
        id: 's4', label: 'Provider Review', detail: 'Dr. Patel reviews in-EHR — edit or approve. Avg review time: 90 seconds.',
        status: 'pending', agent: 'Adoption Checkpoint',
      },
      {
        id: 's5', label: 'Track Adoption Signal', detail: 'Log: time-to-approve, edit distance, provider satisfaction rating',
        status: 'pending', agent: 'Adoption Tracker',
      },
    ],
  },
  {
    id: 'pin-002',
    name: 'Prior Authorization Automation',
    department: 'Revenue Cycle',
    status: 'verified',
    startedAt: '11 min ago',
    savings: 680000,
    cycleTime: { before: '48 hours', after: '4.5 hours' },
    steps: [
      {
        id: 's1', label: 'Detect PA Requirement', detail: 'Order: MRI lumbar spine — Aetna requires prior auth for CPT 72148',
        status: 'completed', duration: '0.2s', agent: 'Rules Engine',
      },
      {
        id: 's2', label: 'Assemble Clinical Evidence', detail: 'Auto-pulled: 6 months PT notes, X-ray results, conservative treatment history',
        status: 'completed', duration: '4.2s', agent: 'Context Assembler',
      },
      {
        id: 's3', label: 'Draft PA Submission', detail: 'Medical necessity narrative + supporting documentation package',
        status: 'completed', duration: '6.8s', agent: 'Clinical AI',
      },
      {
        id: 's4', label: 'Staff Review + Submit', detail: 'Reviewed by S. Chen (auth coordinator). 2 edits. Submitted via Availity.',
        status: 'completed', duration: '4 min', agent: 'Adoption Checkpoint',
        confidence: 94,
        check: {
          original: 'Clinical narrative referenced "chronic back pain" without duration',
          corrected: 'Added: "Patient has experienced chronic lumbar pain for 8+ months with documented failed conservative treatment"',
          flag: 'Payer requirement — medical necessity detail added by staff',
        },
      },
      {
        id: 's5', label: 'Log Adoption Metrics', detail: 'Auth coordinator accepted 94% of draft. Time savings: 43 min this case.',
        status: 'completed', duration: '0.1s', agent: 'Adoption Tracker',
      },
    ],
  },
  {
    id: 'pin-003',
    name: 'Patient Scheduling Optimization',
    department: 'Front Desk Operations',
    status: 'running',
    startedAt: '5 min ago',
    savings: 210000,
    cycleTime: { before: '8 min/call', after: '3.5 min/call' },
    steps: [
      {
        id: 's1', label: 'Inbound Call Received', detail: 'Patient requesting appointment — routed to scheduling AI assistant',
        status: 'completed', duration: '0s', agent: 'Phone System',
      },
      {
        id: 's2', label: 'AI Handles Scheduling', detail: 'Identified provider preference, insurance verification, slot matching',
        status: 'completed', duration: '2.1 min', agent: 'Scheduling AI',
      },
      {
        id: 's3', label: 'Confirm with Patient', detail: 'Appointment confirmed: Dr. Kim, Mar 24, 2:30 PM. SMS confirmation sent.',
        status: 'active', duration: '—', agent: 'Communication Agent',
      },
      {
        id: 's4', label: 'Track Staff Adoption', detail: 'Front desk override rate, patient satisfaction, call duration trends',
        status: 'pending', agent: 'Adoption Tracker',
      },
    ],
  },
];

// ─── ATLAS: Full Operating System ───────────────────────────

export const atlasWorkflows: LiveWorkflow[] = [
  {
    id: 'atl-001',
    name: 'Predictive Maintenance — CNC Fleet',
    department: 'Plant Operations — Akron Facility',
    status: 'running',
    startedAt: '4 min ago',
    savings: 940000,
    cycleTime: { before: 'Reactive (avg 4hr downtime)', after: 'Predictive (15 min pre-alert)' },
    steps: [
      {
        id: 's1', label: 'Ingest Sensor Telemetry', detail: 'IoT stream — 24 CNC machines, vibration + temperature + spindle load, 1Hz sampling',
        status: 'completed', duration: 'continuous', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize + Context Pack', detail: 'Merge sensor data with maintenance history, OEM specs, and operator shift logs',
        status: 'completed', duration: '2.4s', agent: 'Context Assembler',
      },
      {
        id: 's3', label: 'Run Anomaly Detection', detail: 'Machine AK-CNC-07: spindle vibration 2.3σ above baseline. Bearing wear pattern detected.',
        status: 'active', duration: '—', agent: 'Predictive Model',
        confidence: 88,
      },
      {
        id: 's4', label: 'Verify Alert', detail: 'Cross-check against last maintenance date and part lifecycle. Confirm actionability.',
        status: 'pending', agent: 'Verification Queue',
      },
      {
        id: 's5', label: 'Generate Work Order', detail: 'Preventive maintenance order with parts list, estimated downtime, technician assignment',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
      {
        id: 's6', label: 'Track Technician Response', detail: 'Measure: time-to-acknowledge, completion time, parts accuracy',
        status: 'pending', agent: 'Adoption Tracker',
      },
    ],
  },
  {
    id: 'atl-002',
    name: 'Cross-Plant Inventory Optimization',
    department: 'Supply Chain — All Facilities',
    status: 'verified',
    startedAt: '18 min ago',
    savings: 1100000,
    cycleTime: { before: 'Weekly manual review', after: 'Continuous optimization' },
    steps: [
      {
        id: 's1', label: 'Aggregate Inventory Across 4 Plants', detail: 'SAP + 2 legacy WMS systems + spreadsheet imports from Guadalajara facility',
        status: 'completed', duration: '8.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize SKU Taxonomy', detail: '14,200 SKUs across inconsistent naming. Resolved to 11,847 unique items.',
        status: 'completed', duration: '22s', agent: 'Entity Resolution',
      },
      {
        id: 's3', label: 'Identify Duplicate Purchases', detail: '$2.3M in duplicate spend detected across plants. Top: industrial bearings ($340K)',
        status: 'completed', duration: '4.6s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Verify Consolidation Plan', detail: '8 consolidation recommendations reviewed. 2 modified (lead time constraints).',
        status: 'completed', duration: '12 min', agent: 'Verification Queue',
        confidence: 95,
        check: {
          original: 'Consolidate all bearing purchases to single vendor (Timken)',
          corrected: 'Consolidate 3 plants to Timken. Guadalajara keeps local supplier (import duty + 3-week lead time)',
          flag: 'Operational constraint — logistics exception',
        },
      },
      {
        id: 's5', label: 'Push Updated PO Rules', detail: 'SAP purchasing rules updated. Cross-plant visibility dashboard deployed.',
        status: 'completed', duration: '3.1s', agent: 'Integration Agent',
      },
      {
        id: 's6', label: 'Track Procurement Adoption', detail: 'Monitor: requisition compliance rate, maverick spend reduction, cycle time',
        status: 'completed', duration: '0.2s', agent: 'Adoption Tracker',
      },
    ],
  },
  {
    id: 'atl-003',
    name: 'Quality Inspection — Incoming Materials',
    department: 'Quality Assurance — Detroit Plant',
    status: 'flagged',
    startedAt: '9 min ago',
    savings: 380000,
    cycleTime: { before: '2 hours/batch', after: '20 min/batch' },
    steps: [
      {
        id: 's1', label: 'Receive Shipment Data', detail: 'Lot #DET-2026-0312: 4,000 steel blanks from ArcelorMittal, PO #AM-88741',
        status: 'completed', duration: '0.4s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Pull Material Certs', detail: 'Mill test certificate extracted. Chemistry and mechanical properties parsed.',
        status: 'completed', duration: '2.8s', agent: 'Document Intelligence',
      },
      {
        id: 's3', label: 'Compare to Spec Requirements', detail: 'Customer spec AMS-6415: tensile strength min 125 ksi',
        status: 'completed', duration: '0.6s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'FLAG: Spec Deviation Detected', detail: 'Reported tensile: 122 ksi (below 125 ksi minimum). Deviation: -2.4%',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 99,
        check: {
          original: 'Material meets specification (auto-classification)',
          corrected: 'HOLD — tensile strength below AMS-6415 minimum. Requires engineering disposition.',
          flag: 'Critical — material non-conformance detected',
        },
      },
      {
        id: 's5', label: 'Engineering Disposition', detail: 'Awaiting verification — hold shipment, notify supplier, request concession or return',
        status: 'pending', agent: 'Escalation Handler',
      },
    ],
  },
];

// ─── NORTHBRIDGE: Enterprise OS ──────────────────────────

export const northbridgeWorkflows: LiveWorkflow[] = [
  {
    id: 'northbridge-001',
    name: 'Cross-OpCo Procurement Consolidation',
    department: 'Corporate Procurement — 12 Operating Companies',
    status: 'running',
    startedAt: '5 min ago',
    savings: 4800000,
    cycleTime: { before: '3 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Supplier Master Data', detail: 'Pulled supplier records from 12 OpCo SAP instances — 8,400 unique vendor entries',
        status: 'completed', duration: '14s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Deduplicate Supplier Entities', detail: 'Fuzzy matching + DUNS lookup — 8,400 entries resolved to 5,200 unique suppliers. 1,840 duplicates flagged.',
        status: 'completed', duration: '28s', agent: 'Entity Resolution',
        confidence: 94,
      },
      {
        id: 's3', label: 'Price Harmonization Analysis', detail: 'Cross-OpCo price comparison for shared suppliers. 340 items with >15% price variance detected.',
        status: 'completed', duration: '18s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Verify Procurement Duplicates', detail: 'Northbridge Aerospace and Northbridge Energy ordering same titanium alloy from same supplier at 22% price variance.',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 96,
        check: {
          original: 'Separate POs to Titanium Metals Corp — Aerospace: $142/kg, Energy: $174/kg',
          corrected: 'Consolidated PO at negotiated volume price $138/kg — $340K annual savings',
          flag: 'Cross-OpCo duplicate — price variance 22%',
        },
      },
      {
        id: 's5', label: 'Generate Consolidated PO Routing Rules', detail: 'Pending verification clearance — unified purchasing rules across 12 OpCos',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
      {
        id: 's6', label: 'Push to SAP S/4HANA', detail: 'Awaiting upstream completion — update procurement master across all instances',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'northbridge-002',
    name: 'Predictive Maintenance — Industrial Fleet',
    department: 'Operations — 6 Manufacturing Plants',
    status: 'running',
    startedAt: '3 min ago',
    savings: 3600000,
    cycleTime: { before: 'Reactive (avg 6hr downtime)', after: 'Predictive (20 min pre-alert)' },
    steps: [
      {
        id: 's1', label: 'Ingest IoT Sensor Streams', detail: 'Siemens Xcelerator feed — 2,400 machines across 6 plants, vibration + thermal + pressure at 5Hz',
        status: 'completed', duration: 'continuous', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize Cross-Plant Telemetry', detail: 'Unified sensor schema across Siemens, ABB, and Honeywell controllers — 14.2M data points/day',
        status: 'completed', duration: '4.2s', agent: 'Context Assembler',
      },
      {
        id: 's3', label: 'Run Fleet Anomaly Detection', detail: 'ML models scanning all 2,400 machines. 18 anomalies detected — 3 critical, 7 warning, 8 informational.',
        status: 'completed', duration: '12s', agent: 'Predictive Model',
        confidence: 91,
      },
      {
        id: 's4', label: 'Verify Critical Alerts', detail: 'Plant 3 turbine bearing — vibration 3.1σ above baseline. Cross-referencing OEM specs and maintenance history.',
        status: 'active', duration: '—', agent: 'Verification Queue',
        confidence: 93,
        check: {
          original: 'Turbine T3-047: Normal operating range',
          corrected: 'Bearing vibration 3.1σ above baseline — replacement recommended within 72 hours',
          flag: 'Critical — exceeds OEM safety threshold',
        },
      },
      {
        id: 's5', label: 'Generate Maintenance Work Orders', detail: 'Pending verification — batch work orders for 3 critical and 7 warning assets',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
    ],
  },
  {
    id: 'northbridge-003',
    name: 'Financial Close Automation',
    department: 'Finance — Group Consolidation',
    status: 'verified',
    startedAt: '22 min ago',
    savings: 3200000,
    cycleTime: { before: '12 business days', after: '3 business days' },
    steps: [
      {
        id: 's1', label: 'Ingest Trial Balances', detail: 'Pulled GL data from 12 OpCo SAP instances — 48,000 journal entries for month-end close',
        status: 'completed', duration: '8s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Intercompany Elimination', detail: 'Identified and eliminated 2,840 intercompany transactions totaling $142M — 99.4% auto-matched',
        status: 'completed', duration: '34s', agent: 'Reconciliation Agent',
        confidence: 97,
        check: {
          original: 'Intercompany loan: Aerospace → Energy $4.2M — classified as revenue',
          corrected: 'Reclassified as intercompany loan — eliminated in consolidation per IFRS 10',
          flag: 'Misclassification — intercompany elimination error',
        },
      },
      {
        id: 's3', label: 'Currency Translation', detail: 'Translated 4 foreign currency entities (EUR, GBP, JPY, CAD) to USD — rates sourced from Reuters feed',
        status: 'completed', duration: '2.1s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Consolidation & Reporting', detail: 'Generated consolidated P&L, balance sheet, and cash flow. Variance analysis vs prior period complete.',
        status: 'completed', duration: '18s', agent: 'Document Generator',
      },
      {
        id: 's5', label: 'Audit Trail & Sign-off', detail: 'Full decision trace recorded: 2,840 eliminations, 16 corrections, 0 unresolved. CFO sign-off obtained.',
        status: 'completed', duration: '0.4s', agent: 'Audit Logger',
      },
    ],
  },
];

// ─── ESTONIA: Gov AI Platform ───────────────────────────

export const estoniaWorkflows: LiveWorkflow[] = [
  {
    id: 'estonia-001',
    name: 'Tax Return Auto-Assessment',
    department: 'Tax & Revenue Board (EMTA)',
    status: 'running',
    startedAt: '4 min ago',
    savings: 4200000,
    cycleTime: { before: '14 days', after: '48 hours' },
    steps: [
      {
        id: 's1', label: 'Receive e-Filing Submissions', detail: 'Batch of 12,400 personal income tax returns via e-MTA portal — XML/JSON format',
        status: 'completed', duration: '2.4s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Cross-Reference X-Road Data', detail: 'Queried employer wage reports, bank interest statements, and property registry via X-Road — 48,000 data points',
        status: 'completed', duration: '8.2s', agent: 'X-Road Data Agent',
        confidence: 98,
      },
      {
        id: 's3', label: 'Validate Deduction Claims', detail: 'AI analysis of claimed deductions against eligibility rules. 847 returns flagged for review — mortgage interest, education, charity.',
        status: 'completed', duration: '14s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'Auto-Assess Standard Returns', detail: '11,553 returns auto-assessed with no flags. Processing refund calculations for qualifying returns.',
        status: 'active', duration: '—', agent: 'Assessment Engine',
        confidence: 96,
      },
      {
        id: 's5', label: 'Flag Complex Cases for Review', detail: 'Pending — 847 returns requiring manual review by tax officers',
        status: 'pending', agent: 'Escalation Handler',
      },
      {
        id: 's6', label: 'Issue Assessment Notices', detail: 'Awaiting assessment completion — notices via e-MTA portal and Smart-ID notifications',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'estonia-002',
    name: 'Citizen Benefits Eligibility Engine',
    department: 'Social Insurance Board (SKA)',
    status: 'running',
    startedAt: '7 min ago',
    savings: 3800000,
    cycleTime: { before: '10 days', after: '24 hours' },
    steps: [
      {
        id: 's1', label: 'Receive Benefit Applications', detail: 'Daily batch: 2,140 applications — family benefits, disability, unemployment, parental leave',
        status: 'completed', duration: '1.2s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Cross-Ministry Data Stitching', detail: 'X-Road queries to Tax Board (income), Population Registry (family), Health Insurance Fund (medical), Employment Board (status)',
        status: 'completed', duration: '12s', agent: 'X-Road Data Agent',
        confidence: 97,
      },
      {
        id: 's3', label: 'Eligibility Determination', detail: '1,840 applications auto-determined eligible. 180 flagged for income discrepancy, 120 for missing documentation.',
        status: 'completed', duration: '8.4s', agent: 'Rules Engine',
      },
      {
        id: 's4', label: 'Verify Income Discrepancies', detail: 'Cross-checking Tax Board reported income vs Social Insurance registered income for 180 flagged applications.',
        status: 'active', duration: '—', agent: 'Verification Queue',
        confidence: 89,
        check: {
          original: 'Applicant #EE-2026-44821: Income €28,000 (Social Insurance) — eligible for family benefit',
          corrected: 'Tax Board reports income €42,000 — exceeds eligibility threshold. Benefit suspended pending investigation.',
          flag: 'Income mismatch — X-Road cross-reference conflict',
        },
      },
      {
        id: 's5', label: 'Issue Benefit Determinations', detail: 'Pending verification — approved applications to payment system, flagged to case officers',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'estonia-003',
    name: 'Healthcare Records Integration',
    department: 'Health & Welfare Information Systems (TEHIK)',
    status: 'verified',
    startedAt: '18 min ago',
    savings: 3400000,
    cycleTime: { before: '3 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Provider Health Records', detail: 'HL7 FHIR feeds from 42 healthcare providers — 84,000 patient records, lab results, prescriptions',
        status: 'completed', duration: '24s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize Medical Terminology', detail: 'Mapped provider-specific codes to ICD-10-EE and ATC classification. 99.2% auto-mapped, 0.8% flagged.',
        status: 'completed', duration: '42s', agent: 'Schema Mapper',
        confidence: 95,
      },
      {
        id: 's3', label: 'Resolve Patient Identities', detail: 'Cross-referenced via personal ID code (isikukood). 84,000 records matched to 62,400 unique patients.',
        status: 'completed', duration: '18s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Build Longitudinal Records', detail: 'Assembled unified patient timelines combining GP visits, specialist consultations, hospital stays, and prescriptions.',
        status: 'completed', duration: '34s', agent: 'Context Assembler',
      },
      {
        id: 's5', label: 'Quality Validation & Publish', detail: 'All records validated. Published to National Health Information System. 0 data quality issues remaining.',
        status: 'completed', duration: '4.2s', agent: 'Integration Agent',
      },
    ],
  },
];

export function getWorkflowsForCompany(companyId: string): LiveWorkflow[] {
  switch (companyId) {
    case 'meridian': return meridianWorkflows;
    case 'oakwood': return oakwoodWorkflows;
    case 'pinnacle': return pinnacleWorkflows;
    case 'atlas': return atlasWorkflows;
    case 'northbridge': return northbridgeWorkflows;
    case 'estonia': return estoniaWorkflows;
    default: return meridianWorkflows;
  }
}
