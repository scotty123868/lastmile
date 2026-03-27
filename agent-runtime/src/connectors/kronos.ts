/**
 * Kronos/UKG Workforce Management Connector
 *
 * Connects to the client's Kronos/UKG instance via REST API to pull:
 * - Employee time entries (clock in/out, hours worked)
 * - Schedule assignments (upcoming shifts)
 * - Leave requests and approvals
 *
 * Connection: REST API over HTTPS
 * Auth: OAuth2 client credentials (service account, read-only)
 * Sync: Real-time (API calls on each agent run)
 *
 * In production:
 *   const response = await fetch(`${KRONOS_BASE_URL}/api/v1/timekeeping/timecard`, {
 *     headers: { Authorization: `Bearer ${token}` }
 *   });
 *
 * For the demo, returns realistic sample data matching Herzog's workforce.
 */

interface TimeEntry {
  employee_id: string;
  employee_name: string;
  division: string;
  crew: string;
  role: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  hours_worked: number;
  overtime: boolean;
  union: 'UTU' | 'IBEW' | 'LIUNA' | 'Non-Union';
}

interface CrewAssignment {
  employee_id: string;
  employee_name: string;
  division: string;
  crew: string;
  assignment_date: string;
  start_time: string;
  end_time: string;
  location: string;
  task: string;
}

// ── Demo Data Generator ────────────────────────────────────────
// Generates realistic time entries for Herzog employees.
// In production, this is replaced by actual Kronos API calls.

const DIVISIONS_DATA: Record<string, { employees: Array<{ id: string; name: string; crew: string; role: string; union: TimeEntry['union'] }> }> = {
  HCC: {
    employees: [
      { id: 'HCC-001', name: 'Kevin Nguyen', crew: 'Crew 3', role: 'Track Foreman', union: 'LIUNA' },
      { id: 'HCC-002', name: 'James Rodriguez', crew: 'Crew 7', role: 'Equipment Operator', union: 'LIUNA' },
      { id: 'HCC-003', name: 'Robert Chen', crew: 'Crew 1', role: 'Project Supervisor', union: 'Non-Union' },
      { id: 'HCC-004', name: 'Marcus Williams', crew: 'Crew 12', role: 'Ballast Operator', union: 'LIUNA' },
      { id: 'HCC-005', name: 'Daniel Martinez', crew: 'Crew 3', role: 'Track Laborer', union: 'LIUNA' },
    ]
  },
  HRSI: {
    employees: [
      { id: 'HRSI-001', name: 'Thomas Anderson', crew: 'Maint 2', role: 'Car Repair Mechanic', union: 'UTU' },
      { id: 'HRSI-002', name: 'William Park', crew: 'Maint 5', role: 'Locomotive Inspector', union: 'UTU' },
    ]
  },
  HSI: {
    employees: [
      { id: 'HSI-001', name: 'Sarah Chen', crew: 'Insp 1', role: 'Ultrasonic Inspector', union: 'Non-Union' },
      { id: 'HSI-002', name: 'Michael Torres', crew: 'Insp 3', role: 'Senior Rail Tester', union: 'Non-Union' },
    ]
  },
  HTI: {
    employees: [
      { id: 'HTI-001', name: 'David Kowalski', crew: 'Signal 2', role: 'Signal Maintainer', union: 'IBEW' },
      { id: 'HTI-002', name: 'Lisa Chang', crew: 'Signal 4', role: 'PTC Technician', union: 'IBEW' },
    ]
  },
  HTSI: {
    employees: [
      { id: 'HTSI-001', name: 'Maria Thompson', crew: 'Crew 12', role: 'Conductor', union: 'UTU' },
      { id: 'HTSI-002', name: 'Ryan Patel', crew: 'Crew 8', role: 'Engineer', union: 'UTU' },
    ]
  },
  HE: {
    employees: [
      { id: 'HE-001', name: 'Jennifer Walsh', crew: 'Energy 1', role: 'Project Manager', union: 'Non-Union' },
    ]
  },
  GG: {
    employees: [
      { id: 'GG-001', name: 'Alex Morrison', crew: 'Env 1', role: 'Environmental Specialist', union: 'Non-Union' },
    ]
  }
};

function generateTimeEntries(division: string, days: number = 30): TimeEntry[] {
  const divData = DIVISIONS_DATA[division];
  if (!divData) return [];

  const entries: TimeEntry[] = [];
  const now = new Date();

  for (const emp of divData.employees) {
    for (let d = 0; d < days; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);

      // Skip some days (weekends, days off)
      if (Math.random() < 0.25) continue;

      const shiftStart = 6 + Math.floor(Math.random() * 4); // 6-9 AM
      const shiftLength = 8 + Math.random() * 4; // 8-12 hours
      const overtime = shiftLength > 10;

      entries.push({
        employee_id: emp.id,
        employee_name: emp.name,
        division,
        crew: emp.crew,
        role: emp.role,
        date: date.toISOString().split('T')[0],
        clock_in: `${String(shiftStart).padStart(2, '0')}:00`,
        clock_out: `${String(Math.floor(shiftStart + shiftLength)).padStart(2, '0')}:${String(Math.floor((shiftLength % 1) * 60)).padStart(2, '0')}`,
        hours_worked: Math.round(shiftLength * 10) / 10,
        overtime,
        union: emp.union,
      });
    }
  }

  return entries;
}

function generateAssignments(division: string): CrewAssignment[] {
  const divData = DIVISIONS_DATA[division];
  if (!divData) return [];

  const assignments: CrewAssignment[] = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const emp of divData.employees) {
    const start = 6 + Math.floor(Math.random() * 4);
    const duration = 8 + Math.floor(Math.random() * 5);

    assignments.push({
      employee_id: emp.id,
      employee_name: emp.name,
      division,
      crew: emp.crew,
      assignment_date: tomorrow.toISOString().split('T')[0],
      start_time: `${String(start).padStart(2, '0')}:00`,
      end_time: `${String(start + duration).padStart(2, '0')}:00`,
      location: `MP ${100 + Math.floor(Math.random() * 300)}.${Math.floor(Math.random() * 10)}`,
      task: ['Track maintenance', 'Ballast repair', 'Signal inspection', 'Rail testing', 'Equipment service'][Math.floor(Math.random() * 5)],
    });
  }

  return assignments;
}

// ── Exported Functions ─────────────────────────────────────────
// In production, replace these with actual Kronos API calls.
// The interface stays the same — only the data source changes.

export async function getKronosTimeEntries(division: string): Promise<TimeEntry[]> {
  // Production: fetch from Kronos API
  // const response = await fetch(`${KRONOS_BASE_URL}/api/v1/timekeeping/timecard?division=${division}`, {
  //   headers: { Authorization: `Bearer ${await getToken()}` }
  // });
  // return response.json();

  // Demo: generate realistic sample data
  return generateTimeEntries(division);
}

export async function getCrewAssignments(division: string): Promise<CrewAssignment[]> {
  // Production: fetch from Crew Management System
  // Demo: generate sample assignments
  return generateAssignments(division);
}
