import { NavLink } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  ChevronDown,
  Zap,
  X,
  MessageSquare,
  BarChart3,
  ClipboardCheck,
  Building2,
  Landmark,
  Check,
  Plug,
  ShieldCheck,
  Users,
  Server,
  Terminal,
  ExternalLink,
  Brain,
  Layers,
  Bot,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

const COMMAND_CENTER_URL = 'https://command-center-herzog.vercel.app';

interface NavSection {
  title: string;
  items: { to: string; icon: React.ElementType; label: string }[];
}

const navSections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { to: '/agents', icon: Bot, label: 'AI Agents' },
      { to: '/overview', icon: BarChart3, label: 'Overview' },
      { to: '/operations', icon: Activity, label: 'Operations' },
      { to: '/assessment', icon: ClipboardCheck, label: 'Assessment' },
      { to: '/impact', icon: TrendingUp, label: 'Impact' },
      { to: '/intelligence', icon: MessageSquare, label: 'Intelligence' },
      { to: '/ai-demo', icon: Brain, label: 'AI Analysis' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { to: '/infrastructure', icon: Server, label: 'AI Infrastructure' },
      { to: '/connectors', icon: Plug, label: 'System Connectors' },
      { to: '/mcp-config', icon: Terminal, label: 'MCP Server' },
      { to: '/context-windows', icon: Layers, label: 'Context Windows' },
      { to: '/reliability', icon: ShieldCheck, label: 'AI Reliability' },
      { to: '/adoption', icon: Users, label: 'Adoption' },
    ],
  },
];

const pillarColors: Record<string, string> = {
  verification: 'bg-blue/10 text-blue',
  readiness: 'bg-amber/10 text-amber',
  adoption: 'bg-green/10 text-green',
  full: 'bg-ink-faint/20 text-ink-tertiary',
};

/* Conglomerate and sovereign get unique accent treatments */
const categoryMeta: Record<string, { label: string; icon: React.ElementType; accent: string }> = {
  company: { label: 'Companies', icon: Building2, accent: '' },
  conglomerate: { label: 'Conglomerate', icon: Building2, accent: 'bg-purple-500/12 text-purple-400' },
  sovereign: { label: 'Sovereign', icon: Landmark, accent: 'bg-emerald-500/12 text-emerald-400' },
};

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 ${
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

  /* Initials badge style — conglomerate/sovereign get unique tints */
  const initialsBg = (cat: string) => {
    if (cat === 'conglomerate') return 'bg-purple-500/20';
    if (cat === 'sovereign') return 'bg-emerald-500/20';
    return 'bg-white/[0.08]';
  };
  const initialsText = (cat: string) => {
    if (cat === 'conglomerate') return 'text-purple-300';
    if (cat === 'sovereign') return 'text-emerald-300';
    return 'text-nav-text-active';
  };

  const categories = ['company', 'conglomerate', 'sovereign'] as const;

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
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${initialsBg(company.category)}`}>
            <span className={`text-[9px] font-bold ${initialsText(company.category)}`}>{company.initials}</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[12px] font-medium text-nav-text-active truncate block leading-tight">
              {company.shortName}
            </span>
            {company.parentId && (
              <span className="text-[9px] text-nav-text truncate block leading-tight">
                {companies.find((p) => p.id === company.parentId)?.shortName}
              </span>
            )}
            <span className={`text-[10px] font-medium px-1 py-0.5 rounded ${pillarColors[company.pillar] || 'bg-ink-faint/20 text-ink-tertiary'}`}>
              {company.pillarLabel}
            </span>
          </div>
          <ChevronDown
            className={`w-3 h-3 text-nav-text flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>

        {open && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-nav-surface rounded-lg border border-nav-border shadow-2xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
            {categories.map((cat, catIdx) => {
              const group = companies.filter((c) => c.category === cat && !c.parentId);
              if (group.length === 0) return null;
              const meta = categoryMeta[cat];
              const CatIcon = meta.icon;

              return (
                <div key={cat}>
                  {/* Category divider (not before first group) */}
                  {catIdx > 0 && <div className="mx-2.5 my-1 h-px bg-white/[0.06]" />}

                  {/* Category header */}
                  <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1">
                    {cat !== 'company' && <CatIcon className="w-3 h-3 text-white/20" strokeWidth={1.5} />}
                    <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.12em]">
                      {meta.label}
                    </span>
                  </div>

                  {group.map((c) => {
                    const isSelected = c.id === company.id;
                    return (
                      <React.Fragment key={c.id}>
                      <button
                        type="button"
                        onClick={() => { setCompanyId(c.id); setOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.06] ${
                          isSelected ? 'bg-white/[0.04]' : ''
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${initialsBg(c.category)}`}>
                          <span className={`text-[9px] font-bold ${initialsText(c.category)}`}>{c.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-medium text-white/90 truncate block">{c.shortName}</span>
                          <span className="text-[10px] text-nav-text truncate block">{c.industry} · {c.employees.toLocaleString()} emp</span>
                        </div>
                        {isSelected ? (
                          <Check className="w-3 h-3 text-blue flex-shrink-0" strokeWidth={2.5} />
                        ) : (
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
                            cat === 'conglomerate' ? 'bg-purple-500/10 text-purple-400' :
                            cat === 'sovereign' ? 'bg-emerald-500/10 text-emerald-400' :
                            pillarColors[c.pillar] || 'bg-ink-faint/20 text-ink-tertiary'
                          }`}>
                            {c.pillarLabel}
                          </span>
                        )}
                      </button>
                      {/* Sub-entities nested under parent */}
                      {companies.filter((sub) => sub.parentId === c.id).length > 0 && (
                        <div className="ml-3 border-l border-white/[0.06]">
                          {companies.filter((sub) => sub.parentId === c.id).map((sub) => {
                            const isSubSelected = sub.id === company.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => { setCompanyId(sub.id); setOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-white/[0.06] ${
                                  isSubSelected ? 'bg-white/[0.04]' : ''
                                }`}
                              >
                                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${initialsBg(sub.category)}`}>
                                  <span className={`text-[8px] font-bold ${initialsText(sub.category)}`}>{sub.initials}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[11px] font-medium text-white/80 truncate block">{sub.shortName}</span>
                                </div>
                                {isSubSelected && (
                                  <Check className="w-3 h-3 text-blue flex-shrink-0" strokeWidth={2.5} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 mt-2 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-4' : ''}>
            <div className="px-3 mb-1">
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.12em]">
                {section.title}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Cross-link to Command Center ────────── */}
      <div className="px-4 py-2 border-t border-nav-border">
        <a
          href={COMMAND_CENTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
        >
          View Assessment →
          <ExternalLink className="w-3 h-3" strokeWidth={2} />
        </a>
      </div>

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
