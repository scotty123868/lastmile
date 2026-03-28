import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allAgents, divisionMeta, envelope, errorEnvelope } from '../_agentData';

/**
 * GET /api/config/divisions — Division configuration (admin view).
 * Returns all divisions with metadata, agent counts, enabled features.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const divisionConfigs = Object.entries(divisionMeta).map(([id, meta]) => {
    const agents = allAgents.filter(a => a.division === id);
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const runningAgents = agents.filter(a => a.status === 'running').length;

    // Division-specific features
    const features: Record<string, { label: string; enabled: boolean; description: string }[]> = {
      shared: [
        { label: 'Personal AI Assistant', enabled: true, description: 'Per-user AI assistant for natural language queries' },
        { label: 'Executive Briefings', enabled: true, description: 'Automated daily briefings for leadership' },
        { label: 'License Auditing', enabled: true, description: 'SaaS license waste detection and optimization' },
        { label: 'Meeting Intelligence', enabled: true, description: 'Transcript generation and action item extraction' },
        { label: 'Communications Monitoring', enabled: true, description: 'Safety and compliance keyword monitoring' },
      ],
      hcc: [
        { label: 'HOS Compliance', enabled: true, description: 'Real-time Hours-of-Service monitoring across all crews' },
        { label: 'Equipment Dispatch', enabled: true, description: 'AI-optimized equipment and crew assignment' },
        { label: 'Bid Estimation', enabled: true, description: 'Historical data analysis for project bid accuracy' },
        { label: 'Fleet GPS Tracking', enabled: true, description: 'Real-time fleet utilization and route optimization' },
        { label: 'Weather Delay Prediction', enabled: true, description: 'Hyperlocal weather impact on project schedules' },
        { label: 'Batch Plant Monitoring', enabled: true, description: 'Concrete quality monitoring in real time' },
      ],
      hrsi: [
        { label: 'Track Defect Prediction', enabled: true, description: 'AI-powered track defect early warning system' },
        { label: 'Predictive Maintenance', enabled: true, description: 'Sensor-based equipment failure prediction' },
        { label: 'Parts Inventory Optimization', enabled: true, description: 'Demand forecasting for parts warehouses' },
        { label: 'Tamping Scheduler', enabled: true, description: 'Track window and crew coordination' },
        { label: 'Geometry Car Analysis', enabled: true, description: 'Automated track geometry exception reporting' },
      ],
      hsi: [
        { label: 'AI Rail Inspection', enabled: true, description: 'Real-time ultrasonic flaw detection' },
        { label: 'Testing Schedule Optimization', enabled: true, description: 'Network-wide testing schedule optimization' },
        { label: 'Equipment Calibration', enabled: true, description: 'NIST/FRA calibration compliance tracking' },
        { label: 'Emissions Tracking', enabled: true, description: 'Operations-wide emissions monitoring' },
        { label: 'Waste Stream Optimization', enabled: true, description: 'Waste diversion and manifesting' },
      ],
      hti: [
        { label: 'Signal System Monitoring', enabled: true, description: 'Real-time railroad signal health monitoring' },
        { label: 'PTC Installation Tracking', enabled: true, description: 'Multi-railroad PTC project tracking' },
        { label: 'FRA Signal Compliance', enabled: true, description: 'Automated compliance reporting' },
        { label: 'Patent Monitoring', enabled: true, description: 'Signaling technology patent landscape tracking' },
        { label: 'Tech Transfer', enabled: true, description: 'Cross-division technology opportunity identification' },
      ],
      htsi: [
        { label: 'Transit Schedule Optimization', enabled: true, description: 'Real-time schedule adjustment and delay prediction' },
        { label: 'Crew Rostering', enabled: true, description: 'Union-compliant crew scheduling optimization' },
        { label: 'Ridership Forecasting', enabled: true, description: 'Demand prediction across transit routes' },
        { label: 'Fare Revenue Optimization', enabled: true, description: 'Dynamic pricing and fare evasion detection' },
        { label: 'ADA Compliance', enabled: true, description: 'Station and vehicle ADA monitoring' },
        { label: 'Fleet Electrification', enabled: false, description: 'Electric fleet transition tracking (quarterly)' },
      ],
      he: [
        { label: 'Asset Health Monitoring', enabled: true, description: 'Energy infrastructure predictive analytics' },
        { label: 'Environmental Permits', enabled: true, description: 'Permit lifecycle and renewal tracking' },
        { label: 'M&A Due Diligence', enabled: true, description: 'AI-powered data room analysis' },
        { label: 'Portfolio Performance', enabled: true, description: 'Cross-division financial KPI tracking' },
        { label: 'Board Report Automation', enabled: true, description: 'Automated board-ready report compilation' },
      ],
      gg: [
        { label: 'Remediation Tracking', enabled: true, description: 'Environmental cleanup progress monitoring' },
        { label: 'Environmental Compliance', enabled: true, description: 'Sensor monitoring and regulatory compliance' },
        { label: 'Quarry Yield Optimization', enabled: true, description: 'Blast pattern and crusher optimization' },
        { label: 'Environmental Scanning', enabled: true, description: 'Regulatory change monitoring' },
        { label: 'Fleet Maintenance Prediction', enabled: true, description: 'Telematics-based maintenance forecasting' },
      ],
    };

    const divisionFeatures = features[id] || [];
    const enabledFeatures = divisionFeatures.filter(f => f.enabled).length;

    return {
      id,
      name: meta.name,
      accent: meta.accent,
      agents: {
        total: agents.length,
        active: activeAgents,
        running: runningAgents,
        paused: agents.filter(a => a.status === 'paused').length,
        list: agents.map(a => ({ id: a.id, name: a.name, status: a.status, category: a.category })),
      },
      features: divisionFeatures,
      featureSummary: {
        total: divisionFeatures.length,
        enabled: enabledFeatures,
        disabled: divisionFeatures.length - enabledFeatures,
      },
      settings: {
        alertsEnabled: true,
        autoRemediation: id !== 'gg',
        dataRetentionDays: 90,
        complianceMode: ['hcc', 'hrsi', 'hsi', 'htsi'].includes(id) ? 'FRA' : 'standard',
      },
    };
  });

  return res.status(200).json(envelope({
    divisions: divisionConfigs,
    platformSummary: {
      totalDivisions: divisionConfigs.length,
      totalAgents: allAgents.length,
      totalFeatures: divisionConfigs.reduce((s, d) => s + d.featureSummary.total, 0),
      enabledFeatures: divisionConfigs.reduce((s, d) => s + d.featureSummary.enabled, 0),
    },
  }));
}
