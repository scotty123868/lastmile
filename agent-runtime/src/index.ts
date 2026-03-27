/**
 * UpSkiller AI Agent Runtime
 *
 * Orchestrates 9 AI agents that monitor and act on enterprise data.
 * Each agent is a Claude API call with MCP tool connections to client systems.
 *
 * Architecture:
 *   ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
 *   │  Scheduler   │────▶│  Agent Run    │────▶│  Store Result│
 *   │  (cron)      │     │  (Claude API) │     │  (Postgres)  │
 *   └─────────────┘     └──────────────┘     └──────────────┘
 */

import { CronJob } from 'cron';
import { config } from 'dotenv';
import { runDispatch } from './agents/dispatch.js';
import { runChief } from './agents/chief.js';
import { runLedger } from './agents/ledger.js';
import { runScout } from './agents/scout.js';
import { runEstimator } from './agents/estimator.js';
import { runQuartermaster } from './agents/quartermaster.js';
import { runRelay } from './agents/relay.js';
import { runSignal } from './agents/signal.js';
import { db } from './lib/db.js';

config();

// ── Agent Schedule ──────────────────────────────────────────────
// Each agent runs on its own cron schedule based on its purpose.
// Dispatch checks HOS compliance frequently (safety-critical).
// Chief generates the daily executive briefing once per morning.
// Atlas runs on-demand (not scheduled — triggered by user queries).

const agents = [
  { name: 'Dispatch',      cron: '*/15 * * * *',   run: runDispatch,      description: 'HOS Compliance Monitor — checks crew schedules against FRA Part 228' },
  { name: 'Scout',         cron: '0 */2 * * *',    run: runScout,         description: 'Track Defect Early Warning — analyzes geometry car data for trends' },
  { name: 'Ledger',        cron: '0 3 * * 1',      run: runLedger,        description: 'License Waste Scanner — weekly audit of software license utilization' },
  { name: 'Estimator',     cron: '0 8 * * 1-5',    run: runEstimator,     description: 'Project Bid Intelligence — validates cost estimates against historical data' },
  { name: 'Quartermaster', cron: '0 */4 * * 1-5',  run: runQuartermaster, description: 'Cross-Division Procurement — detects duplicate orders across divisions' },
  { name: 'Chief',         cron: '0 7 * * 1-5',    run: runChief,         description: 'Executive Briefing — generates daily summary for CEO at 7:00 AM' },
  { name: 'Relay',         cron: '0 * * * 1-5',    run: runRelay,         description: 'Meeting Intelligence — processes meeting transcripts hourly' },
  { name: 'Signal',        cron: '*/30 * * * *',   run: runSignal,        description: 'Communications Intelligence — monitors for safety/compliance mentions' },
];

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║         UpSkiller AI — Agent Runtime v0.1.0             ║');
  console.log('║         9 agents | Claude API + MCP connectors          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // Verify database connection
  try {
    await db.query('SELECT 1');
    console.log('✓ Database connected');
  } catch (e) {
    console.log('⚠ Database not available — running in demo mode (results logged to console only)');
  }

  // Verify Claude API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠ ANTHROPIC_API_KEY not set — running in dry-run mode');
  } else {
    console.log('✓ Claude API key configured');
  }

  console.log('');
  console.log('Scheduling agents:');

  // Schedule each agent
  for (const agent of agents) {
    const job = new CronJob(agent.cron, async () => {
      const start = Date.now();
      console.log(`[${new Date().toISOString()}] ▶ ${agent.name} starting...`);

      try {
        const result = await agent.run();
        const duration = Date.now() - start;

        console.log(`[${new Date().toISOString()}] ✓ ${agent.name} completed in ${duration}ms`);

        // Store result in database
        try {
          await db.query(
            `INSERT INTO agent_runs (agent_name, started_at, completed_at, duration_ms, status, result)
             VALUES ($1, $2, NOW(), $3, 'success', $4)`,
            [agent.name, new Date(start), duration, JSON.stringify(result)]
          );
        } catch {
          // Database not available — that's fine in demo mode
        }
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`[${new Date().toISOString()}] ✗ ${agent.name} failed after ${duration}ms:`, error);

        try {
          await db.query(
            `INSERT INTO agent_runs (agent_name, started_at, completed_at, duration_ms, status, error)
             VALUES ($1, $2, NOW(), $3, 'error', $4)`,
            [agent.name, new Date(start), duration, String(error)]
          );
        } catch {
          // Database not available
        }
      }
    });

    job.start();
    console.log(`  ⏰ ${agent.name.padEnd(14)} │ ${agent.cron.padEnd(16)} │ ${agent.description}`);
  }

  console.log('');
  console.log('Atlas (Personal Assistant) runs on-demand via API endpoint.');
  console.log('');
  console.log('All agents scheduled. Runtime is live.');
  console.log('Press Ctrl+C to stop.');
}

main().catch(console.error);
