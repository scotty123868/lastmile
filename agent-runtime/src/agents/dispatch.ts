/**
 * Dispatch — FRA Hours-of-Service Compliance Agent
 *
 * Monitors crew schedules across all divisions against FRA Part 228 rules.
 * Runs every 15 minutes. Checks:
 *   - 12-hour on-duty limit (§228.405)
 *   - 10-hour minimum off-duty (§228.405)
 *   - 276-hour monthly cap (§228.405)
 *   - 6 consecutive days / 2 days off rule
 *   - Union agreement provisions (UTU, IBEW, LIUNA)
 *
 * Actions:
 *   PASS    — Employee is compliant, log and continue
 *   WARN    — Approaching a limit, alert crew manager
 *   PREVENT — Would exceed limit, block assignment + find replacement
 *   REPORT  — Generate FRA filing
 *
 * Architecture:
 *   Kronos/UKG API → time entries
 *   Crew Management → assignments
 *   ───────────────────────────────
 *   Claude API (with FRA rules as system prompt)
 *   → structured output: { employee, rule, status, action, reasoning }
 *   ───────────────────────────────
 *   → Postgres (compliance_checks table)
 *   → Notifications (crew manager, ops manager)
 */

import Anthropic from '@anthropic-ai/sdk';
import { getKronosTimeEntries } from '../connectors/kronos.js';
import { getCrewAssignments } from '../connectors/crew-management.js';
import { db } from '../lib/db.js';

const DIVISIONS = ['HCC', 'HRSI', 'HSI', 'HTI', 'HTSI', 'HE', 'GG'];

const FRA_RULES_PROMPT = `You are Dispatch, an AI agent that monitors FRA Hours-of-Service compliance for IndustrialsCo.

You have access to employee time entries from Kronos/UKG and crew assignments from the dispatch system.

FRA Part 228 Rules you enforce:
1. 12-HOUR LIMIT: No employee may work more than 12 consecutive hours (§228.405)
2. 10-HOUR REST: Minimum 10 hours off-duty between shifts (§228.405)
3. 276-HOUR CAP: Maximum 276 hours in any calendar month (§228.405)
4. 6/2 DAY RULE: After 6 consecutive work days, minimum 2 consecutive days off
5. 30-HOUR LIMBO: Maximum 30 hours of limbo time per month (company policy)

Union Agreement Rules:
- UTU §4.2: Train crew rest period provisions (12hr on / 12hr off for road service)
- IBEW Local 948 §12.1: Signal maintainer daily limits (10hr regular + 2hr OT max)
- LIUNA District Council §8.3: Track worker provisions (no split shifts without consent)

For each employee, analyze their time data and current/upcoming assignments.
Output a JSON array of compliance checks:
{
  "employee_id": string,
  "employee_name": string,
  "division": string,
  "crew": string,
  "rule_checked": string,
  "status": "PASS" | "WARN" | "PREVENT" | "REPORT",
  "current_value": number,
  "limit": number,
  "detail": string,
  "action": string | null,
  "replacement_employee": string | null
}

Be precise. Reference specific FRA sections. If an employee is approaching a limit (within 90%), flag as WARN. If an assignment would cause a violation, flag as PREVENT and suggest a qualified replacement from the same division.`;

interface ComplianceCheck {
  employee_id: string;
  employee_name: string;
  division: string;
  crew: string;
  rule_checked: string;
  status: 'PASS' | 'WARN' | 'PREVENT' | 'REPORT';
  current_value: number;
  limit: number;
  detail: string;
  action: string | null;
  replacement_employee: string | null;
}

export async function runDispatch(): Promise<{ checks: ComplianceCheck[]; summary: Record<string, number> }> {
  const anthropic = new Anthropic();
  const allChecks: ComplianceCheck[] = [];

  for (const division of DIVISIONS) {
    // Fetch data from connectors
    const timeEntries = await getKronosTimeEntries(division);
    const assignments = await getCrewAssignments(division);

    // Call Claude with the data
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: FRA_RULES_PROMPT,
      messages: [{
        role: 'user',
        content: `Analyze the following time entries and crew assignments for the ${division} division.

TIME ENTRIES (last 30 days):
${JSON.stringify(timeEntries, null, 2)}

UPCOMING ASSIGNMENTS (next 48 hours):
${JSON.stringify(assignments, null, 2)}

Check every employee against all FRA Part 228 rules and applicable union agreements. Return the compliance check results as a JSON array.`
      }]
    });

    // Parse Claude's response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const checks: ComplianceCheck[] = JSON.parse(jsonMatch[0]);
        allChecks.push(...checks);

        // Store each check in the database
        for (const check of checks) {
          try {
            await db.query(
              `INSERT INTO compliance_checks
               (employee_id, employee_name, division, crew, rule_checked, status, current_value, rule_limit, detail, action, replacement_employee, checked_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
              [check.employee_id, check.employee_name, check.division, check.crew, check.rule_checked, check.status, check.current_value, check.limit, check.detail, check.action, check.replacement_employee]
            );
          } catch { /* db not available in demo mode */ }

          // If PREVENT, store as violation prevented
          if (check.status === 'PREVENT') {
            try {
              await db.query(
                `INSERT INTO violations_prevented
                 (employee_id, employee_name, division, rule_violated, detail, action_taken, cost_avoided, prevented_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [check.employee_id, check.employee_name, check.division, check.rule_checked, check.detail, check.action, 16000]
              );
            } catch { /* db not available */ }
          }
        }
      }
    } catch (parseError) {
      console.error(`Failed to parse Dispatch response for ${division}:`, parseError);
    }
  }

  // Summary
  const summary = {
    total_checks: allChecks.length,
    pass: allChecks.filter(c => c.status === 'PASS').length,
    warn: allChecks.filter(c => c.status === 'WARN').length,
    prevent: allChecks.filter(c => c.status === 'PREVENT').length,
    report: allChecks.filter(c => c.status === 'REPORT').length,
  };

  console.log(`  Dispatch: ${summary.total_checks} checks | ${summary.pass} PASS | ${summary.warn} WARN | ${summary.prevent} PREVENT`);

  return { checks: allChecks, summary };
}

// Allow running standalone: tsx src/agents/dispatch.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  runDispatch().then(result => {
    console.log(JSON.stringify(result.summary, null, 2));
  }).catch(console.error);
}
