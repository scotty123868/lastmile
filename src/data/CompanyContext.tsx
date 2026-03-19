import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  revenue: string;
  employees: number;
  opCos: number;
  initials: string;
  /** Which UpSkiller pillar this company demo showcases */
  pillar: 'verification' | 'readiness' | 'adoption' | 'full';
  pillarLabel: string;
  tagline: string;
}

export const companies: Company[] = [
  {
    id: 'meridian',
    name: 'Meridian Industrial Holdings',
    shortName: 'Meridian Industrial',
    industry: 'Industrial Services',
    revenue: '$340M',
    employees: 1850,
    opCos: 4,
    initials: 'MI',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'AI output verification across 4 operating companies',
  },
  {
    id: 'oakwood',
    name: 'Oakwood Insurance Group',
    shortName: 'Oakwood Insurance',
    industry: 'Insurance',
    revenue: '$400M',
    employees: 800,
    opCos: 1,
    initials: 'OI',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Context stitching across legacy claims systems',
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle Healthcare Systems',
    shortName: 'Pinnacle Healthcare',
    industry: 'Healthcare Services',
    revenue: '$95M',
    employees: 420,
    opCos: 1,
    initials: 'PH',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Behavioral execution across clinical and admin staff',
  },
  {
    id: 'atlas',
    name: 'Atlas Manufacturing Group',
    shortName: 'Atlas Manufacturing',
    industry: 'Manufacturing',
    revenue: '$320M',
    employees: 2100,
    opCos: 4,
    initials: 'AM',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'All three pillars running as one machine',
  },
];

interface CompanyContextValue {
  company: Company;
  companies: Company[];
  setCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState('meridian');
  const company = companies.find((c) => c.id === companyId) ?? companies[0];

  return (
    <CompanyContext.Provider value={{ company, companies, setCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be inside CompanyProvider');
  return ctx;
}
