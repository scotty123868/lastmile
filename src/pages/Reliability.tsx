import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from '../data/CompanyContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Target,
  Activity,
  UserCheck,
  ChevronDown,
  ChevronRight,
  XCircle,
  Sparkles,
  FlaskConical,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

/* -- Division-specific reliability data -- */
const divisionReliability: Record<string, { accuracy: number; falsePositive: number; trend: string; testsPerDay: number; workflows: number }> = {
  meridian: { accuracy: 94.2, falsePositive: 3.1, trend: '+2.4% (30d)', testsPerDay: 847, workflows: 62 },
  hcc: { accuracy: 96.8, falsePositive: 0.8, trend: '+1.2% (30d)', testsPerDay: 312, workflows: 18 },
  hrsi: { accuracy: 93.1, falsePositive: 4.2, trend: '+3.1% (30d)', testsPerDay: 124, workflows: 8 },
  hsi: { accuracy: 94.2, falsePositive: 3.1, trend: '+2.4% (30d)', testsPerDay: 98, workflows: 6 },
  hti: { accuracy: 97.4, falsePositive: 1.2, trend: '+0.8% (30d)', testsPerDay: 156, workflows: 10 },
  htsi: { accuracy: 91.8, falsePositive: 5.4, trend: '+4.2% (30d)', testsPerDay: 89, workflows: 8 },
  he: { accuracy: 95.6, falsePositive: 2.1, trend: '+1.8% (30d)', testsPerDay: 42, workflows: 4 },
  gg: { accuracy: 98.1, falsePositive: 0.4, trend: '+0.3% (30d)', testsPerDay: 26, workflows: 3 },
  oakwood: { accuracy: 96.2, falsePositive: 1.9, trend: '+1.4% (30d)', testsPerDay: 340, workflows: 22 },
  pinnacle: { accuracy: 94.8, falsePositive: 2.8, trend: '+2.1% (30d)', testsPerDay: 180, workflows: 14 },
  atlas: { accuracy: 97.1, falsePositive: 1.4, trend: '+0.9% (30d)', testsPerDay: 520, workflows: 28 },
  northbridge: { accuracy: 95.5, falsePositive: 2.3, trend: '+1.8% (30d)', testsPerDay: 2400, workflows: 85 },
  'nb-aerospace': { accuracy: 98.2, falsePositive: 0.6, trend: '+0.4% (30d)', testsPerDay: 680, workflows: 32 },
  'nb-energy': { accuracy: 96.8, falsePositive: 1.6, trend: '+1.1% (30d)', testsPerDay: 890, workflows: 38 },
  'nb-financial': { accuracy: 97.4, falsePositive: 1.1, trend: '+0.7% (30d)', testsPerDay: 1200, workflows: 45 },
  'nb-health': { accuracy: 95.1, falsePositive: 2.6, trend: '+2.3% (30d)', testsPerDay: 540, workflows: 24 },
  estonia: { accuracy: 96.5, falsePositive: 1.8, trend: '+1.3% (30d)', testsPerDay: 1800, workflows: 62 },
  'ee-finance': { accuracy: 97.2, falsePositive: 1.3, trend: '+0.8% (30d)', testsPerDay: 450, workflows: 20 },
  'ee-social': { accuracy: 94.6, falsePositive: 3.0, trend: '+2.6% (30d)', testsPerDay: 380, workflows: 18 },
  'ee-economic': { accuracy: 96.1, falsePositive: 2.0, trend: '+1.5% (30d)', testsPerDay: 290, workflows: 16 },
  'ee-ria': { accuracy: 98.8, falsePositive: 0.3, trend: '+0.2% (30d)', testsPerDay: 620, workflows: 30 },
};

/* -- Type definitions for division data -- */
interface SuccessExample {
  title: string;
  input: string;
  analysis: string;
  expert: string;
  expertName: string;
  outcome: string;
  savings: string;
  confidence: number;
}

interface FailureExample {
  title: string;
  input: string;
  analysis: string;
  whatHappened: string;
  whyFailed: string;
  howCaught: string;
  corrective: string[];
  status: string;
}

interface ReviewQueueItem {
  title: string;
  flag: string;
  confidence: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  reviewer: string;
  reasoning: string[];
  outcome: 'approved' | 'corrected' | 'rejected' | null;
}

/* -- Division-specific success examples -- */
const divisionSuccessExamples: Record<string, SuccessExample[]> = {
  hcc: [
    {
      title: 'Bridge Inspection — AI Detected Bearing Deterioration',
      input: 'Bridge inspection reports, I-70 Rehabilitation Project, March 2026',
      analysis: 'AI ANALYSIS: Bearing pad compression exceeding 15% threshold on pier 3. Rate of degradation suggests replacement needed within 45 days.',
      expert: 'Reviewed bearing measurements. Confirmed deterioration pattern. "AI integrated multiple inspection cycles that would have been reviewed separately."',
      expertName: 'Senior Bridge Inspector R. Collins',
      outcome: 'Bearing replacement scheduled during planned traffic control window.',
      savings: '$89,000 in avoided emergency closure + traffic management',
      confidence: 96.8,
    },
    {
      title: 'Equipment Utilization — Cross-Project Optimization',
      input: 'HCSS Telematics data + P6 project schedules, Q1 2026',
      analysis: '4 excavators idle 60%+ across 3 active projects. Redeployment to I-35 project would eliminate 2 rental units ($4,200/week each).',
      expert: 'Operations confirmed equipment was available. "We didn\'t have visibility across project sites to see the idle time."',
      expertName: 'Fleet Manager T. Brooks',
      outcome: 'Equipment redeployed. 2 rentals canceled.',
      savings: '$218,400/yr in eliminated equipment rentals',
      confidence: 94.1,
    },
  ],
  hsi: [
    {
      title: 'Rail Flaw Detection — Pattern Recognition Across Corridors',
      input: 'TAM-4 ultrasonic data, Northeast Corridor Segments 12-18, March 2026',
      analysis: 'AI ANALYSIS: Transverse defect progression detected at MP 312.4. Growth rate 0.8mm/month suggests critical threshold in 60 days.',
      expert: 'Confirmed via manual re-test. "The AI correlated readings across 3 separate test runs that showed the trend. Individual readings were borderline."',
      expertName: 'Senior Rail Inspector M. Chen',
      outcome: 'Rail section replaced during scheduled maintenance window.',
      savings: '$124,000 in avoided derailment risk + emergency response',
      confidence: 93.7,
    },
  ],
  htsi: [
    {
      title: 'Passenger Service — Schedule Optimization',
      input: 'Ridership data + crew schedules + equipment availability, March 2026',
      analysis: 'Off-peak service can be consolidated from 4 trainsets to 3 without exceeding 85% capacity threshold. Saves 1 crew rotation per day.',
      expert: 'Operations Manager verified ridership patterns. "The seasonal adjustment was something we do manually each quarter — AI caught it 3 weeks earlier."',
      expertName: 'Transit Operations Manager L. Washington',
      outcome: 'Off-peak schedule adjusted. Crew reassigned to peak service.',
      savings: '$67,000/yr in optimized crew and equipment utilization',
      confidence: 91.2,
    },
  ],
  hti: [
    {
      title: 'PTC System — Predictive Maintenance Alert',
      input: 'PTC wayside device telemetry, Zone 8-14, March 2026',
      analysis: 'AI ANALYSIS: Communication latency trending upward on 3 wayside devices in Zone 12. Pattern consistent with antenna degradation, not software issue.',
      expert: 'Field inspection confirmed corrosion on antenna connections. "AI distinguished hardware from software issues — saved us days of software troubleshooting."',
      expertName: 'Signal Systems Engineer K. Patel',
      outcome: 'Antenna assemblies replaced. Communication latency returned to baseline.',
      savings: '$34,000 in avoided service disruptions + diagnostic time',
      confidence: 97.1,
    },
  ],
  oakwood: [
    {
      title: 'Claims Fraud Detection — Pattern Across Regions',
      input: 'Auto claims data, Southeast region, Q1 2026',
      analysis: 'AI ANALYSIS: 14 claims from 3 repair shops show identical damage descriptions with varying vehicle types. Statistical probability of coincidence: <0.01%.',
      expert: 'Reviewed claim files. Confirmed coordinated fraud ring. "AI linked claims across adjusters that would never have been reviewed together manually."',
      expertName: 'Senior Claims Investigator D. Reeves',
      outcome: 'Fraud ring referred to SIU. 14 claims denied, 3 repair shops flagged.',
      savings: '$420,000 in fraudulent claims prevented',
      confidence: 97.4,
    },
    {
      title: 'Underwriting Risk Model — Wildfire Exposure Update',
      input: 'Property portfolio data + satellite imagery + climate models, Western states',
      analysis: 'AI ANALYSIS: 2,400 policies in newly elevated wildfire zones per updated FIRMS data. Current premiums underpriced by average 34%.',
      expert: 'Actuarial team confirmed exposure gap. "The satellite overlay caught zone reclassifications 6 weeks before our vendor data updated."',
      expertName: 'Chief Actuary M. Thornton',
      outcome: 'Portfolio rebalanced. 2,400 policies repriced at renewal. Reinsurance treaty adjusted.',
      savings: '$3.2M in reduced catastrophic loss exposure',
      confidence: 95.8,
    },
  ],
  pinnacle: [
    {
      title: 'Clinical Documentation — Coding Accuracy Improvement',
      input: 'Physician notes + ICD-10 coding submissions, Cardiology dept, March 2026',
      analysis: 'AI ANALYSIS: 23% of cardiac catheterization encounters coded as diagnostic-only when procedure notes indicate therapeutic intervention. Revenue leakage estimated at $180/encounter.',
      expert: 'Coding supervisor confirmed undercoding pattern. "Physicians document the procedure correctly but coders miss the therapeutic component in lengthy notes."',
      expertName: 'HIM Director K. Pham',
      outcome: 'Coding workflow updated. Real-time AI assist for cath lab encounters.',
      savings: '$890,000/yr in recovered revenue from accurate coding',
      confidence: 93.6,
    },
    {
      title: 'Patient Readmission Risk — Early Intervention',
      input: 'Discharge data + social determinants + pharmacy records, CHF patients',
      analysis: 'AI ANALYSIS: 47 patients flagged as high readmission risk (>60%) within 30 days. Primary factors: medication non-adherence signals + lack of follow-up scheduling.',
      expert: 'Care management team reviewed cases. "AI identified patients whose pharmacy fills were delayed — a leading indicator we track manually but can not scale."',
      expertName: 'VP Care Management R. Gonzalez',
      outcome: 'Targeted outreach to 47 patients. Readmission rate for cohort dropped from 28% to 11%.',
      savings: '$1.4M in avoided readmission penalties + costs',
      confidence: 91.2,
    },
    {
      title: 'Supply Chain — Surgical Kit Optimization',
      input: 'OR case data + preference cards + inventory levels, Q1 2026',
      analysis: 'Custom surgical kits contain 18% unused items on average. Top 5 procedures identified with highest waste rates.',
      expert: 'OR Director confirmed. "Preference cards have not been updated in years. AI matched actual usage against what we stock in each kit."',
      expertName: 'OR Materials Manager J. Liu',
      outcome: 'Preference cards updated for top 20 procedures. Custom kit waste reduced by 40%.',
      savings: '$340,000/yr in reduced surgical supply waste',
      confidence: 96.1,
    },
  ],
  atlas: [
    {
      title: 'Predictive Maintenance — CNC Spindle Failure Prevention',
      input: 'Vibration sensor data + maintenance logs, Plant 3 CNC line, March 2026',
      analysis: 'AI ANALYSIS: Spindle bearing vibration on CNC-47 shows harmonic pattern consistent with inner race fault. Estimated 14 days to failure based on degradation curve.',
      expert: 'Maintenance engineer confirmed via oil analysis. "AI caught the signature 3 weeks before our scheduled vibration analysis would have flagged it."',
      expertName: 'Reliability Engineer P. Nakamura',
      outcome: 'Bearing replaced during planned downtime. Zero unplanned production loss.',
      savings: '$185,000 in avoided unplanned downtime + scrap',
      confidence: 97.8,
    },
    {
      title: 'Quality Control — Dimensional Drift Detection',
      input: 'CMM inspection data, aerospace components line, March 2026',
      analysis: 'AI ANALYSIS: Bore diameter measurements trending toward upper spec limit. Rate of drift: 0.002mm/day. Will exceed tolerance in 8 production days.',
      expert: 'Quality manager confirmed tool wear pattern. "Individual parts still pass inspection but the trend was heading out of spec. We would have caught it at the wall."',
      expertName: 'Quality Manager S. Okafor',
      outcome: 'Tool change scheduled proactively. Zero out-of-spec parts produced.',
      savings: '$92,000 in avoided scrap + customer quality escapes',
      confidence: 98.2,
    },
  ],
  northbridge: [
    {
      title: 'Cross-Division Resource Optimization',
      input: 'Workforce utilization data across 4 divisions, Q1 2026',
      analysis: 'AI ANALYSIS: Engineering talent with aerospace certifications in NB-Financial sitting idle 40% of time. NB-Aerospace has 6 open contractor positions requiring same certifications.',
      expert: 'HR VP confirmed cross-division opportunity. "We had no visibility into skills inventory across divisions. Each division recruits independently."',
      expertName: 'CHRO L. Vasquez',
      outcome: 'Internal mobility program launched. 4 engineers reassigned, 6 contractor positions eliminated.',
      savings: '$1.8M/yr in reduced contractor spend',
      confidence: 94.2,
    },
    {
      title: 'Enterprise License Consolidation',
      input: 'Software license data across all NB divisions, March 2026',
      analysis: 'AI ANALYSIS: 4 divisions each maintain separate Salesforce contracts. Enterprise consolidation would reduce per-seat cost by 28% and eliminate 340 unused seats.',
      expert: 'CIO confirmed fragmented procurement. "Each division negotiated independently at acquisition. We never rationalized the software stack."',
      expertName: 'CIO M. Blackwell',
      outcome: 'Enterprise Salesforce agreement negotiated. 340 unused seats reclaimed.',
      savings: '$2.4M/yr in license consolidation savings',
      confidence: 96.8,
    },
    {
      title: 'Conglomerate Risk Correlation — Weather Events',
      input: 'Operations data + weather models + supply chain mapping, all divisions',
      analysis: 'Hurricane scenario analysis shows correlated exposure: NB-Aerospace supplier in Gulf Coast, NB-Energy generation assets, NB-Health facilities — all affected by same event.',
      expert: 'Risk officer confirmed blind spot. "We stress-test divisions independently. AI showed the portfolio-level correlation we were missing."',
      expertName: 'Chief Risk Officer A. Petrov',
      outcome: 'Enterprise resilience plan created. Alternate suppliers pre-qualified for correlated scenarios.',
      savings: '$12M in reduced correlated catastrophic risk exposure',
      confidence: 92.1,
    },
  ],
  'nb-aerospace': [
    {
      title: 'Flight Test Data — Anomaly Detection in Avionics',
      input: 'Flight test telemetry, X-47 program, 200+ flight hours',
      analysis: 'AI ANALYSIS: Intermittent 12ms latency spike in fly-by-wire response loop. Occurs at altitude transitions >FL350. Not flagged by standard envelope testing.',
      expert: 'Chief test pilot confirmed noticing subtle handling change. "AI correlated the latency with specific atmospheric conditions we had not isolated."',
      expertName: 'Chief Test Pilot Col. R. Hayes',
      outcome: 'Software patch applied to FBW controller. Latency eliminated across all altitude regimes.',
      savings: '$4.2M in avoided late-stage program rework',
      confidence: 98.6,
    },
    {
      title: 'Supply Chain — Titanium Alloy Sourcing Risk',
      input: 'Supplier performance data + geopolitical risk feeds + inventory positions',
      analysis: 'AI ANALYSIS: Primary Ti-6Al-4V supplier 78% dependent on single ore source. Secondary supplier lead time increased 40% in 90 days. Stockout risk elevated.',
      expert: 'Procurement confirmed supply concentration. "AI connected supplier financial filings with ore source dependencies we track in separate systems."',
      expertName: 'VP Supply Chain D. Morrison',
      outcome: 'Third supplier qualified. Strategic buffer stock increased from 60 to 120 days.',
      savings: '$8.5M in avoided production line stoppage',
      confidence: 95.4,
    },
  ],
  'nb-energy': [
    {
      title: 'Grid Stability — Renewable Integration Optimization',
      input: 'SCADA data + weather forecasts + demand curves, Western grid region',
      analysis: 'AI ANALYSIS: Solar ramping event at 16:00 will create 340MW gap in 12 minutes. Gas peaker startup requires 18 minutes. Battery storage dispatch can bridge the gap.',
      expert: 'Grid operator confirmed timing risk. "AI predicted the ramp rate more accurately than our existing forecast models by incorporating real-time cloud cover data."',
      expertName: 'Grid Operations Director T. Nguyen',
      outcome: 'Battery dispatch pre-staged. Zero frequency excursions during solar ramp.',
      savings: '$890,000 in avoided grid penalty charges + peaker fuel costs',
      confidence: 96.4,
    },
    {
      title: 'Pipeline Integrity — Corrosion Rate Prediction',
      input: 'In-line inspection data + soil chemistry + cathodic protection readings, Pipeline Segment 14',
      analysis: 'AI ANALYSIS: External corrosion rate at MP 42.3 accelerating. Soil resistivity change from nearby construction affecting cathodic protection.',
      expert: 'Pipeline integrity engineer confirmed with direct assessment. "AI connected the construction permit data with our corrosion readings automatically."',
      expertName: 'Pipeline Integrity Engineer R. Blackwood',
      outcome: 'Cathodic protection system adjusted. Corrosion rate returned to baseline.',
      savings: '$2.1M in avoided pipeline repair + environmental remediation',
      confidence: 97.2,
    },
  ],
  'nb-financial': [
    {
      title: 'Transaction Monitoring — Layered Fraud Detection',
      input: 'Wire transfer data + account behavior patterns + sanctions lists, March 2026',
      analysis: 'AI ANALYSIS: Series of 14 structured wire transfers from 3 accounts, each below $10K threshold. Aggregate pattern consistent with smurfing. Beneficial ownership linked to sanctioned entity.',
      expert: 'BSA officer confirmed pattern. "AI connected transactions across accounts that our rule-based system treats independently. The structuring pattern was invisible at the account level."',
      expertName: 'BSA/AML Officer C. Washington',
      outcome: 'SAR filed. Accounts frozen pending investigation. FinCEN notified.',
      savings: '$45M in potential regulatory penalty avoidance',
      confidence: 98.1,
    },
    {
      title: 'Credit Risk — Commercial Real Estate Portfolio',
      input: 'CRE loan portfolio + market data + tenant financial health, Q1 2026',
      analysis: 'AI ANALYSIS: 12 office properties in portfolio showing correlated tenant distress signals. Combined exposure: $340M. Stress test suggests 3 properties at risk of covenant breach within 6 months.',
      expert: 'Credit risk officer confirmed concentration. "AI pulled tenant revenue data from SEC filings and connected it to our loan covenants — analysis that takes our team weeks."',
      expertName: 'Chief Credit Officer J. Stern',
      outcome: 'Enhanced monitoring for 12 properties. Loan loss reserves increased $8M. Workout team engaged on 3 highest-risk loans.',
      savings: '$28M in early loss mitigation vs late intervention',
      confidence: 94.7,
    },
    {
      title: 'Regulatory Reporting — Automated CCAR Stress Testing',
      input: 'Portfolio data + macroeconomic scenarios + Fed CCAR guidelines, Q1 2026',
      analysis: 'AI ANALYSIS: Automated 9 CCAR scenarios in 4 hours vs 6 weeks manual. Identified capital shortfall in severely adverse scenario 2 that manual process historically misses.',
      expert: 'Head of stress testing confirmed finding. "The AI ran sensitivity analysis on 2,000+ permutations to find the specific scenario combination that stressed our capital ratio below minimum."',
      expertName: 'Head of Stress Testing M. Rodriguez',
      outcome: 'Capital plan adjusted pre-submission. Fed examination passed without comment.',
      savings: '$120M in optimized capital allocation',
      confidence: 97.8,
    },
  ],
  'nb-health': [
    {
      title: 'Clinical Trial Matching — Patient Recruitment Acceleration',
      input: 'EHR data + active trial registries + genomic profiles, oncology dept',
      analysis: 'AI ANALYSIS: 34 patients in system match eligibility criteria for 3 active Phase III trials. 12 patients have genomic markers suggesting higher response probability.',
      expert: 'Oncology PI confirmed matches. "AI screened our entire patient population in minutes — our coordinators manually review maybe 20 charts per week."',
      expertName: 'Principal Investigator Dr. S. Mehta',
      outcome: '34 patients contacted. 18 enrolled, exceeding recruitment targets by 40%.',
      savings: '$2.8M in accelerated trial completion + per-patient recruitment costs',
      confidence: 93.4,
    },
    {
      title: 'Pharmacy Formulary — Drug Interaction Alert Refinement',
      input: 'Prescription data + clinical decision support alerts + override rates, March 2026',
      analysis: 'AI ANALYSIS: 67% of drug interaction alerts overridden by physicians. Analysis shows 42% of alerts are low-clinical-significance. Alert fatigue reducing response to critical alerts.',
      expert: 'Chief Pharmacist confirmed alert fatigue problem. "AI categorized which alerts are being ignored and why — data we have but never had time to analyze systematically."',
      expertName: 'Chief Pharmacist Dr. L. Kaminski',
      outcome: 'Alert tiering implemented. Low-significance alerts suppressed. Critical alert response rate improved from 33% to 89%.',
      savings: '$1.2M/yr in improved medication safety outcomes',
      confidence: 95.8,
    },
  ],
  estonia: [
    {
      title: 'Cross-Agency Data Integration — Citizen Service Optimization',
      input: 'Service request data across 4 agencies + population registry, Q1 2026',
      analysis: 'AI ANALYSIS: 28% of citizens interact with 3+ agencies for life events (birth, marriage, property). Average touchpoints: 7.2 per event. Consolidation could reduce to 2.1 touchpoints.',
      expert: 'Digital transformation lead confirmed siloed processes. "AI mapped the actual citizen journey across our agencies — we each optimize independently but nobody sees the whole path."',
      expertName: 'Digital Transformation Lead K. Tamm',
      outcome: 'Unified life event workflow launched for 3 event types. Citizen satisfaction up 34%.',
      savings: '12,000 staff-hours/yr in reduced duplicate processing',
      confidence: 95.2,
    },
    {
      title: 'e-Residency — Application Fraud Detection',
      input: 'e-Residency applications + identity verification data + behavioral analytics, Q1 2026',
      analysis: 'AI ANALYSIS: 42 applications showing coordinated submission patterns. IP analysis, document similarity, and timing suggest organized fraud ring targeting e-Residency program.',
      expert: 'Security team confirmed fraud indicators. "AI caught the coordination pattern across applications that individually looked legitimate."',
      expertName: 'e-Residency Security Director M. Kallas',
      outcome: '42 applications flagged and rejected. Verification process enhanced.',
      savings: 'Prevented potential money laundering channel + reputational protection',
      confidence: 96.8,
    },
  ],
  'ee-finance': [
    {
      title: 'Tax Compliance — Automated Cross-Border VAT Reconciliation',
      input: 'VAT declarations + EU VIES data + banking transaction records, Q1 2026',
      analysis: 'AI ANALYSIS: 340 businesses with VAT declaration discrepancies >15% when cross-referenced against EU VIES intra-community transactions. Potential revenue gap: EUR 4.2M.',
      expert: 'Tax authority lead confirmed discrepancies. "AI reconciled our domestic data with EU-wide transaction data in hours — this takes our auditors months to sample-check."',
      expertName: 'Tax Authority Director J. Rebane',
      outcome: '340 businesses flagged for audit. EUR 3.8M in additional VAT recovered.',
      savings: 'EUR 3.8M in recovered tax revenue',
      confidence: 97.6,
    },
    {
      title: 'Banking Supervision — Early Warning System',
      input: 'Bank financial reports + real-time market data + ECB stress test results',
      analysis: 'AI ANALYSIS: 2 banks showing correlated liquidity stress signals. Deposit outflow rate + interbank borrowing pattern consistent with early-stage funding pressure.',
      expert: 'Banking supervisor confirmed early signals. "AI combined market signals with confidential supervisory data to flag the correlation before it hit standard metrics."',
      expertName: 'Banking Supervision Head A. Luik',
      outcome: 'Enhanced surveillance activated. Banks required to submit weekly liquidity reports. Situation stabilized.',
      savings: 'Prevented potential EUR 200M in deposit insurance activation',
      confidence: 94.8,
    },
  ],
  'ee-social': [
    {
      title: 'Benefits Fraud Detection — Cross-System Pattern Analysis',
      input: 'Social benefits disbursement data + employment registry + tax records, Q1 2026',
      analysis: 'AI ANALYSIS: 89 claimants receiving unemployment benefits while showing active employment in tax registry. Cross-system lag was masking the overlap.',
      expert: 'Benefits director confirmed data lag issue. "AI matched records across systems faster than our batch reconciliation process, which runs monthly."',
      expertName: 'Benefits Administration Director H. Parn',
      outcome: '89 cases reviewed. 72 confirmed overpayments, recovery initiated. 17 legitimate data timing issues.',
      savings: 'EUR 890,000 in recovered overpayments',
      confidence: 93.4,
    },
    {
      title: 'Pension Planning — Demographic Projection Update',
      input: 'Population registry + pension fund data + immigration/emigration trends, 2026 projection',
      analysis: 'AI ANALYSIS: Updated demographic model shows pension fund adequacy ratio declining faster than 2024 projections due to emigration spike in 25-35 age cohort.',
      expert: 'Pension fund actuary confirmed revised projections. "AI incorporated real-time emigration data that our annual actuarial review would not capture until year-end."',
      expertName: 'Chief Actuary Dr. T. Kask',
      outcome: 'Pension fund investment strategy adjusted. Policy brief submitted to Parliament.',
      savings: 'EUR 45M in improved long-term pension fund adequacy',
      confidence: 91.8,
    },
  ],
  'ee-economic': [
    {
      title: 'Economic Indicator — Real-Time GDP Nowcasting',
      input: 'VAT transaction data + energy consumption + employment data + card payment volumes',
      analysis: 'AI ANALYSIS: Real-time indicators suggest Q1 GDP growth at 2.8%, 0.6% above official forecast. Card payment volumes and energy consumption both trending above seasonal norms.',
      expert: 'Chief economist confirmed leading indicators. "AI produces weekly GDP nowcasts that are within 0.2% of final figures — our quarterly models take 6 weeks to produce."',
      expertName: 'Chief Economist Dr. R. Vesilind',
      outcome: 'Policy briefing updated with real-time data. Fiscal policy planning accelerated by 4 weeks.',
      savings: 'Improved policy responsiveness valued at EUR 8M in better-timed fiscal interventions',
      confidence: 94.2,
    },
    {
      title: 'Trade Balance — Export Risk Early Warning',
      input: 'Customs data + shipping manifests + trading partner economic indicators',
      analysis: 'AI ANALYSIS: Finnish construction downturn will reduce Estonian prefab housing exports by estimated 18% within 2 quarters. 34 exporters affected.',
      expert: 'Trade analyst confirmed dependency. "AI connected Finnish building permit data with our export volumes — a leading indicator we were not tracking."',
      expertName: 'Trade Policy Analyst M. Sepp',
      outcome: '34 exporters notified. Market diversification support program activated.',
      savings: 'EUR 12M in supported export market transitions',
      confidence: 95.6,
    },
  ],
  'ee-ria': [
    {
      title: 'Cyber Threat Intelligence — APT Campaign Detection',
      input: 'Network traffic data + threat feeds + dark web monitoring + government endpoint telemetry',
      analysis: 'AI ANALYSIS: Coordinated reconnaissance activity targeting 3 government ministries. TTPs match known APT group with 94% confidence. C2 infrastructure traced to previously unseen IP ranges.',
      expert: 'Threat intelligence lead confirmed campaign. "AI correlated low-signal indicators across multiple ministries that individually looked like noise. The pattern only emerged in aggregate."',
      expertName: 'Threat Intelligence Lead K. Magi',
      outcome: 'Targeted defenses deployed. 3 ministries patched within 4 hours. Attack campaign disrupted before data exfiltration.',
      savings: 'Prevented potential national security breach + data exfiltration',
      confidence: 99.1,
    },
    {
      title: 'Critical Infrastructure — SCADA Vulnerability Prioritization',
      input: 'Vulnerability scan data + asset criticality scores + threat intelligence + exploit availability',
      analysis: 'AI ANALYSIS: 47 SCADA vulnerabilities across energy grid. AI prioritized 3 as critical based on active exploitation in the wild + network reachability + asset criticality. Standard CVSS scoring ranked them 12th, 18th, and 23rd.',
      expert: 'CISO confirmed reprioritization. "CVSS alone does not capture exploitability in our specific environment. AI factored in our network topology and active threat data."',
      expertName: 'CISO Col. A. Kivi',
      outcome: '3 critical vulnerabilities patched within 24 hours. Remaining 44 scheduled by risk-adjusted priority.',
      savings: 'Prevented exploitation of actively targeted critical infrastructure vulnerabilities',
      confidence: 98.4,
    },
    {
      title: 'Incident Response — Automated Triage and Containment',
      input: 'SIEM alerts + endpoint detection data + user behavior analytics, March 2026',
      analysis: 'AI ANALYSIS: Anomalous authentication pattern on diplomat workstation. Lateral movement detected to shared drive. Behavioral analysis: 98% confidence of credential compromise.',
      expert: 'IR team confirmed compromise. "AI isolated the workstation and preserved forensic evidence in 12 seconds. Manual triage would have taken 45 minutes minimum."',
      expertName: 'Incident Response Lead V. Tamm',
      outcome: 'Workstation isolated. Credential reset forced. Forensic image captured. Full incident contained within 3 minutes.',
      savings: 'Prevented lateral spread to classified network segments',
      confidence: 99.4,
    },
  ],
};

/* -- Division-specific failure examples -- */
const divisionFailureExamples: Record<string, FailureExample[]> = {
  hcc: [
    {
      title: 'Material Cost Overestimate — Aggregate Pricing',
      input: 'Bid package, Highway 65 resurfacing project',
      analysis: 'Estimated aggregate cost: $380,000 based on regional pricing database.',
      whatHappened: 'Actual cost was $290,000. AI used statewide average pricing instead of local quarry rates available through existing contracts.',
      whyFailed: 'Procurement contract database was not connected. AI used public pricing data instead of negotiated rates.',
      howCaught: 'Estimator (human-in-loop) flagged the per-ton rate as 30% above their experience with local suppliers.',
      corrective: [
        'Connected procurement contract database via MCP',
        'Added negotiated rate lookup as priority over public pricing',
        'Material cost estimates now within ±8% vs previous ±25%',
      ],
      status: 'Resolved. Procurement feed integrated.',
    },
  ],
  htsi: [
    {
      title: 'Ridership Forecast Error — Special Event',
      input: 'Daily ridership prediction, Saturday March 14, 2026',
      analysis: 'Predicted ridership: 12,400 (normal Saturday pattern).',
      whatHappened: 'Actual ridership: 28,600. Major concert event at downtown venue drove 130% surge.',
      whyFailed: 'Event calendar integration was limited to city-operated venues. Third-party venue events were not in the data feed.',
      howCaught: 'Operations dispatcher noticed platform crowding at 2PM and escalated. Additional trainsets deployed within 45 minutes.',
      corrective: [
        'Integrated Ticketmaster/LiveNation event feeds for service area',
        'Added "special event" flag that triggers capacity planning review',
        'Weekend forecast accuracy improved from 78% to 94%',
      ],
      status: 'Resolved. Event feed active for all major venues.',
    },
  ],
  oakwood: [
    {
      title: 'Auto Claim Severity — Misclassified Total Loss',
      input: 'Auto claim #OAK-8842, 2024 Honda Accord collision',
      analysis: 'Estimated repair: $8,200. Classified as repairable.',
      whatHappened: 'Vehicle had hidden structural frame damage. Actual repair cost: $16,400, exceeding 75% total loss threshold ($14,250).',
      whyFailed: 'AI model trained on exterior damage photos only. Frame damage detection requires under-vehicle inspection data not available in initial photos.',
      howCaught: 'Body shop estimator (human-in-loop) discovered frame damage during teardown. Escalated within 48 hours.',
      corrective: [
        'Added AI frame damage probability score based on impact angle and force vectors',
        'Claims >$5K now require supplemental under-vehicle photo set',
        'Total loss misclassification rate reduced from 8.2% to 2.1%',
      ],
      status: 'Resolved. Supplemental photo requirement active.',
    },
  ],
  pinnacle: [
    {
      title: 'Sepsis Risk Score — False Negative on Immunocompromised Patient',
      input: 'Patient vitals + labs, ED admission March 8, 2026',
      analysis: 'Sepsis risk score: 22% (low risk). Recommended standard monitoring.',
      whatHappened: 'Patient developed severe sepsis within 6 hours. Immunosuppressive medication was masking typical inflammatory markers (WBC, temperature).',
      whyFailed: 'Model weighted vital signs heavily. Immunosuppressive medication list was available in EHR but not included in the sepsis model input features.',
      howCaught: 'Attending physician (human-in-loop) recognized atypical presentation in immunocompromised patient and ordered additional cultures.',
      corrective: [
        'Added medication-adjusted risk scoring for immunocompromised patients',
        'Integrated active medication list as model input feature',
        'Sensitivity for immunocompromised sepsis improved from 71% to 94%',
      ],
      status: 'Resolved. Medication-aware model v2.1 deployed.',
    },
    {
      title: 'Surgical Scheduling — OR Block Time Overestimate',
      input: 'OR scheduling data, orthopedic joint replacements, Q1 2026',
      analysis: 'Predicted average procedure time: 142 minutes. Recommended 3-hour OR blocks.',
      whatHappened: 'Actual average: 98 minutes. Wasted 44 minutes/block. Lost 2 potential cases/day across 4 ORs.',
      whyFailed: 'Model trained on historical data that included pre-2025 surgical techniques. New robotic-assisted approach reduced procedure times by 30%.',
      howCaught: 'OR Director (human-in-loop) noticed increasing idle time and requested model audit.',
      corrective: [
        'Added procedure technique type as model feature (traditional vs. robotic-assisted)',
        'Implemented 90-day rolling average instead of 2-year historical average',
        'OR utilization improved from 68% to 84%',
      ],
      status: 'Resolved. Technique-aware scheduling model active.',
    },
  ],
  atlas: [
    {
      title: 'Inventory Forecast — Semiconductor Shortage Blind Spot',
      input: 'Bill of materials + supplier lead times + demand forecast, Q1 2026',
      analysis: 'Projected component availability: adequate for 120-day production plan.',
      whatHappened: 'Key microcontroller went on allocation 3 weeks later. Production line stopped for 8 days waiting for components.',
      whyFailed: 'Model used supplier-stated lead times. Did not incorporate semiconductor industry allocation signals (supplier earnings calls, industry reports).',
      howCaught: 'Procurement manager (human-in-loop) learned of allocation from industry contact, but 2 weeks after AI forecast was issued.',
      corrective: [
        'Integrated semiconductor industry allocation tracking feeds',
        'Added supplier financial health as early warning indicator',
        'Component shortage prediction lead time improved from 0 to 45 days',
      ],
      status: 'Resolved. Industry signal feeds active.',
    },
  ],
  northbridge: [
    {
      title: 'Cross-Division Reporting — Data Normalization Error',
      input: 'Consolidated financial report across 4 divisions, Q4 2025',
      analysis: 'Reported consolidated EBITDA: $847M.',
      whatHappened: 'Actual EBITDA: $812M. NB-Financial reported figures in thousands while other divisions reported in actuals. AI did not detect unit mismatch.',
      whyFailed: 'Each division uses different ERP systems with different data formats. Unit standardization was assumed but not validated.',
      howCaught: 'CFO (human-in-loop) flagged NB-Financial numbers as unusually high during board prep review.',
      corrective: [
        'Added mandatory unit validation step for all cross-division aggregations',
        'Implemented data schema registry with explicit unit declarations',
        'Cross-division aggregation errors reduced from 4.1% to 0.2%',
      ],
      status: 'Resolved. Schema registry enforced for all divisions.',
    },
  ],
  'nb-aerospace': [
    {
      title: 'Composite Material Testing — Environmental Factor Oversight',
      input: 'Carbon fiber laminate test results, wing spar component batch #A-2247',
      analysis: 'All 24 test coupons within spec. Batch approved for production.',
      whatHappened: 'In-service inspection revealed delamination at 60% of expected fatigue life. Lab conditions did not match service environment (humidity cycling).',
      whyFailed: 'AI approved based on standard test conditions. Environmental knockdown factors for high-humidity service regions were in a separate materials database not connected to the approval workflow.',
      howCaught: 'Materials engineer (human-in-loop) questioned batch approval after reviewing service environment requirements for the specific aircraft variant.',
      corrective: [
        'Linked service environment profiles to materials approval workflow',
        'Added environmental knockdown factor validation as mandatory step',
        'Material qualification escapes reduced from 2.1% to 0.1%',
      ],
      status: 'Resolved. Environment-linked approval workflow active.',
    },
  ],
  'nb-energy': [
    {
      title: 'Demand Forecast — Extreme Weather Underestimate',
      input: 'Load forecast for August 2025 heat wave period',
      analysis: 'Peak demand forecast: 4,200MW. Capacity margin: comfortable.',
      whatHappened: 'Actual peak: 4,890MW. Triggered emergency demand response. Near-miss on rolling blackouts.',
      whyFailed: 'Training data lacked events with simultaneous high temperature + high humidity + weekend-to-weekday transition. Model extrapolated poorly for compound extreme conditions.',
      howCaught: 'Grid operator (human-in-loop) pre-staged reserves based on experience with similar weather patterns. Reserves prevented blackout.',
      corrective: [
        'Added compound weather event scenarios to training data',
        'Implemented ensemble model with weather-specific adjustments',
        'Extreme weather forecast error reduced from 16% to 4%',
      ],
      status: 'Resolved. Compound weather model active.',
    },
  ],
  'nb-financial': [
    {
      title: 'AML Screening — Name Matching False Negative',
      input: 'Wire transfer screening, March 2026',
      analysis: 'Transfer to "Al-Rashid Trading LLC" cleared. No sanctions match.',
      whatHappened: 'Entity was a known alias for sanctioned entity "Al-Rasheed International Trading." Transliteration variant not in matching dictionary.',
      whyFailed: 'Name matching algorithm used exact and phonetic matching but lacked Arabic transliteration variant database. OFAC SDN list included only primary spelling.',
      howCaught: 'Compliance analyst (human-in-loop) recognized the entity name during daily transaction review sample.',
      corrective: [
        'Integrated comprehensive Arabic/Cyrillic/Chinese transliteration variant database',
        'Added fuzzy matching with cultural name variation awareness',
        'Sanctions screening match rate improved by 340 additional variant catches per month',
      ],
      status: 'Resolved. Enhanced transliteration matching deployed.',
    },
  ],
  'nb-health': [
    {
      title: 'Drug Dosing Recommendation — Pediatric Weight Error',
      input: 'Medication dosing calculation, pediatric oncology patient',
      analysis: 'Recommended dose: 120mg based on patient weight of 40kg.',
      whatHappened: 'Patient weight was recorded in pounds (40 lbs = 18.1kg). Correct dose should have been 54mg. Overdose would have been 2.2x recommended maximum.',
      whyFailed: 'Weight field in EHR was entered without unit. AI defaulted to kg (metric). Hospital uses lbs for pediatric patients.',
      howCaught: 'Pharmacist (human-in-loop) caught the dose as outside pediatric range during mandatory verification.',
      corrective: [
        'Added mandatory unit validation for all weight-based dosing calculations',
        'Implemented pediatric dose range guardrails that flag outliers regardless of unit',
        'Weight unit errors in dosing reduced from 1.2% to 0%',
      ],
      status: 'Resolved. Unit validation + pediatric guardrails active.',
    },
  ],
  estonia: [
    {
      title: 'e-Residency Verification — Document Forgery Miss',
      input: 'e-Residency application batch, February 2026',
      analysis: '12 applications cleared automated identity verification.',
      whatHappened: '2 applications used high-quality forged supporting documents. Identity documents were genuine but supporting business documentation was fabricated.',
      whyFailed: 'AI focused on identity document authentication (which was genuine). Business document verification relied on format checking, not content validation against business registries.',
      howCaught: 'Background check officer (human-in-loop) flagged inconsistencies in business documentation during standard review process.',
      corrective: [
        'Added real-time business registry cross-validation for all supporting documents',
        'Implemented document provenance tracking for submitted materials',
        'Fraudulent document detection improved from 89% to 98.2%',
      ],
      status: 'Resolved. Business registry cross-validation active.',
    },
  ],
  'ee-finance': [
    {
      title: 'VAT Refund Processing — Legitimate Business Flagged',
      input: 'VAT refund claims batch processing, Q1 2026',
      analysis: 'Flagged 8 refund claims as potential fraud based on unusual refund-to-revenue ratios.',
      whatHappened: '6 of 8 were legitimate businesses with seasonal import patterns. Investigation delayed refunds by 45 days, causing cash flow issues for affected businesses.',
      whyFailed: 'Model trained on annual patterns. Seasonal businesses with large Q1 imports (e.g., agricultural equipment) had legitimate high refund-to-revenue ratios in Q1.',
      howCaught: 'Tax officer (human-in-loop) recognized seasonal pattern after businesses complained. Expedited review cleared 6 of 8.',
      corrective: [
        'Added seasonal industry adjustment factors to fraud detection model',
        'Implemented business history context — legitimate multi-year patterns treated differently',
        'False positive rate for seasonal businesses reduced from 34% to 5%',
      ],
      status: 'Resolved. Seasonal adjustment model active.',
    },
  ],
  'ee-social': [
    {
      title: 'Disability Benefits — Automated Assessment Bias',
      input: 'Disability benefit applications, batch processing February 2026',
      analysis: 'AI scored 24 applications as low-priority based on diagnostic codes.',
      whatHappened: '8 applicants with mental health conditions received lower priority scores despite equivalent functional limitations. Mental health diagnostic codes were underweighted.',
      whyFailed: 'Training data reflected historical human bias in processing mental health claims. Model perpetuated the pattern of deprioritizing mental health conditions.',
      howCaught: 'Social worker (human-in-loop) noticed pattern in appeal rates — mental health claims appealing at 3x the rate of physical health claims.',
      corrective: [
        'Retrained model with bias-adjusted training data for mental health conditions',
        'Added functional limitation scoring independent of diagnostic category',
        'Mental health claim approval rate aligned with physical health at equivalent severity levels',
      ],
      status: 'Resolved. Bias-corrected model v3.0 deployed.',
    },
  ],
  'ee-economic': [
    {
      title: 'GDP Nowcast — Construction Sector Overestimate',
      input: 'Real-time GDP indicators, Q4 2025',
      analysis: 'Nowcast GDP growth: 3.1%.',
      whatHappened: 'Final GDP: 2.4%. Construction permit data indicated growth but actual starts were delayed due to financing conditions not captured in permit data.',
      whyFailed: 'Model used building permits as leading indicator for construction output. Permit-to-start conversion rate dropped from historical 85% to 62% due to rising interest rates.',
      howCaught: 'Economist (human-in-loop) flagged divergence between permit data and construction employment data.',
      corrective: [
        'Added credit conditions and interest rate data as construction sector adjustments',
        'Implemented permit-to-start conversion rate as dynamic variable',
        'Construction sector nowcast error reduced from 28% to 8%',
      ],
      status: 'Resolved. Credit-adjusted construction model active.',
    },
  ],
  'ee-ria': [
    {
      title: 'False Positive — Allied Military Exercise Flagged as Attack',
      input: 'Network traffic anomaly detection, NATO communication channels',
      analysis: 'Critical: Unusual traffic pattern on government network consistent with DDoS staging.',
      whatHappened: 'Traffic was from NATO Cyber Coalition exercise. Legitimate allied activity was classified as hostile.',
      whyFailed: 'Exercise schedule was maintained in classified NATO portal not connected to the automated threat detection system. AI lacked the context.',
      howCaught: 'SOC analyst (human-in-loop) recognized exercise timing and verified with NATO liaison within 8 minutes.',
      corrective: [
        'Integrated NATO exercise schedule feed into threat detection context',
        'Added allied IP range whitelist with temporal activation windows',
        'Military exercise false positive rate reduced from 12% to 0.5%',
      ],
      status: 'Resolved. NATO exercise feed integrated.',
    },
  ],
};

/* -- Division-specific review queue items -- */
const divisionReviewQueue: Record<string, ReviewQueueItem[]> = {
  hcc: [
    {
      title: 'Bridge Load Rating Update',
      flag: 'Flagged for Review',
      confidence: 82,
      priority: 'High' as const,
      timestamp: 'Mar 26, 2026 — 10:22 AM',
      reviewer: 'Pending — structural engineer review',
      reasoning: [
        'Bridge #HCC-4472: load rating recalculated after deck rehabilitation.',
        'AI computed HS-20 rating of 1.12 — marginally above 1.0 minimum.',
        'Previous rating was 1.38 before rehab. Decrease unexpected.',
        'Potential issue with input deck thickness assumption.',
        'Recommend engineer verification of as-built dimensions.',
      ],
      outcome: null,
    },
    {
      title: 'Equipment Maintenance Schedule',
      flag: 'Auto-Approved',
      confidence: 95,
      priority: 'Low' as const,
      timestamp: 'Mar 26, 2026 — 09:15 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'CAT 349F excavator #HCC-E22: 4,800 hours since last major service.',
        'Manufacturer interval: 5,000 hours. Window: next 2 weeks.',
        'No scheduling conflicts detected. Parts in stock at depot.',
        'Service scheduled for April 2.',
      ],
      outcome: 'approved' as const,
    },
  ],
  hsi: [
    {
      title: 'Rail Defect Classification — Ambiguous Reading',
      flag: 'Manual Check Required',
      confidence: 74,
      priority: 'High' as const,
      timestamp: 'Mar 26, 2026 — 08:55 AM',
      reviewer: 'Pending — Level III UT technician',
      reasoning: [
        'TAM-4 reading at MP 312.4: anomaly detected in rail head.',
        'Signal pattern inconclusive — could be transverse defect or weld inclusion.',
        'Confidence split: 58% transverse defect, 42% benign inclusion.',
        'FRA requires verification of all ambiguous readings.',
        'Manual hand test recommended.',
      ],
      outcome: null,
    },
  ],
  htsi: [
    {
      title: 'Service Reduction Recommendation',
      flag: 'Flagged for Review',
      confidence: 79,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 07:30 AM',
      reviewer: 'Pending — transit operations manager',
      reasoning: [
        'Weekday off-peak ridership down 22% vs. 6-month average.',
        'AI recommends reducing frequency from 15min to 20min headways.',
        'Projected savings: $4,200/week in crew and fuel costs.',
        'Risk: customer satisfaction impact on commuter retention.',
        'Requires operations manager approval per service change policy.',
      ],
      outcome: null,
    },
  ],
  hti: [
    {
      title: 'PTC Software Update Validation',
      flag: 'Automated Override',
      confidence: 93,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 06:45 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'PTC firmware v4.2.1 update validated across 12 wayside units.',
        'All units responding within latency spec (<200ms).',
        'No signal degradation detected post-update.',
        'Auto-approved per standard update protocol.',
      ],
      outcome: 'approved' as const,
    },
  ],
  oakwood: [
    {
      title: 'Commercial Property Valuation — Appraisal Discrepancy',
      flag: 'Flagged for Review',
      confidence: 76,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 11:30 AM',
      reviewer: 'Pending — senior underwriter review',
      reasoning: [
        'Commercial property policy #OAK-CP-8821: AI valuation $4.2M.',
        'Recent comparable sales suggest $3.6M. Variance: 16.7%.',
        'Property has unique features (historical designation) complicating automated valuation.',
        'Recommend underwriter review of property-specific adjustments.',
      ],
      outcome: null,
    },
    {
      title: 'Workers Comp Claim Closure',
      flag: 'Auto-Approved',
      confidence: 94,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 09:45 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Claim #OAK-WC-3347: claimant returned to full duty March 15.',
        'All medical documentation received. No outstanding treatment.',
        'Total incurred within expected range for injury type.',
        'Closure recommended per standard protocol.',
      ],
      outcome: 'approved' as const,
    },
    {
      title: 'Catastrophe Reserve Estimate — Tornado Season',
      flag: 'Manual Check Required',
      confidence: 68,
      priority: 'Critical' as const,
      timestamp: 'Mar 26, 2026 — 04:00 PM',
      reviewer: 'Pending — chief actuary review',
      reasoning: [
        'AI estimates $42M catastrophe reserve needed for upcoming tornado season.',
        'Historical 5-year average: $28M. Climate-adjusted model: $38M.',
        'AI used expanded geographic risk zone that includes new policy concentrations.',
        'Variance from historical warrants actuarial review.',
      ],
      outcome: null,
    },
  ],
  pinnacle: [
    {
      title: 'ICU Bed Capacity Forecast — Surge Planning',
      flag: 'Flagged for Review',
      confidence: 81,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 08:00 AM',
      reviewer: 'Pending — CMO review',
      reasoning: [
        'AI predicts ICU at 94% capacity within 72 hours based on current admissions trend.',
        'Flu season + 3 scheduled complex surgeries contributing to surge.',
        'Recommends activating surge protocol and diverting elective surgical cases.',
        'Historical accuracy of 72-hour forecast: 87%. Margin of error warrants review.',
      ],
      outcome: null,
    },
    {
      title: 'Medication Reconciliation — Discharge Orders',
      flag: 'Auto-Approved',
      confidence: 96,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 07:15 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Discharge medication reconciliation for 12 patients.',
        'All medications verified against active formulary and insurance coverage.',
        'No drug interactions detected. Dosages within therapeutic ranges.',
        'Pharmacy sign-off complete.',
      ],
      outcome: 'approved' as const,
    },
    {
      title: 'Clinical Trial Protocol Amendment',
      flag: 'Manual Check Required',
      confidence: 72,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 03:30 PM',
      reviewer: 'Pending — IRB review required',
      reasoning: [
        'AI analysis suggests protocol amendment to expand inclusion criteria for Phase II trial.',
        'Additional 120 patients would qualify based on biomarker analysis.',
        'Requires IRB approval and FDA notification per 21 CFR 312.30.',
        'Recommends IRB review of risk-benefit for expanded population.',
      ],
      outcome: null,
    },
  ],
  atlas: [
    {
      title: 'Tool Wear Prediction — New Material Grade',
      flag: 'Flagged for Review',
      confidence: 73,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 10:15 AM',
      reviewer: 'Pending — process engineer review',
      reasoning: [
        'New Inconel 718 grade introduced on CNC-12. AI tool wear model trained on standard grade.',
        'Predicted tool life: 180 minutes. Limited data on new grade (12 runs only).',
        'Recommend conservative tool change interval until model retrains with more data.',
        'Risk of tool breakage if prediction is optimistic.',
      ],
      outcome: null,
    },
    {
      title: 'Incoming Material Inspection — Steel Batch Certification',
      flag: 'Auto-Approved',
      confidence: 97,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 08:30 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Steel batch #AT-4421: mill certificate matches PO specifications.',
        'Chemistry within spec. Mechanical properties verified.',
        'Supplier rating: A+ (98.4% historical conformance).',
        'Batch released to production.',
      ],
      outcome: 'approved' as const,
    },
  ],
  northbridge: [
    {
      title: 'Cross-Division Budget Variance — Consolidated View',
      flag: 'Flagged for Review',
      confidence: 77,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 09:00 AM',
      reviewer: 'Pending — CFO review',
      reasoning: [
        'Consolidated Q1 spending 8.2% over budget across 4 divisions.',
        'NB-Aerospace driving 60% of variance due to titanium procurement acceleration.',
        'AI recommends budget reallocation from NB-Financial underspend.',
        'Cross-division budget transfers require CFO approval per policy.',
      ],
      outcome: null,
    },
    {
      title: 'Enterprise Cybersecurity Posture Assessment',
      flag: 'Manual Check Required',
      confidence: 82,
      priority: 'Critical' as const,
      timestamp: 'Mar 26, 2026 — 05:00 PM',
      reviewer: 'Pending — CISO review',
      reasoning: [
        'AI identified 12 systems across divisions with mismatched security patch levels.',
        'NB-Health and NB-Financial have compliance implications (HIPAA, SOX).',
        'Recommend enterprise-wide patch coordination rather than division-by-division approach.',
        'Requires CISO sign-off on coordinated patching schedule.',
      ],
      outcome: null,
    },
    {
      title: 'Workforce Analytics — Attrition Risk Report',
      flag: 'Auto-Approved',
      confidence: 91,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 02:00 PM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Quarterly attrition risk report generated across all 4 divisions.',
        '42 employees flagged as high attrition risk based on engagement + market signals.',
        'Retention recommendations auto-generated and sent to HR business partners.',
        'Report consistent with HR team manual assessments.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'nb-aerospace': [
    {
      title: 'Flight Test Data — Structural Load Anomaly',
      flag: 'Flagged for Review',
      confidence: 79,
      priority: 'Critical' as const,
      timestamp: 'Mar 27, 2026 — 07:30 AM',
      reviewer: 'Pending — chief stress engineer review',
      reasoning: [
        'Wing root strain gauge reading 12% above predicted value during -1g pushover maneuver.',
        'AI model predicts structural margin still positive (1.18 reserve factor).',
        'Discrepancy between model and test data exceeds 10% review threshold.',
        'Recommend DER review before expanding flight envelope.',
      ],
      outcome: null,
    },
    {
      title: 'Supplier Quality Audit — Composite Layup Facility',
      flag: 'Auto-Approved',
      confidence: 95,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 04:30 PM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Quarterly supplier audit report for Tier-1 composite supplier.',
        'All 18 quality metrics within acceptable range. Zero NCRs in 90 days.',
        'AS9100 certification current. No findings from last external audit.',
        'Supplier rating maintained at A.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'nb-energy': [
    {
      title: 'Emissions Reporting — Carbon Credit Calculation',
      flag: 'Manual Check Required',
      confidence: 74,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 10:45 AM',
      reviewer: 'Pending — environmental compliance officer',
      reasoning: [
        'AI calculated carbon credit balance: 14,200 tons CO2e surplus.',
        'New EPA methodology (40 CFR 98) changes calculation for methane leaks.',
        'Difference between old and new methodology: 2,800 tons CO2e.',
        'Recommend compliance officer verify new methodology application.',
      ],
      outcome: null,
    },
    {
      title: 'Pipeline Maintenance Schedule — Risk-Based Prioritization',
      flag: 'Auto-Approved',
      confidence: 93,
      priority: 'Medium' as const,
      timestamp: 'Mar 27, 2026 — 08:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Quarterly pipeline maintenance schedule generated using risk-based model.',
        'Top 5 segments prioritized by corrosion rate, age, and consequence of failure.',
        'All segments within PHMSA compliance intervals.',
        'Schedule coordinated with operations for minimal throughput impact.',
      ],
      outcome: 'approved' as const,
    },
    {
      title: 'Solar Farm Output — Inverter Degradation Alert',
      flag: 'Flagged for Review',
      confidence: 83,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 01:30 PM',
      reviewer: 'Pending — solar operations engineer',
      reasoning: [
        'Inverter cluster C-7 at Solar Farm 3 showing 6% efficiency decline over 90 days.',
        'AI attributes to capacitor degradation based on harmonic distortion pattern.',
        'Warranty claim may be applicable — unit is 18 months old with 10-year warranty.',
        'Recommend field inspection to confirm before warranty submission.',
      ],
      outcome: null,
    },
  ],
  'nb-financial': [
    {
      title: 'Suspicious Activity Report — Complex Entity Network',
      flag: 'Manual Check Required',
      confidence: 84,
      priority: 'Critical' as const,
      timestamp: 'Mar 27, 2026 — 08:15 AM',
      reviewer: 'Pending — BSA officer review',
      reasoning: [
        'AI mapped 8-entity network with layered ownership obscuring beneficial owner.',
        'Transaction pattern shows funds flowing through 4 jurisdictions before settling.',
        'Matches 3 of 5 FinCEN red flags for trade-based money laundering.',
        'Confidence below 90% due to partial ownership data. Recommend BSA officer review before SAR filing.',
      ],
      outcome: null,
    },
    {
      title: 'Regulatory Capital Calculation — Daily Report',
      flag: 'Auto-Approved',
      confidence: 98,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 06:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Daily regulatory capital ratio calculated: Tier 1 CET1 at 12.8% (minimum: 7.0%).',
        'All risk-weighted asset calculations within expected ranges.',
        'No significant market movements affecting capital buffers.',
        'Report filed with OCC portal automatically.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'nb-health': [
    {
      title: 'Drug Interaction Alert — Novel Combination',
      flag: 'Flagged for Review',
      confidence: 71,
      priority: 'Critical' as const,
      timestamp: 'Mar 27, 2026 — 09:30 AM',
      reviewer: 'Pending — clinical pharmacist review',
      reasoning: [
        'Patient prescribed novel combination of immunotherapy + targeted therapy.',
        'AI literature review found 3 case reports suggesting cardiac toxicity risk.',
        'No FDA labeling for this specific combination. Limited clinical data.',
        'Recommend pharmacist + oncologist review before dispensing.',
      ],
      outcome: null,
    },
    {
      title: 'Lab Result Trending — Normal Pattern',
      flag: 'Auto-Approved',
      confidence: 96,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 07:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Daily lab result trend analysis for 240 inpatients.',
        'All critical values flagged and communicated per protocol.',
        'No anomalous trends detected outside expected clinical trajectories.',
        'Report distributed to nursing stations.',
      ],
      outcome: 'approved' as const,
    },
  ],
  estonia: [
    {
      title: 'Digital Identity — Authentication Anomaly Pattern',
      flag: 'Flagged for Review',
      confidence: 80,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 11:00 AM',
      reviewer: 'Pending — ID-card security team',
      reasoning: [
        'AI detected 340 authentication attempts from unusual geographic clusters.',
        'Pattern suggests possible credential stuffing attack against ID-card portal.',
        'All attempts failed — existing controls held. But volume is 5x normal baseline.',
        'Recommend security team review for potential coordinated attack assessment.',
      ],
      outcome: null,
    },
    {
      title: 'X-Road Service Health — Monthly Availability Report',
      flag: 'Auto-Approved',
      confidence: 97,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 06:30 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'X-Road platform availability: 99.97% for March 2026.',
        'All 847 registered services reporting within SLA thresholds.',
        'Zero critical incidents. 2 minor incidents resolved within 15 minutes.',
        'Monthly report published to service dashboard.',
      ],
      outcome: 'approved' as const,
    },
    {
      title: 'Data Governance — Cross-Agency Access Review',
      flag: 'Manual Check Required',
      confidence: 75,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 03:00 PM',
      reviewer: 'Pending — data protection officer review',
      reasoning: [
        'Quarterly access review identified 28 cross-agency data sharing agreements.',
        '4 agreements have data access patterns exceeding stated purpose scope.',
        'GDPR Article 5(1)(b) purpose limitation may be at risk.',
        'Recommend DPO review of 4 flagged agreements before renewal.',
      ],
      outcome: null,
    },
  ],
  'ee-finance': [
    {
      title: 'Bank Stress Test — Capital Adequacy Scenario',
      flag: 'Flagged for Review',
      confidence: 78,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 10:00 AM',
      reviewer: 'Pending — banking supervisor review',
      reasoning: [
        'AI stress test shows 1 bank marginally below Pillar 2 capital requirement in adverse scenario.',
        'Capital ratio: 8.12% vs 8.25% requirement in severely adverse case.',
        'Shortfall of EUR 14M. Bank has conditional capital instruments available.',
        'Recommend supervisor review of conditional capital treatment.',
      ],
      outcome: null,
    },
    {
      title: 'Tax Compliance — Automated Filing Verification',
      flag: 'Auto-Approved',
      confidence: 98,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 07:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Monthly VAT filing batch: 12,400 returns processed.',
        'All returns reconciled against payment records.',
        'Zero discrepancies detected above EUR 50 threshold.',
        'Batch filing report generated for audit trail.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'ee-social': [
    {
      title: 'Benefits Eligibility — Policy Change Impact',
      flag: 'Flagged for Review',
      confidence: 77,
      priority: 'High' as const,
      timestamp: 'Mar 27, 2026 — 09:15 AM',
      reviewer: 'Pending — policy director review',
      reasoning: [
        'New family benefit policy effective April 1 affects 8,400 active claims.',
        'AI identified 1,200 claims requiring eligibility recalculation.',
        'Estimated budget impact: EUR 2.4M annually.',
        'Recommend policy director verify transition rules before batch recalculation.',
      ],
      outcome: null,
    },
    {
      title: 'Monthly Benefits Disbursement — Batch Processing',
      flag: 'Auto-Approved',
      confidence: 99,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 06:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Monthly disbursement batch: 142,000 payments totaling EUR 89M.',
        'All payments reconciled against eligibility records.',
        'Zero anomalies detected. Payment file submitted to bank.',
        'Confirmation expected within 24 hours.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'ee-economic': [
    {
      title: 'Trade Statistics — Classification Anomaly',
      flag: 'Flagged for Review',
      confidence: 74,
      priority: 'Medium' as const,
      timestamp: 'Mar 27, 2026 — 10:30 AM',
      reviewer: 'Pending — trade statistician review',
      reasoning: [
        'AI detected 42 customs declarations with HS code classifications inconsistent with product descriptions.',
        'Potential impact on trade balance reporting: EUR 18M in misclassified exports.',
        'Could affect quarterly trade statistics publication scheduled for April 7.',
        'Recommend statistician review before publication.',
      ],
      outcome: null,
    },
    {
      title: 'Consumer Price Index — Monthly Calculation',
      flag: 'Auto-Approved',
      confidence: 97,
      priority: 'Low' as const,
      timestamp: 'Mar 27, 2026 — 08:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Monthly CPI calculation completed: 2.3% year-over-year.',
        'All 12 expenditure categories within expected seasonal ranges.',
        'Web-scraped prices aligned with field-collected prices within 0.2%.',
        'CPI report prepared for scheduled publication.',
      ],
      outcome: 'approved' as const,
    },
  ],
  'ee-ria': [
    {
      title: 'Critical Infrastructure — Unusual Network Traffic Pattern',
      flag: 'Manual Check Required',
      confidence: 85,
      priority: 'Critical' as const,
      timestamp: 'Mar 27, 2026 — 07:45 AM',
      reviewer: 'Pending — SOC tier 3 analyst',
      reasoning: [
        'Anomalous outbound traffic from power grid SCADA network to previously unseen IP range.',
        'Traffic volume low (2.4KB) but destination is in non-allied jurisdiction.',
        'Pattern inconsistent with known maintenance or vendor connections.',
        'SCADA network should have no internet-facing connections per policy.',
        'Recommend immediate SOC investigation and network forensics.',
      ],
      outcome: null,
    },
    {
      title: 'Government Endpoint Security — Patch Compliance Report',
      flag: 'Auto-Approved',
      confidence: 96,
      priority: 'Medium' as const,
      timestamp: 'Mar 27, 2026 — 06:00 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'Weekly patch compliance scan: 98.4% of government endpoints current.',
        '1.6% pending (within 7-day deployment window).',
        'Zero critical vulnerabilities unpatched beyond policy deadline.',
        'Compliance report distributed to ministry IT leads.',
      ],
      outcome: 'approved' as const,
    },
    {
      title: 'Threat Intelligence — Attribution Assessment',
      flag: 'Flagged for Review',
      confidence: 76,
      priority: 'High' as const,
      timestamp: 'Mar 26, 2026 — 04:30 PM',
      reviewer: 'Pending — threat intelligence lead',
      reasoning: [
        'AI attributes recent phishing campaign to known APT group with 76% confidence.',
        'TTPs partially match but infrastructure is new and unconfirmed.',
        'Attribution confidence below 85% threshold for inter-agency sharing.',
        'Recommend manual TTP analysis before sharing with NATO CERT.',
      ],
      outcome: null,
    },
  ],
};

/* -- Sparkline (30 days) -- */
function generateSparkline(startVal: number, endVal: number) {
  const pts = [];
  for (let i = 29; i >= 0; i--) {
    const p = (29 - i) / 29;
    const noise = Math.sin(i * 1.3) * 0.4 + Math.cos(i * 0.7) * 0.3;
    pts.push({
      d: 29 - i,
      v: Math.round((startVal + (endVal - startVal) * p + noise) * 10) / 10,
    });
  }
  return pts;
}

/* -- 6-month performance data (generated per division to match current values) -- */
function buildPerfData(accuracy: number, falsePositive: number, testsPerDay: number) {
  // Work backwards from current March values to Oct start
  const accStart = Math.round((accuracy - 5.2) * 10) / 10;
  const fpStart = Math.round((falsePositive + 4.9) * 10) / 10;
  const testStart = Math.round(testsPerDay * 0.4);
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return months.map((month, i) => {
    const t = i / 5; // 0 to 1
    return {
      month,
      accuracy: Math.round((accStart + (accuracy - accStart) * t) * 10) / 10,
      falsePositive: Math.round((fpStart + (falsePositive - fpStart) * t) * 10) / 10,
      tests: Math.round(testStart + (testsPerDay - testStart) * t),
    };
  });
}
/* buildPerfData is used in the component via useMemo */

/* -- Success examples -- */
const successExamplesDefault = [
  {
    title: 'Track Geometry — AI Caught a Developing Defect',
    input: 'Geometry car readings MP 247.1-249.3, March 18, 2026',
    analysis:
      'AI ANALYSIS: Surface deviation trending from 1.2" to 1.6" over 90 days. Rate of change suggests Class 4 exceedance (2.0" limit) within 21 days.',
    expert:
      'Reviewed same data, concurred. Noted: "AI caught the TREND that I would have missed in a batch review. The individual readings were within spec at the time of measurement, but the trend indicates imminent exceedance."',
    expertName: 'Senior Inspector J. Martinez',
    outcome: 'Preventive maintenance scheduled. Avoided emergency speed restriction.',
    savings: '$47,000 in avoided emergency response + schedule disruption',
    confidence: 94.2,
  },
  {
    title: 'License Optimization — Identified Shadow IT',
    input: 'Azure AD login logs + eCMS license records, Q1 2026',
    analysis:
      '34 users in HCC have active eCMS licenses but zero logins in 180 days. 12 users are using unauthorized Airtable as a project tracking substitute.',
    expert:
      'IT Director confirmed. "We had no visibility into this. The Airtable usage explains why our Primavera adoption was lower than expected."',
    expertName: 'IT Director',
    outcome: '34 eCMS licenses reclaimed ($68,000/yr). Airtable migration plan created.',
    savings: '$68,000/yr in license recovery + improved data governance',
    confidence: 98.1,
  },
  {
    title: 'Crew Scheduling — Optimized Across Divisions',
    input: 'MCP schedules + project timelines, HTSI + HCC divisions',
    analysis:
      'Cross-division crew sharing opportunity: 8 certified operators in HTSI idle 3 days/week while HCC has 12 unfilled shifts requiring same certifications.',
    expert:
      'Ops Manager: "We\'ve been trying to solve this manually for years. The cross-division visibility doesn\'t exist in our current systems."',
    expertName: 'Operations Manager',
    outcome: 'Cross-division crew sharing pilot launched.',
    savings: '$156,000/yr in reduced overtime + contractor costs',
    confidence: 91.7,
  },
];

/* -- Failure examples -- */
const failureExamplesDefault = [
  {
    title: 'False Positive — PTC Signal Anomaly',
    input: 'Signal system telemetry, PTC Zone 12',
    analysis:
      'Critical: Intermittent signal loss detected on wayside device WD-4472. Recommending immediate field inspection.',
    whatHappened:
      'Signal variance was caused by planned firmware update on adjacent device. Normal maintenance activity not flagged in the operations log.',
    whyFailed:
      'Maintenance schedule was in a separate system (paper-based log) not yet connected via MCP. AI lacked context.',
    howCaught:
      'Human-in-loop reviewer (HTI signal engineer) recognized the firmware update pattern. Flagged as false positive in 22 minutes.',
    corrective: [
      'Added maintenance schedule as required context input',
      'Retrained model with 340 maintenance-window samples',
      'False positive rate for signal anomalies dropped from 4.2% to 0.8%',
    ],
    status: 'Resolved. Model v2.3.1 deployed.',
  },
  {
    title: 'Confidence Miscalibration — Cost Estimate',
    input: 'Project bid package, I-70 Bridge Rehabilitation',
    analysis: 'Estimated cost: $2.4M (confidence: 89%)',
    whatHappened:
      'Actual winning bid was $3.1M. AI underestimated material costs for specialty bridge bearings by 40%.',
    whyFailed:
      'Training data did not include post-2024 material price surges for specialty steel. Model was calibrated on 2020-2023 pricing.',
    howCaught:
      'PM review (human-in-loop) flagged the 89% confidence as suspicious for a specialty project. Requested manual vendor quotes.',
    corrective: [
      'Integrated real-time material pricing feed from RS Means',
      'Added "specialty materials" flag that triggers mandatory human review',
      'Recalibrated confidence scoring — this would now show 67% confidence',
    ],
    status: 'Model v3.1.0 with pricing feed active. Confidence calibration error reduced from \u00b118% to \u00b16%.',
  },
];

/* -- Human-in-loop review queue -- */
const reviewQueueDefault = [
  {
    title: 'Track Defect Classification',
    flag: 'Flagged for Review',
    confidence: 78,
    priority: 'High' as const,
    timestamp: 'Mar 26, 2026 — 09:14 AM',
    reviewer: 'Pending assignment',
    reasoning: [
      'Geometry car data shows 2.3" surface deviation at MP 247.3.',
      'Compared against Class 4 threshold (2.0"): EXCEEDS by 0.3".',
      'Prior reading was 2.5" on Mar 12 — trend is improving but still non-compliant.',
      'Absolute value exceeds FRA limit regardless of trend direction.',
      'Immediate speed restriction recommended per FRA §213.9. Maintenance crew dispatched.',
    ],
    outcome: null,
  },
  {
    title: 'Crew Certification Expiry',
    flag: 'Automated Override',
    confidence: 92,
    priority: 'Medium' as const,
    timestamp: 'Mar 26, 2026 — 08:42 AM',
    reviewer: 'Auto-approved (above 90% threshold)',
    reasoning: [
      'Employee [REDACTED] — Locomotive Engineer, certification expires Apr 9, 2026.',
      'Renewal program available: 2-day refresher (Apr 1-2).',
      'No scheduling conflicts detected in MCP.',
      'Auto-scheduled renewal training.',
    ],
    outcome: 'approved' as const,
  },
  {
    title: 'Cost Estimate Variance',
    flag: 'Manual Check Required',
    confidence: 71,
    priority: 'Medium' as const,
    timestamp: 'Mar 25, 2026 — 04:18 PM',
    reviewer: 'Pending — PM review required',
    reasoning: [
      'Project: I-70 Bridge Rehabilitation bid analysis.',
      'AI estimate: $2.4M. Historical average for similar scope: $1.95M.',
      'Variance: +23% above historical.',
      'Specialty materials detected but pricing feed shows 2024 data only.',
      'Confidence lowered due to data recency gap.',
    ],
    outcome: 'corrected' as const,
  },
  {
    title: 'Signal System Anomaly',
    flag: 'Flagged',
    confidence: 84,
    priority: 'Critical' as const,
    timestamp: 'Mar 25, 2026 — 02:07 PM',
    reviewer: 'Assigned to HTI signal team',
    reasoning: [
      'PTC Zone 12, MP 89-94: intermittent signal degradation on WD-4472.',
      'Pattern: 3 signal drops in 4 hours, each lasting 12-18 seconds.',
      'Cross-referenced with weather: no correlation.',
      'Cross-referenced with train traffic: no correlation.',
      'Possible wayside device failure. Field inspection recommended.',
    ],
    outcome: 'rejected' as const,
  },
  {
    title: 'Environmental Compliance Report',
    flag: 'Auto-Approved',
    confidence: 97,
    priority: 'Low' as const,
    timestamp: 'Mar 25, 2026 — 10:33 AM',
    reviewer: 'Auto-approved',
    reasoning: [
      'IC Environmental — wetland mitigation compliance quarterly report.',
      'All 14 parameters within EPA/state limits.',
      'No exceedances detected. Trend analysis: stable across all metrics.',
    ],
    outcome: 'approved' as const,
  },
];

/* -- Testing methodology categories -- */
const testCategories = [
  {
    name: 'Accuracy Tests',
    desc: 'Compare AI output against human expert baseline. 500+ validated cases.',
    count: 500,
  },
  {
    name: 'Consistency Tests',
    desc: 'Same input, different times \u2192 same output? Measures determinism.',
    count: 120,
  },
  {
    name: 'Boundary Tests',
    desc: 'Edge cases: data at exact FRA limits, ambiguous measurements, incomplete inputs.',
    count: 85,
  },
  {
    name: 'Adversarial Tests',
    desc: 'Deliberately corrupt/misleading inputs to test robustness.',
    count: 42,
  },
  {
    name: 'Drift Detection',
    desc: 'Weekly model performance comparison against baseline. Alert on >3% deviation.',
    count: 60,
  },
  {
    name: 'FRA Compliance Suite',
    desc: 'Every output checked against FRA Part 213 requirements.',
    count: 40,
  },
];

/* -- Workflow thresholds & config -- */
const thresholdConfig = [
  {
    category: 'Safety-Critical',
    workflows: ['Track Geometry', 'PTC Signal Verification', 'Safety Compliance'],
    threshold: 95,
    color: '#EF4444',
    status: 'FRA Certified' as const,
  },
  {
    category: 'Operational',
    workflows: ['Crew Scheduling', 'Fleet Utilization', 'Dispatch Route'],
    threshold: 85,
    color: '#F59E0B',
    status: 'Certified' as const,
  },
  {
    category: 'Financial',
    workflows: ['Project Cost Estimation', 'Material & Ballast Logistics'],
    threshold: 80,
    color: '#3B82F6',
    status: 'In Review' as const,
    note: '+ mandatory human review',
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

function priorityBadge(p: 'Critical' | 'High' | 'Medium' | 'Low') {
  const s: Record<string, string> = {
    Critical: 'bg-[#EF4444]/10 text-[#EF4444]',
    High: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    Medium: 'bg-blue/10 text-blue',
    Low: 'bg-ink-faint/20 text-ink-tertiary',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${s[p]}`}>
      {p}
    </span>
  );
}

function outcomeBadge(o: 'approved' | 'corrected' | 'rejected' | null) {
  if (!o) return <span className="text-[10px] text-ink-faint italic">Pending</span>;
  const map: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', label: 'Approved' },
    corrected: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Corrected' },
    rejected: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', label: 'Rejected (False Positive)' },
  };
  const m = map[o];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.bg} ${m.text}`}>{m.label}</span>;
}

function CountUp({ end, duration = 1.2 }: { end: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <>{value.toFixed(1)}</>;
}

/** Horizontal bar with animated fill */
function HBar({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-ink-tertiary w-[110px] shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface/80 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] font-semibold tabular-nums w-[65px] text-right" style={{ color }}>
        {pct}%{label === 'Drift Detection' ? ' drift' : ''}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function Reliability() {
  const { company } = useCompany();
  const divKey = company.id;
  const rel = divisionReliability[divKey] || divisionReliability.meridian;

  /* Live test counter */
  const [testsToday, setTestsToday] = useState(rel.testsPerDay);
  useEffect(() => {
    setTestsToday(rel.testsPerDay);
  }, [rel.testsPerDay]);
  useEffect(() => {
    const id = setInterval(() => setTestsToday((v) => v + 1), 100_000);
    return () => clearInterval(id);
  }, []);

  /* Expandable review queue */
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  /* Division-specific data */
  const perfData = useMemo(() => buildPerfData(rel.accuracy, rel.falsePositive, rel.testsPerDay), [rel.accuracy, rel.falsePositive, rel.testsPerDay]);
  const sparkData = useMemo(() => generateSparkline(rel.accuracy - 2.4, rel.accuracy), [rel.accuracy]);
  const successExamples = divisionSuccessExamples[divKey] || successExamplesDefault;
  const failureExamples = divisionFailureExamples[divKey] || failureExamplesDefault;
  const reviewQueue = divisionReviewQueue[divKey] || reviewQueueDefault;

  const subScores = [
    { label: 'Accuracy', pct: rel.accuracy, color: '#22C55E' },
    { label: 'Consistency', pct: Math.round((rel.accuracy - 1.1) * 10) / 10, color: '#22C55E' },
    { label: 'FRA Compliance', pct: Math.round((rel.accuracy + 1.2) * 10) / 10 > 100 ? 99.8 : Math.round((rel.accuracy + 1.2) * 10) / 10, color: '#22C55E' },
    { label: 'Drift Detection', pct: rel.falsePositive < 2 ? 1.2 : rel.falsePositive > 4 ? 3.8 : 2.1, color: '#F59E0B' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <h1 className="text-2xl font-semibold text-ink tracking-tight mt-2">AI Reliability Testing</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Continuous validation ensuring AI outputs meet FRA safety standards — including where AI fails
        </p>
      </div>

      {/* ━━━ SECTION 1: Trust Score Dashboard ━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6 lg:p-8"
      >
        {/* Top row: big score + sparkline */}
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
          <div className="text-center lg:text-left">
            <p className="text-xs font-medium text-ink-tertiary uppercase tracking-widest mb-2">
              Overall Trust Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl lg:text-7xl font-bold tracking-tight text-emerald-500">
                <CountUp end={rel.accuracy} />
              </span>
              <span className="text-3xl font-semibold text-emerald-500">%</span>
            </div>
            <p className="text-xs text-ink-tertiary mt-1">{rel.workflows} active workflows, {testsToday.toLocaleString()} tests/day</p>
          </div>

          {/* Inline sparkline */}
          <div className="flex-1 w-full max-w-[320px] h-[56px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={1.5} fill="url(#sparkGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-ink-faint text-center mt-0.5">30-day trend</p>
          </div>

          {/* Live counter */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/60 border border-border/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
            </span>
            <span className="text-[11px] font-medium text-ink-secondary tabular-nums">
              Tests today: {testsToday.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sub-score bars */}
        <div className="space-y-2.5 max-w-[600px] mx-auto">
          {subScores.map((s) => (
            <HBar key={s.label} pct={s.pct} color={s.color} label={s.label} />
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 2: Success Examples ━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#22C55E]" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">AI Got It Right — Success Examples</h2>
        </div>
        <div className="space-y-4">
          {successExamples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-border bg-surface-raised overflow-hidden"
              style={{ borderLeftWidth: 4, borderLeftColor: '#22C55E' }}
            >
              <div className="p-5 lg:p-6 space-y-4">
                <h3 className="text-[13px] font-semibold text-ink">{ex.title}</h3>

                {/* Input */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">Input</span>
                  <p className="text-[12px] text-ink-secondary mt-0.5 font-mono bg-surface/60 rounded px-2 py-1">
                    {ex.input}
                  </p>
                </div>

                {/* AI Analysis */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    AI Analysis
                  </span>
                  <p className="text-[12px] text-ink mt-0.5 font-mono bg-surface/60 rounded px-2 py-1.5 leading-relaxed">
                    &quot;{ex.analysis}&quot;
                  </p>
                </div>

                {/* Human Expert */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    Human Expert Validation
                  </span>
                  <p className="text-[12px] text-ink-secondary mt-0.5 italic leading-relaxed">
                    {ex.expert}
                  </p>
                </div>

                {/* Bottom row: outcome, savings, confidence */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-border/50 text-[11px]">
                  <div>
                    <span className="text-ink-tertiary">Outcome: </span>
                    <span className="text-ink font-medium">{ex.outcome}</span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary">Savings: </span>
                    <span className="text-[#22C55E] font-semibold">{ex.savings}</span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary">Confidence: </span>
                    <span className="text-ink font-semibold">{ex.confidence}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span className="text-ink-tertiary">Verified by {ex.expertName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 3: Failure Examples ━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <XCircle className="w-4 h-4 text-[#EF4444]" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">AI Got It Wrong — Failure Examples</h2>
        </div>
        <p className="text-[11px] text-ink-tertiary mb-4 ml-6">
          Transparency about failures builds more trust than pretending everything works perfectly.
        </p>
        <div className="space-y-4">
          {failureExamples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-border overflow-hidden"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: '#EF4444',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 40%, transparent 70%)',
              }}
            >
              <div className="p-5 lg:p-6 space-y-4">
                <h3 className="text-[13px] font-semibold text-ink">{ex.title}</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left column */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        Input
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 font-mono bg-surface/60 rounded px-2 py-1">
                        {ex.input}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        AI Analysis
                      </span>
                      <p className="text-[12px] text-ink mt-0.5 font-mono bg-surface/60 rounded px-2 py-1.5 leading-relaxed">
                        &quot;{ex.analysis}&quot;
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EF4444]">
                        What Actually Happened
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.whatHappened}</p>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EF4444]">
                        Why AI Failed
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.whyFailed}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        How System Caught It
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.howCaught}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        Corrective Action
                      </span>
                      <ol className="mt-1 space-y-0.5">
                        {ex.corrective.map((c, i) => (
                          <li key={i} className="text-[12px] text-ink-secondary flex gap-1.5">
                            <span className="text-ink-faint shrink-0">{i + 1}.</span>
                            {c}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  <span className="text-[11px] text-ink-secondary">
                    <span className="font-medium">Current Status:</span> {ex.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 4: Reliability Testing Methodology ━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="rounded-xl border border-border bg-surface-raised p-6 lg:p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Reliability Testing Methodology</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Pyramid */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-4">Test Pyramid</h3>
            <div className="space-y-0 font-mono text-[12px]">
              {/* E2E tier */}
              <div className="flex items-stretch">
                <div className="w-full max-w-[320px] mx-auto">
                  <div
                    className="rounded-t-lg border border-red-200 bg-red-50 px-4 py-4 text-center shadow-sm"
                    style={{ width: '50%', margin: '0 auto' }}
                  >
                    <p className="text-ink font-semibold text-[11px]">E2E Tests</p>
                    <p className="text-ink-tertiary text-[10px]">Full flow</p>
                    <p className="text-ink-secondary text-[10px]">Human expert comparison</p>
                  </div>
                  <div className="text-right pr-2 text-[10px] text-ink-faint -mt-6">12/day</div>
                </div>
              </div>
              {/* Integration tier */}
              <div className="w-full max-w-[320px] mx-auto">
                <div
                  className="border border-amber-200 border-t-0 bg-amber-50 px-4 py-4 text-center shadow-sm"
                  style={{ width: '75%', margin: '0 auto' }}
                >
                  <p className="text-ink font-semibold text-[11px]">Integration Tests</p>
                  <p className="text-ink-tertiary text-[10px]">Cross-system consistency</p>
                </div>
                <div className="text-right pr-2 text-[10px] text-ink-faint -mt-5">89/day</div>
              </div>
              {/* Unit tier */}
              <div className="w-full max-w-[320px] mx-auto">
                <div className="rounded-b-lg border border-emerald-200 border-t-0 bg-emerald-50 px-4 py-4 text-center shadow-sm">
                  <p className="text-ink font-semibold text-[11px]">Unit Tests</p>
                  <p className="text-ink-tertiary text-[10px]">Individual model assertions</p>
                </div>
                <div className="text-right pr-2 text-[10px] text-ink-faint -mt-5">746/day</div>
              </div>
              <p className="text-center text-[11px] text-ink-secondary font-semibold mt-3 font-sans">
                Total: {testsToday.toLocaleString()} tests/day
              </p>
            </div>
          </div>

          {/* Testing categories */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
              Testing Categories
            </h3>
            <div className="space-y-3">
              {testCategories.map((tc, i) => (
                <div key={tc.name} className="flex gap-3">
                  <span className="text-[11px] text-ink-faint font-mono shrink-0 w-4 text-right">{i + 1}.</span>
                  <div>
                    <span className="text-[12px] font-semibold text-ink">{tc.name}</span>
                    <span className="text-[11px] text-ink-tertiary ml-1.5">({tc.count}+ cases)</span>
                    <p className="text-[11px] text-ink-secondary leading-relaxed">{tc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SECTION 5: Human-in-the-Loop Queue ━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Human-in-the-Loop Review Queue</h2>
          <span className="ml-auto text-[11px] text-ink-tertiary">{reviewQueue.length} items</span>
        </div>
        <div className="space-y-3">
          {reviewQueue.map((item) => {
            const isOpen = expandedItem === item.title;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-surface-raised overflow-hidden cursor-pointer transition-colors hover:border-border/80"
                onClick={() => setExpandedItem(isOpen ? null : item.title)}
              >
                {/* Confidence bar */}
                <div className="h-1 bg-surface">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.confidence}%`,
                      backgroundColor: item.confidence >= 90 ? '#22C55E' : item.confidence >= 80 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
                <div className="p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-ink-tertiary mt-0.5 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h3 className="text-[13px] font-semibold text-ink">
                          {item.title}
                          <span className="ml-2 text-[11px] font-normal text-ink-tertiary">— {item.flag}</span>
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-[11px] font-medium"
                            style={{
                              color:
                                item.confidence >= 90
                                  ? '#22C55E'
                                  : item.confidence >= 80
                                    ? '#F59E0B'
                                    : '#EF4444',
                            }}
                          >
                            AI confidence: {item.confidence}%
                          </span>
                          <span className="text-[10px] text-ink-faint">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {outcomeBadge(item.outcome)}
                      {priorityBadge(item.priority)}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-3 border-t border-border/50 space-y-3">
                          {/* AI reasoning chain */}
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                              AI Reasoning Chain
                            </span>
                            <div className="mt-1.5 space-y-1 font-mono text-[11px] text-ink-secondary bg-surface/60 rounded-lg p-3">
                              {item.reasoning.map((step, i) => (
                                <div key={i} className="flex gap-2">
                                  <span className="text-ink-faint shrink-0">{i + 1}.</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Review info */}
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
                            <div>
                              <span className="text-ink-tertiary">Reviewer: </span>
                              <span className="text-ink-secondary">{item.reviewer}</span>
                            </div>
                            {item.outcome && (
                              <div>
                                <span className="text-ink-tertiary">After human review: </span>
                                {outcomeBadge(item.outcome)}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ━━━ SECTION 6: Model Performance Over Time ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Model Performance Over Time</h2>
        </div>
        <p className="text-[11px] text-ink-tertiary mb-4 ml-6">
          6-month trend: accuracy up, false positives down, test coverage expanding
        </p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perfData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              />
              <YAxis
                yAxisId="pct"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                domain={[0, 1000]}
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickFormatter={(v: number) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20,22,28,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E2E8F0',
                }}
              />
              <ReferenceLine yAxisId="pct" y={95} stroke="#F59E0B" strokeDasharray="6 3" />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 3, fill: '#22C55E', stroke: '#1a1c24', strokeWidth: 2 }}
              />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="falsePositive"
                name="False Positive Rate"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 3, fill: '#EF4444', stroke: '#1a1c24', strokeWidth: 2 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="tests"
                name="Tests/Day"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 3, fill: '#3B82F6', stroke: '#1a1c24', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#22C55E]" />
            <span className="text-[10px] text-ink-tertiary">Accuracy %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#EF4444]" />
            <span className="text-[10px] text-ink-tertiary">False Positive Rate %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#3B82F6] opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3B82F6 0px, #3B82F6 4px, transparent 4px, transparent 7px)' }} />
            <span className="text-[10px] text-ink-tertiary">Tests/Day (right axis)</span>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SECTION 7: Testing Configuration ━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.48 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Testing Configuration</h2>
        </div>

        {/* Threshold tiers */}
        <div className="mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-3">
            Confidence Thresholds by Category
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {thresholdConfig.map((t) => (
              <div
                key={t.category}
                className="rounded-lg border border-border/50 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: t.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-ink">{t.category}</span>
                  <span
                    className="text-[18px] font-bold tabular-nums"
                    style={{ color: t.color }}
                  >
                    {t.threshold}%
                  </span>
                </div>
                <div className="space-y-0.5">
                  {t.workflows.map((w) => (
                    <p key={w} className="text-[11px] text-ink-secondary">{w}</p>
                  ))}
                </div>
                {t.note && (
                  <p className="text-[10px] text-ink-faint mt-2 italic">{t.note}</p>
                )}
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      t.status === 'FRA Certified'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : t.status === 'Certified'
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {t.status === 'In Review' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General config */}
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-3">
          General Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Test Frequency', value: 'Continuous', note: 'Every AI output tested', icon: Activity },
            { label: 'Drift Alert', value: '>3% in 7 days', note: 'Trigger when accuracy drops', icon: AlertTriangle },
            { label: 'FRA Compliance', value: 'Enabled', note: 'Safety-critical: 95%+ required', icon: ShieldCheck },
            { label: 'Human Review SLA', value: 'Critical < 2h', note: 'Standard < 24 hours', icon: Clock },
            { label: 'Target Score', value: '95%', note: `Current: ${rel.accuracy}% (${rel.trend})`, icon: Target },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="p-3 rounded-lg bg-surface/60 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-ink-tertiary" strokeWidth={1.7} />
                  <span className="text-[11px] font-medium text-ink-tertiary">{c.label}</span>
                </div>
                <p className="text-[14px] font-semibold text-ink">{c.value}</p>
                <p className="text-[10px] text-ink-faint mt-0.5">{c.note}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom spacer for scroll */}
      <div className="h-4" />
    </div>
  );
}
