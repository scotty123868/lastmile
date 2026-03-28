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

/** Activity log entry returned by the agent detail API */
export interface AgentActivity {
  timestamp: string;
  action: string;
  detail: string;
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

/* ── HCC — Herzog Contracting Corp (7) ──────────────────────────────────── */

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
  {
    id: 'batchmonitor',
    name: 'BatchMonitor',
    subtitle: 'Concrete Batch Monitor',
    icon: 'Beaker',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Batches monitored today', value: '47' },
      { label: 'Quality pass rate', value: '99.2%' },
      { label: 'Slump variance', value: '±0.3 in' },
      { label: 'Waste reduced', value: '12%' },
    ],
    description:
      'Monitors concrete batch plant operations in real time, tracking mix consistency, slump tests, temperature, and water-cement ratios. Flags out-of-spec batches before they leave the plant, preventing costly field rejections and rework.',
    category: 'operations',
  },
  {
    id: 'fleettracker',
    name: 'FleetTracker',
    subtitle: 'Equipment Fleet Tracker',
    icon: 'Container',
    status: 'running',
    statusLabel: 'Running (daily sync)',
    accent: 'purple',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Heavy equipment tracked', value: '340' },
      { label: 'Maintenance compliance', value: '97.4%' },
      { label: 'Avg utilization', value: '78%' },
      { label: 'Cost per hour tracked', value: '$142' },
    ],
    description:
      'Maintains a real-time inventory of all heavy equipment across HCC projects, tracking location, hours, maintenance schedules, and depreciation. Identifies underutilized assets for redeployment and flags equipment approaching service intervals.',
    category: 'logistics',
  },
  {
    id: 'weatherdelay',
    name: 'WeatherDelay',
    subtitle: 'Weather Delay Predictor',
    icon: 'CloudRain',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hcc',
    divisionName: 'Herzog Contracting',
    metrics: [
      { label: 'Sites monitored', value: '18' },
      { label: 'Prediction accuracy', value: '89%' },
      { label: 'Delay days avoided', value: '14 this quarter' },
      { label: 'Schedule impact saved', value: '$220K' },
    ],
    description:
      'Combines hyperlocal weather forecasts with project schedule data to predict weather-related delays 3-5 days in advance. Automatically suggests schedule adjustments, crew reallocation, and material protection measures for each active jobsite.',
    category: 'intelligence',
  },
];

/* ── HRSI — Herzog Railroad Services (7) ────────────────────────────────── */

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
  {
    id: 'tiereplacement',
    name: 'TieReplacer',
    subtitle: 'Tie Replacement Optimizer',
    icon: 'Rows3',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Ties assessed', value: '48,000' },
      { label: 'Replacement priority', value: '1,240 this quarter' },
      { label: 'Cost optimization', value: '-8% vs manual' },
      { label: 'Life extension', value: '+2.4 years avg' },
    ],
    description:
      'Analyzes tie condition data from track inspections, tonnage history, and environmental factors to prioritize tie replacements by urgency. Optimizes gang deployment to minimize track time and maximize ties replaced per production day.',
    category: 'operations',
  },
  {
    id: 'geometrycar',
    name: 'GeometryAnalyst',
    subtitle: 'Geometry Car Analyst',
    icon: 'LineChart',
    status: 'running',
    statusLabel: 'Running (analysis)',
    accent: 'green',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Miles analyzed', value: '2,800/month' },
      { label: 'Exception reports', value: '34' },
      { label: 'Trend corridors flagged', value: '7' },
      { label: 'FRA compliance', value: '99.4%' },
    ],
    description:
      'Processes geometry car measurement data to identify track geometry exceptions, trending conditions, and priority maintenance areas. Correlates geometry data with tonnage, weather, and maintenance history to predict degradation rates.',
    category: 'intelligence',
  },
  {
    id: 'tampingscheduler',
    name: 'TampScheduler',
    subtitle: 'Tamping Scheduler',
    icon: 'CalendarClock',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hrsi',
    divisionName: 'Herzog Railroad Services',
    metrics: [
      { label: 'Tamping windows scheduled', value: '18/month' },
      { label: 'Track time utilization', value: '94%' },
      { label: 'Production rate', value: '+11% vs plan' },
      { label: 'Rework rate', value: '2.1%' },
    ],
    description:
      'Optimizes tamping machine scheduling by coordinating track windows, crew availability, and priority segments. Ensures tamping operations achieve maximum production per track window while meeting FRA geometry standards.',
    category: 'logistics',
  },
];

/* ── HSI — Herzog Services / Rail Testing (6) ───────────────────────────── */

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
  {
    id: 'emissionstracker',
    name: 'EmissionsTracker',
    subtitle: 'Emissions Tracker',
    icon: 'Wind',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Sources monitored', value: '34' },
      { label: 'CO2e this month', value: '142 tons' },
      { label: 'Reduction vs baseline', value: '-18%' },
      { label: 'EPA compliance', value: '100%' },
    ],
    description:
      'Tracks emissions across all HSI testing operations including geometry cars, hi-rail vehicles, and support equipment. Generates EPA compliance reports automatically and identifies opportunities to reduce the carbon footprint of rail testing activities.',
    category: 'safety',
  },
  {
    id: 'wastestream',
    name: 'WasteStream',
    subtitle: 'Waste Stream Optimizer',
    icon: 'Recycle',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Waste streams tracked', value: '12' },
      { label: 'Diversion rate', value: '74%' },
      { label: 'Cost savings', value: '$8.2K/month' },
      { label: 'Manifests auto-filed', value: '23' },
    ],
    description:
      'Monitors and optimizes waste streams from rail testing and environmental services operations. Tracks hazardous and non-hazardous waste volumes, identifies recycling opportunities, and automatically generates waste manifests for regulatory compliance.',
    category: 'operations',
  },
  {
    id: 'permitrenewal',
    name: 'PermitRenewal',
    subtitle: 'Permit Renewal Agent',
    icon: 'FileClock',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hsi',
    divisionName: 'Herzog Services',
    metrics: [
      { label: 'Active permits', value: '47' },
      { label: 'Renewals due (60 days)', value: '5' },
      { label: 'Auto-renewed', value: '12 this quarter' },
      { label: 'Compliance rate', value: '100%' },
    ],
    description:
      'Manages the full lifecycle of environmental and operational permits for HSI. Tracks expiration dates, auto-populates renewal applications from historical data, and ensures zero lapses across all state and federal permits.',
    category: 'safety',
  },
];

/* ── HTI — Herzog Technologies (6) ──────────────────────────────────────── */

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
  {
    id: 'patentmonitor',
    name: 'PatentMonitor',
    subtitle: 'Patent Monitor',
    icon: 'ScrollText',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Patents tracked', value: '89' },
      { label: 'New filings monitored', value: '340/month' },
      { label: 'Infringement risks', value: '0' },
      { label: 'Licensing opportunities', value: '3' },
    ],
    description:
      'Monitors the patent landscape for railroad signaling and PTC technologies, tracking competitor filings, identifying potential infringement risks, and surfacing licensing opportunities. Maintains HTI\'s IP portfolio status and renewal deadlines.',
    category: 'intelligence',
  },
  {
    id: 'rdpipeline',
    name: 'R&DPipeline',
    subtitle: 'R&D Pipeline Tracker',
    icon: 'FlaskConical',
    status: 'running',
    statusLabel: 'Running (weekly update)',
    accent: 'green',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Active R&D projects', value: '14' },
      { label: 'Stage gates passed', value: '8 this quarter' },
      { label: 'Budget utilization', value: '82%' },
      { label: 'Time to market avg', value: '14 months' },
    ],
    description:
      'Tracks all HTI research and development projects through stage-gate milestones, monitoring budget burn rates, resource allocation, and projected commercialization timelines. Generates weekly status reports for technology leadership.',
    category: 'operations',
  },
  {
    id: 'techtransfer',
    name: 'TechTransfer',
    subtitle: 'Tech Transfer Agent',
    icon: 'ArrowLeftRight',
    status: 'active',
    statusLabel: 'Active',
    accent: 'amber',
    division: 'hti',
    divisionName: 'Herzog Technologies',
    metrics: [
      { label: 'Transfer opportunities', value: '7' },
      { label: 'Cross-division adoptions', value: '4 this year' },
      { label: 'Revenue from licensing', value: '$180K' },
      { label: 'Partner evaluations', value: '12' },
    ],
    description:
      'Identifies opportunities to transfer HTI-developed technologies to other Herzog divisions or external partners. Evaluates commercial potential, manages licensing agreements, and tracks technology adoption across the enterprise.',
    category: 'intelligence',
  },
];

/* ── HTSI — Herzog Transit Services (7) ─────────────────────────────────── */

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
  {
    id: 'farerevenue',
    name: 'FareRevenue',
    subtitle: 'Fare Revenue Optimizer',
    icon: 'DollarSign',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Revenue tracked', value: '$2.4M/month' },
      { label: 'Fare evasion detected', value: '1.8%' },
      { label: 'Dynamic pricing uplift', value: '+$67K/month' },
      { label: 'Reconciliation accuracy', value: '99.7%' },
    ],
    description:
      'Optimizes fare revenue by analyzing ridership patterns, detecting fare evasion through gate data anomalies, and modeling dynamic pricing strategies. Reconciles fare collection across payment methods and generates revenue forecasts for transit authority reporting.',
    category: 'operations',
  },
  {
    id: 'adacompliance',
    name: 'ADACompliance',
    subtitle: 'ADA Compliance Monitor',
    icon: 'Accessibility',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Stations monitored', value: '42' },
      { label: 'ADA compliance rate', value: '98.6%' },
      { label: 'Issues open', value: '6' },
      { label: 'Avg resolution time', value: '2.4 days' },
    ],
    description:
      'Continuously monitors ADA compliance across all transit stations and vehicles, tracking elevator/escalator uptime, platform gap measurements, audio announcement functionality, and tactile signage condition. Auto-generates FTA compliance reports.',
    category: 'safety',
  },
  {
    id: 'fleetelectrify',
    name: 'FleetElectrify',
    subtitle: 'Fleet Electrification Tracker',
    icon: 'BatteryCharging',
    status: 'running',
    statusLabel: 'Running (quarterly model)',
    accent: 'amber',
    division: 'htsi',
    divisionName: 'Herzog Transit Services',
    metrics: [
      { label: 'Fleet electrified', value: '34%' },
      { label: 'Charging stations', value: '18 active' },
      { label: 'Energy cost savings', value: '$42K/month' },
      { label: 'CO2 reduction', value: '280 tons/year' },
    ],
    description:
      'Tracks the transit fleet electrification program, monitoring battery health across electric buses and rail vehicles, optimizing charging schedules to minimize peak demand charges, and projecting total cost of ownership for fleet replacement planning.',
    category: 'intelligence',
  },
];

/* ── HE — Herzog Energy (5) ──────────────────────────────────────────────── */

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
  {
    id: 'maduediligence',
    name: 'M&ADiligence',
    subtitle: 'M&A Due Diligence Agent',
    icon: 'Scale',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'he',
    divisionName: 'Herzog Energy',
    metrics: [
      { label: 'Active evaluations', value: '3' },
      { label: 'Data rooms processed', value: '12,000 docs' },
      { label: 'Risk flags identified', value: '14' },
      { label: 'Avg analysis time', value: '4.2 days' },
    ],
    description:
      'Accelerates M&A due diligence by automatically ingesting and analyzing data room documents, financial statements, contracts, and regulatory filings. Identifies material risks, revenue concentration issues, and integration complexity across potential acquisition targets.',
    category: 'intelligence',
  },
  {
    id: 'portfolioperf',
    name: 'PortfolioPerf',
    subtitle: 'Portfolio Performance Tracker',
    icon: 'PieChart',
    status: 'active',
    statusLabel: 'Active',
    accent: 'blue',
    division: 'he',
    divisionName: 'Herzog Energy',
    metrics: [
      { label: 'Divisions tracked', value: '7' },
      { label: 'KPIs monitored', value: '142' },
      { label: 'Variance alerts', value: '4 this week' },
      { label: 'ROIC trend', value: '+2.1% YoY' },
    ],
    description:
      'Monitors financial and operational performance across all seven Herzog divisions, tracking ROIC, EBITDA margins, working capital efficiency, and growth metrics. Generates automated variance analysis when any KPI deviates beyond threshold.',
    category: 'intelligence',
  },
  {
    id: 'boardreport',
    name: 'BoardReport',
    subtitle: 'Board Report Compiler',
    icon: 'Presentation',
    status: 'running',
    statusLabel: 'Running (monthly cycle)',
    accent: 'green',
    division: 'he',
    divisionName: 'Herzog Energy',
    metrics: [
      { label: 'Reports compiled', value: '4/quarter' },
      { label: 'Data sources', value: '89' },
      { label: 'Pages auto-generated', value: '47' },
      { label: 'Review time saved', value: '18 hours/report' },
    ],
    description:
      'Automatically compiles board-ready reports by aggregating data from all divisions, generating executive summaries, financial highlights, risk assessments, and strategic initiative updates. Reduces board report preparation from 3 weeks to 2 days.',
    category: 'operations',
  },
];

/* ── GG — Green Group (5) ────────────────────────────────────────────────── */

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
  {
    id: 'quarryyield',
    name: 'QuarryYield',
    subtitle: 'Quarry Yield Optimizer',
    icon: 'Mountain',
    status: 'active',
    statusLabel: 'Active',
    accent: 'purple',
    division: 'gg',
    divisionName: 'Green Group',
    metrics: [
      { label: 'Quarries monitored', value: '6' },
      { label: 'Yield efficiency', value: '87%' },
      { label: 'Blast optimization', value: '+14% fragmentation' },
      { label: 'Revenue per ton', value: '+$1.20' },
    ],
    description:
      'Optimizes quarry operations by analyzing blast patterns, crusher throughput, and aggregate gradation to maximize yield from each rock face. Uses geological survey data and production history to recommend optimal extraction sequences.',
    category: 'operations',
  },
  {
    id: 'envscanner',
    name: 'EnvScanner',
    subtitle: 'Environmental Compliance Scanner',
    icon: 'ScanSearch',
    status: 'active',
    statusLabel: 'Active',
    accent: 'green',
    division: 'gg',
    divisionName: 'Green Group',
    metrics: [
      { label: 'Regulations scanned', value: '340' },
      { label: 'Compliance gaps', value: '0' },
      { label: 'Upcoming changes', value: '4' },
      { label: 'Auto-reports filed', value: '18/month' },
    ],
    description:
      'Continuously scans federal, state, and local environmental regulations for changes that affect Green Group operations. Automatically assesses impact, generates compliance gap analyses, and drafts updated procedures before new rules take effect.',
    category: 'safety',
  },
  {
    id: 'fleetmaintpredict',
    name: 'FleetMaintPredict',
    subtitle: 'Fleet Maintenance Predictor',
    icon: 'Cog',
    status: 'running',
    statusLabel: 'Running (analysis)',
    accent: 'blue',
    division: 'gg',
    divisionName: 'Green Group',
    metrics: [
      { label: 'Vehicles monitored', value: '78' },
      { label: 'Failures predicted', value: '4 (next 30 days)' },
      { label: 'Downtime reduced', value: '34%' },
      { label: 'Parts pre-ordered', value: '12' },
    ],
    description:
      'Predicts maintenance needs for Green Group\'s fleet of haul trucks, loaders, and environmental service vehicles using telematics data, vibration analysis, and oil sampling results. Pre-orders parts and schedules repairs during planned downtime.',
    category: 'logistics',
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

/** Returns all 48 agents */
export function getAllAgents(): AgentDef[] {
  return allAgents;
}
