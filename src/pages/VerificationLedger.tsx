import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { useCompany } from '../data/CompanyContext';

interface LedgerEntry {
  id: string;
  timestamp: string;
  workflow: string;
  agent: string;
  type: 'correction' | 'escalation' | 'approval' | 'flag';
  original: string;
  corrected: string;
  rationale: string;
  verifier: string;
  standard: string;
  confidence: number;
}

const meridianLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0847', timestamp: '3 min ago', workflow: 'Field Service Report Processing',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'Inspection interval: 12 months',
    corrected: 'Inspection interval: 6 months (NFPA 17A §6.1.2 — commercial kitchen)',
    rationale: 'AI defaulted to annual inspection cycle. NFPA 17A requires semi-annual for commercial kitchen wet chemical systems.',
    verifier: 'M. Rodriguez', standard: 'NFPA 17A §6.1.2', confidence: 94,
  },
  {
    id: 'VL-2026-0846', timestamp: '14 min ago', workflow: 'Invoice Reconciliation',
    agent: 'Reconciliation Agent', type: 'escalation',
    original: 'Grainger Invoice #GR-88421: $8,500.00',
    corrected: 'PO price: $7,750.00 — $750 overcharge flagged',
    rationale: 'Unit price discrepancy of 9.7% exceeds 5% threshold. Escalated to AP manager for vendor communication.',
    verifier: 'S. Park', standard: 'AP Policy §4.2 — variance threshold', confidence: 97,
  },
  {
    id: 'VL-2026-0845', timestamp: '28 min ago', workflow: 'Equipment Utilization Analysis',
    agent: 'Analytics Agent', type: 'approval',
    original: 'Vehicle NE-142: Utilization 38%, recommend reallocation',
    corrected: 'Vehicle NE-142: Utilization 38%, recommend reallocation to Southeast division',
    rationale: 'Utilization below 40% threshold confirmed. Southeast division request backlog validates reallocation.',
    verifier: 'J. Chen', standard: 'Fleet Policy §2.1', confidence: 96,
  },
  {
    id: 'VL-2026-0844', timestamp: '41 min ago', workflow: 'Compliance Documentation',
    agent: 'Document Generator', type: 'flag',
    original: 'Fire suppression system Type: ABC Dry Chemical',
    corrected: 'Fire suppression system Type: Wet Chemical (Ansul R-102)',
    rationale: 'AI misclassified system type based on partial equipment ID. Corrected via asset database cross-reference.',
    verifier: 'M. Rodriguez', standard: 'Equipment catalog lookup', confidence: 78,
  },
  {
    id: 'VL-2026-0843', timestamp: '52 min ago', workflow: 'Vendor Onboarding',
    agent: 'Entity Resolution', type: 'correction',
    original: 'Vendor: Johnstone Supply (new vendor)',
    corrected: 'Vendor: Johnstone Supply — existing vendor #VS-2241 (3 prior POs)',
    rationale: 'Duplicate vendor entry prevented. Name variation matched to existing record via fuzzy matching + EIN lookup.',
    verifier: 'Auto-verified', standard: 'Vendor dedup protocol', confidence: 99,
  },
  {
    id: 'VL-2026-0842', timestamp: '1 hr ago', workflow: 'Safety Inspection Report',
    agent: 'GPT-4o Extraction', type: 'correction',
    original: 'Next inspection due: 2027-03-19',
    corrected: 'Next inspection due: 2026-09-19 (semi-annual requirement)',
    rationale: 'AI calculated annual interval. State of Connecticut requires semi-annual for commercial occupancy.',
    verifier: 'M. Rodriguez', standard: 'CT Fire Code §29-305', confidence: 91,
  },
];

const oakwoodLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-1204', timestamp: '1 min ago', workflow: 'Claims Intake Processing',
    agent: 'Document Intelligence', type: 'correction',
    original: 'Vehicle: 2022 Hnd Acc — blue',
    corrected: 'Vehicle: 2022 Honda Accord EX-L — VIN: 1HGCV2F34NA012847, Obsidian Blue Pearl',
    rationale: 'OCR abbreviation resolved via VIN lookup against policy database. Color code matched to Honda paint catalog.',
    verifier: 'K. Thompson', standard: 'ACORD Claims Standard §3.2', confidence: 87,
  },
  {
    id: 'VL-2026-1203', timestamp: '8 min ago', workflow: 'Legacy Policy Migration',
    agent: 'Schema Mapper', type: 'correction',
    original: 'Coverage code: BPP-FL',
    corrected: 'Coverage: Business Personal Property — Flood Extension (Guidewire: CovType.BPP_FLOOD_EXT)',
    rationale: 'Legacy AS/400 internal code translated via coverage manual cross-reference. No direct ACORD equivalent.',
    verifier: 'R. Walsh', standard: 'Migration Protocol §7.1 — code translation', confidence: 92,
  },
  {
    id: 'VL-2026-1202', timestamp: '22 min ago', workflow: 'Renewal Risk Reassessment',
    agent: 'Analytics Agent', type: 'escalation',
    original: 'Policy #OAK-2023-14422: Recommended 34% rate increase',
    corrected: 'Rate increase capped at 25% per state regulation. Exception filed.',
    rationale: 'Connecticut DOI filing limit is 25% without prior approval. Rate capped, excess risk flagged for reinsurance review.',
    verifier: 'L. Martinez', standard: 'CT DOI Reg. §38a-665', confidence: 96,
  },
  {
    id: 'VL-2026-1201', timestamp: '35 min ago', workflow: 'Claims Intake Processing',
    agent: 'Risk Engine', type: 'flag',
    original: 'Claim #OAK-C-2026-4412: Standard processing',
    corrected: 'Elevated to SIU review — 3 prior claims in 18 months, all single-vehicle',
    rationale: 'Frequency pattern triggered SIU flag. Not confirmed fraud, but warrants investigation per underwriting guidelines.',
    verifier: 'Auto-flagged', standard: 'SIU Protocol §2.4 — frequency trigger', confidence: 82,
  },
];

const pinnacleLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0512', timestamp: '3 min ago', workflow: 'Clinical Note Summarization',
    agent: 'Clinical AI', type: 'correction',
    original: 'Assessment: Patient presents with acute bronchitis. Rx: Amoxicillin 500mg TID x 10 days.',
    corrected: 'Assessment: Acute bronchitis (viral, likely). No antibiotic indicated per guidelines. Supportive care recommended.',
    rationale: 'Provider Dr. Patel reviewed and removed antibiotic. Acute bronchitis is predominantly viral — antibiotics not indicated per ACP/CDC guidelines.',
    verifier: 'Dr. R. Patel', standard: 'ACP Clinical Guideline — Acute Bronchitis', confidence: 91,
  },
  {
    id: 'VL-2026-0511', timestamp: '11 min ago', workflow: 'Prior Authorization',
    agent: 'Clinical AI', type: 'correction',
    original: 'Clinical narrative: Patient has chronic back pain',
    corrected: 'Patient has experienced chronic lumbar pain for 8+ months with documented failed conservative treatment (PT x 12 sessions, NSAIDs, epidural injection)',
    rationale: 'Payer requires specific duration and failed conservative treatment documentation for MRI authorization. Original lacked required detail.',
    verifier: 'S. Chen', standard: 'Aetna PA Requirements — Lumbar MRI', confidence: 94,
  },
  {
    id: 'VL-2026-0510', timestamp: '24 min ago', workflow: 'Patient Scheduling',
    agent: 'Scheduling AI', type: 'approval',
    original: 'Scheduled: Dr. Kim, Mar 24, 2:30 PM',
    corrected: 'Confirmed. Insurance verified: Aetna PPO, copay $30, no referral required.',
    rationale: 'Scheduling confirmed with real-time insurance eligibility check. No manual intervention required.',
    verifier: 'Auto-verified', standard: 'Scheduling Protocol §1.1', confidence: 99,
  },
];

const atlasLedger: LedgerEntry[] = [
  {
    id: 'VL-2026-0923', timestamp: '4 min ago', workflow: 'Predictive Maintenance',
    agent: 'Predictive Model', type: 'flag',
    original: 'Machine AK-CNC-07: Normal operating range',
    corrected: 'Spindle vibration 2.3σ above baseline. Bearing wear pattern consistent with L10 life prediction.',
    rationale: 'Vibration signature matched to known bearing degradation pattern. OEM recommends replacement at 2.0σ threshold.',
    verifier: 'T. Nakamura', standard: 'ISO 10816-3 — Vibration Severity', confidence: 88,
  },
  {
    id: 'VL-2026-0922', timestamp: '18 min ago', workflow: 'Cross-Plant Inventory',
    agent: 'Optimization Agent', type: 'correction',
    original: 'Consolidate all bearing purchases to Timken (single vendor)',
    corrected: 'Consolidate 3 plants to Timken. Guadalajara keeps local supplier — import duty + 3-week lead time.',
    rationale: 'Cross-border logistics make single-vendor consolidation impractical for Guadalajara facility. Local supplier retained.',
    verifier: 'P. Okafor', standard: 'Procurement Policy §5.3 — lead time constraint', confidence: 95,
  },
  {
    id: 'VL-2026-0921', timestamp: '9 min ago', workflow: 'Quality Inspection',
    agent: 'Validation Engine', type: 'escalation',
    original: 'Lot #DET-2026-0312: Material meets specification',
    corrected: 'HOLD — tensile strength 122 ksi below AMS-6415 minimum 125 ksi. Engineering disposition required.',
    rationale: 'Auto-classification passed material based on partial spec match. Full AMS-6415 spec check caught 2.4% deviation.',
    verifier: 'D. Kowalski', standard: 'AMS-6415 Rev H — Mechanical Properties', confidence: 99,
  },
];

function getLedgerForCompany(id: string): LedgerEntry[] {
  switch (id) {
    case 'meridian': return meridianLedger;
    case 'oakwood': return oakwoodLedger;
    case 'pinnacle': return pinnacleLedger;
    case 'atlas': return atlasLedger;
    default: return meridianLedger;
  }
}

const typeConfig = {
  correction: { icon: ShieldCheck, label: 'Correction', color: 'text-blue', bg: 'bg-blue-muted' },
  escalation: { icon: ShieldAlert, label: 'Escalation', color: 'text-amber', bg: 'bg-amber-muted' },
  approval: { icon: CheckCircle2, label: 'Approved', color: 'text-green', bg: 'bg-green-muted' },
  flag: { icon: ShieldAlert, label: 'Flag', color: 'text-red', bg: 'bg-red-muted' },
};

function LedgerRow({ entry, index }: { entry: LedgerEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tc = typeConfig[entry.type];
  const Icon = tc.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-border last:border-0"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-3.5 hover:bg-surface-sunken/40 transition-colors cursor-pointer flex items-start gap-4"
      >
        <div className={`mt-0.5 p-1 rounded ${tc.bg}`}>
          <Icon className={`w-3.5 h-3.5 ${tc.color}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-ink">{entry.workflow}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tc.color} ${tc.bg}`}>{tc.label}</span>
          </div>
          <p className="text-[12px] text-ink-secondary mt-0.5 line-clamp-1">{entry.corrected}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] text-ink-tertiary tabular-nums hidden sm:block">{entry.id}</span>
          <div className="flex items-center gap-1 text-ink-faint">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] tabular-nums">{entry.timestamp}</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 ml-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-surface-sunken border border-border-subtle">
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Original Output</div>
                  <p className="text-[12px] text-ink-secondary leading-relaxed">{entry.original}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Corrected Output</div>
                  <p className="text-[12px] text-ink font-medium leading-relaxed">{entry.corrected}</p>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Rationale</div>
                  <p className="text-[12px] text-ink-secondary leading-relaxed">{entry.rationale}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Verified By</div>
                  <p className="text-[12px] text-ink">{entry.verifier}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Evidence Standard</div>
                  <p className="text-[12px] text-ink">{entry.standard}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Agent</div>
                  <p className="text-[12px] text-ink">{entry.agent}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-blue" style={{ width: `${entry.confidence}%` }} />
                    </div>
                    <span className="text-[12px] tabular-nums font-medium text-ink">{entry.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VerificationLedger() {
  const { company } = useCompany();
  const entries = getLedgerForCompany(company.id);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.type === filter);
  const counts = {
    all: entries.length,
    correction: entries.filter((e) => e.type === 'correction').length,
    escalation: entries.filter((e) => e.type === 'escalation').length,
    flag: entries.filter((e) => e.type === 'flag').length,
    approval: entries.filter((e) => e.type === 'approval').length,
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink tracking-tight">Verification Ledger</h1>
        <p className="text-[13px] text-ink-tertiary mt-1">Every AI decision, correction, and escalation — auditable and traceable</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {(['all', 'correction', 'escalation', 'flag', 'approval'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-ink text-white'
                : 'bg-surface-raised border border-border text-ink-secondary hover:bg-surface-sunken'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1 tabular-nums opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Ledger table */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
        {filtered.map((entry, i) => (
          <LedgerRow key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}
