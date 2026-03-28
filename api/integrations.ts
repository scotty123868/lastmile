import type { VercelRequest, VercelResponse } from '@vercel/node';
import { envelope, errorEnvelope } from './_agentData';

/**
 * GET /api/integrations — Connected enterprise systems status.
 */

interface IntegrationSystem {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  lastSyncAgo: string;
  recordsProcessed: number;
  latencyMs: number;
  division: string | 'shared';
  version: string;
  authMethod: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json(errorEnvelope('Method not allowed', 405));

  const now = Date.now();
  const minAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString();
  const hrAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

  const systems: IntegrationSystem[] = [
    {
      id: 'sap-erp',
      name: 'SAP S/4HANA',
      category: 'ERP',
      status: 'connected',
      lastSync: minAgo(3),
      lastSyncAgo: '3 min ago',
      recordsProcessed: 24847,
      latencyMs: 142,
      division: 'shared',
      version: '2023 FPS02',
      authMethod: 'OAuth 2.0 / Service Account',
    },
    {
      id: 'kronos-ukg',
      name: 'UKG Pro (Kronos)',
      category: 'Workforce Management',
      status: 'connected',
      lastSync: minAgo(7),
      lastSyncAgo: '7 min ago',
      recordsProcessed: 84200,
      latencyMs: 89,
      division: 'shared',
      version: 'UKG Pro 2024.1',
      authMethod: 'API Key + SAML',
    },
    {
      id: 'primavera-p6',
      name: 'Primavera P6 EPPM',
      category: 'Project Controls',
      status: 'connected',
      lastSync: minAgo(12),
      lastSyncAgo: '12 min ago',
      recordsProcessed: 248000,
      latencyMs: 210,
      division: 'hcc',
      version: '22.12',
      authMethod: 'OAuth 2.0',
    },
    {
      id: 'procore',
      name: 'Procore',
      category: 'Construction Management',
      status: 'connected',
      lastSync: minAgo(5),
      lastSyncAgo: '5 min ago',
      recordsProcessed: 142000,
      latencyMs: 156,
      division: 'hcc',
      version: 'API v1.1',
      authMethod: 'OAuth 2.0',
    },
    {
      id: 'hcss-heavyjob',
      name: 'HCSS HeavyJob',
      category: 'Field Operations',
      status: 'connected',
      lastSync: minAgo(2),
      lastSyncAgo: '2 min ago',
      recordsProcessed: 842000,
      latencyMs: 98,
      division: 'hcc',
      version: '14.2',
      authMethod: 'API Key',
    },
    {
      id: 'samsara',
      name: 'Samsara Fleet',
      category: 'Fleet Telematics',
      status: 'connected',
      lastSync: minAgo(1),
      lastSyncAgo: '1 min ago',
      recordsProcessed: 2400000,
      latencyMs: 67,
      division: 'hcc',
      version: 'API v2',
      authMethod: 'API Token',
    },
    {
      id: 'trimble-gps',
      name: 'Trimble GPS Fleet',
      category: 'Fleet Telematics',
      status: 'connected',
      lastSync: minAgo(1),
      lastSyncAgo: '1 min ago',
      recordsProcessed: 1420000,
      latencyMs: 72,
      division: 'hrsi',
      version: 'TM-3.8',
      authMethod: 'API Key',
    },
    {
      id: 'wabtec-ptc',
      name: 'Wabtec PTC Signal System',
      category: 'Positive Train Control',
      status: 'connected',
      lastSync: minAgo(4),
      lastSyncAgo: '4 min ago',
      recordsProcessed: 842000,
      latencyMs: 184,
      division: 'hti',
      version: 'I-ETMS v4.1',
      authMethod: 'Mutual TLS',
    },
    {
      id: 'fra-portal',
      name: 'FRA Safety Portal',
      category: 'Regulatory Compliance',
      status: 'connected',
      lastSync: hrAgo(4),
      lastSyncAgo: '4 hrs ago',
      recordsProcessed: 14800,
      latencyMs: 340,
      division: 'shared',
      version: 'RISPC v2',
      authMethod: 'Certificate Auth',
    },
    {
      id: 'sharepoint',
      name: 'SharePoint — Engineering Docs',
      category: 'Document Management',
      status: 'connected',
      lastSync: minAgo(18),
      lastSyncAgo: '18 min ago',
      recordsProcessed: 42000,
      latencyMs: 120,
      division: 'shared',
      version: 'Graph API v1.0',
      authMethod: 'Azure AD OAuth',
    },
    {
      id: 'weather-api',
      name: 'NOAA Weather API',
      category: 'Weather Intelligence',
      status: 'connected',
      lastSync: minAgo(15),
      lastSyncAgo: '15 min ago',
      recordsProcessed: 89000,
      latencyMs: 45,
      division: 'shared',
      version: 'v3',
      authMethod: 'API Key',
    },
    {
      id: 'concrete-batch',
      name: 'Command Alkon Batch',
      category: 'Concrete Batch Plant',
      status: 'degraded',
      lastSync: minAgo(45),
      lastSyncAgo: '45 min ago',
      recordsProcessed: 18400,
      latencyMs: 4200,
      division: 'hcc',
      version: 'COMMANDbatch 8.2',
      authMethod: 'API Key',
    },
    {
      id: 'transit-afc',
      name: 'Transit AFC System',
      category: 'Fare Collection',
      status: 'connected',
      lastSync: minAgo(2),
      lastSyncAgo: '2 min ago',
      recordsProcessed: 340000,
      latencyMs: 88,
      division: 'htsi',
      version: 'Cubic v4.2',
      authMethod: 'Mutual TLS',
    },
    {
      id: 'scada-energy',
      name: 'SCADA Energy Grid',
      category: 'Energy SCADA',
      status: 'connected',
      lastSync: minAgo(1),
      lastSyncAgo: '< 1 min ago',
      recordsProcessed: 1240000,
      latencyMs: 34,
      division: 'he',
      version: 'OSIsoft PI 2024',
      authMethod: 'Service Certificate',
    },
  ];

  const connected = systems.filter(s => s.status === 'connected').length;
  const degraded = systems.filter(s => s.status === 'degraded').length;
  const disconnected = systems.filter(s => s.status === 'disconnected').length;

  return res.status(200).json(envelope({
    systems,
    summary: {
      total: systems.length,
      connected,
      degraded,
      disconnected,
      overallHealth: disconnected === 0 && degraded <= 1 ? 'healthy' : 'degraded',
      totalRecordsProcessed: systems.reduce((s, sys) => s + sys.recordsProcessed, 0),
      avgLatencyMs: Math.round(systems.reduce((s, sys) => s + sys.latencyMs, 0) / systems.length),
    },
  }));
}
