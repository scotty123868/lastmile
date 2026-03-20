import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { useCompany } from './CompanyContext';
import { getWorkflowsForCompany, type LiveWorkflow } from './workflows';

// ─── Types ───────────────────────────────────────────────────

export interface SimEvent {
  id: string;
  type:
    | 'workflow-step-complete'
    | 'verification-entry'
    | 'savings-tick'
    | 'workflow-status-change';
  timestamp: Date;
  title: string;
  detail: string;
  workflowId?: string;
  amount?: number;
}

interface SimulationContextValue {
  liveWorkflows: LiveWorkflow[];
  recentEvents: SimEvent[];
  savingsAccumulator: number;
  eventCount: number;
  isRunning: boolean;
}

// ─── Context ─────────────────────────────────────────────────

const SimulationContext = createContext<SimulationContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────

let _eventId = 0;
function nextEventId() {
  _eventId += 1;
  return `evt-${_eventId}-${Date.now()}`;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Deep clone workflows so we can mutate them safely */
function cloneWorkflows(workflows: LiveWorkflow[]): LiveWorkflow[] {
  return JSON.parse(JSON.stringify(workflows));
}

// ─── Provider ────────────────────────────────────────────────

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { company } = useCompany();
  const [liveWorkflows, setLiveWorkflows] = useState<LiveWorkflow[]>(() =>
    cloneWorkflows(getWorkflowsForCompany(company.id)),
  );
  const [recentEvents, setRecentEvents] = useState<SimEvent[]>([]);
  const [savingsAccumulator, setSavingsAccumulator] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset when company changes
  useEffect(() => {
    setLiveWorkflows(cloneWorkflows(getWorkflowsForCompany(company.id)));
    setRecentEvents([]);
    setSavingsAccumulator(0);
    setEventCount(0);
    setIsRunning(true);
  }, [company.id]);

  const pushEvent = useCallback((event: SimEvent) => {
    setRecentEvents((prev) => [event, ...prev].slice(0, 20));
    setEventCount((prev) => prev + 1);
  }, []);

  // ── Event generators ──────────────────────────────────────

  const fireWorkflowStepComplete = useCallback(
    (workflows: LiveWorkflow[]): SimEvent | null => {
      // Find workflows with advanceable steps (pending or active)
      const candidates = workflows.filter((w) =>
        w.steps.some((s) => s.status === 'active' || s.status === 'pending'),
      );
      if (candidates.length === 0) return null;

      const workflow = pickRandom(candidates);

      // Find the first active step to complete, or first pending to make active
      const activeIdx = workflow.steps.findIndex((s) => s.status === 'active');
      if (activeIdx !== -1) {
        const step = workflow.steps[activeIdx];
        step.status = 'completed';
        step.duration = `${(Math.random() * 4 + 0.2).toFixed(1)}s`;

        // Activate the next pending step
        const nextPending = workflow.steps.find((s) => s.status === 'pending');
        if (nextPending) {
          nextPending.status = 'active';
        }

        return {
          id: nextEventId(),
          type: 'workflow-step-complete',
          timestamp: new Date(),
          title: `${workflow.name}`,
          detail: `${step.label} completed`,
          workflowId: workflow.id,
        };
      }

      // No active step — activate the first pending one
      const pendingIdx = workflow.steps.findIndex((s) => s.status === 'pending');
      if (pendingIdx !== -1) {
        workflow.steps[pendingIdx].status = 'active';
        return {
          id: nextEventId(),
          type: 'workflow-step-complete',
          timestamp: new Date(),
          title: `${workflow.name}`,
          detail: `${workflow.steps[pendingIdx].label} started`,
          workflowId: workflow.id,
        };
      }

      return null;
    },
    [],
  );

  const fireVerificationEntry = useCallback(
    (workflows: LiveWorkflow[]): SimEvent | null => {
      // Pick a workflow that has verification or active steps
      const candidates = workflows.filter((w) =>
        w.steps.some(
          (s) => s.status === 'verification' || s.status === 'active',
        ),
      );
      if (candidates.length === 0) {
        // Fall back to any workflow
        if (workflows.length === 0) return null;
      }
      const workflow =
        candidates.length > 0 ? pickRandom(candidates) : pickRandom(workflows);

      const verificationLabels = [
        'Output verified against source data',
        'Compliance check passed',
        'Data extraction accuracy confirmed',
        'Cross-reference validation complete',
        'Schema mapping verified',
        'Business rule check passed',
      ];

      return {
        id: nextEventId(),
        type: 'verification-entry',
        timestamp: new Date(),
        title: 'Verification Logged',
        detail: `${workflow.name}: ${pickRandom(verificationLabels)}`,
        workflowId: workflow.id,
      };
    },
    [],
  );

  const fireSavingsTick = useCallback(
    (workflows: LiveWorkflow[]): SimEvent => {
      const amount = rand(120, 890);
      setSavingsAccumulator((prev) => prev + amount);

      const workflow =
        workflows.length > 0 ? pickRandom(workflows) : undefined;
      const detail = workflow
        ? `$${amount.toLocaleString()} saved — ${workflow.name}`
        : `$${amount.toLocaleString()} accumulated`;

      return {
        id: nextEventId(),
        type: 'savings-tick',
        timestamp: new Date(),
        title: 'Savings Accumulated',
        detail,
        workflowId: workflow?.id,
        amount,
      };
    },
    [],
  );

  const fireWorkflowStatusChange = useCallback(
    (workflows: LiveWorkflow[]): SimEvent | null => {
      // Find a running workflow where all steps are completed
      const completable = workflows.filter(
        (w) =>
          w.status === 'running' &&
          w.steps.every(
            (s) => s.status === 'completed' || s.status === 'verification',
          ),
      );

      if (completable.length > 0) {
        const workflow = pickRandom(completable);
        workflow.status = 'verified';
        // Also complete any verification steps
        workflow.steps.forEach((s) => {
          if (s.status === 'verification') {
            s.status = 'completed';
          }
        });

        return {
          id: nextEventId(),
          type: 'workflow-status-change',
          timestamp: new Date(),
          title: 'Workflow Verified',
          detail: `${workflow.name} — all steps verified`,
          workflowId: workflow.id,
        };
      }

      // Otherwise, try moving a verification step to completed
      const withVerification = workflows.filter((w) =>
        w.steps.some((s) => s.status === 'verification'),
      );
      if (withVerification.length > 0) {
        const workflow = pickRandom(withVerification);
        const step = workflow.steps.find((s) => s.status === 'verification');
        if (step) {
          step.status = 'completed';
          step.duration = `${rand(2, 18)} min`;
          // Activate the next pending step
          const nextPending = workflow.steps.find(
            (s) => s.status === 'pending',
          );
          if (nextPending) {
            nextPending.status = 'active';
          }

          return {
            id: nextEventId(),
            type: 'workflow-status-change',
            timestamp: new Date(),
            title: `${workflow.name}`,
            detail: `${step.label} — verification passed`,
            workflowId: workflow.id,
          };
        }
      }

      return null;
    },
    [],
  );

  // ── Main simulation loop ──────────────────────────────────

  useEffect(() => {
    function scheduleNext() {
      const delay = rand(4000, 8000);
      timerRef.current = setTimeout(() => {
        setLiveWorkflows((prev) => {
          const workflows = cloneWorkflows(prev);

          // Pick a random event type
          const types: SimEvent['type'][] = [
            'workflow-step-complete',
            'workflow-step-complete',
            'verification-entry',
            'savings-tick',
            'workflow-status-change',
          ];
          const type = pickRandom(types);

          let event: SimEvent | null = null;

          switch (type) {
            case 'workflow-step-complete':
              event = fireWorkflowStepComplete(workflows);
              break;
            case 'verification-entry':
              event = fireVerificationEntry(workflows);
              break;
            case 'savings-tick':
              event = fireSavingsTick(workflows);
              break;
            case 'workflow-status-change':
              event = fireWorkflowStatusChange(workflows);
              break;
          }

          // If the chosen type produced no event, try savings as fallback
          if (!event) {
            event = fireSavingsTick(workflows);
          }

          if (event) {
            pushEvent(event);
          }

          return workflows;
        });

        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    company.id,
    fireWorkflowStepComplete,
    fireVerificationEntry,
    fireSavingsTick,
    fireWorkflowStatusChange,
    pushEvent,
  ]);

  return (
    <SimulationContext.Provider
      value={{
        liveWorkflows,
        recentEvents,
        savingsAccumulator,
        eventCount,
        isRunning,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx)
    throw new Error('useSimulation must be used inside SimulationProvider');
  return ctx;
}
