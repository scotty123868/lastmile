-- UpSkiller AI Agent Runtime — Database Schema
-- Run against Postgres (Supabase / Neon / local)

-- Agent run history
CREATE TABLE IF NOT EXISTS agent_runs (
  id            BIGSERIAL PRIMARY KEY,
  agent_name    TEXT NOT NULL,
  started_at    TIMESTAMPTZ NOT NULL,
  completed_at  TIMESTAMPTZ DEFAULT NOW(),
  duration_ms   INTEGER,
  status        TEXT NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  result        JSONB,
  error         TEXT,
  tokens_used   INTEGER
);

CREATE INDEX idx_agent_runs_name ON agent_runs (agent_name);
CREATE INDEX idx_agent_runs_time ON agent_runs (started_at DESC);

-- HOS compliance checks (Dispatch agent)
CREATE TABLE IF NOT EXISTS compliance_checks (
  id                    BIGSERIAL PRIMARY KEY,
  employee_id           TEXT NOT NULL,
  employee_name         TEXT NOT NULL,
  division              TEXT NOT NULL,
  crew                  TEXT,
  rule_checked          TEXT NOT NULL,
  status                TEXT NOT NULL CHECK (status IN ('PASS', 'WARN', 'PREVENT', 'REPORT')),
  current_value         NUMERIC,
  rule_limit            NUMERIC,
  detail                TEXT,
  action                TEXT,
  replacement_employee  TEXT,
  checked_at            TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by           TEXT,
  reviewed_at           TIMESTAMPTZ
);

CREATE INDEX idx_compliance_division ON compliance_checks (division);
CREATE INDEX idx_compliance_status ON compliance_checks (status);
CREATE INDEX idx_compliance_employee ON compliance_checks (employee_id);

-- Violations that were prevented before they happened
CREATE TABLE IF NOT EXISTS violations_prevented (
  id                BIGSERIAL PRIMARY KEY,
  employee_id       TEXT NOT NULL,
  employee_name     TEXT NOT NULL,
  division          TEXT NOT NULL,
  rule_violated     TEXT NOT NULL,
  detail            TEXT NOT NULL,
  action_taken      TEXT NOT NULL,
  cost_avoided      NUMERIC NOT NULL DEFAULT 16000,
  prevented_at      TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by       TEXT,
  reviewed_at       TIMESTAMPTZ,
  approved          BOOLEAN
);

-- Context windows — what data each user's AI tools see
CREATE TABLE IF NOT EXISTS context_windows (
  id            BIGSERIAL PRIMARY KEY,
  user_id       TEXT NOT NULL,
  user_name     TEXT NOT NULL,
  role          TEXT NOT NULL,
  division      TEXT NOT NULL,
  sources       JSONB NOT NULL,       -- array of data source names
  token_count   INTEGER NOT NULL,
  freshness_sec INTEGER NOT NULL,     -- seconds since last refresh
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_context_user ON context_windows (user_id);

-- User queries to Atlas (personal assistant)
CREATE TABLE IF NOT EXISTS user_queries (
  id            BIGSERIAL PRIMARY KEY,
  user_id       TEXT NOT NULL,
  user_name     TEXT NOT NULL,
  division      TEXT NOT NULL,
  role          TEXT NOT NULL,
  query         TEXT NOT NULL,
  response      TEXT NOT NULL,
  sources_used  JSONB,
  tokens_used   INTEGER,
  response_ms   INTEGER,
  satisfaction  INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  queried_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queries_user ON user_queries (user_id);
CREATE INDEX idx_queries_time ON user_queries (queried_at DESC);

-- MCP connector sync status
CREATE TABLE IF NOT EXISTS sync_status (
  id            BIGSERIAL PRIMARY KEY,
  connector     TEXT NOT NULL UNIQUE,
  last_sync     TIMESTAMPTZ,
  records_synced INTEGER DEFAULT 0,
  errors        INTEGER DEFAULT 0,
  status        TEXT NOT NULL CHECK (status IN ('connected', 'syncing', 'error', 'disconnected')),
  config        JSONB
);

-- Agent configuration (version, rules, thresholds)
CREATE TABLE IF NOT EXISTS agent_config (
  id            BIGSERIAL PRIMARY KEY,
  agent_name    TEXT NOT NULL UNIQUE,
  version       TEXT NOT NULL,
  config        JSONB NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_by    TEXT
);

-- Seed initial agent configs
INSERT INTO agent_config (agent_name, version, config) VALUES
  ('Dispatch', '2.4.1', '{"check_interval_min": 15, "fra_rules": ["228.405_12hr", "228.405_10hr", "228.405_276hr", "6_2_day", "limbo_30hr"], "unions": ["UTU", "IBEW", "LIUNA"]}'),
  ('Scout', '1.2.0', '{"check_interval_hr": 2, "track_miles": 4200, "confidence_threshold": 0.85}'),
  ('Ledger', '1.1.0', '{"scan_day": "Monday", "platforms": 47, "min_inactive_days": 90}'),
  ('Estimator', '1.0.0', '{"check_time": "08:00", "accuracy_target": 0.08, "historical_years": 5}'),
  ('Quartermaster', '1.0.0', '{"check_interval_hr": 4, "duplicate_threshold": 0.85}'),
  ('Chief', '2.1.0', '{"briefing_time": "07:00", "recipient": "CEO", "sections": ["metrics", "compliance", "projects", "personnel"]}'),
  ('Relay', '1.3.0', '{"check_interval_hr": 1, "extract_actions": true, "track_commitments": true}'),
  ('Signal', '1.0.0', '{"check_interval_min": 30, "keywords": ["safety", "compliance", "FRA", "defect", "injury", "violation"]}'),
  ('Atlas', '3.0.0', '{"mode": "on_demand", "context_token_budget": 8192, "confidence_threshold": 0.80}')
ON CONFLICT (agent_name) DO NOTHING;

-- Seed MCP connector status
INSERT INTO sync_status (connector, status, last_sync, records_synced) VALUES
  ('Kronos/UKG', 'connected', NOW() - INTERVAL '2 minutes', 2800),
  ('SAP ERP', 'connected', NOW() - INTERVAL '5 minutes', 14200),
  ('Azure AD', 'connected', NOW() - INTERVAL '1 hour', 2800),
  ('Primavera P6', 'connected', NOW() - INTERVAL '24 hours', 847),
  ('Trimble GPS Fleet', 'connected', NOW() - INTERVAL '30 seconds', 340),
  ('PTC Signal Telemetry', 'connected', NOW() - INTERVAL '10 seconds', 12400),
  ('FRA Compliance DB', 'connected', NOW() - INTERVAL '7 days', 4200),
  ('Microsoft 365', 'connected', NOW() - INTERVAL '3 minutes', 1240),
  ('Calendar (Google/O365)', 'connected', NOW() - INTERVAL '5 minutes', 890)
ON CONFLICT (connector) DO NOTHING;
