import { motion } from 'framer-motion';
import {
  DollarSign,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

/* ── Types ───────────────────────────────────────────────── */

interface ImpactCategory {
  label: string;
  amount: number;
  description: string;
  icon: 'shield' | 'zap' | 'users' | 'cost';
  type: 'saving' | 'cost';
}

interface WaterfallBar {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
}

interface KeyMetric {
  label: string;
  value: string;
  subtext?: string;
}

interface CompanyImpactData {
  totalAnnualImpact: number;
  categories: ImpactCategory[];
  waterfall: WaterfallBar[];
  metrics: KeyMetric[];
}

/* ── Company-specific data ───────────────────────────────── */

const impactData: Record<string, CompanyImpactData> = {
  meridian: {
    totalAnnualImpact: 2800000,
    categories: [
      { label: 'Verification Catches', amount: 920000, description: 'Prevented billing errors, compliance misses, and duplicate vendor entries', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1440000, description: 'Field reports, invoice reconciliation, and equipment tracking automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 680000, description: 'Cycle time reductions from higher tool adoption across field teams', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -240000, description: 'Platform license, integration setup, and training program investment', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 920000, type: 'positive' },
      { label: 'Automation', value: 1440000, type: 'positive' },
      { label: 'Adoption', value: 680000, type: 'positive' },
      { label: 'Costs', value: -240000, type: 'negative' },
      { label: 'Net Impact', value: 2800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '165%' },
      { label: 'Verified Accuracy', value: '97.4%' },
      { label: 'Exception Resolution', value: '1.8 hrs', subtext: 'down from 6.2 hrs' },
    ],
  },
  oakwood: {
    totalAnnualImpact: 4200000,
    categories: [
      { label: 'Verification Catches', amount: 1840000, description: 'Fraud flags, rate cap compliance, and claims accuracy corrections', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 1920000, description: 'Claims intake, policy migration, and renewal assessments automated', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 840000, description: 'Faster claims cycle from adjuster teams adopting AI-assisted workflows', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -400000, description: 'Platform license, AS/400 integration, legacy migration tooling', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1840000, type: 'positive' },
      { label: 'Automation', value: 1920000, type: 'positive' },
      { label: 'Adoption', value: 840000, type: 'positive' },
      { label: 'Costs', value: -400000, type: 'negative' },
      { label: 'Net Impact', value: 4200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.8 mo' },
      { label: 'Year 1 ROI', value: '142%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '2.4 hrs', subtext: 'down from 14 hrs' },
    ],
  },
  pinnacle: {
    totalAnnualImpact: 1400000,
    categories: [
      { label: 'Verification Catches', amount: 480000, description: 'Antibiotic stewardship, PA documentation completeness, coding accuracy', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 620000, description: 'Clinical notes, prior auth, scheduling, and insurance verification', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 440000, description: 'Provider time savings from clinical AI tool adoption', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -140000, description: 'Platform license, Epic integration, and provider training', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 480000, type: 'positive' },
      { label: 'Automation', value: 620000, type: 'positive' },
      { label: 'Adoption', value: 440000, type: 'positive' },
      { label: 'Costs', value: -140000, type: 'negative' },
      { label: 'Net Impact', value: 1400000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '2.8 mo' },
      { label: 'Year 1 ROI', value: '208%' },
      { label: 'Verified Accuracy', value: '98.1%' },
      { label: 'Exception Resolution', value: '4 min', subtext: 'down from 22 min' },
    ],
  },
  atlas: {
    totalAnnualImpact: 5100000,
    categories: [
      { label: 'Verification Catches', amount: 1680000, description: 'Material spec failures, procurement consolidation corrections, quality holds', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 2240000, description: 'Predictive maintenance, cross-plant inventory, quality inspection', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 1680000, description: 'Floor worker efficiency gains and procurement cycle improvements', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -500000, description: 'Platform license, IoT gateway, SAP integration, multi-plant rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 1680000, type: 'positive' },
      { label: 'Automation', value: 2240000, type: 'positive' },
      { label: 'Adoption', value: 1680000, type: 'positive' },
      { label: 'Costs', value: -500000, type: 'negative' },
      { label: 'Net Impact', value: 5100000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.4 mo' },
      { label: 'Year 1 ROI', value: '162%' },
      { label: 'Verified Accuracy', value: '97.2%' },
      { label: 'Exception Resolution', value: '0.6 hrs', subtext: 'down from 2.5 hrs' },
    ],
  },
  northbridge: {
    totalAnnualImpact: 18200000,
    categories: [
      { label: 'Verification Catches', amount: 6400000, description: 'Cross-OpCo compliance corrections, procurement accuracy, and duplicate detection across 12 operating companies', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 8200000, description: 'Supply chain optimization, financial close automation, and predictive maintenance across industrial fleet', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 5600000, description: 'Workforce efficiency gains across 42,000 employees spanning aerospace, energy, financial, and health sciences divisions', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -2000000, description: 'Enterprise platform license, multi-OpCo integration, change management, and global rollout', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 6400000, type: 'positive' },
      { label: 'Automation', value: 8200000, type: 'positive' },
      { label: 'Adoption', value: 5600000, type: 'positive' },
      { label: 'Costs', value: -2000000, type: 'negative' },
      { label: 'Net Impact', value: 18200000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '5.0 mo' },
      { label: 'Year 1 ROI', value: '134%' },
      { label: 'Verified Accuracy', value: '96.8%' },
      { label: 'Exception Resolution', value: '2.2 hrs', subtext: 'down from 8.4 hrs' },
    ],
  },
  estonia: {
    totalAnnualImpact: 14800000,
    categories: [
      { label: 'Verification Catches', amount: 4200000, description: 'Tax compliance accuracy corrections, benefit eligibility verification, and cross-ministry data validation', icon: 'shield', type: 'saving' },
      { label: 'Process Automation', amount: 6800000, description: 'Citizen services automation, inter-ministry data flows, and healthcare records integration via X-Road', icon: 'zap', type: 'saving' },
      { label: 'Adoption Uplift', amount: 5200000, description: 'Civil servant productivity gains across 8 ministries and agencies, leveraging existing digital infrastructure', icon: 'users', type: 'saving' },
      { label: 'Implementation Cost', amount: -1400000, description: 'Gov AI platform license, X-Road AI layer, ministry onboarding, and training programs', icon: 'cost', type: 'cost' },
    ],
    waterfall: [
      { label: 'Verification', value: 4200000, type: 'positive' },
      { label: 'Automation', value: 6800000, type: 'positive' },
      { label: 'Adoption', value: 5200000, type: 'positive' },
      { label: 'Costs', value: -1400000, type: 'negative' },
      { label: 'Net Impact', value: 14800000, type: 'total' },
    ],
    metrics: [
      { label: 'Payback Period', value: '4.2 mo' },
      { label: 'Year 1 ROI', value: '152%' },
      { label: 'Verified Accuracy', value: '97.8%' },
      { label: 'Exception Resolution', value: '1.4 hrs', subtext: 'down from 6.8 hrs' },
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function formatDollars(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(abs / 1000).toFixed(0)}K`;
  return `$${abs.toLocaleString()}`;
}

const categoryIcons = {
  shield: ShieldCheck,
  zap: Zap,
  users: Users,
  cost: DollarSign,
};

function MetricIcon({ label }: { label: string }) {
  if (label.includes('Payback')) return <Clock className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  if (label.includes('ROI')) return <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  if (label.includes('Accuracy')) return <Target className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
  return <CheckCircle2 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />;
}

/* ── Main ────────────────────────────────────────────────── */

export default function Impact() {
  const { company } = useCompany();
  const data = impactData[company.id] || impactData.meridian;

  // For waterfall: compute cumulative positions for CSS bars
  const grossSavings = data.categories.filter((c) => c.type === 'saving').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Impact</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">ROI and business impact for {company.shortName}</p>
      </div>

      {/* Hero number */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 px-6 py-6 rounded-xl bg-surface-raised border border-border text-center"
      >
        <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Total Annual Impact</div>
        <div className="text-[42px] font-semibold text-ink tabular-nums tracking-tight leading-none">
          {formatDollars(data.totalAnnualImpact)}
        </div>
        <div className="text-[13px] text-ink-tertiary mt-2">net projected savings per year</div>
      </motion.div>

      {/* Category breakdown */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Impact Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.categories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon];
            const isCost = cat.type === 'cost';
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-surface-raised border border-border rounded-xl px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isCost ? 'bg-red-muted' : 'bg-green-muted'}`}>
                    <Icon className={`w-4 h-4 ${isCost ? 'text-red' : 'text-green'}`} strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">{cat.label}</span>
                      <span className={`text-[16px] font-semibold tabular-nums tracking-tight ${isCost ? 'text-red' : 'text-green'}`}>
                        {isCost ? '-' : '+'}{formatDollars(cat.amount)}
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-tertiary mt-1 leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Savings waterfall */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Savings Waterfall</h2>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl p-5">
          <div className="space-y-3">
            {data.waterfall.map((bar, i) => {
              const barWidth = Math.abs(bar.value) / grossSavings * 100;
              let barColor = 'bg-green';
              if (bar.type === 'negative') barColor = 'bg-red';
              if (bar.type === 'total') barColor = 'bg-blue';

              return (
                <motion.div
                  key={bar.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-ink">{bar.label}</span>
                    <span className={`text-[12px] font-semibold tabular-nums ${
                      bar.type === 'negative' ? 'text-red' : bar.type === 'total' ? 'text-blue' : 'text-green'
                    }`}>
                      {bar.value < 0 ? '-' : ''}{formatDollars(bar.value)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-[14px] font-semibold text-ink">Key Metrics</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <MetricIcon label={metric.label} />
              </div>
              <div className="text-[20px] font-semibold text-ink tabular-nums tracking-tight">{metric.value}</div>
              <div className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wider mt-1">{metric.label}</div>
              {metric.subtext && (
                <div className="text-[10px] text-ink-faint mt-0.5">{metric.subtext}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
