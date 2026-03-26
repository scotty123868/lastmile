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
    id: 'nb-aerospace',
    name: 'Northbridge Aerospace',
    shortName: 'NB Aerospace',
    industry: 'Aerospace & Defense',
    revenue: '$4.2B',
    employees: 8200,
    opCos: 1,
    initials: 'NA',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Flight-readiness certification and supply chain verification',
    category: 'conglomerate',
    currency: '$',
    parentId: 'northbridge',
  },
  {
    id: 'nb-energy',
    name: 'Northbridge Energy',
    shortName: 'NB Energy',
    industry: 'Energy & Utilities',
    revenue: '$5.1B',
    employees: 11500,
    opCos: 1,
    initials: 'NE',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'SCADA modernization and predictive grid management',
    category: 'conglomerate',
    currency: '$',
    parentId: 'northbridge',
  },
  {
    id: 'nb-financial',
    name: 'Northbridge Financial Services',
    shortName: 'NB Financial',
    industry: 'Financial Services',
    revenue: '$3.8B',
    employees: 6200,
    opCos: 1,
    initials: 'NF',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Regulatory compliance automation and risk analytics',
    category: 'conglomerate',
    currency: '$',
    parentId: 'northbridge',
  },
  {
    id: 'nb-health',
    name: 'Northbridge Health Sciences',
    shortName: 'NB Health Sciences',
    industry: 'Pharmaceuticals & Biotech',
    revenue: '$5.1B',
    employees: 16100,
    opCos: 1,
    initials: 'NH',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'Clinical trial data pipelines and manufacturing quality',
    category: 'conglomerate',
    currency: '$',
    parentId: 'northbridge',
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
  {
    id: 'ee-finance',
    name: 'Ministry of Finance',
    shortName: 'Min. of Finance',
    industry: 'Fiscal Policy & Taxation',
    revenue: '€2.8B budget',
    employees: 4200,
    opCos: 1,
    initials: 'MF',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Tax compliance automation and fiscal transparency',
    category: 'sovereign',
    currency: '€',
    parentId: 'estonia',
  },
  {
    id: 'ee-social',
    name: 'Ministry of Social Affairs',
    shortName: 'Min. of Social Affairs',
    industry: 'Healthcare & Social Welfare',
    revenue: '€4.2B budget',
    employees: 8400,
    opCos: 1,
    initials: 'MS',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Benefits eligibility verification and health records integration',
    category: 'sovereign',
    currency: '€',
    parentId: 'estonia',
  },
  {
    id: 'ee-economic',
    name: 'Ministry of Economic Affairs',
    shortName: 'Min. of Economic Affairs',
    industry: 'Trade & Digital Economy',
    revenue: '€3.1B budget',
    employees: 5200,
    opCos: 1,
    initials: 'ME',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'e-Residency program optimization and trade facilitation',
    category: 'sovereign',
    currency: '€',
    parentId: 'estonia',
  },
  {
    id: 'ee-ria',
    name: 'Information System Authority (RIA)',
    shortName: 'RIA',
    industry: 'Cybersecurity & IT Infrastructure',
    revenue: '€120M budget',
    employees: 480,
    opCos: 1,
    initials: 'RI',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'X-Road infrastructure, cybersecurity, and national IT governance',
    category: 'sovereign',
    currency: '€',
    parentId: 'estonia',
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
