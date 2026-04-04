import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSimulation, type SimEvent } from '../data/SimulationEngine';
import { playChime } from '../hooks/useSound';

const dotColor: Record<SimEvent['type'], string> = {
  'workflow-step-complete': 'bg-blue',
  'verification-entry': 'bg-amber',
  'savings-tick': 'bg-green',
  'workflow-status-change': 'bg-blue',
};

interface VisibleToast {
  event: SimEvent;
  dismissedAt?: number;
}

export default function EventToast() {
  const { recentEvents } = useSimulation();
  const [visible, setVisible] = useState<VisibleToast[]>([]);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  // Watch for new events
  useEffect(() => {
    if (recentEvents.length === 0) return;
    const latest = recentEvents[0];
    if (seen.has(latest.id)) return;

    setSeen((prev) => {
      const next = new Set(prev);
      next.add(latest.id);
      return next;
    });

    setVisible((prev) => [{ event: latest }, ...prev].slice(0, 3));
    playChime();
  }, [recentEvents, seen]);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (visible.length === 0) return;

    const timers = visible.map((toast) => {
      if (toast.dismissedAt) return null;
      return setTimeout(() => {
        setVisible((prev) => prev.filter((t) => t.event.id !== toast.event.id));
      }, 4000);
    });

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
    };
  }, [visible]);

  const dismiss = useCallback((id: string) => {
    setVisible((prev) => prev.filter((t) => t.event.id !== id));
  }, []);

  // Reset when company changes (events get cleared)
  useEffect(() => {
    if (recentEvents.length === 0) {
      setVisible([]);
      setSeen(new Set());
    }
  }, [recentEvents.length]);

  return (
    <div className="fixed bottom-0 left-0 lg:left-[232px] right-0 z-40 flex flex-col gap-2 p-4 pb-6 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visible.map((toast) => (
          <motion.div
            key={toast.event.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto w-full max-w-[960px] mx-auto bg-surface-raised border border-border rounded-xl shadow-lg px-5 py-3 relative group"
          >
            <button
              onClick={() => dismiss(toast.event.id)}
              className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-surface-sunken"
            >
              <X className="w-3.5 h-3.5 text-ink-faint" strokeWidth={2} />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor[toast.event.type]}`}
              />
              <div className="min-w-0 flex-1 flex items-center gap-3">
                <p className="text-[13px] font-medium text-ink leading-snug truncate">
                  {toast.event.title}
                </p>
                <p className="text-[12px] text-ink-tertiary leading-snug truncate">
                  {toast.event.detail}
                </p>
                <p className="text-[10px] text-ink-faint flex-shrink-0 ml-auto">just now</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
