/**
 * Shared agent definitions for API routes.
 * Mirrors src/data/divisionAgents.ts — kept as a flat list for serverless use.
 */

export interface ApiAgent {
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
  instances: number;
  tasksToday: number;
  tasksThisWeek: number;
  uptimePercent: number;
}

export interface AgentActivity {
  timestamp: string;
  action: string;
  detail: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; requestId: string; version: string };
}

export function envelope<T>(data: T): ApiEnvelope<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      version: '1.0.0',
    },
  };
}

export function errorEnvelope(message: string, status: number) {
  return {
    success: false,
    error: { message, status },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    },
  };
}

/* ── All 48 agents ─────────────────────────────────────────────────────── */

export const allAgents: ApiAgent[] = [
  // Shared Platform (5)
  { id: 'atlas', name: 'Atlas', subtitle: 'Personal AI Assistant', icon: 'User', status: 'active', statusLabel: 'Active (per-user)', accent: 'blue', division: 'shared', divisionName: 'Shared Platform', metrics: [{ label: 'Queries answered today', value: '~2,340' }, { label: 'Response time', value: '1.2s' }, { label: 'User satisfaction', value: '94%' }, { label: 'Active sessions', value: '127' }], description: "Each employee's personal AI assistant connected to their role-specific data.", category: 'intelligence' , instances: 84, tasksToday: 2340, tasksThisWeek: 15210, uptimePercent: 99.95},
  { id: 'chief', name: 'Chief', subtitle: 'Executive Briefing Agent', icon: 'Briefcase', status: 'active', statusLabel: 'Active', accent: 'green', division: 'shared', divisionName: 'Shared Platform', metrics: [{ label: 'Briefings generated', value: '14/week' }, { label: 'Data sources synthesized', value: '47' }, { label: 'Accuracy', value: '96.1%' }, { label: 'Last briefing', value: 'just now' }], description: 'Monitors all 7 divisions daily and generates an executive briefing for the CEO every morning at 7:00 AM.', category: 'intelligence' , instances: 2, tasksToday: 42, tasksThisWeek: 273, uptimePercent: 99.99},
  { id: 'ledger', name: 'Ledger', subtitle: 'License Waste Scanner', icon: 'Search', status: 'running', statusLabel: 'Running (weekly scan)', accent: 'blue', division: 'shared', divisionName: 'Shared Platform', metrics: [{ label: 'Platforms monitored', value: '47' }, { label: 'Waste identified', value: '$47K/month' }, { label: 'Coverage', value: '100%' }, { label: 'Next scan', value: 'March 31' }], description: 'Audits software license usage across all divisions weekly.', category: 'operations' , instances: 7, tasksToday: 168, tasksThisWeek: 1092, uptimePercent: 99.8},
  { id: 'relay', name: 'Relay', subtitle: 'Meeting Intelligence', icon: 'Mic', status: 'active', statusLabel: 'Active', accent: 'green', division: 'shared', divisionName: 'Shared Platform', metrics: [{ label: 'Meetings analyzed', value: '89/week' }, { label: 'Action items extracted', value: '234' }, { label: 'Follow-up rate', value: '78%' }, { label: 'Recordings processed', value: '156' }], description: 'Attends all internal meetings, generates transcripts, extracts action items, and tracks commitments.', category: 'intelligence' , instances: 4, tasksToday: 356, tasksThisWeek: 2314, uptimePercent: 99.9},
  { id: 'signal', name: 'Signal', subtitle: 'Communications Intelligence', icon: 'Radio', status: 'active', statusLabel: 'Active', accent: 'green', division: 'shared', divisionName: 'Shared Platform', metrics: [{ label: 'Messages monitored', value: '12K/day' }, { label: 'Sentiment alerts', value: '3' }, { label: 'Escalations', value: '1' }, { label: 'Channels', value: '47' }], description: 'Monitors internal email and Slack for safety concerns, compliance issues, equipment problems, or customer complaints.', category: 'intelligence' , instances: 4, tasksToday: 3240, tasksThisWeek: 21060, uptimePercent: 99.97},

  // HCC (7)
  { id: 'dispatch', name: 'Dispatch', subtitle: 'HOS Compliance Monitor', icon: 'Shield', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Watching', value: '2,800 employees across 7 divisions' }, { label: 'Violations prevented', value: '23 this month' }, { label: 'Savings this month', value: '$368K' }, { label: 'False alarm rate', value: '0.8%' }], description: 'Monitors FRA Hours-of-Service compliance across all 7 Herzog divisions in real time.', category: 'safety' , instances: 14, tasksToday: 1920, tasksThisWeek: 12480, uptimePercent: 99.99},
  { id: 'foreman', name: 'Foreman', subtitle: 'Equipment Dispatch & Crew Assignment', icon: 'Truck', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Equipment tracked', value: '340 units' }, { label: 'Idle time reduced', value: '42%' }, { label: 'Crew assignments optimized', value: '89/day' }, { label: 'Fuel savings', value: '$12K/week' }], description: 'Optimizes heavy equipment dispatch and crew assignment across HCC construction projects.', category: 'logistics' , instances: 6, tasksToday: 534, tasksThisWeek: 3471, uptimePercent: 99.7},
  { id: 'blueprint', name: 'Blueprint', subtitle: 'Project Estimation AI', icon: 'Calculator', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Active bid packages', value: '14' }, { label: 'Accuracy', value: '94% within \u00B18% of winning bid' }, { label: 'Last analysis', value: 'I-70 Bridge Rehab' }, { label: 'Savings this quarter', value: '$420K' }], description: 'Analyzes project bid packages against historical data to catch cost estimation errors before submission.', category: 'operations' , instances: 3, tasksToday: 84, tasksThisWeek: 546, uptimePercent: 99.6},
  { id: 'surveyor', name: 'Surveyor', subtitle: 'GPS Fleet Utilization', icon: 'MapPin', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Vehicles tracked', value: '200' }, { label: 'Utilization rate', value: '82%' }, { label: 'Route optimization', value: '18% shorter' }, { label: 'Fuel savings', value: '$8.4K/week' }], description: 'Tracks fleet GPS data in real time to maximize vehicle utilization and optimize routing.', category: 'logistics' , instances: 4, tasksToday: 320, tasksThisWeek: 2080, uptimePercent: 99.8},
  { id: 'batchmonitor', name: 'BatchMonitor', subtitle: 'Concrete Batch Monitor', icon: 'Beaker', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Batches monitored today', value: '47' }, { label: 'Quality pass rate', value: '99.2%' }, { label: 'Slump variance', value: '\u00B10.3 in' }, { label: 'Waste reduced', value: '12%' }], description: 'Monitors concrete batch plant operations in real time, tracking mix consistency, slump tests, and temperature.', category: 'operations' , instances: 3, tasksToday: 141, tasksThisWeek: 917, uptimePercent: 99.2},
  { id: 'fleettracker', name: 'FleetTracker', subtitle: 'Equipment Fleet Tracker', icon: 'Container', status: 'running', statusLabel: 'Running (daily sync)', accent: 'purple', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Heavy equipment tracked', value: '340' }, { label: 'Maintenance compliance', value: '97.4%' }, { label: 'Avg utilization', value: '78%' }, { label: 'Cost per hour tracked', value: '$142' }], description: 'Maintains a real-time inventory of all heavy equipment across HCC projects.', category: 'logistics' , instances: 3, tasksToday: 204, tasksThisWeek: 1326, uptimePercent: 99.5},
  { id: 'weatherdelay', name: 'WeatherDelay', subtitle: 'Weather Delay Predictor', icon: 'CloudRain', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hcc', divisionName: 'Herzog Contracting', metrics: [{ label: 'Sites monitored', value: '18' }, { label: 'Prediction accuracy', value: '89%' }, { label: 'Delay days avoided', value: '14 this quarter' }, { label: 'Schedule impact saved', value: '$220K' }], description: 'Combines hyperlocal weather forecasts with project schedule data to predict weather-related delays.', category: 'intelligence' , instances: 2, tasksToday: 72, tasksThisWeek: 468, uptimePercent: 99.7},

  // HRSI (7)
  { id: 'scout', name: 'Scout', subtitle: 'Track Defect Early Warning', icon: 'Eye', status: 'active', statusLabel: 'Active', accent: 'green', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Monitoring', value: '4,200 track miles' }, { label: 'Defects predicted this week', value: '8' }, { label: 'False alarm rate', value: '0.8%' }, { label: 'Detection accuracy', value: '94.2%' }], description: 'Combines geometry car data, weather patterns, tonnage history, and inspection records to predict track defects.', category: 'safety' , instances: 8, tasksToday: 840, tasksThisWeek: 5460, uptimePercent: 99.9},
  { id: 'mechanic', name: 'Mechanic', subtitle: 'Predictive Maintenance', icon: 'Wrench', status: 'active', statusLabel: 'Active', accent: 'green', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Equipment monitored', value: '156' }, { label: 'Failures predicted', value: '12 (next 30 days)' }, { label: 'Mean lead time', value: '6.2 weeks' }, { label: 'Cost avoidance', value: '$89K/month' }], description: 'Uses sensor data and maintenance history to predict equipment failures weeks in advance.', category: 'operations' , instances: 4, tasksToday: 192, tasksThisWeek: 1248, uptimePercent: 99.7},
  { id: 'stockroom', name: 'Stockroom', subtitle: 'Parts Inventory Optimization', icon: 'Package', status: 'running', statusLabel: 'Running', accent: 'green', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'SKUs managed', value: '4,200' }, { label: 'Stockout risk', value: '2 items' }, { label: 'Reorder suggestions', value: '18' }, { label: 'Carrying cost reduced', value: '14%' }], description: 'Optimizes parts inventory levels across HRSI warehouses using demand forecasting.', category: 'logistics' , instances: 3, tasksToday: 108, tasksThisWeek: 702, uptimePercent: 99.5},
  { id: 'ballast', name: 'Ballast', subtitle: 'Material Logistics', icon: 'Layers', status: 'active', statusLabel: 'Active', accent: 'green', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Deliveries optimized', value: '34/week' }, { label: 'Route efficiency', value: '+22%' }, { label: 'Material waste reduced', value: '8%' }, { label: 'On-time rate', value: '96%' }], description: 'Coordinates ballast and material deliveries across HRSI track maintenance projects.', category: 'logistics' , instances: 3, tasksToday: 136, tasksThisWeek: 884, uptimePercent: 99.6},
  { id: 'tiereplacement', name: 'TieReplacer', subtitle: 'Tie Replacement Optimizer', icon: 'Rows3', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Ties assessed', value: '48,000' }, { label: 'Replacement priority', value: '1,240 this quarter' }, { label: 'Cost optimization', value: '-8% vs manual' }, { label: 'Life extension', value: '+2.4 years avg' }], description: 'Analyzes tie condition data to prioritize tie replacements by urgency.', category: 'operations' , instances: 3, tasksToday: 96, tasksThisWeek: 624, uptimePercent: 99.4},
  { id: 'geometrycar', name: 'GeometryAnalyst', subtitle: 'Geometry Car Analyst', icon: 'LineChart', status: 'running', statusLabel: 'Running (analysis)', accent: 'green', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Miles analyzed', value: '2,800/month' }, { label: 'Exception reports', value: '34' }, { label: 'Trend corridors flagged', value: '7' }, { label: 'FRA compliance', value: '99.4%' }], description: 'Processes geometry car measurement data to identify track geometry exceptions and trending conditions.', category: 'intelligence' , instances: 3, tasksToday: 84, tasksThisWeek: 546, uptimePercent: 99.8},
  { id: 'tampingscheduler', name: 'TampScheduler', subtitle: 'Tamping Scheduler', icon: 'CalendarClock', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hrsi', divisionName: 'Herzog Railroad Services', metrics: [{ label: 'Tamping windows scheduled', value: '18/month' }, { label: 'Track time utilization', value: '94%' }, { label: 'Production rate', value: '+11% vs plan' }, { label: 'Rework rate', value: '2.1%' }], description: 'Optimizes tamping machine scheduling by coordinating track windows and crew availability.', category: 'logistics' , instances: 2, tasksToday: 54, tasksThisWeek: 351, uptimePercent: 99.6},

  // HSI (6)
  { id: 'railsentry', name: 'RailSentry', subtitle: 'AI Rail Inspection', icon: 'ScanLine', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Geometry cars active', value: '4' }, { label: 'Defects detected this week', value: '23' }, { label: 'Accuracy', value: '94.2%' }, { label: 'Images processed', value: '12K/day' }], description: 'AI-powered rail flaw detection system that processes ultrasonic and visual inspection data in real time.', category: 'safety' , instances: 4, tasksToday: 648, tasksThisWeek: 4212, uptimePercent: 99.9},
  { id: 'inspector', name: 'Inspector', subtitle: 'Testing Schedule Optimization', icon: 'ClipboardCheck', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Tests scheduled', value: '180/month' }, { label: 'Schedule efficiency', value: '+31%' }, { label: 'Coverage', value: '98.4% of network' }, { label: 'Backlog', value: '6 tests' }], description: 'Optimizes rail testing schedules across the network.', category: 'operations' , instances: 3, tasksToday: 72, tasksThisWeek: 468, uptimePercent: 99.7},
  { id: 'calibrator', name: 'Calibrator', subtitle: 'Equipment Calibration', icon: 'Gauge', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Instruments tracked', value: '89' }, { label: 'Due for calibration', value: '4' }, { label: 'Compliance rate', value: '99.6%' }, { label: 'Cost savings', value: '$14K/quarter' }], description: 'Tracks calibration status of all testing instruments and ensures NIST/FRA compliance.', category: 'operations' , instances: 2, tasksToday: 24, tasksThisWeek: 156, uptimePercent: 99.6},
  { id: 'emissionstracker', name: 'EmissionsTracker', subtitle: 'Emissions Tracker', icon: 'Wind', status: 'active', statusLabel: 'Active', accent: 'green', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Sources monitored', value: '34' }, { label: 'CO2e this month', value: '142 tons' }, { label: 'Reduction vs baseline', value: '-18%' }, { label: 'EPA compliance', value: '100%' }], description: 'Tracks emissions across all HSI testing operations.', category: 'safety' , instances: 2, tasksToday: 68, tasksThisWeek: 442, uptimePercent: 99.8},
  { id: 'wastestream', name: 'WasteStream', subtitle: 'Waste Stream Optimizer', icon: 'Recycle', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Waste streams tracked', value: '12' }, { label: 'Diversion rate', value: '74%' }, { label: 'Cost savings', value: '$8.2K/month' }, { label: 'Manifests auto-filed', value: '23' }], description: 'Monitors and optimizes waste streams from rail testing and environmental services operations.', category: 'operations' , instances: 2, tasksToday: 46, tasksThisWeek: 299, uptimePercent: 99.5},
  { id: 'permitrenewal', name: 'PermitRenewal', subtitle: 'Permit Renewal Agent', icon: 'FileClock', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hsi', divisionName: 'Herzog Services', metrics: [{ label: 'Active permits', value: '47' }, { label: 'Renewals due (60 days)', value: '5' }, { label: 'Auto-renewed', value: '12 this quarter' }, { label: 'Compliance rate', value: '100%' }], description: 'Manages the full lifecycle of environmental and operational permits for HSI.', category: 'safety' , instances: 2, tasksToday: 24, tasksThisWeek: 156, uptimePercent: 99.9},

  // HTI (6)
  { id: 'sentinel', name: 'Sentinel', subtitle: 'Signal System Health', icon: 'Activity', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Signals monitored', value: '2,400' }, { label: 'Anomalies detected', value: '3/week' }, { label: 'False positive rate', value: '1.2%' }, { label: 'Uptime', value: '99.97%' }], description: 'Monitors railroad signal systems in real time, detecting anomalies and predicting failures.', category: 'safety' , instances: 4, tasksToday: 576, tasksThisWeek: 3744, uptimePercent: 99.97},
  { id: 'integrator', name: 'Integrator', subtitle: 'PTC Installation Tracker', icon: 'GitBranch', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Active projects', value: '8' }, { label: 'Completion rate', value: '73%' }, { label: 'Schedule variance', value: '-2 days' }, { label: 'Budget variance', value: '+1.2%' }], description: 'Tracks PTC installation projects across multiple railroads.', category: 'operations' , instances: 3, tasksToday: 48, tasksThisWeek: 312, uptimePercent: 99.6},
  { id: 'compliance', name: 'Compliance', subtitle: 'FRA Signal Compliance', icon: 'FileCheck', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Regulations tracked', value: '47' }, { label: 'Compliance rate', value: '99.8%' }, { label: 'Auto-filed reports', value: '12/month' }, { label: 'Audit ready', value: 'Yes' }], description: 'Automatically tracks FRA signal regulations and generates compliance reports.', category: 'safety' , instances: 3, tasksToday: 84, tasksThisWeek: 546, uptimePercent: 99.8},
  { id: 'patentmonitor', name: 'PatentMonitor', subtitle: 'Patent Monitor', icon: 'ScrollText', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Patents tracked', value: '89' }, { label: 'New filings monitored', value: '340/month' }, { label: 'Infringement risks', value: '0' }, { label: 'Licensing opportunities', value: '3' }], description: 'Monitors the patent landscape for railroad signaling and PTC technologies.', category: 'intelligence' , instances: 2, tasksToday: 34, tasksThisWeek: 221, uptimePercent: 99.7},
  { id: 'rdpipeline', name: 'R&DPipeline', subtitle: 'R&D Pipeline Tracker', icon: 'FlaskConical', status: 'running', statusLabel: 'Running (weekly update)', accent: 'green', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Active R&D projects', value: '14' }, { label: 'Stage gates passed', value: '8 this quarter' }, { label: 'Budget utilization', value: '82%' }, { label: 'Time to market avg', value: '14 months' }], description: 'Tracks all HTI R&D projects through stage-gate milestones.', category: 'operations' , instances: 2, tasksToday: 28, tasksThisWeek: 182, uptimePercent: 99.5},
  { id: 'techtransfer', name: 'TechTransfer', subtitle: 'Tech Transfer Agent', icon: 'ArrowLeftRight', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'hti', divisionName: 'Herzog Technologies', metrics: [{ label: 'Transfer opportunities', value: '7' }, { label: 'Cross-division adoptions', value: '4 this year' }, { label: 'Revenue from licensing', value: '$180K' }, { label: 'Partner evaluations', value: '12' }], description: 'Identifies opportunities to transfer HTI technologies to other divisions or partners.', category: 'intelligence' , instances: 2, tasksToday: 24, tasksThisWeek: 156, uptimePercent: 99.4},

  // HTSI (7)
  { id: 'router', name: 'Router', subtitle: 'Transit Schedule Optimization', icon: 'Route', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Routes optimized', value: '24' }, { label: 'On-time performance', value: '94.2%' }, { label: 'Delay predictions', value: '6/day' }, { label: 'Passenger impact', value: '-18% wait time' }], description: 'Optimizes transit schedules in real time, predicting delays and adjusting routes.', category: 'operations' , instances: 6, tasksToday: 960, tasksThisWeek: 6240, uptimePercent: 99.95},
  { id: 'conductor', name: 'Conductor', subtitle: 'Crew Rostering', icon: 'Users', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Crew members', value: '480' }, { label: 'Qualification gaps', value: '3' }, { label: 'Overtime reduced', value: '22%' }, { label: 'Union rule compliance', value: '100%' }], description: 'Manages crew rostering for transit operations.', category: 'operations' , instances: 4, tasksToday: 288, tasksThisWeek: 1872, uptimePercent: 99.8},
  { id: 'passenger', name: 'Passenger', subtitle: 'Ridership Forecasting', icon: 'BarChart3', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Daily predictions', value: '24 routes' }, { label: 'Accuracy', value: '91%' }, { label: 'Capacity alerts', value: '2/week' }, { label: 'Revenue optimization', value: '+$34K/month' }], description: 'Forecasts ridership demand across transit routes.', category: 'intelligence' , instances: 4, tasksToday: 192, tasksThisWeek: 1248, uptimePercent: 99.7},
  { id: 'safety', name: 'Safety', subtitle: 'Incident Tracking', icon: 'ShieldAlert', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Incidents monitored', value: '0 (current shift)' }, { label: 'Response time', value: '<2 min' }, { label: 'Trend analysis', value: 'improving' }, { label: 'Near-miss reports', value: '4/month' }], description: 'Tracks safety incidents across transit operations in real time.', category: 'safety' , instances: 4, tasksToday: 480, tasksThisWeek: 3120, uptimePercent: 99.99},
  { id: 'farerevenue', name: 'FareRevenue', subtitle: 'Fare Revenue Optimizer', icon: 'DollarSign', status: 'active', statusLabel: 'Active', accent: 'green', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Revenue tracked', value: '$2.4M/month' }, { label: 'Fare evasion detected', value: '1.8%' }, { label: 'Dynamic pricing uplift', value: '+$67K/month' }, { label: 'Reconciliation accuracy', value: '99.7%' }], description: 'Optimizes fare revenue by analyzing ridership patterns and modeling dynamic pricing strategies.', category: 'operations' , instances: 3, tasksToday: 144, tasksThisWeek: 936, uptimePercent: 99.7},
  { id: 'adacompliance', name: 'ADACompliance', subtitle: 'ADA Compliance Monitor', icon: 'Accessibility', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Stations monitored', value: '42' }, { label: 'ADA compliance rate', value: '98.6%' }, { label: 'Issues open', value: '6' }, { label: 'Avg resolution time', value: '2.4 days' }], description: 'Continuously monitors ADA compliance across all transit stations and vehicles.', category: 'safety' , instances: 3, tasksToday: 84, tasksThisWeek: 546, uptimePercent: 99.6},
  { id: 'fleetelectrify', name: 'FleetElectrify', subtitle: 'Fleet Electrification Tracker', icon: 'BatteryCharging', status: 'running', statusLabel: 'Running (quarterly model)', accent: 'amber', division: 'htsi', divisionName: 'Herzog Transit Services', metrics: [{ label: 'Fleet electrified', value: '34%' }, { label: 'Charging stations', value: '18 active' }, { label: 'Energy cost savings', value: '$42K/month' }, { label: 'CO2 reduction', value: '280 tons/year' }], description: 'Tracks the transit fleet electrification program.', category: 'intelligence' , instances: 2, tasksToday: 42, tasksThisWeek: 273, uptimePercent: 99.5},

  // HE (5)
  { id: 'gridwatch', name: 'GridWatch', subtitle: 'Asset Health Monitor', icon: 'Zap', status: 'active', statusLabel: 'Active', accent: 'green', division: 'he', divisionName: 'Herzog Energy', metrics: [{ label: 'Assets monitored', value: '340' }, { label: 'Alerts this week', value: '2' }, { label: 'Predicted failures', value: '1' }, { label: 'Mean detection lead', value: '4.8 weeks' }], description: 'Monitors the health of energy infrastructure assets using sensor data and predictive analytics.', category: 'operations' , instances: 4, tasksToday: 440, tasksThisWeek: 2860, uptimePercent: 99.9},
  { id: 'permit', name: 'Permit', subtitle: 'Environmental Permit Tracking', icon: 'FileText', status: 'active', statusLabel: 'Active', accent: 'green', division: 'he', divisionName: 'Herzog Energy', metrics: [{ label: 'Active permits', value: '23' }, { label: 'Renewals due (90 days)', value: '3' }, { label: 'Compliance rate', value: '100%' }, { label: 'Auto-filed', value: '8/month' }], description: 'Tracks environmental permits across energy projects.', category: 'safety' , instances: 2, tasksToday: 32, tasksThisWeek: 208, uptimePercent: 99.8},
  { id: 'maduediligence', name: 'M&ADiligence', subtitle: 'M&A Due Diligence Agent', icon: 'Scale', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'he', divisionName: 'Herzog Energy', metrics: [{ label: 'Active evaluations', value: '3' }, { label: 'Data rooms processed', value: '12,000 docs' }, { label: 'Risk flags identified', value: '14' }, { label: 'Avg analysis time', value: '4.2 days' }], description: 'Accelerates M&A due diligence by analyzing data room documents and financial statements.', category: 'intelligence' , instances: 2, tasksToday: 24, tasksThisWeek: 156, uptimePercent: 99.5},
  { id: 'portfolioperf', name: 'PortfolioPerf', subtitle: 'Portfolio Performance Tracker', icon: 'PieChart', status: 'active', statusLabel: 'Active', accent: 'blue', division: 'he', divisionName: 'Herzog Energy', metrics: [{ label: 'Divisions tracked', value: '7' }, { label: 'KPIs monitored', value: '142' }, { label: 'Variance alerts', value: '4 this week' }, { label: 'ROIC trend', value: '+2.1% YoY' }], description: 'Monitors financial and operational performance across all seven Herzog divisions.', category: 'intelligence' , instances: 3, tasksToday: 84, tasksThisWeek: 546, uptimePercent: 99.7},
  { id: 'boardreport', name: 'BoardReport', subtitle: 'Board Report Compiler', icon: 'Presentation', status: 'running', statusLabel: 'Running (monthly cycle)', accent: 'green', division: 'he', divisionName: 'Herzog Energy', metrics: [{ label: 'Reports compiled', value: '4/quarter' }, { label: 'Data sources', value: '89' }, { label: 'Pages auto-generated', value: '47' }, { label: 'Review time saved', value: '18 hours/report' }], description: 'Automatically compiles board-ready reports by aggregating data from all divisions.', category: 'operations' , instances: 2, tasksToday: 16, tasksThisWeek: 104, uptimePercent: 99.9},

  // GG (5)
  { id: 'remediation', name: 'Remediation', subtitle: 'Cleanup Tracking', icon: 'Leaf', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'gg', divisionName: 'Green Group', metrics: [{ label: 'Active sites', value: '12' }, { label: 'Progress', value: '78% avg' }, { label: 'Completion predictions', value: '3 sites this quarter' }, { label: 'Cost variance', value: '-4%' }], description: 'Tracks environmental remediation progress across active cleanup sites.', category: 'operations' , instances: 3, tasksToday: 72, tasksThisWeek: 468, uptimePercent: 99.6},
  { id: 'monitor', name: 'Monitor', subtitle: 'Environmental Compliance', icon: 'Thermometer', status: 'active', statusLabel: 'Active', accent: 'amber', division: 'gg', divisionName: 'Green Group', metrics: [{ label: 'Sensors monitored', value: '89' }, { label: 'Violations', value: '0 (30 days)' }, { label: 'Reports auto-filed', value: '34' }, { label: 'Regulatory changes tracked', value: '12' }], description: 'Monitors environmental sensors across Green Group sites.', category: 'safety' , instances: 4, tasksToday: 178, tasksThisWeek: 1157, uptimePercent: 99.8},
  { id: 'quarryyield', name: 'QuarryYield', subtitle: 'Quarry Yield Optimizer', icon: 'Mountain', status: 'active', statusLabel: 'Active', accent: 'purple', division: 'gg', divisionName: 'Green Group', metrics: [{ label: 'Quarries monitored', value: '6' }, { label: 'Yield efficiency', value: '87%' }, { label: 'Blast optimization', value: '+14% fragmentation' }, { label: 'Revenue per ton', value: '+$1.20' }], description: 'Optimizes quarry operations by analyzing blast patterns and crusher throughput.', category: 'operations' , instances: 3, tasksToday: 54, tasksThisWeek: 351, uptimePercent: 99.5},
  { id: 'envscanner', name: 'EnvScanner', subtitle: 'Environmental Compliance Scanner', icon: 'ScanSearch', status: 'active', statusLabel: 'Active', accent: 'green', division: 'gg', divisionName: 'Green Group', metrics: [{ label: 'Regulations scanned', value: '340' }, { label: 'Compliance gaps', value: '0' }, { label: 'Upcoming changes', value: '4' }, { label: 'Auto-reports filed', value: '18/month' }], description: 'Continuously scans federal, state, and local environmental regulations for changes.', category: 'safety' , instances: 3, tasksToday: 102, tasksThisWeek: 663, uptimePercent: 99.7},
  { id: 'fleetmaintpredict', name: 'FleetMaintPredict', subtitle: 'Fleet Maintenance Predictor', icon: 'Cog', status: 'running', statusLabel: 'Running (analysis)', accent: 'blue', division: 'gg', divisionName: 'Green Group', metrics: [{ label: 'Vehicles monitored', value: '78' }, { label: 'Failures predicted', value: '4 (next 30 days)' }, { label: 'Downtime reduced', value: '34%' }, { label: 'Parts pre-ordered', value: '12' }], description: "Predicts maintenance needs for Green Group's fleet using telematics and vibration analysis.", category: 'logistics' , instances: 2, tasksToday: 48, tasksThisWeek: 312, uptimePercent: 99.4},
];

/* ── Activity log templates per agent ─────────────────────────────────── */

const activityTemplates: Record<string, { action: string; detail: string }[]> = {
  atlas: [
    { action: 'Query answered', detail: 'Track inspector asked about defect history at MP 247 — synthesized 3 data sources in 1.1s' },
    { action: 'Context retrieved', detail: 'Pulled weather + tonnage data for bridge inspection crew at Osage River crossing' },
    { action: 'Report compiled', detail: 'Generated cost comparison for tie replacement methods — shared with project manager' },
    { action: 'Safety lookup', detail: 'Field supervisor queried FRA reg 213.109 — returned plain-English interpretation + examples' },
    { action: 'Data synthesis', detail: 'Combined maintenance logs and weather data for quarterly track condition report' },
    { action: 'Knowledge base updated', detail: 'Indexed 47 new inspection reports from this week into the knowledge graph' },
    { action: 'Recommendation generated', detail: 'Suggested optimal inspection sequence for Northern corridor based on risk scoring' },
  ],
  dispatch: [
    { action: 'HOS violation prevented', detail: 'Driver Martinez at 14-min remaining — auto-swapped route with Driver Chen' },
    { action: 'Crew reassigned', detail: 'Foreman Rodriguez flagged for mandatory rest — backup crew dispatched to I-70 site' },
    { action: 'FRA report filed', detail: 'Auto-generated FRA Form 6180.97 for HOS compliance — zero violations this month' },
    { action: 'Schedule conflict resolved', detail: 'Detected overlapping crew assignments at Wichita — resolved before shift start' },
    { action: 'Weather adjustment', detail: 'Severe weather alert for KC metro — 14 crews rescheduled to indoor tasks for tomorrow' },
    { action: 'Compliance check', detail: 'All 340 active employees verified HOS compliant — daily report filed' },
    { action: 'Shift planning', detail: 'Tomorrow crew schedule optimized — 23 assignments adjusted for minimum travel time' },
  ],
  scout: [
    { action: 'Defect predicted', detail: 'Track segment 47B showing gauge widening trend — maintenance order #4821 created' },
    { action: 'Inspection flagged', detail: 'MP 312.4 rail wear exceeding threshold — priority inspection scheduled for Thursday' },
    { action: 'Weather correlation', detail: 'Freeze-thaw cycle risk at 3 bridge approaches — pre-emptive inspections recommended' },
    { action: 'Pattern detected', detail: 'Recurring joint bar failures in 8-mile corridor — root cause analysis initiated' },
    { action: 'Tonnage analysis', detail: 'Cumulative tonnage at MP 445 approaching threshold — track panel replacement recommended Q3' },
    { action: 'Report generated', detail: 'Weekly track condition summary: 4,200 miles monitored, 8 defects predicted, 0 missed' },
  ],
  railsentry: [
    { action: 'Flaw detected', detail: 'Internal rail flaw at MP 892.3 — classified as transverse detail fracture, severity: moderate' },
    { action: 'Image processed', detail: 'Batch of 2,400 ultrasonic images analyzed — 3 anomalies flagged for manual review' },
    { action: 'Geometry analysis', detail: 'Geometry car #2 completed 180-mile run — cross-level deviations mapped at 12 locations' },
    { action: 'AI model update', detail: 'Detection model retrained on 14K new labeled images — false positive rate down 0.3%' },
    { action: 'Real-time alert', detail: 'Active geometry car detecting class 4 track alignment issue — operator notified on-site' },
    { action: 'Trend identified', detail: 'Increased defect density on 1990s-era rail in corridor 7 — replacement priority elevated' },
  ],
  sentinel: [
    { action: 'Anomaly detected', detail: 'Signal #1847 voltage fluctuation — maintenance crew dispatched, ETA 45 minutes' },
    { action: 'Health check', detail: '2,400 signal points monitored — 99.97% uptime, 3 anomalies detected this week' },
    { action: 'Failure predicted', detail: 'Relay module at CP-247 showing degradation pattern — replacement scheduled' },
    { action: 'Lightning alert', detail: 'Storm damage assessment: 4 signal locations in path — post-storm inspection queue created' },
    { action: 'Power analysis', detail: 'Battery backup at 3 signal locations below 80% — replacement batteries ordered' },
    { action: 'Communication check', detail: 'Fiber optic link to tower 89 showing latency — backup microwave link activated' },
  ],
  router: [
    { action: 'Delay predicted', detail: 'Line 4 express running 6 min late — crossover at Junction 12 activated' },
    { action: 'Route adjusted', detail: 'Track maintenance on Blue Line — 24 trains rerouted via Gold Line connection' },
    { action: 'On-time improved', detail: 'Schedule micro-adjustments reduced average delay from 4.2 to 2.8 minutes this week' },
    { action: 'Recovery plan', detail: 'Signal failure at Junction 8 — automated recovery plan activated, service restored in 12 min' },
    { action: 'Energy optimized', detail: 'Coasting profile adjustments saved 4.2% traction energy on Blue Line today' },
  ],
  gridwatch: [
    { action: 'Asset alert', detail: 'Transformer #47 oil temperature elevated — maintenance crew notified' },
    { action: 'Failure predicted', detail: 'Inverter string 12 at Cedar Creek solar farm — efficiency drop predicts failure in 3 weeks' },
    { action: 'Health report', detail: '340 energy assets monitored — 2 alerts active, 1 predicted failure, all others nominal' },
    { action: 'Production tracked', detail: 'Solar output today: 4.2 MWh — 8% above forecast due to clear skies' },
    { action: 'Weather impact', detail: 'Hail forecast for wind farm site — turbine feathering protocol activated preemptively' },
  ],
  remediation: [
    { action: 'Progress update', detail: 'Site 7 cleanup at 84% — on track for Q2 completion, soil sampling results nominal' },
    { action: 'Cost tracked', detail: 'Monthly remediation spend: $340K across 12 sites — 4% under budget overall' },
    { action: 'Milestone reached', detail: 'Greenfield site groundwater monitoring complete — contaminant levels below action thresholds' },
    { action: 'Site assessment', detail: 'Phase II environmental assessment complete at Riverside — no additional contamination found' },
    { action: 'Completion forecast', detail: '3 sites projected for closure this quarter — regulatory close-out packages in preparation' },
  ],
};

/** Generate realistic recent activities for an agent */
export function generateActivities(agentId: string, count: number = 8): AgentActivity[] {
  const templates = activityTemplates[agentId];
  const now = Date.now();
  const activities: AgentActivity[] = [];

  for (let i = 0; i < count; i++) {
    const minutesAgo = Math.round(i * 30 + Math.random() * 20);
    const template = templates
      ? templates[i % templates.length]
      : { action: 'Status check', detail: `Routine health check completed — all systems nominal` };

    activities.push({
      timestamp: new Date(now - minutesAgo * 60000).toISOString(),
      action: template.action,
      detail: template.detail,
    });
  }

  return activities;
}

/* ── Division metadata ────────────────────────────────────────────────── */

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
