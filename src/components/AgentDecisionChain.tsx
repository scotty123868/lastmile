import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  GitBranch,
  Brain,
  Target,
} from 'lucide-react';
import type { AgentAction } from '../data/agentDecisions';

/* ── Status styling ───────────────────────────────────────── */

const statusConfig: Record<string, { dot: string; bg: string; text: string; icon: React.ElementType }> = {
  success: { dot: 'bg-green', bg: 'bg-green-muted', text: 'text-green', icon: CheckCircle2 },
  warning: { dot: 'bg-amber', bg: 'bg-amber-muted', text: 'text-amber', icon: AlertTriangle },
  info: { dot: 'bg-blue', bg: 'bg-blue-muted', text: 'text-blue', icon: Info },
};

/* ── Single Decision Card ─────────────────────────────────── */

function DecisionCard({ action, index }: { action: AgentAction; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[action.status] ?? statusConfig.info;
  const StatusIcon = cfg.icon;

  const ts = new Date(action.timestamp);
  const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = ts.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="relative flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-6">
        <div className={`w-3 h-3 rounded-full ${cfg.dot} mt-1.5 z-10 ring-2 ring-surface`} />
        <div className="flex-1 w-px bg-border" />
      </div>

      {/* Card content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.3 }}
        className="flex-1 mb-4"
      >
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
          {/* Header */}
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <StatusIcon className={`w-3.5 h-3.5 ${cfg.text} flex-shrink-0`} strokeWidth={2} />
                <span className="text-[13px] font-semibold text-ink truncate">{action.action}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 text-ink-tertiary">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] tabular-nums">{timeStr}</span>
                <span className="text-[10px] text-ink-faint">{dateStr}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                {action.agentName}
              </span>
              <span className="text-[12px] text-ink-secondary">{action.outcome}</span>
            </div>

            {/* Savings metric */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-sunken">
                <Zap className="w-3 h-3 text-amber" strokeWidth={2} />
                <span className="text-ink-secondary font-medium">{action.savingsLabel}</span>
              </div>
              <div className="flex items-center gap-1 text-ink-tertiary">
                <span className="line-through text-ink-faint">Manual: {action.manualTime}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-green font-medium">AI: {action.automatedTime}</span>
              </div>
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-2 px-4 py-2 border-t border-border-subtle text-[11px] font-medium text-ink-tertiary hover:text-ink hover:bg-surface-sunken/40 transition-colors cursor-pointer"
          >
            <GitBranch className="w-3 h-3" strokeWidth={2} />
            <span>View Decision Chain</span>
            <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded Decision Chain */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-4 bg-surface-sunken/30 border-t border-border-subtle space-y-4">
                  {/* Data Inputs */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">Data Inputs Considered</span>
                    </div>
                    <ul className="space-y-1.5 pl-3">
                      {action.chain.dataInputs.map((input, i) => (
                        <li key={i} className="text-[12px] text-ink-secondary leading-relaxed flex gap-2">
                          <span className="text-ink-faint flex-shrink-0 mt-0.5">&bull;</span>
                          <span>{input}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Options Evaluated */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber" />
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">Options Evaluated</span>
                    </div>
                    <div className="space-y-2">
                      {action.chain.optionsEvaluated.map((opt, i) => (
                        <div key={i} className="bg-surface-raised border border-border rounded-lg px-3 py-2.5">
                          <div className="text-[12px] font-medium text-ink mb-1">
                            {i === action.chain.optionsEvaluated.length - 1 && action.chain.optionsEvaluated.length > 1 ? (
                              <span className="inline-flex items-center gap-1">
                                <span>{opt.label}</span>
                              </span>
                            ) : (
                              opt.label
                            )}
                          </div>
                          <div className="flex gap-4 text-[11px]">
                            <span className="text-green"><span className="font-medium">+</span> {opt.pros}</span>
                            <span className="text-red"><span className="font-medium">&minus;</span> {opt.cons}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Brain className="w-3 h-3 text-purple-400" strokeWidth={2} />
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">Why This Option</span>
                    </div>
                    <p className="text-[12px] text-ink-secondary leading-relaxed pl-3">{action.chain.reasoning}</p>
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-ink-tertiary" strokeWidth={2} />
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">Confidence</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className={`h-full rounded-full ${action.chain.confidence >= 90 ? 'bg-green' : action.chain.confidence >= 80 ? 'bg-amber' : 'bg-red'}`}
                          style={{ width: `${action.chain.confidence}%` }}
                        />
                      </div>
                      <span className={`text-[12px] font-semibold tabular-nums ${action.chain.confidence >= 90 ? 'text-green' : action.chain.confidence >= 80 ? 'text-amber' : 'text-red'}`}>
                        {action.chain.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Timeline Component ──────────────────────────────── */

interface AgentDecisionChainProps {
  actions: AgentAction[];
  title?: string;
  maxItems?: number;
}

export default function AgentDecisionChain({
  actions,
  title = 'Recent Agent Actions',
  maxItems,
}: AgentDecisionChainProps) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...actions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const display = maxItems && !showAll ? sorted.slice(0, maxItems) : sorted;
  const hasMore = maxItems ? sorted.length > maxItems : false;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-blue" strokeWidth={1.8} />
        <h3 className="text-[14px] font-semibold text-ink tracking-tight">{title}</h3>
        <span className="text-[11px] text-ink-tertiary">({sorted.length} action{sorted.length !== 1 ? 's' : ''})</span>
      </div>

      <div className="relative">
        {display.map((action, i) => (
          <DecisionCard key={action.id} action={action} index={i} />
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="ml-10 text-[12px] font-medium text-blue hover:text-blue/80 transition-colors cursor-pointer"
        >
          Show all {sorted.length} actions &rarr;
        </button>
      )}
    </div>
  );
}
