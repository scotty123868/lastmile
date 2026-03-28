import type { VercelRequest, VercelResponse } from '@vercel/node';
import { envelope, errorEnvelope } from '../_agentData';

/**
 * POST /api/webhooks/agent-event — Accepts agent event webhooks.
 * Body: { agentId: string, event: string, data?: Record<string, unknown> }
 * Returns 200 with event ID for future integration.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json(errorEnvelope('Method not allowed. Use POST.', 405));
  }

  const body = req.body;

  if (!body || !body.agentId || !body.event) {
    return res.status(400).json(errorEnvelope('Missing required fields: agentId, event', 400));
  }

  const eventId = `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  return res.status(200).json(envelope({
    eventId,
    agentId: body.agentId,
    event: body.event,
    received: true,
    processedAt: new Date().toISOString(),
  }));
}
