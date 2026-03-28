import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/audit-log — Compliance audit trail.
 * Query params:
 *   ?startDate=<ISO> — filter from this date
 *   ?endDate=<ISO> — filter to this date
 *   ?limit=100 — max items (default 100)
 */

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: { type: 'agent' | 'user' | 'system'; id: string; name: string };
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'denied';
  complianceTag: string | null;
  division: string;
  details: string;
}

const auditActions = [
  { action: 'data.accessed', resource: 'crew-schedule', outcome: 'success' as const, tag: 'SOX', detail: 'Accessed crew scheduling data for compliance verification' },
  { action: 'report.generated', resource: 'fra-compliance-report', outcome: 'success' as const, tag: 'FRA-49CFR', detail: 'Auto-generated FRA compliance report Form 6180.97' },
  { action: 'config.modified', resource: 'alert-thresholds', outcome: 'success' as const, tag: null, detail: 'Updated alert threshold for equipment temperature from 185F to 180F' },
  { action: 'agent.deployed', resource: 'agent-runtime', outcome: 'success' as const, tag: null, detail: 'Agent model v2.4.1 deployed to production environment' },
  { action: 'data.exported', resource: 'safety-records', outcome: 'success' as const, tag: 'FRA-49CFR', detail: 'Exported safety incident records for quarterly FRA submission' },
  { action: 'permission.granted', resource: 'user-access', outcome: 'success' as const, tag: 'SOX', detail: 'Elevated access granted to project manager for bid review' },
  { action: 'schedule.verified', resource: 'hos-compliance', outcome: 'success' as const, tag: 'FMCSA-HOS', detail: 'Verified all active crew members within HOS limits' },
  { action: 'model.retrained', resource: 'defect-detection', outcome: 'success' as const, tag: null, detail: 'Defect detection model retrained on 14K new labeled images' },
  { action: 'data.synced', resource: 'erp-integration', outcome: 'success' as const, tag: null, detail: 'Bi-directional sync completed with SAP S/4HANA — 12,400 records' },
  { action: 'alert.escalated', resource: 'safety-alert', outcome: 'success' as const, tag: 'OSHA', detail: 'Safety alert escalated to division safety officer per protocol' },
  { action: 'permit.submitted', resource: 'environmental-permit', outcome: 'success' as const, tag: 'EPA', detail: 'Environmental permit renewal submitted to state regulatory portal' },
  { action: 'audit.completed', resource: 'license-audit', outcome: 'success' as const, tag: 'SOX', detail: 'Monthly software license audit completed — 3 unused licenses flagged' },
  { action: 'data.accessed', resource: 'financial-records', outcome: 'denied' as const, tag: 'SOX', detail: 'Access denied — insufficient permissions for financial record export' },
  { action: 'integration.tested', resource: 'api-health', outcome: 'success' as const, tag: null, detail: 'Integration health check completed — all 14 systems responding' },
  { action: 'backup.verified', resource: 'data-backup', outcome: 'success' as const, tag: null, detail: 'Daily backup integrity verification passed — 847GB verified' },
];

const userActors = [
  { id: 'user_admin_01', name: 'Sarah Mitchell (Admin)' },
  { id: 'user_ops_01', name: 'Mike Torres (Ops Manager)' },
  { id: 'user_safety_01', name: 'Jennifer Park (Safety Director)' },
  { id: 'user_it_01', name: 'David Chen (IT Director)' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  const now = Date.now();
  const events: AuditEvent[] = [];

  for (let i = 0; i < limit; i++) {
    const minutesAgo = Math.floor(i * 14 + Math.random() * 10);
    const timestamp = new Date(now - minutesAgo * 60 * 1000);
    const template = auditActions[i % auditActions.length];

    // Alternate between agent and user actors
    const isAgent = Math.random() > 0.3;
    const agent = allAgents[i % allAgents.length];
    const user = userActors[i % userActors.length];

    events.push({
      id: `audit_${timestamp.getTime().toString(36)}_${i.toString(36)}`,
      timestamp: timestamp.toISOString(),
      actor: isAgent
        ? { type: 'agent', id: agent.id, name: agent.name }
        : { type: 'user', id: user.id, name: user.name },
      action: template.action,
      resource: template.resource,
      outcome: template.outcome,
      complianceTag: template.tag,
      division: agent.division,
      details: template.detail,
    });
  }

  // Apply date filters
  let filtered = events;
  if (startDate) {
    const start = new Date(startDate).getTime();
    if (!isNaN(start)) filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= start);
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    if (!isNaN(end)) filtered = filtered.filter(e => new Date(e.timestamp).getTime() <= end);
  }

  return res.status(200).json(envelope({
    events: filtered,
    count: filtered.length,
    complianceTags: [...new Set(filtered.map(e => e.complianceTag).filter(Boolean))],
    summary: {
      totalEvents: filtered.length,
      successCount: filtered.filter(e => e.outcome === 'success').length,
      failureCount: filtered.filter(e => e.outcome === 'failure').length,
      deniedCount: filtered.filter(e => e.outcome === 'denied').length,
    },
  }));
}
