import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, generateActivities, envelope, errorEnvelope } from '../_agentData';

/**
 * GET /api/agents/:id — Returns a single agent's full detail including activity log.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=15');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json(errorEnvelope('Method not allowed', 405));
  }

  const { id } = req.query;
  const agentId = (Array.isArray(id) ? id[0] : id)?.toLowerCase();

  if (!agentId) {
    return res.status(400).json(errorEnvelope('Agent ID is required', 400));
  }

  const agent = allAgents.find(a => a.id === agentId);

  if (!agent) {
    return res.status(404).json(errorEnvelope(`Agent not found: ${agentId}`, 404));
  }

  const activities = generateActivities(agentId, 8);

  return res.status(200).json(envelope({
    ...agent,
    lastActivity: new Date(Date.now() - Math.random() * 60000).toISOString(),
    activities,
    uptime: (99 + Math.random() * 0.97).toFixed(2) + '%',
    tasksCompletedToday: Math.floor(20 + Math.random() * 80),
    avgResponseTimeMs: Math.floor(800 + Math.random() * 2000),
  }));
}
