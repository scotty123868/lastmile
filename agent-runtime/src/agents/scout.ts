/**
 * Agent stub — see dispatch.ts for the full implementation pattern.
 * Each agent follows the same architecture:
 *   1. Fetch data from MCP connectors
 *   2. Call Claude API with role-specific system prompt
 *   3. Parse structured output
 *   4. Store results in Postgres
 *   5. Trigger notifications if needed
 */

export async function runScout(): Promise<{ status: string }> {
  // In production: full Claude API call with MCP tools
  // For now: returns demo result
  return { status: 'ok' };
}
