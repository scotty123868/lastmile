import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bot } from 'lucide-react';
import { useCompany } from '../data/CompanyContext';
import { agentEventsByDivision, type AgentToastEvent } from '../data/agentToastEvents';
import { playChime } from '../hooks/useSound';

const accentDot: Record<AgentToastEvent['accent'], string> = {
  blue: 'bg-blue',
  green: 'bg-green',
  amber: 'bg-amber',
  purple: 'bg-purple-500',
};

const accentBorder: Record<AgentToastEvent['accent'], string> = {
  blue: 'border-l-blue',
  green: 'border-l-green',
  amber: 'border-l-amber',
  purple: 'border-l-purple-500',
};

interface VisibleToast {
  id: string;
  event: AgentToastEvent;
}

let _toastId = 0;
function nextToastId() {
  _toastId += 1;
  return `agent-toast-${_toastId}-${Date.now()}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AgentToast() {
  const { company } = useCompany();
  const [visible, setVisible] = useState<VisibleToast[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const companyRef = useRef(company.id);

  // Reset when company changes
  useEffect(() => {
    companyRef.current = company.id;
    setVisible([]);
  }, [company.id]);

  const showToast = useCallback(() => {
    const pool = agentEventsByDivision[companyRef.current] ?? agentEventsByDivision['meridian'];
    if (!pool || pool.length === 0) return;

    const event = pickRandom(pool);
    const id = nextToastId();

    setVisible((prev) => [{ id, event }, ...prev].slice(0, 2));
    playChime();

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setVisible((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Schedule toasts: first after ~10s, then every 30-60s
  useEffect(() => {
    function scheduleNext(delay: number) {
      timerRef.current = setTimeout(() => {
        showToast();
        scheduleNext(randBetween(30000, 60000));
      }, delay);
    }

    scheduleNext(randBetween(8000, 12000));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [company.id, showToast]);

  const dismiss = useCallback((id: string) => {
    setVisible((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="fixed top-14 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {/* Live indicator */}
      <div className="pointer-events-auto flex items-center gap-1.5 self-end px-2.5 py-1 rounded-full bg-surface-raised border border-border shadow-sm">
        <Bot className="w-3 h-3 text-ink-tertiary" strokeWidth={2} />
        <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-live" />
        <span className="text-[10px] font-medium text-ink-tertiary tracking-wide uppercase">Agents Live</span>
      </div>

      {/* Toast stack */}
      <AnimatePresence mode="popLayout">
        {visible.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 120, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto max-w-[320px] bg-surface-raised border border-border border-l-2 ${accentBorder[toast.event.accent]} rounded-lg shadow-lg px-3 py-2.5 relative group`}
          >
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-surface-sunken"
            >
              <X className="w-3 h-3 text-ink-faint" strokeWidth={2} />
            </button>

            <div className="flex items-start gap-2.5 pr-4">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${accentDot[toast.event.accent]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-ink leading-snug">
                    {toast.event.agentName}
                  </span>
                  <span className="text-[10px] text-ink-faint">&middot;</span>
                  <span className="text-[11px] font-medium text-ink-secondary leading-snug">
                    {toast.event.action}
                  </span>
                </div>
                <p className="text-[11px] text-ink-tertiary leading-snug mt-0.5 line-clamp-2">
                  {toast.event.detail}
                </p>
                <p className="text-[10px] text-ink-faint mt-1">just now</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
