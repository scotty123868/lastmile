import type { VercelRequest, VercelResponse } from '@vercel/node';
import { envelope, errorEnvelope } from '../_agentData';

/**
 * GET /api/analytics/trends — Trend data over time.
 * Returns weekly task volume, agent adoption curve, cost savings accumulation.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const now = new Date();

  // Weekly task volume — last 12 weeks showing clear upward trend
  const weeklyVolume: { week: string; weekLabel: string; tasks: number; errors: number }[] = [];
  const baseWeeklyTasks = 2200;
  for (let i = 11; i >= 0; i--) {
    const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStr = `W${String(getISOWeek(weekDate)).padStart(2, '0')}`;
    const growthFactor = 1 + (11 - i) * 0.06; // ~6% weekly growth
    const jitter = 0.95 + Math.random() * 0.1;
    const tasks = Math.round(baseWeeklyTasks * growthFactor * jitter);
    const errors = Math.round(tasks * (0.012 - (11 - i) * 0.0005)); // error rate decreasing over time
    weeklyVolume.push({
      week: weekStr,
      weekLabel: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks,
      errors: Math.max(errors, 1),
    });
  }

  // Agent adoption curve — showing ramp-up
  const adoptionCurve: { week: string; agentsDeployed: number; divisionsActive: number }[] = [];
  const adoptionSchedule = [5, 8, 14, 20, 26, 31, 35, 39, 42, 44, 46, 48];
  const divisionSchedule = [1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7]; // ramped up to all 7 + shared
  for (let i = 0; i < 12; i++) {
    const weekDate = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
    adoptionCurve.push({
      week: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      agentsDeployed: adoptionSchedule[i],
      divisionsActive: divisionSchedule[i],
    });
  }

  // Cost savings accumulation — cumulative over 12 weeks
  const costSavings: { week: string; weeklySavings: number; cumulative: number }[] = [];
  let cumulative = 0;
  const baseSavings = 42000; // $42K/week base
  for (let i = 0; i < 12; i++) {
    const weekDate = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
    const growthFactor = 1 + i * 0.08;
    const weekly = Math.round(baseSavings * growthFactor);
    cumulative += weekly;
    costSavings.push({
      week: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weeklySavings: weekly,
      cumulative,
    });
  }

  // Key trend metrics
  const latestWeek = weeklyVolume[weeklyVolume.length - 1];
  const previousWeek = weeklyVolume[weeklyVolume.length - 2];
  const weekOverWeekGrowth = ((latestWeek.tasks - previousWeek.tasks) / previousWeek.tasks * 100).toFixed(1);

  return res.status(200).json(envelope({
    weeklyVolume,
    adoptionCurve,
    costSavings,
    keyMetrics: {
      totalTasksAllTime: weeklyVolume.reduce((s, w) => s + w.tasks, 0),
      weekOverWeekGrowth: `${weekOverWeekGrowth}%`,
      totalCostSavings: cumulative,
      totalCostSavingsFormatted: `$${(cumulative / 1000).toFixed(0)}K`,
      currentAgents: 48,
      currentDivisions: 7,
      avgErrorRate: `${(weeklyVolume.reduce((s, w) => s + w.errors, 0) / weeklyVolume.reduce((s, w) => s + w.tasks, 0) * 100).toFixed(2)}%`,
    },
  }));
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
