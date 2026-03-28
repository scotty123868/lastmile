import { useEffect, useRef, useState } from 'react';

interface AnimatedProgressBarProps {
  value: number; // 0-100
  color?: string;
  bgColor?: string;
  height?: number;
  className?: string;
  duration?: number;
}

export default function AnimatedProgressBar({
  value,
  color = '#2563EB',
  bgColor = '#E4E4E7',
  height = 6,
  className = '',
  duration = 800,
}: AnimatedProgressBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          requestAnimationFrame(() => setWidth(Math.min(100, Math.max(0, value))));
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ height, background: bgColor }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: color,
          transition: `width ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        }}
      />
    </div>
  );
}
