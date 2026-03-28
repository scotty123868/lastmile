import { useState, useEffect, useCallback, useRef } from 'react';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; requestId: string; version: string };
}

export interface FleetStatus {
  fleet: {
    totalAgentTypes: number;
    totalInstances: number;
    tasksToday: number;
    tasksThisWeek: number;
    fleetUptime: string;
    fleetUptimeNumeric: number;
    alertsActive: number;
    alertsCritical: number;
    lastDeployment: string;
    avgResponseTimeMs: number;
    p95ResponseTimeMs: number;
  };
  divisions: {
    id: string;
    name: string;
    accent: string;
    agentTypes: number;
    activeInstances: number;
    runningInstances: number;
    tasksToday: number;
    uptime: number;
    alertsActive: number;
  }[];
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  division: string;
  divisionName: string;
  action: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ActivityFeed {
  activities: ActivityItem[];
  count: number;
  oldestTimestamp: string | null;
  newestTimestamp: string | null;
}

export interface AnalyticsSummary {
  tasksByHour: { hour: string; tasks: number; errors: number }[];
  tasksByCategory: { category: string; count: number; percentage: number; agentCount: number }[];
  tasksByDivision: { division: string; divisionName: string; count: number; agentCount: number; percentage: number }[];
  totals: { tasks24h: number; errors24h: number; errorRate: string; errorRateNumeric: number };
  performance: { avgResponseTimeMs: number; p50ResponseTimeMs: number; p95ResponseTimeMs: number; p99ResponseTimeMs: number; throughputPerMinute: number };
  agents: { total: number; active: number; running: number; paused: number };
}

export interface AnalyticsTrends {
  weeklyVolume: { week: string; weekLabel: string; tasks: number; errors: number }[];
  adoptionCurve: { week: string; agentsDeployed: number; divisionsActive: number }[];
  costSavings: { week: string; weeklySavings: number; cumulative: number }[];
  keyMetrics: {
    totalTasksAllTime: number;
    weekOverWeekGrowth: string;
    totalCostSavings: number;
    totalCostSavingsFormatted: string;
    currentAgents: number;
    currentDivisions: number;
    avgErrorRate: string;
  };
}

export interface IntegrationSystem {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  lastSyncAgo: string;
  recordsProcessed: number;
  latencyMs: number;
  division: string;
  version: string;
  authMethod: string;
}

export interface IntegrationsData {
  systems: IntegrationSystem[];
  summary: {
    total: number;
    connected: number;
    degraded: number;
    disconnected: number;
    overallHealth: string;
    totalRecordsProcessed: number;
    avgLatencyMs: number;
  };
}

export interface AlertData {
  active: {
    id: string;
    severity: string;
    title: string;
    description: string;
    agentId: string;
    agentName: string;
    division: string;
    divisionName: string;
    createdAt: string;
    acknowledgedBy: string | null;
    status: string;
  }[];
  activeCount: number;
  criticalCount: number;
  history: {
    last30Days: { totalAlerts: number; critical: number; warning: number; info: number; mttr: string };
    last7Days: { totalAlerts: number; critical: number; warning: number; info: number };
  };
}

/* ── Fetch helper ──────────────────────────────────────────────────────── */

async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: ApiEnvelope<T> = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

/* ── useFleetStatus ────────────────────────────────────────────────────── */

export function useFleetStatus(intervalMs = 15000) {
  const [data, setData] = useState<FleetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const result = await apiFetch<FleetStatus>('/api/fleet-status');
    if (result) {
      setData(result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading };
}

/* ── useActivityFeed ───────────────────────────────────────────────────── */

export function useActivityFeed(division?: string, pollIntervalMs = 10000) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastTimestamp = useRef<string | null>(null);

  const fetchFeed = useCallback(async () => {
    let url = '/api/activity-feed?limit=50';
    if (division) url += `&division=${division}`;
    if (lastTimestamp.current) url += `&since=${encodeURIComponent(lastTimestamp.current)}`;

    const result = await apiFetch<ActivityFeed>(url);
    if (result) {
      if (lastTimestamp.current && result.activities.length > 0) {
        // Merge new activities at top
        setActivities(prev => {
          const ids = new Set(prev.map(a => a.id));
          const newItems = result.activities.filter(a => !ids.has(a.id));
          return [...newItems, ...prev].slice(0, 100);
        });
      } else {
        setActivities(result.activities);
      }
      if (result.newestTimestamp) {
        lastTimestamp.current = result.newestTimestamp;
      }
      setLoading(false);
    }
  }, [division]);

  useEffect(() => {
    lastTimestamp.current = null;
    setActivities([]);
    setLoading(true);
    fetchFeed();
    const id = setInterval(fetchFeed, pollIntervalMs);
    return () => clearInterval(id);
  }, [fetchFeed, pollIntervalMs]);

  return { activities, loading };
}

/* ── useAnalyticsSummary ───────────────────────────────────────────────── */

export function useAnalyticsSummary() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await apiFetch<AnalyticsSummary>('/api/analytics/summary');
      if (!cancelled && result) {
        setData(result);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ── useAnalyticsTrends ────────────────────────────────────────────────── */

export function useAnalyticsTrends() {
  const [data, setData] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await apiFetch<AnalyticsTrends>('/api/analytics/trends');
      if (!cancelled && result) {
        setData(result);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ── useIntegrations ───────────────────────────────────────────────────── */

export function useIntegrations(intervalMs = 30000) {
  const [data, setData] = useState<IntegrationsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const result = await apiFetch<IntegrationsData>('/api/integrations');
    if (result) {
      setData(result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading };
}

/* ── useAlerts ─────────────────────────────────────────────────────────── */

export function useAlerts(intervalMs = 20000) {
  const [data, setData] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const result = await apiFetch<AlertData>('/api/alerts');
    if (result) {
      setData(result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading };
}

/* ── useSSEEvents ──────────────────────────────────────────────────────── */

export function useSSEEvents(maxEvents = 20) {
  const [events, setEvents] = useState<ActivityItem[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let source: EventSource | null = null;

    try {
      source = new EventSource('/api/ws-simulate');

      source.addEventListener('connected', () => {
        setConnected(true);
      });

      source.addEventListener('agent-event', (e: MessageEvent) => {
        try {
          const event: ActivityItem = JSON.parse(e.data);
          setEvents(prev => [event, ...prev].slice(0, maxEvents));
        } catch {
          // ignore parse errors
        }
      });

      source.addEventListener('done', () => {
        setConnected(false);
        source?.close();
      });

      source.onerror = () => {
        setConnected(false);
      };
    } catch {
      // SSE not available
    }

    return () => {
      source?.close();
      setConnected(false);
    };
  }, [maxEvents]);

  return { events, connected };
}
