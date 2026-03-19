import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ChevronDown,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { getWorkflowsForCompany, type LiveWorkflow, type WorkflowStep } from '../data/workflows';

const statusConfig = {
  running: { label: 'Running', color: 'bg-blue', textColor: 'text-blue', bgColor: 'bg-blue-muted' },
  verified: { label: 'Verified', color: 'bg-green', textColor: 'text-green', bgColor: 'bg-green-muted' },
  flagged: { label: 'Flagged', color: 'bg-red', textColor: 'text-red', bgColor: 'bg-red-muted' },
  queued: { label: 'Queued', color: 'bg-ink-tertiary', textColor: 'text-ink-tertiary', bgColor: 'bg-surface-sunken' },
};

function StepIcon({ status }: { status: WorkflowStep['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" strokeWidth={2} />;
    case 'active':
      return <Loader2 className="w-4 h-4 text-blue flex-shrink-0 animate-spin" strokeWidth={2} />;
    case 'verification':
      return <ShieldCheck className="w-4 h-4 text-amber flex-shrink-0" strokeWidth={2} />;
    case 'pending':
      return <Circle className="w-4 h-4 text-ink-faint flex-shrink-0" strokeWidth={1.5} />;
  }
}

function VerificationCard({ check }: { check: NonNullable<WorkflowStep['check']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="ml-7 mt-2 rounded-lg border border-amber/20 bg-amber-muted/50 p-3 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle className="w-3 h-3 text-amber" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">{check.flag}</span>
      </div>
      <div className="space-y-1.5">
        <div>
          <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Original Output</span>
          <p className="text-[12px] text-ink-secondary leading-relaxed mt-0.5 line-through decoration-red/30">{check.original}</p>
        </div>
        {check.corrected && (
          <div>
            <span className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Corrected</span>
            <p className="text-[12px] text-ink font-medium leading-relaxed mt-0.5">{check.corrected}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function WorkflowCard({ workflow }: { workflow: LiveWorkflow }) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[workflow.status];
  const completedSteps = workflow.steps.filter((s) => s.status === 'completed').length;
  const progress = (completedSteps / workflow.steps.length) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-raised border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 cursor-pointer hover:bg-surface-sunken/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${sc.textColor} ${sc.bgColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.color} ${workflow.status === 'running' ? 'animate-pulse-live' : ''}`} />
                {sc.label}
              </span>
              <span className="text-[11px] text-ink-tertiary">{workflow.startedAt}</span>
            </div>
            <h3 className="text-[14px] font-semibold text-ink leading-snug">{workflow.name}</h3>
            <p className="text-[12px] text-ink-tertiary mt-0.5">{workflow.department}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-ink-tertiary">Cycle time</div>
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-ink-tertiary line-through">{workflow.cycleTime.before}</span>
                <ArrowRight className="w-3 h-3 text-ink-faint" />
                <span className="text-green font-semibold">{workflow.cycleTime.after}</span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-ink-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-surface-sunken overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${workflow.status === 'flagged' ? 'bg-red' : 'bg-blue'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-ink-tertiary font-medium w-12 text-right">
            {completedSteps}/{workflow.steps.length}
          </span>
        </div>
      </button>

      {/* Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border-subtle pt-4">
              <div className="space-y-0">
                {workflow.steps.map((step, i) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-3 py-2">
                      {/* Vertical line connector */}
                      <div className="flex flex-col items-center">
                        <StepIcon status={step.status} />
                        {i < workflow.steps.length - 1 && (
                          <div className={`w-px flex-1 min-h-[16px] mt-1 ${
                            step.status === 'completed' ? 'bg-green/20' : 'bg-border'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-medium ${
                            step.status === 'pending' ? 'text-ink-tertiary' : 'text-ink'
                          }`}>
                            {step.label}
                          </span>
                          {step.duration && step.duration !== '—' && (
                            <span className="text-[10px] tabular-nums text-ink-faint font-mono">{step.duration}</span>
                          )}
                          {step.confidence && (
                            <span className="text-[10px] font-medium text-ink-tertiary px-1 py-0.5 rounded bg-surface-sunken">
                              {step.confidence}% confidence
                            </span>
                          )}
                        </div>
                        <p className={`text-[12px] leading-relaxed mt-0.5 ${
                          step.status === 'pending' ? 'text-ink-faint' : 'text-ink-secondary'
                        }`}>
                          {step.detail}
                        </p>
                        {step.agent && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-ink-tertiary">
                            <Zap className="w-2.5 h-2.5" strokeWidth={2} />
                            {step.agent}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verification detail card */}
                    {step.check && (step.status === 'verification' || step.status === 'completed') && (
                      <VerificationCard check={step.check} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LiveWorkflows() {
  const { company } = useCompany();
  const workflows = getWorkflowsForCompany(company.id);

  const running = workflows.filter((w) => w.status === 'running').length;
  const verified = workflows.filter((w) => w.status === 'verified').length;
  const flagged = workflows.filter((w) => w.status === 'flagged').length;
  const totalSavings = workflows.reduce((sum, w) => sum + w.savings, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Live Workflows</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">{company.tagline}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="px-4 py-3 rounded-lg bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Running</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">{running}</div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Verified</div>
          <div className="text-[24px] font-semibold text-green tabular-nums tracking-tight mt-0.5">{verified}</div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Flagged</div>
          <div className="text-[24px] font-semibold tabular-nums tracking-tight mt-0.5" style={{ color: flagged > 0 ? '#DC2626' : undefined }}>{flagged}</div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-surface-raised border border-border">
          <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider">Savings / yr</div>
          <div className="text-[24px] font-semibold text-ink tabular-nums tracking-tight mt-0.5">
            ${(totalSavings / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="space-y-3">
        {workflows.map((workflow, i) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <WorkflowCard workflow={workflow} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
