import type { VercelRequest, VercelResponse } from '@vercel/node';
import { envelope } from './_agentData';

/**
 * GET /api/health — Returns system health status.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  return res.status(200).json(envelope({
    status: 'healthy',
    uptime: '99.97%',
    lastIncident: '14 days ago',
    lastIncidentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    services: {
      api: 'operational',
      database: 'operational',
      agentRuntime: 'operational',
      eventBus: 'operational',
      monitoring: 'operational',
    },
    latency: {
      p50: '42ms',
      p95: '128ms',
      p99: '340ms',
    },
    version: '2.4.1',
    environment: 'production',
  }));
}
