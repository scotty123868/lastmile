import type { VercelRequest, VercelResponse } from '@vercel/node';

// AI Agent status endpoint
// GET /api/ai-agents — returns status and metrics for all deployed AI agents
// GET /api/ai-agents?agent=dispatch — returns status for a specific agent

interface AgentMetrics {
  id: string;
  name: string;
  type: 'operations' | 'intelligence';
  status: 'active' | 'running' | 'paused' | 'error';
  lastRun: string;
  accuracy: number;
  falsePositiveRate: number;
  meanDecisionTimeMs: number;
  humanOverrideRate: number;
  eventsProcessed24h: number;
  savingsGenerated: number;
  confidenceThreshold: number;
}

// In production, these would come from a database or monitoring service.
// For now, return live-looking data with slight randomization to simulate real telemetry.
function generateAgentMetrics(): AgentMetrics[] {
  const jitter = (base: number, range: number) =>
    Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;

  return [
    {
      id: 'dispatch',
      name: 'Dispatch',
      type: 'operations',
      status: 'active',
      lastRun: new Date(Date.now() - Math.random() * 60000).toISOString(),
      accuracy: jitter(96.2, 2),
      falsePositiveRate: jitter(2.1, 1),
      meanDecisionTimeMs: Math.round(jitter(1800, 500)),
      humanOverrideRate: jitter(8.7, 3),
      eventsProcessed24h: Math.round(jitter(2340, 200)),
      savingsGenerated: Math.round(jitter(368000, 20000)),
      confidenceThreshold: 0.85,
    },
    {
      id: 'scout',
      name: 'Scout',
      type: 'operations',
      status: 'active',
      lastRun: new Date(Date.now() - Math.random() * 120000).toISOString(),
      accuracy: jitter(94.2, 2),
      falsePositiveRate: jitter(3.1, 1),
      meanDecisionTimeMs: Math.round(jitter(2400, 600)),
      humanOverrideRate: jitter(12.4, 4),
      eventsProcessed24h: Math.round(jitter(890, 100)),
      savingsGenerated: Math.round(jitter(245000, 30000)),
      confidenceThreshold: 0.80,
    },
    {
      id: 'ledger',
      name: 'Ledger',
      type: 'operations',
      status: 'running',
      lastRun: new Date(Date.now() - Math.random() * 300000).toISOString(),
      accuracy: jitter(98.5, 1),
      falsePositiveRate: jitter(0.8, 0.5),
      meanDecisionTimeMs: Math.round(jitter(45000, 10000)),
      humanOverrideRate: jitter(3.2, 2),
      eventsProcessed24h: Math.round(jitter(47, 10)),
      savingsGenerated: Math.round(jitter(47000, 5000)),
      confidenceThreshold: 0.90,
    },
    {
      id: 'estimator',
      name: 'Estimator',
      type: 'operations',
      status: 'active',
      lastRun: new Date(Date.now() - Math.random() * 600000).toISOString(),
      accuracy: jitter(91.8, 3),
      falsePositiveRate: jitter(5.2, 2),
      meanDecisionTimeMs: Math.round(jitter(12000, 3000)),
      humanOverrideRate: jitter(14.2, 5),
      eventsProcessed24h: Math.round(jitter(14, 5)),
      savingsGenerated: Math.round(jitter(420000, 50000)),
      confidenceThreshold: 0.75,
    },
    {
      id: 'quartermaster',
      name: 'Quartermaster',
      type: 'operations',
      status: 'active',
      lastRun: new Date(Date.now() - Math.random() * 180000).toISOString(),
      accuracy: jitter(89.4, 3),
      falsePositiveRate: jitter(4.8, 2),
      meanDecisionTimeMs: Math.round(jitter(8000, 2000)),
      humanOverrideRate: jitter(18.1, 5),
      eventsProcessed24h: Math.round(jitter(156, 30)),
      savingsGenerated: Math.round(jitter(189000, 25000)),
      confidenceThreshold: 0.70,
    },
    {
      id: 'atlas',
      name: 'Atlas',
      type: 'intelligence',
      status: 'active',
      lastRun: new Date(Date.now() - Math.random() * 30000).toISOString(),
      accuracy: jitter(92.1, 3),
      falsePositiveRate: jitter(6.3, 2),
      meanDecisionTimeMs: Math.round(jitter(3200, 800)),
      humanOverrideRate: jitter(22.1, 6),
      eventsProcessed24h: Math.round(jitter(2340, 300)),
      savingsGenerated: 0,
      confidenceThreshold: 0.65,
    },
  ];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const agents = generateAgentMetrics();
  const agentParam = req.query.agent as string | undefined;

  if (agentParam) {
    const agent = agents.find(a => a.id === agentParam.toLowerCase());
    if (!agent) {
      return res.status(404).json({ error: `Unknown agent: ${agentParam}` });
    }
    return res.status(200).json(agent);
  }

  const summary = {
    totalAgents: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    running: agents.filter(a => a.status === 'running').length,
    totalEventsProcessed24h: agents.reduce((s, a) => s + a.eventsProcessed24h, 0),
    totalSavingsGenerated: agents.reduce((s, a) => s + a.savingsGenerated, 0),
    avgAccuracy: Math.round(agents.reduce((s, a) => s + a.accuracy, 0) / agents.length * 10) / 10,
    checkedAt: new Date().toISOString(),
  };

  return res.status(200).json({ summary, agents });
}
