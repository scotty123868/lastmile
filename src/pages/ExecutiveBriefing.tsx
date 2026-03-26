import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Activity, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PreliminaryBanner from '../components/PreliminaryBanner';

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ExecutiveBriefing() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-16">
      <PreliminaryBanner />

      {/* Hero Finding */}
      <div className="bg-nav-bg rounded-2xl px-10 py-14 text-white">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/40 mb-3">Operations Intelligence Summary</p>
          <h1 className="text-4xl font-light leading-tight text-ink">
            <span className="text-[#22C55E] font-normal">$3.6M</span> in verified annual impact
            <br />across Herzog Companies operations.
          </h1>
          <p className="text-ink/50 mt-4 text-lg max-w-2xl">
            62 workflows analyzed, 84% average adoption rate — here's what's already working
            and where the biggest gains remain.
          </p>
        </FadeIn>
      </div>

      {/* Three Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FadeIn delay={0.05}>
          <div className="bg-surface-card rounded-xl border border-border p-6 h-full">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Verified Impact</p>
            <p className="text-3xl font-mono font-bold text-emerald-500">$3.6M</p>
            <p className="text-sm text-ink/50 mt-2">Annual savings from AI-assisted operations across all divisions.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-surface-card rounded-xl border border-border p-6 h-full">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Workflows Automated</p>
            <p className="text-3xl font-mono font-bold text-blue-500">62</p>
            <p className="text-sm text-ink/50 mt-2">Track inspection, crew dispatch, equipment management, compliance reporting.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-surface-card rounded-xl border border-border p-6 h-full">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Team Adoption</p>
            <p className="text-3xl font-mono font-bold text-purple-500">84%</p>
            <p className="text-sm text-ink/50 mt-2">Average adoption rate across active teams. Target: 95%+.</p>
          </div>
        </FadeIn>
      </div>

      {/* Division Impact Quick View */}
      <FadeIn delay={0.1}>
        <div className="bg-surface-card rounded-xl border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-[0.15em] text-ink/40">Impact by Division</p>
            <button onClick={() => navigate('/impact')} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer">
              View Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Herzog Contracting Corp', impact: '$1.2M', pct: 33 },
              { name: 'Herzog Transit Services', impact: '$560K', pct: 16 },
              { name: 'Herzog Technologies', impact: '$520K', pct: 14 },
              { name: 'Herzog Railroad Services', impact: '$480K', pct: 13 },
              { name: 'Other divisions', impact: '$840K', pct: 24 },
            ].map((div) => (
              <div key={div.name} className="flex items-center gap-4">
                <span className="text-sm text-ink w-48 flex-shrink-0">{div.name}</span>
                <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${div.pct}%` }} />
                </div>
                <span className="text-sm font-mono font-medium text-ink w-16 text-right">{div.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.1}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">Explore the full operations dashboard</p>
            <p className="text-blue-200 text-sm mt-1">Real-time workflows, adoption tracking, impact verification</p>
          </div>
          <button onClick={() => navigate('/overview')} className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0">
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
