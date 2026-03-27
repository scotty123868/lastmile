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
    name: 'Track Geometry Analysis — Northeast Corridor',
    department: 'Rail Testing Division (HSI)',
    status: 'running',
    startedAt: '3 min ago',
    savings: 480000,
    cycleTime: { before: '6.8 hours', after: '22 min' },
    steps: [
      {
        id: 's1', label: 'Ingest LIDAR Scan Data', detail: 'RailSentry scan — NEC Segment 47, MP 142.3 to MP 148.7, captured 2026-03-25',
        status: 'completed', duration: '1.8s', agent: 'Ingestion Agent',
      },
      {
        id: 's2', label: 'Extract Track Geometry Metrics', detail: 'Cross-level, alignment, gauge, profile — 14,200 measurement points across 6.4 track-miles',
        status: 'completed', duration: '4.2s', agent: 'GPT-4o Extraction',
      },
      {
        id: 's3', label: 'Cross-Reference FRA Class Standards', detail: 'Matched to FRA Track Class 4 (60 mph freight / 80 mph passenger) — 49 CFR §213 tolerances applied',
        status: 'completed', duration: '1.4s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Verify Defect Classifications', detail: '8 geometry exceptions detected — 2 urgent (cross-level >1.75"), 6 priority maintenance',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 96,
        check: {
          original: 'MP 144.8: Cross-level deviation 1.62" — classified as Priority',
          corrected: 'MP 144.8: Cross-level deviation 1.82" — reclassified as Urgent per §213.63 (>1.75" Class 4 threshold)',
          flag: 'Safety — FRA defect reclassification',
        },
      },
      {
        id: 's5', label: 'Generate Maintenance Work Order', detail: 'Pending verification clearance — will route to HCC track crew Midwest Region',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
      {
        id: 's6', label: 'Push to Dispatch System', detail: 'Awaiting upstream completion — GPS ballast train scheduling integration',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'mer-002',
    name: 'Crew Dispatch Optimization — Midwest Division',
    department: 'Railroad Services (HRSI)',
    status: 'verified',
    startedAt: '18 min ago',
    savings: 620000,
    cycleTime: { before: '3.2 hours', after: '14 min' },
    steps: [
      {
        id: 's1', label: 'Ingest Crew Availability Data', detail: 'HRSI dispatch system — 84 crews across 12 states, certification records + hours-of-service compliance',
        status: 'completed', duration: '2.4s', agent: 'Ingestion Agent',
      },
      {
        id: 's2', label: 'Extract Work Order Queue', detail: '142 open work orders — track surfacing, tie replacement, ballast distribution, signal maintenance',
        status: 'completed', duration: '3.8s', agent: 'GPT-4o Extraction',
      },
      {
        id: 's3', label: 'Match Crews to Work Orders', detail: '128 of 142 auto-assigned based on certification, proximity, and equipment availability. 14 require manual review.',
        status: 'completed', duration: '6.2s', agent: 'Optimization Agent',
      },
      {
        id: 's4', label: 'Verify Hours-of-Service Compliance', detail: 'FRA HOS rules validated for all 84 crews — 3 crews flagged approaching 12-hour limit',
        status: 'completed', duration: '4 min', agent: 'Verification Queue',
        confidence: 98,
        check: {
          original: 'Crew #MW-34: Assigned tie gang deployment — scheduled 6:00 AM start',
          corrected: 'Crew #MW-34: Start time shifted to 7:30 AM — previous shift ended 8:12 PM, FRA requires 10-hour rest (49 CFR §228)',
          flag: 'HOS Compliance — rest period adjustment',
        },
      },
      {
        id: 's5', label: 'Publish Dispatch Schedule', detail: 'All 142 work orders assigned. Average crew utilization: 87% (up from 72% manual baseline).',
        status: 'completed', duration: '1.2s', agent: 'Integration Agent',
      },
      {
        id: 's6', label: 'Archive + Audit Trail', detail: 'Decision trace recorded: 14 manual overrides, 3 HOS adjustments, 0 unresolved',
        status: 'completed', duration: '0.3s', agent: 'Audit Logger',
      },
    ],
  },
  {
    id: 'mer-003',
    name: 'Equipment Utilization Report — Q1 Fleet Review',
    department: 'Construction Division (HCC)',
    status: 'running',
    startedAt: '8 min ago',
    savings: 940000,
    cycleTime: { before: '2 weeks', after: '45 min' },
    steps: [
      {
        id: 's1', label: 'Pull Fleet Telemetry', detail: 'GPS ballast trains, tampers, regulators, tie cranes — 320 units across 36 states, last 90 days',
        status: 'completed', duration: '6.4s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Cross-Reference Maintenance Schedules', detail: 'TAM-4 and SpeedTrax maintenance logs matched to equipment IDs — 2,847 service records',
        status: 'completed', duration: '4.2s', agent: 'Entity Resolution',
      },
      {
        id: 's3', label: 'Calculate Utilization Rates', detail: 'Fleet avg: 64%. 28 units below 40% threshold. GPS ballast trains at 78% (above target).',
        status: 'active', duration: '—', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Generate Redeployment Plan', detail: 'Pending analysis completion — will optimize for upcoming Class I railroad maintenance windows',
        status: 'pending', agent: 'Optimization Agent',
      },
      {
        id: 's5', label: 'Verify Recommendations', detail: 'Human review required for equipment redeployment >$250K or cross-division transfers',
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
    name: 'Cross-Division Procurement Consolidation',
    department: 'Corporate Procurement — 12 Operating Companies',
    status: 'running',
    startedAt: '5 min ago',
    savings: 4800000,
    cycleTime: { before: '3 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Supplier Master Data', detail: 'Pulled supplier records from 7 division SAP instances — 8,400 unique vendor entries',
        status: 'completed', duration: '14s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Deduplicate Supplier Entities', detail: 'Fuzzy matching + DUNS lookup — 8,400 entries resolved to 5,200 unique suppliers. 1,840 duplicates flagged.',
        status: 'completed', duration: '28s', agent: 'Entity Resolution',
        confidence: 94,
      },
      {
        id: 's3', label: 'Price Harmonization Analysis', detail: 'Cross-division price comparison for shared suppliers. 340 items with >15% price variance detected.',
        status: 'completed', duration: '18s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Verify Procurement Duplicates', detail: 'Northbridge Aerospace and Northbridge Energy ordering same titanium alloy from same supplier at 22% price variance.',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 96,
        check: {
          original: 'Separate POs to Titanium Metals Corp — Aerospace: $142/kg, Energy: $174/kg',
          corrected: 'Consolidated PO at negotiated volume price $138/kg — $340K annual savings',
          flag: 'Cross-division duplicate — price variance 22%',
        },
      },
      {
        id: 's5', label: 'Generate Consolidated PO Routing Rules', detail: 'Pending verification clearance — unified purchasing rules across 7 divisions',
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
        id: 's1', label: 'Ingest Trial Balances', detail: 'Pulled GL data from 7 division SAP instances — 48,000 journal entries for month-end close',
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

// ─── NB AEROSPACE: Aviation Compliance Ops ──────────────────

export const nbAerospaceWorkflows: LiveWorkflow[] = [
  {
    id: 'nba-001',
    name: 'Flight Certification Document Review',
    department: 'Airworthiness & Certification',
    status: 'running',
    startedAt: '3 min ago',
    savings: 720000,
    cycleTime: { before: '6 weeks', after: '4 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Type Certificate Data Sheets', detail: 'FAA TCDS batch upload — 84 documents for NB-X900 turbofan engine re-certification',
        status: 'completed', duration: '1.8s', agent: 'Document Intelligence',
      },
      {
        id: 's2', label: 'Extract Compliance Requirements', detail: 'Parsed 14 CFR Part 33 requirements — 142 compliance items identified across airworthiness directives',
        status: 'completed', duration: '6.4s', agent: 'GPT-4o Extraction',
        confidence: 94,
      },
      {
        id: 's3', label: 'Cross-Reference Test Reports', detail: 'Matching compliance items to engine test data — 128 of 142 items auto-verified against test results',
        status: 'active', duration: '—', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'Generate Compliance Matrix', detail: 'Pending — consolidated compliance matrix for DER review',
        status: 'pending', agent: 'Document Generator',
      },
      {
        id: 's5', label: 'Route to DER for Sign-off', detail: 'Awaiting upstream — Designated Engineering Representative final review',
        status: 'pending', agent: 'Workflow Router',
      },
    ],
  },
  {
    id: 'nba-002',
    name: 'Supplier Quality Audit Processing',
    department: 'Supply Chain Quality — AS9100',
    status: 'verified',
    startedAt: '16 min ago',
    savings: 480000,
    cycleTime: { before: '10 days', after: '1.5 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Audit Findings', detail: 'AS9100 audit reports from 24 Tier-1 suppliers — 312 findings across quality management systems',
        status: 'completed', duration: '3.2s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Classify Finding Severity', detail: 'AI categorization: 4 major nonconformities, 28 minor, 280 observations. Risk-scored per AS9100 Rev D.',
        status: 'completed', duration: '4.8s', agent: 'Analytics Agent',
        confidence: 96,
      },
      {
        id: 's3', label: 'Map to Corrective Actions', detail: 'Auto-generated CAPA recommendations for 32 nonconformities based on historical resolution patterns',
        status: 'completed', duration: '8.2s', agent: 'Context Assembler',
      },
      {
        id: 's4', label: 'Verify Major Findings', detail: '4 major NCRs reviewed by Quality Director. All confirmed with recommended CAPAs approved.',
        status: 'completed', duration: '14 min', agent: 'Verification Queue',
        confidence: 98,
        check: {
          original: 'Supplier TitanForge: Process control deviation — heat treatment records incomplete',
          corrected: 'Elevated to critical — heat treatment traceability required for flight-critical components per NADCAP AC7102',
          flag: 'Severity upgrade — flight safety implication',
        },
      },
      {
        id: 's5', label: 'Issue CAPA Notices to Suppliers', detail: 'All 32 CAPA notices issued via supplier portal. Response deadline: 30 days.',
        status: 'completed', duration: '2.4s', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'nba-003',
    name: 'Maintenance Schedule Optimization',
    department: 'MRO Planning — Fleet Operations',
    status: 'flagged',
    startedAt: '8 min ago',
    savings: 1200000,
    cycleTime: { before: '2 weeks', after: '3 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Fleet Maintenance Logs', detail: 'AMOS MRO system — 48 aircraft, 2,400 maintenance events over last 12 months',
        status: 'completed', duration: '6.8s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Analyze Component Life Cycles', detail: 'Time-between-overhaul analysis for 840 tracked components — LRU and rotable parts',
        status: 'completed', duration: '14s', agent: 'Analytics Agent',
        confidence: 92,
      },
      {
        id: 's3', label: 'Optimize Maintenance Windows', detail: 'Proposed consolidated check schedule — 18% reduction in aircraft-on-ground days',
        status: 'completed', duration: '22s', agent: 'Optimization Agent',
      },
      {
        id: 's4', label: 'FLAG: AD Compliance Gap Detected', detail: 'Aircraft NB-734: Airworthiness Directive 2026-04-12 requires landing gear inspection before next C-check — not in current schedule',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 99,
        check: {
          original: 'Landing gear inspection scheduled at next C-check (Aug 2026)',
          corrected: 'AD 2026-04-12 mandates inspection within 500 flight cycles — aircraft at 487 cycles. Immediate scheduling required.',
          flag: 'Critical — AD compliance deadline imminent',
        },
      },
      {
        id: 's5', label: 'Issue Revised Schedule', detail: 'Pending verification — updated MRO schedule with AD compliance correction',
        status: 'pending', agent: 'Workflow Orchestrator',
      },
    ],
  },
];

// ─── NB ENERGY: Grid & Pipeline Ops ─────────────────────────

export const nbEnergyWorkflows: LiveWorkflow[] = [
  {
    id: 'nbe-001',
    name: 'Grid Load Forecasting Pipeline',
    department: 'Grid Operations — Regional Control Center',
    status: 'running',
    startedAt: '2 min ago',
    savings: 860000,
    cycleTime: { before: '4 hours', after: '25 min' },
    steps: [
      {
        id: 's1', label: 'Ingest SCADA & Weather Data', detail: 'Real-time feeds from 340 substations + NOAA 72-hour forecast — temperature, humidity, solar irradiance',
        status: 'completed', duration: '3.4s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize Load Profiles', detail: 'Aggregated historical load curves for 12 distribution zones — 14.8M data points over 90 days',
        status: 'completed', duration: '8.6s', agent: 'Context Assembler',
        confidence: 95,
      },
      {
        id: 's3', label: 'Run Demand Forecast Models', detail: 'Ensemble of 3 models (LSTM, gradient boost, transformer) — 48-hour ahead forecast. MAPE: 2.1%',
        status: 'active', duration: '—', agent: 'Predictive Model',
      },
      {
        id: 's4', label: 'Generate Dispatch Recommendations', detail: 'Pending — optimal generation mix considering fuel costs, emissions limits, and reserve margins',
        status: 'pending', agent: 'Optimization Agent',
      },
      {
        id: 's5', label: 'Publish to EMS', detail: 'Awaiting upstream — push forecast to Energy Management System for operator review',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'nbe-002',
    name: 'Pipeline Inspection Report Analysis',
    department: 'Pipeline Integrity — Transmission Division',
    status: 'verified',
    startedAt: '19 min ago',
    savings: 640000,
    cycleTime: { before: '3 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Ingest ILI Pig Run Data', detail: 'In-line inspection results for Pipeline Segment TX-447 — 84 miles, MFL + caliper tools',
        status: 'completed', duration: '12s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Extract Anomaly Features', detail: 'Identified 247 metal loss anomalies — classified by depth, length, orientation per ASME B31.8S',
        status: 'completed', duration: '18s', agent: 'Analytics Agent',
        confidence: 94,
      },
      {
        id: 's3', label: 'Run Remaining Life Assessment', detail: 'RSTRENG calculations for 247 anomalies — 12 require repair within 1 year, 42 within 3 years',
        status: 'completed', duration: '8.4s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'Verify Critical Anomalies', detail: '12 critical anomalies reviewed by pipeline integrity engineer. All repair recommendations confirmed.',
        status: 'completed', duration: '22 min', agent: 'Verification Queue',
        confidence: 97,
        check: {
          original: 'Anomaly TX-447-0089: 62% wall loss at mile marker 34.2 — monitor at next inspection',
          corrected: 'Reclassified as immediate repair — exceeds MAOP safety factor at current operating pressure',
          flag: 'Safety critical — repair schedule accelerated',
        },
      },
      {
        id: 's5', label: 'Generate Dig Plan & Work Orders', detail: 'Repair work orders issued for 12 critical sites. Dig plan optimized for minimal service disruption.',
        status: 'completed', duration: '4.8s', agent: 'Document Generator',
      },
    ],
  },
  {
    id: 'nbe-003',
    name: 'SCADA Anomaly Detection',
    department: 'Cybersecurity — OT Security Operations',
    status: 'flagged',
    startedAt: '6 min ago',
    savings: 540000,
    cycleTime: { before: 'Reactive (post-incident)', after: 'Real-time detection' },
    steps: [
      {
        id: 's1', label: 'Ingest SCADA Network Traffic', detail: 'Deep packet inspection feed — Modbus TCP, DNP3, IEC 61850 protocols across 340 substations',
        status: 'completed', duration: 'continuous', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Baseline Communication Patterns', detail: 'Normal traffic fingerprints for 2,400 RTU/PLC endpoints — updated hourly with sliding window',
        status: 'completed', duration: '4.2s', agent: 'Analytics Agent',
      },
      {
        id: 's3', label: 'Detect Protocol Anomalies', detail: 'Unusual Modbus write commands detected from engineering workstation EW-042 to 3 substations outside maintenance window',
        status: 'completed', duration: '0.8s', agent: 'Anomaly Detector',
        confidence: 87,
      },
      {
        id: 's4', label: 'FLAG: Unauthorized SCADA Commands', detail: 'EW-042 issuing setpoint changes to substations S-112, S-118, S-124 — no change ticket found in ServiceNow',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 92,
        check: {
          original: 'Engineering workstation authorized for SCADA writes during maintenance windows',
          corrected: 'No active maintenance window. No change ticket. Workstation user account not logged in via SSO. Potential unauthorized access.',
          flag: 'Critical — possible unauthorized SCADA access',
        },
      },
      {
        id: 's5', label: 'Trigger Incident Response', detail: 'Pending verification — isolate workstation, notify SOC, preserve forensic evidence',
        status: 'pending', agent: 'Escalation Handler',
      },
    ],
  },
];

// ─── NB FINANCIAL: Banking & Compliance Ops ─────────────────

export const nbFinancialWorkflows: LiveWorkflow[] = [
  {
    id: 'nbf-001',
    name: 'AML Transaction Screening',
    department: 'Financial Crimes — BSA/AML Compliance',
    status: 'running',
    startedAt: '1 min ago',
    savings: 1400000,
    cycleTime: { before: '72 hours', after: '4 hours' },
    steps: [
      {
        id: 's1', label: 'Ingest Transaction Batch', detail: 'Daily wire transfer batch — 18,400 transactions totaling $2.4B across correspondent banking network',
        status: 'completed', duration: '4.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Run Sanctions Screening', detail: 'OFAC SDN, EU consolidated list, UN sanctions — 18,400 transactions screened. 142 potential hits.',
        status: 'completed', duration: '12s', agent: 'Rules Engine',
        confidence: 96,
      },
      {
        id: 's3', label: 'AI-Powered Alert Disposition', detail: 'ML model scoring 142 alerts — 118 classified as false positives (name similarity, common entities). 24 require investigation.',
        status: 'active', duration: '—', agent: 'Analytics Agent',
        confidence: 93,
      },
      {
        id: 's4', label: 'Generate SARs for Confirmed Cases', detail: 'Pending — Suspicious Activity Report drafts for confirmed cases',
        status: 'pending', agent: 'Document Generator',
      },
      {
        id: 's5', label: 'Route to BSA Officer', detail: 'Awaiting upstream — case packages with full transaction trails for officer review',
        status: 'pending', agent: 'Workflow Router',
      },
    ],
  },
  {
    id: 'nbf-002',
    name: 'Regulatory Filing Automation',
    department: 'Regulatory Reporting — SEC & OCC',
    status: 'verified',
    startedAt: '24 min ago',
    savings: 680000,
    cycleTime: { before: '5 business days', after: '8 hours' },
    steps: [
      {
        id: 's1', label: 'Aggregate Reporting Data', detail: 'Call Report (FFIEC 031) data pull — GL balances, loan schedules, capital ratios from core banking system',
        status: 'completed', duration: '18s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Apply Regulatory Mappings', detail: 'Mapped 4,200 GL accounts to MDRM codes — 98.8% auto-mapped, 52 exceptions flagged',
        status: 'completed', duration: '14s', agent: 'Schema Mapper',
        confidence: 97,
      },
      {
        id: 's3', label: 'Run Validation Rules', detail: 'FFIEC quality checks — 847 edit rules applied. 4 quality edits, 0 validity edits.',
        status: 'completed', duration: '6.2s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'Verify Quality Edits', detail: '4 quality edits reviewed by Controller. 3 confirmed as data changes, 1 reclassified.',
        status: 'completed', duration: '18 min', agent: 'Verification Queue',
        confidence: 98,
        check: {
          original: 'Schedule RC-C: Total loans increased 28% QoQ — edit check threshold exceeded',
          corrected: 'Confirmed — acquisition of Pacific Credit Union loan portfolio ($840M) explains variance. Documentation attached.',
          flag: 'Expected variance — acquisition-related',
        },
      },
      {
        id: 's5', label: 'Submit to FFIEC CDR', detail: 'Call Report submitted via Central Data Repository. Confirmation #CDR-2026-Q1-0847 received.',
        status: 'completed', duration: '2.8s', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'nbf-003',
    name: 'Credit Risk Model Validation',
    department: 'Model Risk Management — MRM',
    status: 'flagged',
    startedAt: '12 min ago',
    savings: 920000,
    cycleTime: { before: '8 weeks', after: '2 weeks' },
    steps: [
      {
        id: 's1', label: 'Ingest Model Documentation', detail: 'PD/LGD model package — model specification, development data, validation test results for C&I loan portfolio',
        status: 'completed', duration: '3.4s', agent: 'Document Intelligence',
      },
      {
        id: 's2', label: 'Run Back-Testing Suite', detail: 'Binomial test, Hosmer-Lemeshow, traffic light approach — 36-month out-of-sample window',
        status: 'completed', duration: '42s', agent: 'Analytics Agent',
        confidence: 88,
      },
      {
        id: 's3', label: 'Benchmark Against Challenger Models', detail: 'Champion-challenger comparison: incumbent PD model AUROC 0.74, challenger 0.81',
        status: 'completed', duration: '28s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'FLAG: Model Performance Degradation', detail: 'PD model AUROC declined from 0.82 (development) to 0.74 (current) — below SR 11-7 threshold for material deviation',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 95,
        check: {
          original: 'Model performance within acceptable range — annual attestation recommended',
          corrected: 'Material performance degradation detected. Recommend model redevelopment per SR 11-7 and OCC 2011-12 guidance.',
          flag: 'Regulatory risk — model below performance threshold',
        },
      },
      {
        id: 's5', label: 'Issue MRM Findings Report', detail: 'Pending verification — findings report with redevelopment timeline for Model Governance Committee',
        status: 'pending', agent: 'Document Generator',
      },
    ],
  },
];

// ─── NB HEALTH: Pharma & Clinical Ops ───────────────────────

export const nbHealthWorkflows: LiveWorkflow[] = [
  {
    id: 'nbh-001',
    name: 'Clinical Trial Data Ingestion',
    department: 'Clinical Data Management — Phase III Trials',
    status: 'running',
    startedAt: '4 min ago',
    savings: 980000,
    cycleTime: { before: '2 weeks', after: '3 days' },
    steps: [
      {
        id: 's1', label: 'Ingest EDC Submissions', detail: 'Medidata Rave export — Trial NB-ONCO-042, 1,240 patient visits across 28 clinical sites',
        status: 'completed', duration: '8.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Run Edit Check Validations', detail: 'CDASH/CDISC compliance — 48,000 data points validated. 847 queries auto-generated for site resolution.',
        status: 'completed', duration: '14s', agent: 'Validation Engine',
        confidence: 96,
      },
      {
        id: 's3', label: 'Reconcile Lab & Safety Data', detail: 'Central lab results matched to EDC entries — 98.4% concordance. 72 discrepancies flagged for medical review.',
        status: 'active', duration: '—', agent: 'Reconciliation Agent',
      },
      {
        id: 's4', label: 'Generate Data Review Listings', detail: 'Pending — patient data listings for medical monitor review',
        status: 'pending', agent: 'Document Generator',
      },
      {
        id: 's5', label: 'Update Trial Master File', detail: 'Awaiting upstream — TMF document indexing per DIA reference model',
        status: 'pending', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'nbh-002',
    name: 'Batch Record Quality Review',
    department: 'Manufacturing Quality — cGMP Operations',
    status: 'verified',
    startedAt: '21 min ago',
    savings: 740000,
    cycleTime: { before: '5 days', after: '12 hours' },
    steps: [
      {
        id: 's1', label: 'Ingest Batch Production Records', detail: 'MES export — Batch #NB-2026-0312, monoclonal antibody drug substance, 2,000L bioreactor run',
        status: 'completed', duration: '4.6s', agent: 'Document Intelligence',
      },
      {
        id: 's2', label: 'Extract Critical Process Parameters', detail: 'Parsed 142 CPPs — pH, temperature, dissolved oxygen, cell viability, titer across 14-day culture',
        status: 'completed', duration: '8.8s', agent: 'GPT-4o Extraction',
        confidence: 97,
      },
      {
        id: 's3', label: 'Compare to Validated Ranges', detail: 'All 142 CPPs within validated ranges. In-process controls and release specs checked against filing commitments.',
        status: 'completed', duration: '2.4s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'Verify Deviation Records', detail: '2 minor deviations reviewed — temperature excursion (0.3°C, 12 min) and pH drift (0.02 units). Both within acceptable limits.',
        status: 'completed', duration: '16 min', agent: 'Verification Queue',
        confidence: 98,
        check: {
          original: 'Temperature excursion at hour 142: 37.3°C (limit: 37.0°C ± 0.5°C)',
          corrected: 'Within validated range. Impact assessment: no effect on CQAs. Batch disposition: approved for release.',
          flag: 'Minor deviation — no impact on product quality',
        },
      },
      {
        id: 's5', label: 'Issue Batch Disposition', detail: 'Batch #NB-2026-0312 approved for release. QA sign-off recorded in QMS.',
        status: 'completed', duration: '1.2s', agent: 'Audit Logger',
      },
    ],
  },
  {
    id: 'nbh-003',
    name: 'Adverse Event Signal Detection',
    department: 'Pharmacovigilance — Drug Safety',
    status: 'flagged',
    startedAt: '7 min ago',
    savings: 1100000,
    cycleTime: { before: '30 days', after: '5 days' },
    steps: [
      {
        id: 's1', label: 'Ingest ICSR Reports', detail: 'Individual Case Safety Reports from FAERS, EudraVigilance, and company safety database — 4,200 reports this period',
        status: 'completed', duration: '6.4s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'MedDRA Coding & Deduplication', detail: 'Auto-coded to MedDRA v27.0 — Preferred Terms and System Organ Classes. 380 duplicate pairs identified and merged.',
        status: 'completed', duration: '18s', agent: 'Entity Resolution',
        confidence: 94,
      },
      {
        id: 's3', label: 'Run Disproportionality Analysis', detail: 'PRR, ROR, and EBGM calculations across all drug-event combinations. Statistical signals evaluated.',
        status: 'completed', duration: '34s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'FLAG: New Safety Signal Detected', detail: 'Product NB-Cardio-X: hepatotoxicity signal — PRR 3.4 (threshold 2.0), 18 cases with elevated ALT >5x ULN',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 91,
        check: {
          original: 'Hepatotoxicity reports within expected background rate',
          corrected: 'Signal confirmed — disproportionate reporting of hepatotoxicity vs comparator products. Recommend urgent PRAC/FDA notification.',
          flag: 'Safety signal — requires regulatory notification within 15 days',
        },
      },
      {
        id: 's5', label: 'Generate Signal Assessment Report', detail: 'Pending verification — CIOMS Working Group VIII format report for regulatory submission',
        status: 'pending', agent: 'Document Generator',
      },
    ],
  },
];

// ─── EE FINANCE: Ministry of Finance ────────────────────────

export const eeFinanceWorkflows: LiveWorkflow[] = [
  {
    id: 'eef-001',
    name: 'Tax Return Validation Pipeline',
    department: 'Tax & Customs Board — Compliance Division',
    status: 'running',
    startedAt: '5 min ago',
    savings: 1800000,
    cycleTime: { before: '21 days', after: '72 hours' },
    steps: [
      {
        id: 's1', label: 'Receive VAT Return Submissions', detail: 'Monthly batch — 24,800 VAT returns from registered businesses via e-MTA portal',
        status: 'completed', duration: '3.8s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Cross-Reference X-Road Data', detail: 'Business Registry (RIK), Employment Registry, Bank transaction summaries — 148,000 data points',
        status: 'completed', duration: '12s', agent: 'X-Road Data Agent',
        confidence: 97,
      },
      {
        id: 's3', label: 'Run Risk Scoring Models', detail: 'ML-based risk assessment — 22,400 returns auto-approved, 2,400 flagged for anomaly patterns (carousel fraud, missing trader)',
        status: 'active', duration: '—', agent: 'Analytics Agent',
        confidence: 94,
      },
      {
        id: 's4', label: 'Generate Audit Referrals', detail: 'Pending — high-risk cases packaged with evidence summaries for tax auditors',
        status: 'pending', agent: 'Document Generator',
      },
      {
        id: 's5', label: 'Issue Assessment Notices', detail: 'Awaiting upstream — auto-approved returns confirmed via e-MTA, flagged returns held',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'eef-002',
    name: 'Budget Reconciliation Automation',
    department: 'State Budget Department — Fiscal Planning',
    status: 'verified',
    startedAt: '18 min ago',
    savings: 920000,
    cycleTime: { before: '2 weeks', after: '2 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Ministry Budget Executions', detail: 'SAP S/4HANA public sector — 14 ministry budget execution reports, 84,000 line items for Q1 2026',
        status: 'completed', duration: '8.4s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize Budget Classifications', detail: 'Mapped expenditures to COFOG functional classification and Estonian budget nomenclature — 99.1% auto-mapped',
        status: 'completed', duration: '6.2s', agent: 'Schema Mapper',
        confidence: 96,
      },
      {
        id: 's3', label: 'Variance Analysis vs Appropriations', detail: 'Compared actual spend to appropriated amounts. 8 budget programs with >10% variance identified.',
        status: 'completed', duration: '4.8s', agent: 'Analytics Agent',
      },
      {
        id: 's4', label: 'Verify Significant Variances', detail: '8 variances reviewed. 5 explained by timing differences, 3 require supplementary budget requests.',
        status: 'completed', duration: '22 min', agent: 'Verification Queue',
        confidence: 95,
        check: {
          original: 'Ministry of Defence: 18% over-execution in Q1 — flagged as potential overrun',
          corrected: 'Front-loaded procurement per NATO commitment schedule. Full-year forecast within appropriation. No supplementary needed.',
          flag: 'Timing variance — planned front-loading',
        },
      },
      {
        id: 's5', label: 'Publish Fiscal Report', detail: 'Q1 budget execution report published to Riigikogu Finance Committee portal.',
        status: 'completed', duration: '1.8s', agent: 'Document Generator',
      },
    ],
  },
  {
    id: 'eef-003',
    name: 'Fiscal Audit Trail Analysis',
    department: 'National Audit Office — Performance Audit',
    status: 'flagged',
    startedAt: '10 min ago',
    savings: 640000,
    cycleTime: { before: '6 weeks', after: '1 week' },
    steps: [
      {
        id: 's1', label: 'Ingest Public Procurement Records', detail: 'e-Procurement portal data — 4,200 contracts awarded in Q4 2025, total value €847M',
        status: 'completed', duration: '6.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Analyze Award Patterns', detail: 'Statistical analysis of bidding patterns, sole-source frequency, and vendor concentration across ministries',
        status: 'completed', duration: '18s', agent: 'Analytics Agent',
        confidence: 91,
      },
      {
        id: 's3', label: 'Cross-Reference Beneficial Ownership', detail: 'Business Registry ownership data matched to procurement awards — conflict of interest screening',
        status: 'completed', duration: '24s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'FLAG: Procurement Irregularity Detected', detail: 'Ministry of Environment: 4 IT contracts awarded to companies with shared beneficial owners — total €2.4M, all below mandatory tender threshold',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 88,
        check: {
          original: 'Contracts individually below €60K threshold — no procurement violation detected',
          corrected: 'Pattern of contract splitting suspected — 4 related contracts totaling €2.4M awarded within 6 weeks to connected entities',
          flag: 'Procurement integrity — potential contract splitting',
        },
      },
      {
        id: 's5', label: 'Generate Audit Finding Report', detail: 'Pending verification — finding report for Auditor General review and Riigikogu submission',
        status: 'pending', agent: 'Document Generator',
      },
    ],
  },
];

// ─── EE SOCIAL: Ministry of Social Affairs ──────────────────

export const eeSocialWorkflows: LiveWorkflow[] = [
  {
    id: 'ees-001',
    name: 'Benefit Eligibility Assessment',
    department: 'Social Insurance Board — Benefits Division',
    status: 'running',
    startedAt: '3 min ago',
    savings: 1600000,
    cycleTime: { before: '12 days', after: '36 hours' },
    steps: [
      {
        id: 's1', label: 'Receive Benefit Applications', detail: 'Daily intake — 1,840 applications for family benefits, disability allowance, and parental leave via eesti.ee',
        status: 'completed', duration: '1.4s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Cross-Ministry Data Assembly', detail: 'X-Road queries to Population Registry, Tax Board (income), Health Insurance Fund, Employment Board — 42,000 data points',
        status: 'completed', duration: '8.8s', agent: 'X-Road Data Agent',
        confidence: 96,
      },
      {
        id: 's3', label: 'Apply Eligibility Rules Engine', detail: 'Automated assessment against Social Welfare Act criteria — 1,620 auto-approved, 220 flagged for review',
        status: 'active', duration: '—', agent: 'Rules Engine',
        confidence: 93,
      },
      {
        id: 's4', label: 'Route Flagged Cases to Officers', detail: 'Pending — 220 cases requiring manual review for income discrepancy or missing documentation',
        status: 'pending', agent: 'Workflow Router',
      },
      {
        id: 's5', label: 'Issue Determination Notices', detail: 'Awaiting upstream — approved benefits to payment system, determinations via eesti.ee portal',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'ees-002',
    name: 'Health Records Integration Pipeline',
    department: 'TEHIK — Health Information Systems',
    status: 'verified',
    startedAt: '15 min ago',
    savings: 1200000,
    cycleTime: { before: '3 weeks', after: '48 hours' },
    steps: [
      {
        id: 's1', label: 'Ingest Provider Health Data', detail: 'HL7 FHIR feeds from 38 healthcare providers — 62,000 patient encounters, lab results, e-prescriptions',
        status: 'completed', duration: '18s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Normalize to Estonian Health Schema', detail: 'Mapped provider codes to ICD-10-EE, ATC drug classification, and SNOMED CT — 98.8% auto-mapped',
        status: 'completed', duration: '28s', agent: 'Schema Mapper',
        confidence: 96,
      },
      {
        id: 's3', label: 'Resolve Patient Identities', detail: 'Isikukood-based matching — 62,000 encounters linked to 48,200 unique patients in National Health Registry',
        status: 'completed', duration: '12s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Verify Data Quality Exceptions', detail: '742 records with quality issues reviewed. 680 auto-corrected, 62 returned to providers for correction.',
        status: 'completed', duration: '14 min', agent: 'Verification Queue',
        confidence: 97,
        check: {
          original: 'Patient #EE-48201: duplicate prescription entries from two providers for same medication',
          corrected: 'Deduplicated — GP prescription superseded by specialist. Alert sent to both providers via Health Portal.',
          flag: 'Patient safety — duplicate prescription detected',
        },
      },
      {
        id: 's5', label: 'Publish to National Health System', detail: 'All validated records published to TIS (Tervise Infosüsteem). Patient portal updated.',
        status: 'completed', duration: '6.4s', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'ees-003',
    name: 'Case Worker Assignment Optimization',
    department: 'Social Insurance Board — Case Management',
    status: 'flagged',
    startedAt: '9 min ago',
    savings: 480000,
    cycleTime: { before: '5 days', after: '4 hours' },
    steps: [
      {
        id: 's1', label: 'Analyze Active Caseloads', detail: 'Current assignments — 840 case workers, 42,000 active cases across disability, family, and employment services',
        status: 'completed', duration: '4.2s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Score Case Complexity', detail: 'AI complexity assessment — language needs, multi-benefit interactions, appeal history, vulnerability indicators',
        status: 'completed', duration: '12s', agent: 'Analytics Agent',
        confidence: 89,
      },
      {
        id: 's3', label: 'Optimize Assignment Distribution', detail: 'Rebalanced 2,400 cases across 840 workers — skill matching, geographic proximity, and workload equity',
        status: 'completed', duration: '8.6s', agent: 'Optimization Agent',
      },
      {
        id: 's4', label: 'FLAG: Caseload Inequity Detected', detail: 'Ida-Viru County office: avg 68 cases/worker vs national avg 50. Russian-language cases concentrated in understaffed region.',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 94,
        check: {
          original: 'Assignment optimization: redistribute 180 cases from Ida-Viru to neighboring regions',
          corrected: 'Cannot redistribute — cases require Russian-language capability. Recommend hiring 4 additional bilingual case workers for Ida-Viru.',
          flag: 'Resource gap — language-specific staffing shortage',
        },
      },
      {
        id: 's5', label: 'Submit Staffing Recommendation', detail: 'Pending verification — staffing proposal to Social Insurance Board Director with budget impact analysis',
        status: 'pending', agent: 'Document Generator',
      },
    ],
  },
];

// ─── EE ECONOMIC: Ministry of Economic Affairs ──────────────

export const eeEconomicWorkflows: LiveWorkflow[] = [
  {
    id: 'eee-001',
    name: 'Trade Permit Processing Pipeline',
    department: 'Trade & Consumer Protection — Import/Export Division',
    status: 'running',
    startedAt: '4 min ago',
    savings: 740000,
    cycleTime: { before: '8 days', after: '18 hours' },
    steps: [
      {
        id: 's1', label: 'Receive Permit Applications', detail: 'Daily batch — 420 import/export permit applications via Estonian Trade Portal (dual-use goods, food safety, chemicals)',
        status: 'completed', duration: '2.2s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Classify Goods & Requirements', detail: 'HS code validation and regulatory requirement mapping — EU dual-use regulation, REACH, food safety directives',
        status: 'completed', duration: '6.8s', agent: 'Rules Engine',
        confidence: 95,
      },
      {
        id: 's3', label: 'Cross-Reference Sanctions & Embargoes', detail: 'EU sanctions list, Wassenaar Arrangement, and end-use screening — 420 applications checked. 12 flagged.',
        status: 'active', duration: '—', agent: 'Validation Engine',
        confidence: 97,
      },
      {
        id: 's4', label: 'Route Flagged Applications', detail: 'Pending — 12 applications requiring strategic goods commission review',
        status: 'pending', agent: 'Workflow Router',
      },
      {
        id: 's5', label: 'Issue Permits via Trade Portal', detail: 'Awaiting upstream — approved permits digitally signed and published to applicant accounts',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'eee-002',
    name: 'e-Residency Application Review',
    department: 'e-Residency Program — PPA Partnership',
    status: 'verified',
    startedAt: '20 min ago',
    savings: 560000,
    cycleTime: { before: '6 weeks', after: '5 days' },
    steps: [
      {
        id: 's1', label: 'Ingest Application Batch', detail: 'Weekly batch — 840 e-Residency applications from 62 countries via apply.gov.ee portal',
        status: 'completed', duration: '2.8s', agent: 'Intake Gateway',
      },
      {
        id: 's2', label: 'Identity Verification & Background Check', detail: 'Biometric data validated. Interpol, EU SIS II, and national security database checks via X-Road — 840 applicants screened.',
        status: 'completed', duration: '24s', agent: 'X-Road Data Agent',
        confidence: 98,
      },
      {
        id: 's3', label: 'Business Plan Assessment', detail: 'AI evaluation of stated business purpose — alignment with Estonian economic interest and legitimate business activity',
        status: 'completed', duration: '18s', agent: 'Analytics Agent',
        confidence: 92,
      },
      {
        id: 's4', label: 'Verify Flagged Applications', detail: '42 applications flagged for additional review — high-risk jurisdictions and unclear business purposes. All 42 reviewed.',
        status: 'completed', duration: '28 min', agent: 'Verification Queue',
        confidence: 95,
        check: {
          original: 'Applicant #ER-2026-4421: Business purpose "international consulting" — auto-approved',
          corrected: 'Insufficient detail for high-risk jurisdiction (sanctioned country adjacent). Requested additional documentation per PPA guidelines.',
          flag: 'Enhanced due diligence — jurisdiction risk',
        },
      },
      {
        id: 's5', label: 'Issue Digital Identity Cards', detail: '798 applications approved, 42 pending additional documentation. Cards queued for production at pickup embassies.',
        status: 'completed', duration: '4.2s', agent: 'Integration Agent',
      },
    ],
  },
  {
    id: 'eee-003',
    name: 'Business Registry Validation',
    department: 'Centre of Registers — Commercial Registry',
    status: 'flagged',
    startedAt: '6 min ago',
    savings: 420000,
    cycleTime: { before: '10 days', after: '24 hours' },
    steps: [
      {
        id: 's1', label: 'Ingest Annual Report Submissions', detail: 'Annual report filing deadline — 18,400 company annual reports submitted via RIK e-Business Register',
        status: 'completed', duration: '8.4s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Extract Financial Statements', detail: 'Parsed balance sheets, income statements, and cash flow data — Estonian Accounting Standards (RTJ) format validation',
        status: 'completed', duration: '24s', agent: 'GPT-4o Extraction',
        confidence: 95,
      },
      {
        id: 's3', label: 'Run Compliance Checks', detail: 'Checked share capital requirements, management board composition, beneficial ownership disclosures per Commercial Code',
        status: 'completed', duration: '14s', agent: 'Validation Engine',
      },
      {
        id: 's4', label: 'FLAG: Beneficial Ownership Discrepancies', detail: '240 companies with beneficial ownership data conflicting between annual report and Money Laundering Reporting registry',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 90,
        check: {
          original: '240 companies with minor beneficial ownership discrepancies — request correction notices',
          corrected: '48 companies show patterns consistent with shell company structures — nominee directors, circular ownership. Escalate to FIU.',
          flag: 'AML concern — potential shell company structures',
        },
      },
      {
        id: 's5', label: 'Issue Compliance Notices', detail: 'Pending verification — correction notices to 192 companies, FIU referral for 48 suspicious entities',
        status: 'pending', agent: 'Communication Agent',
      },
    ],
  },
];

// ─── EE RIA: Information System Authority ───────────────────

export const eeRiaWorkflows: LiveWorkflow[] = [
  {
    id: 'eer-001',
    name: 'X-Road Traffic Anomaly Detection',
    department: 'X-Road Operations — Monitoring Center',
    status: 'running',
    startedAt: '2 min ago',
    savings: 1200000,
    cycleTime: { before: 'Reactive (post-incident)', after: 'Real-time detection' },
    steps: [
      {
        id: 's1', label: 'Ingest X-Road Transaction Logs', detail: 'Real-time feed — 4.2M daily transactions across 980 information systems. Monitoring query patterns and response times.',
        status: 'completed', duration: 'continuous', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Baseline Normal Traffic Patterns', detail: 'ML-based profiling of 980 subsystems — query frequency, payload sizes, temporal patterns, and inter-system dependencies',
        status: 'completed', duration: '6.4s', agent: 'Analytics Agent',
        confidence: 94,
      },
      {
        id: 's3', label: 'Detect Anomalous Query Patterns', detail: 'Population Registry receiving 14x normal query volume from single consumer system — pattern inconsistent with business hours',
        status: 'active', duration: '—', agent: 'Anomaly Detector',
        confidence: 88,
      },
      {
        id: 's4', label: 'Correlate with Security Events', detail: 'Pending — cross-reference with CERT-EE threat intelligence and system authentication logs',
        status: 'pending', agent: 'Context Assembler',
      },
      {
        id: 's5', label: 'Trigger Rate Limiting or Alert', detail: 'Awaiting upstream — automated rate limit or SOC analyst escalation based on threat assessment',
        status: 'pending', agent: 'Escalation Handler',
      },
    ],
  },
  {
    id: 'eer-002',
    name: 'Vulnerability Scan Report Processing',
    department: 'CERT-EE — Vulnerability Management',
    status: 'verified',
    startedAt: '14 min ago',
    savings: 680000,
    cycleTime: { before: '5 days', after: '8 hours' },
    steps: [
      {
        id: 's1', label: 'Ingest Scan Results', detail: 'Weekly vulnerability scan — 2,400 government-owned IP ranges, 14,800 findings across CVE database',
        status: 'completed', duration: '4.8s', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Deduplicate & Prioritize', detail: 'Consolidated to 4,200 unique vulnerabilities. CVSS scoring + asset criticality weighting — 84 critical, 420 high.',
        status: 'completed', duration: '8.2s', agent: 'Analytics Agent',
        confidence: 96,
      },
      {
        id: 's3', label: 'Map to Asset Owners', detail: 'RIHA registry lookup — mapped findings to responsible ministries and agencies via information system catalog',
        status: 'completed', duration: '6.4s', agent: 'Entity Resolution',
      },
      {
        id: 's4', label: 'Verify Critical Findings', detail: '84 critical vulnerabilities reviewed by CERT-EE analysts. 78 confirmed, 6 false positives from scanner misconfiguration.',
        status: 'completed', duration: '18 min', agent: 'Verification Queue',
        confidence: 97,
        check: {
          original: 'CVE-2026-1847 detected on e-Tax system load balancer — CVSS 9.8',
          corrected: 'Confirmed critical. WAF rule deployed as interim mitigation. Emergency patch notification sent to EMTA IT with 48-hour remediation deadline.',
          flag: 'Critical infrastructure — emergency patching required',
        },
      },
      {
        id: 's5', label: 'Issue Remediation Directives', detail: 'Automated notifications sent to 42 agencies. Remediation tracked in CERT-EE dashboard. 48-hour SLA for critical.',
        status: 'completed', duration: '3.2s', agent: 'Communication Agent',
      },
    ],
  },
  {
    id: 'eer-003',
    name: 'Incident Response Automation',
    department: 'CERT-EE — Security Operations Center',
    status: 'flagged',
    startedAt: '5 min ago',
    savings: 940000,
    cycleTime: { before: '4 hours (manual triage)', after: '15 min (automated)' },
    steps: [
      {
        id: 's1', label: 'Ingest Security Event Feeds', detail: 'SIEM aggregation — firewall logs, IDS alerts, endpoint detection, DNS anomalies across government networks',
        status: 'completed', duration: 'continuous', agent: 'Data Pipeline',
      },
      {
        id: 's2', label: 'Correlate Multi-Source Events', detail: 'MITRE ATT&CK mapping — phishing email (T1566) → credential access (T1078) → lateral movement (T1021) pattern detected',
        status: 'completed', duration: '2.8s', agent: 'Analytics Agent',
        confidence: 91,
      },
      {
        id: 's3', label: 'Assess Blast Radius', detail: 'Compromised credential has access to 3 X-Road subsystems. Lateral movement to file server detected. 4 endpoints affected.',
        status: 'completed', duration: '4.2s', agent: 'Context Assembler',
      },
      {
        id: 's4', label: 'FLAG: Active Intrusion Detected', detail: 'APT-pattern attack on Ministry of Foreign Affairs — credential compromise via spear-phishing, data exfiltration attempt in progress',
        status: 'verification', duration: '—', agent: 'Verification Queue',
        confidence: 93,
        check: {
          original: 'Suspicious login activity from unusual IP — possible credential misuse',
          corrected: 'Confirmed APT campaign. Credential harvested via spear-phish. Attacker accessing classified document repository. Immediate containment required.',
          flag: 'Critical — active nation-state intrusion',
        },
      },
      {
        id: 's5', label: 'Execute Containment Playbook', detail: 'Pending verification — isolate affected endpoints, revoke credentials, block C2 IPs, notify NATO CCDCOE',
        status: 'pending', agent: 'Escalation Handler',
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
    case 'nb-aerospace': return nbAerospaceWorkflows;
    case 'nb-energy': return nbEnergyWorkflows;
    case 'nb-financial': return nbFinancialWorkflows;
    case 'nb-health': return nbHealthWorkflows;
    case 'ee-finance': return eeFinanceWorkflows;
    case 'ee-social': return eeSocialWorkflows;
    case 'ee-economic': return eeEconomicWorkflows;
    case 'ee-ria': return eeRiaWorkflows;
    default: return meridianWorkflows;
  }
}
