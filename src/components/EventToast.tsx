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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visible.map((toast) => (
          <motion.div
            key={toast.event.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto max-w-[280px] bg-surface-raised border border-border rounded-lg shadow-lg px-3 py-2.5 relative group"
          >
            <button
              onClick={() => dismiss(toast.event.id)}
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-surface-sunken"
            >
              <X className="w-3 h-3 text-ink-faint" strokeWidth={2} />
            </button>

            <div className="flex items-start gap-2 pr-4">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${dotColor[toast.event.type]}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-ink leading-snug truncate">
                  {toast.event.title}
                </p>
                <p className="text-[11px] text-ink-tertiary leading-snug truncate mt-0.5">
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
