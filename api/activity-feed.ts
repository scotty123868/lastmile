import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, divisionMeta, envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/activity-feed — Live activity stream.
 * Query params:
 *   ?division=hcc — filter by division
 *   ?since=<ISO timestamp> — only return activities after this time
 *   ?limit=50 — max items (default 50)
 */

type Severity = 'info' | 'warning' | 'critical';

interface ActivityItem {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  division: string;
  divisionName: string;
  action: string;
  detail: string;
  severity: Severity;
}

const actionTemplates: { action: string; detail: string; severity: Severity; divisions?: string[] }[] = [
  { action: 'Task completed', detail: 'Processed batch of incoming work orders — 47 items routed', severity: 'info' },
  { action: 'Compliance check passed', detail: 'All crew schedules verified against HOS limits — no violations', severity: 'info', divisions: ['hcc', 'hrsi'] },
  { action: 'Anomaly detected', detail: 'Sensor reading outside normal range at monitoring point — investigation triggered', severity: 'warning' },
  { action: 'Report generated', detail: 'Daily summary report compiled and distributed to stakeholders', severity: 'info' },
  { action: 'Data sync completed', detail: 'Synchronized 12,400 records from upstream system in 4.2s', severity: 'info' },
  { action: 'Schedule optimized', detail: 'Crew schedule adjusted to reduce overtime by 3.2 hours', severity: 'info' },
  { action: 'Alert acknowledged', detail: 'Equipment maintenance alert reviewed and work order created', severity: 'info' },
  { action: 'Prediction updated', detail: 'Failure prediction model refreshed with latest sensor data — 2 new predictions', severity: 'info' },
  { action: 'Cost savings identified', detail: 'Duplicate purchase order detected across divisions — consolidated for $4,200 savings', severity: 'info' },
  { action: 'Safety scan completed', detail: 'Communications monitored for safety keywords — 0 escalations needed', severity: 'info' },
  { action: 'Threshold warning', detail: 'Resource utilization approaching 85% capacity — pre-emptive scaling recommended', severity: 'warning' },
  { action: 'Integration health check', detail: 'All connected systems responding within SLA — 7/7 healthy', severity: 'info' },
  { action: 'Document processed', detail: 'Incoming RFP analyzed — key terms extracted and risk assessment generated', severity: 'info' },
  { action: 'Permit status updated', detail: 'Environmental permit renewal submitted — awaiting regulatory approval', severity: 'info', divisions: ['he', 'gg', 'hsi'] },
  { action: 'Route optimization', detail: 'Transit schedule micro-adjusted — estimated 2.1 min improvement per route', severity: 'info', divisions: ['htsi'] },
  { action: 'Quality check passed', detail: 'Batch quality metrics within specification — no corrective action needed', severity: 'info', divisions: ['hcc'] },
  { action: 'Model retrained', detail: 'Detection model updated with 2,400 new labeled samples — accuracy +0.3%', severity: 'info', divisions: ['hsi', 'hrsi'] },
  { action: 'Inventory rebalanced', detail: 'Parts inventory levels optimized across 4 warehouses — carrying cost reduced 8%', severity: 'info', divisions: ['hrsi'] },
  { action: 'License audit', detail: 'Weekly SaaS license scan complete — 3 unused licenses identified ($9,400/yr)', severity: 'info' },
  { action: 'Executive briefing delivered', detail: 'Morning briefing compiled from 47 data sources — 3 action items flagged', severity: 'info' },
];

function generateActivities(count: number, divisionFilter?: string): ActivityItem[] {
  const now = Date.now();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const items: ActivityItem[] = [];

  let filteredAgents = allAgents;
  if (divisionFilter) {
    filteredAgents = allAgents.filter(a => a.division === divisionFilter.toLowerCase());
  }

  if (filteredAgents.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const agent = filteredAgents[i % filteredAgents.length];
    const timeOffset = Math.floor(Math.random() * twoHoursMs);
    const timestamp = new Date(now - timeOffset);

    // Pick a template, preferring division-specific ones
    const applicable = actionTemplates.filter(
      t => !t.divisions || t.divisions.includes(agent.division)
    );
    const template = applicable[i % applicable.length];

    items.push({
      id: `act_${timestamp.getTime().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: timestamp.toISOString(),
      agentId: agent.id,
      agentName: agent.name,
      division: agent.division,
      divisionName: agent.divisionName,
      action: template.action,
      detail: template.detail,
      severity: template.severity,
    });
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const division = req.query.division as string | undefined;
  const since = req.query.since as string | undefined;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

  if (division && !divisionMeta[division.toLowerCase()]) {
    return res.status(404).json(errorEnvelope(`Unknown division: ${division}`, 404));
  }

  let activities = generateActivities(limit, division);

  if (since) {
    const sinceTime = new Date(since).getTime();
    if (!isNaN(sinceTime)) {
      activities = activities.filter(a => new Date(a.timestamp).getTime() > sinceTime);
    }
  }

  return res.status(200).json(envelope({
    activities,
    count: activities.length,
    oldestTimestamp: activities.length > 0 ? activities[activities.length - 1].timestamp : null,
    newestTimestamp: activities.length > 0 ? activities[0].timestamp : null,
  }));
}
