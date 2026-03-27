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

const COMMAND_CENTER_URL = 'https://command-center-git-main-scotty123868s-projects.vercel.app';

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
      { label: 'Verification Catches', amount: 1080000, description: 'Track defect identification via RailSentry/LIDAR, FRA safety compliance catches, equipment failure prevention', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1680000, description: 'Dispatch automation, crew scheduling optimization, fleet tracking and GPS ballast train routing automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1140000, description: 'Field crew productivity gains from mobile-first tools across 36-state rail operations', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -300000, description: 'Platform license, PTC/signal system integration, and division-wide training rollout', icon: 'cost', type: 'cost' },
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
      { label: 'Verified Accuracy', value: '97.2%' },
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
      { label: 'Verified Accuracy', value: '97.0%' },
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
      { label: 'Verified Accuracy', value: '98.2%' },
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
      { label: 'Verified Accuracy', value: '96.6%' },
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
      { label: 'Verified Accuracy', value: '97.8%' },
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
      { label: 'Verified Accuracy', value: '98.0%' },
      { label: 'Exception Resolution', value: '0.4 hrs', subtext: 'down from 2.8 hrs' },
    ],
  },
};

/* ── Adoption data ───────────────────────────────────────── */

const adoptionData: Record<string, CompanyAdoptionData> = {
  meridian: {
    overallRate: 62, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Division / Team',
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
    overallRate: 64, overallTrend: '+8% vs last month', overallTrendDir: 'up', teamLabel: 'Division / Crew',
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
    overallRate: 58, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Operations Team',
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
    overallRate: 66, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Testing Team',
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
    overallRate: 68, overallTrend: '+7% vs last month', overallTrendDir: 'up', teamLabel: 'Engineering Team',
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
    overallRate: 52, overallTrend: '+4% vs last month', overallTrendDir: 'up', teamLabel: 'Transit Division',
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
    overallRate: 62, overallTrend: '+6% vs last month', overallTrendDir: 'up', teamLabel: 'Energy Team',
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
    overallRate: 56, overallTrend: '+5% vs last month', overallTrendDir: 'up', teamLabel: 'Services Team',
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

      {/* ── Cross-link to Command Center ROI ──────────────────── */}
      <a
        href={`${COMMAND_CENTER_URL}/roi-summary`}
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
