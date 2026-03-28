import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, divisionMeta, envelope, errorEnvelope } from '../_agentData';

/**
 * GET /api/export/report — Generate division report.
 * Query params:
 *   ?division=hcc — specific division (or 'all' for platform-wide)
 *   ?format=json — response format (only json supported currently)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const division = (req.query.division as string || 'all').toLowerCase();
  const format = (req.query.format as string || 'json').toLowerCase();

  if (format !== 'json') {
    return res.status(400).json(errorEnvelope('Only JSON format is currently supported', 400));
  }

  if (division !== 'all' && !divisionMeta[division]) {
    return res.status(404).json(errorEnvelope(`Unknown division: ${division}`, 404));
  }

  const jitter = (base: number, range: number) =>
    Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;

  const now = new Date();
  const reportId = `rpt_${now.getTime().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  function buildDivisionReport(divId: string) {
    const meta = divisionMeta[divId];
    const agents = allAgents.filter(a => a.division === divId);

    const agentPerformance = agents.map(a => ({
      id: a.id,
      name: a.name,
      status: a.status,
      category: a.category,
      metrics: a.metrics,
      tasksCompletedToday: Math.floor(jitter(24, 16)),
      avgResponseTimeMs: Math.floor(jitter(1100, 800)),
      uptime: `${jitter(99.7, 0.4)}%`,
      errorRate: `${jitter(0.8, 0.6)}%`,
    }));

    const totalTasks = agentPerformance.reduce((s, a) => s + a.tasksCompletedToday, 0);

    return {
      divisionId: divId,
      divisionName: meta.name,
      reportPeriod: {
        start: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        end: now.toISOString(),
        duration: '24 hours',
      },
      summary: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        totalTasksCompleted: totalTasks,
        avgAccuracy: jitter(94.2, 3),
        avgUptime: jitter(99.8, 0.3),
        costSavingsToday: `$${Math.floor(jitter(12000, 8000)).toLocaleString()}`,
        complianceRate: `${jitter(99.4, 0.6)}%`,
      },
      agentPerformance,
      integrationStatus: {
        connectedSystems: Math.floor(jitter(5, 2)),
        avgSyncLatencyMs: Math.floor(jitter(140, 80)),
        recordsProcessedToday: Math.floor(jitter(48000, 20000)),
        lastSyncIssue: Math.random() > 0.7 ? 'Minor latency on ERP connector (resolved)' : null,
      },
      recommendations: generateRecommendations(divId),
    };
  }

  let reportData;
  if (division === 'all') {
    const divisionReports = Object.keys(divisionMeta).map(buildDivisionReport);
    reportData = {
      reportId,
      reportType: 'platform-wide',
      generatedAt: now.toISOString(),
      divisions: divisionReports,
      platformSummary: {
        totalAgents: allAgents.length,
        totalDivisions: Object.keys(divisionMeta).length,
        totalTasksToday: divisionReports.reduce((s, d) => s + d.summary.totalTasksCompleted, 0),
        platformUptime: '99.97%',
        overallComplianceRate: '99.6%',
        totalCostSavingsToday: `$${divisionReports.reduce((s, d) => s + parseInt(d.summary.costSavingsToday.replace(/[$,]/g, '')), 0).toLocaleString()}`,
      },
    };
  } else {
    reportData = {
      reportId,
      reportType: 'division',
      generatedAt: now.toISOString(),
      ...buildDivisionReport(division),
    };
  }

  // Add content disposition for downloadability
  res.setHeader('Content-Disposition', `attachment; filename="report-${division}-${now.toISOString().slice(0, 10)}.json"`);

  return res.status(200).json(envelope(reportData));
}

function generateRecommendations(divisionId: string): string[] {
  const recs: Record<string, string[]> = {
    shared: [
      'Consider expanding Atlas assistant to cover field-specific safety protocols',
      'Ledger has identified $47K/month in license waste — recommend executive review of findings',
      'Relay meeting coverage could be extended to include external vendor meetings',
    ],
    hcc: [
      'Blueprint bid estimation accuracy trending up — consider expanding to sub-contractor bids',
      'WeatherDelay predictions saved 14 delay days this quarter — ROI exceeds 8x',
      'FleetTracker maintenance compliance at 97.4% — target 99% by Q3',
    ],
    hrsi: [
      'Scout defect prediction accuracy at 94.2% — exceeds industry benchmark by 12pp',
      'Stockroom identified 2 items at stockout risk — reorder recommendations pending approval',
      'TampScheduler achieving 94% track time utilization — top quartile performance',
    ],
    hsi: [
      'RailSentry processing 12K images/day — consider GPU scaling for peak inspection seasons',
      'EmissionsTracker showing 18% reduction vs baseline — on track for annual target',
      'PermitRenewal has maintained 100% compliance — zero missed deadlines in 6 months',
    ],
    hti: [
      'Sentinel signal monitoring uptime at 99.97% — exceeds FRA requirements',
      'PatentMonitor identified 3 licensing opportunities worth evaluating',
      'R&D Pipeline shows 82% budget utilization — 2 projects approaching stage gate review',
    ],
    htsi: [
      'Router schedule optimization reduced average delay by 1.4 minutes this week',
      'FareRevenue dynamic pricing generating additional $67K/month in revenue',
      'FleetElectrify tracking 34% electrification — on pace for 50% target by year-end',
    ],
    he: [
      'GridWatch predicted inverter failure 3 weeks in advance — parts pre-ordered',
      'M&A Diligence processing 3 active evaluations — average analysis time cut to 4.2 days',
      'BoardReport automation saving 18 hours per quarterly report cycle',
    ],
    gg: [
      'QuarryYield blast optimization delivering +$1.20/ton revenue improvement',
      'EnvScanner tracking 4 upcoming regulatory changes — impact assessments in progress',
      'Remediation tracking shows 3 sites on track for closure this quarter',
    ],
  };

  return recs[divisionId] || ['No specific recommendations at this time'];
}
