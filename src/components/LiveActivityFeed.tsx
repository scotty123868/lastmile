import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useActivityFeed, type ActivityItem } from '../hooks/useFleetApi';

const severityConfig = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const config = severityConfig[item.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 px-3 py-2.5 border-b border-border/50 hover:bg-surface-sunken/30 transition-colors"
    >
      <div className={`mt-0.5 p-1 rounded ${config.bg}`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-semibold text-ink">{item.agentName}</span>
          <span className="text-[10px] text-ink-faint">{item.divisionName}</span>
          <span className="ml-auto text-[10px] text-ink-faint flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {timeAgo(item.timestamp)}
          </span>
        </div>
        <p className="text-[11px] text-ink-secondary leading-relaxed">
          <span className="font-medium text-ink-tertiary">{item.action}</span>
          {' — '}
          {item.detail}
        </p>
      </div>
    </motion.div>
  );
}

export default function LiveActivityFeed({
  division,
  maxVisible = 8,
  compact = false,
}: {
  division?: string;
  maxVisible?: number;
  compact?: boolean;
}) {
  const { activities, loading } = useActivityFeed(division);
  const [expanded, setExpanded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Timeout the loading state after 4 seconds to prevent infinite "Loading..."
  useEffect(() => {
    if (loading && activities.length === 0) {
      const timer = setTimeout(() => setTimedOut(true), 4000);
      return () => clearTimeout(timer);
    }
    setTimedOut(false);
  }, [loading, activities.length]);

  const visibleActivities = expanded ? activities : activities.slice(0, maxVisible);

  if (loading && activities.length === 0 && !timedOut) {
    return (
      <div className="rounded-lg border border-border bg-surface-sunken/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-ink-tertiary" />
          <span className="text-[13px] font-medium text-ink">Live Activity</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] text-green">Loading...</span>
          </span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-surface-sunken/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface-sunken/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-ink-tertiary" />
          <span className="text-[13px] font-medium text-ink">Live Activity</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" />
            <span className="text-[10px] text-ink-faint">Standby</span>
          </span>
        </div>
        <p className="text-[12px] text-ink-tertiary text-center py-4">
          No recent activity — agent events will appear here in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-sunken/30 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <Activity className="h-3.5 w-3.5 text-ink-tertiary" />
        <span className={`${compact ? 'text-[12px]' : 'text-[13px]'} font-medium text-ink`}>
          Live Activity Feed
        </span>
        <span className="text-[10px] text-ink-faint">({activities.length} events)</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="text-[10px] text-green font-medium">Polling</span>
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {visibleActivities.map(item => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>

      {activities.length > maxVisible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 text-[11px] text-ink-tertiary hover:text-ink hover:bg-surface-sunken/30 transition-colors border-t border-border/50"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Show all {activities.length} events <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </div>
  );
}
