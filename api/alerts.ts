import type { VercelRequest, VercelResponse } from '@vercel/node';
import { envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/alerts — Active alerts and incident history.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const now = Date.now();

  const activeAlerts = [
    {
      id: 'alert_001',
      severity: 'warning' as const,
      title: 'Elevated API latency on SAP connector',
      description: 'SAP ERP sync latency has increased to 4.2s (threshold: 3s). Data sync is still completing but slower than SLA.',
      agentId: 'foreman',
      agentName: 'Foreman',
      division: 'hcc',
      divisionName: 'IC Construction',
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      acknowledgedBy: 'system-auto',
      acknowledgedAt: new Date(now - 40 * 60 * 1000).toISOString(),
      status: 'acknowledged',
    },
    {
      id: 'alert_002',
      severity: 'warning' as const,
      title: 'Crew scheduling model retraining delayed',
      description: 'Weekly model retrain for crew scheduling optimizer was delayed by 2 hours due to training data pipeline lag.',
      agentId: 'conductor',
      agentName: 'Conductor',
      division: 'htsi',
      divisionName: 'IC Transit Services',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      acknowledgedBy: null,
      acknowledgedAt: null,
      status: 'active',
    },
    {
      id: 'alert_003',
      severity: 'info' as const,
      title: 'Geometry car data batch larger than expected',
      description: 'Incoming geometry car data batch is 2.4x normal size. Processing will take an additional 12 minutes.',
      agentId: 'geometrycar',
      agentName: 'GeometryAnalyst',
      division: 'hrsi',
      divisionName: 'IC Rail Services',
      createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
      acknowledgedBy: 'system-auto',
      acknowledgedAt: new Date(now - 14 * 60 * 1000).toISOString(),
      status: 'acknowledged',
    },
  ];

  // 30-day history summary
  const history = {
    last30Days: {
      totalAlerts: 47,
      critical: 1,
      warning: 18,
      info: 28,
      avgResolutionTimeMinutes: 34,
      mttr: '34 min',
    },
    last7Days: {
      totalAlerts: 8,
      critical: 0,
      warning: 3,
      info: 5,
    },
    recentResolved: [
      {
        id: 'alert_r01',
        severity: 'warning',
        title: 'Primavera P6 sync timeout',
        resolvedAt: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
        resolutionTimeMinutes: 22,
      },
      {
        id: 'alert_r02',
        severity: 'critical',
        title: 'FRA compliance report submission failed',
        resolvedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
        resolutionTimeMinutes: 8,
      },
      {
        id: 'alert_r03',
        severity: 'warning',
        title: 'Atlas response time degradation',
        resolvedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        resolutionTimeMinutes: 45,
      },
    ],
  };

  return res.status(200).json(envelope({
    active: activeAlerts,
    activeCount: activeAlerts.length,
    criticalCount: 0,
    history,
  }));
}
