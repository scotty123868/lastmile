/**
 * Crew Management System Connector
 *
 * Wraps the client's crew/dispatch management system.
 * Re-exports from Kronos connector since crew assignments
 * come from the same workforce management platform at IndustrialsCo.
 *
 * In larger deployments, this might connect to a separate
 * dispatch system (e.g., RailComm, TMDS, or a custom system).
 */

export { getCrewAssignments } from './kronos.js';
