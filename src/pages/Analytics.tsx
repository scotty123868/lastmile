import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Workflow,
  DollarSign,
  Gauge,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Cpu,
  Trash2,
  Table2,
  Clock,
  Users,
  Building2,
  Briefcase,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useCompany } from '../data/CompanyContext';

/* ── Types ───────────────────────────────────────────────── */

interface ReadinessData {
  score: number;
  label: string;
}

interface KPIData {
  savings: number;
  scoreBefore: number;
  scoreAfter: number;
  workflows: number;
  workflowsReady: number;
  waste: number;
}

interface TimelineStop {
  savings: number;
  score: number;
  workflows: number;
  waste: number;
}

interface Opportunity {
  priority: number;
  name: string;
  savings: number;
  status: 'Automated' | 'In Progress' | 'Identified';
}

interface InactionData {
  year1: number;
  year2: number;
  year3: number;
  total: number;
}

interface CompanyAnalyticsData {
  readiness: ReadinessData;
  kpis: KPIData;
  timeline: [TimelineStop, TimelineStop, TimelineStop];
  opportunities: Opportunity[];
  inaction: InactionData;
}

/* ── Cost curve types ────────────────────────────────────── */

interface CostCurveMonth {
  month: string;
  costs: number;
  savings: number;
  net: number;
}

interface PaybackData {
  paybackMonths: number;
  year1ROI: number;
  year2Projected: string;
}

interface CostCurveData {
  timeline: CostCurveMonth[];
  breakEvenMonth: number;
  breakEvenLabel: string;
  payback: PaybackData;
}

/* ── Company-specific data ───────────────────────────────── */

const analyticsData: Record<string, CompanyAnalyticsData> = {
  meridian: {
    readiness: { score: 34, label: 'Critical \u2014 requires foundational investment' },
    kpis: { savings: 4200000, scoreBefore: 34, scoreAfter: 87, workflows: 47, workflowsReady: 12, waste: 800000 },
    timeline: [
      { savings: 0, score: 34, workflows: 0, waste: 800000 },
      { savings: 2100000, score: 61, workflows: 28, waste: 400000 },
      { savings: 4200000, score: 87, workflows: 47, waste: 120000 },
    ],
    opportunities: [
      { priority: 1, name: 'Field Service Report Automation', savings: 920000, status: 'In Progress' },
      { priority: 2, name: 'Invoice Matching & Reconciliation', savings: 840000, status: 'Identified' },
      { priority: 3, name: 'Equipment Tracking Digitization', savings: 680000, status: 'Identified' },
      { priority: 4, name: 'Compliance Reporting Automation', savings: 520000, status: 'Automated' },
      { priority: 5, name: 'Vendor Management Optimization', savings: 440000, status: 'Identified' },
    ],
    inaction: { year1: 800000, year2: 960000, year3: 1150000, total: 2910000 },
  },
  oakwood: {
    readiness: { score: 41, label: 'Below Average \u2014 significant gaps in key areas' },
    kpis: { savings: 4800000, scoreBefore: 41, scoreAfter: 78, workflows: 38, workflowsReady: 9, waste: 620000 },
    timeline: [
      { savings: 0, score: 41, workflows: 0, waste: 620000 },
      { savings: 2400000, score: 58, workflows: 18, waste: 340000 },
      { savings: 4800000, score: 78, workflows: 38, waste: 95000 },
    ],
    opportunities: [
      { priority: 1, name: 'Claims Intake Automation', savings: 860000, status: 'In Progress' },
      { priority: 2, name: 'Fraud Detection Enhancement', savings: 740000, status: 'Automated' },
      { priority: 3, name: 'Policy Renewal Processing', savings: 620000, status: 'Identified' },
      { priority: 4, name: 'Adjuster Routing Optimization', savings: 480000, status: 'In Progress' },
      { priority: 5, name: 'Compliance Audit Automation', savings: 380000, status: 'Identified' },
    ],
    inaction: { year1: 620000, year2: 745000, year3: 895000, total: 2260000 },
  },
  pinnacle: {
    readiness: { score: 72, label: 'Good \u2014 targeted improvements needed' },
    kpis: { savings: 1600000, scoreBefore: 72, scoreAfter: 94, workflows: 24, workflowsReady: 18, waste: 180000 },
    timeline: [
      { savings: 0, score: 72, workflows: 0, waste: 180000 },
      { savings: 800000, score: 84, workflows: 14, waste: 80000 },
      { savings: 1600000, score: 94, workflows: 24, waste: 25000 },
    ],
    opportunities: [
      { priority: 1, name: 'Clinical Notes Summarization', savings: 310000, status: 'Automated' },
      { priority: 2, name: 'Prior Authorization Processing', savings: 260000, status: 'Automated' },
      { priority: 3, name: 'Scheduling Optimization', savings: 220000, status: 'In Progress' },
      { priority: 4, name: 'Billing Code Verification', savings: 180000, status: 'In Progress' },
      { priority: 5, name: 'Prescription Verification', savings: 140000, status: 'Identified' },
    ],
    inaction: { year1: 180000, year2: 215000, year3: 260000, total: 655000 },
  },
  atlas: {
    readiness: { score: 28, label: 'Critical \u2014 legacy systems limit AI readiness' },
    kpis: { savings: 5600000, scoreBefore: 28, scoreAfter: 82, workflows: 62, workflowsReady: 15, waste: 1200000 },
    timeline: [
      { savings: 0, score: 28, workflows: 0, waste: 1200000 },
      { savings: 2800000, score: 54, workflows: 32, waste: 580000 },
      { savings: 5600000, score: 82, workflows: 62, waste: 140000 },
    ],
    opportunities: [
      { priority: 1, name: 'Predictive Maintenance Scheduling', savings: 1340000, status: 'In Progress' },
      { priority: 2, name: 'Quality Inspection Automation', savings: 1080000, status: 'Identified' },
      { priority: 3, name: 'Inventory Optimization System', savings: 920000, status: 'Identified' },
      { priority: 4, name: 'Procurement Cycle Automation', savings: 780000, status: 'Automated' },
      { priority: 5, name: 'Safety Compliance Monitoring', savings: 640000, status: 'In Progress' },
    ],
    inaction: { year1: 1200000, year2: 1440000, year3: 1730000, total: 4370000 },
  },
  northbridge: {
    readiness: { score: 52, label: 'Moderate \u2014 strong pockets but inconsistent across OpCos' },
    kpis: { savings: 24800000, scoreBefore: 52, scoreAfter: 88, workflows: 184, workflowsReady: 48, waste: 4200000 },
    timeline: [
      { savings: 0, score: 52, workflows: 0, waste: 4200000 },
      { savings: 12400000, score: 70, workflows: 92, waste: 2100000 },
      { savings: 24800000, score: 88, workflows: 184, waste: 480000 },
    ],
    opportunities: [
      { priority: 1, name: 'Supply Chain Optimization', savings: 5200000, status: 'In Progress' },
      { priority: 2, name: 'Cross-OpCo Procurement', savings: 4800000, status: 'Identified' },
      { priority: 3, name: 'Predictive Maintenance Fleet', savings: 3600000, status: 'Automated' },
      { priority: 4, name: 'Financial Close Automation', savings: 3200000, status: 'In Progress' },
      { priority: 5, name: 'Clinical Trial Data Pipeline', savings: 2400000, status: 'Identified' },
    ],
    inaction: { year1: 4200000, year2: 5000000, year3: 6000000, total: 15200000 },
  },
  estonia: {
    readiness: { score: 72, label: 'Good \u2014 strong digital foundation, AI integration needed' },
    kpis: { savings: 18600000, scoreBefore: 72, scoreAfter: 94, workflows: 126, workflowsReady: 62, waste: 2800000 },
    timeline: [
      { savings: 0, score: 72, workflows: 0, waste: 2800000 },
      { savings: 9300000, score: 83, workflows: 63, waste: 1400000 },
      { savings: 18600000, score: 94, workflows: 126, waste: 320000 },
    ],
    opportunities: [
      { priority: 1, name: 'Tax Compliance Automation', savings: 4200000, status: 'Automated' },
      { priority: 2, name: 'Citizen Services AI', savings: 3800000, status: 'In Progress' },
      { priority: 3, name: 'Healthcare Records Integration', savings: 3400000, status: 'In Progress' },
      { priority: 4, name: 'Cross-Ministry Data Platform', savings: 2800000, status: 'Identified' },
      { priority: 5, name: 'Procurement Optimization', savings: 2100000, status: 'Identified' },
    ],
    inaction: { year1: 2800000, year2: 3400000, year3: 4100000, total: 10300000 },
  },
  'nb-aerospace': {
    readiness: { score: 46, label: 'Below Average — legacy avionics systems limit integration' },
    kpis: { savings: 6200000, scoreBefore: 46, scoreAfter: 85, workflows: 52, workflowsReady: 14, waste: 1050000 },
    timeline: [
      { savings: 0, score: 46, workflows: 0, waste: 1050000 },
      { savings: 3100000, score: 66, workflows: 26, waste: 520000 },
      { savings: 6200000, score: 85, workflows: 52, waste: 120000 },
    ],
    opportunities: [
      { priority: 1, name: 'Flight Certification Document Automation', savings: 1480000, status: 'In Progress' },
      { priority: 2, name: 'Supply Chain Traceability Platform', savings: 1260000, status: 'Identified' },
      { priority: 3, name: 'Defense Manufacturing Quality Control', savings: 1040000, status: 'Identified' },
      { priority: 4, name: 'Parts Lifecycle Tracking System', savings: 820000, status: 'Automated' },
      { priority: 5, name: 'MRO Scheduling Optimization', savings: 600000, status: 'In Progress' },
    ],
    inaction: { year1: 1050000, year2: 1260000, year3: 1510000, total: 3820000 },
  },
  'nb-energy': {
    readiness: { score: 38, label: 'Critical — SCADA legacy and OT/IT convergence gaps' },
    kpis: { savings: 7400000, scoreBefore: 38, scoreAfter: 84, workflows: 52, workflowsReady: 12, waste: 1510000 },
    timeline: [
      { savings: 0, score: 38, workflows: 0, waste: 1510000 },
      { savings: 3700000, score: 60, workflows: 26, waste: 755000 },
      { savings: 7400000, score: 84, workflows: 52, waste: 150000 },
    ],
    opportunities: [
      { priority: 1, name: 'SCADA Data Analytics Pipeline', savings: 1780000, status: 'In Progress' },
      { priority: 2, name: 'Grid Load Forecasting Automation', savings: 1520000, status: 'Identified' },
      { priority: 3, name: 'Pipeline Monitoring & Anomaly Detection', savings: 1280000, status: 'Identified' },
      { priority: 4, name: 'Energy Trading Optimization', savings: 980000, status: 'Automated' },
      { priority: 5, name: 'Regulatory Compliance Reporting', savings: 740000, status: 'In Progress' },
    ],
    inaction: { year1: 1510000, year2: 1580000, year3: 1900000, total: 5410000 },
  },
  'nb-financial': {
    readiness: { score: 62, label: 'Moderate — solid data infrastructure, model governance needed' },
    kpis: { savings: 5000000, scoreBefore: 62, scoreAfter: 91, workflows: 36, workflowsReady: 12, waste: 680000 },
    timeline: [
      { savings: 0, score: 62, workflows: 0, waste: 680000 },
      { savings: 2500000, score: 76, workflows: 18, waste: 340000 },
      { savings: 5000000, score: 91, workflows: 36, waste: 80000 },
    ],
    opportunities: [
      { priority: 1, name: 'Risk Analytics Model Automation', savings: 1200000, status: 'Automated' },
      { priority: 2, name: 'AML Transaction Monitoring', savings: 1040000, status: 'In Progress' },
      { priority: 3, name: 'Regulatory Report Generation', savings: 880000, status: 'In Progress' },
      { priority: 4, name: 'Credit Scoring Pipeline', savings: 720000, status: 'Identified' },
      { priority: 5, name: 'KYC Document Processing', savings: 560000, status: 'Identified' },
    ],
    inaction: { year1: 680000, year2: 820000, year3: 980000, total: 2480000 },
  },
  'nb-health': {
    readiness: { score: 55, label: 'Moderate — strong clinical data, interoperability challenges' },
    kpis: { savings: 6200000, scoreBefore: 55, scoreAfter: 89, workflows: 44, workflowsReady: 10, waste: 960000 },
    timeline: [
      { savings: 0, score: 55, workflows: 0, waste: 960000 },
      { savings: 2900000, score: 72, workflows: 22, waste: 480000 },
      { savings: 6200000, score: 89, workflows: 44, waste: 110000 },
    ],
    opportunities: [
      { priority: 1, name: 'Clinical Trial Data Pipeline', savings: 1480000, status: 'In Progress' },
      { priority: 2, name: 'Pharma Manufacturing QA Automation', savings: 1260000, status: 'Identified' },
      { priority: 3, name: 'Quality Control Lab Digitization', savings: 1040000, status: 'In Progress' },
      { priority: 4, name: 'Adverse Event Reporting Automation', savings: 820000, status: 'Automated' },
      { priority: 5, name: 'Drug Safety Signal Detection', savings: 600000, status: 'Identified' },
    ],
    inaction: { year1: 960000, year2: 1150000, year3: 1380000, total: 3490000 },
  },
  'ee-finance': {
    readiness: { score: 74, label: 'Good — strong e-governance base, AI layer needed' },
    kpis: { savings: 5200000, scoreBefore: 74, scoreAfter: 95, workflows: 34, workflowsReady: 18, waste: 720000 },
    timeline: [
      { savings: 0, score: 74, workflows: 0, waste: 720000 },
      { savings: 2600000, score: 84, workflows: 17, waste: 360000 },
      { savings: 5200000, score: 95, workflows: 34, waste: 80000 },
    ],
    opportunities: [
      { priority: 1, name: 'Tax Compliance Automation', savings: 1240000, status: 'Automated' },
      { priority: 2, name: 'Fiscal Reporting Intelligence', savings: 1080000, status: 'In Progress' },
      { priority: 3, name: 'Budget Analytics & Forecasting', savings: 920000, status: 'In Progress' },
      { priority: 4, name: 'VAT Fraud Detection', savings: 740000, status: 'Identified' },
      { priority: 5, name: 'Treasury Management Optimization', savings: 580000, status: 'Identified' },
    ],
    inaction: { year1: 720000, year2: 860000, year3: 1040000, total: 2620000 },
  },
  'ee-social': {
    readiness: { score: 68, label: 'Moderate — citizen-facing systems mature, back-office gaps' },
    kpis: { savings: 6800000, scoreBefore: 68, scoreAfter: 93, workflows: 42, workflowsReady: 18, waste: 1200000 },
    timeline: [
      { savings: 0, score: 68, workflows: 0, waste: 1200000 },
      { savings: 3400000, score: 80, workflows: 21, waste: 600000 },
      { savings: 6800000, score: 93, workflows: 42, waste: 110000 },
    ],
    opportunities: [
      { priority: 1, name: 'Benefits Processing Automation', savings: 1620000, status: 'In Progress' },
      { priority: 2, name: 'Health Records Integration', savings: 1380000, status: 'Automated' },
      { priority: 3, name: 'Case Management AI Triage', savings: 1160000, status: 'In Progress' },
      { priority: 4, name: 'Pension Calculation Automation', savings: 940000, status: 'Identified' },
      { priority: 5, name: 'Social Worker Scheduling Optimization', savings: 720000, status: 'Identified' },
    ],
    inaction: { year1: 1200000, year2: 1180000, year3: 1410000, total: 4490000 },
  },
  'ee-economic': {
    readiness: { score: 76, label: 'Good — e-Residency platform strong, trade systems need AI' },
    kpis: { savings: 3400000, scoreBefore: 76, scoreAfter: 95, workflows: 26, workflowsReady: 14, waste: 460000 },
    timeline: [
      { savings: 0, score: 76, workflows: 0, waste: 460000 },
      { savings: 1700000, score: 86, workflows: 13, waste: 230000 },
      { savings: 3400000, score: 95, workflows: 26, waste: 50000 },
    ],
    opportunities: [
      { priority: 1, name: 'Trade Processing Automation', savings: 820000, status: 'Automated' },
      { priority: 2, name: 'e-Residency Application AI Review', savings: 700000, status: 'In Progress' },
      { priority: 3, name: 'Business Registry Verification', savings: 580000, status: 'In Progress' },
      { priority: 4, name: 'Export License Classification', savings: 460000, status: 'Identified' },
      { priority: 5, name: 'FDI Analytics & Reporting', savings: 340000, status: 'Identified' },
    ],
    inaction: { year1: 460000, year2: 550000, year3: 660000, total: 1670000 },
  },
  'ee-ria': {
    readiness: { score: 78, label: 'Good — advanced IT infrastructure, AI security integration needed' },
    kpis: { savings: 3200000, scoreBefore: 78, scoreAfter: 96, workflows: 24, workflowsReady: 12, waste: 420000 },
    timeline: [
      { savings: 0, score: 78, workflows: 0, waste: 420000 },
      { savings: 1600000, score: 87, workflows: 12, waste: 210000 },
      { savings: 3200000, score: 96, workflows: 24, waste: 45000 },
    ],
    opportunities: [
      { priority: 1, name: 'Cybersecurity Threat Detection AI', savings: 780000, status: 'Automated' },
      { priority: 2, name: 'X-Road Service Monitoring', savings: 660000, status: 'In Progress' },
      { priority: 3, name: 'IT Infrastructure Anomaly Detection', savings: 540000, status: 'In Progress' },
      { priority: 4, name: 'Incident Response Automation', savings: 420000, status: 'Identified' },
      { priority: 5, name: 'Government Cloud Optimization', savings: 320000, status: 'Identified' },
    ],
    inaction: { year1: 420000, year2: 500000, year3: 600000, total: 1520000 },
  },
};

/* ── Cost curve data (from Assessment) ───────────────────── */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildTimeline(costs: number[], savings: number[]): CostCurveMonth[] {
  return months.map((m, i) => ({
    month: m,
    costs: costs[i],
    savings: savings[i],
    net: savings[i] - costs[i],
  }));
}

const costCurveData: Record<string, CostCurveData> = {
  meridian: {
    timeline: buildTimeline(
      [580, 520, 380, 280, 180, 120, 80, 60, 45, 35, 30, 25],
      [0, 40, 120, 240, 380, 520, 580, 620, 640, 660, 670, 680],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.2, year1ROI: 150, year2Projected: '$6.1M' },
  },
  oakwood: {
    timeline: buildTimeline(
      [640, 580, 440, 320, 200, 140, 95, 70, 50, 40, 35, 30],
      [0, 30, 100, 200, 340, 480, 560, 600, 630, 650, 660, 670],
    ),
    breakEvenMonth: 6, breakEvenLabel: 'Jun',
    payback: { paybackMonths: 5.1, year1ROI: 128, year2Projected: '$5.4M' },
  },
  pinnacle: {
    timeline: buildTimeline(
      [280, 240, 180, 130, 80, 50, 35, 25, 20, 15, 12, 10],
      [0, 20, 60, 120, 180, 220, 250, 270, 280, 285, 290, 295],
    ),
    breakEvenMonth: 4, breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.1, year1ROI: 185, year2Projected: '$1.8M' },
  },
  atlas: {
    timeline: buildTimeline(
      [720, 650, 500, 380, 250, 170, 110, 80, 60, 45, 38, 32],
      [0, 50, 140, 280, 440, 620, 720, 780, 820, 850, 870, 880],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.8, year1ROI: 142, year2Projected: '$7.2M' },
  },
  northbridge: {
    timeline: buildTimeline(
      [3200, 2800, 2100, 1600, 1000, 680, 440, 320, 240, 180, 140, 110],
      [0, 200, 800, 1800, 3200, 5400, 7200, 9400, 11800, 14200, 16800, 18600],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 5.4, year1ROI: 122, year2Projected: '$42M' },
  },
  estonia: {
    timeline: buildTimeline(
      [2400, 2100, 1600, 1200, 780, 520, 340, 240, 180, 140, 110, 90],
      [0, 180, 640, 1400, 2600, 4200, 5800, 7400, 9200, 11400, 14000, 16200],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 138, year2Projected: '$28M' },
  },
  'nb-aerospace': {
    timeline: buildTimeline(
      [820, 740, 560, 420, 280, 180, 120, 90, 65, 50, 40, 35],
      [0, 60, 180, 380, 580, 820, 1020, 1180, 1320, 1440, 1540, 1620],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.6, year1ROI: 140, year2Projected: '$8.4M' },
  },
  'nb-energy': {
    timeline: buildTimeline(
      [980, 880, 680, 520, 340, 220, 150, 110, 80, 60, 48, 40],
      [0, 70, 220, 460, 720, 1020, 1280, 1480, 1660, 1820, 1940, 2040],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 5.0, year1ROI: 132, year2Projected: '$10.2M' },
  },
  'nb-financial': {
    timeline: buildTimeline(
      [620, 540, 400, 300, 200, 130, 85, 60, 45, 35, 28, 22],
      [0, 50, 160, 340, 520, 700, 860, 980, 1080, 1160, 1220, 1280],
    ),
    breakEvenMonth: 4, breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.8, year1ROI: 165, year2Projected: '$7.2M' },
  },
  'nb-health': {
    timeline: buildTimeline(
      [820, 740, 560, 420, 280, 180, 120, 90, 65, 50, 40, 35],
      [0, 60, 180, 380, 580, 820, 1020, 1180, 1320, 1440, 1540, 1620],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.4, year1ROI: 145, year2Projected: '$8.6M' },
  },
  'ee-finance': {
    timeline: buildTimeline(
      [640, 560, 420, 310, 200, 130, 85, 60, 45, 35, 28, 22],
      [0, 50, 160, 340, 540, 740, 920, 1060, 1180, 1280, 1360, 1420],
    ),
    breakEvenMonth: 4, breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.6, year1ROI: 172, year2Projected: '€7.8M' },
  },
  'ee-social': {
    timeline: buildTimeline(
      [860, 760, 580, 440, 280, 180, 120, 85, 65, 50, 40, 32],
      [0, 65, 200, 420, 660, 920, 1140, 1320, 1480, 1620, 1740, 1840],
    ),
    breakEvenMonth: 5, breakEvenLabel: 'May',
    payback: { paybackMonths: 4.4, year1ROI: 148, year2Projected: '€10.4M' },
  },
  'ee-economic': {
    timeline: buildTimeline(
      [420, 360, 270, 200, 130, 85, 55, 40, 30, 24, 18, 15],
      [0, 35, 110, 220, 360, 480, 600, 690, 760, 820, 870, 910],
    ),
    breakEvenMonth: 4, breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.4, year1ROI: 180, year2Projected: '€5.2M' },
  },
  'ee-ria': {
    timeline: buildTimeline(
      [400, 340, 260, 190, 120, 80, 52, 38, 28, 22, 17, 14],
      [0, 32, 100, 210, 340, 460, 570, 660, 730, 790, 840, 880],
    ),
    breakEvenMonth: 4, breakEvenLabel: 'Apr',
    payback: { paybackMonths: 3.2, year1ROI: 188, year2Projected: '€4.8M' },
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function formatDollars(n: number, symbol: string = '$'): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${symbol}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${symbol}${(abs / 1000).toFixed(0)}K`;
  return `${symbol}${abs.toLocaleString()}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateTimeline(stops: [TimelineStop, TimelineStop, TimelineStop], month: number): TimelineStop {
  const t = month / 12;
  if (t <= 0.5) {
    const segT = t / 0.5;
    return {
      savings: lerp(stops[0].savings, stops[1].savings, segT),
      score: lerp(stops[0].score, stops[1].score, segT),
      workflows: lerp(stops[0].workflows, stops[1].workflows, segT),
      waste: lerp(stops[0].waste, stops[1].waste, segT),
    };
  }
  const segT = (t - 0.5) / 0.5;
  return {
    savings: lerp(stops[1].savings, stops[2].savings, segT),
    score: lerp(stops[1].score, stops[2].score, segT),
    workflows: lerp(stops[1].workflows, stops[2].workflows, segT),
    waste: lerp(stops[1].waste, stops[2].waste, segT),
  };
}

function generateSparklineData(start: number, end: number, points: number = 8): { v: number }[] {
  const data: { v: number }[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = start + (end - start) * t;
    const noise = (Math.sin(i * 2.3) * 0.08 + Math.cos(i * 1.7) * 0.05) * Math.abs(end - start);
    data.push({ v: base + noise });
  }
  return data;
}

function scoreColor(score: number): string {
  if (score >= 70) return '#16A34A';
  if (score >= 50) return '#D97706';
  return '#DC2626';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-green-muted';
  if (score >= 50) return 'bg-amber-muted';
  return 'bg-red-muted';
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  Automated: { bg: 'bg-green-muted', text: 'text-green' },
  'In Progress': { bg: 'bg-amber-muted', text: 'text-amber' },
  Identified: { bg: 'bg-surface-sunken', text: 'text-ink-tertiary' },
};

/* ── Collapsible Section ─────────────────────────────────── */

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }: { title: string; icon: React.ElementType; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-8">
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

/* ── Sparkline component ─────────────────────────────────── */

function Sparkline({ data, color, width = 100, height = 36 }: { data: { v: number }[]; color: string; width?: number; height?: number }) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace('#', '')})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Custom Tooltip (cost curve) ─────────────────────────── */

function CostCurveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised border border-border rounded-lg shadow-lg px-4 py-3">
      <div className="text-[12px] font-semibold text-ink mb-2">{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-ink-secondary">{entry.name}</span>
          </div>
          <span className="font-mono font-semibold tabular-nums text-ink">
            {entry.value < 0 ? '-' : ''}${Math.abs(entry.value)}k
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function Analytics() {
  const { company, companies, setCompanyId } = useCompany();
  const data = analyticsData[company.id] || analyticsData.meridian;
  const curve = costCurveData[company.id] || costCurveData.meridian;

  const [timelineMonth, setTimelineMonth] = useState(12);
  const [showInaction, setShowInaction] = useState(false);

  const timelineValues = useMemo(
    () => interpolateTimeline(data.timeline, timelineMonth),
    [data.timeline, timelineMonth],
  );

  const savingsSparkline = useMemo(
    () => generateSparklineData(0, data.kpis.savings),
    [data],
  );
  const scoreSparkline = useMemo(
    () => generateSparklineData(data.kpis.scoreBefore, data.kpis.scoreAfter),
    [data.kpis.scoreBefore, data.kpis.scoreAfter],
  );
  const workflowSparkline = useMemo(
    () => generateSparklineData(0, data.kpis.workflows),
    [data.kpis.workflows],
  );
  const wasteSparkline = useMemo(
    () => generateSparklineData(data.kpis.waste, data.kpis.waste * 0.15),
    [data.kpis.waste],
  );

  const radialData = [
    { name: 'score', value: data.readiness.score, fill: scoreColor(data.readiness.score) },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Overview</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          AI readiness and transformation overview for {company.shortName}
        </p>
      </div>

      {/* ── Company Profile ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 bg-surface-raised border border-border rounded-xl px-6 py-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            company.category === 'conglomerate' ? 'bg-purple-500/15' :
            company.category === 'sovereign' ? 'bg-emerald-500/15' :
            'bg-blue-muted'
          }`}>
            <span className={`text-[14px] font-bold ${
              company.category === 'conglomerate' ? 'text-purple-400' :
              company.category === 'sovereign' ? 'text-emerald-400' :
              'text-blue'
            }`}>{company.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-semibold text-ink truncate">{company.name}</h2>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                company.category === 'conglomerate' ? 'bg-purple-500/10 text-purple-400' :
                company.category === 'sovereign' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-blue-muted text-blue'
              }`}>
                {company.category === 'sovereign' ? 'Sovereign' : company.category === 'conglomerate' ? 'Conglomerate' : 'Enterprise'}
              </span>
            </div>
            <p className="text-[12px] text-ink-tertiary mb-3">{company.tagline}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.industry}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.revenue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.employees.toLocaleString()} employees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-ink-faint" strokeWidth={1.5} />
                <span className="text-[12px] text-ink-secondary">{company.opCos} {company.category === 'sovereign' ? 'agencies' : company.category === 'conglomerate' ? 'operating companies' : company.opCos > 1 ? 'operating companies' : 'entity'}</span>
              </div>
            </div>
            {company.subEntities && company.subEntities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {company.subEntities.map((entity) => (
                  <span
                    key={entity}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      company.category === 'conglomerate' ? 'bg-purple-500/8 text-purple-400/80' :
                      'bg-emerald-500/8 text-emerald-400/80'
                    }`}
                  >
                    {entity}
                  </span>
                ))}
                {company.subEntities.length < company.opCos && (
                  <span className="text-[10px] text-ink-faint px-2 py-0.5">
                    +{company.opCos - company.subEntities.length} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Sub-Entity Breakdown (conglomerate/sovereign only) ── */}
      {companies.filter(c => c.parentId === company.id).length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink">
              {company.category === 'sovereign' ? 'Agencies' : 'Operating Companies'}
            </h2>
            <span className="text-[11px] text-ink-faint">
              {companies.filter(c => c.parentId === company.id).length} of {company.opCos} shown
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {companies.filter(c => c.parentId === company.id).map((sub, i) => {
              const subData = analyticsData[sub.id];
              const subCurve = costCurveData[sub.id];
              if (!subData || !subCurve) return null;
              return (
                <motion.button
                  key={sub.id}
                  type="button"
                  onClick={() => setCompanyId(sub.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="bg-surface-raised border border-border rounded-xl px-5 py-4 text-left hover:border-blue/30 hover:bg-blue/[0.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        company.category === 'conglomerate' ? 'bg-purple-500/15' : 'bg-emerald-500/15'
                      }`}>
                        <span className={`text-[11px] font-bold ${
                          company.category === 'conglomerate' ? 'text-purple-400' : 'text-emerald-400'
                        }`}>{sub.initials}</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-ink group-hover:text-blue transition-colors">{sub.shortName}</div>
                        <div className="text-[11px] text-ink-tertiary">{sub.industry}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-blue transition-colors mt-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Savings</div>
                      <div className="text-[15px] font-semibold tabular-nums text-green">{formatDollars(subData.kpis.savings, sub.currency)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Readiness</div>
                      <div className="text-[15px] font-semibold tabular-nums text-ink">
                        <span className="text-ink-tertiary text-[12px]">{subData.kpis.scoreBefore}</span>
                        <ChevronRight className="inline w-3 h-3 text-ink-faint mx-0.5" />
                        <span>{subData.kpis.scoreAfter}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-0.5">Workflows</div>
                      <div className="text-[15px] font-semibold tabular-nums text-ink">{subData.kpis.workflows}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                    <span className="text-[11px] text-ink-tertiary">{sub.employees.toLocaleString()} employees</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-[11px] text-ink-tertiary">{sub.revenue}</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-[11px] text-ink-tertiary">ROI {subCurve.payback.year1ROI}%</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── AI Readiness Score ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 bg-surface-raised border border-border rounded-xl px-6 py-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">AI Readiness Score</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Radial gauge */}
          <div className="relative w-[160px] h-[160px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="100%"
                startAngle={225}
                endAngle={-45}
                data={radialData}
                barSize={12}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: '#F4F4F5' }}
                  isAnimationActive
                  animationDuration={1200}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight text-ink leading-none">
                {data.readiness.score}
              </span>
              <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-1">
                / 100
              </span>
            </div>
          </div>
          {/* Label */}
          <div className="flex-1 text-center sm:text-left">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-2 ${scoreBg(data.readiness.score)}`}
              style={{ color: scoreColor(data.readiness.score) }}
            >
              <Sparkles className="w-3 h-3" />
              {data.readiness.score >= 70 ? 'Good' : data.readiness.score >= 50 ? 'Below Average' : 'Critical'}
            </div>
            <p className="text-[13px] text-ink-secondary leading-relaxed">
              {data.readiness.label}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Sparkline Cards ─────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Identified Savings */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-green-muted">
                    <DollarSign className="w-3.5 h-3.5 text-green" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Savings</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  {formatDollars(data.kpis.savings, company.currency)}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">identified to date</div>
              </div>
              <Sparkline data={savingsSparkline} color="#16A34A" />
            </div>
          </motion.div>

          {/* Tech Stack Score */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-blue-muted">
                    <Cpu className="w-3.5 h-3.5 text-blue" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Tech Stack</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  <span className="text-ink-tertiary text-[16px]">{data.kpis.scoreBefore}</span>
                  <ChevronRight className="inline w-4 h-4 text-ink-faint mx-0.5 -mt-0.5" />
                  <span>{data.kpis.scoreAfter}</span>
                </div>
                <div className="text-[11px] text-ink-faint mt-1">readiness score</div>
              </div>
              <Sparkline data={scoreSparkline} color="#2563EB" />
            </div>
          </motion.div>

          {/* Workflows Analyzed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-green-muted">
                    <Workflow className="w-3.5 h-3.5 text-green" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Workflows</span>
                </div>
                <div className="text-[22px] font-semibold text-ink tabular-nums tracking-tight leading-none mt-2">
                  {data.kpis.workflows}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">
                  <span className="text-green font-medium">{data.kpis.workflowsReady} ready</span> for automation
                </div>
              </div>
              <Sparkline data={workflowSparkline} color="#16A34A" />
            </div>
          </motion.div>

          {/* License Waste */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="bg-surface-raised border border-border rounded-xl px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-red-muted">
                    <Trash2 className="w-3.5 h-3.5 text-red" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">License Waste</span>
                </div>
                <div className="text-[22px] font-semibold text-red tabular-nums tracking-tight leading-none mt-2">
                  {formatDollars(data.kpis.waste, company.currency)}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">annual waste identified</div>
              </div>
              <Sparkline data={wasteSparkline} color="#DC2626" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Implementation Cost Curve (promoted from Assessment) ── */}
      <CollapsibleSection title="Implementation Cost Curve" icon={TrendingUp}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-5"
        >
          <div className="h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve.timeline} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradCostsOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradSavingsOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#A1A1AA' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E4E4E7' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#A1A1AA' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${Math.abs(v)}k`}
                  width={54}
                />
                <Tooltip content={<CostCurveTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#52525B' }}
                />
                <ReferenceLine
                  x={curve.breakEvenLabel}
                  stroke="#2563EB"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Break-even',
                    position: 'top',
                    fill: '#2563EB',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Implementation Costs"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fill="url(#gradCostsOverview)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="Cumulative Savings"
                  stroke="#16A34A"
                  strokeWidth={2}
                  fill="url(#gradSavingsOverview)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net Value"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  fill="none"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payback Analysis cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-muted rounded-xl p-5 mt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-blue-muted">
                  <Clock className="w-4 h-4 text-blue" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Payback Period</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-blue leading-none">
                {curve.payback.paybackMonths}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">months to break even</div>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <TrendingUp className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 1 ROI</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {curve.payback.year1ROI}%
              </div>
              <div className="text-[11px] text-ink-faint mt-1">return on investment</div>
            </div>
            <div className="bg-surface-raised border border-border rounded-xl px-5 py-5 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-1.5 rounded-lg bg-green-muted">
                  <DollarSign className="w-4 h-4 text-green" strokeWidth={1.7} />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 2 Projected</div>
              <div className="text-[28px] font-semibold tabular-nums tracking-tight text-green leading-none">
                {curve.payback.year2Projected}
              </div>
              <div className="text-[11px] text-ink-faint mt-1">cumulative savings</div>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* ── Transformation Timeline ────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Transformation Timeline</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-raised border border-border rounded-xl p-5"
        >
          {/* Slider */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Today</span>
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Month 6</span>
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Month 12</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={timelineMonth}
              onChange={(e) => setTimelineMonth(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-sunken cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-surface-raised [&::-webkit-slider-thumb]:shadow-sm
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-raised"
            />
            <div className="text-center mt-1">
              <span className="text-[12px] font-semibold text-blue tabular-nums">
                Month {timelineMonth % 1 === 0 ? timelineMonth : timelineMonth.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Interpolated values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-green tabular-nums tracking-tight">
                {formatDollars(timelineValues.savings, company.currency)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Savings</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-blue tabular-nums tracking-tight">
                {Math.round(timelineValues.score)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Tech Score</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-ink tabular-nums tracking-tight">
                {Math.round(timelineValues.workflows)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Workflows</div>
            </div>
            <div className="bg-surface-sunken rounded-lg px-3 py-3 text-center">
              <div className="text-[18px] font-semibold text-red tabular-nums tracking-tight">
                {formatDollars(timelineValues.waste, company.currency)}
              </div>
              <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider mt-0.5">Waste</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Top Opportunities Table ────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Table2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Top Opportunities</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-raised border border-border rounded-xl overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_100px_100px] sm:grid-cols-[48px_1fr_120px_120px] px-5 py-2.5 border-b border-border-subtle bg-surface-sunken">
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">#</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">Opportunity</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Est. Savings</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Status</span>
          </div>
          {/* Table rows */}
          {data.opportunities.map((opp, i) => {
            const style = statusStyles[opp.status];
            return (
              <motion.div
                key={opp.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className={`grid grid-cols-[40px_1fr_100px_100px] sm:grid-cols-[48px_1fr_120px_120px] px-5 py-3 items-center ${
                  i < data.opportunities.length - 1 ? 'border-b border-border-subtle' : ''
                }`}
              >
                <span className="text-[12px] font-semibold text-ink-tertiary tabular-nums">{opp.priority}</span>
                <span className="text-[13px] font-medium text-ink truncate pr-2">{opp.name}</span>
                <span className="text-[13px] font-semibold text-ink tabular-nums text-right">
                  {formatDollars(opp.savings, company.currency)}
                </span>
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
                  >
                    {opp.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Cost of Inaction Toggle ────────────────────────── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowInaction(!showInaction)}
            className="flex items-center gap-2 mb-3 group cursor-pointer"
          >
            {showInaction ? (
              <ToggleRight className="w-5 h-5 text-red" strokeWidth={1.7} />
            ) : (
              <ToggleLeft className="w-5 h-5 text-ink-tertiary" strokeWidth={1.7} />
            )}
            <AlertTriangle className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
            <h2 className="text-[14px] font-semibold text-ink group-hover:text-ink-secondary transition-colors">
              Cost of Inaction
            </h2>
            <span className="text-[11px] text-ink-faint ml-1">
              {showInaction ? 'Hide' : 'Show'} 3-year projection
            </span>
          </button>

          <AnimatePresence>
            {showInaction && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-red-muted border border-red/15 rounded-xl px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red" strokeWidth={1.7} />
                    <span className="text-[13px] font-semibold text-red">
                      Projected wasted spend without action
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 1</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year1, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 2</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year2, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised/60 rounded-lg px-4 py-3 text-center">
                      <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Year 3</div>
                      <div className="text-[20px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.year3, company.currency)}
                      </div>
                    </div>
                    <div className="bg-surface-raised rounded-lg px-4 py-3 text-center border border-red/10">
                      <div className="text-[10px] font-semibold text-red uppercase tracking-wider mb-1">3-Year Total</div>
                      <div className="text-[24px] font-semibold text-red tabular-nums tracking-tight">
                        {formatDollars(data.inaction.total, company.currency)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-red/70 mt-3 leading-relaxed">
                    Without AI transformation, {company.shortName} risks accumulating {formatDollars(data.inaction.total, company.currency)} in
                    preventable costs from license waste, manual process overhead, and missed automation opportunities over the
                    next three years.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
