import { useState, useEffect, useCallback } from 'react';
import type { AgentDef, AgentActivity } from '../data/divisionAgents';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; requestId: string };
}

interface AgentsResponse {
  agents: (AgentDef & { lastActivity: string })[];
  total: number;
  divisions: string[];
}

interface AgentDetailResponse extends AgentDef {
  lastActivity: string;
  activities: AgentActivity[];
  uptime: string;
  tasksCompletedToday: number;
  avgResponseTimeMs: number;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  lastIncident: string;
  lastIncidentDate: string;
  services: Record<string, string>;
  latency: { p50: string; p95: string; p99: string };
  version: string;
  environment: string;
}

/* ── Fetch helper with fallback to static data ────────────────────────── */

async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: ApiEnvelope<T> = await res.json();
    return json.success ? json.data : null;
  } catch {
    // API not available (local dev without Vercel), return null to use fallback
    return null;
  }
}

/* ── useAgents: Fetch agent list, fall back to static data ────────────── */

export function useAgents(division?: string) {
  const [agents, setAgents] = useState<AgentDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = division ? `?division=${division}` : '';
      const data = await apiFetch<AgentsResponse>(`/api/agents${params}`);

      if (cancelled) return;

      if (data?.agents) {
        setAgents(data.agents);
        setFromApi(true);
      } else {
        // Fall back to static import
        const { getAgentsForDivision, getAllAgents } = await import('../data/divisionAgents');
        setAgents(division ? getAgentsForDivision(division) : getAllAgents());
        setFromApi(false);
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [division]);

  return { agents, loading, fromApi };
}

/* ── useAgentDetail: Fetch single agent detail ────────────────────────── */

export function useAgentDetail(agentId: string | null) {
  const [detail, setDetail] = useState<AgentDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agentId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      const data = await apiFetch<AgentDetailResponse>(`/api/agents/${agentId}`);
      if (cancelled) return;
      setDetail(data);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [agentId]);

  return { detail, loading };
}

/* ── useHealthCheck: Ping health endpoint ─────────────────────────────── */

export function useHealthCheck(intervalMs: number = 30000) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthy, setHealthy] = useState(true);

  const check = useCallback(async () => {
    const data = await apiFetch<HealthResponse>('/api/health');
    if (data) {
      setHealth(data);
      setHealthy(data.status === 'healthy');
    } else {
      setHealthy(false);
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [check, intervalMs]);

  return { health, healthy };
}
