import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  Database,
  Users,
  Plug,
  TrendingUp,
  Layers,
  ChevronDown,
  Zap,
  X,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

const navItems = [
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/workflows', icon: Activity, label: 'Live Workflows' },
  { to: '/verification', icon: ShieldCheck, label: 'Verification Ledger' },
  { to: '/context', icon: Database, label: 'Context Pipeline' },
  { to: '/adoption', icon: Users, label: 'Adoption Pulse' },
  { to: '/integrations', icon: Plug, label: 'Integrations' },
  { to: '/impact', icon: TrendingUp, label: 'Impact' },
  { to: '/data-intelligence', icon: Layers, label: 'Data Intelligence' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
];

const pillarColors: Record<string, string> = {
  verification: 'bg-blue/10 text-blue',
  readiness: 'bg-amber/10 text-amber',
  adoption: 'bg-green/10 text-green',
  full: 'bg-ink-faint/20 text-ink-tertiary',
};

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 ${
          isActive
            ? 'text-nav-text-active bg-white/[0.06]'
            : 'text-nav-text hover:text-nav-text-active hover:bg-white/[0.03]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-blue" />
          )}
          <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.7} />
          <span className="text-[13px] font-medium tracking-[-0.01em]">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { company, companies, setCompanyId } = useCompany();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <aside className="relative w-[232px] min-w-[232px] h-screen flex flex-col bg-nav-bg">
      {/* Close button — mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-1.5 rounded-md text-nav-text hover:text-nav-text-active hover:bg-white/10 transition-colors lg:hidden"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      )}

      {/* Brand */}
      <div className="px-4 pt-5 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center flex-shrink-0">
            <Zap className="w-3 h-3 text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="text-nav-text-active font-semibold text-[15px] tracking-[-0.03em]">
            UpSkiller
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 my-3 h-px bg-nav-border" />

      {/* Company Selector */}
      <div className="px-3 mb-1 relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md bg-nav-surface border border-nav-border hover:border-white/10 transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 rounded bg-white/[0.08] flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-bold text-nav-text-active">{company.initials}</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[12px] font-medium text-nav-text-active truncate block leading-tight">
              {company.shortName}
            </span>
            <span className={`text-[10px] font-medium px-1 py-0.5 rounded ${pillarColors[company.pillar]}`}>
              {company.pillarLabel}
            </span>
          </div>
          <ChevronDown
            className={`w-3 h-3 text-nav-text flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>

        {open && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-nav-surface rounded-lg border border-nav-border shadow-2xl z-50 overflow-hidden">
            {companies.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCompanyId(c.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] ${
                  c.id === company.id ? 'bg-white/[0.04]' : ''
                }`}
              >
                <div className="w-5 h-5 rounded bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-nav-text-active">{c.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-white/90 truncate block">{c.shortName}</span>
                  <span className="text-[10px] text-nav-text truncate block">{c.industry} · {c.revenue}</span>
                </div>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${pillarColors[c.pillar]}`}>
                  {c.pillarLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-nav-border" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Status */}
      <div className="px-4 py-3 border-t border-nav-border">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-live" />
          <span className="text-[11px] text-nav-text">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
