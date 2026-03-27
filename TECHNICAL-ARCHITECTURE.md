# UpSkiller AI — Technical Architecture

## Overview

UpSkiller AI deploys and monitors AI agents that do real work inside an organization.
The platform has three layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  Command Center (assessment)  │  Last Mile (operations)        │
│  React + Vite + Tailwind      │  React + Vite + Tailwind       │
│  Deployed on Vercel            │  Deployed on Vercel            │
└─────────────────────┬─────────┴──────────┬─────────────────────┘
                      │                    │
┌─────────────────────▼────────────────────▼─────────────────────┐
│                    AGENT RUNTIME                                │
│  Node.js server on Railway/Fly.io                              │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Dispatch  │ │  Scout   │ │ Ledger   │ │Estimator │          │
│  │ (HOS)    │ │ (Track)  │ │(License) │ │ (Bids)   │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │             │            │             │                │
│  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐          │
│  │Qmaster   │ │  Chief   │ │  Relay   │ │ Signal   │          │
│  │(Procure) │ │ (Brief)  │ │(Meeting) │ │(Comms)   │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │             │            │             │                │
│  ┌────▼──────────────────────────────────────────────┐         │
│  │              Atlas (Personal Assistant)             │         │
│  │        Per-user instances, on-demand queries        │         │
│  └────────────────────────┬──────────────────────────┘         │
│                           │                                     │
│  Each agent = Claude API call with:                             │
│  • System prompt (role + rules + output format)                 │
│  • MCP tools (data connectors as tool_use)                     │
│  • Structured output (JSON → dashboard + notifications)        │
│  • Human-in-loop gate (for PREVENT/BLOCK actions)              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    DATA LAYER                                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  MCP Server (runs on client network or cloud)         │       │
│  │                                                        │       │
│  │  Connectors:                                           │       │
│  │  ├── SAP ERP (RFC/BAPI → work orders, financials)     │       │
│  │  ├── Primavera P6 (REST API → projects, schedules)    │       │
│  │  ├── Kronos/UKG (REST API → time, attendance)         │       │
│  │  ├── Azure AD (Graph API → users, licenses)           │       │
│  │  ├── GPS Fleet (Trimble API → vehicle positions)      │       │
│  │  ├── PTC Signal (telemetry feed → signal status)      │       │
│  │  ├── FRA Database (compliance records)                 │       │
│  │  ├── Email (Microsoft 365 / Google Workspace API)     │       │
│  │  └── Calendar (same API → meetings, schedules)        │       │
│  │                                                        │       │
│  │  All connections are READ-ONLY                         │       │
│  │  Data is cached locally (Postgres) for fast queries    │       │
│  │  Sync frequency: real-time (Kronos), 5-min (SAP),     │       │
│  │                   daily (Primavera), weekly (licenses) │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Postgres Database (Supabase / Neon)                   │       │
│  │                                                        │       │
│  │  Tables:                                               │       │
│  │  • agent_runs (agent_id, timestamp, input, output)     │       │
│  │  • compliance_checks (employee, rule, status, action)  │       │
│  │  • violations_prevented (detail, cost_avoided, review) │       │
│  │  • context_windows (user, role, sources, freshness)    │       │
│  │  • user_queries (user, query, response, tokens, time)  │       │
│  │  • sync_status (connector, last_sync, records, errors) │       │
│  │  • agent_config (agent, version, rules, thresholds)    │       │
│  └──────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

## Deployment Timeline

### Week 1: Foundation
| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1-2 | Agent runtime server setup | Engineering | Node.js on Railway, cron scheduler, Claude API integration |
| 2-3 | Postgres schema + seed data | Engineering | Database tables, migration scripts |
| 3-4 | First MCP connector (Kronos/UKG) | Engineering | Read-only time/attendance data flowing |
| 4-5 | Dispatch agent v1 | Engineering | HOS compliance checking on real Kronos data |

### Week 2: Expansion
| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1-2 | SAP + Azure AD connectors | Engineering | License + financial data flowing |
| 2-3 | Ledger + Chief agents | Engineering | License scanning + daily briefing |
| 3-4 | Atlas personal assistant v1 | Engineering | On-demand query answering |
| 4-5 | Dashboard connected to real DB | Engineering | Live data in Command Center + Last Mile |

### Week 3: Polish + Handoff
| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1-2 | Remaining connectors (P6, GPS, PTC) | Engineering | Full data coverage |
| 3-4 | All 9 agents operational | Engineering | Full agent roster live |
| 5   | Security audit + documentation | Engineering | SOC 2 readiness checklist |

## Cost Structure

### Infrastructure
| Component | Monthly Cost |
|-----------|-------------|
| Railway/Fly.io (agent runtime) | $50-100 |
| Supabase (Postgres) | $25 |
| Vercel (dashboard hosting) | $20 |
| Claude API (9 agents, ~2M tokens/day) | $300-600 |
| **Total infrastructure** | **$400-750/month** |

### Human Resources (to deploy)
| Role | Time | Cost |
|------|------|------|
| Senior engineer (connectors + agents) | 3 weeks | — |
| Client IT liaison (access + credentials) | 5 hours | — |

## Security Architecture

### Data Handling
- All MCP connections are READ-ONLY (no write access to client systems)
- Data cached in UpSkiller's Postgres (encrypted at rest, TLS in transit)
- Agent outputs stored with full audit trail
- Client can revoke API credentials at any time → agents stop immediately

### Access Control
- Role-based access: CEO sees all divisions, division heads see their division only
- Atlas personal assistant scoped to user's role and division
- Agent PREVENT actions require human approval before execution
- All agent decisions logged with reasoning chain for compliance auditing

### Compliance
- FRA Part 228 rules engine auto-updates with regulatory changes
- All compliance decisions auditable (who, when, what rule, what data)
- Monthly compliance reports auto-generated for FRA submission
- SOC 2 Type II readiness (logging, access control, encryption, monitoring)

## What Herzog Provides
1. Read-only API credentials for: Kronos/UKG, SAP ERP, Azure AD
2. IT contact for firewall/VPN configuration (if on-premise systems)
3. Union agreement documents (UTU, IBEW, LIUNA) for compliance rules
4. List of systems to prioritize (recommended: Kronos first, then SAP)
5. Org chart with division structure (for role-based access setup)

## What We Provide
1. The platform (Command Center + Last Mile dashboards)
2. MCP server configured for their systems
3. 9 AI agents configured for their operations
4. Ongoing monitoring and agent improvement
5. Monthly performance reports
6. Direct Slack/email support channel
