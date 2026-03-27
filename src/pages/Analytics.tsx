import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';

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
  const [lastCheckSeconds, setLastCheckSeconds] = useState(12);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const templateIdx = useRef(0);
  const entryId = useRef(0);

  // Initialize feed with recent entries
  useEffect(() => {
    const now = new Date();
    const initial: FeedEntry[] = [];
    for (let i = 0; i < 12; i++) {
      const t = feedTemplates[i % feedTemplates.length];
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
  }, []);

  // Add new entries every 5-8 seconds
  useEffect(() => {
    const addEntry = () => {
      const t = feedTemplates[templateIdx.current % feedTemplates.length];
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
  }, []);

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
              9 agents active · 7 divisions monitored · Last check: {formatSecondsAgo(lastCheckSeconds)}
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
          Real-time activity across all agents and divisions
        </p>
      </div>

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
          <h2 className="text-[14px] font-semibold text-ink">Division Health</h2>
          <span className="text-[11px] text-ink-faint">{divisions.length} divisions</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {divisions.map((div) => {
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
