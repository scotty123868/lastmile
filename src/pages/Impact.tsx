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
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

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
    totalAnnualImpact: 2800000,
    categories: [
      { label: 'Verification Catches', amount: 920000, description: 'Prevented billing errors, compliance misses, and duplicate vendor entries', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1440000, description: 'Field reports, invoice reconciliation, and equipment tracking automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 680000, description: 'Cycle time reductions from higher tool adoption across field teams', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -240000, description: 'Platform license, integration setup, and training program investment', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 920000, type: 'positive' },
      { label: 'Automation', value: 1440000, type: 'positive' },
      { label: 'Adoption', value: 680000, type: 'positive' },
      { label: 'Costs', value: -240000, type: 'negative' },
      { label: 'Net Impact', value: 2800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '165%' },
      { label: 'Verified Accuracy', value: '97.4%' },
      { label: 'Exception Resolution', value: '1.8 hrs', subtext: 'down from 6.2 hrs' },
    ],
  },
  oakwood: {
    totalAnnualImpact: 4200000,
    categories: [
      { label: 'Verification Catches', amount: 1840000, description: 'Fraud flags, rate cap compliance, and claims accuracy corrections', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1920000, description: 'Claims intake, policy migration, and renewal assessments automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 840000, description: 'Faster claims cycle from adjuster teams adopting AI-assisted workflows', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -400000, description: 'Platform license, AS/400 integration, legacy migration tooling', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1840000, type: 'positive' },
      { label: 'Automation', value: 1920000, type: 'positive' },
      { label: 'Adoption', value: 840000, type: 'positive' },
      { label: 'Costs', value: -400000, type: 'negative' },
      { label: 'Net Impact', value: 4200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.8 mo' },
      { label: 'Year 1 ROI', value: '142%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '2.4 hrs', subtext: 'down from 14 hrs' },
    ],
  },
  pinnacle: {
    totalAnnualImpact: 1400000,
    categories: [
      { label: 'Verification Catches', amount: 480000, description: 'Antibiotic stewardship, PA documentation completeness, coding accuracy', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 620000, description: 'Clinical notes, prior auth, scheduling, and insurance verification', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 440000, description: 'Provider time savings from clinical AI tool adoption', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -140000, description: 'Platform license, Epic integration, and provider training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 480000, type: 'positive' },
      { label: 'Automation', value: 620000, type: 'positive' },
      { label: 'Adoption', value: 440000, type: 'positive' },
      { label: 'Costs', value: -140000, type: 'negative' },
      { label: 'Net Impact', value: 1400000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '2.8 mo' },
      { label: 'Year 1 ROI', value: '208%' },
      { label: 'Verified Accuracy', value: '98.1%' },
      { label: 'Exception Resolution', value: '4 min', subtext: 'down from 22 min' },
    ],
  },
  atlas: {
    totalAnnualImpact: 5100000,
    categories: [
      { label: 'Verification Catches', amount: 1680000, description: 'Material spec failures, procurement consolidation corrections, quality holds', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 2240000, description: 'Predictive maintenance, cross-plant inventory, quality inspection', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1680000, description: 'Floor worker efficiency gains and procurement cycle improvements', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -500000, description: 'Platform license, IoT gateway, SAP integration, multi-plant rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1680000, type: 'positive' },
      { label: 'Automation', value: 2240000, type: 'positive' },
      { label: 'Adoption', value: 1680000, type: 'positive' },
      { label: 'Costs', value: -500000, type: 'negative' },
      { label: 'Net Impact', value: 5100000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.4 mo' },
      { label: 'Year 1 ROI', value: '162%' },
      { label: 'Verified Accuracy', value: '97.2%' },
      { label: 'Exception Resolution', value: '0.6 hrs', subtext: 'down from 2.5 hrs' },
    ],
  },
  northbridge: {
    totalAnnualImpact: 18200000,
    categories: [
      { label: 'Verification Catches', amount: 6400000, description: 'Cross-OpCo compliance corrections, procurement accuracy, and duplicate detection across 12 operating companies', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 8200000, description: 'Supply chain optimization, financial close automation, and predictive maintenance across industrial fleet', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 5600000, description: 'Workforce efficiency gains across 42,000 employees spanning aerospace, energy, financial, and health sciences divisions', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -2000000, description: 'Enterprise platform license, multi-OpCo integration, change management, and global rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 6400000, type: 'positive' },
      { label: 'Automation', value: 8200000, type: 'positive' },
      { label: 'Adoption', value: 5600000, type: 'positive' },
      { label: 'Costs', value: -2000000, type: 'negative' },
      { label: 'Net Impact', value: 18200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '5.0 mo' },
      { label: 'Year 1 ROI', value: '134%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '2.2 hrs', subtext: 'down from 8.4 hrs' },
    ],
  },
  estonia: {
    totalAnnualImpact: 14800000,
    categories: [
      { label: 'Verification Catches', amount: 4200000, description: 'Tax compliance accuracy corrections, benefit eligibility verification, and cross-ministry data validation', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 6800000, description: 'Citizen services automation, inter-ministry data flows, and healthcare records integration via X-Road', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 5200000, description: 'Civil servant productivity gains across 8 ministries and agencies, leveraging existing digital infrastructure', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -1400000, description: 'Gov AI platform license, X-Road AI layer, ministry onboarding, and training programs', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 4200000, type: 'positive' },
      { label: 'Automation', value: 6800000, type: 'positive' },
      { label: 'Adoption', value: 5200000, type: 'positive' },
      { label: 'Costs', value: -1400000, type: 'negative' },
      { label: 'Net Impact', value: 14800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '152%' },
      { label: 'Verified Accuracy', value: '97.8%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 6.8 hrs' },
    ],
  },
  'nb-aerospace': {
    totalAnnualImpact: 4800000,
    categories: [
      { label: 'Verification Catches', amount: 1680000, description: 'Flight-critical spec validation, AS9100 compliance catches, and duplicate part number detection', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 2100000, description: 'MRO scheduling, supply chain tracking, and turbine lifecycle documentation automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1520000, description: 'Engineering team efficiency gains from AI-assisted design review and test analysis', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -500000, description: 'Platform license, PLM integration, ITAR-compliant deployment, and engineer training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1680000, type: 'positive' },
      { label: 'Automation', value: 2100000, type: 'positive' },
      { label: 'Adoption', value: 1520000, type: 'positive' },
      { label: 'Costs', value: -500000, type: 'negative' },
      { label: 'Net Impact', value: 4800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.6 mo' },
      { label: 'Year 1 ROI', value: '138%' },
      { label: 'Verified Accuracy', value: '97.6%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 5.8 hrs' },
    ],
  },
  'nb-energy': {
    totalAnnualImpact: 5800000,
    categories: [
      { label: 'Verification Catches', amount: 1960000, description: 'Grid compliance corrections, metering accuracy validation, and NERC audit preparation catches', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 2680000, description: 'Trading settlement, pipeline monitoring, and renewable asset performance reporting automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1760000, description: 'Field and trading floor efficiency gains from real-time analytics adoption', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -600000, description: 'Platform license, SCADA integration, trading floor deployment, and operator training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1960000, type: 'positive' },
      { label: 'Automation', value: 2680000, type: 'positive' },
      { label: 'Adoption', value: 1760000, type: 'positive' },
      { label: 'Costs', value: -600000, type: 'negative' },
      { label: 'Net Impact', value: 5800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '5.2 mo' },
      { label: 'Year 1 ROI', value: '128%' },
      { label: 'Verified Accuracy', value: '96.4%' },
      { label: 'Exception Resolution', value: '2.6 hrs', subtext: 'down from 9.2 hrs' },
    ],
  },
  'nb-financial': {
    totalAnnualImpact: 3760000,
    categories: [
      { label: 'Verification Catches', amount: 1340000, description: 'Regulatory filing corrections, KYC/AML flag accuracy, and reconciliation error prevention', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1680000, description: 'Loan origination, credit risk scoring, and portfolio compliance reporting automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1140000, description: 'Analyst and risk team productivity gains from AI-augmented decision workflows', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -400000, description: 'Platform license, core banking integration, SOX-compliant deployment, and staff training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1340000, type: 'positive' },
      { label: 'Automation', value: 1680000, type: 'positive' },
      { label: 'Adoption', value: 1140000, type: 'positive' },
      { label: 'Costs', value: -400000, type: 'negative' },
      { label: 'Net Impact', value: 3760000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.0 mo' },
      { label: 'Year 1 ROI', value: '156%' },
      { label: 'Verified Accuracy', value: '98.2%' },
      { label: 'Exception Resolution', value: '1.2 hrs', subtext: 'down from 4.6 hrs' },
    ],
  },
  'nb-health': {
    totalAnnualImpact: 3840000,
    categories: [
      { label: 'Verification Catches', amount: 1420000, description: 'Clinical trial data validation, FDA submission accuracy, and adverse event reporting corrections', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1740000, description: 'Lab data pipeline, regulatory document assembly, and pharmacovigilance case processing automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1180000, description: 'Researcher and clinical ops team productivity from AI-assisted literature review and data analysis', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -500000, description: 'Platform license, LIMS integration, GxP-validated environment, and scientist training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1420000, type: 'positive' },
      { label: 'Automation', value: 1740000, type: 'positive' },
      { label: 'Adoption', value: 1180000, type: 'positive' },
      { label: 'Costs', value: -500000, type: 'negative' },
      { label: 'Net Impact', value: 3840000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '5.4 mo' },
      { label: 'Year 1 ROI', value: '130%' },
      { label: 'Verified Accuracy', value: '97.0%' },
      { label: 'Exception Resolution', value: '2.8 hrs', subtext: 'down from 10.4 hrs' },
    ],
  },
  'ee-finance': {
    totalAnnualImpact: 4200000,
    categories: [
      { label: 'Verification Catches', amount: 1260000, description: 'Tax compliance accuracy corrections, VAT fraud detection, and cross-border transaction validation', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1980000, description: 'Tax return processing, treasury operations, and EU fund disbursement tracking automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1260000, description: 'Revenue officer productivity gains from automated audit case prioritization', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -300000, description: 'Platform license, EMTA system integration, and tax officer training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1260000, type: 'positive' },
      { label: 'Automation', value: 1980000, type: 'positive' },
      { label: 'Adoption', value: 1260000, type: 'positive' },
      { label: 'Costs', value: -300000, type: 'negative' },
      { label: 'Net Impact', value: 4200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.8 mo' },
      { label: 'Year 1 ROI', value: '168%' },
      { label: 'Verified Accuracy', value: '98.4%' },
      { label: 'Exception Resolution', value: '1.0 hrs', subtext: 'down from 5.2 hrs' },
    ],
  },
  'ee-social': {
    totalAnnualImpact: 5400000,
    categories: [
      { label: 'Verification Catches', amount: 1380000, description: 'Benefit eligibility corrections, pension calculation validation, and disability assessment accuracy', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 2480000, description: 'Benefit applications, case management workflows, and citizen notification systems automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 2240000, description: 'Case worker efficiency gains from AI-assisted eligibility determination and document review', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -700000, description: 'Platform license, SKA system integration, and case worker training programs', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1380000, type: 'positive' },
      { label: 'Automation', value: 2480000, type: 'positive' },
      { label: 'Adoption', value: 2240000, type: 'positive' },
      { label: 'Costs', value: -700000, type: 'negative' },
      { label: 'Net Impact', value: 5400000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.4 mo' },
      { label: 'Year 1 ROI', value: '148%' },
      { label: 'Verified Accuracy', value: '97.6%' },
      { label: 'Exception Resolution', value: '1.6 hrs', subtext: 'down from 7.4 hrs' },
    ],
  },
  'ee-economic': {
    totalAnnualImpact: 2800000,
    categories: [
      { label: 'Verification Catches', amount: 840000, description: 'EU fund allocation accuracy, grant compliance validation, and trade regulation corrections', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1260000, description: 'Economic reporting pipelines, business registry updates, and investment tracking automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 900000, description: 'Policy analyst efficiency gains from AI-driven economic modeling and forecasting tools', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -200000, description: 'Platform license, statistical systems integration, and analyst training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 840000, type: 'positive' },
      { label: 'Automation', value: 1260000, type: 'positive' },
      { label: 'Adoption', value: 900000, type: 'positive' },
      { label: 'Costs', value: -200000, type: 'negative' },
      { label: 'Net Impact', value: 2800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '3.2 mo' },
      { label: 'Year 1 ROI', value: '182%' },
      { label: 'Verified Accuracy', value: '98.6%' },
      { label: 'Exception Resolution', value: '0.8 hrs', subtext: 'down from 4.0 hrs' },
    ],
  },
  'ee-ria': {
    totalAnnualImpact: 2400000,
    categories: [
      { label: 'Verification Catches', amount: 720000, description: 'Cybersecurity incident classification accuracy, X-Road integrity checks, and e-ID validation corrections', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1080000, description: 'Threat detection pipelines, digital service monitoring, and incident response workflows automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 800000, description: 'Security analyst and DevOps team productivity from AI-augmented monitoring and response', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -200000, description: 'Platform license, X-Road AI layer deployment, SOC integration, and specialist training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 720000, type: 'positive' },
      { label: 'Automation', value: 1080000, type: 'positive' },
      { label: 'Adoption', value: 800000, type: 'positive' },
      { label: 'Costs', value: -200000, type: 'negative' },
      { label: 'Net Impact', value: 2400000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.8 mo' },
      { label: 'Year 1 ROI', value: '142%' },
      { label: 'Verified Accuracy', value: '97.2%' },
      { label: 'Exception Resolution', value: '1.8 hrs', subtext: 'down from 8.0 hrs' },
    ],
  },
};

/* ── Adoption data ───────────────────────────────────────── */

const adoptionData: Record<string, CompanyAdoptionData> = {
  meridian: {
    overallRate: 68, overallTrend: '+8% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Northeast Field Ops', active: 42, total: 48, adoption: 88, trend: '\u2191 12%', trendDir: 'up', status: 'strong' },
      { name: 'Southeast Field Ops', active: 31, total: 44, adoption: 70, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
      { name: 'Central Warehouse', active: 18, total: 22, adoption: 82, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'AP / Finance', active: 8, total: 12, adoption: 67, trend: '\u2191 15%', trendDir: 'up', status: 'growing' },
      { name: 'Southwest Field Ops', active: 14, total: 32, adoption: 44, trend: '\u2193 2%', trendDir: 'down', status: 'at-risk' },
      { name: 'Fleet Management', active: 6, total: 14, adoption: 43, trend: '\u2014 0%', trendDir: 'flat', status: 'stalled' },
    ],
    cycles: [
      { label: 'Field report submission', before: '4.2 hrs', after: '1.1 hrs', improvement: '74%' },
      { label: 'Invoice reconciliation', before: '3.5 days', after: '0.8 days', improvement: '77%' },
      { label: 'Equipment inspection', before: '2.8 hrs', after: '0.9 hrs', improvement: '68%' },
      { label: 'Compliance documentation', before: '6.0 hrs', after: '2.1 hrs', improvement: '65%' },
    ],
  },
  oakwood: {
    overallRate: 54, overallTrend: '+11% vs last month', overallTrendDir: 'up', teamLabel: 'Team',
    teams: [
      { name: 'Auto Claims \u2014 East', active: 22, total: 28, adoption: 79, trend: '\u2191 14%', trendDir: 'up', status: 'strong' },
      { name: 'Property Claims', active: 18, total: 24, adoption: 75, trend: '\u2191 9%', trendDir: 'up', status: 'growing' },
      { name: 'Commercial Lines UW', active: 12, total: 20, adoption: 60, trend: '\u2191 5%', trendDir: 'up', status: 'growing' },
      { name: 'Auto Claims \u2014 West', active: 8, total: 22, adoption: 36, trend: '\u2191 2%', trendDir: 'up', status: 'at-risk' },
      { name: 'Legacy Policy Team', active: 4, total: 18, adoption: 22, trend: '\u2193 1%', trendDir: 'down', status: 'stalled' },
      { name: 'SIU Investigators', active: 3, total: 8, adoption: 38, trend: '\u2014 0%', trendDir: 'flat', status: 'at-risk' },
    ],
    cycles: [
      { label: 'FNOL to first contact', before: '8.2 hrs', after: '2.4 hrs', improvement: '71%' },
      { label: 'Claims adjudication', before: '14 days', after: '4.8 days', improvement: '66%' },
      { label: 'Policy migration (per batch)', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Renewal risk assessment', before: '2.5 hrs', after: '0.6 hrs', improvement: '76%' },
    ],
  },
  pinnacle: {
    overallRate: 72, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Provider / Team',
    teams: [
      { name: 'Dr. R. Patel \u2014 Internal Med', active: 4, total: 4, adoption: 100, trend: '\u2191 0%', trendDir: 'flat', status: 'strong' },
      { name: 'Dr. S. Kim \u2014 Orthopedics', active: 3, total: 4, adoption: 75, trend: '\u2191 8%', trendDir: 'up', status: 'strong' },
      { name: 'Nursing Staff', active: 28, total: 34, adoption: 82, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Front Desk / Scheduling', active: 12, total: 14, adoption: 86, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Billing & Coding', active: 6, total: 10, adoption: 60, trend: '\u2191 10%', trendDir: 'up', status: 'growing' },
      { name: 'Dr. M. Torres \u2014 Family Med', active: 1, total: 3, adoption: 33, trend: '\u2193 5%', trendDir: 'down', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Clinical note completion', before: '18 min', after: '4 min', improvement: '78%' },
      { label: 'Prior auth submission', before: '45 min', after: '8 min', improvement: '82%' },
      { label: 'Patient scheduling', before: '12 min', after: '3 min', improvement: '75%' },
      { label: 'Insurance verification', before: '22 min', after: '2 min', improvement: '91%' },
    ],
  },
  atlas: {
    overallRate: 61, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Facility / Team',
    teams: [
      { name: 'Akron \u2014 CNC Floor', active: 42, total: 56, adoption: 75, trend: '\u2191 9%', trendDir: 'up', status: 'strong' },
      { name: 'Akron \u2014 Quality Lab', active: 8, total: 10, adoption: 80, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Detroit \u2014 Assembly', active: 34, total: 48, adoption: 71, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
      { name: 'Detroit \u2014 Procurement', active: 6, total: 8, adoption: 75, trend: '\u2191 12%', trendDir: 'up', status: 'strong' },
      { name: 'Guadalajara \u2014 Floor', active: 18, total: 42, adoption: 43, trend: '\u2191 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Charlotte \u2014 Finishing', active: 22, total: 30, adoption: 73, trend: '\u2191 6%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Maintenance ticket creation', before: '35 min', after: '8 min', improvement: '77%' },
      { label: 'Purchase order cycle', before: '4.2 days', after: '1.1 days', improvement: '74%' },
      { label: 'Quality inspection report', before: '2.5 hrs', after: '0.6 hrs', improvement: '76%' },
      { label: 'Cross-plant inventory lookup', before: '1.8 hrs', after: '12 min', improvement: '89%' },
    ],
  },
  northbridge: {
    overallRate: 71, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Operating Company / Division',
    teams: [
      { name: 'Aerospace Ops', active: 2800, total: 3200, adoption: 88, trend: '\u2191 8%', trendDir: 'up', status: 'strong' },
      { name: 'Energy Trading Floor', active: 1400, total: 1600, adoption: 88, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Financial Services Risk', active: 1800, total: 2000, adoption: 90, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Health Sciences R&D', active: 2100, total: 2800, adoption: 75, trend: '\u2191 9%', trendDir: 'up', status: 'growing' },
      { name: 'Corporate IT', active: 480, total: 520, adoption: 92, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'Shared Services', active: 1200, total: 2000, adoption: 60, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Procurement cycle (cross-OpCo)', before: '3 weeks', after: '2 days', improvement: '90%' },
      { label: 'Maintenance work order creation', before: '45 min', after: '8 min', improvement: '82%' },
      { label: 'Financial close (consolidated)', before: '12 days', after: '3 days', improvement: '75%' },
      { label: 'Supplier onboarding', before: '4 weeks', after: '5 days', improvement: '82%' },
    ],
  },
  estonia: {
    overallRate: 84, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Agency / Board',
    teams: [
      { name: 'Tax & Revenue Board (EMTA)', active: 4200, total: 4400, adoption: 95, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'Social Insurance Board (SKA)', active: 2400, total: 2800, adoption: 86, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Health Insurance Fund (EHIF)', active: 1800, total: 2200, adoption: 82, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Digital Services (RIA)', active: 680, total: 700, adoption: 97, trend: '\u2191 1%', trendDir: 'up', status: 'strong' },
      { name: 'Treasury', active: 420, total: 480, adoption: 88, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Procurement Agency', active: 280, total: 400, adoption: 70, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Tax return processing', before: '14 days', after: '48 hours', improvement: '86%' },
      { label: 'Benefit eligibility determination', before: '10 days', after: '24 hours', improvement: '90%' },
      { label: 'Healthcare record integration', before: '3 weeks', after: '2 days', improvement: '90%' },
      { label: 'Cross-ministry data request', before: '5 days', after: '4 hours', improvement: '97%' },
    ],
  },
  'nb-aerospace': {
    overallRate: 76, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Engineering Team',
    teams: [
      { name: 'Propulsion Engineering', active: 420, total: 480, adoption: 88, trend: '↑ 6%', trendDir: 'up', status: 'strong' },
      { name: 'Avionics QA', active: 310, total: 340, adoption: 91, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Structural Analysis', active: 280, total: 360, adoption: 78, trend: '↑ 9%', trendDir: 'up', status: 'growing' },
      { name: 'Flight Test Operations', active: 190, total: 220, adoption: 86, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Supply Chain — Aero Parts', active: 140, total: 200, adoption: 70, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'MRO Documentation', active: 80, total: 140, adoption: 57, trend: '↑ 12%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Design review cycle', before: '5 days', after: '1.2 days', improvement: '76%' },
      { label: 'MRO work order generation', before: '3.5 hrs', after: '0.8 hrs', improvement: '77%' },
      { label: 'Part certification lookup', before: '45 min', after: '6 min', improvement: '87%' },
      { label: 'Flight test report compilation', before: '2 days', after: '4 hrs', improvement: '83%' },
    ],
  },
  'nb-energy': {
    overallRate: 68, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Operations Team',
    teams: [
      { name: 'Trading Floor Analytics', active: 240, total: 260, adoption: 92, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
      { name: 'Grid Operations Center', active: 380, total: 440, adoption: 86, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Renewable Asset Mgmt', active: 160, total: 220, adoption: 73, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Pipeline Monitoring', active: 120, total: 180, adoption: 67, trend: '↑ 6%', trendDir: 'up', status: 'growing' },
      { name: 'Regulatory Compliance', active: 80, total: 100, adoption: 80, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Field Maintenance Crews', active: 140, total: 280, adoption: 50, trend: '↑ 7%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Trading settlement reconciliation', before: '4.5 hrs', after: '0.9 hrs', improvement: '80%' },
      { label: 'Pipeline integrity report', before: '3 days', after: '6 hrs', improvement: '92%' },
      { label: 'Grid anomaly resolution', before: '2.4 hrs', after: '0.5 hrs', improvement: '79%' },
      { label: 'Renewable output forecasting', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
    ],
  },
  'nb-financial': {
    overallRate: 82, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Department',
    teams: [
      { name: 'Credit Risk Analysis', active: 340, total: 380, adoption: 89, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
      { name: 'Loan Origination', active: 280, total: 320, adoption: 88, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Compliance & Regulatory', active: 220, total: 240, adoption: 92, trend: '↑ 2%', trendDir: 'up', status: 'strong' },
      { name: 'Portfolio Management', active: 180, total: 220, adoption: 82, trend: '↑ 6%', trendDir: 'up', status: 'strong' },
      { name: 'Client Onboarding (KYC)', active: 120, total: 160, adoption: 75, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Loan origination cycle', before: '5 days', after: '1.2 days', improvement: '76%' },
      { label: 'KYC/AML review', before: '3 hrs', after: '35 min', improvement: '81%' },
      { label: 'Regulatory filing preparation', before: '4 days', after: '8 hrs', improvement: '83%' },
      { label: 'Credit risk model refresh', before: '2 weeks', after: '3 days', improvement: '79%' },
    ],
  },
  'nb-health': {
    overallRate: 66, overallTrend: '+9% vs last month', overallTrendDir: 'up', teamLabel: 'Research Unit',
    teams: [
      { name: 'Clinical Trials Ops', active: 480, total: 580, adoption: 83, trend: '↑ 7%', trendDir: 'up', status: 'strong' },
      { name: 'Bioinformatics Lab', active: 220, total: 240, adoption: 92, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
      { name: 'Regulatory Affairs', active: 160, total: 200, adoption: 80, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Pharmacovigilance', active: 140, total: 220, adoption: 64, trend: '↑ 11%', trendDir: 'up', status: 'growing' },
      { name: 'Drug Discovery R&D', active: 320, total: 440, adoption: 73, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Manufacturing QC', active: 180, total: 340, adoption: 53, trend: '↑ 10%', trendDir: 'up', status: 'at-risk' },
    ],
    cycles: [
      { label: 'Adverse event case processing', before: '8 hrs', after: '1.5 hrs', improvement: '81%' },
      { label: 'Clinical data query resolution', before: '3 days', after: '5 hrs', improvement: '93%' },
      { label: 'FDA submission assembly', before: '6 weeks', after: '10 days', improvement: '76%' },
      { label: 'Literature review (per compound)', before: '2 weeks', after: '2 days', improvement: '86%' },
    ],
  },
  'ee-finance': {
    overallRate: 91, overallTrend: '+3% vs last month', overallTrendDir: 'up', teamLabel: 'Unit / Division',
    teams: [
      { name: 'Tax Compliance', active: 1200, total: 1260, adoption: 95, trend: '↑ 2%', trendDir: 'up', status: 'strong' },
      { name: 'VAT Audit', active: 680, total: 720, adoption: 94, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
      { name: 'Treasury Operations', active: 420, total: 480, adoption: 88, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'EU Fund Management', active: 340, total: 400, adoption: 85, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Customs & Excise', active: 280, total: 320, adoption: 88, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
    ],
    cycles: [
      { label: 'Tax return processing', before: '14 days', after: '48 hours', improvement: '86%' },
      { label: 'VAT fraud case review', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Treasury reconciliation', before: '3 days', after: '4 hrs', improvement: '94%' },
      { label: 'EU fund disbursement tracking', before: '2 weeks', after: '2 days', improvement: '86%' },
    ],
  },
  'ee-social': {
    overallRate: 82, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Service Area',
    teams: [
      { name: 'Pension Administration', active: 620, total: 720, adoption: 86, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Disability Assessment', active: 380, total: 460, adoption: 83, trend: '↑ 6%', trendDir: 'up', status: 'strong' },
      { name: 'Family Benefits', active: 440, total: 520, adoption: 85, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'Unemployment Services', active: 280, total: 360, adoption: 78, trend: '↑ 7%', trendDir: 'up', status: 'growing' },
      { name: 'Child Welfare', active: 200, total: 280, adoption: 71, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Rehabilitation Services', active: 140, total: 220, adoption: 64, trend: '↑ 9%', trendDir: 'up', status: 'growing' },
    ],
    cycles: [
      { label: 'Benefit eligibility determination', before: '10 days', after: '24 hours', improvement: '90%' },
      { label: 'Pension recalculation', before: '5 days', after: '6 hrs', improvement: '95%' },
      { label: 'Disability case review', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Family benefit application', before: '7 days', after: '12 hrs', improvement: '93%' },
    ],
  },
  'ee-economic': {
    overallRate: 78, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Division',
    teams: [
      { name: 'Economic Forecasting', active: 120, total: 140, adoption: 86, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Business Registry', active: 180, total: 220, adoption: 82, trend: '↑ 5%', trendDir: 'up', status: 'strong' },
      { name: 'EU Grant Compliance', active: 140, total: 180, adoption: 78, trend: '↑ 7%', trendDir: 'up', status: 'growing' },
      { name: 'Trade & Investment', active: 100, total: 140, adoption: 71, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Statistical Analysis', active: 80, total: 100, adoption: 80, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
    ],
    cycles: [
      { label: 'Economic indicator report', before: '2 weeks', after: '2 days', improvement: '86%' },
      { label: 'Business registry update', before: '5 days', after: '8 hrs', improvement: '93%' },
      { label: 'Grant compliance audit', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Trade impact assessment', before: '10 days', after: '2 days', improvement: '80%' },
    ],
  },
  'ee-ria': {
    overallRate: 88, overallTrend: '+2% vs last month', overallTrendDir: 'up', teamLabel: 'Security Team',
    teams: [
      { name: 'SOC — Threat Detection', active: 180, total: 190, adoption: 95, trend: '↑ 2%', trendDir: 'up', status: 'strong' },
      { name: 'X-Road Infrastructure', active: 140, total: 150, adoption: 93, trend: '↑ 1%', trendDir: 'up', status: 'strong' },
      { name: 'e-ID & Digital Signing', active: 120, total: 130, adoption: 92, trend: '↑ 2%', trendDir: 'up', status: 'strong' },
      { name: 'Incident Response', active: 80, total: 90, adoption: 89, trend: '↑ 3%', trendDir: 'up', status: 'strong' },
      { name: 'Gov Cloud Operations', active: 100, total: 120, adoption: 83, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
    ],
    cycles: [
      { label: 'Threat classification triage', before: '35 min', after: '4 min', improvement: '89%' },
      { label: 'X-Road service health audit', before: '2 days', after: '3 hrs', improvement: '94%' },
      { label: 'Incident response playbook exec', before: '4 hrs', after: '45 min', improvement: '81%' },
      { label: 'Vulnerability patch deployment', before: '3 days', after: '6 hrs', improvement: '92%' },
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
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Impact</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Realized value and ROI — {company.employees.toLocaleString()} employees, {company.revenue} revenue</p>
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
    </div>
  );
}
