import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { useCompany, companies } from '../data/CompanyContext';
import VerificationModal from '../components/VerificationModal';
import PreliminaryBanner from '../components/PreliminaryBanner';

interface LedgerEntry {
  id: string;
  timestamp: string;
  workflow: string;
  agent: string;
  type: 'correction' | 'escalation' | 'approval' | 'flag';
  original: string;
  corrected: string;
  rationale: string;
  verifier: string;
  standard: string;
  confidence: number;
}

const meridianLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0847', timestamp: '3 min ago', workflow: 'Track Geometry Analysis — NEC Segment 47',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'MP 144.8: Cross-level deviation 1.62" — classified Priority',
    corrected: 'MP 144.8: Cross-level deviation 1.82" — reclassified Urgent per 49 CFR §213.63 (>1.75" Class 4 threshold)',
    rationale: 'AI rounded measurement down from raw LIDAR data. Re-extraction from RailSentry source confirmed 1.82" reading, exceeding FRA Class 4 urgent threshold.',
    verifier: 'R. Kellerman', standard: 'FRA 49 CFR §213.63', confidence: 96,
  },
  {
    id: 'VL-2026-0846', timestamp: '18 min ago', workflow: 'Crew Dispatch Optimization — Midwest',
    agent: 'Optimization Agent', type: 'escalation',
    original: 'Crew #MW-34: Assigned tie gang deployment — 6:00 AM start',
    corrected: 'Crew #MW-34: Start shifted to 7:30 AM — previous shift ended 8:12 PM, FRA requires 10-hour rest (49 CFR §228)',
    rationale: 'Hours-of-service violation detected. 10-hour mandatory rest period under FRA regulations would be violated by 6:00 AM start. Rescheduled to 7:30 AM.',
    verifier: 'T. Bradshaw', standard: 'FRA 49 CFR §228 — Hours of Service', confidence: 98,
  },
  {
    id: 'VL-2026-0845', timestamp: '32 min ago', workflow: 'Equipment Utilization Report — Q1',
    agent: 'Analytics Agent', type: 'approval',
    original: 'GPS Ballast Train #BT-18: Utilization 34%, recommend redeployment',
    corrected: 'GPS Ballast Train #BT-18: Utilization 34%, recommend redeployment to BNSF Southwest maintenance window (Apr 2-18)',
    rationale: 'Utilization below 40% threshold confirmed. BNSF maintenance window booking validates redeployment. Equipment certified for Class I operations.',
    verifier: 'D. Holman', standard: 'Fleet Policy §3.1 — Heavy Equipment Redeployment', confidence: 97,
  },
  {
    id: 'VL-2026-0844', timestamp: '48 min ago', workflow: 'FRA Safety Compliance Report',
    agent: 'Document Generator', type: 'flag',
    original: 'Track classification: Class 3 (40 mph freight)',
    corrected: 'Track classification: Class 4 (60 mph freight / 80 mph passenger) per FRA designation update Q4 2025',
    rationale: 'AI used stale track classification from 2024 dataset. FRA reclassified segment to Class 4 after rail weight upgrade to 136 RE.',
    verifier: 'R. Kellerman', standard: 'FRA Track Classification — 49 CFR §213.9', confidence: 88,
  },
  {
    id: 'VL-2026-0843', timestamp: '1 hr ago', workflow: 'Vendor Equipment Procurement',
    agent: 'Entity Resolution', type: 'correction',
    original: 'Supplier: Progress Rail Services (new vendor)',
    corrected: 'Supplier: Progress Rail Services — existing vendor #VR-0847 (Caterpillar subsidiary, 18 prior POs)',
    rationale: 'Duplicate vendor entry prevented. Progress Rail matched to existing record via DUNS number lookup. Parent company Caterpillar already in preferred vendor list.',
    verifier: 'Auto-verified', standard: 'Vendor dedup protocol', confidence: 99,
  },
  {
    id: 'VL-2026-0842', timestamp: '1.5 hrs ago', workflow: 'Signal System Maintenance Report',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'PTC software version: 4.2.1 — current',
    corrected: 'PTC software version: 4.2.1 — update required to 4.3.0 per Wabtec advisory WA-2026-008',
    rationale: 'AI used outdated version catalog. Wabtec issued mandatory PTC firmware update on 2026-02-15 for all I-ETMS installations.',
    verifier: 'K. Nguyen', standard: 'Wabtec I-ETMS Advisory WA-2026-008', confidence: 92,
  },
];

const oakwoodLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-1204', timestamp: '1 min ago', workflow: 'Claims Intake Processing',
    agent: 'Document Intelligence', type: 'correction',
    original: 'Vehicle: 2022 Hnd Acc — blue',
    corrected: 'Vehicle: 2022 Honda Accord EX-L — VIN: 1HGCV2F34NA012847, Obsidian Blue Pearl',
    rationale: 'OCR abbreviation resolved via VIN lookup against policy database. Color code matched to Honda paint catalog.',
    verifier: 'K. Thompson', standard: 'ACORD Claims Standard §3.2', confidence: 87,
  },
  {
    id: 'VL-2026-1203', timestamp: '8 min ago', workflow: 'Legacy Policy Migration',
    agent: 'Schema Mapper', type: 'correction',
    original: 'Coverage code: BPP-FL',
    corrected: 'Coverage: Business Personal Property — Flood Extension (Guidewire: CovType.BPP_FLOOD_EXT)',
    rationale: 'Legacy AS/400 internal code translated via coverage manual cross-reference. No direct ACORD equivalent.',
    verifier: 'R. Walsh', standard: 'Migration Protocol §7.1 — code translation', confidence: 92,
  },
  {
    id: 'VL-2026-1202', timestamp: '22 min ago', workflow: 'Renewal Risk Reassessment',
    agent: 'Analytics Agent', type: 'escalation',
    original: 'Policy #OAK-2023-14422: Recommended 34% rate increase',
    corrected: 'Rate increase capped at 25% per state regulation. Exception filed.',
    rationale: 'Connecticut DOI filing limit is 25% without prior approval. Rate capped, excess risk flagged for reinsurance review.',
    verifier: 'L. Martinez', standard: 'CT DOI Reg. §38a-665', confidence: 96,
  },
  {
    id: 'VL-2026-1201', timestamp: '35 min ago', workflow: 'Claims Intake Processing',
    agent: 'Risk Engine', type: 'flag',
    original: 'Claim #OAK-C-2026-4412: Standard processing',
    corrected: 'Elevated to SIU review — 3 prior claims in 18 months, all single-vehicle',
    rationale: 'Frequency pattern triggered SIU flag. Not confirmed fraud, but warrants investigation per underwriting guidelines.',
    verifier: 'Auto-flagged', standard: 'SIU Protocol §2.4 — frequency trigger', confidence: 82,
  },
];

const pinnacleLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0512', timestamp: '3 min ago', workflow: 'Clinical Note Summarization',
    agent: 'Clinical AI', type: 'correction',
    original: 'Assessment: Patient presents with acute bronchitis. Rx: Amoxicillin 500mg TID x 10 days.',
    corrected: 'Assessment: Acute bronchitis (viral, likely). No antibiotic indicated per guidelines. Supportive care recommended.',
    rationale: 'Provider Dr. Patel reviewed and removed antibiotic. Acute bronchitis is predominantly viral — antibiotics not indicated per ACP/CDC guidelines.',
    verifier: 'Dr. R. Patel', standard: 'ACP Clinical Guideline — Acute Bronchitis', confidence: 91,
  },
  {
    id: 'VL-2026-0511', timestamp: '11 min ago', workflow: 'Prior Authorization',
    agent: 'Clinical AI', type: 'correction',
    original: 'Clinical narrative: Patient has chronic back pain',
    corrected: 'Patient has experienced chronic lumbar pain for 8+ months with documented failed conservative treatment (PT x 12 sessions, NSAIDs, epidural injection)',
    rationale: 'Payer requires specific duration and failed conservative treatment documentation for MRI authorization. Original lacked required detail.',
    verifier: 'S. Chen', standard: 'Aetna PA Requirements — Lumbar MRI', confidence: 94,
  },
  {
    id: 'VL-2026-0510', timestamp: '24 min ago', workflow: 'Patient Scheduling',
    agent: 'Scheduling AI', type: 'approval',
    original: 'Scheduled: Dr. Kim, Mar 24, 2:30 PM',
    corrected: 'Confirmed. Insurance verified: Aetna PPO, copay $30, no referral required.',
    rationale: 'Scheduling confirmed with real-time insurance eligibility check. No manual intervention required.',
    verifier: 'Auto-verified', standard: 'Scheduling Protocol §1.1', confidence: 99,
  },
];

const atlasLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0923', timestamp: '4 min ago', workflow: 'Predictive Maintenance',
    agent: 'Predictive Model', type: 'flag',
    original: 'Machine AK-CNC-07: Normal operating range',
    corrected: 'Spindle vibration 2.3σ above baseline. Bearing wear pattern consistent with L10 life prediction.',
    rationale: 'Vibration signature matched to known bearing degradation pattern. OEM recommends replacement at 2.0σ threshold.',
    verifier: 'T. Nakamura', standard: 'ISO 10816-3 — Vibration Severity', confidence: 88,
  },
  {
    id: 'VL-2026-0922', timestamp: '18 min ago', workflow: 'Cross-Plant Inventory',
    agent: 'Optimization Agent', type: 'correction',
    original: 'Consolidate all bearing purchases to Timken (single vendor)',
    corrected: 'Consolidate 3 plants to Timken. Guadalajara keeps local supplier — import duty + 3-week lead time.',
    rationale: 'Cross-border logistics make single-vendor consolidation impractical for Guadalajara facility. Local supplier retained.',
    verifier: 'P. Okafor', standard: 'Procurement Policy §5.3 — lead time constraint', confidence: 95,
  },
  {
    id: 'VL-2026-0921', timestamp: '9 min ago', workflow: 'Quality Inspection',
    agent: 'Validation Engine', type: 'escalation',
    original: 'Lot #DET-2026-0312: Material meets specification',
    corrected: 'HOLD — tensile strength 122 ksi below AMS-6415 minimum 125 ksi. Engineering disposition required.',
    rationale: 'Auto-classification passed material based on partial spec match. Full AMS-6415 spec check caught 2.4% deviation.',
    verifier: 'D. Kowalski', standard: 'AMS-6415 Rev H — Mechanical Properties', confidence: 99,
  },
];

const northbridgeLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-1842', timestamp: '2 min ago', workflow: 'Cross-Division Procurement Consolidation',
    agent: 'Entity Resolution', type: 'correction',
    original: 'Supplier "TitaniumMetals Corp" — new vendor entry for Northbridge Energy',
    corrected: 'Matched to existing vendor #VS-8841 "Titanium Metals Corporation" — active across 3 divisions',
    rationale: 'Duplicate vendor entry prevented. Name variation and different division purchasing systems masked existing supplier relationship.',
    verifier: 'Auto-verified', standard: 'Vendor dedup protocol — DUNS match', confidence: 99,
  },
  {
    id: 'VL-2026-1843', timestamp: '8 min ago', workflow: 'Predictive Maintenance — Industrial Fleet',
    agent: 'Predictive Model', type: 'flag',
    original: 'Plant 3 turbine T3-047: Normal operating range',
    corrected: 'Bearing vibration 3.1σ above baseline — replacement recommended within 72 hours',
    rationale: 'Vibration signature matched to known degradation pattern. OEM threshold is 2.0σ; current reading significantly exceeds limit.',
    verifier: 'K. Yamamoto', standard: 'ISO 10816-3 — Vibration Severity', confidence: 93,
  },
  {
    id: 'VL-2026-1844', timestamp: '14 min ago', workflow: 'Financial Close Automation',
    agent: 'Reconciliation Agent', type: 'correction',
    original: 'Intercompany loan: Aerospace → Energy $4.2M — classified as revenue',
    corrected: 'Reclassified as intercompany loan — eliminated in consolidation per IFRS 10',
    rationale: 'AI initially classified the transfer as operating revenue. Intercompany loan agreement on file requires elimination treatment under IFRS 10.',
    verifier: 'R. Fitzgerald', standard: 'IFRS 10 — Consolidated Financial Statements', confidence: 97,
  },
  {
    id: 'VL-2026-1845', timestamp: '22 min ago', workflow: 'Cross-Division Procurement Consolidation',
    agent: 'Analytics Agent', type: 'flag',
    original: 'Separate POs to Titanium Metals Corp — Aerospace: $142/kg, Energy: $174/kg',
    corrected: 'Cross-division duplicate purchase order detected — same supplier, same parts, different divisions paying different prices',
    rationale: 'Northbridge Aerospace and Northbridge Energy both ordering same Ti-6Al-4V alloy from Titanium Metals Corp at 22% price variance. Consolidated PO would save $340K annually.',
    verifier: 'P. Morrison', standard: 'Procurement Policy §3.1 — volume consolidation', confidence: 96,
  },
  {
    id: 'VL-2026-1846', timestamp: '35 min ago', workflow: 'Predictive Maintenance — Industrial Fleet',
    agent: 'Validation Engine', type: 'escalation',
    original: 'Compressor C2-018: Scheduled maintenance in 30 days',
    corrected: 'Thermal anomaly detected — oil temperature 14°C above normal. Escalated to immediate inspection.',
    rationale: 'Scheduled maintenance window is too far out given thermal signature. Risk of compressor seizure if oil degradation continues at current rate.',
    verifier: 'T. Nakamura', standard: 'OEM Spec — thermal operating limits', confidence: 91,
  },
  {
    id: 'VL-2026-1847', timestamp: '48 min ago', workflow: 'Financial Close Automation',
    agent: 'Analytics Agent', type: 'correction',
    original: 'FX translation rate for Northbridge Japan: 148.2 JPY/USD',
    corrected: 'Rate corrected to 149.8 JPY/USD — month-end closing rate per Reuters feed',
    rationale: 'AI used mid-month spot rate instead of month-end closing rate required by IAS 21 for balance sheet translation.',
    verifier: 'Auto-verified', standard: 'IAS 21 — Effects of Changes in Foreign Exchange Rates', confidence: 98,
  },
];

const estoniaLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-2201', timestamp: '3 min ago', workflow: 'Tax Return Auto-Assessment',
    agent: 'Validation Engine', type: 'correction',
    original: 'Return #EE-2026-88421: Mortgage interest deduction €4,200 — approved',
    corrected: 'Deduction reduced to €2,800 — property registry shows apartment sold in August, 8 months eligible not 12',
    rationale: 'X-Road cross-reference with Property Registry showed ownership transfer in August 2025. Mortgage interest deduction prorated to 8/12 months.',
    verifier: 'Auto-verified', standard: 'Income Tax Act §25 — housing loan interest', confidence: 97,
  },
  {
    id: 'VL-2026-2202', timestamp: '7 min ago', workflow: 'Citizen Benefits Eligibility Engine',
    agent: 'Rules Engine', type: 'flag',
    original: 'Applicant #EE-2026-44821: Income €28,000 (Social Insurance) — eligible for family benefit',
    corrected: 'Income mismatch — Tax Board reports €42,000 vs Social Insurance €28,000. Benefit suspended pending investigation.',
    rationale: 'X-Road cross-referencing revealed tax-reported income of €42,000 conflicts with Social Insurance Board registered income of €28,000. Potential benefit overpayment of €8,400.',
    verifier: 'M. Kask', standard: 'Social Welfare Act §22 — income verification', confidence: 89,
  },
  {
    id: 'VL-2026-2203', timestamp: '18 min ago', workflow: 'Healthcare Records Integration',
    agent: 'Schema Mapper', type: 'correction',
    original: 'Diagnosis code: J06.9 mapped to "Upper respiratory infection, unspecified"',
    corrected: 'Mapped to ICD-10-EE code J06.9 with Estonian clinical modifier — acute presentation requiring follow-up',
    rationale: 'Standard ICD-10 mapping was correct but missed Estonian clinical modifier required by TEHIK for longitudinal record linking.',
    verifier: 'Auto-verified', standard: 'TEHIK Data Quality Standard §4.2', confidence: 95,
  },
  {
    id: 'VL-2026-2204', timestamp: '32 min ago', workflow: 'Cross-Ministry Data Platform',
    agent: 'Analytics Agent', type: 'escalation',
    original: 'Procurement contract #GOV-2026-1142: Standard processing',
    corrected: 'Flagged — contract value €2.4M exceeds single-source threshold. Public procurement tender required.',
    rationale: 'Contract value exceeds €1M threshold for direct procurement under Public Procurement Act. Requires open tender per EU Directive 2014/24.',
    verifier: 'A. Tamm', standard: 'Public Procurement Act §15 — threshold values', confidence: 94,
  },
];

const hccLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0901', timestamp: '2 min ago', workflow: 'Bridge Load Analysis — I-70 Rehabilitation',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'Bearing pad compression 14.8% — within tolerance',
    corrected: 'Bearing pad compression 16.2% — reclassified to Priority 1 replacement per AASHTO LRFD',
    rationale: 'AI rounded measurement down from raw inspection data. Re-extraction from field reports confirmed 16.2%, exceeding 15% replacement threshold.',
    verifier: 'R. Collins', standard: 'AASHTO LRFD Bridge Design', confidence: 96,
  },
  {
    id: 'VL-2026-0902', timestamp: '14 min ago', workflow: 'Equipment Utilization — Excavator Fleet',
    agent: 'Analytics Agent', type: 'flag',
    original: 'CAT 349F #E22: Utilization 68% — acceptable',
    corrected: 'CAT 349F #E22: Utilization 68% over 14 days but idle 100% last 6 days. Recommend redeployment to Highway 65.',
    rationale: 'Average masks recent idle period. Equipment available for redeployment, saving $4,200/week rental on Highway 65.',
    verifier: 'T. Brooks', standard: 'Fleet Policy §3.1 — Equipment Redeployment', confidence: 94,
  },
  {
    id: 'VL-2026-0903', timestamp: '28 min ago', workflow: 'Project Cost Tracking — I-70 Phase 2',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Monthly burn rate $1.2M — within forecast',
    corrected: 'Monthly burn rate $1.2M within 3% of forecast. No variance escalation needed.',
    rationale: 'Cost tracking within tolerance. Contingency reserve at $120K sufficient for remaining scope.',
    verifier: 'Auto-verified', standard: 'Project Controls Policy', confidence: 98,
  },
  {
    id: 'VL-2026-0904', timestamp: '45 min ago', workflow: 'Subcontractor Compliance — Highway 65',
    agent: 'Document Generator', type: 'escalation',
    original: 'Subcontractor SafetyFirst LLC: compliance current',
    corrected: 'SafetyFirst LLC: OSHA 300 log shows 3 recordable incidents in 90 days. Exceeds HCC safety threshold.',
    rationale: 'AI flagged elevated incident rate. HCC policy requires safety review when subcontractor incident rate exceeds 2 per quarter.',
    verifier: 'S. Williams', standard: 'HCC Safety Policy §5.2', confidence: 91,
  },
];

const hrsiLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0911', timestamp: '5 min ago', workflow: 'Ballast Train Deployment — BNSF Southwest',
    agent: 'Optimization Agent', type: 'correction',
    original: 'GPS Ballast Train #BT-18: Deploy on original route',
    corrected: 'GPS Ballast Train #BT-18: Route adjusted for track window change — arrival delayed 4 hours',
    rationale: 'BNSF track window shifted 4 hours due to revenue train scheduling conflict. Route recalculated.',
    verifier: 'D. Holman', standard: 'BNSF Operating Rules §12.3', confidence: 97,
  },
  {
    id: 'VL-2026-0912', timestamp: '22 min ago', workflow: 'Crew HOS Compliance — Midwest',
    agent: 'Optimization Agent', type: 'escalation',
    original: 'Crew #MW-34: Continue current shift',
    corrected: 'Crew #MW-34: 8.5 hours into shift, projected to exceed 12hr limit. Relief crew dispatched.',
    rationale: 'Hours-of-service projection shows violation risk. Relief crew J. Ramirez (0 hrs today) assigned.',
    verifier: 'T. Bradshaw', standard: 'FRA 49 CFR §228', confidence: 98,
  },
  {
    id: 'VL-2026-0913', timestamp: '41 min ago', workflow: 'Equipment Maintenance — Unit 4402',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Unit 4402: Scheduled service at 4,800 hours',
    corrected: 'Scheduled service confirmed. Parts in stock. April 2 maintenance window.',
    rationale: 'Service interval confirmed per manufacturer specs. All required parts available in warehouse.',
    verifier: 'Auto-verified', standard: 'Equipment Maintenance Schedule', confidence: 97,
  },
];

const hsiLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0921', timestamp: '3 min ago', workflow: 'Rail Defect Classification — NEC Seg 47',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'MP 312.4: Transverse defect — Priority 2',
    corrected: 'MP 312.4: Transverse defect confirmed via manual hand test. Reclassified Priority 1. Rail replacement ordered.',
    rationale: 'AI underestimated defect severity. Manual re-test confirmed growth rate 0.8mm/month, suggesting critical threshold in 60 days.',
    verifier: 'M. Chen', standard: 'FRA 49 CFR §213.113', confidence: 93,
  },
  {
    id: 'VL-2026-0922', timestamp: '18 min ago', workflow: 'Test Car Calibration — TAM-4 Unit',
    agent: 'Analytics Agent', type: 'approval',
    original: 'TAM-4 calibration: All channels within spec',
    corrected: 'Calibration check passed. All 12 ultrasonic channels within 0.5dB of reference.',
    rationale: 'Calibration verified against NIST-traceable reference standards. All channels nominal.',
    verifier: 'Auto-verified', standard: 'NIST Calibration Protocol', confidence: 99,
  },
  {
    id: 'VL-2026-0923', timestamp: '35 min ago', workflow: 'FRA Compliance Report — Q1 Testing',
    agent: 'Document Generator', type: 'flag',
    original: 'Testing coverage: All segments compliant',
    corrected: '3 segments below minimum testing frequency. Priority scheduling needed for MP 140-155.',
    rationale: 'Quarterly coverage audit shows 3 segments missed required inspection interval per FRA testing frequency mandate.',
    verifier: 'J. Martinez', standard: 'FRA Testing Frequency Mandate', confidence: 88,
  },
];

const htiLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0931', timestamp: '4 min ago', workflow: 'PTC Wayside Device Health — Zone 12',
    agent: 'Analytics Agent', type: 'flag',
    original: 'WD-4472: Communication latency 180ms — within spec',
    corrected: 'WD-4472 communication latency 180ms (limit 200ms). Trending upward. Antenna inspection recommended.',
    rationale: 'Latency increased 40ms over 14 days. Pattern consistent with antenna degradation, not software issue.',
    verifier: 'K. Patel', standard: 'PTC Communication Standards', confidence: 97,
  },
  {
    id: 'VL-2026-0932', timestamp: '16 min ago', workflow: 'Signal System Firmware Update — Zone 8',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Firmware v4.2.1: Update to v4.3.0',
    corrected: 'Firmware v4.2.1 validated on 12 units. All responding within spec. Update approved.',
    rationale: 'Post-update validation passed on all 12 units. No communication degradation observed.',
    verifier: 'Auto-verified', standard: 'Wabtec I-ETMS Advisory WA-2026-008', confidence: 99,
  },
  {
    id: 'VL-2026-0933', timestamp: '29 min ago', workflow: 'Fiber Optic Link Test — Corridor 14',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'Splice point #47: OTDR reading 0.5dB loss — acceptable',
    corrected: 'OTDR reading corrected to 0.8dB loss at splice point #47. Acceptable but added to monitoring list.',
    rationale: 'AI misread OTDR trace. Re-extraction confirmed 0.8dB, still within 1.0dB limit but warranting monitoring.',
    verifier: 'L. Chen', standard: 'Fiber Optic Testing Standards', confidence: 94,
  },
];

const htsiLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0941', timestamp: '6 min ago', workflow: 'Service Schedule Optimization — Weekday',
    agent: 'Optimization Agent', type: 'correction',
    original: 'Off-peak headway: Maintain 15-minute intervals',
    corrected: 'Off-peak headway adjusted from 15min to 18min. Ridership data shows 22% below threshold.',
    rationale: 'Ridership analytics confirms demand below 85% capacity threshold. Adjustment saves 1 crew rotation.',
    verifier: 'L. Washington', standard: 'Transit Service Standards', confidence: 91,
  },
  {
    id: 'VL-2026-0942', timestamp: '19 min ago', workflow: 'Crew Scheduling — Weekend Service',
    agent: 'Optimization Agent', type: 'escalation',
    original: 'Weekend service: Standard deployment',
    corrected: 'Concert event March 28 — ridership surge expected. Additional trainset and crew assigned.',
    rationale: 'Event calendar integration detected major venue event. Historical data shows 130% surge for similar events.',
    verifier: 'R. Patel', standard: 'HTSI Capacity Planning Policy', confidence: 94,
  },
  {
    id: 'VL-2026-0943', timestamp: '38 min ago', workflow: 'Vehicle Maintenance — Train #HTSI-44',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Train #HTSI-44: Brake inspection',
    corrected: 'Brake inspection passed. All 8 cars within wear limits. Next inspection at 15,000 miles.',
    rationale: 'All brake pad measurements within specification. Remaining life exceeds next scheduled service interval.',
    verifier: 'Auto-verified', standard: 'FRA Passenger Equipment Safety Standards', confidence: 98,
  },
];

const heLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0951', timestamp: '8 min ago', workflow: 'Solar Array Performance — Site 3',
    agent: 'Analytics Agent', type: 'flag',
    original: 'Panel cluster B7: Output within range',
    corrected: 'Panel cluster B7 output 12% below expected. Possible soiling or degradation. Inspection ordered.',
    rationale: 'Performance analytics detected sustained underperformance vs adjacent clusters and weather-adjusted baseline.',
    verifier: 'Field Engineer', standard: 'Solar Performance Monitoring Protocol', confidence: 92,
  },
  {
    id: 'VL-2026-0952', timestamp: '24 min ago', workflow: 'Energy Production Forecast',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Weekly forecast: 2,400 MWh',
    corrected: 'Weekly forecast within 4% of actual. Model accuracy trending upward.',
    rationale: 'Forecast vs actual variance well within 10% acceptable range. Model improving with additional weather data.',
    verifier: 'Auto-verified', standard: 'Energy Forecasting Standards', confidence: 97,
  },
];

const ggLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0961', timestamp: '12 min ago', workflow: 'Wetland Compliance — Site 7 Quarterly',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Quarterly compliance check: Standard review',
    corrected: 'All 14 parameters within EPA/state limits. Report auto-generated for submission.',
    rationale: 'All sensor readings within regulatory limits. Automated report generated per EPA quarterly filing schedule.',
    verifier: 'Auto-verified', standard: 'EPA Clean Water Act §404', confidence: 99,
  },
  {
    id: 'VL-2026-0962', timestamp: '28 min ago', workflow: 'Water Quality Monitoring',
    agent: 'Analytics Agent', type: 'flag',
    original: 'Site 7 dissolved oxygen: 4.8 mg/L — compliant',
    corrected: 'Dissolved oxygen at Site 7 trending downward — 2.4mg/L above minimum. Added to watch list.',
    rationale: 'While still above 2.4mg/L minimum, the 14-day trend shows declining readings that could approach limits.',
    verifier: 'J. Park', standard: 'State Environmental Standards', confidence: 88,
  },
];

function getLedgerForCompany(id: string): LedgerEntry[] {
  switch (id) {
    case 'meridian': return meridianLedger;
    case 'hcc': return hccLedger;
    case 'hrsi': return hrsiLedger;
    case 'hsi': return hsiLedger;
    case 'hti': return htiLedger;
    case 'htsi': return htsiLedger;
    case 'he': return heLedger;
    case 'gg': return ggLedger;
    case 'oakwood': return oakwoodLedger;
    case 'pinnacle': return pinnacleLedger;
    case 'atlas': return atlasLedger;
    case 'northbridge': return northbridgeLedger;
    case 'estonia': return estoniaLedger;
    default: return meridianLedger;
  }
}

const typeConfig = {
  correction: { icon: ShieldCheck, label: 'Correction', color: 'text-blue', bg: 'bg-blue-muted' },
  escalation: { icon: ShieldAlert, label: 'Escalation', color: 'text-amber', bg: 'bg-amber-muted' },
  approval: { icon: CheckCircle2, label: 'Approved', color: 'text-green', bg: 'bg-green-muted' },
  flag: { icon: ShieldAlert, label: 'Flag', color: 'text-red', bg: 'bg-red-muted' },
};

function LedgerRow({ entry, index, onSelect }: { entry: LedgerEntry; index: number; onSelect: (entry: LedgerEntry) => void }) {
  const [expanded, setExpanded] = useState(false);
  const tc = typeConfig[entry.type];
  const Icon = tc.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-border last:border-0"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-3.5 hover:bg-surface-sunken/40 transition-colors cursor-pointer flex items-start gap-4"
      >
        <div className={`mt-0.5 p-1 rounded ${tc.bg}`}>
          <Icon className={`w-3.5 h-3.5 ${tc.color}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-ink">{entry.workflow}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tc.color} ${tc.bg}`}>{tc.label}</span>
          </div>
          <p className="text-[12px] text-ink-secondary mt-0.5 line-clamp-1">{entry.corrected}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] text-ink-tertiary tabular-nums hidden sm:block">{entry.id}</span>
          <div className="flex items-center gap-1 text-ink-faint">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] tabular-nums">{entry.timestamp}</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 ml-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-surface-sunken border border-border-subtle">
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Original Output</div>
                  <p className="text-[12px] text-ink-secondary leading-relaxed">{entry.original}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Corrected Output</div>
                  <p className="text-[12px] text-ink font-medium leading-relaxed">{entry.corrected}</p>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Rationale</div>
                  <p className="text-[12px] text-ink-secondary leading-relaxed">{entry.rationale}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Verified By</div>
                  <p className="text-[12px] text-ink">{entry.verifier}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Evidence Standard</div>
                  <p className="text-[12px] text-ink">{entry.standard}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Agent</div>
                  <p className="text-[12px] text-ink">{entry.agent}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-blue" style={{ width: `${entry.confidence}%` }} />
                    </div>
                    <span className="text-[12px] tabular-nums font-medium text-ink">{entry.confidence}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(entry);
                  }}
                  className="px-3 py-1 rounded-md text-[11px] font-medium bg-blue-muted text-blue hover:bg-blue/10 transition-colors cursor-pointer"
                >
                  View full verification &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VerificationLedger() {
  const { company } = useCompany();
  const knownLedgerIds = ['meridian', 'hcc', 'hrsi', 'hsi', 'hti', 'htsi', 'he', 'gg', 'oakwood', 'pinnacle', 'atlas', 'northbridge', 'estonia'];
  const hasOwnData = knownLedgerIds.includes(company.id);
  const parentCompany = company.parentId ? companies.find((c) => c.id === company.parentId) : null;
  const entries = hasOwnData ? getLedgerForCompany(company.id) : (company.parentId ? getLedgerForCompany(company.parentId) : getLedgerForCompany(company.id));
  const showingParent = !hasOwnData && !!parentCompany;
  const [filter, setFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.type === filter);
  const counts = {
    all: entries.length,
    correction: entries.filter((e) => e.type === 'correction').length,
    escalation: entries.filter((e) => e.type === 'escalation').length,
    flag: entries.filter((e) => e.type === 'flag').length,
    approval: entries.filter((e) => e.type === 'approval').length,
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {showingParent && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-muted border border-amber/20 text-[12px] text-amber font-medium">
          Showing {parentCompany!.shortName} aggregate data — division-specific ledger not yet available.
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Verification Ledger</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Every AI decision, correction, and escalation — auditable and traceable</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {(['all', 'correction', 'escalation', 'flag', 'approval'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-ink text-white'
                : 'bg-surface-raised border border-border text-ink-secondary hover:bg-surface-sunken'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1 tabular-nums opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Ledger table */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
        {filtered.map((entry, i) => (
          <LedgerRow key={entry.id} entry={entry} index={i} onSelect={setSelectedEntry} />
        ))}
      </div>

      {selectedEntry && (
        <VerificationModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
}
