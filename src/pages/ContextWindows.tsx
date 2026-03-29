import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  Clock,
  Users,
  Database,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Cpu,
  RefreshCw,
  Search,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';
import { useCompany } from '../data/CompanyContext';

/* ── Animation ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ── Helpers ──────────────────────────────────────────────── */

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

/* ── Pipeline log generator ──────────────────────────────── */

type OpType = 'PROCESS' | 'ENRICH' | 'MERGE' | 'REFRESH' | 'SCORE' | 'CLEAN' | 'MAP' | 'TOKEN';

interface LogEntry {
  ts: string;
  op: OpType;
  msg: string;
}

const opColors: Record<OpType, string> = {
  PROCESS: 'text-blue',
  ENRICH: 'text-green',
  MERGE: 'text-purple-400',
  REFRESH: 'text-cyan-400',
  SCORE: 'text-amber',
  CLEAN: 'text-red-400',
  MAP: 'text-ink-tertiary',
  TOKEN: 'text-yellow-400',
};

/* ── Company-specific log templates ───────────────────────── */

interface LogTemplate { op: OpType; msg: string }

function getLogTemplates(companyId: string): LogTemplate[] {
  const base: Record<string, LogTemplate[]> = {
    meridian: [
      { op: 'PROCESS', msg: `SAP work orders → normalized ${randomInt(400, 1200)} records (${randomInt(1, 8)} duplicates removed)` },
      { op: 'ENRICH', msg: `Added weather data to ${randomInt(8, 24)} track inspection contexts` },
      { op: 'MERGE', msg: `Cross-referenced Kronos certifications with ${randomInt(8, 22)} crew assignments` },
      { op: 'REFRESH', msg: `Updated ${randomInt(110, 145)} active context windows (avg freshness: ${(Math.random() * 2 + 1.5).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Relevance scoring complete for ${randomInt(2800, 4200).toLocaleString()} data points` },
      { op: 'CLEAN', msg: `Removed ${randomInt(12, 35)} stale records (>24h without update)` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(8, 20)} new Primavera fields to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(8, 18)} contexts (saved ${randomInt(5000, 12000).toLocaleString()} tokens)` },
      { op: 'PROCESS', msg: `FRA inspection data → normalized ${randomInt(30, 120)} records` },
      { op: 'ENRICH', msg: `Attached GPS coordinates to ${randomInt(40, 200)} equipment records` },
      { op: 'MERGE', msg: `Linked ${randomInt(5, 15)} P6 schedule updates to active work orders` },
      { op: 'REFRESH', msg: `Refreshed ${randomInt(30, 80)} safety context windows (avg freshness: ${(Math.random() * 1.5 + 0.8).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Priority re-ranked ${randomInt(50, 150)} defect records by severity` },
      { op: 'CLEAN', msg: `Archived ${randomInt(5, 20)} resolved defect records` },
      { op: 'MAP', msg: `Mapped ${randomInt(3, 12)} new PTC signal fields to telemetry schema` },
      { op: 'TOKEN', msg: `Context window trimming: ${randomInt(4, 10)} windows reduced to fit budget` },
    ],
    oakwood: [
      { op: 'PROCESS', msg: `Guidewire claims feed → normalized ${randomInt(300, 900)} records (${randomInt(2, 12)} duplicates removed)` },
      { op: 'ENRICH', msg: `Appended loss-run history to ${randomInt(20, 60)} open claims` },
      { op: 'MERGE', msg: `Cross-referenced Duck Creek policies with ${randomInt(15, 40)} active claims` },
      { op: 'REFRESH', msg: `Updated ${randomInt(80, 120)} adjuster context windows (avg freshness: ${(Math.random() * 2 + 1.2).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Fraud scoring complete for ${randomInt(400, 1200)} new claims` },
      { op: 'CLEAN', msg: `Archived ${randomInt(8, 25)} closed claims older than retention period` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(5, 15)} new Duck Creek fields to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(6, 14)} claims contexts (saved ${randomInt(4000, 10000).toLocaleString()} tokens)` },
      { op: 'PROCESS', msg: `Underwriting submissions → ingested ${randomInt(40, 120)} applications` },
      { op: 'ENRICH', msg: `Attached actuarial tables to ${randomInt(30, 80)} policy renewal contexts` },
      { op: 'MERGE', msg: `Linked ${randomInt(10, 30)} reinsurance treaties to coverage records` },
      { op: 'REFRESH', msg: `Refreshed ${randomInt(20, 60)} customer service context windows` },
      { op: 'SCORE', msg: `Risk-scored ${randomInt(50, 150)} new policy applications` },
      { op: 'CLEAN', msg: `Removed ${randomInt(5, 18)} stale quote records (>72h without activity)` },
      { op: 'MAP', msg: `Mapped ${randomInt(3, 10)} ACORD message fields to claims schema` },
      { op: 'TOKEN', msg: `Context window trimming: ${randomInt(3, 8)} windows reduced to fit budget` },
    ],
    pinnacle: [
      { op: 'PROCESS', msg: `Epic EHR feed → normalized ${randomInt(500, 1500)} patient records (${randomInt(3, 15)} duplicates merged)` },
      { op: 'ENRICH', msg: `Appended lab results to ${randomInt(30, 90)} active patient contexts` },
      { op: 'MERGE', msg: `Cross-referenced Athenahealth scheduling with ${randomInt(20, 50)} provider assignments` },
      { op: 'REFRESH', msg: `Updated ${randomInt(90, 140)} clinical context windows (avg freshness: ${(Math.random() * 1.5 + 0.8).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Acuity scoring complete for ${randomInt(200, 600)} patient encounters` },
      { op: 'CLEAN', msg: `Archived ${randomInt(10, 30)} discharged patient records to cold storage` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(5, 12)} new HL7 FHIR resources to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(8, 16)} clinical contexts (saved ${randomInt(6000, 14000).toLocaleString()} tokens)` },
      { op: 'PROCESS', msg: `Pharmacy dispensing logs → ingested ${randomInt(200, 600)} prescriptions` },
      { op: 'ENRICH', msg: `Attached formulary data to ${randomInt(40, 100)} medication orders` },
      { op: 'MERGE', msg: `Linked ${randomInt(15, 40)} billing codes to clinical documentation` },
      { op: 'REFRESH', msg: `Refreshed ${randomInt(30, 70)} admin context windows` },
      { op: 'SCORE', msg: `Compliance-scored ${randomInt(50, 150)} billing submissions for CMS rules` },
      { op: 'CLEAN', msg: `Removed ${randomInt(5, 15)} stale referral records (>30d without update)` },
      { op: 'MAP', msg: `Mapped ${randomInt(4, 10)} new ICD-11 codes to billing schema` },
      { op: 'TOKEN', msg: `Context window trimming: ${randomInt(5, 12)} windows reduced to fit budget` },
    ],
    atlas: [
      { op: 'PROCESS', msg: `SAP PP/PM feed → normalized ${randomInt(600, 1400)} production orders (${randomInt(2, 10)} duplicates removed)` },
      { op: 'ENRICH', msg: `Appended quality inspection results to ${randomInt(20, 60)} batch records` },
      { op: 'MERGE', msg: `Cross-referenced Siemens MES data with ${randomInt(15, 40)} work center schedules` },
      { op: 'REFRESH', msg: `Updated ${randomInt(100, 150)} shop-floor context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `OEE scoring complete for ${randomInt(30, 80)} production lines` },
      { op: 'CLEAN', msg: `Archived ${randomInt(8, 22)} completed production orders` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(5, 15)} new OPC-UA tags to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(6, 14)} manufacturing contexts (saved ${randomInt(5000, 11000).toLocaleString()} tokens)` },
      { op: 'PROCESS', msg: `PLC telemetry → ingested ${randomInt(8000, 20000).toLocaleString()} sensor readings` },
      { op: 'ENRICH', msg: `Attached SPC control limits to ${randomInt(40, 120)} quality check points` },
      { op: 'MERGE', msg: `Linked ${randomInt(10, 30)} maintenance tickets to equipment telemetry` },
      { op: 'REFRESH', msg: `Refreshed ${randomInt(30, 70)} supply chain context windows` },
      { op: 'SCORE', msg: `Predictive maintenance scored ${randomInt(50, 150)} assets by failure probability` },
      { op: 'CLEAN', msg: `Removed ${randomInt(5, 15)} stale inventory snapshots (>1h without update)` },
      { op: 'MAP', msg: `Mapped ${randomInt(3, 10)} new SCADA alarm codes to unified schema` },
      { op: 'TOKEN', msg: `Context window trimming: ${randomInt(4, 10)} windows reduced to fit budget` },
    ],
    northbridge: [
      { op: 'PROCESS', msg: `Cross-OpCo data feed → normalized ${randomInt(1200, 3000)} records (${randomInt(5, 20)} duplicates removed)` },
      { op: 'ENRICH', msg: `Appended market data to ${randomInt(30, 80)} portfolio contexts` },
      { op: 'MERGE', msg: `Cross-referenced ${randomInt(3, 8)} OpCo data streams into unified view` },
      { op: 'REFRESH', msg: `Updated ${randomInt(200, 350)} active context windows (avg freshness: ${(Math.random() * 2 + 1.5).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Risk scoring complete for ${randomInt(500, 1500)} enterprise data points` },
      { op: 'CLEAN', msg: `Archived ${randomInt(15, 40)} stale records across ${randomInt(2, 4)} OpCos` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(8, 25)} new fields across OpCo boundaries` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(10, 25)} contexts (saved ${randomInt(8000, 20000).toLocaleString()} tokens)` },
    ],
    'nb-aerospace': [
      { op: 'PROCESS', msg: `PLM feed → normalized ${randomInt(300, 800)} part records (${randomInt(2, 8)} duplicates removed)` },
      { op: 'ENRICH', msg: `Attached airworthiness directives to ${randomInt(10, 30)} component contexts` },
      { op: 'MERGE', msg: `Cross-referenced MRO logs with ${randomInt(15, 40)} flight-hours records` },
      { op: 'REFRESH', msg: `Updated ${randomInt(60, 100)} engineering context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Certification compliance scored for ${randomInt(100, 300)} assemblies` },
      { op: 'CLEAN', msg: `Archived ${randomInt(5, 15)} superseded engineering change orders` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(4, 12)} new AS9100 fields to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(5, 12)} flight-test contexts (saved ${randomInt(4000, 9000).toLocaleString()} tokens)` },
    ],
    'nb-energy': [
      { op: 'PROCESS', msg: `SCADA telemetry → normalized ${randomInt(5000, 15000).toLocaleString()} readings` },
      { op: 'ENRICH', msg: `Attached weather forecasts to ${randomInt(15, 40)} grid-section contexts` },
      { op: 'MERGE', msg: `Cross-referenced outage reports with ${randomInt(10, 30)} SCADA alarms` },
      { op: 'REFRESH', msg: `Updated ${randomInt(70, 120)} operations context windows (avg freshness: ${(Math.random() * 1.5 + 0.5).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Load-shedding risk scored for ${randomInt(20, 60)} substations` },
      { op: 'CLEAN', msg: `Archived ${randomInt(8, 20)} resolved outage tickets` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(5, 15)} new IEC 61850 data points` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(6, 14)} grid contexts (saved ${randomInt(5000, 12000).toLocaleString()} tokens)` },
    ],
    'nb-financial': [
      { op: 'PROCESS', msg: `Core banking feed → normalized ${randomInt(800, 2000)} transactions (${randomInt(3, 10)} flagged for review)` },
      { op: 'ENRICH', msg: `Appended KYC/AML data to ${randomInt(20, 50)} account contexts` },
      { op: 'MERGE', msg: `Cross-referenced regulatory filings with ${randomInt(10, 25)} compliance records` },
      { op: 'REFRESH', msg: `Updated ${randomInt(50, 90)} analyst context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `AML risk scoring complete for ${randomInt(200, 600)} transactions` },
      { op: 'CLEAN', msg: `Archived ${randomInt(10, 25)} expired regulatory submissions` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(4, 10)} new SWIFT message fields` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(5, 12)} compliance contexts (saved ${randomInt(4000, 9000).toLocaleString()} tokens)` },
    ],
    'nb-health': [
      { op: 'PROCESS', msg: `LIMS feed → normalized ${randomInt(400, 1000)} trial data records (${randomInt(2, 8)} anomalies flagged)` },
      { op: 'ENRICH', msg: `Attached adverse event reports to ${randomInt(15, 40)} compound contexts` },
      { op: 'MERGE', msg: `Cross-referenced GMP batch records with ${randomInt(10, 25)} QC results` },
      { op: 'REFRESH', msg: `Updated ${randomInt(60, 100)} R&D context windows (avg freshness: ${(Math.random() * 2 + 1.2).toFixed(1)} min)` },
      { op: 'SCORE', msg: `FDA submission readiness scored for ${randomInt(5, 15)} compounds` },
      { op: 'CLEAN', msg: `Archived ${randomInt(5, 15)} completed stability study records` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(4, 10)} new CDISC SDTM domains` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(6, 14)} trial contexts (saved ${randomInt(5000, 11000).toLocaleString()} tokens)` },
    ],
    estonia: [
      { op: 'PROCESS', msg: `X-Road data exchange → normalized ${randomInt(2000, 5000)} citizen records (${randomInt(5, 15)} duplicates merged)` },
      { op: 'ENRICH', msg: `Appended population registry data to ${randomInt(30, 80)} service contexts` },
      { op: 'MERGE', msg: `Cross-referenced ${randomInt(3, 8)} ministry databases via X-Road` },
      { op: 'REFRESH', msg: `Updated ${randomInt(150, 250)} gov-service context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Eligibility scoring complete for ${randomInt(500, 1500)} citizen requests` },
      { op: 'CLEAN', msg: `Archived ${randomInt(10, 30)} expired permit records` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(5, 15)} new e-Gov service fields to unified model` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(8, 20)} ministry contexts (saved ${randomInt(6000, 15000).toLocaleString()} tokens)` },
    ],
    'ee-finance': [
      { op: 'PROCESS', msg: `e-Tax feed → normalized ${randomInt(500, 1500)} tax declarations (${randomInt(3, 10)} anomalies flagged)` },
      { op: 'ENRICH', msg: `Appended business registry data to ${randomInt(20, 60)} audit contexts` },
      { op: 'MERGE', msg: `Cross-referenced customs declarations with ${randomInt(15, 40)} VAT records` },
      { op: 'REFRESH', msg: `Updated ${randomInt(40, 80)} fiscal context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Tax compliance scored for ${randomInt(200, 600)} business entities` },
      { op: 'CLEAN', msg: `Archived ${randomInt(8, 20)} completed audit records` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(3, 8)} new EU VAT directive fields` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(5, 12)} fiscal contexts (saved ${randomInt(4000, 9000).toLocaleString()} tokens)` },
    ],
    'ee-social': [
      { op: 'PROCESS', msg: `Health Insurance Fund feed → normalized ${randomInt(800, 2000)} claims (${randomInt(5, 15)} duplicates removed)` },
      { op: 'ENRICH', msg: `Appended e-Prescription data to ${randomInt(30, 70)} patient contexts` },
      { op: 'MERGE', msg: `Cross-referenced social benefits with ${randomInt(20, 50)} employment records` },
      { op: 'REFRESH', msg: `Updated ${randomInt(60, 100)} social worker context windows (avg freshness: ${(Math.random() * 2 + 1.0).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Benefits eligibility scored for ${randomInt(300, 800)} citizen applications` },
      { op: 'CLEAN', msg: `Archived ${randomInt(10, 25)} expired benefit period records` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(4, 10)} new EHIF claim fields` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(6, 14)} welfare contexts (saved ${randomInt(5000, 11000).toLocaleString()} tokens)` },
    ],
    'ee-economic': [
      { op: 'PROCESS', msg: `e-Residency portal → normalized ${randomInt(200, 600)} applications (${randomInt(2, 8)} flagged for review)` },
      { op: 'ENRICH', msg: `Appended trade statistics to ${randomInt(15, 40)} export permit contexts` },
      { op: 'MERGE', msg: `Cross-referenced business registry with ${randomInt(10, 30)} e-Residency records` },
      { op: 'REFRESH', msg: `Updated ${randomInt(40, 70)} trade context windows (avg freshness: ${(Math.random() * 2 + 1.2).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Application completeness scored for ${randomInt(100, 300)} e-Residency requests` },
      { op: 'CLEAN', msg: `Archived ${randomInt(5, 15)} expired trade permits` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(3, 8)} new EU single market data fields` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(4, 10)} economic contexts (saved ${randomInt(3000, 8000).toLocaleString()} tokens)` },
    ],
    'ee-ria': [
      { op: 'PROCESS', msg: `X-Road monitoring → normalized ${randomInt(1000, 3000)} service calls (${randomInt(3, 10)} anomalies detected)` },
      { op: 'ENRICH', msg: `Attached threat intelligence to ${randomInt(10, 30)} security contexts` },
      { op: 'MERGE', msg: `Cross-referenced CERT-EE alerts with ${randomInt(8, 20)} infrastructure logs` },
      { op: 'REFRESH', msg: `Updated ${randomInt(30, 60)} cybersecurity context windows (avg freshness: ${(Math.random() * 1 + 0.5).toFixed(1)} min)` },
      { op: 'SCORE', msg: `Threat scoring complete for ${randomInt(200, 500)} network events` },
      { op: 'CLEAN', msg: `Archived ${randomInt(5, 15)} resolved incident records` },
      { op: 'MAP', msg: `Schema mapped ${randomInt(3, 8)} new STIX/TAXII indicator fields` },
      { op: 'TOKEN', msg: `Budget optimization: compressed ${randomInt(4, 10)} SOC contexts (saved ${randomInt(3000, 8000).toLocaleString()} tokens)` },
    ],
  };

  // Map sub-entity IDs to their parent if no specific templates exist
  const resolved = base[companyId] || base['meridian'];
  return resolved;
}

function generateLogEntry(companyId: string): LogEntry {
  const templates = getLogTemplates(companyId);
  const pick = templates[Math.floor(Math.random() * templates.length)];
  return { ts: formatTime(new Date()), op: pick.op, msg: pick.msg };
}

/* ── Initial log entries ──────────────────────────────────── */

function generateInitialLogs(companyId: string): LogEntry[] {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now - (11 - i) * 7000);
    const entry = generateLogEntry(companyId);
    return { ...entry, ts: formatTime(d) };
  });
}

/* ── Division data ────────────────────────────────────────── */

interface DivisionRow {
  name: string;
  fullName: string;
  activeUsers: number;
  avgFreshness: number;
  completeness: number;
  queriesPerDay: number;
  successRate: number;
}

const companyDivisionData: Record<string, DivisionRow[]> = {
  meridian: [
    { name: 'HCC', fullName: 'IC Construction Corp', activeUsers: 432, avgFreshness: 2.1, completeness: 87, queriesPerDay: 1240, successRate: 99.4 },
    { name: 'HTSI', fullName: 'IC Transit Services', activeUsers: 202, avgFreshness: 1.8, completeness: 91, queriesPerDay: 680, successRate: 99.6 },
    { name: 'HTI', fullName: 'IC Technologies', activeUsers: 161, avgFreshness: 3.2, completeness: 82, queriesPerDay: 420, successRate: 98.8 },
    { name: 'HRSI', fullName: 'IC Rail Services', activeUsers: 129, avgFreshness: 2.4, completeness: 85, queriesPerDay: 340, successRate: 99.1 },
    { name: 'HSI', fullName: 'IC Services', activeUsers: 106, avgFreshness: 1.5, completeness: 94, queriesPerDay: 290, successRate: 99.7 },
    { name: 'HE', fullName: 'IC Energy', activeUsers: 34, avgFreshness: 4.7, completeness: 72, queriesPerDay: 89, successRate: 97.2 },
    { name: 'GG', fullName: 'IC Environmental', activeUsers: 20, avgFreshness: 5.1, completeness: 68, queriesPerDay: 45, successRate: 96.8 },
  ],
  hcc: [
    { name: 'HCC', fullName: 'IC Construction Corp', activeUsers: 432, avgFreshness: 2.1, completeness: 87, queriesPerDay: 1240, successRate: 99.4 },
  ],
  hrsi: [
    { name: 'HRSI', fullName: 'IC Rail Services', activeUsers: 129, avgFreshness: 2.4, completeness: 85, queriesPerDay: 340, successRate: 99.1 },
  ],
  hsi: [
    { name: 'HSI', fullName: 'IC Services', activeUsers: 106, avgFreshness: 1.5, completeness: 94, queriesPerDay: 290, successRate: 99.7 },
  ],
  hti: [
    { name: 'HTI', fullName: 'IC Technologies', activeUsers: 161, avgFreshness: 3.2, completeness: 82, queriesPerDay: 420, successRate: 98.8 },
  ],
  htsi: [
    { name: 'HTSI', fullName: 'IC Transit Services', activeUsers: 202, avgFreshness: 1.8, completeness: 91, queriesPerDay: 680, successRate: 99.6 },
  ],
  he: [
    { name: 'HE', fullName: 'IC Energy', activeUsers: 34, avgFreshness: 4.7, completeness: 72, queriesPerDay: 89, successRate: 97.2 },
  ],
  gg: [
    { name: 'GG', fullName: 'IC Environmental', activeUsers: 20, avgFreshness: 5.1, completeness: 68, queriesPerDay: 45, successRate: 96.8 },
  ],
  oakwood: [
    { name: 'Claims', fullName: 'Claims Processing', activeUsers: 285, avgFreshness: 1.9, completeness: 89, queriesPerDay: 980, successRate: 99.3 },
    { name: 'UW', fullName: 'Underwriting', activeUsers: 142, avgFreshness: 2.3, completeness: 86, queriesPerDay: 520, successRate: 99.1 },
    { name: 'Policy', fullName: 'Policy Administration', activeUsers: 198, avgFreshness: 1.6, completeness: 92, queriesPerDay: 740, successRate: 99.5 },
    { name: 'CustSvc', fullName: 'Customer Service', activeUsers: 175, avgFreshness: 1.4, completeness: 94, queriesPerDay: 1120, successRate: 99.7 },
  ],
  pinnacle: [
    { name: 'Clinical', fullName: 'Clinical Operations', activeUsers: 148, avgFreshness: 1.2, completeness: 91, queriesPerDay: 860, successRate: 99.6 },
    { name: 'Admin', fullName: 'Administration', activeUsers: 92, avgFreshness: 2.5, completeness: 84, queriesPerDay: 340, successRate: 99.0 },
    { name: 'Billing', fullName: 'Billing & Revenue Cycle', activeUsers: 78, avgFreshness: 2.1, completeness: 88, queriesPerDay: 420, successRate: 99.2 },
    { name: 'Pharmacy', fullName: 'Pharmacy Services', activeUsers: 62, avgFreshness: 1.0, completeness: 96, queriesPerDay: 290, successRate: 99.8 },
  ],
  atlas: [
    { name: 'Precision', fullName: 'Atlas Precision Parts', activeUsers: 210, avgFreshness: 1.8, completeness: 88, queriesPerDay: 780, successRate: 99.3 },
    { name: 'Advanced', fullName: 'Atlas Advanced Materials', activeUsers: 185, avgFreshness: 2.2, completeness: 85, queriesPerDay: 620, successRate: 99.1 },
    { name: 'Assembly', fullName: 'Atlas Assembly Systems', activeUsers: 240, avgFreshness: 1.5, completeness: 91, queriesPerDay: 940, successRate: 99.5 },
    { name: 'Logistics', fullName: 'Atlas Logistics & Supply', activeUsers: 165, avgFreshness: 2.8, completeness: 82, queriesPerDay: 510, successRate: 98.9 },
  ],
  northbridge: [
    { name: 'Aerospace', fullName: 'Northbridge Aerospace', activeUsers: 820, avgFreshness: 2.0, completeness: 89, queriesPerDay: 2400, successRate: 99.4 },
    { name: 'Energy', fullName: 'Northbridge Energy', activeUsers: 1150, avgFreshness: 1.4, completeness: 92, queriesPerDay: 3200, successRate: 99.6 },
    { name: 'Financial', fullName: 'Northbridge Financial', activeUsers: 620, avgFreshness: 1.8, completeness: 94, queriesPerDay: 1800, successRate: 99.7 },
    { name: 'Health Sci', fullName: 'Northbridge Health Sciences', activeUsers: 1610, avgFreshness: 2.5, completeness: 86, queriesPerDay: 4100, successRate: 99.2 },
  ],
  'nb-aerospace': [
    { name: 'Engineering', fullName: 'Design & Engineering', activeUsers: 310, avgFreshness: 2.1, completeness: 88, queriesPerDay: 920, successRate: 99.3 },
    { name: 'MRO', fullName: 'Maintenance, Repair & Overhaul', activeUsers: 245, avgFreshness: 1.6, completeness: 91, queriesPerDay: 780, successRate: 99.5 },
    { name: 'Supply', fullName: 'Supply Chain & Procurement', activeUsers: 165, avgFreshness: 2.8, completeness: 84, queriesPerDay: 440, successRate: 99.0 },
    { name: 'Quality', fullName: 'Quality & Compliance', activeUsers: 100, avgFreshness: 1.3, completeness: 95, queriesPerDay: 260, successRate: 99.8 },
  ],
  'nb-energy': [
    { name: 'Grid Ops', fullName: 'Grid Operations', activeUsers: 420, avgFreshness: 0.8, completeness: 93, queriesPerDay: 1400, successRate: 99.7 },
    { name: 'Generation', fullName: 'Power Generation', activeUsers: 310, avgFreshness: 1.2, completeness: 90, queriesPerDay: 860, successRate: 99.4 },
    { name: 'T&D', fullName: 'Transmission & Distribution', activeUsers: 280, avgFreshness: 1.5, completeness: 88, queriesPerDay: 620, successRate: 99.2 },
    { name: 'Regulatory', fullName: 'Regulatory & Compliance', activeUsers: 140, avgFreshness: 2.4, completeness: 95, queriesPerDay: 320, successRate: 99.8 },
  ],
  'nb-financial': [
    { name: 'Trading', fullName: 'Trading & Markets', activeUsers: 185, avgFreshness: 0.6, completeness: 96, queriesPerDay: 1200, successRate: 99.8 },
    { name: 'Risk', fullName: 'Risk Management', activeUsers: 140, avgFreshness: 1.4, completeness: 93, queriesPerDay: 680, successRate: 99.6 },
    { name: 'Compliance', fullName: 'Regulatory Compliance', activeUsers: 120, avgFreshness: 2.0, completeness: 95, queriesPerDay: 420, successRate: 99.7 },
    { name: 'Ops', fullName: 'Operations & Settlement', activeUsers: 175, avgFreshness: 1.1, completeness: 91, queriesPerDay: 540, successRate: 99.4 },
  ],
  'nb-health': [
    { name: 'R&D', fullName: 'Research & Development', activeUsers: 480, avgFreshness: 2.8, completeness: 84, queriesPerDay: 1200, successRate: 99.1 },
    { name: 'Clinical', fullName: 'Clinical Trials', activeUsers: 620, avgFreshness: 2.0, completeness: 88, queriesPerDay: 1800, successRate: 99.4 },
    { name: 'Mfg QA', fullName: 'Manufacturing Quality', activeUsers: 310, avgFreshness: 1.4, completeness: 93, queriesPerDay: 720, successRate: 99.7 },
    { name: 'Regulatory', fullName: 'Regulatory Affairs', activeUsers: 200, avgFreshness: 2.2, completeness: 91, queriesPerDay: 380, successRate: 99.5 },
  ],
  estonia: [
    { name: 'Finance', fullName: 'Ministry of Finance', activeUsers: 420, avgFreshness: 1.8, completeness: 91, queriesPerDay: 1200, successRate: 99.5 },
    { name: 'Social', fullName: 'Ministry of Social Affairs', activeUsers: 840, avgFreshness: 1.5, completeness: 89, queriesPerDay: 2400, successRate: 99.3 },
    { name: 'Economic', fullName: 'Ministry of Economic Affairs', activeUsers: 520, avgFreshness: 2.2, completeness: 86, queriesPerDay: 1400, successRate: 99.1 },
    { name: 'RIA', fullName: 'Information System Authority', activeUsers: 48, avgFreshness: 0.8, completeness: 97, queriesPerDay: 320, successRate: 99.9 },
  ],
  'ee-finance': [
    { name: 'Tax', fullName: 'Tax & Revenue Administration', activeUsers: 180, avgFreshness: 1.6, completeness: 93, queriesPerDay: 540, successRate: 99.6 },
    { name: 'Budget', fullName: 'Budget & Fiscal Policy', activeUsers: 95, avgFreshness: 2.4, completeness: 88, queriesPerDay: 280, successRate: 99.3 },
    { name: 'Customs', fullName: 'Customs & Excise', activeUsers: 85, avgFreshness: 1.9, completeness: 90, queriesPerDay: 240, successRate: 99.4 },
    { name: 'Audit', fullName: 'State Audit Office', activeUsers: 60, avgFreshness: 3.1, completeness: 85, queriesPerDay: 140, successRate: 99.1 },
  ],
  'ee-social': [
    { name: 'Health', fullName: 'Health Insurance Fund', activeUsers: 320, avgFreshness: 1.2, completeness: 91, queriesPerDay: 980, successRate: 99.5 },
    { name: 'Benefits', fullName: 'Social Benefits', activeUsers: 240, avgFreshness: 1.8, completeness: 88, queriesPerDay: 720, successRate: 99.2 },
    { name: 'Labor', fullName: 'Labor Inspectorate', activeUsers: 160, avgFreshness: 2.5, completeness: 84, queriesPerDay: 420, successRate: 99.0 },
    { name: 'Child', fullName: 'Child Welfare', activeUsers: 120, avgFreshness: 2.0, completeness: 90, queriesPerDay: 280, successRate: 99.4 },
  ],
  'ee-economic': [
    { name: 'e-Residency', fullName: 'e-Residency Program', activeUsers: 180, avgFreshness: 2.0, completeness: 89, queriesPerDay: 520, successRate: 99.3 },
    { name: 'Trade', fullName: 'Trade & Export', activeUsers: 140, avgFreshness: 2.4, completeness: 86, queriesPerDay: 380, successRate: 99.1 },
    { name: 'Innovation', fullName: 'Innovation & Startups', activeUsers: 110, avgFreshness: 2.8, completeness: 83, queriesPerDay: 300, successRate: 98.9 },
    { name: 'Digital', fullName: 'Digital Economy', activeUsers: 90, avgFreshness: 1.6, completeness: 92, queriesPerDay: 200, successRate: 99.6 },
  ],
  'ee-ria': [
    { name: 'X-Road', fullName: 'X-Road Infrastructure', activeUsers: 15, avgFreshness: 0.5, completeness: 98, queriesPerDay: 120, successRate: 99.9 },
    { name: 'Cyber', fullName: 'Cybersecurity (CERT-EE)', activeUsers: 12, avgFreshness: 0.3, completeness: 97, queriesPerDay: 80, successRate: 99.8 },
    { name: 'eID', fullName: 'eID & Digital Signing', activeUsers: 11, avgFreshness: 0.8, completeness: 96, queriesPerDay: 70, successRate: 99.7 },
    { name: 'Gov Cloud', fullName: 'Government Cloud', activeUsers: 10, avgFreshness: 0.6, completeness: 95, queriesPerDay: 50, successRate: 99.9 },
  ],
};

/* ── Query type chart data ────────────────────────────────── */

interface QueryType {
  label: string;
  pct: number;
  color: string;
}

const companyQueryTypes: Record<string, QueryType[]> = {
  meridian: [
    { label: 'Project status inquiries', pct: 34, color: 'bg-blue' },
    { label: 'Compliance / inspection lookups', pct: 22, color: 'bg-green' },
    { label: 'Resource availability', pct: 18, color: 'bg-purple-400' },
    { label: 'Cost analysis', pct: 14, color: 'bg-amber' },
    { label: 'Safety reporting', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 4, color: 'bg-ink-tertiary' },
  ],
  oakwood: [
    { label: 'Claims status & history', pct: 32, color: 'bg-blue' },
    { label: 'Policy coverage lookups', pct: 24, color: 'bg-green' },
    { label: 'Underwriting guidelines', pct: 16, color: 'bg-purple-400' },
    { label: 'Fraud indicator checks', pct: 12, color: 'bg-amber' },
    { label: 'Regulatory compliance', pct: 10, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  pinnacle: [
    { label: 'Patient record lookups', pct: 30, color: 'bg-blue' },
    { label: 'Clinical decision support', pct: 22, color: 'bg-green' },
    { label: 'Scheduling & availability', pct: 18, color: 'bg-purple-400' },
    { label: 'Billing & coding queries', pct: 14, color: 'bg-amber' },
    { label: 'Medication management', pct: 10, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  atlas: [
    { label: 'Production order status', pct: 28, color: 'bg-blue' },
    { label: 'Quality & inspection data', pct: 24, color: 'bg-green' },
    { label: 'Equipment maintenance', pct: 18, color: 'bg-purple-400' },
    { label: 'Supply chain & inventory', pct: 16, color: 'bg-amber' },
    { label: 'Safety & compliance', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  northbridge: [
    { label: 'Cross-OpCo analytics', pct: 26, color: 'bg-blue' },
    { label: 'Regulatory compliance', pct: 22, color: 'bg-green' },
    { label: 'Risk assessment', pct: 20, color: 'bg-purple-400' },
    { label: 'Portfolio performance', pct: 16, color: 'bg-amber' },
    { label: 'Operational efficiency', pct: 10, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'nb-aerospace': [
    { label: 'Part certification status', pct: 30, color: 'bg-blue' },
    { label: 'Airworthiness compliance', pct: 24, color: 'bg-green' },
    { label: 'MRO scheduling', pct: 18, color: 'bg-purple-400' },
    { label: 'Supply chain tracking', pct: 14, color: 'bg-amber' },
    { label: 'Flight test data', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'nb-energy': [
    { label: 'Grid status & load', pct: 32, color: 'bg-blue' },
    { label: 'Outage management', pct: 22, color: 'bg-green' },
    { label: 'Generation dispatch', pct: 18, color: 'bg-purple-400' },
    { label: 'Regulatory filings', pct: 14, color: 'bg-amber' },
    { label: 'Asset maintenance', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'nb-financial': [
    { label: 'Transaction monitoring', pct: 28, color: 'bg-blue' },
    { label: 'Regulatory reporting', pct: 24, color: 'bg-green' },
    { label: 'Risk analytics', pct: 20, color: 'bg-purple-400' },
    { label: 'Client portfolio queries', pct: 14, color: 'bg-amber' },
    { label: 'AML/KYC checks', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'nb-health': [
    { label: 'Trial data queries', pct: 28, color: 'bg-blue' },
    { label: 'FDA submission status', pct: 22, color: 'bg-green' },
    { label: 'Manufacturing QA', pct: 20, color: 'bg-purple-400' },
    { label: 'Adverse event reports', pct: 14, color: 'bg-amber' },
    { label: 'Compound pipeline', pct: 10, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  estonia: [
    { label: 'Citizen service requests', pct: 30, color: 'bg-blue' },
    { label: 'Cross-ministry data queries', pct: 22, color: 'bg-green' },
    { label: 'Eligibility verification', pct: 18, color: 'bg-purple-400' },
    { label: 'Compliance & audit', pct: 14, color: 'bg-amber' },
    { label: 'Infrastructure monitoring', pct: 10, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'ee-finance': [
    { label: 'Tax declaration processing', pct: 32, color: 'bg-blue' },
    { label: 'Budget analysis', pct: 22, color: 'bg-green' },
    { label: 'Customs clearance', pct: 18, color: 'bg-purple-400' },
    { label: 'Audit trail lookups', pct: 14, color: 'bg-amber' },
    { label: 'EU fiscal compliance', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'ee-social': [
    { label: 'Benefits eligibility', pct: 30, color: 'bg-blue' },
    { label: 'Health insurance claims', pct: 24, color: 'bg-green' },
    { label: 'Employment records', pct: 18, color: 'bg-purple-400' },
    { label: 'Child welfare cases', pct: 14, color: 'bg-amber' },
    { label: 'Labor inspections', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'ee-economic': [
    { label: 'e-Residency applications', pct: 28, color: 'bg-blue' },
    { label: 'Trade & export permits', pct: 24, color: 'bg-green' },
    { label: 'Startup registrations', pct: 18, color: 'bg-purple-400' },
    { label: 'EU market compliance', pct: 16, color: 'bg-amber' },
    { label: 'Innovation grants', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
  'ee-ria': [
    { label: 'X-Road service monitoring', pct: 30, color: 'bg-blue' },
    { label: 'Cyber threat analysis', pct: 24, color: 'bg-green' },
    { label: 'eID infrastructure', pct: 18, color: 'bg-purple-400' },
    { label: 'Gov cloud status', pct: 14, color: 'bg-amber' },
    { label: 'Incident response', pct: 8, color: 'bg-red-400' },
    { label: 'Other', pct: 6, color: 'bg-ink-tertiary' },
  ],
};

/* ── Pipeline stages ──────────────────────────────────────── */

interface PipelineStage {
  title: string;
  items: string[];
  stat: string;
}

const companyPipelineStages: Record<string, PipelineStage[]> = {
  meridian: [
    { title: 'SOURCE DATA', items: ['SAP Work Orders', 'P6 Schedules', 'GPS Feeds', 'Kronos', 'FRA Data', 'PTC Logs'], stat: '47 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Dedup & merge', 'Enrich w/ metadata', 'Schema map to unified model'], stat: '2.4M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '1,084 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  oakwood: [
    { title: 'SOURCE DATA', items: ['Guidewire ClaimCenter', 'Duck Creek Policy', 'ACORD Messages', 'Loss-Run Reports', 'Actuarial Tables', 'Fraud Detection DB'], stat: '32 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Dedup & merge', 'Enrich w/ loss history', 'Schema map to unified model'], stat: '1.8M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '800 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  pinnacle: [
    { title: 'SOURCE DATA', items: ['Epic EHR', 'Athenahealth', 'HL7 FHIR Feeds', 'e-Prescribing', 'Lab Systems', 'Revenue Cycle'], stat: '28 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Patient dedup', 'Enrich w/ clinical data', 'FHIR resource mapping'], stat: '3.1M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'HIPAA compliance layer', 'Token budget mgmt', 'Freshness guarantee'], stat: '420 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  atlas: [
    { title: 'SOURCE DATA', items: ['SAP PP/PM', 'Siemens MES', 'OPC-UA Telemetry', 'PLC/SCADA', 'QMS Database', 'Warehouse Mgmt'], stat: '52 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Dedup & merge', 'Enrich w/ SPC data', 'OPC-UA tag mapping'], stat: '4.2M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '1,340 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  northbridge: [
    { title: 'SOURCE DATA', items: ['PLM Systems', 'SCADA/EMS', 'Core Banking', 'LIMS', 'ERP Feeds', 'Regulatory DBs'], stat: '184 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Cross-OpCo dedup', 'Enrich w/ metadata', 'Multi-schema mapping'], stat: '18.4M records' },
    { title: 'CONTEXT ENGINE', items: ['OpCo-level filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '4,200 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'nb-aerospace': [
    { title: 'SOURCE DATA', items: ['Teamcenter PLM', 'MRO Systems', 'Flight Test DB', 'Supply Chain', 'AS9100 QMS', 'ITAR Compliance'], stat: '38 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Part number dedup', 'Enrich w/ cert data', 'PLM schema mapping'], stat: '3.8M records' },
    { title: 'CONTEXT ENGINE', items: ['Clearance-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '820 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'nb-energy': [
    { title: 'SOURCE DATA', items: ['SCADA/EMS', 'Weather Feeds', 'Outage Mgmt', 'AMI Meters', 'GIS Systems', 'NERC CIP Logs'], stat: '56 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Dedup & merge', 'Enrich w/ weather', 'IEC 61850 mapping'], stat: '6.2M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '1,150 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'nb-financial': [
    { title: 'SOURCE DATA', items: ['Core Banking', 'SWIFT/FIX Feeds', 'KYC/AML Systems', 'Market Data', 'Risk Engines', 'Regulatory DBs'], stat: '42 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Transaction dedup', 'Enrich w/ KYC data', 'SWIFT message mapping'], stat: '5.4M records' },
    { title: 'CONTEXT ENGINE', items: ['Need-to-know filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '620 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'nb-health': [
    { title: 'SOURCE DATA', items: ['LIMS', 'CTMS', 'GMP Batch Records', 'Adverse Events DB', 'FDA eCTD', 'Stability Studies'], stat: '48 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Compound dedup', 'Enrich w/ trial data', 'CDISC SDTM mapping'], stat: '4.8M records' },
    { title: 'CONTEXT ENGINE', items: ['Study-level filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '1,010 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  estonia: [
    { title: 'SOURCE DATA', items: ['X-Road Services', 'Population Registry', 'e-Tax Portal', 'Health Insurance Fund', 'Business Registry', 'eID Infrastructure'], stat: '124 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Citizen dedup', 'Enrich w/ registry data', 'X-Road schema mapping'], stat: '12.8M records' },
    { title: 'CONTEXT ENGINE', items: ['Ministry-level filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '2,800 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'ee-finance': [
    { title: 'SOURCE DATA', items: ['e-Tax System', 'Customs DB', 'Business Registry', 'Budget System', 'EU Fiscal Reports', 'State Audit DB'], stat: '24 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Entity dedup', 'Enrich w/ registry data', 'EU VAT schema mapping'], stat: '2.4M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '420 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'ee-social': [
    { title: 'SOURCE DATA', items: ['Health Insurance Fund', 'e-Prescription', 'Social Benefits DB', 'Employment Registry', 'Child Welfare DB', 'Labor Inspectorate'], stat: '32 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Citizen dedup', 'Enrich w/ benefits data', 'EHIF schema mapping'], stat: '4.2M records' },
    { title: 'CONTEXT ENGINE', items: ['Caseworker filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '840 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'ee-economic': [
    { title: 'SOURCE DATA', items: ['e-Residency Portal', 'Business Registry', 'Trade Statistics', 'EU Market Data', 'Innovation Grants DB', 'Startup Registry'], stat: '18 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Entity dedup', 'Enrich w/ trade data', 'EU single market mapping'], stat: '1.6M records' },
    { title: 'CONTEXT ENGINE', items: ['Role-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '340 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
  'ee-ria': [
    { title: 'SOURCE DATA', items: ['X-Road Monitoring', 'CERT-EE Feeds', 'eID Systems', 'Gov Cloud Logs', 'DNS/BGP Monitors', 'Threat Intel Feeds'], stat: '22 systems' },
    { title: 'DATA PROCESSING', items: ['Clean & normalize', 'Event dedup', 'Enrich w/ threat intel', 'STIX/TAXII mapping'], stat: '8.4M records' },
    { title: 'CONTEXT ENGINE', items: ['Clearance-based filtering', 'Relevance scoring', 'Token budget mgmt', 'Freshness guarantee'], stat: '180 windows' },
    { title: 'USER\'S AI TOOLS', items: ['Queries answered', 'Right context served', 'Accurate responses', 'Updated in real-time'], stat: 'LIVE_USERS' },
  ],
};

/* ── Context example data ─────────────────────────────────── */

interface ContextExample {
  id: string;
  user: string;
  role: string;
  division: string;
  query: string;
  contextTree: string;
  aiResponse: string;
  quality: string;
  sources: number;
  updated: string;
  tokensUsed: number;
  tokenBudget: number;
}

const companyContextExamples: Record<string, ContextExample[]> = {
  meridian: [
    {
      id: 'track-inspector',
      user: 'Sarah Chen',
      role: 'Track Inspector',
      division: 'HSI Division',
      query: 'What\'s the defect history for MP 247?',
      contextTree: `\u251C\u2500\u2500 Track Classification: FRA Class 4, BNSF Mainline
\u251C\u2500\u2500 Last 12 Inspections (MP 245-250):
\u2502   \u251C\u2500\u2500 2026-03-18: Surface 2.1" (exceeds 2.0" limit)
\u2502   \u251C\u2500\u2500 2026-02-22: Surface 1.8" (within spec)
\u2502   \u251C\u2500\u2500 2026-01-15: Surface 1.6" (within spec)
\u2502   \u2514\u2500\u2500 ... 9 more
\u251C\u2500\u2500 Active Defects in Range:
\u2502   \u251C\u2500\u2500 Cracked joint bar @ MP 249.1 (reported 3/22)
\u2502   \u251C\u2500\u2500 Fouled ballast MP 248.5-248.8 (reported 3/22)
\u2502   \u2514\u2500\u2500 4 defective ties near MP 248.2 (reported 3/22)
\u251C\u2500\u2500 Weather Data: 2.3" rain last 7 days (impacts drainage)
\u251C\u2500\u2500 Traffic Density: 28 trains/day, 45 MGT annual
\u251C\u2500\u2500 Maintenance History: Last surfacing 2024-08-14
\u2514\u2500\u2500 FRA Standards Reference: Part 213 Class 4 limits`,
      aiResponse: `MP 247 shows an accelerating surface degradation trend. Three inspections show 1.6" \u2192 1.8" \u2192 2.1" over 90 days. At this rate, you'll exceed emergency limits within 3 weeks. Combined with the fouled ballast at MP 248.5 and recent heavy rainfall, I recommend prioritizing this section for surfacing. There's also an open cracked joint bar at MP 249.1 that needs attention within 30 days per FRA \u00a7213.121.`,
      quality: '96%',
      sources: 12,
      updated: '3 min ago',
      tokensUsed: 4247,
      tokenBudget: 8192,
    },
    {
      id: 'project-manager',
      user: 'Mike Torres',
      role: 'Senior PM',
      division: 'HCC Division',
      query: 'How are we tracking on the I-70 bridge project?',
      contextTree: `\u251C\u2500\u2500 Project: I-70 Bridge Rehabilitation (WO-2025-08834)
\u251C\u2500\u2500 Budget: $3.1M approved | $2.14M spent (69%)
\u251C\u2500\u2500 Schedule: Day 127 of 180 (71% elapsed)
\u2502   \u251C\u2500\u2500 Critical Path: Bearing installation (12 days remaining)
\u2502   \u251C\u2500\u2500 3 tasks behind schedule (total 8 day slip)
\u2502   \u2514\u2500\u2500 Weather delays: 5 days lost in February
\u251C\u2500\u2500 Resources:
\u2502   \u251C\u2500\u2500 14 crew assigned (12 active today)
\u2502   \u251C\u2500\u2500 Equipment: 2 cranes, 1 concrete pump on-site
\u2502   \u2514\u2500\u2500 Subcontractors: 3 active (steel, electrical, painting)
\u251C\u2500\u2500 Financials:
\u2502   \u251C\u2500\u2500 Materials: $1.2M spent / $1.4M budgeted (86%)
\u2502   \u251C\u2500\u2500 Labor: $680K spent / $900K budgeted (76%)
\u2502   \u251C\u2500\u2500 Equipment: $180K spent / $200K budgeted (90%)
\u2502   \u2514\u2500\u2500 Contingency: $120K remaining of $300K
\u251C\u2500\u2500 Risk Register: 2 active risks (material delays, weather)
\u251C\u2500\u2500 Change Orders: 2 approved (+$180K), 1 pending ($45K)
\u2514\u2500\u2500 Comparable Projects: 3 similar bridges (avg. 12% over budget)`,
      aiResponse: `I-70 bridge is tracking at 69% budget consumed vs 71% schedule elapsed \u2014 slightly ahead on spend. However, the 8-day schedule slip on critical path tasks puts the August 15 deadline at risk. Your contingency is at $120K with one pending change order for $45K. Based on comparable projects, you're within the typical variance range, but I'd recommend requesting the bearing shipment be expedited \u2014 that's your critical path constraint.`,
      quality: '91%',
      sources: 8,
      updated: '7 min ago',
      tokensUsed: 3891,
      tokenBudget: 8192,
    },
    {
      id: 'safety-officer',
      user: 'Jennifer Walsh',
      role: 'Safety Director',
      division: 'IndustrialsCo',
      query: 'Are we FRA compliant across all divisions?',
      contextTree: `\u251C\u2500\u2500 FRA Inspection Status (all divisions):
\u2502   \u251C\u2500\u2500 HCC: 47 inspections current, 2 overdue (MP 247, MP 312)
\u2502   \u251C\u2500\u2500 HRSI: 23 inspections current, 0 overdue
\u2502   \u251C\u2500\u2500 HSI: 89 inspections current, 1 overdue (car #4421)
\u2502   \u251C\u2500\u2500 HTI: 34 signal inspections current, 0 overdue
\u2502   \u251C\u2500\u2500 HTSI: 156 inspections current, 3 overdue
\u2502   \u2514\u2500\u2500 Total: 349 current, 6 overdue (98.3% compliant)
\u251C\u2500\u2500 Open Defects by Severity:
\u2502   \u251C\u2500\u2500 Critical: 2 (cracked joint bar MP 249.1, signal fault Zone 8)
\u2502   \u251C\u2500\u2500 Moderate: 14
\u2502   \u2514\u2500\u2500 Minor: 47
\u251C\u2500\u2500 Hours of Service Violations (last 30 days): 0
\u251C\u2500\u2500 Drug & Alcohol Testing: 100% compliant, last random: 3/20
\u251C\u2500\u2500 Certification Expirations (next 30 days):
\u2502   \u251C\u2500\u2500 3 locomotive engineers (renewal scheduled)
\u2502   \u2514\u2500\u2500 1 signal maintainer (URGENT \u2014 expires 4/2)
\u2514\u2500\u2500 FRA Audit History: Last audit 2025-11-14 (passed, 2 findings resolved)`,
      aiResponse: `Overall FRA compliance is at 98.3% with 6 overdue inspections across 3 divisions. Two critical items need immediate attention: the cracked joint bar at MP 249.1 (HCC) and signal fault in Zone 8 (HTI). Most urgent non-inspection item: a signal maintainer certification expiring April 2 \u2014 that's 7 days away. I've flagged this to HR for emergency renewal processing.`,
      quality: '99%',
      sources: 23,
      updated: '1 min ago',
      tokensUsed: 5102,
      tokenBudget: 8192,
    },
  ],
  oakwood: [
    {
      id: 'claims-adjuster',
      user: 'David Park',
      role: 'Senior Claims Adjuster',
      division: 'Claims Dept',
      query: 'What\'s the history on claim #CLM-2026-04821?',
      contextTree: `\u251C\u2500\u2500 Claim: CLM-2026-04821 (Auto Collision)
\u251C\u2500\u2500 Policy: POL-8847201 | Coverage: Comp + Collision ($500 ded)
\u251C\u2500\u2500 Insured: Martinez, Elena | Policy since 2019
\u2502   \u251C\u2500\u2500 Prior claims: 1 (minor fender-bender, 2022, $2,400)
\u2502   \u2514\u2500\u2500 Payment history: 100% on-time, no lapses
\u251C\u2500\u2500 Loss Details:
\u2502   \u251C\u2500\u2500 Date of loss: 2026-03-22, 14:35
\u2502   \u251C\u2500\u2500 Location: I-95 & Exit 42, Stamford CT
\u2502   \u251C\u2500\u2500 Description: Rear-end collision, 3 vehicles
\u2502   \u2514\u2500\u2500 Police report: Filed (#SPD-26-08841)
\u251C\u2500\u2500 Damage Assessment:
\u2502   \u251C\u2500\u2500 Vehicle: 2024 Honda Accord, est. repair $8,400
\u2502   \u251C\u2500\u2500 Bodily injury: Claimant reports neck strain
\u2502   \u2514\u2500\u2500 Subrogation potential: At-fault 3rd party identified
\u251C\u2500\u2500 Fraud Indicators: Score 12/100 (low risk)
\u2514\u2500\u2500 Comparable Claims: 14 similar (avg payout: $9,200)`,
      aiResponse: `Claim CLM-2026-04821 is straightforward. Martinez has a clean history with one minor prior claim. The damage estimate of $8,400 is within range of comparable claims (avg $9,200). Fraud score is low at 12/100. Key action items: (1) confirm police report details, (2) schedule independent appraisal given the BI component, and (3) initiate subrogation against the at-fault third party. Recommend fast-tracking the property damage portion while the BI develops.`,
      quality: '94%',
      sources: 9,
      updated: '4 min ago',
      tokensUsed: 3840,
      tokenBudget: 8192,
    },
    {
      id: 'underwriter',
      user: 'Rachel Kim',
      role: 'Underwriting Manager',
      division: 'Underwriting Dept',
      query: 'Should we renew the Westfield Manufacturing account?',
      contextTree: `\u251C\u2500\u2500 Account: Westfield Manufacturing Inc.
\u251C\u2500\u2500 Current Premium: $284K (Workers Comp + GL + Property)
\u251C\u2500\u2500 Loss History (5 years):
\u2502   \u251C\u2500\u2500 2025: $42K (2 WC claims, 1 GL)
\u2502   \u251C\u2500\u2500 2024: $18K (1 WC claim)
\u2502   \u251C\u2500\u2500 2023: $156K (1 large GL claim \u2014 settled)
\u2502   \u251C\u2500\u2500 2022: $8K (1 minor WC)
\u2502   \u2514\u2500\u2500 2021: $0
\u251C\u2500\u2500 Loss Ratio: 31.6% (5yr) | Target: <55%
\u251C\u2500\u2500 Industry Benchmark: Mfg sector avg 48%
\u251C\u2500\u2500 Exposure Changes:
\u2502   \u251C\u2500\u2500 Revenue up 12% YoY
\u2502   \u251C\u2500\u2500 Added 2nd shift (45 new employees)
\u2502   \u2514\u2500\u2500 New CNC equipment installed
\u2514\u2500\u2500 Market Conditions: Rate hardening +6-8% in mfg GL`,
      aiResponse: `Westfield is a strong renewal. Their 5-year loss ratio of 31.6% is well below our 55% target and outperforms the manufacturing sector average of 48%. The 2023 GL spike was a one-off that's fully resolved. With their revenue growth and 2nd shift addition, I'd recommend a premium increase of 8-10% ($307K-$313K) to account for the expanded exposure and market hardening. The new CNC equipment may warrant a mid-term property endorsement review.`,
      quality: '92%',
      sources: 11,
      updated: '6 min ago',
      tokensUsed: 4120,
      tokenBudget: 8192,
    },
    {
      id: 'customer-service',
      user: 'Marcus Johnson',
      role: 'Customer Service Lead',
      division: 'Customer Service Dept',
      query: 'What coverage does the Thompson family have for their water damage?',
      contextTree: `\u251C\u2500\u2500 Policyholder: Thompson, James & Sarah
\u251C\u2500\u2500 Policy: HO-3 Homeowners (POL-6623401)
\u2502   \u251C\u2500\u2500 Dwelling: $425,000 | Personal Property: $212,500
\u2502   \u251C\u2500\u2500 Deductible: $1,000
\u2502   \u251C\u2500\u2500 Endorsements: Water backup ($10K), Scheduled jewelry
\u2502   \u2514\u2500\u2500 Exclusions: Standard flood exclusion
\u251C\u2500\u2500 Reported Incident:
\u2502   \u251C\u2500\u2500 Type: Burst pipe in upstairs bathroom
\u2502   \u251C\u2500\u2500 Date: 2026-03-27, discovered 08:15
\u2502   \u2514\u2500\u2500 Preliminary damage: Flooring, drywall, personal items
\u251C\u2500\u2500 Coverage Analysis:
\u2502   \u251C\u2500\u2500 Sudden/accidental water damage: COVERED under HO-3
\u2502   \u251C\u2500\u2500 Water backup endorsement: Applies if backup involved
\u2502   \u2514\u2500\u2500 Mold remediation: Covered up to $10K per incident
\u2514\u2500\u2500 Preferred Vendors: 3 approved restoration companies in ZIP`,
      aiResponse: `Good news for the Thompsons \u2014 their burst pipe damage is covered under their HO-3 policy as sudden and accidental water damage. They have a $1,000 deductible. Their water backup endorsement adds an extra $10K if backup is involved. I'd recommend dispatching ServiceMaster (our preferred vendor in their ZIP) for emergency mitigation today, and scheduling the adjuster within 48 hours. Alert them that mold remediation coverage caps at $10K, so quick mitigation is important.`,
      quality: '97%',
      sources: 7,
      updated: '2 min ago',
      tokensUsed: 3520,
      tokenBudget: 8192,
    },
  ],
  pinnacle: [
    {
      id: 'physician',
      user: 'Dr. Amanda Foster',
      role: 'Attending Physician',
      division: 'Clinical Dept',
      query: 'What\'s the complete picture on patient #PT-44821?',
      contextTree: `\u251C\u2500\u2500 Patient: PT-44821 | DOB: 1958-09-14 | Female
\u251C\u2500\u2500 Active Diagnoses:
\u2502   \u251C\u2500\u2500 Type 2 Diabetes (E11.65) \u2014 since 2018
\u2502   \u251C\u2500\u2500 Hypertension (I10) \u2014 since 2015
\u2502   \u2514\u2500\u2500 CKD Stage 3a (N18.31) \u2014 diagnosed 2025
\u251C\u2500\u2500 Recent Labs (2026-03-24):
\u2502   \u251C\u2500\u2500 HbA1c: 8.2% (target <7.0%, up from 7.4%)
\u2502   \u251C\u2500\u2500 eGFR: 52 mL/min (stable from 54)
\u2502   \u251C\u2500\u2500 Creatinine: 1.28 mg/dL
\u2502   \u2514\u2500\u2500 Potassium: 4.8 mEq/L (watch \u2014 near upper limit)
\u251C\u2500\u2500 Current Medications:
\u2502   \u251C\u2500\u2500 Metformin 1000mg BID
\u2502   \u251C\u2500\u2500 Lisinopril 20mg daily
\u2502   \u251C\u2500\u2500 Atorvastatin 40mg daily
\u2502   \u2514\u2500\u2500 Amlodipine 5mg daily
\u251C\u2500\u2500 Allergies: Sulfa drugs (rash), Penicillin (anaphylaxis)
\u251C\u2500\u2500 Last Visit: 2026-02-10 (routine follow-up)
\u2514\u2500\u2500 Clinical Guidelines: ADA Standards of Care 2026, KDIGO CKD`,
      aiResponse: `PT-44821's HbA1c has risen to 8.2% from 7.4%, indicating worsening glycemic control. With CKD Stage 3a (eGFR 52), Metformin is still appropriate but monitor closely below eGFR 45. Consider adding an SGLT2 inhibitor (e.g., empagliflozin) \u2014 it offers dual benefit for both diabetes and CKD progression per KDIGO guidelines. Note the potassium at 4.8: if adding an SGLT2i, recheck K+ in 2 weeks. Avoid sulfonylureas given her sulfa allergy history. Schedule follow-up in 6 weeks with repeat labs.`,
      quality: '98%',
      sources: 14,
      updated: '2 min ago',
      tokensUsed: 4680,
      tokenBudget: 8192,
    },
    {
      id: 'billing-specialist',
      user: 'Kevin O\'Brien',
      role: 'Revenue Cycle Analyst',
      division: 'Billing Dept',
      query: 'Why was the cardiology claim denied for patient visit 03/18?',
      contextTree: `\u251C\u2500\u2500 Claim: CL-2026-18842 | Payer: BlueCross BlueShield
\u251C\u2500\u2500 Service Date: 2026-03-18 | Provider: Dr. Patel
\u251C\u2500\u2500 Procedures Billed:
\u2502   \u251C\u2500\u2500 93306 (TTE w/ Doppler) \u2014 $1,240
\u2502   \u251C\u2500\u2500 99214 (E&M Level 4) \u2014 $185
\u2502   \u2514\u2500\u2500 93018 (ECG interpretation) \u2014 $42
\u251C\u2500\u2500 Denial Details:
\u2502   \u251C\u2500\u2500 Code: CO-197 (Precertification not obtained)
\u2502   \u251C\u2500\u2500 Denied amount: $1,240 (TTE only)
\u2502   \u2514\u2500\u2500 E&M and ECG: Paid normally
\u251C\u2500\u2500 Auth History:
\u2502   \u251C\u2500\u2500 Prior auth request: Not found in system
\u2502   \u2514\u2500\u2500 BCBS requirement: TTE requires prior auth >$500
\u251C\u2500\u2500 Appeal Window: 90 days (expires 2026-06-16)
\u2514\u2500\u2500 Similar Denials: 4 TTE denials this month (pattern)`,
      aiResponse: `The denial is for missing prior authorization on the TTE (93306). BCBS requires precert for imaging over $500. The good news: you have until June 16 to appeal. I'd recommend a retrospective auth request \u2014 BCBS grants these in ~60% of cases when clinical documentation supports medical necessity. More importantly, this is the 4th TTE denial this month. There may be a workflow gap in the scheduling system where cardiology orders aren't triggering the auth queue. I'd flag this to the practice manager for a process fix.`,
      quality: '95%',
      sources: 8,
      updated: '5 min ago',
      tokensUsed: 3740,
      tokenBudget: 8192,
    },
    {
      id: 'pharmacist',
      user: 'Lisa Nguyen',
      role: 'Clinical Pharmacist',
      division: 'Pharmacy Dept',
      query: 'Any drug interactions for the new antibiotic order on bed 4B-12?',
      contextTree: `\u251C\u2500\u2500 Patient: Bed 4B-12 | PT-51203 | Male, 72y
\u251C\u2500\u2500 New Order: Ciprofloxacin 500mg PO BID x 10 days
\u2502   \u2514\u2500\u2500 Indication: UTI (E. coli, per C&S)
\u251C\u2500\u2500 Current Medications:
\u2502   \u251C\u2500\u2500 Warfarin 5mg daily (INR target 2.0-3.0)
\u2502   \u251C\u2500\u2500 Metoprolol 50mg BID
\u2502   \u251C\u2500\u2500 Tizanidine 4mg TID (for back spasms)
\u2502   \u2514\u2500\u2500 Calcium carbonate 500mg TID
\u251C\u2500\u2500 Interaction Alerts:
\u2502   \u251C\u2500\u2500 SEVERE: Cipro + Tizanidine = contraindicated (5x \u2191 tizanidine levels)
\u2502   \u251C\u2500\u2500 MAJOR: Cipro + Warfarin = INR elevation risk
\u2502   \u2514\u2500\u2500 MODERATE: Cipro + Calcium = reduced absorption (space 2h)
\u251C\u2500\u2500 Recent INR: 2.4 (2026-03-26) \u2014 therapeutic
\u251C\u2500\u2500 Renal Function: eGFR 58, CrCl 62 mL/min
\u2514\u2500\u2500 Formulary Alternatives: Levofloxacin, Nitrofurantoin, TMP-SMX`,
      aiResponse: `STOP \u2014 critical interaction. Ciprofloxacin is contraindicated with tizanidine (CYP1A2 inhibition causes 5-fold increase in tizanidine levels, risk of severe hypotension). Recommend switching to levofloxacin 500mg daily, which avoids the tizanidine interaction. Still monitor Warfarin closely \u2014 all fluoroquinolones can elevate INR. Suggest checking INR in 3-5 days. Dose is appropriate for eGFR 58. Space calcium doses 2 hours before or 6 hours after any fluoroquinolone.`,
      quality: '99%',
      sources: 10,
      updated: '1 min ago',
      tokensUsed: 4100,
      tokenBudget: 8192,
    },
  ],
  atlas: [
    {
      id: 'plant-manager',
      user: 'Tom Richardson',
      role: 'Plant Manager',
      division: 'Atlas Precision Parts',
      query: 'What\'s the OEE status for Line 4 this shift?',
      contextTree: `\u251C\u2500\u2500 Production Line: Line 4 \u2014 CNC Machining Center
\u251C\u2500\u2500 Current Shift: Day (06:00-14:00) | Supervisor: J. Martinez
\u251C\u2500\u2500 OEE Breakdown:
\u2502   \u251C\u2500\u2500 Availability: 88.2% (target 92%)
\u2502   \u2502   \u2514\u2500\u2500 Downtime: 42 min (tool change 28 min, material wait 14 min)
\u2502   \u251C\u2500\u2500 Performance: 94.1% (target 95%)
\u2502   \u2502   \u2514\u2500\u2500 Cycle time: 48s actual vs 45s ideal
\u2502   \u2514\u2500\u2500 Quality: 99.2% (target 99.5%)
\u2502       \u2514\u2500\u2500 Rejects: 4 of 480 parts (surface finish out-of-spec)
\u251C\u2500\u2500 OEE Composite: 82.3% (target 87%)
\u251C\u2500\u2500 SAP Production Order: PO-2026-11847 | Part: AX-7742
\u251C\u2500\u2500 Siemens MES Alerts:
\u2502   \u251C\u2500\u2500 Tool wear sensor: Spindle 2 at 78% life (change due in ~120 parts)
\u2502   \u2514\u2500\u2500 Coolant temp: 22.4\u00b0C (nominal)
\u2514\u2500\u2500 Comparable Shifts: Last 5 day shifts avg OEE 85.1%`,
      aiResponse: `Line 4 OEE is at 82.3%, about 5 points below target. The main drag is availability at 88.2% \u2014 you lost 42 minutes to a tool change (28 min) and material wait (14 min). The material wait suggests a staging issue; check if the feeder buffer is properly loaded for the next batch. Quality is slightly off at 99.2% \u2014 4 rejects on surface finish. Given the Spindle 2 tool wear is at 78%, that may be contributing to the finish issue. I'd recommend scheduling the tool change during the next planned break to avoid an unplanned stop.`,
      quality: '93%',
      sources: 11,
      updated: '4 min ago',
      tokensUsed: 4350,
      tokenBudget: 8192,
    },
    {
      id: 'quality-engineer',
      user: 'Priya Sharma',
      role: 'Quality Engineer',
      division: 'Atlas Advanced Materials',
      query: 'Show me the SPC trend for the composites batch CMP-0891',
      contextTree: `\u251C\u2500\u2500 Batch: CMP-0891 | Material: Carbon Fiber Composite Panel
\u251C\u2500\u2500 SPC Control Chart (Tensile Strength):
\u2502   \u251C\u2500\u2500 UCL: 2,420 MPa | CL: 2,350 MPa | LCL: 2,280 MPa
\u2502   \u251C\u2500\u2500 Last 20 samples: 2,345, 2,338, 2,331, 2,324, 2,318...
\u2502   \u251C\u2500\u2500 Trend: 7 consecutive points declining (Rule 3 violation)
\u2502   \u2514\u2500\u2500 Cp: 1.22 | Cpk: 0.98 (below 1.33 target)
\u251C\u2500\u2500 Process Variables:
\u2502   \u251C\u2500\u2500 Cure temp: 177.2\u00b0C (spec: 177 \u00b1 2\u00b0C) \u2014 OK
\u2502   \u251C\u2500\u2500 Humidity: 48% (spec: <50%) \u2014 marginal
\u2502   \u2514\u2500\u2500 Resin batch: RB-4421 (new supplier lot)
\u251C\u2500\u2500 Related NCRs: 0 open for this material
\u2514\u2500\u2500 Customer Spec: AS-9102 First Article, min 2,300 MPa`,
      aiResponse: `The SPC chart shows a clear downward trend \u2014 7 consecutive declining points is a Western Electric Rule 3 violation, indicating a systematic shift. The Cpk has dropped to 0.98, below your 1.33 target. Two likely causes: (1) the new resin batch RB-4421 from the alternate supplier may have different cure characteristics, and (2) humidity is at 48%, right at the edge of spec. I'd recommend holding the batch for additional testing, pulling a sample from the previous resin lot for comparison, and reducing cleanroom humidity to <42% as a precaution.`,
      quality: '96%',
      sources: 9,
      updated: '3 min ago',
      tokensUsed: 4180,
      tokenBudget: 8192,
    },
    {
      id: 'supply-chain',
      user: 'Carlos Mendez',
      role: 'Supply Chain Director',
      division: 'Atlas Logistics & Supply',
      query: 'Are we at risk of any line stoppages this week?',
      contextTree: `\u251C\u2500\u2500 Critical Material Status:
\u2502   \u251C\u2500\u2500 Aluminum 6061-T6: 3.2 days stock (min: 5 days) \u2014 ALERT
\u2502   \u251C\u2500\u2500 Steel AISI 4140: 8.1 days stock \u2014 OK
\u2502   \u251C\u2500\u2500 Carbon Fiber Prepreg: 6.4 days stock \u2014 OK
\u2502   \u2514\u2500\u2500 Titanium Ti-6Al-4V: 4.8 days stock (min: 5 days) \u2014 WATCH
\u251C\u2500\u2500 Inbound Shipments:
\u2502   \u251C\u2500\u2500 Aluminum (PO-8847): ETA 03/31, 12 tons (3-day delay from supplier)
\u2502   \u251C\u2500\u2500 Titanium (PO-8901): ETA 04/01, 2 tons (on schedule)
\u2502   \u2514\u2500\u2500 Fasteners (PO-8912): ETA 03/30, standard replenishment
\u251C\u2500\u2500 Production Schedule Impact:
\u2502   \u251C\u2500\u2500 Line 2 (Aluminum): At risk if PO-8847 delayed further
\u2502   \u2514\u2500\u2500 Line 7 (Titanium): Marginal, no buffer for delays
\u2514\u2500\u2500 Supplier Alternatives: 2 qualified aluminum suppliers, 1 titanium`,
      aiResponse: `You have one high-risk situation: aluminum stock is at 3.2 days against a 5-day minimum, and PO-8847 is already 3 days late. If it slips past March 31, Line 2 stops by April 2. I'd recommend activating your alternate aluminum supplier for an emergency 4-ton order today \u2014 that buys 2 extra days of buffer. Titanium is also marginal at 4.8 days, but PO-8901 is on schedule for April 1, so that should be fine unless it slips. No other materials are at risk this week.`,
      quality: '94%',
      sources: 12,
      updated: '5 min ago',
      tokensUsed: 4020,
      tokenBudget: 8192,
    },
  ],
  northbridge: [
    {
      id: 'coo',
      user: 'Margaret Chen',
      role: 'Group COO',
      division: 'Northbridge HQ',
      query: 'How are the OpCos performing on AI adoption this quarter?',
      contextTree: `\u251C\u2500\u2500 Q1 2026 AI Adoption Scorecard:
\u2502   \u251C\u2500\u2500 NB Aerospace: 78% adoption (target 75%) \u2014 ON TRACK
\u2502   \u251C\u2500\u2500 NB Energy: 84% adoption (target 80%) \u2014 AHEAD
\u2502   \u251C\u2500\u2500 NB Financial: 91% adoption (target 85%) \u2014 LEADING
\u2502   \u2514\u2500\u2500 NB Health Sciences: 62% adoption (target 70%) \u2014 BEHIND
\u251C\u2500\u2500 Value Generated (Q1):
\u2502   \u251C\u2500\u2500 Aerospace: $4.2M savings (MRO optimization)
\u2502   \u251C\u2500\u2500 Energy: $6.8M savings (grid optimization)
\u2502   \u251C\u2500\u2500 Financial: $3.1M savings (compliance automation)
\u2502   \u2514\u2500\u2500 Health Sciences: $2.4M savings (trial data processing)
\u251C\u2500\u2500 Total Enterprise Value: $16.5M (Q1 target: $14M)
\u251C\u2500\u2500 Top Blockers:
\u2502   \u251C\u2500\u2500 Health Sciences: GxP validation requirements slowing rollout
\u2502   \u2514\u2500\u2500 Aerospace: ITAR restrictions on data sharing with AI systems
\u2514\u2500\u2500 Cross-OpCo Synergies: 3 shared AI models deployed`,
      aiResponse: `Overall, the enterprise is ahead of target \u2014 $16.5M vs the $14M Q1 plan. Three of four OpCos are on track. Health Sciences is the concern at 62% vs 70% target \u2014 GxP validation is the bottleneck. I'd recommend allocating the shared validation framework from Financial (which cleared similar regulatory hurdles) to accelerate Health Sciences. The ITAR restriction in Aerospace is manageable with the FedRAMP-approved deployment model we implemented in February. Net: strong quarter, one OpCo needs a focused intervention.`,
      quality: '95%',
      sources: 18,
      updated: '3 min ago',
      tokensUsed: 4580,
      tokenBudget: 8192,
    },
    {
      id: 'risk-officer',
      user: 'James Sullivan',
      role: 'Chief Risk Officer',
      division: 'NB Financial',
      query: 'What\'s our regulatory exposure across the portfolio?',
      contextTree: `\u251C\u2500\u2500 Regulatory Compliance Dashboard:
\u2502   \u251C\u2500\u2500 SEC Filings: 100% current (last: 10-K filed 2/28)
\u2502   \u251C\u2500\u2500 AML/BSA: 99.7% transaction monitoring coverage
\u2502   \u251C\u2500\u2500 Dodd-Frank Stress Test: Passed (March 15, adequate capital)
\u2502   \u2514\u2500\u2500 GDPR/Data Privacy: 2 open remediation items
\u251C\u2500\u2500 Open Regulatory Matters:
\u2502   \u251C\u2500\u2500 OCC Consent Order (2024): 8 of 12 items remediated
\u2502   \u251C\u2500\u2500 FINRA Examination: Scheduled April 14-18
\u2502   \u2514\u2500\u2500 State AG Inquiry (CT): Information request, low risk
\u251C\u2500\u2500 Key Risk Metrics:
\u2502   \u251C\u2500\u2500 VaR (95%): $42M (limit: $50M)
\u2502   \u251C\u2500\u2500 Tier 1 Capital Ratio: 12.8% (min: 8%)
\u2502   \u2514\u2500\u2500 Liquidity Coverage Ratio: 142% (min: 100%)
\u2514\u2500\u2500 Upcoming Deadlines: FINRA exam prep (14 days), OCC remediation items 9-10 (April 30)`,
      aiResponse: `Your regulatory posture is solid overall. Capital and liquidity are well above minimums. Two areas need attention: (1) the FINRA examination in 14 days \u2014 ensure the trading desk documentation and communications review are complete by April 10; and (2) the OCC consent order has 4 remaining items with 2 due April 30. The GDPR remediation items are lower priority but should be closed before the next EU supervisory review. The CT AG inquiry looks routine \u2014 recommend responding within the 30-day window with standard information.`,
      quality: '97%',
      sources: 15,
      updated: '2 min ago',
      tokensUsed: 4890,
      tokenBudget: 8192,
    },
  ],
  'nb-aerospace': [
    {
      id: 'aero-engineer',
      user: 'Dr. Karen Wright',
      role: 'Chief Engineer',
      division: 'NB Aerospace',
      query: 'What\'s the certification status for the wing spar redesign?',
      contextTree: `\u251C\u2500\u2500 Program: Next-Gen Wing Spar (NWS-2026)
\u251C\u2500\u2500 FAA Certification Path: Amended Type Certificate (ATC)
\u2502   \u251C\u2500\u2500 DER Review: Complete (Feb 28)
\u2502   \u251C\u2500\u2500 Stress Analysis: 14 of 16 load cases passed
\u2502   \u251C\u2500\u2500 Fatigue & Damage Tolerance: In progress (68%)
\u2502   \u2514\u2500\u2500 Flight Test Plan: Submitted, awaiting FAA approval
\u251C\u2500\u2500 Open Items:
\u2502   \u251C\u2500\u2500 Load Case 11 (gust + maneuver): Margin 0.8% (target >5%)
\u2502   \u251C\u2500\u2500 Load Case 14 (fatigue spectrum): Analysis pending
\u2502   \u2514\u2500\u2500 Material equivalency: Toray T800 qualification ongoing
\u251C\u2500\u2500 Supply Chain: 2 of 3 qualified suppliers ready
\u2514\u2500\u2500 Schedule: Target EIS Q3 2027, currently 2 weeks behind`,
      aiResponse: `The wing spar certification is 68% complete but has a potential showstopper: Load Case 11 shows only 0.8% margin against the 5% minimum. You'll need either a design revision to the spar cap layup or additional analysis to justify a reduced margin via probabilistic methods. The Toray T800 material qualification is also on the critical path \u2014 if it slips, consider the approved Hexcel IM7 as a backup. I'd recommend escalating Load Case 11 to the DER this week to get guidance before investing more analysis hours.`,
      quality: '96%',
      sources: 13,
      updated: '3 min ago',
      tokensUsed: 4420,
      tokenBudget: 8192,
    },
  ],
  'nb-energy': [
    {
      id: 'grid-operator',
      user: 'Paul Anderson',
      role: 'Grid Operations Manager',
      division: 'NB Energy',
      query: 'What\'s the grid stability outlook for tonight\'s cold front?',
      contextTree: `\u251C\u2500\u2500 Weather Forecast: Cold front arrival 22:00, temp drop to -8\u00b0C
\u251C\u2500\u2500 Load Forecast:
\u2502   \u251C\u2500\u2500 Current: 14.2 GW | Peak tonight: 18.8 GW (est.)
\u2502   \u251C\u2500\u2500 Available capacity: 21.4 GW
\u2502   \u2514\u2500\u2500 Reserve margin: 13.8% (min: 10%)
\u251C\u2500\u2500 Generation Status:
\u2502   \u251C\u2500\u2500 Gas turbines: 8 of 10 online (Unit 6 maintenance, Unit 9 startup)
\u2502   \u251C\u2500\u2500 Wind: Currently 3.2 GW, forecast drop to 1.1 GW by midnight
\u2502   \u2514\u2500\u2500 Solar: 0 GW after sunset (17:45)
\u251C\u2500\u2500 Transmission Constraints:
\u2502   \u251C\u2500\u2500 North-South corridor: 92% loaded
\u2502   \u2514\u2500\u2500 Line 345-A: Derated 15% due to ice loading risk
\u2514\u2500\u2500 NERC Alerts: Winter Weather Advisory issued for region`,
      aiResponse: `Tonight's outlook is manageable but tight. Peak demand of 18.8 GW against 21.4 GW capacity gives you 13.8% reserve, but that assumes Unit 9 starts on time and wind only drops to 1.1 GW. If wind drops further or Unit 9 delays, reserves could fall below 10%. I'd recommend: (1) expedite Unit 9 startup to before 20:00, (2) pre-position demand response resources for activation at 22:00, and (3) coordinate with the neighbor BA for 500 MW emergency interchange if needed. The N-S corridor at 92% is your transmission bottleneck \u2014 monitor ice loading on 345-A closely.`,
      quality: '97%',
      sources: 16,
      updated: '2 min ago',
      tokensUsed: 4740,
      tokenBudget: 8192,
    },
  ],
  'nb-financial': [
    {
      id: 'compliance-analyst',
      user: 'Sarah Mitchell',
      role: 'Compliance Analyst',
      division: 'NB Financial',
      query: 'Any suspicious activity flagged in the last 24 hours?',
      contextTree: `\u251C\u2500\u2500 SAR Queue (last 24h):
\u2502   \u251C\u2500\u2500 Total alerts: 847 | Escalated: 23 | SAR-worthy: 4
\u251C\u2500\u2500 High-Priority Cases:
\u2502   \u251C\u2500\u2500 Case #SAR-4421: Structuring pattern ($9,800 x 3 deposits)
\u2502   \u251C\u2500\u2500 Case #SAR-4422: Unusual wire activity (Cayman \u2192 shell co)
\u2502   \u251C\u2500\u2500 Case #SAR-4423: PEP-linked transaction (Nigeria, $240K)
\u2502   \u2514\u2500\u2500 Case #SAR-4424: Rapid movement (deposit \u2192 crypto exchange, 2h)
\u251C\u2500\u2500 Model Performance:
\u2502   \u251C\u2500\u2500 False positive rate: 96.2% (industry avg: 95%)
\u2502   \u251C\u2500\u2500 Detection rate: 99.1% (per last FinCEN review)
\u2502   \u2514\u2500\u2500 Avg review time: 12 min (down from 28 min pre-AI)
\u2514\u2500\u2500 Filing Deadlines: SAR-4421 due within 30 days of detection`,
      aiResponse: `Four cases need attention. SAR-4421 is the most clear-cut \u2014 three $9,800 deposits in 48 hours is textbook structuring. Recommend filing within the week. SAR-4422 (Cayman wire) needs enhanced due diligence on the receiving entity; check beneficial ownership via our KYC database. SAR-4423 (PEP-linked) requires a PEP screening update \u2014 the Nigerian connection triggers additional OFAC review. SAR-4424 is interesting \u2014 the deposit-to-crypto pattern in 2 hours suggests potential layering. Overall, model performance is solid with review times down 57% from pre-AI.`,
      quality: '98%',
      sources: 12,
      updated: '1 min ago',
      tokensUsed: 4560,
      tokenBudget: 8192,
    },
  ],
  'nb-health': [
    {
      id: 'clinical-director',
      user: 'Dr. Robert Chang',
      role: 'Clinical Trial Director',
      division: 'NB Health Sciences',
      query: 'What\'s the enrollment status for the Phase III oncology trial?',
      contextTree: `\u251C\u2500\u2500 Trial: NBH-ONC-301 | Phase III | Solid Tumors
\u251C\u2500\u2500 Enrollment:
\u2502   \u251C\u2500\u2500 Target: 480 patients | Enrolled: 312 (65%)
\u2502   \u251C\u2500\u2500 Rate: 18 patients/week (need 22/week to hit deadline)
\u2502   \u2514\u2500\u2500 Screen failures: 24% (industry avg: 30%)
\u251C\u2500\u2500 Site Performance (top 5 of 28 sites):
\u2502   \u251C\u2500\u2500 Memorial Sloan Kettering: 42 enrolled (highest)
\u2502   \u251C\u2500\u2500 MD Anderson: 38 enrolled
\u2502   \u251C\u2500\u2500 Dana-Farber: 31 enrolled
\u2502   \u251C\u2500\u2500 Johns Hopkins: 28 enrolled
\u2502   \u2514\u2500\u2500 Mayo Clinic: 24 enrolled
\u251C\u2500\u2500 Safety Data:
\u2502   \u251C\u2500\u2500 SAEs: 8 (2.6%) \u2014 within expected range
\u2502   \u2514\u2500\u2500 DSMB Review: Next scheduled April 15
\u2514\u2500\u2500 Regulatory: FDA IND active, no clinical holds`,
      aiResponse: `Enrollment is at 65% (312 of 480) but the weekly rate of 18 patients is below the 22/week needed for the Q4 deadline. You're about 8 weeks behind pace. Three recommended actions: (1) activate the 4 backup sites in Europe that completed IRB approval last month, (2) expand the inclusion criteria per the pre-approved Protocol Amendment 3 (removes the prior-therapy washout restriction), and (3) increase the referral bonus at underperforming sites. The safety profile looks clean \u2014 2.6% SAE rate is well within the expected range, and the DSMB has raised no concerns.`,
      quality: '95%',
      sources: 14,
      updated: '4 min ago',
      tokensUsed: 4380,
      tokenBudget: 8192,
    },
  ],
  estonia: [
    {
      id: 'gov-advisor',
      user: 'Marika Tamm',
      role: 'Digital Transformation Advisor',
      division: 'Government Office',
      query: 'How are the ministries tracking on AI service deployment?',
      contextTree: `\u251C\u2500\u2500 National AI Strategy Progress (Q1 2026):
\u2502   \u251C\u2500\u2500 Min. of Finance: 14 AI services live (target: 12) \u2014 AHEAD
\u2502   \u251C\u2500\u2500 Min. of Social Affairs: 9 AI services live (target: 10) \u2014 ON TRACK
\u2502   \u251C\u2500\u2500 Min. of Economic Affairs: 7 AI services live (target: 8) \u2014 ON TRACK
\u2502   \u2514\u2500\u2500 RIA: 5 AI services live (target: 5) \u2014 ON TRACK
\u251C\u2500\u2500 Citizen Impact:
\u2502   \u251C\u2500\u2500 Avg service response time: 2.4 sec (down from 12 sec)
\u2502   \u251C\u2500\u2500 Citizen satisfaction: 87% (up from 74%)
\u2502   \u2514\u2500\u2500 Cost savings: \u20AC4.2M (Q1)
\u251C\u2500\u2500 X-Road Integration:
\u2502   \u251C\u2500\u2500 AI-enabled data exchanges: 1,240/day (up 340%)
\u2502   \u2514\u2500\u2500 Cross-ministry queries: 420/day
\u2514\u2500\u2500 EU Digital Decade Alignment: 92% (target: 90%)`,
      aiResponse: `Estonia is ahead of plan across all four tracked entities. Finance leads with 14 AI services against a 12-target, largely driven by the automated tax pre-filling system. The biggest impact is citizen-facing: service response times are down 80% and satisfaction is up 13 points. Cost savings of \u20AC4.2M in Q1 put the full-year \u20AC12M target within easy reach. The 340% increase in AI-enabled X-Road exchanges shows the platform approach is working. Social Affairs needs one more service by quarter-end to hit target \u2014 the benefits eligibility checker is in final testing.`,
      quality: '96%',
      sources: 16,
      updated: '3 min ago',
      tokensUsed: 4200,
      tokenBudget: 8192,
    },
    {
      id: 'ria-analyst',
      user: 'Andres Kask',
      role: 'Cybersecurity Analyst',
      division: 'RIA',
      query: 'Any threats to the X-Road infrastructure today?',
      contextTree: `\u251C\u2500\u2500 X-Road Health: All 1,247 security servers operational
\u251C\u2500\u2500 Threat Intelligence (last 24h):
\u2502   \u251C\u2500\u2500 DDoS attempts: 3 mitigated (origin: RU/BY networks)
\u2502   \u251C\u2500\u2500 Phishing campaigns: 2 targeting gov employees
\u2502   \u2514\u2500\u2500 Vulnerability alerts: 1 (CVE-2026-1847, OpenSSL)
\u251C\u2500\u2500 CVE-2026-1847 Impact:
\u2502   \u251C\u2500\u2500 Severity: HIGH (CVSS 8.1)
\u2502   \u251C\u2500\u2500 Affected: 142 of 1,247 security servers
\u2502   \u2514\u2500\u2500 Patch available: Yes (deployed to 89 servers, 53 pending)
\u251C\u2500\u2500 eID System: Operational, 14,200 authentications/hour
\u2514\u2500\u2500 NATO CCDCOE: No elevated threat level for Baltics`,
      aiResponse: `The main concern today is CVE-2026-1847 \u2014 53 security servers still unpatched against a HIGH severity OpenSSL vulnerability. At the current patching rate, all servers should be updated by 18:00 today. The 3 DDoS attempts from RU/BY networks are routine at this point \u2014 all mitigated automatically. The phishing campaigns targeting gov employees warrant a reminder to all ministries. X-Road core infrastructure is fully operational with no performance degradation. Recommend prioritizing the remaining 53 patches and issuing the phishing advisory by end of day.`,
      quality: '99%',
      sources: 11,
      updated: '1 min ago',
      tokensUsed: 3980,
      tokenBudget: 8192,
    },
  ],
  'ee-finance': [
    {
      id: 'tax-inspector',
      user: 'Liina Rebane',
      role: 'Senior Tax Inspector',
      division: 'Tax & Revenue',
      query: 'Flag anomalies in this quarter\'s VAT returns',
      contextTree: `\u251C\u2500\u2500 Q1 2026 VAT Returns Summary:
\u2502   \u251C\u2500\u2500 Total filed: 42,847 | Processing: 1,240 | Flagged: 184
\u251C\u2500\u2500 AI-Flagged Anomalies:
\u2502   \u251C\u2500\u2500 Zero-rate abuse: 23 entities (carousel indicators)
\u2502   \u251C\u2500\u2500 Input VAT spikes: 41 entities (>200% YoY increase)
\u2502   \u251C\u2500\u2500 Missing trader patterns: 8 entities (new reg + high volume)
\u2502   \u2514\u2500\u2500 Cross-border mismatches: 12 (VIES data inconsistencies)
\u251C\u2500\u2500 Revenue Impact:
\u2502   \u251C\u2500\u2500 Estimated gap: \u20AC2.8M in flagged returns
\u2502   \u2514\u2500\u2500 Recovery potential: \u20AC1.9M (based on historical hit rate)
\u2514\u2500\u2500 EU Cooperation: 3 pending SCAC requests (DE, NL, LT)`,
      aiResponse: `184 returns flagged this quarter with an estimated \u20AC2.8M gap. The highest-priority cluster is the 8 missing trader patterns \u2014 new registrations with immediate high-volume cross-border activity. These match the carousel fraud profile we saw in Q3 2025. Recommend immediate freeze on refunds for those 8 entities pending verification. The 23 zero-rate abuse cases should be cross-checked against the VIES database via the pending SCAC requests with Germany and Netherlands. Historical recovery rate suggests \u20AC1.9M is achievable, which would put us ahead of the annual collection target.`,
      quality: '97%',
      sources: 13,
      updated: '2 min ago',
      tokensUsed: 4340,
      tokenBudget: 8192,
    },
  ],
  'ee-social': [
    {
      id: 'case-worker',
      user: 'Kadri Puu',
      role: 'Senior Case Worker',
      division: 'Social Benefits',
      query: 'Check eligibility for disability benefit application #DB-28841',
      contextTree: `\u251C\u2500\u2500 Application: DB-28841 | Applicant: [Anonymized]
\u251C\u2500\u2500 Medical Assessment:
\u2502   \u251C\u2500\u2500 Diagnosis: Rheumatoid arthritis (M06.0), Chronic fatigue
\u2502   \u251C\u2500\u2500 Functional capacity: 40% (assessed by EKAM committee)
\u2502   \u2514\u2500\u2500 Work capacity: Partial (can work 4h/day with accommodations)
\u251C\u2500\u2500 Employment History:
\u2502   \u251C\u2500\u2500 Last employer: Tallinn Logistics OÜ (2019-2025)
\u2502   \u251C\u2500\u2500 Social tax contributions: 72 months (min: 60 for full benefit)
\u2502   \u2514\u2500\u2500 Current status: Registered unemployed since Jan 2026
\u251C\u2500\u2500 Existing Benefits:
\u2502   \u251C\u2500\u2500 Health insurance: Active (through unemployment registration)
\u2502   \u2514\u2500\u2500 Unemployment benefit: \u20AC580/month (ends July 2026)
\u251C\u2500\u2500 Legal Framework: Social Benefits for Disabled Persons Act \u00a78
\u2514\u2500\u2500 Similar Cases: 14 comparable (avg processing: 18 days)`,
      aiResponse: `Applicant meets all eligibility criteria for partial disability benefit. Social tax contributions of 72 months exceed the 60-month minimum. The EKAM assessment at 40% functional capacity qualifies for the partial benefit tier (\u20AC200-320/month depending on exact assessment). This can be paid alongside the unemployment benefit until July, then standalone. Processing timeline based on comparable cases is about 18 days. One flag: verify the medical assessment is dated within the last 6 months per \u00a78(3) of the Act. If the EKAM review is from before October 2025, a refreshed assessment is required.`,
      quality: '96%',
      sources: 10,
      updated: '3 min ago',
      tokensUsed: 4080,
      tokenBudget: 8192,
    },
  ],
  'ee-economic': [
    {
      id: 'eresidency-officer',
      user: 'Martin Lepp',
      role: 'e-Residency Program Officer',
      division: 'e-Residency',
      query: 'Review the application batch from Southeast Asia this week',
      contextTree: `\u251C\u2500\u2500 Batch: Week 13, 2026 | Region: Southeast Asia
\u251C\u2500\u2500 Applications: 47 total
\u2502   \u251C\u2500\u2500 Singapore: 12 | Vietnam: 10 | Indonesia: 8
\u2502   \u251C\u2500\u2500 Thailand: 7 | Philippines: 6 | Malaysia: 4
\u251C\u2500\u2500 AI Pre-Screening:
\u2502   \u251C\u2500\u2500 Auto-approved: 31 (66%) \u2014 clean background, clear business plan
\u2502   \u251C\u2500\u2500 Manual review: 12 (26%) \u2014 missing docs or unclear purpose
\u2502   \u2514\u2500\u2500 Flagged: 4 (8%) \u2014 AML/sanctions screening matches
\u251C\u2500\u2500 Common Business Types:
\u2502   \u251C\u2500\u2500 IT/Software: 22 (47%)
\u2502   \u251C\u2500\u2500 Digital marketing: 9 (19%)
\u2502   \u2514\u2500\u2500 E-commerce: 8 (17%)
\u2514\u2500\u2500 Revenue Projection: \u20AC188K annual (based on avg e-resident spend)`,
      aiResponse: `The Southeast Asia batch looks healthy \u2014 66% auto-approved is above the global average of 58%. Singapore applicants have the highest quality (11 of 12 auto-approved). The 4 flagged applications need priority review: 2 are likely false positives (common-name matches against sanctions lists), but 2 from Indonesia have business plans that describe payment facilitation services, which require enhanced due diligence under Estonian AML rules. For the 12 manual-review cases, most are missing proof of business activity \u2014 recommend sending the standard documentation request template within 48 hours to stay within SLA.`,
      quality: '94%',
      sources: 8,
      updated: '5 min ago',
      tokensUsed: 3920,
      tokenBudget: 8192,
    },
  ],
  'ee-ria': [
    {
      id: 'xroad-admin',
      user: 'Andres Kask',
      role: 'X-Road Service Manager',
      division: 'RIA',
      query: 'What\'s the X-Road performance dashboard showing?',
      contextTree: `\u251C\u2500\u2500 X-Road v7 Performance (last 24h):
\u2502   \u251C\u2500\u2500 Total transactions: 2.4M
\u2502   \u251C\u2500\u2500 Avg response time: 180ms (SLA: <500ms)
\u2502   \u251C\u2500\u2500 Availability: 99.99%
\u2502   \u2514\u2500\u2500 Error rate: 0.012%
\u251C\u2500\u2500 Top Services by Volume:
\u2502   \u251C\u2500\u2500 Population Registry queries: 480K
\u2502   \u251C\u2500\u2500 Tax & Customs lookups: 320K
\u2502   \u251C\u2500\u2500 Health Insurance Fund: 280K
\u2502   \u2514\u2500\u2500 Business Registry: 220K
\u251C\u2500\u2500 Security Servers: 1,247 active | 0 offline
\u251C\u2500\u2500 Certificate Status: All valid, 3 renewals due in 14 days
\u2514\u2500\u2500 Cross-Border: 12 connected partner countries`,
      aiResponse: `X-Road is running optimally. 2.4M transactions at 180ms average is well within the 500ms SLA. The 99.99% availability translates to about 8 seconds of downtime in the last 24 hours. Three certificate renewals are due in 14 days \u2014 these are for the Population Registry, Tax Board, and Social Insurance Board security servers. I'd recommend scheduling the renewals for next week during the standard maintenance window (Sunday 02:00-04:00) to ensure no disruption. All 12 cross-border connections are healthy, including the newest ones with Finland and Latvia.`,
      quality: '98%',
      sources: 9,
      updated: '2 min ago',
      tokensUsed: 3680,
      tokenBudget: 8192,
    },
  ],
};

/* ── Data Quality Alerts ──────────────────────────────────── */

interface DataAlert {
  severity: 'yellow' | 'green';
  title: string;
  detail: string;
  impact: string;
  action: string;
}

const companyDataAlerts: Record<string, DataAlert[]> = {
  meridian: [
    {
      severity: 'yellow',
      title: 'IC Energy \u2014 Low Completeness (72%)',
      detail: 'Missing: Equipment serial numbers for 28% of assets',
      impact: 'AI can\'t cross-reference maintenance history for those assets',
      action: 'Data entry campaign scheduled for April 7-11',
    },
    {
      severity: 'yellow',
      title: 'IC Environmental \u2014 Stale GPS Data',
      detail: '12 vehicles with GPS feeds >10 minutes old',
      impact: 'Fleet optimization queries may use outdated positions',
      action: 'GPS firmware update in progress',
    },
    {
      severity: 'green',
      title: 'PTC Signal Data \u2014 Quality Improved',
      detail: 'Schema mapping improved from 73% to 91% after maintenance log integration',
      impact: 'Signal anomaly detection accuracy improved by 14%',
      action: 'Resolved: March 24',
    },
  ],
  oakwood: [
    {
      severity: 'yellow',
      title: 'Guidewire \u2014 Stale Claims Data',
      detail: '34 claims with status updates >15 minutes old due to batch sync delay',
      impact: 'Adjusters may see outdated claim statuses during peak hours',
      action: 'Migrating to real-time event stream (target: April 4)',
    },
    {
      severity: 'yellow',
      title: 'Duck Creek \u2014 Missing Policy Endorsements',
      detail: '8% of policies missing recent endorsement data',
      impact: 'Coverage lookups may return incomplete information',
      action: 'Reconciliation job running nightly, 92% resolved',
    },
    {
      severity: 'green',
      title: 'ACORD Message Parsing \u2014 Quality Improved',
      detail: 'Schema mapping improved from 81% to 96% after format update',
      impact: 'Automated intake now handles 96% of submissions without manual review',
      action: 'Resolved: March 26',
    },
  ],
  pinnacle: [
    {
      severity: 'yellow',
      title: 'Epic \u2014 Lab Result Lag',
      detail: '22 lab orders with results pending >30 minutes from completion',
      impact: 'Clinical decision support may use stale lab data',
      action: 'Interface engine restart scheduled for tonight',
    },
    {
      severity: 'yellow',
      title: 'Athenahealth \u2014 Scheduling Sync Gap',
      detail: '5% of appointment slots showing stale availability',
      impact: 'Patient scheduling may double-book in edge cases',
      action: 'Increasing sync frequency from 5 min to 1 min',
    },
    {
      severity: 'green',
      title: 'HL7 FHIR Mapping \u2014 Completeness Improved',
      detail: 'FHIR resource coverage improved from 78% to 94% after migration',
      impact: 'Clinical summaries now include all relevant data sections',
      action: 'Resolved: March 22',
    },
  ],
  atlas: [
    {
      severity: 'yellow',
      title: 'Siemens MES \u2014 Telemetry Gap on Line 6',
      detail: '8 OPC-UA tags reporting intermittently (packet loss 12%)',
      impact: 'OEE calculations for Line 6 may be inaccurate',
      action: 'Network switch replacement scheduled for April 2',
    },
    {
      severity: 'yellow',
      title: 'SAP PP \u2014 Batch Record Lag',
      detail: 'Production orders from 2nd shift arriving 20-40 min late',
      impact: 'Inventory levels and WIP reporting delayed for night shift',
      action: 'SAP interface job frequency increased to every 5 min',
    },
    {
      severity: 'green',
      title: 'QMS Integration \u2014 Quality Improved',
      detail: 'SPC data completeness improved from 82% to 97% after sensor calibration',
      impact: 'Quality alerts now trigger within 30 seconds of out-of-spec reading',
      action: 'Resolved: March 25',
    },
  ],
  northbridge: [
    {
      severity: 'yellow',
      title: 'Cross-OpCo \u2014 Schema Mapping Gaps',
      detail: '14 data fields from Aerospace not yet mapped to unified model',
      impact: 'Enterprise dashboards missing some Aerospace KPIs',
      action: 'Mapping workshop scheduled for April 3',
    },
    {
      severity: 'yellow',
      title: 'Health Sciences \u2014 GxP Validation Pending',
      detail: '3 AI services awaiting GxP qualification before production use',
      impact: 'Clinical trial data processing at 80% automation vs 95% target',
      action: 'Validation protocols submitted, expected completion April 15',
    },
    {
      severity: 'green',
      title: 'Financial Services \u2014 AML Model Upgrade',
      detail: 'New transaction monitoring model deployed with 18% fewer false positives',
      impact: 'Compliance team review time reduced by 4.2 hours/day',
      action: 'Resolved: March 20',
    },
  ],
  estonia: [
    {
      severity: 'yellow',
      title: 'Population Registry \u2014 Address Data Lag',
      detail: '1,240 address updates pending from municipal registries',
      impact: 'Some citizen service lookups may use outdated address data',
      action: 'Municipal sync frequency increased to hourly',
    },
    {
      severity: 'yellow',
      title: 'X-Road \u2014 CVE-2026-1847 Patching',
      detail: '53 of 1,247 security servers pending OpenSSL patch',
      impact: 'Unpatched servers at elevated risk until update complete',
      action: 'Emergency patching in progress, ETA 18:00 today',
    },
    {
      severity: 'green',
      title: 'e-Tax Integration \u2014 Quality Improved',
      detail: 'Automated VAT return processing accuracy improved to 99.4%',
      impact: 'Manual review queue reduced by 62%',
      action: 'Resolved: March 24',
    },
  ],
};

/* ── Resolve company data with fallback ───────────────────── */

function resolveCompanyData<T>(data: Record<string, T>, companyId: string, fallback: string = 'meridian'): T {
  return data[companyId] || data[fallback];
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════ */

export default function ContextWindows() {
  const { company } = useCompany();
  const companyId = company.id;

  /* ── Live counter ───────────────────────────────────────── */
  const [activeUsers, setActiveUsers] = useState(127);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveUsers(prev => {
        const delta = (Math.random() > 0.5 ? 1 : -1) * randomInt(1, 3);
        return Math.max(118, Math.min(142, prev + delta));
      });
    }, 15000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, []);

  /* ── Pipeline log ───────────────────────────────────────── */
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => generateInitialLogs(companyId));
  const logRef = useRef<HTMLDivElement>(null);

  // Reset logs when company changes
  useEffect(() => {
    setLogEntries(generateInitialLogs(companyId));
  }, [companyId]);

  useEffect(() => {
    const id = setInterval(() => {
      setLogEntries(prev => [...prev.slice(-30), generateLogEntry(companyId)]);
    }, randomInt(6000, 10000));
    return () => clearInterval(id);
  }, [companyId]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  /* ── Resolved company data ──────────────────────────────── */
  const divisionData = useMemo(() => resolveCompanyData(companyDivisionData, companyId), [companyId]);
  const queryTypes = useMemo(() => resolveCompanyData(companyQueryTypes, companyId), [companyId]);
  const pipelineStages = useMemo(() => resolveCompanyData(companyPipelineStages, companyId), [companyId]);
  const contextExamples = useMemo(() => resolveCompanyData(companyContextExamples, companyId), [companyId]);
  const dataAlerts = useMemo(() => resolveCompanyData(companyDataAlerts, companyId), [companyId]);

  /* ── Expanded example cards ─────────────────────────────── */
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  // Auto-expand first example when company changes
  useEffect(() => {
    if (contextExamples.length > 0) {
      setExpandedExample(contextExamples[0].id);
    }
  }, [contextExamples]);

  /* ── Expanded pipeline stage ────────────────────────────── */
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  /* ── Animated dots for pipeline ─────────────────────────── */
  const [dotPhase, setDotPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDotPhase(p => (p + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  /* ── Helper: freshness color ────────────────────────────── */
  const freshnessColor = useCallback((v: number) => (v < 3 ? 'text-green' : v <= 5 ? 'text-amber' : 'text-red-400'), []);
  const successColor = useCallback((v: number) => (v >= 99 ? 'text-green' : v >= 97 ? 'text-amber' : 'text-red-400'), []);

  /* ── Column header label ────────────────────────────────── */
  const divisionLabel = (company.subEntities || company.parentId) ? 'Division' : 'Department';

  let sectionIdx = 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 space-y-8">
      <PreliminaryBanner />
      {/* ── Header ────────────────────────────────────────── */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-3 mb-1">
          <Layers className="w-5 h-5 text-blue" strokeWidth={1.7} />
          <h1 className="text-xl font-semibold text-ink tracking-tight">Context Windows</h1>
        </div>
        <p className="text-[13px] text-ink-secondary leading-relaxed max-w-2xl">
          How the right data reaches the right people's AI tools. Every query is powered by a
          managed context window — role-filtered, freshness-guaranteed, and token-budget-optimized.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 1: Health Dashboard
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Freshness */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Context Freshness</span>
            </div>
            <div className="text-2xl font-bold text-green tracking-tight">97.3%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Data &lt; 5 min old</p>
          </div>
          {/* Success Rate */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Query Success</span>
            </div>
            <div className="text-2xl font-bold text-green tracking-tight">99.1%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Returned useful results</p>
          </div>
          {/* Completeness */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Data Completeness</span>
            </div>
            <div className="text-2xl font-bold text-blue tracking-tight">84.7%</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Required fields populated</p>
          </div>
          {/* Active Users */}
          <div className="rounded-lg bg-surface-raised border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" strokeWidth={1.7} />
              <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Active Users Now</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 tracking-tight flex items-center gap-2">
              {activeUsers}
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            </div>
            <p className="text-[11px] text-ink-tertiary mt-1">Using managed context</p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 2: How Context Windows Work (Pipeline)
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-4">How Context Windows Work</h2>
        <div className="rounded-lg bg-surface-raised border border-border p-5 overflow-hidden">
          {/* Pipeline stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {pipelineStages.map((stage, idx) => (
              <div key={stage.title} className="relative">
                {/* Arrow connector */}
                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <div className="relative w-8 flex items-center justify-center">
                      {/* Animated dots */}
                      {[0, 1, 2].map(dotIdx => {
                        const offset = ((dotPhase + dotIdx * 33) % 100) / 100;
                        return (
                          <span
                            key={dotIdx}
                            className="absolute w-1.5 h-1.5 rounded-full bg-blue"
                            style={{
                              left: `${offset * 100}%`,
                              opacity: 0.3 + offset * 0.7,
                            }}
                          />
                        );
                      })}
                      <ArrowRight className="w-4 h-4 text-border relative z-10" />
                    </div>
                  </div>
                )}
                {/* Mobile arrow */}
                {idx < pipelineStages.length - 1 && (
                  <div className="md:hidden flex justify-center py-2">
                    <div className="w-px h-6 bg-border relative">
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-border text-xs">&darr;</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                  className={`w-full text-left p-4 rounded-md border transition-colors ${
                    expandedStage === idx
                      ? 'border-blue/40 bg-blue/5'
                      : 'border-border/50 hover:border-border hover:bg-surface-sunken/30'
                  } ${idx === 0 ? 'bg-blue/[0.03]' : idx === 1 ? 'bg-amber/[0.03]' : idx === 2 ? 'bg-emerald-500/[0.04]' : 'bg-purple-500/[0.03]'}`}
                >
                  <div className="text-[10px] font-bold tracking-widest text-blue uppercase mb-2">{stage.title}</div>
                  <ul className="space-y-1">
                    {stage.items.map(item => (
                      <li key={item} className="text-[11px] text-ink-secondary flex items-start gap-1.5">
                        <span className="text-ink-faint mt-0.5">&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-[12px] font-semibold text-ink">{stage.stat === 'LIVE_USERS' ? `${activeUsers} active now` : stage.stat}</div>
                </button>

                {/* Expanded detail */}
                {expandedStage === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 p-3 rounded bg-surface-sunken border border-border text-[11px] text-ink-secondary leading-relaxed"
                  >
                    {idx === 0 && `Connects to ${pipelineStages[0].stat} via read-only MCP connectors. Each connector authenticates via OAuth2 or service accounts with minimum-privilege access. Data is pulled on schedules ranging from real-time to every 5 minutes.`}
                    {idx === 1 && `Incoming data is cleaned, deduplicated, and normalized into a unified schema. ${pipelineStages[1].stat} are maintained with full lineage tracking. Schema mapping handles differences between source system formats.`}
                    {idx === 2 && `The context engine builds role-specific views of the data. Each role sees only the data relevant to their function, location, and current task. Each context window has a token budget and freshness guarantee.`}
                    {idx === 3 && 'End users query AI tools naturally. The AI has exactly the right context for their role, location, and task — no hallucination from missing data, no irrelevant noise from data overload.'}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 3: Live Context Window Examples
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-1">Live Context Window Examples</h2>
        <p className="text-[12px] text-ink-tertiary mb-4">
          Different users get different context. Click to see what the AI sees when each role asks a question.
        </p>
        <div className="space-y-3">
          {contextExamples.map(ex => {
            const isOpen = expandedExample === ex.id;
            const tokenPct = Math.round((ex.tokensUsed / ex.tokenBudget) * 100);
            return (
              <div
                key={ex.id}
                className={`rounded-lg border transition-colors ${
                  isOpen ? 'border-blue/30 bg-surface-raised' : 'border-border bg-surface-raised/60 hover:bg-surface-raised'
                }`}
              >
                {/* Card header */}
                <button
                  onClick={() => setExpandedExample(isOpen ? null : ex.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-blue">{ex.user.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink">{ex.user} <span className="text-ink-tertiary font-normal">&middot; {ex.role}, {ex.division}</span></div>
                      <div className="text-[12px] text-ink-secondary truncate mt-0.5">
                        <Search className="w-3 h-3 inline-block mr-1 -mt-0.5 text-ink-faint" />
                        &ldquo;{ex.query}&rdquo;
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-ink-tertiary hidden sm:inline">{ex.quality} complete</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-ink-faint" /> : <ChevronDown className="w-4 h-4 text-ink-faint" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* Context tree */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" />
                        Context Window Contents
                      </div>
                      <div className="rounded-md bg-[#0d1117] border border-[#1e2936] p-4 overflow-x-auto">
                        <pre className="text-[11px] font-mono text-[#c9d1d9] leading-[1.65] whitespace-pre">{ex.contextTree}</pre>
                      </div>
                    </div>

                    {/* AI response */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2 flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5" />
                        AI Response
                      </div>
                      <div className="rounded-md bg-[#111827] border border-[#1e293b] p-4">
                        <p className="text-[12px] text-[#e2e8f0] leading-relaxed font-[system-ui]">{ex.aiResponse}</p>
                      </div>
                    </div>

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink-tertiary">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green" />
                        {ex.quality} complete
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        {ex.sources} sources
                      </span>
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Updated {ex.updated}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        {ex.tokensUsed.toLocaleString()} / {ex.tokenBudget.toLocaleString()} tokens ({tokenPct}%)
                      </span>
                    </div>

                    {/* Token budget bar */}
                    <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${tokenPct > 80 ? 'bg-amber' : 'bg-emerald-500'}`}
                        style={{ width: `${tokenPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 4: Data Processing Pipeline (Live Log)
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">Data Processing Pipeline</h2>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[11px] font-medium text-green">Live</span>
          </div>
        </div>
        <div className="rounded-lg bg-gray-950 border border-gray-800 overflow-hidden">
          <div ref={logRef} className="p-4 h-[320px] overflow-y-auto font-mono text-[11px] leading-[1.8] space-y-0">
            {logEntries.map((entry, idx) => (
              <div key={`${entry.ts}-${idx}`} className="flex gap-2">
                <span className="text-green-600/60 flex-shrink-0">[{entry.ts}]</span>
                <span className={`font-bold flex-shrink-0 w-[60px] text-right ${opColors[entry.op]}`}>{entry.op}</span>
                <span className="text-green-400/80 ml-1">{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 5: Context Window Analytics
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-[15px] font-semibold text-ink mb-4">Context Window Analytics</h2>

        {/* Division table */}
        <div className="rounded-lg bg-surface-raised border border-border overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-surface-sunken/50">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">{divisionLabel}</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Active Users</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Avg Freshness</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Completeness</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Queries/Day</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {divisionData.map((row, idx) => (
                  <tr key={row.name} className={`border-b border-border/50 ${idx % 2 === 0 ? '' : 'bg-surface-sunken/20'}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-ink">{row.name}</span>
                      <span className="text-ink-tertiary ml-1.5 hidden sm:inline">{row.fullName}</span>
                    </td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.activeUsers}</td>
                    <td className={`text-right px-4 py-2.5 font-medium ${freshnessColor(row.avgFreshness)}`}>{row.avgFreshness} min</td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.completeness}%</td>
                    <td className="text-right px-4 py-2.5 text-ink-secondary">{row.queriesPerDay.toLocaleString()}</td>
                    <td className={`text-right px-4 py-2.5 font-medium ${successColor(row.successRate)}`}>{row.successRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Types horizontal bar chart */}
        <div className="rounded-lg bg-surface-raised border border-border p-4">
          <h3 className="text-[13px] font-semibold text-ink mb-4">Common Query Types</h3>
          <div className="space-y-3">
            {queryTypes.map(qt => (
              <div key={qt.label} className="flex items-center gap-3">
                <span className="text-[11px] text-ink-secondary w-[200px] flex-shrink-0 text-right">{qt.label}</span>
                <div className="flex-1 h-5 bg-surface-sunken rounded overflow-hidden">
                  <div className={`h-full rounded ${qt.color}`} style={{ width: `${qt.pct}%` }} />
                </div>
                <span className="text-[11px] font-medium text-ink w-[36px] text-right">{qt.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
         SECTION 6: Data Quality Alerts
         ══════════════════════════════════════════════════════ */}
      <motion.div custom={sectionIdx++} variants={fadeUp} initial="hidden" animate="visible" className="pb-8">
        <h2 className="text-[15px] font-semibold text-ink mb-4">Data Quality Alerts</h2>
        <div className="space-y-3">
          {dataAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${
                alert.severity === 'yellow'
                  ? 'border-amber/20 bg-amber/[0.04]'
                  : 'border-green/20 bg-green/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {alert.severity === 'yellow' ? (
                    <AlertTriangle className="w-4 h-4 text-amber" strokeWidth={1.7} />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green" strokeWidth={1.7} />
                  )}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="text-[13px] font-medium text-ink">{alert.title}</div>
                  <div className="text-[12px] text-ink-secondary">{alert.detail}</div>
                  <div className="text-[11px] text-ink-tertiary">
                    <span className="font-medium">Impact:</span> {alert.impact}
                  </div>
                  <div className="text-[11px] text-ink-tertiary">
                    <span className="font-medium">Action:</span> {alert.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
