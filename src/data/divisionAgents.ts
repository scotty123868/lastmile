export interface AgentDef {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  status: 'active' | 'running' | 'paused';
  statusLabel: string;
  accent: 'blue' | 'green' | 'amber' | 'purple';
  division: string;
  divisionName: string;
  metrics: { label: string; value: string }[];
  description: string;
  category: 'operations' | 'intelligence' | 'safety' | 'logistics';
  deepDiveLink?: string;
}

/* ── Shared Platform Agents (5) ─────────────────────────────────────────── */

const sharedAgents: AgentDef[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    subtitle: 'Personal AI Assistant',
    icon: 'User',
    status: 'active',
    statusLabel: 'Active (per-user)',
    accent: 'blue',
    division: 'shared',
    divisionName: 'Shared Platform',
    metrics: [
      { label: 'Queries answered today', value: '~2,340' },
      { label: 'Response time', value: '1.2s' },
      { label: 'User satisfaction', value: '94%' },
      { label: 'Active sessions', value: '127' },
    ],
    description:
      "Each employee's personal AI assistant connected to their role-specific data. A track inspector asks \"what's the defect history at MP 247?\" and gets an instant answer pulling from inspection records, weather data, and maintenance history.",
    category: 'intelligence',
    deepDiveLink: '#atlas-deep-dive',
  },
  {
    id: 'chief',
    name: 'Chief',
    subtitle: 'Executive Briefing Agent',
    icon: 'Briefcase',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'shared',
    divisionName: 'Shared Platform',
    metrics: [
      { label: 'Briefings generated', value: '14/week' },
      { label: 'Data sources synthesized', value: '47' },
      { label: 'Accuracy', value: '96.1%' },
      { label: 'Last briefing', value: 'just now' },
    ],
    description:
      'Monitors all 7 divisions daily and generates an executive briefing for the CEO every morning at 7:00 AM. Summarizes key metrics changes, compliance alerts, project milestones, budget variances, and personnel issues.',
    category: 'intelligence',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    subtitle: 'License Waste Scanner',
    icon: 'Search',
    status: 'running',
    statusLabel: 'Running (weekly scan)',
    accent: 'blue',
    division: 'shared',
    divisionName: 'Shared Platform',
    metrics: [
      { label: 'Platforms monitored', value: '47' },
      { label: 'Waste identified', value: '$47K/month' },
      { label: 'Coverage', value: '100%' },
      { label: 'Next scan', value: 'March 31' },
    ],
    description:
      'Audits software license usage across all divisions weekly. Identifies unused seats, duplicate subscriptions, and consolidation opportunities. Has recovered $312K in wasted software spend since October.',
    category: 'operations',
  },
  {
    id: 'relay',
    name: 'Relay',
    subtitle: 'Meeting Intelligence',
    icon: 'Mic',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'shared',
    divisionName: 'Shared Platform',
    metrics: [
      { label: 'Meetings analyzed', value: '89/week' },
      { label: 'Action items extracted', value: '234' },
      { label: 'Follow-up rate', value: '78%' },
      { label: 'Recordings processed', value: '156' },
    ],
    description:
      'Attends all internal meetings via calendar integration, generates transcripts, extracts action items, tracks commitments across meetings, and flags when deadlines are missed.',
    category: 'intelligence',
  },
  {
    id: 'signal',
    name: 'Signal',
    subtitle: 'Communications Intelligence',
    icon: 'Radio',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'shared',
    divisionName: 'Shared Platform',
    metrics: [
      { label: 'Messages monitored', value: '12K/day' },
      { label: 'Sentiment alerts', value: '3' },
      { label: 'Escalations', value: '1' },
      { label: 'Channels', value: '47' },
    ],
    description:
      'Monitors internal email and Slack for mentions of safety concerns, compliance issues, equipment problems, or customer complaints that need escalation. Surfaces patterns that would take weeks to notice manually.',
    category: 'intelligence',
  },
];

/* ── HCC — Herzog Contracting Corp (4) ──────────────────────────────────── */

const hccAgents: AgentDef[] = [
  {
    id: 'dispatch',
    name: 'Dispatch',
    subtitle: 'HOS Compliance Monitor',
    icon: 'Shield',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Watching', value: '2,800 employees across 7 divisions' },
      { label: 'Violations prevented', value: '23 this month' },
      { label: 'Savings this month', value: '$368K' },
      { label: 'False alarm rate', value: '0.8%' },
    ],
    description:
      'Monitors FRA Hours-of-Service compliance across all 7 Herzog divisions in real time. Catches violations before they happen, automatically reassigns crew, and files FRA reports. Zero violations since deployment in October 2025.',
    category: 'safety',
    deepDiveLink: '#dispatch-deep-dive',
  },
  {
    id: 'foreman',
    name: 'Foreman',
    subtitle: 'Equipment Dispatch & Crew Assignment',
    icon: 'Truck',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Equipment tracked', value: '340 units' },
      { label: 'Idle time reduced', value: '42%' },
      { label: 'Crew assignments optimized', value: '89/day' },
      { label: 'Fuel savings', value: '$12K/week' },
    ],
    description:
      'Optimizes heavy equipment dispatch and crew assignment across HCC construction projects. Reduces idle time, minimizes fuel consumption, and ensures the right equipment reaches the right jobsite.',
    category: 'logistics',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    subtitle: 'Project Estimation AI',
    icon: 'Calculator',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Active bid packages', value: '14' },
      { label: 'Accuracy', value: '94% within \u00B18% of winning bid' },
      { label: 'Last analysis', value: 'I-70 Bridge Rehab' },
      { label: 'Savings this quarter', value: '$420K' },
    ],
    description:
      'Analyzes project bid packages against historical data to catch cost estimation errors before submission. Rail projects have 44.7% average cost overrun \u2014 Blueprint reduces this to under 12%.',
    category: 'operations',
  },
  {
    id: 'surveyor',
    name: 'Surveyor',
    subtitle: 'GPS Fleet Utilization',
    icon: 'MapPin',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Vehicles tracked', value: '200' },
      { label: 'Utilization rate', value: '82%' },
      { label: 'Route optimization', value: '18% shorter' },
      { label: 'Fuel savings', value: '$8.4K/week' },
    ],
    description:
      'Tracks fleet GPS data in real time to maximize vehicle utilization, optimize routing, and reduce fuel consumption across HCC construction operations.',
    category: 'logistics',
  },
];

/* ── HRSI — Herzog Railroad Services (4) ────────────────────────────────── */

const hrsiAgents: AgentDef[] = [
  {
    id: 'scout',
    name: 'Scout',
    subtitle: 'Track Defect Early Warning',
    icon: 'Eye',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Monitoring', value: '4,200 track miles' },
      { label: 'Defects predicted this week', value: '8' },
      { label: 'False alarm rate', value: '0.8%' },
      { label: 'Detection accuracy', value: '94.2%' },
    ],
    description:
      'Combines geometry car data, weather patterns, tonnage history, and inspection records to predict track defects 2-3 weeks before they become safety issues.',
    category: 'safety',
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    subtitle: 'Predictive Maintenance',
    icon: 'Wrench',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Equipment monitored', value: '156' },
      { label: 'Failures predicted', value: '12 (next 30 days)' },
      { label: 'Mean lead time', value: '6.2 weeks' },
      { label: 'Cost avoidance', value: '$89K/month' },
    ],
    description:
      'Uses sensor data and maintenance history to predict equipment failures weeks in advance, enabling proactive repairs and avoiding costly unplanned downtime.',
    category: 'operations',
  },
  {
    id: 'stockroom',
    name: 'Stockroom',
    subtitle: 'Parts Inventory Optimization',
    icon: 'Package',
    status: 'running',
    statusLabel: 'Running',
    accent: 'green',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'SKUs managed', value: '4,200' },
      { label: 'Stockout risk', value: '2 items' },
      { label: 'Reorder suggestions', value: '18' },
      { label: 'Carrying cost reduced', value: '14%' },
    ],
    description:
      'Optimizes parts inventory levels across HRSI warehouses using demand forecasting, lead time analysis, and criticality scoring to minimize stockouts while reducing carrying costs.',
    category: 'logistics',
  },
  {
    id: 'ballast',
    name: 'Ballast',
    subtitle: 'Material Logistics',
    icon: 'Layers',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Deliveries optimized', value: '34/week' },
      { label: 'Route efficiency', value: '+22%' },
      { label: 'Material waste reduced', value: '8%' },
      { label: 'On-time rate', value: '96%' },
    ],
    description:
      'Coordinates ballast and material deliveries across HRSI track maintenance projects, optimizing delivery routes and minimizing material waste.',
    category: 'logistics',
  },
];

/* ── HSI — Herzog Services / Rail Testing (3) ───────────────────────────── */

const hsiAgents: AgentDef[] = [
  {
    id: 'railsentry',
    name: 'RailSentry',
    subtitle: 'AI Rail Inspection',
    icon: 'ScanLine',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Geometry cars active', value: '4' },
      { label: 'Defects detected this week', value: '23' },
      { label: 'Accuracy', value: '94.2%' },
      { label: 'Images processed', value: '12K/day' },
    ],
    description:
      'AI-powered rail flaw detection system that processes ultrasonic and visual inspection data from geometry cars in real time, detecting rail defects with 94.2% accuracy.',
    category: 'safety',
  },
  {
    id: 'inspector',
    name: 'Inspector',
    subtitle: 'Testing Schedule Optimization',
    icon: 'ClipboardCheck',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Tests scheduled', value: '180/month' },
      { label: 'Schedule efficiency', value: '+31%' },
      { label: 'Coverage', value: '98.4% of network' },
      { label: 'Backlog', value: '6 tests' },
    ],
    description:
      'Optimizes rail testing schedules across the network, balancing coverage requirements, crew availability, and equipment maintenance windows to maximize testing efficiency.',
    category: 'operations',
  },
  {
    id: 'calibrator',
    name: 'Calibrator',
    subtitle: 'Equipment Calibration',
    icon: 'Gauge',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Instruments tracked', value: '89' },
      { label: 'Due for calibration', value: '4' },
      { label: 'Compliance rate', value: '99.6%' },
      { label: 'Cost savings', value: '$14K/quarter' },
    ],
    description:
      'Tracks calibration status of all testing instruments, schedules recalibrations proactively, and ensures 100% compliance with NIST and FRA measurement standards.',
    category: 'operations',
  },
];

/* ── HTI — Herzog Technologies (3) ──────────────────────────────────────── */

const htiAgents: AgentDef[] = [
  {
    id: 'sentinel',
    name: 'Sentinel',
    subtitle: 'Signal System Health',
    icon: 'Activity',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Signals monitored', value: '2,400' },
      { label: 'Anomalies detected', value: '3/week' },
      { label: 'False positive rate', value: '1.2%' },
      { label: 'Uptime', value: '99.97%' },
    ],
    description:
      'Monitors the health of railroad signal systems in real time, detecting anomalies and predicting failures before they impact train operations.',
    category: 'safety',
  },
  {
    id: 'integrator',
    name: 'Integrator',
    subtitle: 'PTC Installation Tracker',
    icon: 'GitBranch',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Active projects', value: '8' },
      { label: 'Completion rate', value: '73%' },
      { label: 'Schedule variance', value: '-2 days' },
      { label: 'Budget variance', value: '+1.2%' },
    ],
    description:
      'Tracks Positive Train Control installation projects across multiple railroads, monitoring completion rates, schedule variance, and budget performance.',
    category: 'operations',
  },
  {
    id: 'compliance',
    name: 'Compliance',
    subtitle: 'FRA Signal Compliance',
    icon: 'FileCheck',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Regulations tracked', value: '47' },
      { label: 'Compliance rate', value: '99.8%' },
      { label: 'Auto-filed reports', value: '12/month' },
      { label: 'Audit ready', value: 'Yes' },
    ],
    description:
      'Automatically tracks FRA signal regulations, generates compliance reports, and ensures HTI signal installations meet all federal requirements.',
    category: 'safety',
  },
];

/* ── HTSI — Herzog Transit Services (4) ─────────────────────────────────── */

const htsiAgents: AgentDef[] = [
  {
    id: 'router',
    name: 'Router',
    subtitle: 'Transit Schedule Optimization',
    icon: 'Route',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Routes optimized', value: '24' },
      { label: 'On-time performance', value: '94.2%' },
      { label: 'Delay predictions', value: '6/day' },
      { label: 'Passenger impact', value: '-18% wait time' },
    ],
    description:
      'Optimizes transit schedules in real time, predicting delays and adjusting routes to minimize passenger wait times and maximize on-time performance.',
    category: 'operations',
  },
  {
    id: 'conductor',
    name: 'Conductor',
    subtitle: 'Crew Rostering',
    icon: 'Users',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Crew members', value: '480' },
      { label: 'Qualification gaps', value: '3' },
      { label: 'Overtime reduced', value: '22%' },
      { label: 'Union rule compliance', value: '100%' },
    ],
    description:
      'Manages crew rostering for transit operations, ensuring qualification compliance, minimizing overtime costs, and maintaining 100% union rule adherence.',
    category: 'operations',
  },
  {
    id: 'passenger',
    name: 'Passenger',
    subtitle: 'Ridership Forecasting',
    icon: 'BarChart3',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Daily predictions', value: '24 routes' },
      { label: 'Accuracy', value: '91%' },
      { label: 'Capacity alerts', value: '2/week' },
      { label: 'Revenue optimization', value: '+$34K/month' },
    ],
    description:
      'Forecasts ridership demand across transit routes, enabling proactive capacity management and revenue optimization through dynamic scheduling.',
    category: 'intelligence',
  },
  {
    id: 'safety',
    name: 'Safety',
    subtitle: 'Incident Tracking',
    icon: 'ShieldAlert',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Incidents monitored', value: '0 (current shift)' },
      { label: 'Response time', value: '<2 min' },
      { label: 'Trend analysis', value: 'improving' },
      { label: 'Near-miss reports', value: '4/month' },
    ],
    description:
      'Tracks safety incidents across transit operations in real time, analyzing trends, monitoring response times, and generating near-miss reports for continuous improvement.',
    category: 'safety',
  },
];

/* ── HE — Herzog Energy (2) ─────────────────────────────────────────────── */

const heAgents: AgentDef[] = [
  {
    id: 'gridwatch',
    name: 'GridWatch',
    subtitle: 'Asset Health Monitor',
    icon: 'Zap',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'he',
    divisionName: 'Herzog Energy',
    metrics: [
      { label: 'Assets monitored', value: '340' },
      { label: 'Alerts this week', value: '2' },
      { label: 'Predicted failures', value: '1' },
      { label: 'Mean detection lead', value: '4.8 weeks' },
    ],
    description:
      'Monitors the health of energy infrastructure assets using sensor data and predictive analytics, detecting potential failures weeks before they occur.',
    category: 'operations',
  },
  {
    id: 'permit',
    name: 'Permit',
    subtitle: 'Environmental Permit Tracking',
    icon: 'FileText',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'he',
    divisionName: 'Herzog Energy',
    metrics: [
      { label: 'Active permits', value: '23' },
      { label: 'Renewals due (90 days)', value: '3' },
      { label: 'Compliance rate', value: '100%' },
      { label: 'Auto-filed', value: '8/month' },
    ],
    description:
      'Tracks environmental permits across energy projects, automatically filing renewal paperwork and ensuring 100% compliance with state and federal regulations.',
    category: 'safety',
  },
];

/* ── GG — Green Group (2) ───────────────────────────────────────────────── */

const ggAgents: AgentDef[] = [
  {
    id: 'remediation',
    name: 'Remediation',
    subtitle: 'Cleanup Tracking',
    icon: 'Leaf',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'gg',
    divisionName: 'Green Group',
    metrics: [
      { label: 'Active sites', value: '12' },
      { label: 'Progress', value: '78% avg' },
      { label: 'Completion predictions', value: '3 sites this quarter' },
      { label: 'Cost variance', value: '-4%' },
    ],
    description:
      'Tracks environmental remediation progress across active cleanup sites, predicting completion timelines and monitoring cost variance against budgets.',
    category: 'operations',
  },
  {
    id: 'monitor',
    name: 'Monitor',
    subtitle: 'Environmental Compliance',
    icon: 'Thermometer',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'gg',
    divisionName: 'Green Group',
    metrics: [
      { label: 'Sensors monitored', value: '89' },
      { label: 'Violations', value: '0 (30 days)' },
      { label: 'Reports auto-filed', value: '34' },
      { label: 'Regulatory changes tracked', value: '12' },
    ],
    description:
      'Monitors environmental sensors across Green Group sites, ensuring zero compliance violations and automatically filing required regulatory reports.',
    category: 'safety',
  },
];

/* ── Combined list ──────────────────────────────────────────────────────── */

const allAgents: AgentDef[] = [
  ...sharedAgents,
  ...hccAgents,
  ...hrsiAgents,
  ...hsiAgents,
  ...htiAgents,
  ...htsiAgents,
  ...heAgents,
  ...ggAgents,
];

/* ── Division metadata for grouping ─────────────────────────────────────── */

export const divisionMeta: Record<string, { name: string; accent: 'blue' | 'green' | 'amber' | 'purple' }> = {
  shared: { name: 'Shared Platform', accent: 'blue' },
  hcc: { name: 'Herzog Contracting', accent: 'blue' },
  hrsi: { name: 'Herzog Railroad Services', accent: 'green' },
  hsi: { name: 'Herzog Services', accent: 'amber' },
  hti: { name: 'Herzog Technologies', accent: 'purple' },
  htsi: { name: 'Herzog Transit Services', accent: 'blue' },
  he: { name: 'Herzog Energy', accent: 'green' },
  gg: { name: 'Green Group', accent: 'amber' },
};

/* ── Export functions ───────────────────────────────────────────────────── */

/** Returns division-specific agents + shared platform agents */
export function getAgentsForDivision(divisionId: string): AgentDef[] {
  if (divisionId === 'meridian' || divisionId === 'shared') {
    return allAgents;
  }
  return allAgents.filter(
    (a) => a.division === divisionId || a.division === 'shared',
  );
}

/** Returns all 32 agents */
export function getAllAgents(): AgentDef[] {
  return allAgents;
}
