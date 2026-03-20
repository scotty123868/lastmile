import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info, Shield, User, BookOpen, Gauge } from 'lucide-react';

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

interface EnrichedData {
  severity: 'critical' | 'warning' | 'info';
  flagDescription: string;
  evidenceChain: string[];
  impact: string[];
  timeline: { time: string; event: string }[];
  highlightedOriginal: { before: string; flagged: string; after: string };
  highlightedCorrected: { before: string; fixed: string; after: string };
}

const enrichedEntries: Record<string, EnrichedData> = {
  'VL-2026-0844': {
    severity: 'critical',
    flagDescription: 'Fire suppression system misclassified — wrong suppression agent type',
    evidenceChain: [
      'Field service report PDF uploaded from technician tablet',
      'GPT-4o extraction parsed equipment type field',
      'AI classified system as "ABC Dry Chemical" based on partial equipment ID prefix',
      'Verification rule cross-referenced asset database — Asset #FA-2847 is Ansul R-102 (Wet Chemical)',
      'Mismatch flagged — wrong suppression agent type would invalidate inspection',
      'Human reviewer M. Rodriguez confirmed wet chemical classification',
      'Corrected output logged to verification ledger',
    ],
    impact: [
      'Incorrect suppression agent type on inspection report violates NFPA 17A',
      'Commercial kitchen served by this system would have invalid fire marshal documentation',
      'Potential $25,000 fine per inspection period under state fire code',
      'Liability exposure if suppression system fails during fire event',
    ],
    timeline: [
      { time: '10:42:18', event: 'PDF ingested from field tablet — J. Morales, site #NE-4412' },
      { time: '10:42:19', event: 'GPT-4o extraction started — 14 fields detected' },
      { time: '10:42:20', event: 'Equipment type classified as "ABC Dry Chemical"' },
      { time: '10:42:20', event: 'Verification rule: cross-reference asset database' },
      { time: '10:42:21', event: 'Asset #FA-2847 lookup — Ansul R-102 Wet Chemical system' },
      { time: '10:42:21', event: 'FLAG: Equipment type mismatch (AI: Dry Chemical \u2260 DB: Wet Chemical)' },
      { time: '10:42:24', event: 'Routed to M. Rodriguez for human verification' },
      { time: '10:43:01', event: 'M. Rodriguez confirmed: Wet Chemical (Ansul R-102)' },
      { time: '10:43:02', event: 'Correction applied and logged to verification ledger' },
    ],
    highlightedOriginal: {
      before: 'Fire suppression system Type: ',
      flagged: 'ABC Dry Chemical',
      after: '',
    },
    highlightedCorrected: {
      before: 'Fire suppression system Type: ',
      fixed: 'Wet Chemical (Ansul R-102)',
      after: '',
    },
  },
  'VL-2026-1201': {
    severity: 'warning',
    flagDescription: 'Claim frequency pattern triggered SIU fraud investigation flag',
    evidenceChain: [
      'FNOL submitted via mobile app for single-vehicle collision',
      'Risk Engine ingested claim and ran pattern analysis',
      'Cross-referenced claimant history — 3 prior claims in 18 months',
      'All prior claims were single-vehicle incidents with similar damage profiles',
      'Frequency trigger rule exceeded threshold (>2 single-vehicle claims in 24 months)',
      'Auto-flagged for Special Investigations Unit review',
      'Claim routed to SIU queue with full pattern dossier attached',
    ],
    impact: [
      'If processed as standard claim, potential fraudulent payout of $18,000-$32,000',
      'Failure to flag pattern violates state insurance fraud reporting requirements',
      'Accumulated exposure across similar patterns could exceed $500K annually',
      'Regulatory audit risk — DOI expects documented SIU referral protocols',
    ],
    timeline: [
      { time: '14:22:08', event: 'FNOL received — Claim #OAK-C-2026-4412, single-vehicle collision' },
      { time: '14:22:09', event: 'Document Intelligence parsed police report and photos' },
      { time: '14:22:10', event: 'Risk Engine initiated pattern analysis' },
      { time: '14:22:11', event: 'Claimant history pull — 3 prior claims identified (18-month window)' },
      { time: '14:22:11', event: 'Pattern match: all single-vehicle, similar damage ($15K-$28K range)' },
      { time: '14:22:12', event: 'FLAG: SIU frequency trigger — exceeds 2-claim threshold' },
      { time: '14:22:12', event: 'Claim elevated from standard processing to SIU review queue' },
      { time: '14:22:15', event: 'SIU dossier generated with full claim history and pattern analysis' },
    ],
    highlightedOriginal: {
      before: 'Claim #OAK-C-2026-4412: ',
      flagged: 'Standard processing',
      after: '',
    },
    highlightedCorrected: {
      before: '',
      fixed: 'Elevated to SIU review',
      after: ' — 3 prior claims in 18 months, all single-vehicle',
    },
  },
  'VL-2026-0923': {
    severity: 'warning',
    flagDescription: 'CNC spindle vibration anomaly — bearing wear pattern detected above OEM threshold',
    evidenceChain: [
      'IoT sensor stream from machine AK-CNC-07 captured vibration data at 1Hz',
      'Predictive model analyzed spectral signature against baseline profile',
      'Vibration amplitude measured at 2.3 standard deviations above baseline',
      'Pattern matched to known bearing degradation signature in training data',
      'OEM recommends preventive action at 2.0\u03C3 threshold — current reading exceeds limit',
      'T. Nakamura (plant engineer) reviewed vibration spectra and confirmed bearing wear',
      'Preventive maintenance work order generated with parts list',
    ],
    impact: [
      'Unplanned CNC failure would cause 4-8 hours of production downtime',
      'Estimated lost production value: $12,000-$24,000 per incident',
      'Catastrophic spindle failure could damage workpiece and require $45K spindle replacement',
      'Downstream assembly line stoppage affecting 3 dependent work cells',
    ],
    timeline: [
      { time: '06:14:00', event: 'Sensor telemetry stream — AK-CNC-07 vibration data ingested' },
      { time: '06:14:02', event: 'Anomaly detection model processed 24-hour rolling window' },
      { time: '06:14:03', event: 'Spindle vibration: 2.3\u03C3 above baseline (threshold: 2.0\u03C3)' },
      { time: '06:14:03', event: 'Pattern classifier: bearing wear signature (87% confidence)' },
      { time: '06:14:04', event: 'FLAG: Exceeds ISO 10816-3 vibration severity threshold' },
      { time: '06:14:08', event: 'Alert sent to T. Nakamura (plant engineer)' },
      { time: '06:18:42', event: 'T. Nakamura confirmed: bearing wear consistent with L10 life prediction' },
      { time: '06:19:01', event: 'Preventive maintenance work order #WO-2026-0447 created' },
    ],
    highlightedOriginal: {
      before: 'Machine AK-CNC-07: ',
      flagged: 'Normal operating range',
      after: '',
    },
    highlightedCorrected: {
      before: 'Spindle vibration ',
      fixed: '2.3\u03C3 above baseline',
      after: '. Bearing wear pattern consistent with L10 life prediction.',
    },
  },
  'VL-2026-1845': {
    severity: 'critical',
    flagDescription: 'Cross-OpCo duplicate purchase order detected — same supplier, same parts, different OpCos paying different prices',
    evidenceChain: [
      'Procurement consolidation workflow ingested supplier master data from 12 OpCo SAP instances',
      'Entity Resolution deduplicated 8,400 vendor entries to 5,200 unique suppliers',
      'Analytics Agent ran cross-OpCo price comparison for shared suppliers',
      'Detected Northbridge Aerospace and Northbridge Energy both ordering Ti-6Al-4V alloy from Titanium Metals Corp',
      'Price variance: Aerospace pays $142/kg, Energy pays $174/kg — 22% difference for identical material',
      'Consolidated volume PO negotiation would achieve $138/kg — saving $340K annually',
      'P. Morrison (VP Procurement) reviewed and confirmed consolidation recommendation',
    ],
    impact: [
      '$340K annual overspend on titanium alloy alone across two operating companies',
      'Procurement policy violation — company policy requires cross-OpCo sourcing review for shared materials >$1M',
      'Supplier leverage erosion — Titanium Metals Corp knows Northbridge entities are not coordinating purchases',
      'Pattern likely repeats across other commodity categories — estimated $4.8M total cross-OpCo procurement waste',
    ],
    timeline: [
      { time: '08:14:00', event: 'Supplier master data ingested from 12 SAP instances — 8,400 vendor entries' },
      { time: '08:14:14', event: 'Entity Resolution: 8,400 entries deduplicated to 5,200 unique suppliers' },
      { time: '08:14:42', event: 'Price harmonization analysis started — comparing prices across OpCos' },
      { time: '08:15:00', event: '340 items with >15% price variance detected across shared suppliers' },
      { time: '08:15:02', event: 'FLAG: Ti-6Al-4V alloy — Aerospace $142/kg vs Energy $174/kg (22% variance)' },
      { time: '08:15:03', event: 'Consolidated volume price calculated: $138/kg at combined volume' },
      { time: '08:15:08', event: 'Alert sent to P. Morrison (VP Procurement)' },
      { time: '08:22:14', event: 'P. Morrison confirmed: consolidate to single PO at negotiated rate' },
      { time: '08:22:15', event: 'Correction logged to verification ledger — procurement rules updated' },
    ],
    highlightedOriginal: {
      before: 'Separate POs to Titanium Metals Corp \u2014 Aerospace: ',
      flagged: '$142/kg',
      after: ', Energy: $174/kg',
    },
    highlightedCorrected: {
      before: 'Consolidated PO at negotiated volume price ',
      fixed: '$138/kg',
      after: ' \u2014 $340K annual savings',
    },
  },
  'VL-2026-2202': {
    severity: 'warning',
    flagDescription: 'Citizen benefit eligibility mismatch — income data from Tax Board conflicts with Social Insurance Board records',
    evidenceChain: [
      'Citizen Benefits Eligibility Engine received daily batch of 2,140 benefit applications',
      'X-Road Data Agent queried Tax Board (EMTA) for income verification',
      'X-Road Data Agent queried Social Insurance Board (SKA) for registered income',
      'Tax Board reports applicant income as \u20AC42,000 (employment + freelance)',
      'Social Insurance Board shows registered income as \u20AC28,000 (employment only)',
      'Discrepancy of \u20AC14,000 exceeds 10% threshold — likely unreported freelance income to SKA',
      'Benefit eligibility based on \u20AC28,000 would approve family benefit; actual income of \u20AC42,000 exceeds threshold',
      'Case flagged for investigation by Social Insurance case officer M. Kask',
    ],
    impact: [
      'Potential benefit overpayment of \u20AC8,400 annually if processed without cross-reference',
      'Tax compliance investigation trigger — unreported income to Social Insurance Board',
      'Pattern may indicate systematic underreporting — 180 similar cases flagged in current batch',
      'Estimated \u20AC1.2M in annual benefit overpayments across similar discrepancy patterns',
    ],
    timeline: [
      { time: '09:00:00', event: 'Daily benefit application batch received — 2,140 applications' },
      { time: '09:00:12', event: 'X-Road cross-ministry data stitching initiated' },
      { time: '09:00:14', event: 'EMTA (Tax Board) query: Applicant #EE-2026-44821 income \u20AC42,000' },
      { time: '09:00:14', event: 'SKA (Social Insurance) query: Registered income \u20AC28,000' },
      { time: '09:00:15', event: 'FLAG: Income mismatch \u20AC42,000 vs \u20AC28,000 — \u20AC14,000 discrepancy (33%)' },
      { time: '09:00:15', event: 'Benefit eligibility recalculated using Tax Board income — exceeds threshold' },
      { time: '09:00:16', event: 'Application suspended pending investigation' },
      { time: '09:00:18', event: 'Case assigned to M. Kask (Social Insurance case officer)' },
    ],
    highlightedOriginal: {
      before: 'Applicant #EE-2026-44821: Income ',
      flagged: '\u20AC28,000 (Social Insurance)',
      after: ' \u2014 eligible for family benefit',
    },
    highlightedCorrected: {
      before: 'Tax Board reports income ',
      fixed: '\u20AC42,000',
      after: ' \u2014 exceeds eligibility threshold. Benefit suspended pending investigation.',
    },
  },
  'VL-2026-0512': {
    severity: 'critical',
    flagDescription: 'Unnecessary antibiotic prescribed for viral bronchitis — contradicts clinical guidelines',
    evidenceChain: [
      'Ambient encounter recording transcribed by Whisper v3',
      'Clinical AI generated SOAP note with assessment and treatment plan',
      'AI included Amoxicillin 500mg TID for acute bronchitis diagnosis',
      'Verification rule: ACP/CDC guideline check for antibiotic appropriateness',
      'Acute bronchitis is predominantly viral — antibiotics not indicated',
      'Dr. R. Patel reviewed and removed antibiotic from treatment plan',
      'Corrected note logged with guideline reference',
    ],
    impact: [
      'Unnecessary antibiotic use contributes to antimicrobial resistance',
      'Patient exposed to avoidable side effects (GI upset, allergic reaction risk)',
      'Violates CMS antibiotic stewardship quality measure — affects practice quality score',
      'Potential malpractice exposure if adverse drug reaction occurs from unnecessary prescription',
    ],
    timeline: [
      { time: '09:15:00', event: 'Encounter audio recording started — Dr. Patel, Patient #PH-2024-8847' },
      { time: '09:29:00', event: 'Encounter complete — 14 minutes recorded' },
      { time: '09:29:08', event: 'Whisper v3 transcription complete — speaker diarization applied' },
      { time: '09:29:14', event: 'Clinical AI generated SOAP note with ICD-10: J20.9 (Acute bronchitis)' },
      { time: '09:29:15', event: 'Treatment plan included: Amoxicillin 500mg TID x 10 days' },
      { time: '09:29:15', event: 'FLAG: ACP guideline check — antibiotics not indicated for acute bronchitis' },
      { time: '09:29:20', event: 'Note flagged and routed to Dr. Patel for review' },
      { time: '09:30:48', event: 'Dr. Patel removed antibiotic, confirmed supportive care plan' },
      { time: '09:30:49', event: 'Corrected note signed and logged to verification ledger' },
    ],
    highlightedOriginal: {
      before: 'Assessment: Patient presents with acute bronchitis. Rx: ',
      flagged: 'Amoxicillin 500mg TID x 10 days',
      after: '.',
    },
    highlightedCorrected: {
      before: 'Assessment: Acute bronchitis (viral, likely). ',
      fixed: 'No antibiotic indicated per guidelines. Supportive care recommended.',
      after: '',
    },
  },
};

function getDefaultEnrichedData(entry: LedgerEntry): EnrichedData {
  const severityMap: Record<string, 'critical' | 'warning' | 'info'> = {
    flag: 'warning',
    correction: 'info',
    escalation: 'warning',
    approval: 'info',
  };

  return {
    severity: severityMap[entry.type] || 'info',
    flagDescription: entry.rationale.split('.')[0],
    evidenceChain: [
      `${entry.workflow} initiated processing`,
      `${entry.agent} analyzed input data`,
      `Verification rule applied — ${entry.standard}`,
      entry.type === 'correction'
        ? `Correction applied: original output updated`
        : entry.type === 'escalation'
        ? `Issue escalated for human review`
        : `Output approved and logged`,
      `${entry.verifier} completed verification`,
      'Decision logged to verification ledger',
    ],
    impact: [
      'Incorrect output could lead to downstream processing errors',
      'Compliance documentation may reference inaccurate data',
      'Audit trail integrity depends on accurate verification records',
    ],
    timeline: [
      { time: '--:--:--', event: `${entry.workflow} started` },
      { time: '--:--:--', event: `${entry.agent} processed input` },
      { time: '--:--:--', event: `Verification check performed` },
      { time: '--:--:--', event: `${entry.verifier} reviewed output` },
      { time: '--:--:--', event: 'Logged to verification ledger' },
    ],
    highlightedOriginal: { before: '', flagged: entry.original, after: '' },
    highlightedCorrected: { before: '', fixed: entry.corrected, after: '' },
  };
}

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    bannerBg: 'bg-red-muted',
    bannerBorder: 'border-red/20',
    badgeBg: 'bg-red',
    badgeText: 'text-white',
    textColor: 'text-red',
    dotColor: 'bg-red',
  },
  warning: {
    label: 'Warning',
    icon: AlertCircle,
    bannerBg: 'bg-amber-muted',
    bannerBorder: 'border-amber/20',
    badgeBg: 'bg-amber',
    badgeText: 'text-white',
    textColor: 'text-amber',
    dotColor: 'bg-amber',
  },
  info: {
    label: 'Info',
    icon: Info,
    bannerBg: 'bg-blue-muted',
    bannerBorder: 'border-blue/20',
    badgeBg: 'bg-blue',
    badgeText: 'text-white',
    textColor: 'text-blue',
    dotColor: 'bg-blue',
  },
};

interface VerificationModalProps {
  entry: LedgerEntry;
  onClose: () => void;
}

export default function VerificationModal({ entry, onClose }: VerificationModalProps) {
  const enriched = enrichedEntries[entry.id] || getDefaultEnrichedData(entry);
  const sev = severityConfig[enriched.severity];
  const SevIcon = sev.icon;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="verification-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[720px] bg-surface-raised rounded-2xl border border-border shadow-2xl my-[5vh] mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-sunken transition-colors text-ink-tertiary hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-[15px] font-semibold text-ink tracking-tight">Verification Detail</h2>
            </div>
            <span className="text-[12px] font-mono text-ink-tertiary">{entry.id}</span>
          </div>

          {/* Flag Banner */}
          <div className={`mx-6 mt-5 px-4 py-3.5 rounded-xl ${sev.bannerBg} border ${sev.bannerBorder}`}>
            <div className="flex items-start gap-3">
              <SevIcon className={`w-4.5 h-4.5 ${sev.textColor} mt-0.5 flex-shrink-0`} strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${sev.badgeBg} ${sev.badgeText}`}>
                    {sev.label}
                  </span>
                </div>
                <p className={`text-[13px] font-medium ${sev.textColor} mt-1.5 leading-snug`}>
                  {enriched.flagDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Original vs Corrected */}
          <div className="mx-6 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-red-muted/60 border border-red/10 p-4">
              <div className="text-[10px] font-bold text-red uppercase tracking-wider mb-2">
                Original AI Output
              </div>
              <p className="text-[12.5px] text-ink-secondary leading-relaxed">
                {enriched.highlightedOriginal.before}
                <span className="bg-red/15 text-red font-medium px-0.5 rounded">
                  {enriched.highlightedOriginal.flagged}
                </span>
                {enriched.highlightedOriginal.after}
              </p>
            </div>
            <div className="rounded-xl bg-green-muted/60 border border-green/10 p-4">
              <div className="text-[10px] font-bold text-green uppercase tracking-wider mb-2">
                Corrected Output
              </div>
              <p className="text-[12.5px] text-ink-secondary leading-relaxed">
                {enriched.highlightedCorrected.before}
                <span className="bg-green/15 text-green font-medium px-0.5 rounded">
                  {enriched.highlightedCorrected.fixed}
                </span>
                {enriched.highlightedCorrected.after}
              </p>
            </div>
          </div>

          {/* Why This Was Flagged */}
          <div className="mx-6 mt-5">
            <div className="rounded-xl bg-surface-sunken border border-border-subtle p-4">
              <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider mb-2">
                Why This Was Flagged
              </div>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                {entry.rationale}
              </p>
            </div>
          </div>

          {/* Evidence Chain */}
          <div className="mx-6 mt-5">
            <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider mb-3">
              Evidence Chain
            </div>
            <div className="relative pl-5">
              {/* Connecting line */}
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              <div className="space-y-3">
                {enriched.evidenceChain.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div
                      className={`absolute left-[-13px] top-[5px] w-[9px] h-[9px] rounded-full border-2 border-surface-raised ${
                        i === enriched.evidenceChain.length - 1 ? 'bg-green' : i === 0 ? 'bg-blue' : 'bg-ink-faint'
                      }`}
                    />
                    <p className="text-[12px] text-ink-secondary leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="mx-6 mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-lg bg-surface-sunken border border-border-subtle p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Shield className="w-3 h-3 text-ink-tertiary" />
                <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Agent</span>
              </div>
              <p className="text-[12px] font-medium text-ink leading-snug">{entry.agent}</p>
            </div>
            <div className="rounded-lg bg-surface-sunken border border-border-subtle p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <User className="w-3 h-3 text-ink-tertiary" />
                <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Verifier</span>
              </div>
              <p className="text-[12px] font-medium text-ink leading-snug">{entry.verifier}</p>
            </div>
            <div className="rounded-lg bg-surface-sunken border border-border-subtle p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3 h-3 text-ink-tertiary" />
                <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Standard</span>
              </div>
              <p className="text-[12px] font-medium text-ink leading-snug">{entry.standard}</p>
            </div>
            <div className="rounded-lg bg-surface-sunken border border-border-subtle p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-3 h-3 text-ink-tertiary" />
                <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-wider">Confidence</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      entry.confidence >= 90 ? 'bg-green' : entry.confidence >= 80 ? 'bg-blue' : 'bg-amber'
                    }`}
                    style={{ width: `${entry.confidence}%` }}
                  />
                </div>
                <span className="text-[12px] font-mono font-medium text-ink">{entry.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Impact Assessment */}
          <div className="mx-6 mt-5">
            <div className="rounded-xl border border-amber/20 bg-amber-muted/40 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber" />
                <span className="text-[10px] font-bold text-amber uppercase tracking-wider">
                  Impact Assessment
                </span>
              </div>
              <p className="text-[11px] text-ink-tertiary mb-2">If this error went undetected:</p>
              <ul className="space-y-1.5">
                {enriched.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber mt-[7px] flex-shrink-0" />
                    <span className="text-[12px] text-ink-secondary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="mx-6 mt-5 mb-6">
            <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider mb-3">
              Timeline
            </div>
            <div className="rounded-xl bg-surface-sunken border border-border-subtle overflow-hidden">
              {enriched.timeline.map((item, i) => {
                const isFlag = item.event.includes('FLAG');
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-4 py-2 ${
                      i !== enriched.timeline.length - 1 ? 'border-b border-border-subtle' : ''
                    } ${isFlag ? 'bg-red-muted/50' : ''}`}
                  >
                    <span className={`text-[11px] font-mono flex-shrink-0 tabular-nums mt-px ${
                      isFlag ? 'text-red font-semibold' : 'text-ink-tertiary'
                    }`}>
                      {item.time}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-ink-faint select-none">&rarr;</span>
                      <span className={`text-[12px] leading-relaxed ${
                        isFlag ? 'text-red font-medium' : 'text-ink-secondary'
                      }`}>
                        {item.event}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
