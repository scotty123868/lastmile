import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, divisionMeta, envelope, errorEnvelope } from '../_agentData';

/**
 * GET /api/analytics/summary — Analytics dashboard data.
 * Returns tasks by hour, by category, by division, error rate, response times.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const now = new Date();
  const currentHour = now.getHours();

  // Tasks by hour (last 24 hours)
  const tasksByHour: { hour: string; tasks: number; errors: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const h = (currentHour - i + 24) % 24;
    const label = `${h.toString().padStart(2, '0')}:00`;
    // Simulate workday pattern — higher during business hours
    const isBusinessHour = h >= 7 && h <= 18;
    const baseTasks = isBusinessHour ? 65 + Math.floor(Math.random() * 30) : 12 + Math.floor(Math.random() * 15);
    const errorCount = Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 1 : 0;
    tasksByHour.push({ hour: label, tasks: baseTasks, errors: errorCount });
  }

  const totalTasks24h = tasksByHour.reduce((s, h) => s + h.tasks, 0);
  const totalErrors24h = tasksByHour.reduce((s, h) => s + h.errors, 0);

  // Tasks by category
  const categories = ['operations', 'intelligence', 'safety', 'logistics'] as const;
  const categoryWeights = { operations: 0.35, intelligence: 0.28, safety: 0.22, logistics: 0.15 };
  const tasksByCategory = categories.map(cat => ({
    category: cat,
    count: Math.round(totalTasks24h * categoryWeights[cat]),
    percentage: Math.round(categoryWeights[cat] * 100),
    agentCount: allAgents.filter(a => a.category === cat).length,
  }));

  // Tasks by division
  const tasksByDivision = Object.entries(divisionMeta).map(([id, meta]) => {
    const agentCount = allAgents.filter(a => a.division === id).length;
    const weight = agentCount / allAgents.length;
    return {
      division: id,
      divisionName: meta.name,
      count: Math.round(totalTasks24h * weight),
      agentCount,
      percentage: Math.round(weight * 100),
    };
  });

  return res.status(200).json(envelope({
    tasksByHour,
    tasksByCategory,
    tasksByDivision,
    totals: {
      tasks24h: totalTasks24h,
      errors24h: totalErrors24h,
      errorRate: `${((totalErrors24h / totalTasks24h) * 100).toFixed(2)}%`,
      errorRateNumeric: parseFloat(((totalErrors24h / totalTasks24h) * 100).toFixed(2)),
    },
    performance: {
      avgResponseTimeMs: 1140,
      p50ResponseTimeMs: 890,
      p95ResponseTimeMs: 2840,
      p99ResponseTimeMs: 4200,
      throughputPerMinute: Math.round(totalTasks24h / 1440 * 10) / 10,
    },
    agents: {
      total: allAgents.length,
      active: allAgents.filter(a => a.status === 'active').length,
      running: allAgents.filter(a => a.status === 'running').length,
      paused: allAgents.filter(a => a.status === 'paused').length,
    },
  }));
}
