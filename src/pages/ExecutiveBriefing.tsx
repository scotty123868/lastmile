import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* ── Division data ──────────────────────────────────────── */

const divisions = [
  { name: 'Herzog Contracting Corp', shortName: 'Contracting', revenue: '$340M', impact: '$2.1M', topMetric: '22 workflows optimized', industry: 'Rail & Highway Construction' },
  { name: 'Herzog Railroad Services', shortName: 'Railroad', revenue: '$120M', impact: '$820K', topMetric: '8 workflows optimized', industry: 'Railroad Maintenance' },
  { name: 'Herzog Services', shortName: 'Services', revenue: '$65M', impact: '$680K', topMetric: '86% readiness score', industry: 'Ultrasonic Rail Testing' },
  { name: 'Herzog Technologies', shortName: 'Technologies', revenue: '$95M', impact: '$740K', topMetric: '10 workflows optimized', industry: 'Signal & PTC Systems' },
  { name: 'Herzog Transit Services', shortName: 'Transit', revenue: '$110M', impact: '$860K', topMetric: '10 workflows optimized', industry: 'Passenger Rail Ops' },
  { name: 'Herzog Energy', shortName: 'Energy', revenue: '$45M', impact: '$360K', topMetric: '88% readiness score', industry: 'Energy Infrastructure' },
  { name: 'Green Group LLC', shortName: 'Green Group', revenue: '$25M', impact: '$240K', topMetric: '2 workflows identified', industry: 'Environmental Services' },
];

/* ── Fade-in wrapper ────────────────────────────────────── */

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function ExecutiveBriefing() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-nav-bg text-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <FadeIn>
          <h1 className="text-5xl font-light text-white tracking-tight leading-tight">
            Herzog Companies
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-2xl text-slate-400 mt-4 font-light">
            Operations Intelligence Platform
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-sm text-slate-500 mt-6 font-mono tracking-wide">
            $800M Revenue&ensp;&middot;&ensp;7 Divisions&ensp;&middot;&ensp;62 Workflows Analyzed
          </p>
        </FadeIn>
      </section>

      {/* ── Thin rule ────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ── Operations Overview ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeIn>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-16">
            Operations Overview
          </h2>
        </FadeIn>

        <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
          {/* Stat 1 */}
          <FadeIn className="flex-1" delay={0.1}>
            <p className="text-4xl md:text-5xl font-light font-mono text-white tracking-tight">$3.6M</p>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[280px]">
              Verified annual impact from AI-assisted operations
            </p>
          </FadeIn>

          {/* Separator */}
          <div className="hidden md:block w-px h-20 bg-white/[0.08] mx-8 mt-2" />

          {/* Stat 2 */}
          <FadeIn className="flex-1" delay={0.2}>
            <p className="text-4xl md:text-5xl font-light font-mono text-white tracking-tight">62</p>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[280px]">
              Workflows analyzed across all divisions
            </p>
          </FadeIn>

          {/* Separator */}
          <div className="hidden md:block w-px h-20 bg-white/[0.08] mx-8 mt-2" />

          {/* Stat 3 */}
          <FadeIn className="flex-1" delay={0.3}>
            <p className="text-4xl md:text-5xl font-light font-mono text-white tracking-tight">84%</p>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[280px]">
              Average adoption rate across active teams
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Thin rule ────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ── Division Impact ──────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <FadeIn>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Division Impact
            </h2>
          </FadeIn>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-nav-bg to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-nav-bg to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollPaddingLeft: '1.5rem' }}
          >
            {divisions.map((div, i) => (
              <motion.div
                key={div.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="snap-start flex-shrink-0 w-[280px] rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-4"
              >
                <div>
                  <p className="text-[13px] font-medium text-white">{div.shortName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{div.industry}</p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div>
                  <p className="text-2xl font-light font-mono text-white tracking-tight">{div.impact}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Annual Impact</p>
                </div>

                <p className="text-[12px] text-slate-400">{div.topMetric}</p>

                <p className="text-[11px] text-slate-600 mt-auto">{div.revenue} revenue</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thin rule ────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <FadeIn>
          <Link
            to="/overview"
            className="group inline-flex items-center gap-2 text-lg text-blue hover:text-blue/80 transition-colors"
          >
            View Operations Dashboard
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
          </Link>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-[12px] text-slate-600 mt-8 font-light">
            Prepared exclusively for Herzog Companies&ensp;&middot;&ensp;March 2026
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
