/**
 * Realistic agent activity events per division.
 * Used by the AgentToast component to show live agent notifications.
 */

export interface AgentToastEvent {
  agentName: string;
  action: string;
  detail: string;
  accent: 'blue' | 'green' | 'amber' | 'purple';
}

/* ── Shared Platform ───────────────────────────────────────────────────── */

const sharedEvents: AgentToastEvent[] = [
  { agentName: 'Atlas', action: 'Query answered', detail: 'Track inspector asked about defect history at MP 247 — synthesized 3 data sources in 1.1s', accent: 'blue' },
  { agentName: 'Atlas', action: 'Context retrieved', detail: 'Pulled weather + tonnage data for bridge inspection crew at Osage River crossing', accent: 'blue' },
  { agentName: 'Chief', action: 'Briefing generated', detail: 'CEO morning briefing ready — flagged 2 budget variances and 1 safety trend across divisions', accent: 'green' },
  { agentName: 'Chief', action: 'Alert escalated', detail: 'Equipment utilization dropped 12% at HCC — added to executive watchlist', accent: 'green' },
  { agentName: 'Ledger', action: 'License reclaimed', detail: 'SAP license reconciliation complete — 12 inactive seats reclaimed, saving $4,800/mo', accent: 'blue' },
  { agentName: 'Ledger', action: 'Duplicate found', detail: 'Detected overlapping Procore and Bluebeam subscriptions in HCC — consolidation recommended', accent: 'blue' },
  { agentName: 'Relay', action: 'Action items extracted', detail: 'Safety standup meeting — 4 action items assigned, 2 follow-ups from last week tracked', accent: 'green' },
  { agentName: 'Relay', action: 'Commitment flagged', detail: 'VP Operations committed to equipment audit by April 4 — deadline added to tracker', accent: 'green' },
  { agentName: 'Signal', action: 'Sentiment alert', detail: 'Negative sentiment spike in #field-ops Slack — 7 mentions of scheduling frustration today', accent: 'green' },
  { agentName: 'Signal', action: 'Escalation detected', detail: 'Customer complaint pattern found — 3 similar issues from Kansas City terminal this week', accent: 'green' },
  { agentName: 'Atlas', action: 'Report compiled', detail: 'Generated cost comparison for tie replacement methods — shared with project manager', accent: 'blue' },
  { agentName: 'Ledger', action: 'Scan complete', detail: 'Weekly software audit finished — 47 platforms checked, $47K/mo waste identified', accent: 'blue' },
  { agentName: 'Relay', action: 'Meeting summarized', detail: 'Division heads weekly — 12 decisions logged, 8 action items, 3 escalations noted', accent: 'green' },
  { agentName: 'Signal', action: 'Pattern detected', detail: 'Unusual email volume from procurement team — possible vendor negotiation activity', accent: 'green' },
  { agentName: 'Chief', action: 'Metric anomaly', detail: 'Revenue per track-mile up 8% vs forecast — auto-generated analysis for CFO review', accent: 'green' },
  { agentName: 'Atlas', action: 'Safety lookup', detail: 'Field supervisor queried FRA reg 213.109 — returned plain-English interpretation + examples', accent: 'blue' },
  { agentName: 'Ledger', action: 'Cost alert', detail: 'Azure compute spend trending 18% over budget — usage optimization recommendations generated', accent: 'blue' },
  { agentName: 'Relay', action: 'Deadline missed', detail: 'Flagged 2 overdue action items from last Tuesday\'s project review — owners notified', accent: 'green' },
  { agentName: 'Signal', action: 'Safety mention', detail: 'Slack message flagged: possible near-miss report in #hrsi-field — routed to safety team', accent: 'green' },
  { agentName: 'Chief', action: 'Weekly digest', detail: 'Cross-division performance summary compiled — 4 KPIs improving, 1 needs attention', accent: 'green' },
];

/* ── HCC — Herzog Contracting ──────────────────────────────────────────── */

const hccEvents: AgentToastEvent[] = [
  { agentName: 'Dispatch', action: 'HOS violation prevented', detail: 'Driver Martinez at 14-min remaining — auto-swapped route with Driver Chen', accent: 'blue' },
  { agentName: 'Dispatch', action: 'Crew reassigned', detail: 'Foreman Rodriguez flagged for mandatory rest — backup crew dispatched to I-70 site', accent: 'blue' },
  { agentName: 'Dispatch', action: 'FRA report filed', detail: 'Auto-generated FRA Form 6180.97 for HOS compliance — zero violations this month', accent: 'blue' },
  { agentName: 'Foreman', action: 'Equipment dispatched', detail: 'CAT 349 excavator rerouted from idle yard to MO-291 bridge project — saves 3hr transit', accent: 'blue' },
  { agentName: 'Foreman', action: 'Crew optimized', detail: '89 crew assignments adjusted today — 42% less equipment idle time vs last quarter', accent: 'blue' },
  { agentName: 'Foreman', action: 'Fuel savings', detail: 'Consolidated 3 delivery routes in Kansas region — estimated $2,400 fuel savings this week', accent: 'blue' },
  { agentName: 'Blueprint', action: 'Bid analyzed', detail: 'I-70 Bridge Rehab estimate reviewed — flagged 8% cost gap vs historical data, adjusted', accent: 'blue' },
  { agentName: 'Blueprint', action: 'Risk identified', detail: 'Material cost escalation risk on BNSF tie replacement bid — recommended 6% contingency', accent: 'blue' },
  { agentName: 'Blueprint', action: 'Estimate complete', detail: 'UP siding extension bid package analyzed — $2.4M estimate within 94% confidence band', accent: 'blue' },
  { agentName: 'Surveyor', action: 'Route optimized', detail: 'Fleet GPS analysis: rerouted 12 trucks via Highway 71 — 18% shorter transit time', accent: 'blue' },
  { agentName: 'Surveyor', action: 'Utilization alert', detail: '3 dump trucks idle >4hrs at Topeka yard — reassignment recommendations sent to dispatch', accent: 'blue' },
  { agentName: 'Dispatch', action: 'Schedule conflict', detail: 'Detected overlapping crew assignments at Wichita — resolved before shift start', accent: 'blue' },
  { agentName: 'Foreman', action: 'Maintenance alert', detail: 'Komatsu PC490 due for 2,000hr service — scheduled for Saturday downtime window', accent: 'blue' },
  { agentName: 'Blueprint', action: 'Comparison ready', detail: 'Subcontractor bids compared for concrete work — top 3 ranked by cost, quality, and timeline', accent: 'blue' },
  { agentName: 'Surveyor', action: 'Geofence alert', detail: 'Truck #247 entered restricted zone near active rail line — operator notified immediately', accent: 'blue' },
  { agentName: 'Dispatch', action: 'Weather adjustment', detail: 'Severe weather alert for KC metro — 14 crews rescheduled to indoor tasks for tomorrow', accent: 'blue' },
  { agentName: 'Foreman', action: 'Shift handoff', detail: 'Night shift equipment status compiled — 2 units need morning inspection before deployment', accent: 'blue' },
  { agentName: 'Blueprint', action: 'Change order', detail: 'Scope change on KDOT project detected — cost impact analysis: +$180K, 2-week extension', accent: 'blue' },
  { agentName: 'Surveyor', action: 'Fleet report', detail: 'Weekly fleet utilization: 82% avg — up from 74% last month, 3 underutilized assets flagged', accent: 'blue' },
  { agentName: 'Dispatch', action: 'Compliance check', detail: 'All 340 active employees verified HOS compliant — daily report filed', accent: 'blue' },
];

/* ── HRSI — Herzog Railroad Services ───────────────────────────────────── */

const hrsiEvents: AgentToastEvent[] = [
  { agentName: 'Scout', action: 'Defect predicted', detail: 'Track segment 47B showing gauge widening trend — maintenance order #4821 created', accent: 'green' },
  { agentName: 'Scout', action: 'Inspection flagged', detail: 'MP 312.4 rail wear exceeding threshold — priority inspection scheduled for Thursday', accent: 'green' },
  { agentName: 'Scout', action: 'Weather correlation', detail: 'Freeze-thaw cycle risk at 3 bridge approaches — pre-emptive inspections recommended', accent: 'green' },
  { agentName: 'Mechanic', action: 'Failure predicted', detail: 'Tamper unit #7 hydraulic pressure trending down — parts ordered, repair scheduled Week 15', accent: 'green' },
  { agentName: 'Mechanic', action: 'PM scheduled', detail: 'Ballast regulator #12 approaching 1,500hr service interval — slot reserved at Joplin shop', accent: 'green' },
  { agentName: 'Mechanic', action: 'Cost avoided', detail: 'Caught bearing degradation on spike driver early — avoided $34K emergency repair', accent: 'green' },
  { agentName: 'Stockroom', action: 'Reorder triggered', detail: 'Rail anchor inventory at Tulsa warehouse below threshold — PO #8847 auto-generated', accent: 'green' },
  { agentName: 'Stockroom', action: 'Stockout prevented', detail: 'Tie plate demand spike predicted for April — 2,400 units ordered from secondary supplier', accent: 'green' },
  { agentName: 'Stockroom', action: 'Carrying cost reduced', detail: 'Identified 340 slow-moving SKUs at Springfield — transfer recommendations to 3 active sites', accent: 'green' },
  { agentName: 'Ballast', action: 'Delivery optimized', detail: 'Consolidated 3 ballast deliveries to UP mainline project — saved 2 truck-days this week', accent: 'green' },
  { agentName: 'Ballast', action: 'Route adjusted', detail: 'Bridge weight restriction on Route 60 — rerouted 4 material trucks via Highway 44', accent: 'green' },
  { agentName: 'Scout', action: 'Pattern detected', detail: 'Recurring joint bar failures in 8-mile corridor — root cause analysis initiated', accent: 'green' },
  { agentName: 'Mechanic', action: 'Sensor alert', detail: 'Vibration anomaly on rail grinder #3 — diagnostic data sent to maintenance team', accent: 'green' },
  { agentName: 'Stockroom', action: 'Surplus identified', detail: '1,200 excess switch ties at Memphis yard — listed for inter-division transfer', accent: 'green' },
  { agentName: 'Ballast', action: 'Material tracked', detail: '96% on-time delivery rate this week — 34 shipments completed across 8 projects', accent: 'green' },
  { agentName: 'Scout', action: 'Tonnage analysis', detail: 'Cumulative tonnage at MP 445 approaching threshold — track panel replacement recommended Q3', accent: 'green' },
  { agentName: 'Mechanic', action: 'Warranty claim', detail: 'Component failure within warranty period identified — auto-generated claim for $12K refund', accent: 'green' },
  { agentName: 'Stockroom', action: 'Demand forecast', detail: 'Spring maintenance season demand model updated — 14% higher clip usage projected vs last year', accent: 'green' },
  { agentName: 'Ballast', action: 'Inventory synced', detail: 'Quarry inventory reconciled — 4,200 tons available at Carthage, matches delivery schedule', accent: 'green' },
  { agentName: 'Scout', action: 'Report generated', detail: 'Weekly track condition summary: 4,200 miles monitored, 8 defects predicted, 0 missed', accent: 'green' },
];

/* ── HSI — Herzog Services / Rail Testing ──────────────────────────────── */

const hsiEvents: AgentToastEvent[] = [
  { agentName: 'RailSentry', action: 'Flaw detected', detail: 'Internal rail flaw at MP 892.3 — defect classified as transverse detail fracture, severity: moderate', accent: 'amber' },
  { agentName: 'RailSentry', action: 'Image processed', detail: 'Batch of 2,400 ultrasonic images analyzed — 3 anomalies flagged for manual review', accent: 'amber' },
  { agentName: 'RailSentry', action: 'Accuracy milestone', detail: 'Detection accuracy at 94.2% over trailing 30 days — exceeds 92% SLA target', accent: 'amber' },
  { agentName: 'Inspector', action: 'Schedule optimized', detail: 'Next week\'s testing schedule finalized — 47 tests across 6 rail corridors, 31% more efficient', accent: 'amber' },
  { agentName: 'Inspector', action: 'Crew assigned', detail: 'Testing team Alpha assigned to BNSF Transcon corridor — 3-day testing window confirmed', accent: 'amber' },
  { agentName: 'Inspector', action: 'Coverage update', detail: 'Network testing coverage at 98.4% — 6 deferred segments rescheduled for early April', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Cal due alert', detail: '4 ultrasonic instruments approaching calibration deadline — appointments scheduled at NIST lab', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Compliance verified', detail: 'All 89 testing instruments verified within calibration — 99.6% compliance rate maintained', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Standard updated', detail: 'New FRA measurement standard effective April 1 — calibration procedures updated automatically', accent: 'amber' },
  { agentName: 'RailSentry', action: 'Geometry analysis', detail: 'Geometry car #2 completed 180-mile run — cross-level deviations mapped at 12 locations', accent: 'amber' },
  { agentName: 'Inspector', action: 'Priority change', detail: 'UP requested expedited testing at Sherman Hill — schedule adjusted, team Bravo en route', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Cost savings', detail: 'Consolidated calibration appointments for Q2 — $14K savings vs individual scheduling', accent: 'amber' },
  { agentName: 'RailSentry', action: 'Trend identified', detail: 'Increased defect density on 1990s-era rail in corridor 7 — replacement priority elevated', accent: 'amber' },
  { agentName: 'Inspector', action: 'Weather hold', detail: 'Testing paused on KCS subdivision due to flooding — 4 tests rescheduled to next window', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Audit ready', detail: 'FRA audit preparation complete — all calibration records, certificates, and logs compiled', accent: 'amber' },
  { agentName: 'RailSentry', action: 'AI model update', detail: 'Detection model retrained on 14K new labeled images — false positive rate down 0.3%', accent: 'amber' },
  { agentName: 'Inspector', action: 'Report filed', detail: 'Monthly testing summary: 180 tests completed, 98.4% coverage, 23 defects found', accent: 'amber' },
  { agentName: 'Calibrator', action: 'Instrument tracked', detail: 'New ultrasonic probe registered — serial #UT-2847, calibration baseline established', accent: 'amber' },
  { agentName: 'RailSentry', action: 'Real-time alert', detail: 'Active geometry car detecting class 4 track alignment issue — operator notified on-site', accent: 'amber' },
  { agentName: 'Inspector', action: 'Backlog cleared', detail: 'Testing backlog reduced to 6 segments — lowest level this quarter', accent: 'amber' },
];

/* ── HTI — Herzog Technologies ─────────────────────────────────────────── */

const htiEvents: AgentToastEvent[] = [
  { agentName: 'Sentinel', action: 'Anomaly detected', detail: 'Signal #1847 voltage fluctuation — maintenance crew dispatched, ETA 45 minutes', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Health check', detail: '2,400 signal points monitored — 99.97% uptime, 3 anomalies detected this week', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Failure predicted', detail: 'Relay module at CP-247 showing degradation pattern — replacement scheduled before failure', accent: 'purple' },
  { agentName: 'Integrator', action: 'Milestone reached', detail: 'PTC installation on NS Corridor 4 — phase 2 wayside equipment 73% complete', accent: 'purple' },
  { agentName: 'Integrator', action: 'Schedule updated', detail: 'BNSF PTC project ahead by 2 days — resource reallocation optimized across 3 crews', accent: 'purple' },
  { agentName: 'Integrator', action: 'Budget tracked', detail: 'Monthly PTC spend: $1.2M — 1.2% over plan, driven by expedited component delivery', accent: 'purple' },
  { agentName: 'Compliance', action: 'Report auto-filed', detail: 'FRA Form 6180 auto-populated — Incident #2847, awaiting supervisor review', accent: 'purple' },
  { agentName: 'Compliance', action: 'Regulation update', detail: 'New FRA signal regulation 236.108 effective next month — impact analysis generated', accent: 'purple' },
  { agentName: 'Compliance', action: 'Audit prepared', detail: 'FRA signal compliance audit package compiled — 47 regulations, 99.8% compliant', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Lightning alert', detail: 'Storm damage assessment: 4 signal locations in path — post-storm inspection queue created', accent: 'purple' },
  { agentName: 'Integrator', action: 'Testing complete', detail: 'PTC back-office integration test passed — 100% message delivery rate over 72hr trial', accent: 'purple' },
  { agentName: 'Compliance', action: 'Waiver tracked', detail: 'FRA waiver for CP-312 signal modification expiring May 15 — renewal initiated', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Power analysis', detail: 'Battery backup at 3 signal locations below 80% — replacement batteries ordered', accent: 'purple' },
  { agentName: 'Integrator', action: 'Conflict resolved', detail: 'Track outage window conflict between PTC install and maintenance — rescheduled to April 8', accent: 'purple' },
  { agentName: 'Compliance', action: 'Training alert', detail: '4 signal technicians due for FRA certification renewal — auto-enrolled in May session', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Communication check', detail: 'Fiber optic link to tower 89 showing latency — backup microwave link activated', accent: 'purple' },
  { agentName: 'Integrator', action: 'Inventory synced', detail: 'PTC component inventory updated — 89 wayside units in stock, 12 on order', accent: 'purple' },
  { agentName: 'Compliance', action: 'Inspection logged', detail: 'Monthly signal inspection results: 340 points checked, 2 minor findings corrected', accent: 'purple' },
  { agentName: 'Sentinel', action: 'Pattern found', detail: 'Intermittent signal failures correlating with temperature swings at 3 grade crossings', accent: 'purple' },
  { agentName: 'Integrator', action: 'Handoff complete', detail: 'CSX PTC segment officially transferred to railroad operations — documentation archived', accent: 'purple' },
];

/* ── HTSI — Herzog Transit Services ────────────────────────────────────── */

const htsiEvents: AgentToastEvent[] = [
  { agentName: 'Router', action: 'Delay predicted', detail: 'Line 4 express running 6 min late — crossover at Junction 12 activated to maintain schedule', accent: 'blue' },
  { agentName: 'Router', action: 'Route adjusted', detail: 'Track maintenance on Blue Line — 24 trains rerouted via Gold Line connection, +3 min avg', accent: 'blue' },
  { agentName: 'Router', action: 'On-time improved', detail: 'Schedule micro-adjustments reduced average delay from 4.2 to 2.8 minutes this week', accent: 'blue' },
  { agentName: 'Conductor', action: 'Roster optimized', detail: 'Next week crew assignments: 480 staff rostered — overtime reduced 22% vs manual scheduling', accent: 'blue' },
  { agentName: 'Conductor', action: 'Gap filled', detail: 'Qualification gap detected: 3 operators need ATC certification — training sessions scheduled', accent: 'blue' },
  { agentName: 'Conductor', action: 'Union compliance', detail: 'All shift assignments verified against union rules — 100% compliant, 0 grievance triggers', accent: 'blue' },
  { agentName: 'Passenger', action: 'Demand forecast', detail: 'Friday evening ridership spike predicted: +34% on Red Line — 2 additional trains staged', accent: 'blue' },
  { agentName: 'Passenger', action: 'Revenue insight', detail: 'Dynamic pricing analysis: off-peak discount increased ridership 12% with flat revenue', accent: 'blue' },
  { agentName: 'Passenger', action: 'Capacity alert', detail: 'Stadium event Saturday — projected 8,400 additional riders, extra service plan generated', accent: 'blue' },
  { agentName: 'Safety', action: 'Near-miss detected', detail: 'Near-miss pattern detected — Yard 7 switch alignment, 3 incidents in 14 days', accent: 'blue' },
  { agentName: 'Safety', action: 'Incident tracked', detail: 'Platform door sensor malfunction at Station 12 — maintenance dispatched, temp barrier deployed', accent: 'blue' },
  { agentName: 'Safety', action: 'Trend improving', detail: 'Safety incident rate down 18% quarter-over-quarter — 0 incidents current shift', accent: 'blue' },
  { agentName: 'Router', action: 'Recovery plan', detail: 'Signal failure at Junction 8 — automated recovery plan activated, service restored in 12 min', accent: 'blue' },
  { agentName: 'Conductor', action: 'Sick call covered', detail: 'Operator sick call at 4:30 AM — qualified replacement identified and confirmed in 8 minutes', accent: 'blue' },
  { agentName: 'Passenger', action: 'Survey analyzed', detail: 'Monthly rider satisfaction: 87% — key complaint: Green Line frequency, increase recommended', accent: 'blue' },
  { agentName: 'Safety', action: 'Drill scheduled', detail: 'Emergency evacuation drill for Station 4 scheduled April 2 — all agencies coordinated', accent: 'blue' },
  { agentName: 'Router', action: 'Energy optimized', detail: 'Coasting profile adjustments saved 4.2% traction energy on Blue Line today', accent: 'blue' },
  { agentName: 'Conductor', action: 'Training tracked', detail: '12 new operators completed simulator training — certification exams scheduled next week', accent: 'blue' },
  { agentName: 'Passenger', action: 'Pattern found', detail: 'Weekend ridership shifting earlier — peak now 10 AM vs 11 AM, schedule adjustment proposed', accent: 'blue' },
  { agentName: 'Safety', action: 'Camera alert', detail: 'Platform occupancy at Station 7 above threshold — crowd management announcement triggered', accent: 'blue' },
];

/* ── HE — Herzog Energy ────────────────────────────────────────────────── */

const heEvents: AgentToastEvent[] = [
  { agentName: 'GridWatch', action: 'Asset alert', detail: 'Transformer #47 oil temperature elevated — maintenance crew notified, trending for 4.8 weeks', accent: 'green' },
  { agentName: 'GridWatch', action: 'Failure predicted', detail: 'Inverter string 12 at Cedar Creek solar farm — efficiency drop predicts failure in 3 weeks', accent: 'green' },
  { agentName: 'GridWatch', action: 'Health report', detail: '340 energy assets monitored — 2 alerts active, 1 predicted failure, all others nominal', accent: 'green' },
  { agentName: 'Permit', action: 'Renewal filed', detail: 'EPA stormwater permit for Lakeview solar — renewal auto-filed 60 days ahead of deadline', accent: 'green' },
  { agentName: 'Permit', action: 'Compliance verified', detail: 'All 23 active environmental permits verified compliant — next audit-ready report generated', accent: 'green' },
  { agentName: 'Permit', action: 'Deadline alert', detail: '3 permit renewals due within 90 days — auto-renewal packages prepared and queued', accent: 'green' },
  { agentName: 'GridWatch', action: 'Production tracked', detail: 'Solar output today: 4.2 MWh — 8% above forecast due to clear skies, revenue +$1,200', accent: 'green' },
  { agentName: 'Permit', action: 'Regulation change', detail: 'State environmental reporting requirement updated — permit templates auto-adjusted', accent: 'green' },
  { agentName: 'GridWatch', action: 'Weather impact', detail: 'Hail forecast for wind farm site — turbine feathering protocol activated preemptively', accent: 'green' },
  { agentName: 'Permit', action: 'Inspection prep', detail: 'County environmental inspection next week — all documentation compiled and staged', accent: 'green' },
  { agentName: 'GridWatch', action: 'Efficiency alert', detail: 'Panel soiling reducing output 6% at Meadow Creek — cleaning crew scheduled for Thursday', accent: 'green' },
  { agentName: 'Permit', action: 'Variance report', detail: 'Quarterly emissions variance report generated — all sites within permitted limits', accent: 'green' },
  { agentName: 'GridWatch', action: 'Grid sync', detail: 'Frequency regulation response time improved to 0.4s — exceeds grid operator requirements', accent: 'green' },
  { agentName: 'Permit', action: 'New site permit', detail: 'Draft permit application for Ridgeview wind expansion — 80% auto-populated from templates', accent: 'green' },
  { agentName: 'GridWatch', action: 'Battery status', detail: 'Energy storage system at 78% health — degradation within expected curve, no action needed', accent: 'green' },
  { agentName: 'Permit', action: 'Stakeholder notify', detail: 'Public comment period opening for Springfield project — automated notices sent to 47 contacts', accent: 'green' },
  { agentName: 'GridWatch', action: 'Curtailment avoided', detail: 'Predicted grid congestion — proactive output ramp prevented curtailment, saved $3,400', accent: 'green' },
  { agentName: 'Permit', action: 'Document archived', detail: 'Annual compliance documentation archived — 34 reports, 12 permits, all cross-referenced', accent: 'green' },
  { agentName: 'GridWatch', action: 'Vegetation alert', detail: 'Drone survey detected vegetation encroachment at transmission corridor — work order created', accent: 'green' },
  { agentName: 'Permit', action: 'Fee tracked', detail: 'Permit fee schedule updated — $2,400 in annual fees auto-scheduled for payment', accent: 'green' },
];

/* ── GG — Green Group ──────────────────────────────────────────────────── */

const ggEvents: AgentToastEvent[] = [
  { agentName: 'Remediation', action: 'Progress update', detail: 'Site 7 cleanup at 84% — on track for Q2 completion, soil sampling results nominal', accent: 'amber' },
  { agentName: 'Remediation', action: 'Cost tracked', detail: 'Monthly remediation spend: $340K across 12 sites — 4% under budget overall', accent: 'amber' },
  { agentName: 'Remediation', action: 'Milestone reached', detail: 'Greenfield site groundwater monitoring complete — contaminant levels below action thresholds', accent: 'amber' },
  { agentName: 'Monitor', action: 'Sensor reading', detail: 'All 89 environmental sensors within normal range — zero violations in trailing 30 days', accent: 'amber' },
  { agentName: 'Monitor', action: 'Report auto-filed', detail: 'Monthly EPA discharge report generated and filed — all parameters within permitted limits', accent: 'amber' },
  { agentName: 'Monitor', action: 'Regulation tracked', detail: '12 regulatory changes tracked this quarter — 3 require procedure updates, drafts generated', accent: 'amber' },
  { agentName: 'Remediation', action: 'Site assessment', detail: 'Phase II environmental assessment complete at Riverside — no additional contamination found', accent: 'amber' },
  { agentName: 'Monitor', action: 'Calibration check', detail: 'Sensor array at Site 3 approaching calibration — technician scheduled for Thursday', accent: 'amber' },
  { agentName: 'Remediation', action: 'Completion forecast', detail: '3 sites projected for closure this quarter — regulatory close-out packages in preparation', accent: 'amber' },
  { agentName: 'Monitor', action: 'Weather alert', detail: 'Heavy rain forecast — erosion control measures verified at 4 active remediation sites', accent: 'amber' },
  { agentName: 'Remediation', action: 'Waste manifest', detail: 'Hazardous waste shipment tracked — Manifest #MO-2847 delivered to licensed facility', accent: 'amber' },
  { agentName: 'Monitor', action: 'Trend analysis', detail: 'Groundwater contaminant trending down 12% at Oakwood site — natural attenuation on track', accent: 'amber' },
  { agentName: 'Remediation', action: 'Subcontractor QA', detail: 'Lab results validated — 340 soil samples, 98.7% within QA/QC acceptance criteria', accent: 'amber' },
  { agentName: 'Monitor', action: 'Community report', detail: 'Quarterly community air quality report compiled — all readings below health thresholds', accent: 'amber' },
  { agentName: 'Remediation', action: 'Budget forecast', detail: 'Q2 remediation budget forecast: $1.1M — aligned with project timelines, no overruns expected', accent: 'amber' },
  { agentName: 'Monitor', action: 'Exceedance check', detail: 'Real-time pH monitoring at Site 9 — brief exceedance logged, returned to normal in 4 min', accent: 'amber' },
  { agentName: 'Remediation', action: 'Permit compliance', detail: 'All active remediation sites verified compliant with state cleanup standards', accent: 'amber' },
  { agentName: 'Monitor', action: 'Data validated', detail: 'Automated QA on 2,400 sensor readings — 3 outliers flagged and investigated, all valid', accent: 'amber' },
  { agentName: 'Remediation', action: 'Stakeholder update', detail: 'Monthly progress reports sent to 8 regulatory agencies and 4 property owners', accent: 'amber' },
  { agentName: 'Monitor', action: 'Equipment health', detail: 'Treatment system pump #4 vibration elevated — maintenance scheduled before degradation', accent: 'amber' },
];

/* ── Event pools by division ───────────────────────────────────────────── */

export const agentEventsByDivision: Record<string, AgentToastEvent[]> = {
  meridian: [...sharedEvents, ...hccEvents.slice(0, 5), ...hrsiEvents.slice(0, 5), ...htiEvents.slice(0, 5)],
  shared: sharedEvents,
  hcc: [...hccEvents, ...sharedEvents.slice(0, 5)],
  hrsi: [...hrsiEvents, ...sharedEvents.slice(0, 5)],
  hsi: [...hsiEvents, ...sharedEvents.slice(0, 5)],
  hti: [...htiEvents, ...sharedEvents.slice(0, 5)],
  htsi: [...htsiEvents, ...sharedEvents.slice(0, 5)],
  he: [...heEvents, ...sharedEvents.slice(0, 5)],
  gg: [...ggEvents, ...sharedEvents.slice(0, 5)],
};
