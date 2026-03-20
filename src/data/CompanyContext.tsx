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
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'AI output verification across 4 operating companies',
    category: 'company',
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
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Context stitching across legacy claims systems',
    category: 'company',
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
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Behavioral execution across clinical and admin staff',
    category: 'company',
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
    currency: '$',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'All three pillars running as one machine',
    category: 'company',
  },
  {
    id: 'northbridge',
    name: 'Northbridge Industries Group',
    shortName: 'Northbridge Industries',
    industry: 'Diversified Industrial',
    revenue: '$18.2B',
    employees: 42000,
    opCos: 12,
    initials: 'NI',
    currency: '$',
    pillar: 'full',
    pillarLabel: 'Enterprise OS',
    tagline: 'Full AI operating system across 12 operating companies',
    category: 'conglomerate',
    subEntities: ['Northbridge Aerospace', 'Northbridge Energy', 'Northbridge Financial', 'Northbridge Health Sciences'],
  },
  {
    id: 'estonia',
    name: 'Republic of Estonia — Digital Government',
    shortName: 'Republic of Estonia',
    industry: 'Digital Government',
    revenue: '\u20AC12.4B budget',
    employees: 28500,
    opCos: 8,
    initials: 'EE',
    currency: '\u20AC',
    pillar: 'full',
    pillarLabel: 'Gov AI Platform',
    tagline: 'AI-native governance across 8 ministries and agencies',
    category: 'sovereign',
    subEntities: ['Ministry of Finance', 'Ministry of Social Affairs', 'Ministry of Economic Affairs', 'Information System Authority (RIA)'],
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
