import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Scan,
  Database,
  Cpu,
} from 'lucide-react';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ── Document data ──────────────────────────────────────── */

interface Document {
  title: string;
  subtitle: string;
  lines: { text: string; highlight?: 'ok' | 'warn' | 'measure' }[];
}

const documents: Document[] = [
  {
    title: 'TRACK GEOMETRY INSPECTION REPORT',
    subtitle: 'FRA Class 4 Track \u2014 Herzog Mainline MP 247.1 - 249.3\nDate: March 22, 2026\nInspector: J. Martinez, Certified FRA Inspector',
    lines: [
      { text: 'GEOMETRY MEASUREMENTS:' },
      { text: 'Gauge: 56.62" (spec: 56.5" \u00b10.5") \u2014 WITHIN TOLERANCE', highlight: 'ok' },
      { text: 'Cross Level: 1.2" (spec: max 1.75") \u2014 WITHIN TOLERANCE', highlight: 'ok' },
      { text: 'Alignment: 0.8" deviation (spec: max 1.5") \u2014 WITHIN TOLERANCE', highlight: 'ok' },
      { text: 'Surface/Profile: 2.1" (spec: max 2.0") \u2014 EXCEEDS TOLERANCE \u26a0\ufe0f', highlight: 'warn' },
      { text: 'Warp (62ft): 1.9" (spec: max 2.5") \u2014 WITHIN TOLERANCE', highlight: 'ok' },
      { text: '' },
      { text: 'VISUAL OBSERVATIONS:' },
      { text: 'Tie condition: 4 defective ties in 200ft section near MP 248.2' },
      { text: 'Rail wear: Head wear 3/8" on high rail in curve at MP 247.8' },
      { text: 'Ballast: Fouled ballast section MP 248.5-248.8 (mud pumping observed)' },
      { text: 'Drainage: Standing water at MP 248.6 after recent rainfall' },
      { text: 'Joint bars: Cracked joint bar identified at MP 249.1' },
      { text: '' },
      { text: 'RECOMMENDATIONS:' },
      { text: 'Inspector recommends speed restriction and follow-up inspection within 30 days.' },
    ],
  },
  {
    title: 'CREW SCHEDULING COMPLIANCE REPORT',
    subtitle: 'Hours of Service Review \u2014 Division 7, Week of March 15-21, 2026\nReviewer: K. Thompson, Crew Management\nRegulation: 49 CFR Part 228',
    lines: [
      { text: 'WEEKLY SUMMARY:' },
      { text: 'Total crew assignments reviewed: 847' },
      { text: 'Compliant assignments: 839 (99.1%)', highlight: 'ok' },
      { text: 'Potential violations flagged: 8 (0.9%)', highlight: 'warn' },
      { text: '' },
      { text: 'HOURS OF SERVICE DETAILS:' },
      { text: 'Avg on-duty period: 9.2 hrs (limit: 12 hrs)', highlight: 'ok' },
      { text: 'Max on-duty recorded: 11.8 hrs \u2014 Crew ID 4471', highlight: 'ok' },
      { text: 'Rest period violations: 1 (min 10hr rest not met)', highlight: 'warn' },
      { text: 'Limbo time incidents: 3 crews exceeded 30min', highlight: 'warn' },
      { text: '' },
      { text: 'FLAGGED INCIDENTS:' },
      { text: 'Crew 4471: 11.8hr duty + 9.5hr rest (required 10hr) \u2014 VIOLATION', highlight: 'warn' },
      { text: 'Crew 3892: Called for duty during mandatory rest window' },
      { text: 'Crews 5510, 5511, 5523: Excessive limbo time at yard' },
      { text: '' },
      { text: 'RECOMMENDATION:' },
      { text: 'Review scheduling algorithm for Division 7 yard operations.' },
    ],
  },
  {
    title: 'LOCOMOTIVE MAINTENANCE INSPECTION',
    subtitle: 'Unit: Herzog HZG-7845 (GE ES44C4)\nMileage: 847,320 mi | Last Major: 12/2024\nInspector: R. Chen, Diesel Shop Foreman',
    lines: [
      { text: 'ENGINE DIAGNOSTICS:' },
      { text: 'Fuel consumption: 1.12 gal/GTM (baseline: 1.08)', highlight: 'warn' },
      { text: 'Turbo boost pressure: 42 psi (spec: 40-45 psi)', highlight: 'ok' },
      { text: 'Oil pressure: 62 psi (spec: 55-75 psi)', highlight: 'ok' },
      { text: 'Coolant temp: 188\u00b0F (spec: max 200\u00b0F)', highlight: 'ok' },
      { text: 'Traction motor #3 current draw: 14% above fleet avg', highlight: 'warn' },
      { text: '' },
      { text: 'MECHANICAL FINDINGS:' },
      { text: 'Brake shoes: 45% remaining on lead truck (replace at 25%)' },
      { text: 'Wheel flat detected: #4 axle, 0.8mm (condemn at 2.5mm)', highlight: 'warn' },
      { text: 'Air compressor: cycling 18x/hr (normal: 12-15x/hr)' },
      { text: 'Fuel injector #7: intermittent misfire logged 3x in 48hrs' },
      { text: '' },
      { text: 'EMISSIONS:' },
      { text: 'NOx: 6.2 g/bhp-hr (EPA Tier 4 limit: 5.5)', highlight: 'warn' },
      { text: '' },
      { text: 'RECOMMENDATION:' },
      { text: 'Schedule for injector service and traction motor inspection within 15 days.' },
    ],
  },
];

/* ── Analysis output data per document ──────────────────── */

interface Finding {
  severity: 'violation' | 'alert' | 'concern' | 'flag';
  title: string;
  details: string[];
}

interface AnalysisResult {
  confidence: number;
  complianceStatus: string;
  complianceColor: string;
  findings: Finding[];
  actions: { done: boolean; text: string }[];
  testCount: number;
  accuracy: number;
  falsePositive: number;
  standard: string;
  timeSeconds: number;
  manualTime: string;
  manualCitations: number;
  aiCitations: number;
}

const analysisResults: AnalysisResult[] = [
  {
    confidence: 96.7,
    complianceStatus: 'NON-COMPLIANT (1 violation)',
    complianceColor: 'text-amber-400',
    findings: [
      {
        severity: 'violation',
        title: 'Surface/Profile Exceedance',
        details: [
          'Measured: 2.1" | FRA Class 4 Limit: 2.0" | Exceedance: 0.1"',
          'Severity: MODERATE',
          'Required Action: Speed restriction to 40mph per FRA \u00a7213.63',
          'Timeline: Immediate until corrected',
        ],
      },
      {
        severity: 'alert',
        title: 'Tie Degradation',
        details: [
          '4 defective ties in 200ft (2% rate)',
          'FRA threshold for Class 4: max 5 per 39ft section',
          'Status: WITHIN LIMITS but trending toward intervention',
          'Recommended: Schedule replacement in next maintenance window',
        ],
      },
      {
        severity: 'concern',
        title: 'Fouled Ballast',
        details: [
          'Location: MP 248.5-248.8 (300ft section)',
          'Mud pumping indicates subgrade failure',
          'Impact: Will accelerate geometry degradation if untreated',
          'Recommended: Ballast undercutting + drainage improvement',
        ],
      },
      {
        severity: 'flag',
        title: 'Cracked Joint Bar',
        details: [
          'Location: MP 249.1',
          'FRA Classification: Immediate safety concern',
          'Required Action: Replace within 30 days per FRA \u00a7213.121',
          'Priority: HIGH',
        ],
      },
    ],
    actions: [
      { done: true, text: 'Speed restriction order generated for MP 247.1-249.3 (40mph)' },
      { done: true, text: 'Maintenance work order created: WO-2026-03847' },
      { done: true, text: 'FRA compliance report updated' },
      { done: true, text: 'Division safety officer notified' },
      { done: false, text: 'Pending: Track supervisor review (human-in-loop required)' },
    ],
    testCount: 124,
    accuracy: 98.2,
    falsePositive: 0.3,
    standard: 'FRA Part 213',
    timeSeconds: 8,
    manualTime: '~45 minutes',
    manualCitations: 2,
    aiCitations: 4,
  },
  {
    confidence: 94.3,
    complianceStatus: 'NON-COMPLIANT (1 violation)',
    complianceColor: 'text-amber-400',
    findings: [
      {
        severity: 'violation',
        title: 'Rest Period Violation \u2014 Crew 4471',
        details: [
          'On-duty: 11.8 hrs followed by 9.5 hr rest (minimum 10 hr required)',
          '49 CFR \u00a7228.405 requires minimum 10 consecutive hours undisturbed rest',
          'Severity: REPORTABLE VIOLATION',
          'Required Action: File FRA Form 6180.78 within 30 days',
        ],
      },
      {
        severity: 'alert',
        title: 'Mandatory Rest Window Breach',
        details: [
          'Crew 3892 called for duty during protected rest window',
          'May constitute additional violation pending timestamp review',
          'Status: REQUIRES INVESTIGATION',
          'Recommended: Pull call records for March 18 shift change',
        ],
      },
      {
        severity: 'concern',
        title: 'Excessive Limbo Time',
        details: [
          '3 crews exceeded 30-minute limbo threshold',
          'Crews 5510, 5511, 5523 at Division 7 yard',
          'Limbo time counts toward hours of service per FRA ruling',
          'Impact: Reduces available duty time, increases fatigue risk',
        ],
      },
      {
        severity: 'flag',
        title: 'Scheduling Pattern Risk',
        details: [
          '8 of 847 assignments flagged (0.9%) \u2014 above 0.5% target',
          'Division 7 yard ops show systemic scheduling pressure',
          'Recommended: Algorithm review and crew pool rebalancing',
          'Priority: MEDIUM',
        ],
      },
    ],
    actions: [
      { done: true, text: 'FRA violation report generated for Crew 4471' },
      { done: true, text: 'Investigation ticket opened: INV-2026-1192' },
      { done: true, text: 'Crew fatigue risk assessment updated' },
      { done: true, text: 'Division 7 superintendent notified' },
      { done: false, text: 'Pending: Union representative notification (human-in-loop required)' },
    ],
    testCount: 98,
    accuracy: 97.1,
    falsePositive: 0.5,
    standard: '49 CFR Part 228',
    timeSeconds: 6,
    manualTime: '~2 hours',
    manualCitations: 3,
    aiCitations: 6,
  },
  {
    confidence: 95.8,
    complianceStatus: 'NON-COMPLIANT (1 violation)',
    complianceColor: 'text-amber-400',
    findings: [
      {
        severity: 'violation',
        title: 'EPA Tier 4 NOx Exceedance',
        details: [
          'Measured: 6.2 g/bhp-hr | EPA Tier 4 Limit: 5.5 g/bhp-hr',
          'Exceedance: 12.7% above limit',
          'Likely cause: Fuel injector #7 misfire degrading combustion',
          'Required Action: Repair and retest within 30 days per 40 CFR \u00a71033.115',
        ],
      },
      {
        severity: 'alert',
        title: 'Traction Motor #3 Anomaly',
        details: [
          'Current draw 14% above fleet average',
          'Pattern consistent with bearing wear or insulation degradation',
          'Risk: Potential in-service failure if untreated',
          'Recommended: Megger test and bearing inspection within 7 days',
        ],
      },
      {
        severity: 'concern',
        title: 'Fuel Efficiency Degradation',
        details: [
          'Consumption: 1.12 gal/GTM vs 1.08 baseline (3.7% increase)',
          'Correlated with injector misfire and elevated NOx',
          'Estimated excess fuel cost: $2,400/month at current utilization',
          'Recommended: Injector service will likely resolve both issues',
        ],
      },
      {
        severity: 'flag',
        title: 'Wheel Flat \u2014 #4 Axle',
        details: [
          'Measured: 0.8mm (condemn limit: 2.5mm)',
          'Current rate of wear suggests 60 days to condemn threshold',
          'Impact: Increased rail wear and ride quality degradation',
          'Recommended: Monitor at next 30-day inspection; plan wheel truing',
        ],
      },
    ],
    actions: [
      { done: true, text: 'Emissions compliance alert generated for BNSF 7845' },
      { done: true, text: 'Maintenance work order created: WO-2026-03912' },
      { done: true, text: 'Unit flagged for priority shop scheduling' },
      { done: true, text: 'Fleet reliability dashboard updated' },
      { done: false, text: 'Pending: Mechanical officer sign-off (human-in-loop required)' },
    ],
    testCount: 112,
    accuracy: 97.8,
    falsePositive: 0.4,
    standard: '49 CFR Part 229 / 40 CFR Part 1033',
    timeSeconds: 7,
    manualTime: '~1.5 hours',
    manualCitations: 2,
    aiCitations: 5,
  },
];

/* ── Phases ──────────────────────────────────────────────── */

type Phase = 'idle' | 'reading' | 'extracting' | 'referencing' | 'generating' | 'done';

const phaseLabels: Record<Phase, string> = {
  idle: '',
  reading: 'Reading document...',
  extracting: 'Extracting measurements...',
  referencing: 'Cross-referencing FRA standards...',
  generating: 'Generating analysis...',
  done: 'Analysis complete',
};

const phaseIcons: Record<Phase, React.ElementType> = {
  idle: Scan,
  reading: Scan,
  extracting: Database,
  referencing: FileText,
  generating: Cpu,
  done: CheckCircle2,
};

/* ── Severity styling ───────────────────────────────────── */

const severityStyles: Record<string, { bg: string; border: string; label: string; labelColor: string }> = {
  violation: { bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'VIOLATION DETECTED', labelColor: 'text-red-400' },
  alert: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'MAINTENANCE ALERT', labelColor: 'text-amber-400' },
  concern: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'INFRASTRUCTURE CONCERN', labelColor: 'text-orange-400' },
  flag: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'SAFETY FLAG', labelColor: 'text-yellow-400' },
};

/* ── Main Component ─────────────────────────────────────── */

export default function AIDemo() {
  const [docIndex, setDocIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [scanLine, setScanLine] = useState(0);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [showFRA, setShowFRA] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [revealedFindings, setRevealedFindings] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showReliability, setShowReliability] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const doc = documents[docIndex];
  const result = analysisResults[docIndex];

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setScanLine(0);
    setHighlightedLines([]);
    setShowFRA(false);
    setShowOutput(false);
    setRevealedFindings(0);
    setShowActions(false);
    setShowReliability(false);
    setShowComparison(false);
  }, [clearTimers]);

  const runAnalysis = useCallback(() => {
    reset();

    /* Phase 1: Reading (0-2s) */
    setPhase('reading');
    const totalLines = doc.lines.length;
    for (let i = 0; i <= totalLines; i++) {
      addTimer(() => setScanLine(i), (2000 / totalLines) * i);
    }

    /* Phase 2: Extracting (2-4s) */
    addTimer(() => {
      setPhase('extracting');
      setScanLine(-1);
      const measureLines = doc.lines
        .map((l, idx) => (l.highlight ? idx : -1))
        .filter((i) => i >= 0);
      measureLines.forEach((lineIdx, i) => {
        addTimer(() => setHighlightedLines((prev) => [...prev, lineIdx]), i * 300);
      });
    }, 2200);

    /* Phase 3: Referencing (4-6s) */
    addTimer(() => {
      setPhase('referencing');
      setShowFRA(true);
    }, 4200);

    /* Phase 4: Generating (6-8s) */
    addTimer(() => {
      setPhase('generating');
      setShowOutput(true);
      // Reveal findings one by one
      const findingCount = result.findings.length;
      for (let i = 0; i < findingCount; i++) {
        addTimer(() => setRevealedFindings(i + 1), 400 * (i + 1));
      }
      addTimer(() => setShowActions(true), 400 * findingCount + 600);
      addTimer(() => setShowReliability(true), 400 * findingCount + 1200);
      addTimer(() => {
        setPhase('done');
        setShowComparison(true);
        // scroll output into view
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }, 400 * findingCount + 1800);
    }, 6200);
  }, [doc, result, reset, addTimer]);

  const tryAnother = useCallback(() => {
    reset();
    setDocIndex((prev) => (prev + 1) % documents.length);
  }, [reset]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* Confidence bar width */
  const confPct = result.confidence;
  const confBarFilled = Math.round(confPct / 5);

  const PhaseIcon = phaseIcons[phase];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <h1 className="text-2xl font-semibold text-ink tracking-tight mt-2 flex items-center gap-3">
          <Brain className="w-7 h-7 text-blue" strokeWidth={1.8} />
          AI Analysis Engine
        </h1>
        <p className="text-sm text-ink-tertiary mt-1">
          Watch AI analyze railroad documents in real-time
        </p>
      </div>

      {/* Phase indicator */}
      <AnimatePresence mode="wait">
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue/10 border border-blue/20"
          >
            <PhaseIcon className={`w-4 h-4 text-blue ${phase !== 'done' ? 'animate-pulse' : ''}`} strokeWidth={2} />
            <span className="text-sm font-medium text-blue">{phaseLabels[phase]}</span>
            {phase !== 'done' && (
              <div className="ml-auto flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Document Input */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink-tertiary">Document Input</h2>
        <div
          ref={docRef}
          className="relative bg-white rounded-xl border border-border shadow-lg overflow-hidden"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Document header */}
          <div className="px-6 pt-6 pb-3 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900 tracking-wide text-center">
              {doc.title}
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1 whitespace-pre-line leading-relaxed">
              {doc.subtitle}
            </p>
          </div>

          {/* Document body */}
          <div className="px-6 py-4 relative" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            {/* Scanning highlight bar */}
            {phase === 'reading' && scanLine >= 0 && scanLine < doc.lines.length && (
              <motion.div
                className="absolute left-0 right-0 h-6 bg-blue/10 pointer-events-none"
                style={{ top: `${16 + scanLine * 24}px` }}
                layoutId="scanbar"
                transition={{ duration: 0.1 }}
              />
            )}

            {doc.lines.map((line, idx) => {
              const isHighlighted = highlightedLines.includes(idx);
              const isEmpty = line.text === '';
              return (
                <div
                  key={idx}
                  className={`text-[13px] leading-6 transition-all duration-300 ${
                    isEmpty ? 'h-4' : ''
                  } ${
                    line.text.match(/^[A-Z][A-Z ]+:$/)
                      ? 'font-bold text-gray-800 mt-2'
                      : 'text-gray-700'
                  } ${isHighlighted ? 'bg-yellow-200/80 rounded px-1 -mx-1' : ''}`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Run button */}
        <div className="flex items-center gap-3">
          <button
            onClick={runAnalysis}
            disabled={phase !== 'idle' && phase !== 'done'}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              phase === 'idle' || phase === 'done'
                ? 'bg-blue text-white hover:bg-blue/90 shadow-lg shadow-blue/25 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Run AI Analysis
          </button>

          {phase === 'done' && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={tryAnother}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-ink-secondary border border-border hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Try Another Document
            </motion.button>
          )}
        </div>
      </div>

      {/* FRA Standards Panel */}
      <AnimatePresence>
        {showFRA && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-blue/20 bg-blue/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue">
                  Reference Database
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/60 rounded p-2.5 border border-blue/10">
                  <span className="font-semibold text-gray-700">{result.standard}</span>
                  <p className="text-gray-500 mt-0.5">Federal standards database</p>
                </div>
                <div className="bg-white/60 rounded p-2.5 border border-blue/10">
                  <span className="font-semibold text-gray-700">2,847 regulations indexed</span>
                  <p className="text-gray-500 mt-0.5">Last updated: March 2026</p>
                </div>
                <div className="bg-white/60 rounded p-2.5 border border-blue/10">
                  <span className="font-semibold text-gray-700">Cross-referencing {result.aiCitations} sections</span>
                  <p className="text-gray-500 mt-0.5">Matching to document findings</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 2: AI Analysis Output */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            ref={outputRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-tertiary">AI Analysis Output</h2>

            <div className="rounded-xl bg-gray-950 border border-gray-800 overflow-hidden shadow-2xl">
              {/* Header bar */}
              <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-gray-200">AI ANALYSIS</span>
                  <span className="text-xs text-gray-500">&mdash;</span>
                  <span className="text-xs text-gray-400">{doc.title.replace('REPORT', '').trim()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <span className="w-2 h-2 rounded-full bg-green-500/80" />
                </div>
              </div>

              <div className="px-5 py-4 space-y-4 font-mono text-[13px]">
                {/* Confidence & compliance */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-green-400 font-bold">{confPct}%</span>
                    <span className="text-green-500">{'█'.repeat(confBarFilled)}</span>
                    <span className="text-gray-700">{'░'.repeat(20 - confBarFilled)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Compliance:</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className={`font-bold ${result.complianceColor}`}>{result.complianceStatus}</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-3">
                  <span className="text-gray-500">{'━'.repeat(3)} FINDINGS {'━'.repeat(3)}</span>
                </div>

                {/* Findings */}
                {result.findings.slice(0, revealedFindings).map((finding, i) => {
                  const style = severityStyles[finding.severity];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-lg p-3 border ${style.bg} ${style.border}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500 text-xs mt-0.5">{i + 1}.</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold uppercase ${style.labelColor}`}>{style.label}</span>
                            <span className="text-gray-500">&mdash;</span>
                            <span className="text-gray-200 font-semibold text-xs">{finding.title}</span>
                          </div>
                          {finding.details.map((d, j) => (
                            <div key={j} className="text-gray-400 text-xs leading-relaxed pl-1">
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Actions */}
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="border-t border-gray-800 pt-3">
                        <span className="text-gray-500">{'━'.repeat(3)} AUTOMATED ACTIONS {'━'.repeat(3)}</span>
                      </div>
                      {result.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          {action.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={action.done ? 'text-gray-300' : 'text-amber-300'}>
                            {action.text}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reliability */}
                <AnimatePresence>
                  {showReliability && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1.5"
                    >
                      <div className="border-t border-gray-800 pt-3">
                        <span className="text-gray-500">{'━'.repeat(3)} RELIABILITY CHECK {'━'.repeat(3)}</span>
                      </div>
                      <p className="text-gray-400 text-xs">Test Suite: {result.testCount} validation tests executed</p>
                      <p className="text-gray-400 text-xs">Accuracy vs. manual review: {result.accuracy}% concordance</p>
                      <p className="text-gray-400 text-xs">False positive rate: {result.falsePositive}%</p>
                      <p className="text-gray-400 text-xs">This analysis was verified against {result.standard} database</p>
                      <p className="text-green-400 text-xs font-semibold">Reviewer: Auto-approved (confidence &gt; 95% threshold)</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 3: Comparison Panel */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-tertiary">
              Value Comparison
            </h2>
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-sunken">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-tertiary" />
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-tertiary">
                      Manual Review
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-tertiary">
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-blue" />
                        AI Analysis
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { label: 'Time', manual: result.manualTime, ai: `${result.timeSeconds} seconds`, aiHighlight: true },
                    {
                      label: 'Citations Found',
                      manual: `${result.manualCitations} identified`,
                      ai: `${result.aiCitations} identified (caught ${result.aiCitations - result.manualCitations} missed)`,
                      aiHighlight: true,
                    },
                    { label: 'Work Orders', manual: 'Manual creation', ai: 'Auto-generated', aiHighlight: true },
                    { label: 'Notifications', manual: 'Email chain', ai: 'Instant to safety officer', aiHighlight: true },
                    { label: 'Compliance Report', manual: 'Manual filing', ai: 'Auto-updated', aiHighlight: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-sunken/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-ink text-xs">{row.label}</td>
                      <td className="px-5 py-3 text-ink-secondary text-xs">{row.manual}</td>
                      <td className="px-5 py-3 text-xs">
                        <span className={row.aiHighlight ? 'text-blue font-semibold' : 'text-ink-secondary'}>
                          {row.ai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
