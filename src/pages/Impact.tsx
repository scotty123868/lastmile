import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';

import { COMMAND_CENTER_URL } from '../data/crosslinks';

/* ── Types ───────────────────────────────────────────────── */

interface ImpactCategory {
  label: string;
  amount: number;
  description: string;
  icon: 'shield' | 'zap' | 'users' | 'cost';
  type: 'saving' | 'cost';
}

interface WaterfallBar {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
}

interface KeyMetric {
  label: string;
  value: string;
  subtext?: string;
}

interface CompanyImpactData {
  totalAnnualImpact: number;
  categories: ImpactCategory[];
  waterfall: WaterfallBar[];
  metrics: KeyMetric[];
}

/* ── Adoption types ──────────────────────────────────────── */

interface TeamRow {
  name: string;
  active: number;
  total: number;
  adoption: number;
  trend: string;
  trendDir: 'up' | 'down' | 'flat';
  status: 'strong' | 'growing' | 'at-risk' | 'stalled';
}

interface CycleMetric {
  label: string;
  before: string;
  after: string;
  improvement: string;
}

interface CompanyAdoptionData {
  overallRate: number;
  overallTrend: string;
  overallTrendDir: 'up' | 'down' | 'flat';
  teamLabel: string;
  teams: TeamRow[];
  cycles: CycleMetric[];
}

/* ── Company-specific data ───────────────────────────────── */

const impactData: Record<string, CompanyImpactData> = {
  meridian: {
    totalAnnualImpact: 3600000,
    categories: [
      { label: 'AI Enhancement on Champion Systems', amount: 1080000, description: 'Procore, HCSS Telematics, and iCIMS AI-ready integrations — RailSentry object detection, HCSS Safety automation', icon: 'shield', type: 'saving' },
      { label: 'Predictive Analytics (P6 + Heavy Job + Equipment360)', amount: 1680000, description: 'Schedule optimization via P6, field cost tracking via Heavy Job, fleet predictive maintenance via Equipment360', icon: 'zap', type: 'saving' },
      { label: 'RailSentry/HSI AI Expansion', amount: 1140000, description: 'RailSentry at ~97% accuracy, Tie Inspection AI pilot, HSI Ultrasonic B-scan at ~80% — 3 AI models scaling', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -300000, description: 'Platform license, eCMS/QMirror API bridge, MLOps pipeline, and division-wide training rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1080000, type: 'positive' },
      { label: 'Automation', value: 1680000, type: 'positive' },
      { label: 'Adoption', value: 1140000, type: 'positive' },
      { label: 'Costs', value: -300000, type: 'negative' },
      { label: 'Net Impact', value: 3600000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '165%' },
      { label: 'Verified Accuracy', value: '94.2%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 6.8 hrs' },
    ],
  },
  hcc: {
    totalAnnualImpact: 1200000,
    categories: [
      { label: 'Verification Catches', amount: 380000, description: 'Track geometry defect identification, grade crossing compliance, and subcontractor safety verification', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 560000, description: 'Equipment dispatch automation, project estimation AI, and material logistics optimization', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 380000, description: 'Field crew productivity gains from mobile-first GPS tracking and project management tools', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -120000, description: 'Platform license, heavy equipment telematics integration, and crew training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 380000, type: 'positive' },
      { label: 'Automation', value: 560000, type: 'positive' },
      { label: 'Adoption', value: 380000, type: 'positive' },
      { label: 'Costs', value: -120000, type: 'negative' },
      { label: 'Net Impact', value: 1200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.0 mo' },
      { label: 'Year 1 ROI', value: '168%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '1.2 hrs', subtext: 'down from 5.8 hrs' },
    ],
  },
  hrsi: {
    totalAnnualImpact: 480000,
    categories: [
      { label: 'Verification Catches', amount: 150000, description: 'Railcar repair quality verification, track renewal specification compliance catches', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 210000, description: 'Class 1 railroad scheduling, ballast equipment dispatch, and repair cycle optimization', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 160000, description: 'Maintenance crew efficiency gains from predictive repair scheduling tools', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -40000, description: 'Platform license, fleet telematics integration, and operator training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 150000, type: 'positive' },
      { label: 'Automation', value: 210000, type: 'positive' },
      { label: 'Adoption', value: 160000, type: 'positive' },
      { label: 'Costs', value: -40000, type: 'negative' },
      { label: 'Net Impact', value: 480000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.4 mo' },
      { label: 'Year 1 ROI', value: '154%' },
      { label: 'Verified Accuracy', value: '93.1%' },
      { label: 'Exception Resolution', value: '1.6 hrs', subtext: 'down from 7.2 hrs' },
    ],
  },
  hsi: {
    totalAnnualImpact: 420000,
    categories: [
      { label: 'Verification Catches', amount: 140000, description: 'Ultrasonic rail flaw classification accuracy, FRA defect grading verification', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 180000, description: 'AI-enhanced defect analysis, automated FRA reporting, and route prioritization', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 130000, description: 'Rail testing operator efficiency gains from AI-assisted defect identification', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -30000, description: 'Platform license, ultrasonic equipment integration, and technician training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 140000, type: 'positive' },
      { label: 'Automation', value: 180000, type: 'positive' },
      { label: 'Adoption', value: 130000, type: 'positive' },
      { label: 'Costs', value: -30000, type: 'negative' },
      { label: 'Net Impact', value: 420000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.8 mo' },
      { label: 'Year 1 ROI', value: '172%' },
      { label: 'Verified Accuracy', value: '94.2%' },
      { label: 'Exception Resolution', value: '0.8 hrs', subtext: 'down from 4.2 hrs' },
    ],
  },
  hti: {
    totalAnnualImpact: 520000,
    categories: [
      { label: 'Verification Catches', amount: 160000, description: 'PTC configuration validation, signal design compliance checks, and wayside device verification', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 230000, description: 'PTC deployment scheduling, signal territory design automation, and GIS data management', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 170000, description: 'Signal engineer productivity gains from AI-assisted design review and territory mapping', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -40000, description: 'Platform license, PTC/signal system integration, and engineer training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 160000, type: 'positive' },
      { label: 'Automation', value: 230000, type: 'positive' },
      { label: 'Adoption', value: 170000, type: 'positive' },
      { label: 'Costs', value: -40000, type: 'negative' },
      { label: 'Net Impact', value: 520000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '160%' },
      { label: 'Verified Accuracy', value: '97.4%' },
      { label: 'Exception Resolution', value: '1.0 hrs', subtext: 'down from 5.0 hrs' },
    ],
  },
  htsi: {
    totalAnnualImpact: 560000,
    categories: [
      { label: 'Verification Catches', amount: 170000, description: 'Passenger safety compliance checks, maintenance interval verification, and schedule adherence validation', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 250000, description: 'Transit scheduling optimization, passenger load balancing, and rolling stock maintenance forecasting', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 190000, description: 'Transit operations team efficiency gains from AI-assisted dispatch and maintenance planning', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -50000, description: 'Platform license, transit management system integration, and operator training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 170000, type: 'positive' },
      { label: 'Automation', value: 250000, type: 'positive' },
      { label: 'Adoption', value: 190000, type: 'positive' },
      { label: 'Costs', value: -50000, type: 'negative' },
      { label: 'Net Impact', value: 560000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.6 mo' },
      { label: 'Year 1 ROI', value: '148%' },
      { label: 'Verified Accuracy', value: '91.8%' },
      { label: 'Exception Resolution', value: '1.8 hrs', subtext: 'down from 8.4 hrs' },
    ],
  },
  he: {
    totalAnnualImpact: 240000,
    categories: [
      { label: 'Verification Catches', amount: 60000, description: 'Grid interconnection compliance validation and renewable project permit accuracy', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 120000, description: 'Solar/wind project planning optimization and grid compliance documentation automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 80000, description: 'Energy project team productivity gains from automated compliance and planning tools', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -20000, description: 'Platform license, energy management system integration, and team training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 60000, type: 'positive' },
      { label: 'Automation', value: 120000, type: 'positive' },
      { label: 'Adoption', value: 80000, type: 'positive' },
      { label: 'Costs', value: -20000, type: 'negative' },
      { label: 'Net Impact', value: 240000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.6 mo' },
      { label: 'Year 1 ROI', value: '180%' },
      { label: 'Verified Accuracy', value: '95.6%' },
      { label: 'Exception Resolution', value: '0.6 hrs', subtext: 'down from 3.2 hrs' },
    ],
  },
  gg: {
    totalAnnualImpact: 180000,
    categories: [
      { label: 'Verification Catches', amount: 40000, description: 'Environmental permit compliance validation and waste classification accuracy catches', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 90000, description: 'Environmental compliance reporting automation and waste stream tracking optimization', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 60000, description: 'Environmental services team efficiency gains from automated monitoring and reporting', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -10000, description: 'Platform license, environmental monitoring integration, and staff training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 40000, type: 'positive' },
      { label: 'Automation', value: 90000, type: 'positive' },
      { label: 'Adoption', value: 60000, type: 'positive' },
      { label: 'Costs', value: -10000, type: 'negative' },
      { label: 'Net Impact', value: 180000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.4 mo' },
      { label: 'Year 1 ROI', value: '186%' },
      { label: 'Verified Accuracy', value: '98.1%' },
      { label: 'Exception Resolution', value: '0.4 hrs', subtext: 'down from 2.8 hrs' },
    ],
  },
  oakwood: {
    totalAnnualImpact: 3200000,
    categories: [
      { label: 'Claims Automation Savings', amount: 1120000, description: 'Automated claims adjudication, document processing, and payout workflows across property & casualty lines', icon: 'zap', type: 'saving' },
      { label: 'Underwriting Efficiency', amount: 960000, description: 'AI-assisted risk assessment, policy pricing optimization, and application processing acceleration', icon: 'users', type: 'saving' },
      { label: 'Fraud Prevention', amount: 840000, description: 'Pattern detection across claims data, cross-referencing databases, and suspicious activity flagging', icon: 'shield', type: 'saving' },
      { label: 'Policy Processing', amount: 580000, description: 'Automated policy issuance, renewal processing, and endorsement handling', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -300000, description: 'Platform license, core insurance system integration, and company-wide training rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Claims', value: 1120000, type: 'positive' },
      { label: 'Underwriting', value: 960000, type: 'positive' },
      { label: 'Fraud', value: 840000, type: 'positive' },
      { label: 'Policy', value: 580000, type: 'positive' },
      { label: 'Costs', value: -300000, type: 'negative' },
      { label: 'Net Impact', value: 3200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.8 mo' },
      { label: 'Year 1 ROI', value: '184%' },
      { label: 'Verified Accuracy', value: '96.1%' },
      { label: 'Exception Resolution', value: '1.2 hrs', subtext: 'down from 5.4 hrs' },
    ],
  },
  pinnacle: {
    totalAnnualImpact: 1800000,
    categories: [
      { label: 'Clinical Documentation', amount: 640000, description: 'AI-assisted physician notes, discharge summaries, and care plan documentation across departments', icon: 'users', type: 'saving' },
      { label: 'Billing Accuracy', amount: 520000, description: 'Automated coding validation, denial prevention, and claims scrubbing before submission', icon: 'shield', type: 'saving' },
      { label: 'Scheduling Optimization', amount: 440000, description: 'AI-driven patient scheduling, resource allocation, and capacity management', icon: 'zap', type: 'saving' },
      { label: 'Compliance Automation', amount: 360000, description: 'HIPAA compliance monitoring, audit preparation, and regulatory reporting automation', icon: 'shield', type: 'saving' },
      { label: 'Implementation Cost', amount: -160000, description: 'Platform license, EHR system integration, clinical workflow training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Documentation', value: 640000, type: 'positive' },
      { label: 'Billing', value: 520000, type: 'positive' },
      { label: 'Scheduling', value: 440000, type: 'positive' },
      { label: 'Compliance', value: 360000, type: 'positive' },
      { label: 'Costs', value: -160000, type: 'negative' },
      { label: 'Net Impact', value: 1800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.4 mo' },
      { label: 'Year 1 ROI', value: '152%' },
      { label: 'Verified Accuracy', value: '95.3%' },
      { label: 'Exception Resolution', value: '1.6 hrs', subtext: 'down from 6.2 hrs' },
    ],
  },
  atlas: {
    totalAnnualImpact: 4500000,
    categories: [
      { label: 'Production Optimization', amount: 1620000, description: 'AI-driven production scheduling, line efficiency improvements, and changeover reduction across OpCos', icon: 'zap', type: 'saving' },
      { label: 'Quality Control', amount: 1280000, description: 'Automated defect detection, SPC analysis, and supplier quality management', icon: 'shield', type: 'saving' },
      { label: 'Supply Chain Efficiency', amount: 1050000, description: 'Demand forecasting, inventory optimization, and supplier risk monitoring', icon: 'users', type: 'saving' },
      { label: 'Predictive Maintenance', amount: 950000, description: 'Equipment failure prediction, maintenance scheduling optimization, and downtime reduction', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -400000, description: 'Platform license, MES/ERP integration, multi-site training rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Production', value: 1620000, type: 'positive' },
      { label: 'Quality', value: 1280000, type: 'positive' },
      { label: 'Supply Chain', value: 1050000, type: 'positive' },
      { label: 'Maintenance', value: 950000, type: 'positive' },
      { label: 'Costs', value: -400000, type: 'negative' },
      { label: 'Net Impact', value: 4500000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.6 mo' },
      { label: 'Year 1 ROI', value: '178%' },
      { label: 'Verified Accuracy', value: '94.8%' },
      { label: 'Exception Resolution', value: '1.0 hrs', subtext: 'down from 4.8 hrs' },
    ],
  },
  northbridge: {
    totalAnnualImpact: 42000000,
    categories: [
      { label: 'Cross-Division Synergies', amount: 14200000, description: 'Shared services optimization, procurement consolidation, and best practice propagation across divisions', icon: 'users', type: 'saving' },
      { label: 'Compliance Automation', amount: 11800000, description: 'Multi-jurisdictional regulatory compliance, automated reporting, and audit trail management', icon: 'shield', type: 'saving' },
      { label: 'Strategic Analytics', amount: 10500000, description: 'AI-powered market intelligence, portfolio optimization, and M&A due diligence acceleration', icon: 'zap', type: 'saving' },
      { label: 'Operational Efficiency', amount: 9500000, description: 'Process automation across shared services, workforce optimization, and overhead reduction', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -4000000, description: 'Enterprise license, multi-division integration, executive training, and change management', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Synergies', value: 14200000, type: 'positive' },
      { label: 'Compliance', value: 11800000, type: 'positive' },
      { label: 'Analytics', value: 10500000, type: 'positive' },
      { label: 'Operations', value: 9500000, type: 'positive' },
      { label: 'Costs', value: -4000000, type: 'negative' },
      { label: 'Net Impact', value: 42000000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.8 mo' },
      { label: 'Year 1 ROI', value: '142%' },
      { label: 'Verified Accuracy', value: '92.4%' },
      { label: 'Exception Resolution', value: '2.2 hrs', subtext: 'down from 9.6 hrs' },
    ],
  },
  'nb-aerospace': {
    totalAnnualImpact: 10100000,
    categories: [
      { label: 'Certification Automation', amount: 4040000, description: 'FAA/EASA documentation automation, airworthiness directive tracking, and certification workflow acceleration', icon: 'shield', type: 'saving' },
      { label: 'Parts Traceability', amount: 3030000, description: 'AI-powered parts genealogy, counterfeit detection, and supply chain verification across aircraft programs', icon: 'shield', type: 'saving' },
      { label: 'MRO Optimization', amount: 4040000, description: 'Maintenance scheduling optimization, parts forecasting, and turnaround time reduction', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -1010000, description: 'Platform license, aviation systems integration, and specialized training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Certification', value: 4040000, type: 'positive' },
      { label: 'Traceability', value: 3030000, type: 'positive' },
      { label: 'MRO', value: 4040000, type: 'positive' },
      { label: 'Costs', value: -1010000, type: 'negative' },
      { label: 'Net Impact', value: 10100000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '158%' },
      { label: 'Verified Accuracy', value: '97.2%' },
      { label: 'Exception Resolution', value: '1.8 hrs', subtext: 'down from 8.4 hrs' },
    ],
  },
  'nb-energy': {
    totalAnnualImpact: 11800000,
    categories: [
      { label: 'Grid Optimization', amount: 4720000, description: 'AI-driven load balancing, demand response automation, and distribution network optimization', icon: 'zap', type: 'saving' },
      { label: 'Outage Prevention', amount: 3540000, description: 'Predictive failure analysis, vegetation management, and storm damage prevention', icon: 'shield', type: 'saving' },
      { label: 'Meter Efficiency', amount: 4720000, description: 'Smart meter analytics, billing accuracy improvement, and revenue protection', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -1180000, description: 'Platform license, SCADA/OMS integration, and utility workforce training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Grid', value: 4720000, type: 'positive' },
      { label: 'Outage', value: 3540000, type: 'positive' },
      { label: 'Metering', value: 4720000, type: 'positive' },
      { label: 'Costs', value: -1180000, type: 'negative' },
      { label: 'Net Impact', value: 11800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.6 mo' },
      { label: 'Year 1 ROI', value: '146%' },
      { label: 'Verified Accuracy', value: '93.6%' },
      { label: 'Exception Resolution', value: '2.0 hrs', subtext: 'down from 8.8 hrs' },
    ],
  },
  'nb-financial': {
    totalAnnualImpact: 7600000,
    categories: [
      { label: 'KYC/AML Automation', amount: 3040000, description: 'Customer identity verification, sanctions screening, and ongoing due diligence automation', icon: 'shield', type: 'saving' },
      { label: 'Fraud Prevention', amount: 2280000, description: 'Real-time transaction monitoring, pattern analysis, and suspicious activity reporting', icon: 'shield', type: 'saving' },
      { label: 'Regulatory Compliance', amount: 3040000, description: 'Automated regulatory reporting, policy enforcement, and exam preparation across jurisdictions', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -760000, description: 'Platform license, core banking integration, and compliance team training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'KYC/AML', value: 3040000, type: 'positive' },
      { label: 'Fraud', value: 2280000, type: 'positive' },
      { label: 'Regulatory', value: 3040000, type: 'positive' },
      { label: 'Costs', value: -760000, type: 'negative' },
      { label: 'Net Impact', value: 7600000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.6 mo' },
      { label: 'Year 1 ROI', value: '176%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 6.2 hrs' },
    ],
  },
  'nb-health': {
    totalAnnualImpact: 12500000,
    categories: [
      { label: 'Clinical Trials Acceleration', amount: 4500000, description: 'Patient recruitment optimization, protocol adherence monitoring, and data management automation', icon: 'users', type: 'saving' },
      { label: 'Drug Safety Monitoring', amount: 3500000, description: 'Adverse event detection, signal analysis, and pharmacovigilance reporting automation', icon: 'shield', type: 'saving' },
      { label: 'Manufacturing Quality', amount: 5750000, description: 'Batch release optimization, deviation management, and GMP compliance automation', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -1250000, description: 'Platform license, LIMS/MES integration, and GxP-validated training rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Trials', value: 4500000, type: 'positive' },
      { label: 'Drug Safety', value: 3500000, type: 'positive' },
      { label: 'Manufacturing', value: 5750000, type: 'positive' },
      { label: 'Costs', value: -1250000, type: 'negative' },
      { label: 'Net Impact', value: 12500000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '5.2 mo' },
      { label: 'Year 1 ROI', value: '132%' },
      { label: 'Verified Accuracy', value: '94.1%' },
      { label: 'Exception Resolution', value: '2.4 hrs', subtext: 'down from 10.2 hrs' },
    ],
  },
  estonia: {
    totalAnnualImpact: 18000000,
    categories: [
      { label: 'Citizen Services Efficiency', amount: 6200000, description: 'Digital service automation, e-governance portal optimization, and citizen request processing acceleration', icon: 'users', type: 'saving' },
      { label: 'Cross-Ministry Efficiency', amount: 5400000, description: 'X-Road data exchange optimization, inter-agency workflow automation, and shared services improvement', icon: 'zap', type: 'saving' },
      { label: 'Digital Governance', amount: 4800000, description: 'Policy simulation, regulatory impact analysis, and digital identity management enhancement', icon: 'shield', type: 'saving' },
      { label: 'Cybersecurity Enhancement', amount: 3200000, description: 'AI-powered threat detection, X-Road monitoring automation, and incident response optimization', icon: 'shield', type: 'saving' },
      { label: 'Implementation Cost', amount: -1600000, description: 'Platform license, X-Road integration, multi-ministry training, and security certification', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Citizen Svcs', value: 6200000, type: 'positive' },
      { label: 'Cross-Ministry', value: 5400000, type: 'positive' },
      { label: 'Governance', value: 4800000, type: 'positive' },
      { label: 'Cybersecurity', value: 3200000, type: 'positive' },
      { label: 'Costs', value: -1600000, type: 'negative' },
      { label: 'Net Impact', value: 18000000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.8 mo' },
      { label: 'Year 1 ROI', value: '172%' },
      { label: 'Verified Accuracy', value: '95.8%' },
      { label: 'Exception Resolution', value: '1.2 hrs', subtext: 'down from 5.6 hrs' },
    ],
  },
  'ee-finance': {
    totalAnnualImpact: 4200000,
    categories: [
      { label: 'Tax Processing Automation', amount: 1680000, description: 'Automated tax return validation, fraud detection, and refund processing across individual and corporate filings', icon: 'zap', type: 'saving' },
      { label: 'Audit Automation', amount: 1260000, description: 'AI-assisted audit selection, risk scoring, and compliance verification automation', icon: 'shield', type: 'saving' },
      { label: 'Revenue Forecasting', amount: 1560000, description: 'Machine learning revenue models, economic indicator analysis, and budget planning optimization', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -300000, description: 'Platform license, tax system integration, and ministry staff training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Tax Processing', value: 1680000, type: 'positive' },
      { label: 'Audit', value: 1260000, type: 'positive' },
      { label: 'Forecasting', value: 1560000, type: 'positive' },
      { label: 'Costs', value: -300000, type: 'negative' },
      { label: 'Net Impact', value: 4200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.4 mo' },
      { label: 'Year 1 ROI', value: '188%' },
      { label: 'Verified Accuracy', value: '97.2%' },
      { label: 'Exception Resolution', value: '0.8 hrs', subtext: 'down from 3.6 hrs' },
    ],
  },
  'ee-social': {
    totalAnnualImpact: 6100000,
    categories: [
      { label: 'Benefits Processing', amount: 2440000, description: 'Automated eligibility determination, benefits calculation, and payment processing across social programs', icon: 'zap', type: 'saving' },
      { label: 'Health Records Management', amount: 1830000, description: 'Patient record linkage, cross-system data integration, and health information exchange optimization', icon: 'shield', type: 'saving' },
      { label: 'Case Management Efficiency', amount: 2280000, description: 'AI-assisted case prioritization, outcome prediction, and social worker workflow optimization', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -450000, description: 'Platform license, health/social systems integration, and caseworker training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Benefits', value: 2440000, type: 'positive' },
      { label: 'Health Records', value: 1830000, type: 'positive' },
      { label: 'Case Mgmt', value: 2280000, type: 'positive' },
      { label: 'Costs', value: -450000, type: 'negative' },
      { label: 'Net Impact', value: 6100000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.6 mo' },
      { label: 'Year 1 ROI', value: '176%' },
      { label: 'Verified Accuracy', value: '94.6%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 6.0 hrs' },
    ],
  },
  'ee-economic': {
    totalAnnualImpact: 3800000,
    categories: [
      { label: 'Trade Facilitation', amount: 1520000, description: 'Automated customs processing, trade compliance verification, and export/import documentation streamlining', icon: 'zap', type: 'saving' },
      { label: 'e-Residency Processing', amount: 1140000, description: 'Application verification automation, identity validation, and onboarding workflow optimization', icon: 'users', type: 'saving' },
      { label: 'Business Registration', amount: 1380000, description: 'Company formation automation, compliance checking, and registry management optimization', icon: 'shield', type: 'saving' },
      { label: 'Implementation Cost', amount: -240000, description: 'Platform license, trade/registry system integration, and staff training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Trade', value: 1520000, type: 'positive' },
      { label: 'e-Residency', value: 1140000, type: 'positive' },
      { label: 'Registration', value: 1380000, type: 'positive' },
      { label: 'Costs', value: -240000, type: 'negative' },
      { label: 'Net Impact', value: 3800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.2 mo' },
      { label: 'Year 1 ROI', value: '196%' },
      { label: 'Verified Accuracy', value: '96.4%' },
      { label: 'Exception Resolution', value: '0.6 hrs', subtext: 'down from 3.2 hrs' },
    ],
  },
  'ee-ria': {
    totalAnnualImpact: 2100000,
    categories: [
      { label: 'Threat Detection', amount: 840000, description: 'AI-powered cyber threat identification, attack pattern recognition, and early warning system automation', icon: 'shield', type: 'saving' },
      { label: 'X-Road Monitoring', amount: 630000, description: 'Automated X-Road traffic analysis, anomaly detection, and service health monitoring across government infrastructure', icon: 'shield', type: 'saving' },
      { label: 'Incident Response', amount: 780000, description: 'Automated incident triage, playbook execution, and cross-agency coordination acceleration', icon: 'zap', type: 'saving' },
      { label: 'Implementation Cost', amount: -150000, description: 'Platform license, security infrastructure integration, and analyst training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Threat Detection', value: 840000, type: 'positive' },
      { label: 'X-Road', value: 630000, type: 'positive' },
      { label: 'Incident Resp.', value: 780000, type: 'positive' },
      { label: 'Costs', value: -150000, type: 'negative' },
      { label: 'Net Impact', value: 2100000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.0 mo' },
      { label: 'Year 1 ROI', value: '210%' },
      { label: 'Verified Accuracy', value: '98.4%' },
      { label: 'Exception Resolution', value: '0.4 hrs', subtext: 'down from 2.2 hrs' },
    ],
  },
};

/* ── Adoption data ───────────────────────────────────────── */

const adoptionData: Record<string, CompanyAdoptionData> = {
  meridian: {
    overallRate: 67, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Division / Team',
    teams: [
      { name: 'Track Maintenance Crews (HCC)', active: 320, total: 420, adoption: 76, trend: '\u2191 9%', trendDir: 'up', status: 'strong' },
      { name: 'Signal & Communications (HTI)', active: 180, total: 240, adoption: 75, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Fleet Operations (HRSI)', active: 260, total: 380, adoption: 68, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'Rail Testing Division (HSI)', active: 140, total: 200, adoption: 70, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Transit Operations (HTSI)', active: 110, total: 220, adoption: 50, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Project Engineering', active: 82, total: 160, adoption: 51, trend: '\u2193 2%', trendDir: 'down', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Track geometry analysis report', before: '6.8 hrs', after: '1.4 hrs', improvement: '79%' },
      { label: 'Crew dispatch cycle', before: '3.2 hrs', after: '0.6 hrs', improvement: '81%' },
      { label: 'Equipment utilization report', before: '2 weeks', after: '45 min', improvement: '97%' },
      { label: 'FRA compliance documentation', before: '8.0 hrs', after: '2.4 hrs', improvement: '70%' },
    ],
  },
  hcc: {
    overallRate: 74, overallTrend: '+8% vs last month', overallTrendDir: 'up', teamLabel: 'Division / Crew',
    teams: [
      { name: 'Track Construction Crews', active: 280, total: 360, adoption: 78, trend: '\u2191 10%', trendDir: 'up', status: 'strong' },
      { name: 'Highway & Bridge Ops', active: 220, total: 300, adoption: 73, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'Heavy Equipment Fleet', active: 140, total: 200, adoption: 70, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
      { name: 'Project Estimating', active: 48, total: 60, adoption: 80, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Subcontractor Management', active: 32, total: 60, adoption: 53, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
      { name: 'Safety & Compliance', active: 40, total: 50, adoption: 80, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
    ],
    cycles: [
      { label: 'Project cost estimate', before: '4.5 hrs', after: '1.2 hrs', improvement: '73%' },
      { label: 'Equipment dispatch cycle', before: '2.8 hrs', after: '0.5 hrs', improvement: '82%' },
      { label: 'Subcontractor compliance check', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'Grade inspection report', before: '1.5 hrs', after: '18 min', improvement: '80%' },
    ],
  },
  hrsi: {
    overallRate: 66, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Operations Team',
    teams: [
      { name: 'Ballast Train Operators', active: 110, total: 150, adoption: 73, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'Track Renewal Crews', active: 80, total: 120, adoption: 67, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
      { name: 'Railroad Equipment Leasing', active: 28, total: 40, adoption: 70, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Railcar Repair Shop', active: 34, total: 70, adoption: 49, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Ballast train scheduling', before: '3.2 hrs', after: '0.6 hrs', improvement: '81%' },
      { label: 'Railcar repair estimation', before: '2.5 hrs', after: '0.8 hrs', improvement: '68%' },
      { label: 'Equipment utilization report', before: '1.5 days', after: '35 min', improvement: '96%' },
      { label: 'Class 1 work order processing', before: '4 hrs', after: '1.1 hrs', improvement: '73%' },
    ],
  },
  hsi: {
    overallRate: 73, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Testing Team',
    teams: [
      { name: 'Ultrasonic Testing Operators', active: 82, total: 100, adoption: 82, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'FRA Compliance Analysts', active: 36, total: 45, adoption: 80, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Route Scheduling', active: 24, total: 35, adoption: 69, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
      { name: 'Data Analysis & Reporting', active: 18, total: 40, adoption: 45, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Defect classification report', before: '45 min', after: '8 min', improvement: '82%' },
      { label: 'FRA compliance filing', before: '6 hrs', after: '1.4 hrs', improvement: '77%' },
      { label: 'Route prioritization analysis', before: '2 days', after: '3 hrs', improvement: '94%' },
      { label: 'Rail flaw trend analysis', before: '4 hrs', after: '45 min', improvement: '81%' },
    ],
  },
  hti: {
    overallRate: 74, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Engineering Team',
    teams: [
      { name: 'PTC Installation Crews', active: 88, total: 120, adoption: 73, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'Signal Design Engineers', active: 52, total: 60, adoption: 87, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'GIS & Mapping Division', active: 40, total: 50, adoption: 80, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Communications Systems', active: 32, total: 48, adoption: 67, trend: '\u2191 9%', trendDir: 'up', status: 'growing' },
      { name: 'Field Testing & Commissioning', active: 18, total: 32, adoption: 56, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Signal design review', before: '5 days', after: '1.2 days', improvement: '76%' },
      { label: 'PTC territory deployment plan', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'GIS data update cycle', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
      { label: 'Wayside device commissioning report', before: '3 hrs', after: '40 min', improvement: '78%' },
    ],
  },
  htsi: {
    overallRate: 60, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Transit Division',
    teams: [
      { name: 'Train Dispatchers', active: 68, total: 90, adoption: 76, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'Station Operations', active: 80, total: 120, adoption: 67, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Rolling Stock Maintenance', active: 52, total: 100, adoption: 52, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Passenger Services', active: 44, total: 80, adoption: 55, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
      { name: 'Schedule Planning', active: 22, total: 30, adoption: 73, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
      { name: 'Safety & Training', active: 20, total: 60, adoption: 33, trend: '\u2193 2%', trendDir: 'down', status: 'stalled' },
    ],
    cycles: [
      { label: 'Schedule optimization cycle', before: '3 days', after: '6 hrs', improvement: '92%' },
      { label: 'Passenger load forecast', before: '4 hrs', after: '45 min', improvement: '81%' },
      { label: 'Maintenance work order', before: '2.5 hrs', after: '35 min', improvement: '77%' },
      { label: 'Service disruption response', before: '45 min', after: '12 min', improvement: '73%' },
    ],
  },
  he: {
    overallRate: 68, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Energy Team',
    teams: [
      { name: 'Solar Project Engineering', active: 28, total: 35, adoption: 80, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Wind Operations', active: 22, total: 30, adoption: 73, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
      { name: 'Grid Interconnection', active: 18, total: 25, adoption: 72, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'Construction Management', active: 14, total: 30, adoption: 47, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Project feasibility analysis', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'Grid compliance filing', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Energy production forecast', before: '6 hrs', after: '1.2 hrs', improvement: '80%' },
      { label: 'Permit application prep', before: '3 days', after: '6 hrs', improvement: '92%' },
    ],
  },
  gg: {
    overallRate: 58, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Services Team',
    teams: [
      { name: 'Environmental Compliance', active: 22, total: 30, adoption: 73, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'Remediation Field Crews', active: 18, total: 35, adoption: 51, trend: '\u2191 4%', trendDir: 'up', status: 'at-risk' },
      { name: 'Waste Stream Management', active: 12, total: 25, adoption: 48, trend: '\u2191 5%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Environmental compliance report', before: '2 days', after: '4 hrs', improvement: '92%' },
      { label: 'Waste classification audit', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
      { label: 'Remediation site assessment', before: '3 days', after: '8 hrs', improvement: '89%' },
      { label: 'EPA reporting cycle', before: '5 days', after: '1 day', improvement: '80%' },
    ],
  },
  oakwood: {
    overallRate: 78, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Claims Processing', active: 210, total: 260, adoption: 81, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Underwriting', active: 145, total: 180, adoption: 81, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Customer Service', active: 130, total: 180, adoption: 72, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Policy Administration', active: 108, total: 140, adoption: 77, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Actuarial', active: 22, total: 40, adoption: 55, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Claims adjudication cycle', before: '4.5 days', after: '1.2 days', improvement: '73%' },
      { label: 'Underwriting risk assessment', before: '6 hrs', after: '1.4 hrs', improvement: '77%' },
      { label: 'Fraud detection review', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'Policy issuance processing', before: '2 days', after: '3 hrs', improvement: '94%' },
    ],
  },
  pinnacle: {
    overallRate: 69, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Clinical Staff', active: 105, total: 150, adoption: 70, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Administrative', active: 72, total: 100, adoption: 72, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Billing & Revenue Cycle', active: 58, total: 80, adoption: 73, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'Compliance & Quality', active: 38, total: 50, adoption: 76, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'IT & Informatics', active: 18, total: 40, adoption: 45, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Clinical documentation cycle', before: '45 min/patient', after: '12 min/patient', improvement: '73%' },
      { label: 'Claims billing accuracy review', before: '3 days', after: '6 hrs', improvement: '92%' },
      { label: 'Patient scheduling optimization', before: '2 hrs', after: '25 min', improvement: '79%' },
      { label: 'Compliance audit prep', before: '2 weeks', after: '3 days', improvement: '79%' },
    ],
  },
  atlas: {
    overallRate: 72, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'OpCo / Division',
    teams: [
      { name: 'Production Operations', active: 520, total: 680, adoption: 76, trend: '\u2191 7%', trendDir: 'up', status: 'strong' },
      { name: 'Quality Control', active: 340, total: 450, adoption: 76, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Supply Chain & Logistics', active: 280, total: 420, adoption: 67, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Maintenance & Reliability', active: 240, total: 350, adoption: 69, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'R&D / Engineering', active: 80, total: 200, adoption: 40, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Production line changeover', before: '4.5 hrs', after: '1.2 hrs', improvement: '73%' },
      { label: 'Quality inspection report', before: '2 hrs', after: '25 min', improvement: '79%' },
      { label: 'Supply chain disruption response', before: '3 days', after: '6 hrs', improvement: '92%' },
      { label: 'Predictive maintenance alert', before: '2 weeks', after: '2 days', improvement: '86%' },
    ],
  },
  northbridge: {
    overallRate: 58, overallTrend: '+3% vs last month', overallTrendDir: 'up', teamLabel: 'Division',
    teams: [
      { name: 'NB Financial Services', active: 4200, total: 6200, adoption: 68, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'NB Aerospace', active: 5100, total: 8200, adoption: 62, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'NB Energy', active: 6300, total: 11500, adoption: 55, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'NB Health Sciences', active: 8400, total: 16100, adoption: 52, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Cross-division compliance report', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Strategic analytics briefing', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Synergy identification cycle', before: '2 months', after: '2 weeks', improvement: '75%' },
      { label: 'Board-level operational review', before: '10 days', after: '2 days', improvement: '80%' },
    ],
  },
  'nb-aerospace': {
    overallRate: 62, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Certification & Compliance', active: 1800, total: 2400, adoption: 75, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Parts Traceability', active: 1500, total: 2200, adoption: 68, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'MRO Operations', active: 1400, total: 2300, adoption: 61, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Engineering & Design', active: 420, total: 1300, adoption: 32, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'FAA certification document prep', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'Parts traceability audit', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'MRO work order cycle', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
      { label: 'Engineering change order review', before: '3 days', after: '6 hrs', improvement: '92%' },
    ],
  },
  'nb-energy': {
    overallRate: 58, overallTrend: '+3% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Grid Operations', active: 2800, total: 4200, adoption: 67, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Outage Prevention & Response', active: 1900, total: 3000, adoption: 63, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Metering & Billing', active: 1400, total: 2500, adoption: 56, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Field Services', active: 580, total: 1800, adoption: 32, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Grid optimization cycle', before: '6 hrs', after: '1.2 hrs', improvement: '80%' },
      { label: 'Outage prediction analysis', before: '2 days', after: '4 hrs', improvement: '92%' },
      { label: 'Meter reading reconciliation', before: '5 days', after: '1 day', improvement: '80%' },
      { label: 'Regulatory compliance filing', before: '3 weeks', after: '4 days', improvement: '81%' },
    ],
  },
  'nb-financial': {
    overallRate: 68, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'KYC/AML Operations', active: 1600, total: 2100, adoption: 76, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Fraud Prevention', active: 1200, total: 1700, adoption: 71, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Regulatory Compliance', active: 900, total: 1200, adoption: 75, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Client Advisory', active: 520, total: 1200, adoption: 43, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'KYC verification cycle', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'Fraud case investigation', before: '5 days', after: '1 day', improvement: '80%' },
      { label: 'Regulatory report generation', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'AML alert triage', before: '4 hrs', after: '45 min', improvement: '81%' },
    ],
  },
  'nb-health': {
    overallRate: 52, overallTrend: '+3% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Clinical Trials Management', active: 3200, total: 5200, adoption: 62, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Drug Safety & Pharmacovigilance', active: 2600, total: 4200, adoption: 62, trend: '\u2191 3%', trendDir: 'up', status: 'growing' },
      { name: 'Manufacturing Quality', active: 1800, total: 3800, adoption: 47, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
      { name: 'R&D / Discovery', active: 760, total: 2900, adoption: 26, trend: '\u2191 1%', trendDir: 'up', status: 'stalled' },
    ],
    cycles: [
      { label: 'Clinical trial data review', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'Adverse event report processing', before: '4 days', after: '8 hrs', improvement: '92%' },
      { label: 'Batch quality release', before: '5 days', after: '1.5 days', improvement: '70%' },
      { label: 'Regulatory submission prep', before: '3 months', after: '3 weeks', improvement: '77%' },
    ],
  },
  estonia: {
    overallRate: 71, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Ministry / Agency',
    teams: [
      { name: 'Finance Ministry', active: 3150, total: 4200, adoption: 75, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Social Affairs Ministry', active: 5400, total: 8400, adoption: 64, trend: '\u2191 3%', trendDir: 'up', status: 'growing' },
      { name: 'Economic Affairs Ministry', active: 3800, total: 5200, adoption: 73, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'RIA (Cybersecurity)', active: 394, total: 480, adoption: 82, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Other Agencies', active: 7400, total: 10220, adoption: 72, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Citizen service request processing', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Cross-ministry data sharing', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Digital governance audit', before: '2 months', after: '2 weeks', improvement: '75%' },
      { label: 'Policy impact analysis', before: '10 days', after: '2 days', improvement: '80%' },
    ],
  },
  'ee-finance': {
    overallRate: 72, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Division',
    teams: [
      { name: 'Tax Processing', active: 1200, total: 1500, adoption: 80, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Audit & Compliance', active: 860, total: 1100, adoption: 78, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Revenue Forecasting', active: 520, total: 700, adoption: 74, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Budget Administration', active: 440, total: 900, adoption: 49, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Tax return processing cycle', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'Compliance audit cycle', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'Revenue forecast generation', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Budget reconciliation', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
    ],
  },
  'ee-social': {
    overallRate: 64, overallTrend: '+3% vs last month', overallTrendDir: 'up', teamLabel: 'Division',
    teams: [
      { name: 'Benefits Processing', active: 2400, total: 3400, adoption: 71, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Health Records Management', active: 1800, total: 2600, adoption: 69, trend: '\u2191 3%', trendDir: 'up', status: 'growing' },
      { name: 'Case Management', active: 1100, total: 1600, adoption: 69, trend: '\u2191 4%', trendDir: 'up', status: 'growing' },
      { name: 'Field Social Workers', active: 280, total: 800, adoption: 35, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Benefits application processing', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Health record linkage', before: '2 days', after: '4 hrs', improvement: '92%' },
      { label: 'Case review cycle', before: '3 days', after: '6 hrs', improvement: '92%' },
      { label: 'Social services report generation', before: '1 week', after: '1.5 days', improvement: '79%' },
    ],
  },
  'ee-economic': {
    overallRate: 73, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Division',
    teams: [
      { name: 'Trade Facilitation', active: 1400, total: 1800, adoption: 78, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'e-Residency Program', active: 960, total: 1200, adoption: 80, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Business Registration', active: 1000, total: 1400, adoption: 71, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Economic Policy & Research', active: 340, total: 800, adoption: 43, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Trade permit processing', before: '4 days', after: '6 hrs', improvement: '94%' },
      { label: 'e-Residency application review', before: '2 weeks', after: '3 days', improvement: '79%' },
      { label: 'Business registration cycle', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'Economic impact assessment', before: '1 month', after: '1 week', improvement: '75%' },
    ],
  },
  'ee-ria': {
    overallRate: 82, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Team',
    teams: [
      { name: 'Threat Detection & Analysis', active: 148, total: 165, adoption: 90, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'X-Road Monitoring', active: 112, total: 130, adoption: 86, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Incident Response', active: 96, total: 110, adoption: 87, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Policy & Governance', active: 36, total: 75, adoption: 48, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Threat detection triage', before: '35 min', after: '6 min', improvement: '83%' },
      { label: 'X-Road anomaly investigation', before: '4 hrs', after: '45 min', improvement: '81%' },
      { label: 'Incident response coordination', before: '2 hrs', after: '25 min', improvement: '79%' },
      { label: 'Security audit report', before: '3 days', after: '6 hrs', improvement: '92%' },
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

const categoryIcons = {
  shield: ShieldCheck,
  zap: Zap,
  users: Users,
  cost: DollarSign,
};

function MetricIcon({ label }: { label: string }) {
  if (label.includes('Payback')) return <Clock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  if (label.includes('ROI')) return <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  if (label.includes('Accuracy')) return <Target className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  return <CheckCircle2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
}

const adoptionStatusConfig = {
  strong: { label: 'Strong', color: 'text-green', bg: 'bg-green-muted' },
  growing: { label: 'Growing', color: 'text-blue', bg: 'bg-blue-muted' },
  'at-risk': { label: 'At Risk', color: 'text-amber', bg: 'bg-amber-muted' },
  stalled: { label: 'Stalled', color: 'text-red', bg: 'bg-red-muted' },
};

function TrendIcon({ dir }: { dir: 'up' | 'down' | 'flat' }) {
  if (dir === 'up') return <ArrowUpRight className="w-3 h-3 text-green" strokeWidth={2} />;
  if (dir === 'down') return <ArrowDownRight className="w-3 h-3 text-red" strokeWidth={2} />;
  return <Minus className="w-3 h-3 text-ink-faint" strokeWidth={2} />;
}

/* ── Collapsible Section ─────────────────────────────────── */

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }: { title: string; icon: React.ElementType; defaultOpen?: boolean; children: React.ReactNode }) {
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

/* ── Main ────────────────────────────────────────────────── */

export default function Impact() {
  const { company } = useCompany();
  const data = impactData[company.id] || impactData.meridian;
  const adoption = adoptionData[company.id] || adoptionData.meridian;

  const grossSavings = data.categories.filter((c) => c.type === 'saving').reduce((s, c) => s + c.amount, 0);

  const strongCount = adoption.teams.filter((t) => t.status === 'strong').length;
  const atRiskCount = adoption.teams.filter((t) => t.status === 'at-risk' || t.status === 'stalled').length;
  const totalUsers = adoption.teams.reduce((s, t) => s + t.active, 0);
  const totalHeadcount = adoption.teams.reduce((s, t) => s + t.total, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Impact</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Realized value and ROI — {company.employees.toLocaleString()} employees, {company.opCos} division{company.opCos === 1 ? '' : 's'}</p>
      </div>

      {/* Hero number */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 px-6 py-6 rounded-xl bg-surface-raised border border-border text-center"
      >
        <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Total Annual Impact</div>
        <div className="text-[42px] font-semibold text-ink tabular-nums tracking-tight leading-none">
          {formatDollars(data.totalAnnualImpact, company.currency)}
        </div>
        <div className="text-[13px] text-ink-tertiary mt-2">net projected savings per year</div>
      </motion.div>

      {/* Category breakdown */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Impact Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.categories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon];
            const isCost = cat.type === 'cost';
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isCost ? 'bg-red-muted' : 'bg-green-muted'}`}>
                    <Icon className={`w-4 h-4 ${isCost ? 'text-red' : 'text-green'}`} strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">{cat.label}</span>
                      <span className={`text-[16px] font-semibold tabular-nums tracking-tight ${isCost ? 'text-red' : 'text-green'}`}>
                        {isCost ? '-' : '+'}{formatDollars(cat.amount, company.currency)}
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-tertiary mt-1 leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Savings waterfall */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Savings Waterfall</h2>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl p-5">
          <div className="space-y-3">
            {data.waterfall.map((bar, i) => {
              const barWidth = Math.abs(bar.value) / grossSavings * 100;
              let barColor = 'bg-green';
              if (bar.type === 'negative') barColor = 'bg-red';
              if (bar.type === 'total') barColor = 'bg-blue';

              return (
                <motion.div
                  key={bar.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-ink">{bar.label}</span>
                    <span className={`text-[12px] font-semibold tabular-nums ${
                      bar.type === 'negative' ? 'text-red' : bar.type === 'total' ? 'text-blue' : 'text-green'
                    }`}>
                      {bar.value < 0 ? '-' : ''}{formatDollars(bar.value, company.currency)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Key Metrics</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <MetricIcon label={metric.label} />
              </div>
              <div className="text-[20px] font-semibold text-ink tabular-nums tracking-tight">{metric.value}</div>
              <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider mt-1">{metric.label}</div>
              {metric.subtext && (
                <div className="text-[10px] text-ink-faint mt-0.5">{metric.subtext}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Adoption Section (collapsible) ─────────────────── */}
      <CollapsibleSection title="Adoption" icon={Users} defaultOpen={true}>
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
            <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Overall Adoption</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[28px] font-semibold text-ink tabular-nums tracking-tight">{adoption.overallRate}%</span>
              <span className="flex items-center gap-0.5">
                <TrendIcon dir={adoption.overallTrendDir} />
                <span className="text-[11px] text-ink-tertiary">{adoption.overallTrend}</span>
              </span>
            </div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
            <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Active Users</div>
            <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">
              {totalUsers}<span className="text-[14px] text-ink-tertiary font-normal"> / {totalHeadcount}</span>
            </div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
            <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Strong Teams</div>
            <div className="text-[24px] font-semibold text-green tabular-nums tracking-tight mt-0.5">{strongCount}</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-surface-raised border border-border">
            <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">At Risk</div>
            <div className="text-[24px] font-semibold tabular-nums tracking-tight mt-0.5" style={{ color: atRiskCount > 0 ? '#DC2626' : undefined }}>{atRiskCount}</div>
          </div>
        </div>

        {/* Department adoption table */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <span className="text-[13px] font-semibold text-ink">Adoption by {adoption.teamLabel}</span>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px_80px] gap-3 px-5 py-2.5 border-b border-border-subtle">
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">{adoption.teamLabel}</span>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Users</span>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Adoption</span>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Trend</span>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Status</span>
            </div>
            {adoption.teams.map((team, i) => {
              const sc = adoptionStatusConfig[team.status];
              return (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_80px_80px] gap-1 sm:gap-3 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-surface-sunken/40 transition-colors items-center"
                >
                  <div><span className="text-[13px] font-medium text-ink">{team.name}</span></div>
                  <div className="text-right"><span className="text-[12px] tabular-nums text-ink-secondary">{team.active} / {team.total}</span></div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-surface-sunken overflow-hidden hidden sm:block">
                        <div className={`h-full rounded-full ${team.adoption >= 70 ? 'bg-green' : team.adoption >= 50 ? 'bg-blue' : 'bg-amber'}`} style={{ width: `${team.adoption}%` }} />
                      </div>
                      <span className="text-[12px] tabular-nums font-medium text-ink">{team.adoption}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1">
                      <TrendIcon dir={team.trendDir} />
                      <span className="text-[11px] tabular-nums text-ink-tertiary">{team.trend}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc.color} ${sc.bg}`}>{sc.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Cycle time improvements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <span className="text-[13px] font-semibold text-ink">Cycle Time Improvements</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adoption.cycles.map((cycle, i) => (
              <motion.div
                key={cycle.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-3.5"
              >
                <div className="text-[12px] text-ink-secondary mb-2">{cycle.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] tabular-nums text-ink-tertiary line-through">{cycle.before}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-green" strokeWidth={2} />
                  <span className="text-[14px] tabular-nums text-green font-semibold">{cycle.after}</span>
                  <span className="ml-auto text-[11px] font-semibold text-green bg-green-muted px-1.5 py-0.5 rounded tabular-nums">-{cycle.improvement}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Cross-link to Command Center ROI ──────────────────── */}
      <a
        href={`${COMMAND_CENTER_URL}/roi-summary?company=${company.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 transition-colors"
      >
        View ROI breakdown
        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
      </a>
    </div>
  );
}
