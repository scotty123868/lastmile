import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from '../data/CompanyContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Target,
  Activity,
  UserCheck,
  ChevronDown,
  ChevronRight,
  XCircle,
  Sparkles,
  FlaskConical,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import PreliminaryBanner from '../components/PreliminaryBanner';

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

/* -- Division-specific reliability data -- */
const divisionReliability: Record<string, { accuracy: number; falsePositive: number; trend: string; testsPerDay: number; workflows: number }> = {
  meridian: { accuracy: 94.2, falsePositive: 3.1, trend: '+2.4% (30d)', testsPerDay: 847, workflows: 62 },
  hcc: { accuracy: 96.8, falsePositive: 0.8, trend: '+1.2% (30d)', testsPerDay: 312, workflows: 18 },
  hrsi: { accuracy: 93.1, falsePositive: 4.2, trend: '+3.1% (30d)', testsPerDay: 124, workflows: 8 },
  hsi: { accuracy: 94.2, falsePositive: 3.1, trend: '+2.4% (30d)', testsPerDay: 98, workflows: 6 },
  hti: { accuracy: 97.4, falsePositive: 1.2, trend: '+0.8% (30d)', testsPerDay: 156, workflows: 10 },
  htsi: { accuracy: 91.8, falsePositive: 5.4, trend: '+4.2% (30d)', testsPerDay: 89, workflows: 8 },
  he: { accuracy: 95.6, falsePositive: 2.1, trend: '+1.8% (30d)', testsPerDay: 42, workflows: 4 },
  gg: { accuracy: 98.1, falsePositive: 0.4, trend: '+0.3% (30d)', testsPerDay: 26, workflows: 3 },
};

/* -- Type definitions for division data -- */
interface SuccessExample {
  title: string;
  input: string;
  analysis: string;
  expert: string;
  expertName: string;
  outcome: string;
  savings: string;
  confidence: number;
}

interface FailureExample {
  title: string;
  input: string;
  analysis: string;
  whatHappened: string;
  whyFailed: string;
  howCaught: string;
  corrective: string[];
  status: string;
}

interface ReviewQueueItem {
  title: string;
  flag: string;
  confidence: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  reviewer: string;
  reasoning: string[];
  outcome: 'approved' | 'corrected' | 'rejected' | null;
}

/* -- Division-specific success examples -- */
const divisionSuccessExamples: Record<string, SuccessExample[]> = {
  hcc: [
    {
      title: 'Bridge Inspection — AI Detected Bearing Deterioration',
      input: 'Bridge inspection reports, I-70 Rehabilitation Project, March 2026',
      analysis: 'AI ANALYSIS: Bearing pad compression exceeding 15% threshold on pier 3. Rate of degradation suggests replacement needed within 45 days.',
      expert: 'Reviewed bearing measurements. Confirmed deterioration pattern. "AI integrated multiple inspection cycles that would have been reviewed separately."',
      expertName: 'Senior Bridge Inspector R. Collins',
      outcome: 'Bearing replacement scheduled during planned traffic control window.',
      savings: '$89,000 in avoided emergency closure + traffic management',
      confidence: 96.8,
    },
    {
      title: 'Equipment Utilization — Cross-Project Optimization',
      input: 'Fleet GPS data + project schedules, Q1 2026',
      analysis: '4 excavators idle 60%+ across 3 active projects. Redeployment to I-35 project would eliminate 2 rental units ($4,200/week each).',
      expert: 'Operations confirmed equipment was available. "We didn\'t have visibility across project sites to see the idle time."',
      expertName: 'Fleet Manager T. Brooks',
      outcome: 'Equipment redeployed. 2 rentals canceled.',
      savings: '$218,400/yr in eliminated equipment rentals',
      confidence: 94.1,
    },
  ],
  hsi: [
    {
      title: 'Rail Flaw Detection — Pattern Recognition Across Corridors',
      input: 'TAM-4 ultrasonic data, Northeast Corridor Segments 12-18, March 2026',
      analysis: 'AI ANALYSIS: Transverse defect progression detected at MP 312.4. Growth rate 0.8mm/month suggests critical threshold in 60 days.',
      expert: 'Confirmed via manual re-test. "The AI correlated readings across 3 separate test runs that showed the trend. Individual readings were borderline."',
      expertName: 'Senior Rail Inspector M. Chen',
      outcome: 'Rail section replaced during scheduled maintenance window.',
      savings: '$124,000 in avoided derailment risk + emergency response',
      confidence: 93.7,
    },
  ],
  htsi: [
    {
      title: 'Passenger Service — Schedule Optimization',
      input: 'Ridership data + crew schedules + equipment availability, March 2026',
      analysis: 'Off-peak service can be consolidated from 4 trainsets to 3 without exceeding 85% capacity threshold. Saves 1 crew rotation per day.',
      expert: 'Operations Manager verified ridership patterns. "The seasonal adjustment was something we do manually each quarter — AI caught it 3 weeks earlier."',
      expertName: 'Transit Operations Manager L. Washington',
      outcome: 'Off-peak schedule adjusted. Crew reassigned to peak service.',
      savings: '$67,000/yr in optimized crew and equipment utilization',
      confidence: 91.2,
    },
  ],
  hti: [
    {
      title: 'PTC System — Predictive Maintenance Alert',
      input: 'PTC wayside device telemetry, Zone 8-14, March 2026',
      analysis: 'AI ANALYSIS: Communication latency trending upward on 3 wayside devices in Zone 12. Pattern consistent with antenna degradation, not software issue.',
      expert: 'Field inspection confirmed corrosion on antenna connections. "AI distinguished hardware from software issues — saved us days of software troubleshooting."',
      expertName: 'Signal Systems Engineer K. Patel',
      outcome: 'Antenna assemblies replaced. Communication latency returned to baseline.',
      savings: '$34,000 in avoided service disruptions + diagnostic time',
      confidence: 97.1,
    },
  ],
};

/* -- Division-specific failure examples -- */
const divisionFailureExamples: Record<string, FailureExample[]> = {
  hcc: [
    {
      title: 'Material Cost Overestimate — Aggregate Pricing',
      input: 'Bid package, Highway 65 resurfacing project',
      analysis: 'Estimated aggregate cost: $380,000 based on regional pricing database.',
      whatHappened: 'Actual cost was $290,000. AI used statewide average pricing instead of local quarry rates available through existing contracts.',
      whyFailed: 'Procurement contract database was not connected. AI used public pricing data instead of negotiated rates.',
      howCaught: 'Estimator (human-in-loop) flagged the per-ton rate as 30% above their experience with local suppliers.',
      corrective: [
        'Connected procurement contract database via MCP',
        'Added negotiated rate lookup as priority over public pricing',
        'Material cost estimates now within ±8% vs previous ±25%',
      ],
      status: 'Resolved. Procurement feed integrated.',
    },
  ],
  htsi: [
    {
      title: 'Ridership Forecast Error — Special Event',
      input: 'Daily ridership prediction, Saturday March 14, 2026',
      analysis: 'Predicted ridership: 12,400 (normal Saturday pattern).',
      whatHappened: 'Actual ridership: 28,600. Major concert event at downtown venue drove 130% surge.',
      whyFailed: 'Event calendar integration was limited to city-operated venues. Third-party venue events were not in the data feed.',
      howCaught: 'Operations dispatcher noticed platform crowding at 2PM and escalated. Additional trainsets deployed within 45 minutes.',
      corrective: [
        'Integrated Ticketmaster/LiveNation event feeds for service area',
        'Added "special event" flag that triggers capacity planning review',
        'Weekend forecast accuracy improved from 78% to 94%',
      ],
      status: 'Resolved. Event feed active for all major venues.',
    },
  ],
};

/* -- Division-specific review queue items -- */
const divisionReviewQueue: Record<string, ReviewQueueItem[]> = {
  hcc: [
    {
      title: 'Bridge Load Rating Update',
      flag: 'Flagged for Review',
      confidence: 82,
      priority: 'High' as const,
      timestamp: 'Mar 26, 2026 — 10:22 AM',
      reviewer: 'Pending — structural engineer review',
      reasoning: [
        'Bridge #HCC-4472: load rating recalculated after deck rehabilitation.',
        'AI computed HS-20 rating of 1.12 — marginally above 1.0 minimum.',
        'Previous rating was 1.38 before rehab. Decrease unexpected.',
        'Potential issue with input deck thickness assumption.',
        'Recommend engineer verification of as-built dimensions.',
      ],
      outcome: null,
    },
    {
      title: 'Equipment Maintenance Schedule',
      flag: 'Auto-Approved',
      confidence: 95,
      priority: 'Low' as const,
      timestamp: 'Mar 26, 2026 — 09:15 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'CAT 349F excavator #HCC-E22: 4,800 hours since last major service.',
        'Manufacturer interval: 5,000 hours. Window: next 2 weeks.',
        'No scheduling conflicts detected. Parts in stock at depot.',
        'Service scheduled for April 2.',
      ],
      outcome: 'approved' as const,
    },
  ],
  hsi: [
    {
      title: 'Rail Defect Classification — Ambiguous Reading',
      flag: 'Manual Check Required',
      confidence: 74,
      priority: 'High' as const,
      timestamp: 'Mar 26, 2026 — 08:55 AM',
      reviewer: 'Pending — Level III UT technician',
      reasoning: [
        'TAM-4 reading at MP 312.4: anomaly detected in rail head.',
        'Signal pattern inconclusive — could be transverse defect or weld inclusion.',
        'Confidence split: 58% transverse defect, 42% benign inclusion.',
        'FRA requires verification of all ambiguous readings.',
        'Manual hand test recommended.',
      ],
      outcome: null,
    },
  ],
  htsi: [
    {
      title: 'Service Reduction Recommendation',
      flag: 'Flagged for Review',
      confidence: 79,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 07:30 AM',
      reviewer: 'Pending — transit operations manager',
      reasoning: [
        'Weekday off-peak ridership down 22% vs. 6-month average.',
        'AI recommends reducing frequency from 15min to 20min headways.',
        'Projected savings: $4,200/week in crew and fuel costs.',
        'Risk: customer satisfaction impact on commuter retention.',
        'Requires operations manager approval per service change policy.',
      ],
      outcome: null,
    },
  ],
  hti: [
    {
      title: 'PTC Software Update Validation',
      flag: 'Automated Override',
      confidence: 93,
      priority: 'Medium' as const,
      timestamp: 'Mar 26, 2026 — 06:45 AM',
      reviewer: 'Auto-approved (above 90% threshold)',
      reasoning: [
        'PTC firmware v4.2.1 update validated across 12 wayside units.',
        'All units responding within latency spec (<200ms).',
        'No signal degradation detected post-update.',
        'Auto-approved per standard update protocol.',
      ],
      outcome: 'approved' as const,
    },
  ],
};

/* -- Sparkline (30 days) -- */
function generateSparkline(startVal: number, endVal: number) {
  const pts = [];
  for (let i = 29; i >= 0; i--) {
    const p = (29 - i) / 29;
    const noise = Math.sin(i * 1.3) * 0.4 + Math.cos(i * 0.7) * 0.3;
    pts.push({
      d: 29 - i,
      v: Math.round((startVal + (endVal - startVal) * p + noise) * 10) / 10,
    });
  }
  return pts;
}

/* -- 6-month performance data (generated per division to match current values) -- */
function buildPerfData(accuracy: number, falsePositive: number, testsPerDay: number) {
  // Work backwards from current March values to Oct start
  const accStart = Math.round((accuracy - 5.2) * 10) / 10;
  const fpStart = Math.round((falsePositive + 4.9) * 10) / 10;
  const testStart = Math.round(testsPerDay * 0.4);
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return months.map((month, i) => {
    const t = i / 5; // 0 to 1
    return {
      month,
      accuracy: Math.round((accStart + (accuracy - accStart) * t) * 10) / 10,
      falsePositive: Math.round((fpStart + (falsePositive - fpStart) * t) * 10) / 10,
      tests: Math.round(testStart + (testsPerDay - testStart) * t),
    };
  });
}
/* buildPerfData is used in the component via useMemo */

/* -- Success examples -- */
const successExamplesDefault = [
  {
    title: 'Track Geometry — AI Caught a Developing Defect',
    input: 'Geometry car readings MP 247.1-249.3, March 18, 2026',
    analysis:
      'AI ANALYSIS: Surface deviation trending from 1.2" to 1.6" over 90 days. Rate of change suggests Class 4 exceedance (2.0" limit) within 21 days.',
    expert:
      'Reviewed same data, concurred. Noted: "AI caught the TREND that I would have missed in a batch review. The individual readings were within spec at the time of measurement, but the trend indicates imminent exceedance."',
    expertName: 'Senior Inspector J. Martinez',
    outcome: 'Preventive maintenance scheduled. Avoided emergency speed restriction.',
    savings: '$47,000 in avoided emergency response + schedule disruption',
    confidence: 94.2,
  },
  {
    title: 'License Optimization — Identified Shadow IT',
    input: 'Azure AD login logs + SAP license records, Q1 2026',
    analysis:
      '34 users in HCC have active SAP licenses but zero logins in 180 days. 12 users are using unauthorized Airtable as a project tracking substitute.',
    expert:
      'IT Director confirmed. "We had no visibility into this. The Airtable usage explains why our Primavera adoption was lower than expected."',
    expertName: 'IT Director',
    outcome: '34 SAP licenses reclaimed ($68,000/yr). Airtable migration plan created.',
    savings: '$68,000/yr in license recovery + improved data governance',
    confidence: 98.1,
  },
  {
    title: 'Crew Scheduling — Optimized Across Divisions',
    input: 'Kronos schedules + project timelines, HTSI + HCC divisions',
    analysis:
      'Cross-division crew sharing opportunity: 8 certified operators in HTSI idle 3 days/week while HCC has 12 unfilled shifts requiring same certifications.',
    expert:
      'Ops Manager: "We\'ve been trying to solve this manually for years. The cross-division visibility doesn\'t exist in our current systems."',
    expertName: 'Operations Manager',
    outcome: 'Cross-division crew sharing pilot launched.',
    savings: '$156,000/yr in reduced overtime + contractor costs',
    confidence: 91.7,
  },
];

/* -- Failure examples -- */
const failureExamplesDefault = [
  {
    title: 'False Positive — PTC Signal Anomaly',
    input: 'Signal system telemetry, PTC Zone 12',
    analysis:
      'Critical: Intermittent signal loss detected on wayside device WD-4472. Recommending immediate field inspection.',
    whatHappened:
      'Signal variance was caused by planned firmware update on adjacent device. Normal maintenance activity not flagged in the operations log.',
    whyFailed:
      'Maintenance schedule was in a separate system (paper-based log) not yet connected via MCP. AI lacked context.',
    howCaught:
      'Human-in-loop reviewer (HTI signal engineer) recognized the firmware update pattern. Flagged as false positive in 22 minutes.',
    corrective: [
      'Added maintenance schedule as required context input',
      'Retrained model with 340 maintenance-window samples',
      'False positive rate for signal anomalies dropped from 4.2% to 0.8%',
    ],
    status: 'Resolved. Model v2.3.1 deployed.',
  },
  {
    title: 'Confidence Miscalibration — Cost Estimate',
    input: 'Project bid package, I-70 Bridge Rehabilitation',
    analysis: 'Estimated cost: $2.4M (confidence: 89%)',
    whatHappened:
      'Actual winning bid was $3.1M. AI underestimated material costs for specialty bridge bearings by 40%.',
    whyFailed:
      'Training data did not include post-2024 material price surges for specialty steel. Model was calibrated on 2020-2023 pricing.',
    howCaught:
      'PM review (human-in-loop) flagged the 89% confidence as suspicious for a specialty project. Requested manual vendor quotes.',
    corrective: [
      'Integrated real-time material pricing feed from RS Means',
      'Added "specialty materials" flag that triggers mandatory human review',
      'Recalibrated confidence scoring — this would now show 67% confidence',
    ],
    status: 'Model v3.1.0 with pricing feed active. Confidence calibration error reduced from \u00b118% to \u00b16%.',
  },
];

/* -- Human-in-loop review queue -- */
const reviewQueueDefault = [
  {
    title: 'Track Defect Classification',
    flag: 'Flagged for Review',
    confidence: 78,
    priority: 'High' as const,
    timestamp: 'Mar 26, 2026 — 09:14 AM',
    reviewer: 'Pending assignment',
    reasoning: [
      'Geometry car data shows 2.3" surface deviation at MP 247.3.',
      'Compared against Class 4 threshold (2.0"): EXCEEDS by 0.3".',
      'Prior reading was 2.5" on Mar 12 — trend is improving but still non-compliant.',
      'Absolute value exceeds FRA limit regardless of trend direction.',
      'Immediate speed restriction recommended per FRA §213.9. Maintenance crew dispatched.',
    ],
    outcome: null,
  },
  {
    title: 'Crew Certification Expiry',
    flag: 'Automated Override',
    confidence: 92,
    priority: 'Medium' as const,
    timestamp: 'Mar 26, 2026 — 08:42 AM',
    reviewer: 'Auto-approved (above 90% threshold)',
    reasoning: [
      'Employee [REDACTED] — Locomotive Engineer, certification expires Apr 9, 2026.',
      'Renewal program available: 2-day refresher (Apr 1-2).',
      'No scheduling conflicts detected in Kronos.',
      'Auto-scheduled renewal training.',
    ],
    outcome: 'approved' as const,
  },
  {
    title: 'Cost Estimate Variance',
    flag: 'Manual Check Required',
    confidence: 71,
    priority: 'Medium' as const,
    timestamp: 'Mar 25, 2026 — 04:18 PM',
    reviewer: 'Pending — PM review required',
    reasoning: [
      'Project: I-70 Bridge Rehabilitation bid analysis.',
      'AI estimate: $2.4M. Historical average for similar scope: $1.95M.',
      'Variance: +23% above historical.',
      'Specialty materials detected but pricing feed shows 2024 data only.',
      'Confidence lowered due to data recency gap.',
    ],
    outcome: 'corrected' as const,
  },
  {
    title: 'Signal System Anomaly',
    flag: 'Flagged',
    confidence: 84,
    priority: 'Critical' as const,
    timestamp: 'Mar 25, 2026 — 02:07 PM',
    reviewer: 'Assigned to HTI signal team',
    reasoning: [
      'PTC Zone 12, MP 89-94: intermittent signal degradation on WD-4472.',
      'Pattern: 3 signal drops in 4 hours, each lasting 12-18 seconds.',
      'Cross-referenced with weather: no correlation.',
      'Cross-referenced with train traffic: no correlation.',
      'Possible wayside device failure. Field inspection recommended.',
    ],
    outcome: 'rejected' as const,
  },
  {
    title: 'Environmental Compliance Report',
    flag: 'Auto-Approved',
    confidence: 97,
    priority: 'Low' as const,
    timestamp: 'Mar 25, 2026 — 10:33 AM',
    reviewer: 'Auto-approved',
    reasoning: [
      'Green Group — wetland mitigation compliance quarterly report.',
      'All 14 parameters within EPA/state limits.',
      'No exceedances detected. Trend analysis: stable across all metrics.',
    ],
    outcome: 'approved' as const,
  },
];

/* -- Testing methodology categories -- */
const testCategories = [
  {
    name: 'Accuracy Tests',
    desc: 'Compare AI output against human expert baseline. 500+ validated cases.',
    count: 500,
  },
  {
    name: 'Consistency Tests',
    desc: 'Same input, different times \u2192 same output? Measures determinism.',
    count: 120,
  },
  {
    name: 'Boundary Tests',
    desc: 'Edge cases: data at exact FRA limits, ambiguous measurements, incomplete inputs.',
    count: 85,
  },
  {
    name: 'Adversarial Tests',
    desc: 'Deliberately corrupt/misleading inputs to test robustness.',
    count: 42,
  },
  {
    name: 'Drift Detection',
    desc: 'Weekly model performance comparison against baseline. Alert on >3% deviation.',
    count: 60,
  },
  {
    name: 'FRA Compliance Suite',
    desc: 'Every output checked against FRA Part 213 requirements.',
    count: 40,
  },
];

/* -- Workflow thresholds & config -- */
const thresholdConfig = [
  {
    category: 'Safety-Critical',
    workflows: ['Track Geometry', 'PTC Signal Verification', 'Safety Compliance'],
    threshold: 95,
    color: '#EF4444',
    status: 'FRA Certified' as const,
  },
  {
    category: 'Operational',
    workflows: ['Crew Scheduling', 'Fleet Utilization', 'Dispatch Route'],
    threshold: 85,
    color: '#F59E0B',
    status: 'Certified' as const,
  },
  {
    category: 'Financial',
    workflows: ['Project Cost Estimation', 'Material & Ballast Logistics'],
    threshold: 80,
    color: '#3B82F6',
    status: 'In Review' as const,
    note: '+ mandatory human review',
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

function priorityBadge(p: 'Critical' | 'High' | 'Medium' | 'Low') {
  const s: Record<string, string> = {
    Critical: 'bg-[#EF4444]/10 text-[#EF4444]',
    High: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    Medium: 'bg-blue/10 text-blue',
    Low: 'bg-ink-faint/20 text-ink-tertiary',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${s[p]}`}>
      {p}
    </span>
  );
}

function outcomeBadge(o: 'approved' | 'corrected' | 'rejected' | null) {
  if (!o) return <span className="text-[10px] text-ink-faint italic">Pending</span>;
  const map: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', label: 'Approved' },
    corrected: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Corrected' },
    rejected: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', label: 'Rejected (False Positive)' },
  };
  const m = map[o];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.bg} ${m.text}`}>{m.label}</span>;
}

function CountUp({ end, duration = 1.2 }: { end: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <>{value.toFixed(1)}</>;
}

/** Horizontal bar with animated fill */
function HBar({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-ink-tertiary w-[110px] shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface/80 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] font-semibold tabular-nums w-[65px] text-right" style={{ color }}>
        {pct}%{label === 'Drift Detection' ? ' drift' : ''}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function Reliability() {
  const { company } = useCompany();
  const divKey = company.id;
  const rel = divisionReliability[divKey] || divisionReliability.meridian;

  /* Live test counter */
  const [testsToday, setTestsToday] = useState(rel.testsPerDay);
  useEffect(() => {
    setTestsToday(rel.testsPerDay);
  }, [rel.testsPerDay]);
  useEffect(() => {
    const id = setInterval(() => setTestsToday((v) => v + 1), 100_000);
    return () => clearInterval(id);
  }, []);

  /* Expandable review queue */
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  /* Division-specific data */
  const perfData = useMemo(() => buildPerfData(rel.accuracy, rel.falsePositive, rel.testsPerDay), [rel.accuracy, rel.falsePositive, rel.testsPerDay]);
  const sparkData = useMemo(() => generateSparkline(rel.accuracy - 2.4, rel.accuracy), [rel.accuracy]);
  const successExamples = divisionSuccessExamples[divKey] || successExamplesDefault;
  const failureExamples = divisionFailureExamples[divKey] || failureExamplesDefault;
  const reviewQueue = divisionReviewQueue[divKey] || reviewQueueDefault;

  const subScores = [
    { label: 'Accuracy', pct: rel.accuracy, color: '#22C55E' },
    { label: 'Consistency', pct: Math.round((rel.accuracy - 1.1) * 10) / 10, color: '#22C55E' },
    { label: 'FRA Compliance', pct: Math.round((rel.accuracy + 1.2) * 10) / 10 > 100 ? 99.8 : Math.round((rel.accuracy + 1.2) * 10) / 10, color: '#22C55E' },
    { label: 'Drift Detection', pct: rel.falsePositive < 2 ? 1.2 : rel.falsePositive > 4 ? 3.8 : 2.1, color: '#F59E0B' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <PreliminaryBanner />
        <h1 className="text-2xl font-semibold text-ink tracking-tight mt-2">AI Reliability Testing</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Continuous validation ensuring AI outputs meet FRA safety standards — including where AI fails
        </p>
      </div>

      {/* ━━━ SECTION 1: Trust Score Dashboard ━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6 lg:p-8"
      >
        {/* Top row: big score + sparkline */}
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
          <div className="text-center lg:text-left">
            <p className="text-xs font-medium text-ink-tertiary uppercase tracking-widest mb-2">
              Overall Trust Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl lg:text-7xl font-bold tracking-tight text-emerald-500">
                <CountUp end={rel.accuracy} />
              </span>
              <span className="text-3xl font-semibold text-emerald-500">%</span>
            </div>
            <p className="text-xs text-ink-tertiary mt-1">{rel.workflows} active workflows, {testsToday.toLocaleString()} tests/day</p>
          </div>

          {/* Inline sparkline */}
          <div className="flex-1 w-full max-w-[320px] h-[56px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={1.5} fill="url(#sparkGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-ink-faint text-center mt-0.5">30-day trend</p>
          </div>

          {/* Live counter */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/60 border border-border/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
            </span>
            <span className="text-[11px] font-medium text-ink-secondary tabular-nums">
              Tests today: {testsToday.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sub-score bars */}
        <div className="space-y-2.5 max-w-[600px] mx-auto">
          {subScores.map((s) => (
            <HBar key={s.label} pct={s.pct} color={s.color} label={s.label} />
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 2: Success Examples ━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#22C55E]" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">AI Got It Right — Success Examples</h2>
        </div>
        <div className="space-y-4">
          {successExamples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-border bg-surface-raised overflow-hidden"
              style={{ borderLeftWidth: 4, borderLeftColor: '#22C55E' }}
            >
              <div className="p-5 lg:p-6 space-y-4">
                <h3 className="text-[13px] font-semibold text-ink">{ex.title}</h3>

                {/* Input */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">Input</span>
                  <p className="text-[12px] text-ink-secondary mt-0.5 font-mono bg-surface/60 rounded px-2 py-1">
                    {ex.input}
                  </p>
                </div>

                {/* AI Analysis */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    AI Analysis
                  </span>
                  <p className="text-[12px] text-ink mt-0.5 font-mono bg-surface/60 rounded px-2 py-1.5 leading-relaxed">
                    &quot;{ex.analysis}&quot;
                  </p>
                </div>

                {/* Human Expert */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    Human Expert Validation
                  </span>
                  <p className="text-[12px] text-ink-secondary mt-0.5 italic leading-relaxed">
                    {ex.expert}
                  </p>
                </div>

                {/* Bottom row: outcome, savings, confidence */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-border/50 text-[11px]">
                  <div>
                    <span className="text-ink-tertiary">Outcome: </span>
                    <span className="text-ink font-medium">{ex.outcome}</span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary">Savings: </span>
                    <span className="text-[#22C55E] font-semibold">{ex.savings}</span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary">Confidence: </span>
                    <span className="text-ink font-semibold">{ex.confidence}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span className="text-ink-tertiary">Verified by {ex.expertName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 3: Failure Examples ━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <XCircle className="w-4 h-4 text-[#EF4444]" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">AI Got It Wrong — Failure Examples</h2>
        </div>
        <p className="text-[11px] text-ink-tertiary mb-4 ml-6">
          Transparency about failures builds more trust than pretending everything works perfectly.
        </p>
        <div className="space-y-4">
          {failureExamples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-border overflow-hidden"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: '#EF4444',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 40%, transparent 70%)',
              }}
            >
              <div className="p-5 lg:p-6 space-y-4">
                <h3 className="text-[13px] font-semibold text-ink">{ex.title}</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left column */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        Input
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 font-mono bg-surface/60 rounded px-2 py-1">
                        {ex.input}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        AI Analysis
                      </span>
                      <p className="text-[12px] text-ink mt-0.5 font-mono bg-surface/60 rounded px-2 py-1.5 leading-relaxed">
                        &quot;{ex.analysis}&quot;
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EF4444]">
                        What Actually Happened
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.whatHappened}</p>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EF4444]">
                        Why AI Failed
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.whyFailed}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        How System Caught It
                      </span>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{ex.howCaught}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                        Corrective Action
                      </span>
                      <ol className="mt-1 space-y-0.5">
                        {ex.corrective.map((c, i) => (
                          <li key={i} className="text-[12px] text-ink-secondary flex gap-1.5">
                            <span className="text-ink-faint shrink-0">{i + 1}.</span>
                            {c}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  <span className="text-[11px] text-ink-secondary">
                    <span className="font-medium">Current Status:</span> {ex.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 4: Reliability Testing Methodology ━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="rounded-xl border border-border bg-surface-raised p-6 lg:p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Reliability Testing Methodology</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Pyramid */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-4">Test Pyramid</h3>
            <div className="space-y-0 font-mono text-[12px]">
              {/* E2E tier */}
              <div className="flex items-stretch">
                <div className="w-full max-w-[320px] mx-auto">
                  <div
                    className="rounded-t-lg border border-red-200 bg-red-50 px-4 py-4 text-center shadow-sm"
                    style={{ width: '50%', margin: '0 auto' }}
                  >
                    <p className="text-ink font-semibold text-[11px]">E2E Tests</p>
                    <p className="text-ink-tertiary text-[10px]">Full flow</p>
                    <p className="text-ink-secondary text-[10px]">Human expert comparison</p>
                  </div>
                  <div className="text-right pr-2 text-[10px] text-ink-faint -mt-6">12/day</div>
                </div>
              </div>
              {/* Integration tier */}
              <div className="w-full max-w-[320px] mx-auto">
                <div
                  className="border border-amber-200 border-t-0 bg-amber-50 px-4 py-4 text-center shadow-sm"
                  style={{ width: '75%', margin: '0 auto' }}
                >
                  <p className="text-ink font-semibold text-[11px]">Integration Tests</p>
                  <p className="text-ink-tertiary text-[10px]">Cross-system consistency</p>
                </div>
                <div className="text-right pr-2 text-[10px] text-ink-faint -mt-5">89/day</div>
              </div>
              {/* Unit tier */}
              <div className="w-full max-w-[320px] mx-auto">
                <div className="rounded-b-lg border border-emerald-200 border-t-0 bg-emerald-50 px-4 py-4 text-center shadow-sm">
                  <p className="text-ink font-semibold text-[11px]">Unit Tests</p>
                  <p className="text-ink-tertiary text-[10px]">Individual model assertions</p>
                </div>
                <div className="text-right pr-2 text-[10px] text-ink-faint -mt-5">746/day</div>
              </div>
              <p className="text-center text-[11px] text-ink-secondary font-semibold mt-3 font-sans">
                Total: {testsToday.toLocaleString()} tests/day
              </p>
            </div>
          </div>

          {/* Testing categories */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
              Testing Categories
            </h3>
            <div className="space-y-3">
              {testCategories.map((tc, i) => (
                <div key={tc.name} className="flex gap-3">
                  <span className="text-[11px] text-ink-faint font-mono shrink-0 w-4 text-right">{i + 1}.</span>
                  <div>
                    <span className="text-[12px] font-semibold text-ink">{tc.name}</span>
                    <span className="text-[11px] text-ink-tertiary ml-1.5">({tc.count}+ cases)</span>
                    <p className="text-[11px] text-ink-secondary leading-relaxed">{tc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SECTION 5: Human-in-the-Loop Queue ━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Human-in-the-Loop Review Queue</h2>
          <span className="ml-auto text-[11px] text-ink-tertiary">{reviewQueue.length} items</span>
        </div>
        <div className="space-y-3">
          {reviewQueue.map((item) => {
            const isOpen = expandedItem === item.title;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-surface-raised overflow-hidden cursor-pointer transition-colors hover:border-border/80"
                onClick={() => setExpandedItem(isOpen ? null : item.title)}
              >
                {/* Confidence bar */}
                <div className="h-1 bg-surface">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.confidence}%`,
                      backgroundColor: item.confidence >= 90 ? '#22C55E' : item.confidence >= 80 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
                <div className="p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-ink-tertiary mt-0.5 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h3 className="text-[13px] font-semibold text-ink">
                          {item.title}
                          <span className="ml-2 text-[11px] font-normal text-ink-tertiary">— {item.flag}</span>
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-[11px] font-medium"
                            style={{
                              color:
                                item.confidence >= 90
                                  ? '#22C55E'
                                  : item.confidence >= 80
                                    ? '#F59E0B'
                                    : '#EF4444',
                            }}
                          >
                            AI confidence: {item.confidence}%
                          </span>
                          <span className="text-[10px] text-ink-faint">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {outcomeBadge(item.outcome)}
                      {priorityBadge(item.priority)}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-3 border-t border-border/50 space-y-3">
                          {/* AI reasoning chain */}
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary">
                              AI Reasoning Chain
                            </span>
                            <div className="mt-1.5 space-y-1 font-mono text-[11px] text-ink-secondary bg-surface/60 rounded-lg p-3">
                              {item.reasoning.map((step, i) => (
                                <div key={i} className="flex gap-2">
                                  <span className="text-ink-faint shrink-0">{i + 1}.</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Review info */}
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
                            <div>
                              <span className="text-ink-tertiary">Reviewer: </span>
                              <span className="text-ink-secondary">{item.reviewer}</span>
                            </div>
                            {item.outcome && (
                              <div>
                                <span className="text-ink-tertiary">After human review: </span>
                                {outcomeBadge(item.outcome)}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ━━━ SECTION 6: Model Performance Over Time ━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Model Performance Over Time</h2>
        </div>
        <p className="text-[11px] text-ink-tertiary mb-4 ml-6">
          6-month trend: accuracy up, false positives down, test coverage expanding
        </p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perfData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              />
              <YAxis
                yAxisId="pct"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                domain={[0, 1000]}
                tick={{ fontSize: 10, fill: '#8896A6' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickFormatter={(v: number) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20,22,28,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E2E8F0',
                }}
              />
              <ReferenceLine yAxisId="pct" y={95} stroke="#F59E0B" strokeDasharray="6 3" />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 3, fill: '#22C55E', stroke: '#1a1c24', strokeWidth: 2 }}
              />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="falsePositive"
                name="False Positive Rate"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 3, fill: '#EF4444', stroke: '#1a1c24', strokeWidth: 2 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="tests"
                name="Tests/Day"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 3, fill: '#3B82F6', stroke: '#1a1c24', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#22C55E]" />
            <span className="text-[10px] text-ink-tertiary">Accuracy %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#EF4444]" />
            <span className="text-[10px] text-ink-tertiary">False Positive Rate %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded bg-[#3B82F6] opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3B82F6 0px, #3B82F6 4px, transparent 4px, transparent 7px)' }} />
            <span className="text-[10px] text-ink-tertiary">Tests/Day (right axis)</span>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SECTION 7: Testing Configuration ━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.48 }}
        className="rounded-xl border border-border bg-surface-raised p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-4 h-4 text-ink-tertiary" strokeWidth={1.7} />
          <h2 className="text-sm font-semibold text-ink">Testing Configuration</h2>
        </div>

        {/* Threshold tiers */}
        <div className="mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-3">
            Confidence Thresholds by Category
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {thresholdConfig.map((t) => (
              <div
                key={t.category}
                className="rounded-lg border border-border/50 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: t.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-ink">{t.category}</span>
                  <span
                    className="text-[18px] font-bold tabular-nums"
                    style={{ color: t.color }}
                  >
                    {t.threshold}%
                  </span>
                </div>
                <div className="space-y-0.5">
                  {t.workflows.map((w) => (
                    <p key={w} className="text-[11px] text-ink-secondary">{w}</p>
                  ))}
                </div>
                {t.note && (
                  <p className="text-[10px] text-ink-faint mt-2 italic">{t.note}</p>
                )}
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      t.status === 'FRA Certified'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : t.status === 'Certified'
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {t.status === 'In Review' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General config */}
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-3">
          General Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Test Frequency', value: 'Continuous', note: 'Every AI output tested', icon: Activity },
            { label: 'Drift Alert', value: '>3% in 7 days', note: 'Trigger when accuracy drops', icon: AlertTriangle },
            { label: 'FRA Compliance', value: 'Enabled', note: 'Safety-critical: 95%+ required', icon: ShieldCheck },
            { label: 'Human Review SLA', value: 'Critical < 2h', note: 'Standard < 24 hours', icon: Clock },
            { label: 'Target Score', value: '95%', note: `Current: ${rel.accuracy}% (${rel.trend})`, icon: Target },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="p-3 rounded-lg bg-surface/60 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-ink-tertiary" strokeWidth={1.7} />
                  <span className="text-[11px] font-medium text-ink-tertiary">{c.label}</span>
                </div>
                <p className="text-[14px] font-semibold text-ink">{c.value}</p>
                <p className="text-[10px] text-ink-faint mt-0.5">{c.note}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom spacer for scroll */}
      <div className="h-4" />
    </div>
  );
}
