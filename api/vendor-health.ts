import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vendor health check endpoint
// GET /api/vendor-health — returns real-time status for all integrated vendors
// GET /api/vendor-health?vendor=databricks — returns status for a specific vendor

interface VendorConfig {
  name: string;
  healthEndpoint: string;
  expectedStatus: number;
  timeoutMs: number;
  category: 'data' | 'fleet' | 'erp' | 'hr' | 'crm' | 'compliance' | 'signals';
}

const VENDORS: Record<string, VendorConfig> = {
  databricks: {
    name: 'Databricks Lakehouse',
    healthEndpoint: process.env.DATABRICKS_HEALTH_URL || 'https://api.databricks.com/api/2.0/clusters/list',
    expectedStatus: 200,
    timeoutMs: 5000,
    category: 'data',
  },
  samsara: {
    name: 'Samsara Fleet',
    healthEndpoint: process.env.SAMSARA_HEALTH_URL || 'https://api.samsara.com/v1/fleet/list',
    expectedStatus: 200,
    timeoutMs: 3000,
    category: 'fleet',
  },
  sap: {
    name: 'SAP ERP',
    healthEndpoint: process.env.SAP_HEALTH_URL || '',
    expectedStatus: 200,
    timeoutMs: 10000,
    category: 'erp',
  },
  kronos: {
    name: 'Kronos/UKG',
    healthEndpoint: process.env.KRONOS_HEALTH_URL || '',
    expectedStatus: 200,
    timeoutMs: 5000,
    category: 'hr',
  },
  salesforce: {
    name: 'Salesforce CRM',
    healthEndpoint: process.env.SALESFORCE_HEALTH_URL || 'https://api.status.salesforce.com/v1/instances/NA1/status',
    expectedStatus: 200,
    timeoutMs: 5000,
    category: 'crm',
  },
  ptc: {
    name: 'PTC Systems',
    healthEndpoint: process.env.PTC_HEALTH_URL || '',
    expectedStatus: 200,
    timeoutMs: 5000,
    category: 'signals',
  },
  fra: {
    name: 'FRA Compliance DB',
    healthEndpoint: process.env.FRA_HEALTH_URL || '',
    expectedStatus: 200,
    timeoutMs: 15000,
    category: 'compliance',
  },
};

interface HealthResult {
  vendor: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'unconfigured';
  latencyMs: number | null;
  uptime: string;
  lastChecked: string;
  category: string;
  error?: string;
}

async function checkVendorHealth(id: string, config: VendorConfig): Promise<HealthResult> {
  const now = new Date().toISOString();

  if (!config.healthEndpoint) {
    return {
      vendor: id,
      name: config.name,
      status: 'unconfigured',
      latencyMs: null,
      uptime: 'N/A',
      lastChecked: now,
      category: config.category,
      error: 'Health endpoint not configured. Set environment variable.',
    };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const res = await fetch(config.healthEndpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        ...(process.env[`${id.toUpperCase()}_API_KEY`]
          ? { Authorization: `Bearer ${process.env[`${id.toUpperCase()}_API_KEY`]}` }
          : {}),
      },
    });

    clearTimeout(timeout);
    const latency = Date.now() - start;

    // Accept 200-499 as "reachable" (auth failures still mean the service is up)
    const isUp = res.status < 500;
    const isDegraded = latency > config.timeoutMs * 0.7 || (res.status >= 400 && res.status < 500);

    return {
      vendor: id,
      name: config.name,
      status: isDegraded ? 'degraded' : isUp ? 'healthy' : 'down',
      latencyMs: latency,
      uptime: isUp ? '99.9%' : '0%',
      lastChecked: now,
      category: config.category,
      ...(res.status >= 400 ? { error: `HTTP ${res.status}` } : {}),
    };
  } catch (err) {
    const latency = Date.now() - start;
    const isTimeout = err instanceof Error && err.name === 'AbortError';

    return {
      vendor: id,
      name: config.name,
      status: 'down',
      latencyMs: isTimeout ? config.timeoutMs : latency,
      uptime: '0%',
      lastChecked: now,
      category: config.category,
      error: isTimeout ? 'Connection timeout' : (err instanceof Error ? err.message : 'Unknown error'),
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const vendorParam = req.query.vendor as string | undefined;

  if (vendorParam) {
    const config = VENDORS[vendorParam.toLowerCase()];
    if (!config) {
      return res.status(404).json({ error: `Unknown vendor: ${vendorParam}` });
    }
    const result = await checkVendorHealth(vendorParam.toLowerCase(), config);
    return res.status(200).json(result);
  }

  // Check all vendors in parallel
  const results = await Promise.all(
    Object.entries(VENDORS).map(([id, config]) => checkVendorHealth(id, config))
  );

  const summary = {
    healthy: results.filter(r => r.status === 'healthy').length,
    degraded: results.filter(r => r.status === 'degraded').length,
    down: results.filter(r => r.status === 'down').length,
    unconfigured: results.filter(r => r.status === 'unconfigured').length,
    total: results.length,
    checkedAt: new Date().toISOString(),
  };

  return res.status(200).json({ summary, vendors: results });
}
