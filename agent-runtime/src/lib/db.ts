/**
 * Database connection — Postgres via pg
 *
 * In production: connects to Supabase/Neon Postgres
 * In demo mode: all queries are no-ops that log to console
 */

import pg from 'pg';

const { Pool } = pg;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

export const db = {
  async query(text: string, params?: unknown[]) {
    if (pool) {
      return pool.query(text, params);
    }
    // Demo mode — no database, just pass through
    return { rows: [], rowCount: 0 };
  }
};
