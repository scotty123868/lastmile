import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/agents — Returns the full agent list.
 * Query params:
 *   ?division=hcc  — filter by division
 *   ?category=safety — filter by category
 *   ?status=active — filter by status
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
  res.setHeader('X-Agent-Count', String(allAgents.length));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json(errorEnvelope('Method not allowed', 405));
  }

  let agents = [...allAgents];

  const division = req.query.division as string | undefined;
  if (division) {
    const divLower = division.toLowerCase();
    agents = agents.filter(a => a.division === divLower || a.division === 'shared');
    if (agents.length === 0) {
      return res.status(404).json(errorEnvelope(`No agents found for division: ${division}`, 404));
    }
  }

  const category = req.query.category as string | undefined;
  if (category) {
    agents = agents.filter(a => a.category === category.toLowerCase());
  }

  const status = req.query.status as string | undefined;
  if (status) {
    agents = agents.filter(a => a.status === status.toLowerCase());
  }

  // Add simulated lastActivity to each agent
  const enriched = agents.map(a => ({
    ...a,
    lastActivity: new Date(Date.now() - Math.random() * 300000).toISOString(),
  }));

  return res.status(200).json(envelope({
    agents: enriched,
    total: enriched.length,
    divisions: [...new Set(enriched.map(a => a.division))],
  }));
}
