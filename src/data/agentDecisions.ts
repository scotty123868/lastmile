export type DecisionStatus = 'success' | 'warning' | 'info';

export interface DecisionOption {
  label: string;
  pros: string;
  cons: string;
}

export interface DecisionChain {
  dataInputs: string[];
  optionsEvaluated: DecisionOption[];
  reasoning: string;
  confidence: number;
}

export interface AgentAction {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  action: string;
  outcome: string;
  status: DecisionStatus;
  savingsLabel: string;
  manualTime: string;
  automatedTime: string;
  division: string;
  chain: DecisionChain;
}

export const agentDecisions: AgentAction[] = [
  // ── Dispatch Agent (HCC) ─────────────────────────────────
  {
    id: 'ad-001',
    agentId: 'dispatch',
    agentName: 'Dispatch',
    timestamp: '2026-03-28T07:12:00Z',
    action: 'Rerouted Driver Martinez to Route 7B',
    outcome: 'Saved 14 min HOS buffer, prevented violation',
    status: 'success',
    savingsLabel: '14 min HOS buffer saved',
    manualTime: '45 min (dispatcher review)',
    automatedTime: '8 seconds',
    division: 'hcc',
    chain: {
      dataInputs: [
        'Driver Martinez HOS log: 10h 46m on-duty (14m from 12h FRA limit)',
        'Weather API: freezing rain advisory on Route 4A, +25 min estimated delay',
        'Route 7B availability: open, 18 min shorter, no weather alerts',
        'Driver preference profile: Route 7B familiar (driven 23x this quarter)',
      ],
      optionsEvaluated: [
        { label: 'Keep Route 4A with delay buffer', pros: 'No schedule change needed', cons: 'Weather delay risks HOS violation; 72% chance of exceeding 12h limit' },
        { label: 'Reroute to Route 7B', pros: '18 min shorter, no weather risk, driver is familiar', cons: 'Slight fuel cost increase ($4.20)' },
        { label: 'Pull driver off-duty, assign replacement', pros: 'Zero HOS risk', cons: '2h delay while replacement mobilizes; $340 cost' },
      ],
      reasoning: 'Route 7B eliminates weather delay risk while keeping Driver Martinez within FRA Part 228 limits with a comfortable 14-minute buffer.',
      confidence: 94,
    },
  },
  {
    id: 'ad-002',
    agentId: 'dispatch',
    agentName: 'Dispatch',
    timestamp: '2026-03-28T06:45:00Z',
    action: 'Blocked Crew Assignment: Thompson to overnight shift',
    outcome: 'Prevented FRA 10-hour rest period violation',
    status: 'warning',
    savingsLabel: '$125K potential FRA fine avoided',
    manualTime: '4 hours (manual compliance check)',
    automatedTime: '0.3 seconds',
    division: 'hcc',
    chain: {
      dataInputs: [
        'Thompson off-duty log: ended shift at 22:30 yesterday',
        'Proposed assignment start: 06:00 today (7.5h rest, below 10h FRA minimum)',
        'FRA Part 228.405: minimum 10 consecutive hours off-duty required',
        'Crew availability roster: 3 qualified replacements available',
      ],
      optionsEvaluated: [
        { label: 'Allow assignment (override)', pros: 'Maintains original schedule', cons: 'Direct FRA violation, $125K+ fine exposure' },
        { label: 'Delay Thompson start to 08:30', pros: 'Thompson can still work today', cons: '2.5h schedule gap; downstream delays' },
        { label: 'Assign Rodriguez (qualified, rested)', pros: 'No compliance risk, immediate availability', cons: 'Rodriguez overtime cost (+$85)' },
      ],
      reasoning: 'Assignment would violate FRA 10-hour rest requirement by 2.5 hours. Rodriguez is fully rested and qualified. Escalated to crew manager with recommendation.',
      confidence: 99,
    },
  },
  {
    id: 'ad-003',
    agentId: 'dispatch',
    agentName: 'Dispatch',
    timestamp: '2026-03-28T05:30:00Z',
    action: 'Optimized crew rotation for Midwest Division weekend',
    outcome: 'Balanced HOS across 12 crew members, +6% utilization',
    status: 'success',
    savingsLabel: '6% crew utilization improvement',
    manualTime: '6 hours (manual scheduling)',
    automatedTime: '45 seconds',
    division: 'hcc',
    chain: {
      dataInputs: [
        '12 crew members with varying HOS balances (range: 180h-248h of 276h monthly cap)',
        'Weekend project requirements: 3 active job sites, 8 required positions',
        'Union agreement UTU Section 4.2: rest period and consecutive day provisions',
        'Weather forecast: clear conditions Saturday, rain Sunday afternoon',
      ],
      optionsEvaluated: [
        { label: 'Standard rotation (alphabetical)', pros: 'Simple, predictable', cons: '3 crew members would hit monthly cap mid-shift' },
        { label: 'HOS-balanced rotation', pros: 'All crew stay under 260h, no mid-shift pullouts', cons: 'Requires 2 crew swaps vs standard schedule' },
      ],
      reasoning: 'HOS-balanced rotation prevents 3 potential mid-shift violations while improving overall utilization from 71% to 77%.',
      confidence: 91,
    },
  },

  // ── Ledger Agent (Shared) ────────────────────────────────
  {
    id: 'ad-004',
    agentId: 'ledger',
    agentName: 'Ledger',
    timestamp: '2026-03-28T04:00:00Z',
    action: 'Reclaimed 12 SAP seats across IC Technologies',
    outcome: '$4,200/month saved, IT admin notified',
    status: 'success',
    savingsLabel: '$4,200/month recurring',
    manualTime: '2 days (manual audit)',
    automatedTime: '3 minutes',
    division: 'hti',
    chain: {
      dataInputs: [
        'SAP login audit: 12 accounts with zero logins in 90+ days',
        'HR system cross-reference: 4 accounts belong to terminated employees',
        'Cost per SAP seat: $350/month ($4,200/month total for 12 seats)',
        'IT admin contact: Sarah Chen (HTI IT Manager)',
      ],
      optionsEvaluated: [
        { label: 'Immediate deactivation', pros: 'Instant savings', cons: 'Risk of deactivating accounts still needed (low confidence on 2 accounts)' },
        { label: 'Notify IT admin with recommendation', pros: 'Human review of edge cases, maintains trust', cons: '24-48h delay before action' },
        { label: 'Flag for next quarterly review', pros: 'Zero disruption risk', cons: '3 months of unnecessary spend ($12,600)' },
      ],
      reasoning: 'Sent deactivation recommendation to IT admin with full audit trail. 10 of 12 are clear-cut (terminated or transferred); 2 flagged for manual review.',
      confidence: 96,
    },
  },
  {
    id: 'ad-005',
    agentId: 'ledger',
    agentName: 'Ledger',
    timestamp: '2026-03-27T22:00:00Z',
    action: 'Detected duplicate Primavera P6 licenses across HCC and HRSI',
    outcome: 'Consolidation opportunity: $8,400/year',
    status: 'info',
    savingsLabel: '$8,400/year consolidation',
    manualTime: '1 week (cross-division audit)',
    automatedTime: '7 minutes',
    division: 'shared',
    chain: {
      dataInputs: [
        'HCC: 15 Primavera P6 licenses, 9 active users',
        'HRSI: 8 Primavera P6 licenses, 4 active users',
        'Enterprise agreement allows shared licensing across divisions',
        'Per-seat cost: $700/year; 10 unused seats across both divisions',
      ],
      optionsEvaluated: [
        { label: 'Consolidate to single enterprise pool', pros: 'Save $8,400/year, simplify management', cons: 'Requires IT coordination across 2 divisions' },
        { label: 'Reduce each division independently', pros: 'No cross-division coordination needed', cons: 'Misses consolidation discount; saves only $5,600/year' },
      ],
      reasoning: 'Enterprise pooling saves 50% more than independent reduction. Flagged to IT leadership with ROI analysis and implementation checklist.',
      confidence: 92,
    },
  },

  // ── Scout Agent (HSI) ────────────────────────────────────
  {
    id: 'ad-006',
    agentId: 'scout',
    agentName: 'Scout',
    timestamp: '2026-03-28T06:20:00Z',
    action: 'Created maintenance order #4821 for Track segment 47B',
    outcome: 'Defect addressed before FRA threshold breach',
    status: 'warning',
    savingsLabel: 'Prevented Class 4 speed restriction',
    manualTime: '3 days (inspection cycle)',
    automatedTime: '12 seconds',
    division: 'hsi',
    chain: {
      dataInputs: [
        'TAM-4 ultrasonic reading: 0.8mm surface deviation at MP 247.1',
        'FRA Class 4 threshold: 1.0mm (current reading at 80% of limit)',
        'Defect history: 3 prior readings showing accelerating degradation (0.3mm, 0.5mm, 0.8mm)',
        'Weather forecast: freeze-thaw cycle expected next 72 hours (accelerates degradation)',
      ],
      optionsEvaluated: [
        { label: 'Schedule routine maintenance (next cycle)', pros: 'No schedule disruption', cons: 'Freeze-thaw may push past FRA limit; speed restriction risk' },
        { label: 'Create priority maintenance order', pros: 'Address before threshold breach; 48h window', cons: 'Requires pulling crew from planned work' },
        { label: 'Impose immediate slow order', pros: 'Zero risk of violation', cons: 'Disrupts 14 scheduled trains; $18K/day revenue impact' },
      ],
      reasoning: 'Degradation trend combined with freeze-thaw forecast gives 72h window before likely FRA threshold breach. Priority maintenance order preserves normal operations while addressing the defect proactively.',
      confidence: 88,
    },
  },
  {
    id: 'ad-007',
    agentId: 'scout',
    agentName: 'Scout',
    timestamp: '2026-03-27T14:30:00Z',
    action: 'Cleared Track segment NE-22 after video chart review',
    outcome: 'Confirmed no defects, maintained Class 5 speed rating',
    status: 'success',
    savingsLabel: 'Avoided unnecessary slow order',
    manualTime: '4 hours (manual video review)',
    automatedTime: '90 seconds',
    division: 'hsi',
    chain: {
      dataInputs: [
        'Video track chart: 2.4GB scan of NE-22 segment (4.2 miles)',
        'AI vision analysis: no surface defects, gauge within tolerance',
        'Cross-reference: LIDAR rail profile confirms video findings',
        'Last inspection: 28 days ago (approaching 30-day FRA requirement)',
      ],
      optionsEvaluated: [
        { label: 'Mark as inspected, maintain Class 5', pros: 'No disruption, all data consistent', cons: 'Relies on AI vision accuracy (99.2% validated)' },
        { label: 'Flag for manual reinspection', pros: 'Human verification', cons: '4-hour delay; inspector pulled from higher-priority work' },
      ],
      reasoning: 'All three data sources (video, ultrasonic, LIDAR) agree: segment is within FRA tolerances. Logged inspection to satisfy 30-day requirement.',
      confidence: 97,
    },
  },

  // ── Safety Agent (HTSI) ──────────────────────────────────
  {
    id: 'ad-008',
    agentId: 'guardian',
    agentName: 'Guardian',
    timestamp: '2026-03-28T03:15:00Z',
    action: 'Escalated near-miss at Yard 7 to Safety Director',
    outcome: 'Pattern identified: 3rd incident in 30 days at same location',
    status: 'warning',
    savingsLabel: 'Potential injury prevention',
    manualTime: '2 weeks (pattern recognition)',
    automatedTime: '4 seconds',
    division: 'htsi',
    chain: {
      dataInputs: [
        'Incident report: near-miss between maintenance vehicle and commuter train at Yard 7 Switch 12',
        'Historical analysis: 2 prior near-misses at same location (Feb 28, Mar 14)',
        'Severity assessment: no injuries, but pattern suggests systemic sight-line issue',
        'FRA Part 225 reporting requirement: pattern triggers mandatory review',
      ],
      optionsEvaluated: [
        { label: 'Log incident, standard follow-up', pros: 'Minimal disruption', cons: 'Pattern continues; potential for serious incident' },
        { label: 'Escalate to Safety Director with pattern analysis', pros: 'Enables systemic fix (sight-line improvement)', cons: 'Requires immediate safety stand-down at Switch 12' },
        { label: 'Impose temporary operational restriction', pros: 'Immediate risk reduction', cons: 'Disrupts 8 daily movements; $6K/day cost' },
      ],
      reasoning: 'Three incidents at the same location in 30 days constitutes a pattern under FRA guidelines. Escalation triggers mandatory review and enables permanent corrective action.',
      confidence: 95,
    },
  },
  {
    id: 'ad-009',
    agentId: 'guardian',
    agentName: 'Guardian',
    timestamp: '2026-03-27T18:45:00Z',
    action: 'Flagged PPE non-compliance on Camera Feed #14',
    outcome: 'Crew supervisor notified, corrected within 8 minutes',
    status: 'warning',
    savingsLabel: 'OSHA citation avoided ($15,625)',
    manualTime: '1-2 hours (supervisor walk-through)',
    automatedTime: '2 seconds',
    division: 'htsi',
    chain: {
      dataInputs: [
        'Camera Feed #14: 2 workers without hard hats in active construction zone',
        'OSHA 1926.100: hard hat required in areas with falling object hazard',
        'Worker identification: matched to Crew 7B roster',
        'Supervisor contact: Mike Torres (on-site, radio available)',
      ],
      optionsEvaluated: [
        { label: 'Alert supervisor via radio', pros: 'Immediate correction, minimal disruption', cons: 'No formal documentation' },
        { label: 'Alert supervisor + log formal safety observation', pros: 'Correction plus documentation for safety metrics', cons: 'Slightly more process overhead' },
      ],
      reasoning: 'Immediate radio alert ensures fastest correction. Formal safety observation logged for trend tracking and OSHA compliance documentation.',
      confidence: 98,
    },
  },

  // ── Compliance Agent (Shared/HSI) ────────────────────────
  {
    id: 'ad-010',
    agentId: 'compliance-monitor',
    agentName: 'Compliance Monitor',
    timestamp: '2026-03-28T02:00:00Z',
    action: 'Auto-filed FRA Form 6180 for Incident #2847',
    outcome: 'Filed 22 hours before deadline, zero manual effort',
    status: 'success',
    savingsLabel: 'Filing deadline met automatically',
    manualTime: '3 hours (manual form completion)',
    automatedTime: '45 seconds',
    division: 'hsi',
    chain: {
      dataInputs: [
        'Incident #2847: rail defect discovered at MP 312.4 during routine inspection',
        'FRA Form 6180.54 field mapping: 47 fields auto-populated from incident data',
        'Regulatory cross-reference: FRA Part 225.11 requires filing within 30 days',
        'Quality check: all required fields populated, 3 optional fields flagged for human review',
      ],
      optionsEvaluated: [
        { label: 'Auto-file with human review of flagged fields', pros: 'Meets deadline, human validates edge cases', cons: 'Small delay for review (est. 15 min)' },
        { label: 'Queue for full manual review', pros: 'Maximum accuracy', cons: 'Risk of missing deadline if reviewer is unavailable' },
      ],
      reasoning: 'Auto-populated 47 of 50 fields with high confidence. 3 optional fields flagged for compliance officer review before final submission. Filing sent to review queue 22 hours before deadline.',
      confidence: 93,
    },
  },
  {
    id: 'ad-011',
    agentId: 'compliance-monitor',
    agentName: 'Compliance Monitor',
    timestamp: '2026-03-27T16:00:00Z',
    action: 'Detected expiring certification: Signal Maintainer Class A',
    outcome: 'HR notified 6 days before expiration, training scheduled',
    status: 'info',
    savingsLabel: 'Compliance gap prevented',
    manualTime: '1 day (HR manual check)',
    automatedTime: '5 seconds',
    division: 'hti',
    chain: {
      dataInputs: [
        'Certification database: J. Williams Signal Maintainer Class A expires April 2, 2026',
        'FRA requirement: active certification required for PTC signal work',
        'Training schedule: next available recertification class March 30',
        'HR contact: automated notification to HR Training Coordinator',
      ],
      optionsEvaluated: [
        { label: 'Notify HR and auto-enroll in next class', pros: 'Proactive, no gap in certification', cons: 'Assumes availability (verified with crew schedule)' },
        { label: 'Notify HR only, let them handle enrollment', pros: 'HR maintains control', cons: 'Risk of delayed action; potential compliance gap' },
      ],
      reasoning: 'Auto-enrolled in March 30 class after confirming no schedule conflicts. HR notified with full context. Williams will be recertified 3 days before expiration.',
      confidence: 97,
    },
  },

  // ── Chief Agent (Shared) ─────────────────────────────────
  {
    id: 'ad-012',
    agentId: 'chief',
    agentName: 'Chief',
    timestamp: '2026-03-28T07:00:00Z',
    action: 'Generated CEO morning briefing with 3 priority alerts',
    outcome: 'Briefing delivered to James Mitchell at 7:00 AM',
    status: 'success',
    savingsLabel: '47 data sources synthesized',
    manualTime: '2 hours (analyst prep)',
    automatedTime: '90 seconds',
    division: 'shared',
    chain: {
      dataInputs: [
        'Division status feeds: all 7 divisions reporting nominal',
        'Financial variance: HRSI project WO-2025-08834 trending 4% over budget',
        'Safety dashboard: 0 recordable incidents (142 days streak)',
        'Compliance alerts: 1 certification expiring (Signal Maintainer), already addressed',
      ],
      optionsEvaluated: [
        { label: 'Standard briefing with all metrics', pros: 'Comprehensive coverage', cons: 'Information overload; 12-page report' },
        { label: 'Priority-filtered briefing (top 3 items)', pros: 'Actionable, respects CEO time', cons: 'May omit secondary details' },
      ],
      reasoning: 'CEO preferences indicate 5-minute read time. Priority-filtered format with 3 alerts and drill-down links for details.',
      confidence: 96,
    },
  },

  // ── Signal Agent (HTI) ───────────────────────────────────
  {
    id: 'ad-013',
    agentId: 'ptc-monitor',
    agentName: 'PTC Monitor',
    timestamp: '2026-03-28T01:30:00Z',
    action: 'Rebooted wayside unit WU-847 after detecting communication lag',
    outcome: 'Signal restored in 12 seconds, no train delays',
    status: 'success',
    savingsLabel: 'Zero train delays',
    manualTime: '45 min (technician dispatch + manual reboot)',
    automatedTime: '12 seconds',
    division: 'hti',
    chain: {
      dataInputs: [
        'Wayside unit WU-847: communication latency spiked to 340ms (threshold: 200ms)',
        'PTC system impact: approaching degraded mode trigger at 500ms',
        'Remote reboot capability: available (unit has remote management interface)',
        'Train schedule: next train in 8 minutes, minimum 2-minute buffer needed',
      ],
      optionsEvaluated: [
        { label: 'Remote reboot (12-second recovery)', pros: 'Immediate fix, well within train schedule buffer', cons: 'Small risk of reboot failure (2% historical rate)' },
        { label: 'Dispatch field technician', pros: 'Physical inspection of hardware', cons: '45-minute response time; likely train delay' },
        { label: 'Switch to backup communication path', pros: 'No service interruption', cons: 'Backup path already at 80% capacity' },
      ],
      reasoning: 'Remote reboot has 98% success rate and 12-second recovery. With 8 minutes before next train, this provides ample buffer. Technician dispatch queued as fallback.',
      confidence: 96,
    },
  },

  // ── Energy Agent (HE) ────────────────────────────────────
  {
    id: 'ad-014',
    agentId: 'energy-optimizer',
    agentName: 'Energy Optimizer',
    timestamp: '2026-03-28T05:00:00Z',
    action: 'Shifted solar array cleaning schedule based on weather forecast',
    outcome: 'Maximized generation: +4.2 MWh during clear window',
    status: 'success',
    savingsLabel: '+$630 generation revenue',
    manualTime: '30 min (manual forecast check + reschedule)',
    automatedTime: '8 seconds',
    division: 'he',
    chain: {
      dataInputs: [
        'Weather API: 3-day clear window starting tomorrow, followed by 5 days cloud cover',
        'Solar array Site 3: panel soiling reducing output by 8%',
        'Cleaning crew availability: today or next Tuesday',
        'Revenue impact: $150/MWh during peak; 4.2 MWh potential gain from cleaning',
      ],
      optionsEvaluated: [
        { label: 'Clean today (before clear window)', pros: 'Maximize 3-day clear window generation', cons: 'Pulls crew from scheduled maintenance' },
        { label: 'Clean next Tuesday (original schedule)', pros: 'No schedule disruption', cons: 'Miss $630 in generation revenue during clear window' },
      ],
      reasoning: 'Moving cleaning to today captures $630 in additional generation during the upcoming clear window. Crew confirmed available after rescheduling non-critical maintenance.',
      confidence: 89,
    },
  },

  // ── Environmental Agent (GG) ─────────────────────────────
  {
    id: 'ad-015',
    agentId: 'enviro-monitor',
    agentName: 'Enviro Monitor',
    timestamp: '2026-03-27T20:00:00Z',
    action: 'Triggered water quality alert at Remediation Site 7',
    outcome: 'EPA notification sent, containment protocol activated',
    status: 'warning',
    savingsLabel: 'EPA violation prevented',
    manualTime: '6 hours (manual sampling + lab analysis)',
    automatedTime: '15 seconds',
    division: 'gg',
    chain: {
      dataInputs: [
        'Wetland sensor array: turbidity reading 42 NTU (EPA limit: 50 NTU)',
        'Trend analysis: readings increasing 3 NTU/hour for past 4 hours',
        'Upstream construction activity: HCC bridge project 2.4 miles upstream',
        'EPA permit conditions: notification required if readings exceed 45 NTU',
      ],
      optionsEvaluated: [
        { label: 'Activate silt curtain and notify EPA proactively', pros: 'Shows good faith compliance; prevents threshold breach', cons: 'Silt curtain deployment cost ($1,200)' },
        { label: 'Continue monitoring, alert if threshold reached', pros: 'Avoids premature action', cons: 'May not have time to prevent exceedance; EPA views reactive approach poorly' },
        { label: 'Notify upstream construction to pause operations', pros: 'Addresses root cause', cons: 'Causes project delay ($4,200/day)' },
      ],
      reasoning: 'At current trend rate, EPA limit will be reached in ~2.7 hours. Proactive silt curtain deployment plus EPA notification demonstrates responsible stewardship and prevents violation.',
      confidence: 87,
    },
  },

  // ── Relay Agent (Shared) ─────────────────────────────────
  {
    id: 'ad-016',
    agentId: 'relay',
    agentName: 'Relay',
    timestamp: '2026-03-28T09:30:00Z',
    action: 'Flagged overdue action item from Division Ops meeting',
    outcome: 'Reminded VP Ops: bridge inspection report due in 2 days',
    status: 'info',
    savingsLabel: 'Deadline accountability maintained',
    manualTime: '30 min (manual meeting notes review)',
    automatedTime: '3 seconds',
    division: 'shared',
    chain: {
      dataInputs: [
        'Meeting transcript (March 21): VP Ops committed to bridge inspection report by March 30',
        'Document tracking: no report uploaded to SharePoint project folder',
        'Calendar check: VP Ops has 2h block available tomorrow for report completion',
        'Stakeholder: CEO briefing on March 31 references this deliverable',
      ],
      optionsEvaluated: [
        { label: 'Send gentle reminder via Slack DM', pros: 'Low-friction, timely', cons: 'May be missed among other messages' },
        { label: 'Send reminder + calendar block suggestion', pros: 'Proactive support, increases completion likelihood', cons: 'Slightly more intrusive' },
      ],
      reasoning: 'Sent Slack reminder with suggested calendar block for tomorrow. Linked to original meeting commitment and noted CEO briefing dependency.',
      confidence: 94,
    },
  },

  // ── Transit Operations (HTSI) ────────────────────────────
  {
    id: 'ad-017',
    agentId: 'passenger-flow',
    agentName: 'Passenger Flow',
    timestamp: '2026-03-28T08:15:00Z',
    action: 'Adjusted train frequency on Blue Line for morning surge',
    outcome: 'Reduced platform dwell time from 4.2 min to 2.1 min',
    status: 'success',
    savingsLabel: '50% dwell time reduction',
    manualTime: '20 min (ops center manual adjustment)',
    automatedTime: '5 seconds',
    division: 'htsi',
    chain: {
      dataInputs: [
        'Fare collection data: 34% above normal ridership at Central Station',
        'Platform cameras: crowding index at 0.78 (threshold: 0.85)',
        'Available rolling stock: 2 additional trainsets available in yard',
        'Driver availability: 2 qualified operators on standby',
      ],
      optionsEvaluated: [
        { label: 'Deploy 2 additional trainsets', pros: 'Reduces crowding below 0.6, improves service', cons: 'Overtime cost for 2 operators ($420)' },
        { label: 'Deploy 1 additional trainset', pros: 'Moderate improvement at lower cost', cons: 'Crowding may still approach threshold' },
        { label: 'No action, monitor only', pros: 'Zero cost', cons: 'Platform crowding may exceed safety threshold' },
      ],
      reasoning: 'Deployed 2 trainsets to bring crowding index well below threshold. Large sporting event at nearby arena explains the surge; pattern will repeat for evening return.',
      confidence: 92,
    },
  },

  // ── Ballast Operations (HRSI) ────────────────────────────
  {
    id: 'ad-018',
    agentId: 'ballast-ops',
    agentName: 'Ballast Ops',
    timestamp: '2026-03-27T11:00:00Z',
    action: 'Rescheduled ballast train BT-14 to avoid track window conflict',
    outcome: 'Avoided 3-hour hold; maintained production schedule',
    status: 'success',
    savingsLabel: '3 hours saved, $8,400 in crew standby costs',
    manualTime: '1 hour (manual coordination)',
    automatedTime: '18 seconds',
    division: 'hrsi',
    chain: {
      dataInputs: [
        'Ballast train BT-14 scheduled for Track Section 12A at 14:00',
        'Conflicting track window: HSI inspection car scheduled 13:30-16:30 on same section',
        'Alternative window: Section 12A available 10:00-13:00 today',
        'Crew schedule: BT-14 crew available for earlier start with 30-min notice',
      ],
      optionsEvaluated: [
        { label: 'Move BT-14 to morning window (10:00-13:00)', pros: 'No production loss, avoids conflict entirely', cons: 'Requires crew to start 4 hours earlier' },
        { label: 'Hold BT-14 until 16:30 (after inspection)', pros: 'No crew schedule change', cons: '3-hour delay; $8,400 standby cost; may lose daylight' },
      ],
      reasoning: 'Earlier window avoids conflict completely. Crew confirmed available for morning start. Coordinated with HSI to confirm their inspection window unchanged.',
      confidence: 95,
    },
  },
];

/** Get all decisions for a specific agent */
export function getDecisionsForAgent(agentId: string): AgentAction[] {
  return agentDecisions.filter((d) => d.agentId === agentId);
}

/** Get all decisions for a specific division (includes shared) */
export function getDecisionsForDivision(divisionId: string): AgentAction[] {
  if (divisionId === 'meridian') return agentDecisions;
  return agentDecisions.filter((d) => d.division === divisionId || d.division === 'shared');
}

/** Get the N most recent decisions */
export function getRecentDecisions(count: number): AgentAction[] {
  return [...agentDecisions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}
