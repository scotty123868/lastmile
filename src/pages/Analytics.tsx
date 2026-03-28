import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { getAllAgents, getAgentsForDivision, getTotalInstances, getTotalTasksToday, getFleetUptime } from '../data/divisionAgents';
import { useFleetStatus } from '../hooks/useFleetApi';
import PreliminaryBanner from '../components/PreliminaryBanner';
import LiveActivityFeed from '../components/LiveActivityFeed';
import GoldenSignals from '../components/GoldenSignals';

/* ── Agent badge colors ──────────────────────────────────── */

const agentColors: Record<string, { bg: string; text: string }> = {
  DISPATCH:       { bg: 'bg-blue-500/20',    text: 'text-blue-300' },
  ATLAS:          { bg: 'bg-purple-500/20',   text: 'text-purple-300' },
  SCOUT:          { bg: 'bg-amber-500/20',    text: 'text-amber-300' },
  LEDGER:         { bg: 'bg-green-500/20',    text: 'text-green-300' },
  CHIEF:          { bg: 'bg-indigo-500/20',   text: 'text-indigo-300' },
  QUARTERMASTER:  { bg: 'bg-cyan-500/20',     text: 'text-cyan-300' },
  RELAY:          { bg: 'bg-pink-500/20',     text: 'text-pink-300' },
  SIGNAL:         { bg: 'bg-gray-500/20',     text: 'text-gray-300' },
};

/* ── Activity feed templates ─────────────────────────────── */

type StatusIcon = 'green' | 'amber' | 'red' | 'info';

interface FeedTemplate {
  agent: string;
  status: StatusIcon;
  message: string;
}

const feedTemplates: FeedTemplate[] = [
  { agent: 'DISPATCH', status: 'green', message: 'HCC Crew 3 schedule verified — all compliant' },
  { agent: 'ATLAS', status: 'green', message: 'Sarah Chen (HSI) asked: "defect history MP 247" — answered in 1.1s' },
  { agent: 'DISPATCH', status: 'amber', message: 'Maria Thompson (HTSI) approaching 276hr monthly limit — crew manager alerted' },
  { agent: 'SCOUT', status: 'green', message: 'Track geometry scan MP 180-195 complete — no anomalies' },
  { agent: 'LEDGER', status: 'green', message: 'Weekly license scan: 3 new unused Primavera licenses found ($13,500/yr)' },
  { agent: 'ATLAS', status: 'green', message: 'Mike Torres (HCC) asked: "I-70 bridge status" — answered in 1.4s' },
  { agent: 'CHIEF', status: 'info', message: 'Daily briefing delivered to CEO — 3 items flagged' },
  { agent: 'QUARTERMASTER', status: 'green', message: 'Duplicate ballast order detected (HCC + HRSI) — consolidated, saved $8,200' },
  { agent: 'DISPATCH', status: 'red', message: 'PREVENTED: K. Nguyen would exceed 12hr limit — reassigned to J. Ramirez' },
  { agent: 'RELAY', status: 'green', message: 'Ops meeting transcript processed — 12 action items extracted' },
  { agent: 'SIGNAL', status: 'green', message: 'No safety-critical mentions in last 30 minutes of communications' },
  { agent: 'SCOUT', status: 'green', message: 'Rail profile measurement MP 210-225 — within spec' },
  { agent: 'ATLAS', status: 'green', message: 'Dave Kim (HRSI) asked: "next maintenance window for Unit 4402" — answered in 0.9s' },
  { agent: 'DISPATCH', status: 'green', message: 'HTI night shift roster finalized — 0 compliance violations' },
  { agent: 'LEDGER', status: 'green', message: 'Detected 2 overlapping AutoCAD licenses across HCC & HTI — $9,200/yr recoverable' },
  { agent: 'QUARTERMASTER', status: 'green', message: 'Fuel purchase consolidated across 3 divisions — saved $4,100' },
  { agent: 'CHIEF', status: 'info', message: 'Weekly safety digest compiled — sent to 7 division heads' },
  { agent: 'ATLAS', status: 'green', message: 'Lisa Park (HTI) asked: "PTC status corridor 12" — answered in 1.2s' },
  { agent: 'DISPATCH', status: 'amber', message: 'J. Ramirez approaching overtime threshold — monitoring' },
  { agent: 'RELAY', status: 'green', message: 'Field report from MP 302 processed — no action items' },
  { agent: 'SCOUT', status: 'amber', message: 'Minor gauge deviation at MP 188 — scheduled for review' },
  { agent: 'SIGNAL', status: 'green', message: 'All radio channels nominal — 0 alerts in last hour' },
  { agent: 'QUARTERMASTER', status: 'green', message: 'Tie plate inventory rebalanced across 4 depots — logistics cost down 12%' },
  { agent: 'ATLAS', status: 'green', message: 'Tom Wright (HCC) asked: "equipment availability next week" — answered in 1.0s' },
  { agent: 'LEDGER', status: 'green', message: 'Monthly SaaS audit complete — $22,400 in unused licenses flagged' },
  { agent: 'DISPATCH', status: 'green', message: 'HRSI weekend crew assignments validated — all within limits' },
];

/* ── Division-specific feed templates ───────────────────── */

const divisionFeedTemplates: Record<string, FeedTemplate[]> = {
  hcc: [
    { agent: 'DISPATCH', status: 'green', message: 'HCC Crew 7 highway resurfacing schedule verified — all compliant' },
    { agent: 'ATLAS', status: 'green', message: 'Mike Torres (HCC) asked: "I-70 bridge rehabilitation status" — answered in 1.4s' },
    { agent: 'DISPATCH', status: 'amber', message: 'R. Martinez (HCC) approaching 276hr monthly limit — superintendent alerted' },
    { agent: 'QUARTERMASTER', status: 'green', message: 'Aggregate order consolidated across 3 HCC projects — saved $12,400' },
    { agent: 'LEDGER', status: 'green', message: 'Detected 4 unused HCSS HeavyJob licenses — $18,200/yr recoverable' },
    { agent: 'SCOUT', status: 'green', message: 'Equipment inspection CAT 349F #E22 — all systems nominal' },
    { agent: 'CHIEF', status: 'info', message: 'Daily project status briefing delivered — 2 weather delays flagged' },
    { agent: 'DISPATCH', status: 'red', message: 'PREVENTED: J. Smith would exceed 12hr limit on Highway 65 project — reassigned' },
    { agent: 'RELAY', status: 'green', message: 'Project meeting transcript processed — 8 action items extracted' },
    { agent: 'ATLAS', status: 'green', message: 'Tom Wright (HCC) asked: "equipment availability next week" — answered in 1.0s' },
  ],
  hsi: [
    { agent: 'SCOUT', status: 'green', message: 'TAM-4 ultrasonic scan MP 280-295 complete — 2 defects logged for review' },
    { agent: 'ATLAS', status: 'green', message: 'Sarah Chen (HSI) asked: "defect history MP 247" — answered in 1.1s' },
    { agent: 'SCOUT', status: 'amber', message: 'Rail profile measurement MP 312 — gauge narrowing detected, monitoring' },
    { agent: 'DISPATCH', status: 'green', message: 'HSI test car crew rotation validated — all FRA certifications current' },
    { agent: 'SIGNAL', status: 'green', message: 'LIDAR calibration check passed — all sensors within spec' },
    { agent: 'CHIEF', status: 'info', message: 'Weekly testing summary compiled — 142 track miles tested' },
    { agent: 'LEDGER', status: 'green', message: 'Wheel probe inventory optimized — reduced spare cost by $4,800' },
    { agent: 'ATLAS', status: 'green', message: 'J. Martinez (HSI) asked: "FRA defect classification for MP 312.4" — answered in 0.8s' },
  ],
  htsi: [
    { agent: 'DISPATCH', status: 'green', message: 'HTSI morning rush crew deployment verified — all positions filled' },
    { agent: 'DISPATCH', status: 'amber', message: 'Maria Thompson (HTSI) approaching 276hr monthly limit — crew manager alerted' },
    { agent: 'ATLAS', status: 'green', message: 'L. Washington (HTSI) asked: "ridership trends downtown line" — answered in 1.2s' },
    { agent: 'QUARTERMASTER', status: 'green', message: 'Fuel purchase consolidated across HTSI fleet — saved $3,200' },
    { agent: 'SCOUT', status: 'green', message: 'Vehicle inspection Train #HTSI-44 — all safety systems passed' },
    { agent: 'CHIEF', status: 'info', message: 'Daily ridership report delivered — 3.2% above forecast' },
    { agent: 'RELAY', status: 'green', message: 'Customer complaint log processed — 4 service issues flagged' },
    { agent: 'DISPATCH', status: 'red', message: 'PREVENTED: Operator K. Nguyen would exceed HOS limit — backup operator assigned' },
  ],
  hti: [
    { agent: 'SIGNAL', status: 'green', message: 'PTC Zone 12 all wayside devices responding — latency nominal' },
    { agent: 'ATLAS', status: 'green', message: 'K. Patel (HTI) asked: "PTC status corridor 12" — answered in 1.2s' },
    { agent: 'SCOUT', status: 'green', message: 'Signal system diagnostic Zone 8-14 — no anomalies' },
    { agent: 'DISPATCH', status: 'green', message: 'HTI night shift signal maintenance roster finalized — 0 compliance violations' },
    { agent: 'LEDGER', status: 'green', message: 'Detected duplicate CAD licenses across HTI teams — $9,200/yr recoverable' },
    { agent: 'CHIEF', status: 'info', message: 'Weekly PTC performance report compiled — 99.97% uptime' },
    { agent: 'SIGNAL', status: 'amber', message: 'Minor communication latency increase on WD-4488 — monitoring' },
    { agent: 'QUARTERMASTER', status: 'green', message: 'Signal cable inventory rebalanced across 3 zones — cost down 8%' },
  ],
  hrsi: [
    { agent: 'DISPATCH', status: 'green', message: 'HRSI ballast crew assignments validated — all within HOS limits' },
    { agent: 'ATLAS', status: 'green', message: 'Dave Kim (HRSI) asked: "next maintenance window for Unit 4402" — answered in 0.9s' },
    { agent: 'QUARTERMASTER', status: 'green', message: 'Ballast order consolidated with HCC — saved $8,200' },
    { agent: 'SCOUT', status: 'green', message: 'GPS Ballast Train #BT-18 operating within parameters' },
    { agent: 'CHIEF', status: 'info', message: 'Equipment utilization report compiled — 2 units flagged for redeployment' },
    { agent: 'DISPATCH', status: 'amber', message: 'J. Ramirez (HRSI) approaching overtime threshold — monitoring' },
  ],
  he: [
    { agent: 'SCOUT', status: 'green', message: 'Solar array performance scan — all panels within 96% efficiency' },
    { agent: 'SIGNAL', status: 'green', message: 'SCADA monitoring nominal — no alerts in last 2 hours' },
    { agent: 'CHIEF', status: 'info', message: 'Daily energy production report compiled — 12% above forecast (sunny)' },
    { agent: 'LEDGER', status: 'green', message: 'Maintenance contract renewal — negotiated 8% reduction' },
  ],
  gg: [
    { agent: 'SCOUT', status: 'green', message: 'Wetland mitigation site monitoring — all 14 parameters within EPA limits' },
    { agent: 'CHIEF', status: 'info', message: 'Quarterly compliance report auto-generated — ready for review' },
    { agent: 'ATLAS', status: 'green', message: 'J. Park (GG) asked: "water quality trend site 7" — answered in 0.9s' },
    { agent: 'SIGNAL', status: 'green', message: 'Environmental sensor network — all stations reporting normally' },
  ],
};

/* ── Division-specific health data ─────────────────────── */

const divisionHealthData: Record<string, DivisionHealth[]> = {
  hcc: [
    { id: 'hcc-east', name: 'East Region', status: 'healthy', users: 186, agents: 5 },
    { id: 'hcc-west', name: 'West Region', status: 'healthy', users: 142, agents: 4 },
    { id: 'hcc-central', name: 'Central Region', status: 'alert', users: 104, agents: 3 },
  ],
  hsi: [
    { id: 'hsi-nec', name: 'NE Corridor', status: 'healthy', users: 42, agents: 2 },
    { id: 'hsi-south', name: 'Southern', status: 'healthy', users: 38, agents: 1 },
    { id: 'hsi-west', name: 'Western', status: 'monitoring', users: 26, agents: 1 },
  ],
  htsi: [
    { id: 'htsi-commuter', name: 'Commuter Rail', status: 'healthy', users: 112, agents: 3 },
    { id: 'htsi-intercity', name: 'Intercity', status: 'healthy', users: 58, agents: 2 },
    { id: 'htsi-maint', name: 'Maintenance', status: 'alert', users: 32, agents: 1 },
  ],
  hti: [
    { id: 'hti-signal', name: 'Signal Systems', status: 'healthy', users: 84, agents: 3 },
    { id: 'hti-ptc', name: 'PTC Operations', status: 'alert', users: 48, agents: 2 },
    { id: 'hti-comm', name: 'Communications', status: 'healthy', users: 29, agents: 1 },
  ],
  hrsi: [
    { id: 'hrsi-ballast', name: 'Ballast Ops', status: 'healthy', users: 68, agents: 2 },
    { id: 'hrsi-track', name: 'Track Renewal', status: 'healthy', users: 42, agents: 1 },
    { id: 'hrsi-equip', name: 'Equipment', status: 'monitoring', users: 19, agents: 1 },
  ],
  he: [
    { id: 'he-solar', name: 'Solar', status: 'healthy', users: 18, agents: 1 },
    { id: 'he-wind', name: 'Wind', status: 'healthy', users: 16, agents: 1 },
  ],
  gg: [
    { id: 'gg-remediation', name: 'Remediation', status: 'healthy', users: 12, agents: 1 },
    { id: 'gg-compliance', name: 'Compliance', status: 'healthy', users: 8, agents: 1 },
  ],
};

const statusDot: Record<StatusIcon, string> = {
  green: 'bg-green-400',
  amber: 'bg-amber-400',
  red:   'bg-red-400',
  info:  'bg-blue-400',
};

/* ── Division health data ────────────────────────────────── */

interface DivisionHealth {
  id: string;
  name: string;
  status: 'healthy' | 'alert' | 'monitoring';
  users: number;
  agents: number;
}

const divisions: DivisionHealth[] = [
  { id: 'hcc',  name: 'HCC',  status: 'healthy',    users: 432, agents: 12 },
  { id: 'hrsi', name: 'HRSI', status: 'healthy',    users: 129, agents: 4 },
  { id: 'hsi',  name: 'HSI',  status: 'healthy',    users: 106, agents: 3 },
  { id: 'hti',  name: 'HTI',  status: 'alert',      users: 161, agents: 5 },
  { id: 'htsi', name: 'HTSI', status: 'healthy',    users: 202, agents: 6 },
  { id: 'he',   name: 'HE',   status: 'monitoring', users: 34,  agents: 2 },
  { id: 'gg',   name: 'GG',   status: 'healthy',    users: 20,  agents: 1 },
];

const statusConfig: Record<string, { label: string; dot: string; border: string }> = {
  healthy:    { label: 'Healthy',    dot: 'bg-green-400',  border: 'border-green-500/20' },
  alert:      { label: '1 Alert',   dot: 'bg-amber-400',  border: 'border-amber-500/20' },
  monitoring: { label: 'Monitoring', dot: 'bg-yellow-400', border: 'border-yellow-500/20' },
};

/* ── Feed entry type ─────────────────────────────────────── */

interface FeedEntry {
  id: number;
  time: Date;
  agent: string;
  status: StatusIcon;
  message: string;
}

/* ── Helpers ──────────────────────────────────────────────── */

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatSecondsAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  return `${m}m ${seconds % 60}s ago`;
}

/* ── Main Component ──────────────────────────────────────── */

export default function Analytics() {
  const navigate = useNavigate();
  const { company } = useCompany();
  const activeFeedTemplates = useMemo(() => divisionFeedTemplates[company.id] || feedTemplates, [company.id]);
  const activeDivisions = useMemo(() => divisionHealthData[company.id] || divisions, [company.id]);
  const isParent = company.id === 'meridian';
  const agentCount = useMemo(() => isParent ? getAllAgents().length : getAgentsForDivision(company.id).length, [isParent, company.id]);

  // API-backed fleet status (enhances the status bar when available)
  const { data: fleetData } = useFleetStatus(15000);

  const [lastCheckSeconds, setLastCheckSeconds] = useState(12);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const templateIdx = useRef(0);
  const entryId = useRef(0);

  // Initialize feed with recent entries — reset when division changes
  useEffect(() => {
    const now = new Date();
    const initial: FeedEntry[] = [];
    templateIdx.current = 0;
    entryId.current = 0;
    for (let i = 0; i < 12; i++) {
      const t = activeFeedTemplates[i % activeFeedTemplates.length];
      const time = new Date(now.getTime() - (12 - i) * 8000);
      initial.push({
        id: entryId.current++,
        time,
        agent: t.agent,
        status: t.status,
        message: t.message,
      });
    }
    templateIdx.current = 12;
    setFeed(initial);
  }, [activeFeedTemplates]);

  // Add new entries every 5-8 seconds
  useEffect(() => {
    const addEntry = () => {
      const t = activeFeedTemplates[templateIdx.current % activeFeedTemplates.length];
      templateIdx.current++;
      setFeed(prev => {
        const next = [{
          id: entryId.current++,
          time: new Date(),
          agent: t.agent,
          status: t.status,
          message: t.message,
        }, ...prev];
        return next.slice(0, 50); // keep max 50
      });
      setLastCheckSeconds(0);
    };

    const interval = setInterval(addEntry, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [activeFeedTemplates]);

  // Tick the "last check" counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLastCheckSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTryAtlas = useCallback(() => {
    navigate('/agents');
    // Scroll to atlas section after navigation
    setTimeout(() => {
      const el = document.getElementById('atlas-deep-dive');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [navigate]);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <PreliminaryBanner />

      {/* ── Live Status Bar ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 bg-gray-900 rounded-xl px-5 py-4 border border-gray-700/50"
      >
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-white">All Systems Operational</div>
            <div className="text-[12px] text-gray-400 mt-0.5">
              {fleetData ? fleetData.fleet.totalAgentTypes : agentCount} agent types · {fleetData ? fleetData.fleet.totalInstances : getTotalInstances()} instances · {fleetData ? fleetData.fleet.tasksToday.toLocaleString() : getTotalTasksToday().toLocaleString()} tasks today · {fleetData ? fleetData.fleet.fleetUptime : `${getFleetUptime()}%`} uptime · {isParent ? '7 divisions' : `${activeDivisions.length} units`} · Last check: {formatSecondsAgo(lastCheckSeconds)}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-medium text-green-400">Live</span>
          </div>
        </div>
      </motion.div>

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Operations Pulse</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">
          Real-time activity{isParent ? ' across all agents and divisions' : ` — ${company.shortName} (${company.industry})`}
        </p>
      </div>

      {/* ── Golden Signals ─────────────────────────────────── */}
      <GoldenSignals />

      {/* ── Live Activity Feed ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 bg-surface-raised border border-border rounded-xl overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[13px] font-semibold text-ink">LIVE ACTIVITY</span>
            <span className="text-[11px] text-ink-faint">— Last 60 minutes</span>
          </div>
          <span className="text-[11px] text-ink-faint tabular-nums">{feed.length} events</span>
        </div>

        <div className="max-h-[480px] overflow-y-auto divide-y divide-border/50">
          {feed.map((entry, i) => {
            const ac = agentColors[entry.agent] || { bg: 'bg-gray-500/20', text: 'text-gray-300' };
            return (
              <motion.div
                key={entry.id}
                initial={i === 0 ? { opacity: 0, x: -20 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 px-5 py-2.5 hover:bg-surface-sunken/50 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${statusDot[entry.status]}`} />
                <span className="text-[11px] tabular-nums text-ink-faint font-mono w-[72px] flex-shrink-0 mt-0.5">
                  {formatTime(entry.time)}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${ac.bg} ${ac.text}`}>
                  {entry.agent}
                </span>
                <span className="text-[12px] text-ink-secondary leading-relaxed">
                  {entry.message}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Division Health Grid ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[14px] font-semibold text-ink">{isParent ? 'Division Health' : 'Unit Health'}</h2>
          <span className="text-[11px] text-ink-faint">{activeDivisions.length} {isParent ? 'divisions' : 'units'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeDivisions.map((div) => {
            const sc = statusConfig[div.status];
            return (
              <div
                key={div.id}
                className={`bg-surface-raised border rounded-xl px-4 py-3 ${sc.border} border-border`}
              >
                <div className="text-[14px] font-semibold text-ink mb-1.5">{div.name}</div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                  <span className="text-[11px] text-ink-secondary">{sc.label}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-faint">
                  <span>{div.users} users</span>
                  <span>{div.agents} agent{div.agents !== 1 ? 's' : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── API-backed Live Activity Feed ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-8"
      >
        <LiveActivityFeed
          division={isParent ? undefined : company.id}
          maxVisible={10}
        />
      </motion.div>

      {/* ── Try Atlas Floating Button ──────────────────────── */}
      <motion.button
        onClick={handleTryAtlas}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all z-50 flex items-center gap-2 animate-bounce-subtle"
        style={{ animationDuration: '2s', animationIterationCount: '3' }}
      >
        <MessageSquare className="w-4 h-4" strokeWidth={2} />
        <span className="text-[13px] font-semibold">Ask Atlas</span>
      </motion.button>
    </div>
  );
}
