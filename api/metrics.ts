import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, divisionMeta, envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/metrics — Returns division-level metrics.
 * Query params:
 *   ?division=hcc — return metrics for a specific division
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json(errorEnvelope('Method not allowed', 405));
  }

  const jitter = (base: number, range: number) =>
    Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;

  function buildDivisionMetrics(divisionId: string) {
    const agents = allAgents.filter(a => a.division === divisionId);
    const meta = divisionMeta[divisionId];
    return {
      divisionId,
      divisionName: meta?.name ?? divisionId,
      agentsTotal: agents.length,
      agentsActive: agents.filter(a => a.status === 'active').length,
      agentsRunning: agents.filter(a => a.status === 'running').length,
      accuracy: jitter(94.2, 3),
      uptime: jitter(99.7, 0.4),
      tasksCompletedToday: Math.floor(jitter(120, 60)),
      avgResponseTimeMs: Math.floor(jitter(1200, 800)),
    };
  }

  const division = req.query.division as string | undefined;

  if (division) {
    const divId = division.toLowerCase();
    if (!divisionMeta[divId]) {
      return res.status(404).json(errorEnvelope(`Unknown division: ${division}`, 404));
    }
    return res.status(200).json(envelope(buildDivisionMetrics(divId)));
  }

  // Return metrics for all divisions
  const divisions = Object.keys(divisionMeta).map(buildDivisionMetrics);
  const totalAgents = allAgents.length;
  const activeAgents = allAgents.filter(a => a.status === 'active').length;

  return res.status(200).json(envelope({
    overview: {
      totalAgents,
      activeAgents,
      runningAgents: totalAgents - activeAgents,
      avgAccuracy: jitter(94.8, 2),
      systemUptime: jitter(99.85, 0.2),
      totalTasksToday: Math.floor(jitter(890, 200)),
    },
    divisions,
  }));
}
