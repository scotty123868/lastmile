import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Megaphone,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Types ───────────────────────────────────────────────── */

interface TeamRow {
  name: string;
  active: number;
  total: number;
  adoption: number;
  trend: string;
  trendDir: 'up' | 'down' | 'flat';
  status: 'strong' | 'growing' | 'at-risk' | 'stalled';
}

interface NudgeCampaign {
  id: string;
  name: string;
  target: string;
  type: 'reminder' | 'training' | 'incentive' | 'peer-comparison';
  status: 'active' | 'scheduled' | 'completed';
  impact: string;
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
  nudges: NudgeCampaign[];
  cycles: CycleMetric[];
}

/* ── Company-specific data ───────────────────────────────── */

const adoptionData: Record<string, CompanyAdoptionData> = {
  meridian: {
    overallRate: 38,
    overallTrend: '+7% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Division / Team',
    teams: [
      { name: 'Track Maintenance Crews (HCC)', active: 320, total: 420, adoption: 76, trend: '↑ 9%', trendDir: 'up', status: 'strong' },
      { name: 'Signal & Communications (HTI)', active: 180, total: 240, adoption: 75, trend: '↑ 6%', trendDir: 'up', status: 'strong' },
      { name: 'Fleet Operations (HRSI)', active: 260, total: 380, adoption: 68, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Rail Testing Division (HSI)', active: 140, total: 200, adoption: 70, trend: '↑ 5%', trendDir: 'up', status: 'growing' },
      { name: 'Transit Operations (HTSI)', active: 110, total: 220, adoption: 50, trend: '↑ 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Project Engineering', active: 82, total: 160, adoption: 51, trend: '↓ 2%', trendDir: 'down', status: 'at-risk' },
    ],
    nudges: [
      { id: 'n1', name: 'RailSentry Mobile App Onboarding', target: 'Transit Operations (HTSI)', type: 'training', status: 'active', impact: '24 operators enrolled this week' },
      { id: 'n2', name: 'Digital Track Chart Incentive', target: 'All track crews', type: 'incentive', status: 'active', impact: '+22% digital submission rate' },
      { id: 'n3', name: 'Division Adoption Leaderboard', target: 'Division leads', type: 'peer-comparison', status: 'active', impact: 'HSI +5% after seeing HCC data' },
      { id: 'n4', name: 'SpeedTrax Field Training — Midwest', target: 'Project Engineering', type: 'training', status: 'scheduled', impact: 'Starts next week — 18 engineers' },
    ],
    cycles: [
      { label: 'Track geometry analysis report', before: '6.8 hrs', after: '1.4 hrs', improvement: '79%' },
      { label: 'Crew dispatch cycle', before: '3.2 hrs', after: '0.6 hrs', improvement: '81%' },
      { label: 'Equipment utilization report', before: '2 weeks', after: '45 min', improvement: '97%' },
      { label: 'FRA compliance documentation', before: '8.0 hrs', after: '2.4 hrs', improvement: '70%' },
    ],
  },
  oakwood: {
    overallRate: 54,
    overallTrend: '+11% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Team',
    teams: [
      { name: 'Auto Claims — East', active: 22, total: 28, adoption: 79, trend: '↑ 14%', trendDir: 'up', status: 'strong' },
      { name: 'Property Claims', active: 18, total: 24, adoption: 75, trend: '↑ 9%', trendDir: 'up', status: 'growing' },
      { name: 'Commercial Lines UW', active: 12, total: 20, adoption: 60, trend: '↑ 5%', trendDir: 'up', status: 'growing' },
      { name: 'Auto Claims — West', active: 8, total: 22, adoption: 36, trend: '↑ 2%', trendDir: 'up', status: 'at-risk' },
      { name: 'Legacy Policy Team', active: 4, total: 18, adoption: 22, trend: '↓ 1%', trendDir: 'down', status: 'stalled' },
      { name: 'SIU Investigators', active: 3, total: 8, adoption: 38, trend: '— 0%', trendDir: 'flat', status: 'at-risk' },
    ],
    nudges: [
      { id: 'n1', name: 'AI-Assisted Claims Walkthrough', target: 'Auto Claims — West', type: 'training', status: 'active', impact: '8 adjusters in-progress' },
      { id: 'n2', name: 'Legacy Team Transition Plan', target: 'Legacy Policy Team', type: 'training', status: 'scheduled', impact: 'Starts next week' },
      { id: 'n3', name: 'Claims Leaderboard', target: 'All claims teams', type: 'peer-comparison', status: 'active', impact: 'East team +14% since launch' },
    ],
    cycles: [
      { label: 'FNOL to first contact', before: '8.2 hrs', after: '2.4 hrs', improvement: '71%' },
      { label: 'Claims adjudication', before: '14 days', after: '4.8 days', improvement: '66%' },
      { label: 'Policy migration (per batch)', before: '3 weeks', after: '4 days', improvement: '81%' },
      { label: 'Renewal risk assessment', before: '2.5 hrs', after: '0.6 hrs', improvement: '76%' },
    ],
  },
  pinnacle: {
    overallRate: 72,
    overallTrend: '+5% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Provider / Team',
    teams: [
      { name: 'Dr. R. Patel — Internal Med', active: 4, total: 4, adoption: 100, trend: '↑ 0%', trendDir: 'flat', status: 'strong' },
      { name: 'Dr. S. Kim — Orthopedics', active: 3, total: 4, adoption: 75, trend: '↑ 8%', trendDir: 'up', status: 'strong' },
      { name: 'Dr. L. Chen — Cardiology', active: 3, total: 5, adoption: 60, trend: '↑ 12%', trendDir: 'up', status: 'growing' },
      { name: 'Nursing Staff', active: 28, total: 34, adoption: 82, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Front Desk / Scheduling', active: 12, total: 14, adoption: 86, trend: '↑ 6%', trendDir: 'up', status: 'strong' },
      { name: 'Billing & Coding', active: 6, total: 10, adoption: 60, trend: '↑ 10%', trendDir: 'up', status: 'growing' },
      { name: 'Dr. M. Torres — Family Med', active: 1, total: 3, adoption: 33, trend: '↓ 5%', trendDir: 'down', status: 'at-risk' },
    ],
    nudges: [
      { id: 'n1', name: 'Ambient Scribe Onboarding', target: 'Dr. Torres team', type: 'training', status: 'active', impact: '1:1 session scheduled' },
      { id: 'n2', name: 'Coding Accuracy Comparison', target: 'Billing & Coding', type: 'peer-comparison', status: 'active', impact: '+22% coding throughput for adopters' },
      { id: 'n3', name: 'PA Turnaround Reminder', target: 'All providers', type: 'reminder', status: 'active', impact: 'Avg PA time shown in daily digest' },
    ],
    cycles: [
      { label: 'Clinical note completion', before: '18 min', after: '4 min', improvement: '78%' },
      { label: 'Prior auth submission', before: '45 min', after: '8 min', improvement: '82%' },
      { label: 'Patient scheduling', before: '12 min', after: '3 min', improvement: '75%' },
      { label: 'Insurance verification', before: '22 min', after: '2 min', improvement: '91%' },
    ],
  },
  atlas: {
    overallRate: 61,
    overallTrend: '+7% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Facility / Team',
    teams: [
      { name: 'Akron — CNC Floor', active: 42, total: 56, adoption: 75, trend: '↑ 9%', trendDir: 'up', status: 'strong' },
      { name: 'Akron — Quality Lab', active: 8, total: 10, adoption: 80, trend: '↑ 4%', trendDir: 'up', status: 'strong' },
      { name: 'Detroit — Assembly', active: 34, total: 48, adoption: 71, trend: '↑ 8%', trendDir: 'up', status: 'growing' },
      { name: 'Detroit — Procurement', active: 6, total: 8, adoption: 75, trend: '↑ 12%', trendDir: 'up', status: 'strong' },
      { name: 'Guadalajara — Floor', active: 18, total: 42, adoption: 43, trend: '↑ 3%', trendDir: 'up', status: 'at-risk' },
      { name: 'Guadalajara — Warehouse', active: 4, total: 14, adoption: 29, trend: '↓ 1%', trendDir: 'down', status: 'stalled' },
      { name: 'Charlotte — Finishing', active: 22, total: 30, adoption: 73, trend: '↑ 6%', trendDir: 'up', status: 'growing' },
    ],
    nudges: [
      { id: 'n1', name: 'Bilingual Training — Guadalajara', target: 'Guadalajara — all teams', type: 'training', status: 'active', impact: '14 workers in current cohort' },
      { id: 'n2', name: 'IoT Dashboard Walkthrough', target: 'Floor supervisors', type: 'training', status: 'active', impact: '6 of 8 supervisors completed' },
      { id: 'n3', name: 'Cross-Plant Efficiency Board', target: 'All facilities', type: 'peer-comparison', status: 'active', impact: 'Detroit +8% after seeing Akron data' },
      { id: 'n4', name: 'WMS Migration Reminder', target: 'Guadalajara — Warehouse', type: 'reminder', status: 'active', impact: '4 sessions this week' },
    ],
    cycles: [
      { label: 'Maintenance ticket creation', before: '35 min', after: '8 min', improvement: '77%' },
      { label: 'Purchase order cycle', before: '4.2 days', after: '1.1 days', improvement: '74%' },
      { label: 'Quality inspection report', before: '2.5 hrs', after: '0.6 hrs', improvement: '76%' },
      { label: 'Cross-plant inventory lookup', before: '1.8 hrs', after: '12 min', improvement: '89%' },
    ],
  },
  northbridge: {
    overallRate: 71,
    overallTrend: '+6% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Operating Company / Division',
    teams: [
      { name: 'Aerospace Ops', active: 2800, total: 3200, adoption: 88, trend: '\u2191 8%', trendDir: 'up', status: 'strong' },
      { name: 'Energy Trading Floor', active: 1400, total: 1600, adoption: 88, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Financial Services Risk', active: 1800, total: 2000, adoption: 90, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Health Sciences R&D', active: 2100, total: 2800, adoption: 75, trend: '\u2191 9%', trendDir: 'up', status: 'growing' },
      { name: 'Corporate IT', active: 480, total: 520, adoption: 92, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'Shared Services', active: 1200, total: 2000, adoption: 60, trend: '\u2191 7%', trendDir: 'up', status: 'growing' },
    ],
    nudges: [
      { id: 'n1', name: 'Cross-Division AI Champions Program', target: 'All divisions', type: 'training', status: 'active', impact: '48 champions trained across 7 divisions' },
      { id: 'n2', name: 'Shared Services Onboarding Sprint', target: 'Shared Services', type: 'training', status: 'active', impact: '340 staff in current cohort' },
      { id: 'n3', name: 'Division Adoption Leaderboard', target: 'All divisions', type: 'peer-comparison', status: 'active', impact: 'Health Sciences +9% after seeing Aerospace data' },
      { id: 'n4', name: 'Executive Dashboard Digest', target: 'C-suite and division presidents', type: 'reminder', status: 'active', impact: 'Weekly adoption metrics to 14 executives' },
    ],
    cycles: [
      { label: 'Procurement cycle (cross-division)', before: '3 weeks', after: '2 days', improvement: '90%' },
      { label: 'Maintenance work order creation', before: '45 min', after: '8 min', improvement: '82%' },
      { label: 'Financial close (consolidated)', before: '12 days', after: '3 days', improvement: '75%' },
      { label: 'Supplier onboarding', before: '4 weeks', after: '5 days', improvement: '82%' },
    ],
  },
  estonia: {
    overallRate: 84,
    overallTrend: '+4% vs last month',
    overallTrendDir: 'up',
    teamLabel: 'Agency / Board',
    teams: [
      { name: 'Tax & Revenue Board (EMTA)', active: 4200, total: 4400, adoption: 95, trend: '\u2191 3%', trendDir: 'up', status: 'strong' },
      { name: 'Social Insurance Board (SKA)', active: 2400, total: 2800, adoption: 86, trend: '\u2191 5%', trendDir: 'up', status: 'strong' },
      { name: 'Health Insurance Fund (EHIF)', active: 1800, total: 2200, adoption: 82, trend: '\u2191 6%', trendDir: 'up', status: 'strong' },
      { name: 'Digital Services (RIA)', active: 680, total: 700, adoption: 97, trend: '\u2191 1%', trendDir: 'up', status: 'strong' },
      { name: 'Treasury', active: 420, total: 480, adoption: 88, trend: '\u2191 4%', trendDir: 'up', status: 'strong' },
      { name: 'Procurement Agency', active: 280, total: 400, adoption: 70, trend: '\u2191 8%', trendDir: 'up', status: 'growing' },
    ],
    nudges: [
      { id: 'n1', name: 'AI Governance Training', target: 'All agencies', type: 'training', status: 'active', impact: '1,200 civil servants completed certification' },
      { id: 'n2', name: 'Procurement Digitization Sprint', target: 'Procurement Agency', type: 'training', status: 'active', impact: '28 staff in current cohort' },
      { id: 'n3', name: 'Ministry Adoption Dashboard', target: 'All ministries', type: 'peer-comparison', status: 'active', impact: 'Procurement +8% after benchmarking' },
    ],
    cycles: [
      { label: 'Tax return processing', before: '14 days', after: '48 hours', improvement: '86%' },
      { label: 'Benefit eligibility determination', before: '10 days', after: '24 hours', improvement: '90%' },
      { label: 'Healthcare record integration', before: '3 weeks', after: '2 days', improvement: '90%' },
      { label: 'Cross-ministry data request', before: '5 days', after: '4 hours', improvement: '97%' },
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

const statusConfig = {
  strong: { label: 'Strong', color: 'text-green', bg: 'bg-green-muted' },
  growing: { label: 'Growing', color: 'text-blue', bg: 'bg-blue-muted' },
  'at-risk': { label: 'At Risk', color: 'text-amber', bg: 'bg-amber-muted' },
  stalled: { label: 'Stalled', color: 'text-red', bg: 'bg-red-muted' },
};

const nudgeTypeConfig = {
  reminder: { label: 'Reminder', color: 'text-ink-tertiary', bg: 'bg-surface-sunken' },
  training: { label: 'Training', color: 'text-blue', bg: 'bg-blue-muted' },
  incentive: { label: 'Incentive', color: 'text-green', bg: 'bg-green-muted' },
  'peer-comparison': { label: 'Peer Comparison', color: 'text-amber', bg: 'bg-amber-muted' },
};

function TrendIcon({ dir }: { dir: 'up' | 'down' | 'flat' }) {
  if (dir === 'up') return <ArrowUpRight className="w-3 h-3 text-green" strokeWidth={2} />;
  if (dir === 'down') return <ArrowDownRight className="w-3 h-3 text-red" strokeWidth={2} />;
  return <Minus className="w-3 h-3 text-ink-faint" strokeWidth={2} />;
}

/* ── Main ────────────────────────────────────────────────── */

export default function AdoptionPulse() {
  const { company } = useCompany();
  const data = adoptionData[company.id] || adoptionData.meridian;

  const strongCount = data.teams.filter((t) => t.status === 'strong').length;
  const atRiskCount = data.teams.filter((t) => t.status === 'at-risk' || t.status === 'stalled').length;
  const totalUsers = data.teams.reduce((s, t) => s + t.active, 0);
  const totalHeadcount = data.teams.reduce((s, t) => s + t.total, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Adoption Pulse</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Behavioral adoption metrics across {company.shortName}</p>
      </div>

      {/* Hero stat + summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Overall Adoption</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[28px] font-semibold text-ink tabular-nums tracking-tight">{data.overallRate}%</span>
            <span className="flex items-center gap-0.5">
              <TrendIcon dir={data.overallTrendDir} />
              <span className="text-[11px] text-ink-tertiary">{data.overallTrend}</span>
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Active Users</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">
            {totalUsers}<span className="text-[14px] text-ink-tertiary font-normal"> / {totalHeadcount}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Strong Teams</div>
          <div className="text-[24px] font-semibold text-green tabular-nums tracking-tight mt-0.5">{strongCount}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="px-4 py-3 rounded-lg bg-surface-raised border border-border"
        >
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">At Risk</div>
          <div className="text-[24px] font-semibold tabular-nums tracking-tight mt-0.5" style={{ color: atRiskCount > 0 ? '#DC2626' : undefined }}>{atRiskCount}</div>
        </motion.div>
      </div>

      {/* Team adoption table */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Adoption by {data.teamLabel}</h2>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px_80px] gap-3 px-5 py-2.5 border-b border-border-subtle">
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">{data.teamLabel}</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Users</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Adoption</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Trend</span>
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider text-right">Status</span>
          </div>
          {data.teams.map((team, i) => {
            const sc = statusConfig[team.status];
            return (
              <motion.div
                key={team.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_80px_80px] gap-1 sm:gap-3 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-surface-sunken/40 transition-colors items-center"
              >
                <div>
                  <span className="text-[13px] font-medium text-ink">{team.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] tabular-nums text-ink-secondary">
                    {team.active} / {team.total}
                  </span>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-surface-sunken overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${team.adoption >= 70 ? 'bg-green' : team.adoption >= 50 ? 'bg-blue' : 'bg-amber'}`}
                        style={{ width: `${team.adoption}%` }}
                      />
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
      </section>

      {/* Nudge campaigns */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Active Nudge Campaigns</h2>
        </div>
        <div className="space-y-2">
          {data.nudges.map((nudge, i) => {
            const nc = nudgeTypeConfig[nudge.type];
            return (
              <motion.div
                key={nudge.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium text-ink">{nudge.name}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${nc.color} ${nc.bg}`}>{nc.label}</span>
                      {nudge.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green bg-green-muted px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-live" />
                          Active
                        </span>
                      )}
                      {nudge.status === 'scheduled' && (
                        <span className="text-[10px] font-semibold text-ink-tertiary bg-surface-sunken px-1.5 py-0.5 rounded">Scheduled</span>
                      )}
                    </div>
                    <p className="text-[12px] text-ink-tertiary mt-0.5">Target: {nudge.target}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-ink-tertiary" strokeWidth={2} />
                    <span className="text-[11px] text-ink-secondary">{nudge.impact}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cycle time improvements */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Cycle Time Improvements</h2>
          <span className="text-[11px] text-ink-tertiary">as adoption increases</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.cycles.map((cycle, i) => (
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
      </section>
    </div>
  );
}
