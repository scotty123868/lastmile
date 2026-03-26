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
  currency: string;
  /** Which UpSkiller pillar this company demo showcases */
  pillar: 'verification' | 'readiness' | 'adoption' | 'full';
  pillarLabel: string;
  tagline: string;
  category: 'company' | 'conglomerate' | 'sovereign';
  subEntities?: string[];
  parentId?: string;
}

export const companies: Company[] = [
  {
    id: 'meridian',
    name: 'Herzog Companies',
    shortName: 'Herzog',
    industry: 'Railroad & Infrastructure Construction',
    revenue: '$800M',
    employees: 2800,
    opCos: 7,
    initials: 'H',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'AI output verification across 7 divisions — railroad, transit, signal & energy',
    category: 'company',
    subEntities: ['Herzog Contracting Corp', 'Herzog Railroad Services', 'Herzog Services', 'Herzog Technologies', 'Herzog Transit Services', 'Herzog Energy', 'Green Group LLC'],
  },
  {
    id: 'hcc',
    name: 'Herzog Contracting Corp',
    shortName: 'Herzog Contracting',
    industry: 'Rail & Highway Construction',
    revenue: '$340M',
    employees: 1200,
    opCos: 1,
    initials: 'HC',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Heavy civil construction — rail, highway, and bridge projects across 36 states',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hrsi',
    name: 'Herzog Railroad Services',
    shortName: 'Herzog Railroad',
    industry: 'Railroad Maintenance & Equipment',
    revenue: '$120M',
    employees: 380,
    opCos: 1,
    initials: 'HR',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Ballast maintenance, track renewal, and specialized railroad equipment operations',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hsi',
    name: 'Herzog Services (Rail Testing)',
    shortName: 'Herzog Services',
    industry: 'Ultrasonic Rail Testing',
    revenue: '$65M',
    employees: 220,
    opCos: 1,
    initials: 'HS',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Non-destructive rail flaw detection and FRA compliance testing nationwide',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hti',
    name: 'Herzog Technologies',
    shortName: 'Herzog Tech',
    industry: 'Signal & PTC Systems',
    revenue: '$95M',
    employees: 310,
    opCos: 1,
    initials: 'HT',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Positive Train Control, signal design, and communication system integration',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'htsi',
    name: 'Herzog Transit Services',
    shortName: 'Herzog Transit',
    industry: 'Passenger Rail Operations',
    revenue: '$110M',
    employees: 480,
    opCos: 1,
    initials: 'TS',
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Commuter and intercity passenger rail operations and maintenance',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'he',
    name: 'Herzog Energy',
    shortName: 'Herzog Energy',
    industry: 'Energy Infrastructure',
    revenue: '$45M',
    employees: 120,
    opCos: 1,
    initials: 'HE',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Solar, wind, and energy infrastructure construction and maintenance',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'gg',
    name: 'Green Group LLC',
    shortName: 'Green Group',
    industry: 'Environmental Services',
    revenue: '$25M',
    employees: 90,
    opCos: 1,
    initials: 'GG',
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Environmental remediation, compliance monitoring, and waste stream management',
    category: 'company',
    parentId: 'meridian',
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
