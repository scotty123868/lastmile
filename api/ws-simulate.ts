import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents } from './_agentData';

/**
 * GET /api/ws-simulate — Server-Sent Events stream simulating WebSocket.
 * Pushes a new agent event every 5-10 seconds.
 */

const eventActions = [
  { action: 'task.completed', severity: 'info' },
  { action: 'data.synced', severity: 'info' },
  { action: 'report.generated', severity: 'info' },
  { action: 'compliance.verified', severity: 'info' },
  { action: 'anomaly.detected', severity: 'warning' },
  { action: 'schedule.optimized', severity: 'info' },
  { action: 'alert.acknowledged', severity: 'info' },
  { action: 'model.updated', severity: 'info' },
  { action: 'savings.identified', severity: 'info' },
  { action: 'health.check', severity: 'info' },
];

const eventDetails: Record<string, string[]> = {
  'task.completed': [
    'Processed 47 incoming work orders in 2.3s',
    'Batch analysis complete — 12 items flagged for review',
    'Daily report compilation finished — distributed to 14 recipients',
  ],
  'data.synced': [
    'SAP sync complete — 2,400 records updated',
    'Fleet telematics data ingested — 340 vehicles tracked',
    'Primavera P6 schedule data refreshed',
  ],
  'report.generated': [
    'Weekly safety summary compiled — 0 incidents',
    'Cost variance report generated for 3 active projects',
    'Equipment utilization report distributed to ops managers',
  ],
  'compliance.verified': [
    'All active crew members verified within HOS limits',
    'FRA compliance check passed — auto-filed Form 6180.97',
    'Environmental permit status verified — all current',
  ],
  'anomaly.detected': [
    'Sensor reading outside normal range — investigation triggered',
    'API latency spike detected on upstream connector',
    'Unusual pattern in equipment vibration data — flagged',
  ],
  'schedule.optimized': [
    'Crew schedule adjusted — 3.2 overtime hours eliminated',
    'Transit route timing micro-adjusted for better on-time performance',
    'Equipment dispatch sequence optimized — idle time reduced 12%',
  ],
  'alert.acknowledged': [
    'Temperature alert auto-acknowledged — within safe range now',
    'Connectivity alert resolved — backup link activated',
    'Batch quality alert reviewed — no corrective action needed',
  ],
  'model.updated': [
    'Defect detection model refreshed with 2,400 new samples',
    'Demand forecasting model retrained — accuracy +0.4%',
    'Route optimization weights updated based on last week data',
  ],
  'savings.identified': [
    'Duplicate purchase order detected — $4,200 saved',
    'Unused software license flagged — $2,800/yr recoverable',
    'Fuel route optimization saved $1,400 this shift',
  ],
  'health.check': [
    'All 14 connected systems responding within SLA',
    'Agent runtime health check passed — 48/48 agents nominal',
    'Database replication lag: 0.3ms — within threshold',
  ],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  let eventCount = 0;
  const maxEvents = 60; // Max ~5 minutes of events

  const sendEvent = () => {
    if (eventCount >= maxEvents) {
      res.write(`event: done\ndata: ${JSON.stringify({ reason: 'max_events_reached' })}\n\n`);
      res.end();
      return;
    }

    const agent = allAgents[Math.floor(Math.random() * allAgents.length)];
    const eventType = eventActions[Math.floor(Math.random() * eventActions.length)];
    const details = eventDetails[eventType.action] || ['Operation completed successfully'];
    const detail = details[Math.floor(Math.random() * details.length)];

    const event = {
      id: `sse_${Date.now().toString(36)}_${eventCount}`,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      agentName: agent.name,
      division: agent.division,
      divisionName: agent.divisionName,
      action: eventType.action,
      detail,
      severity: eventType.severity,
    };

    res.write(`event: agent-event\ndata: ${JSON.stringify(event)}\n\n`);
    eventCount++;

    // Schedule next event in 5-10 seconds
    const delay = 5000 + Math.floor(Math.random() * 5000);
    setTimeout(sendEvent, delay);
  };

  // Start sending events after a short delay
  setTimeout(sendEvent, 2000);

  // Clean up on client disconnect
  req.on('close', () => {
    eventCount = maxEvents; // Stop sending
  });
}
