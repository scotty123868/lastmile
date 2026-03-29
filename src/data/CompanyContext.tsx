import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
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
    name: 'IndustrialsCo',
    shortName: 'IndustrialsCo',
    industry: 'Railroad & Infrastructure Construction',
    employees: 2800,
    opCos: 7,
    initials: 'IC',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'AI output verification across 7 divisions — railroad, transit, signal & energy',
    category: 'company',
    subEntities: ['IC Construction Corp', 'IC Rail Services', 'IC Services', 'IC Technologies', 'IC Transit Services', 'IC Energy', 'IC Environmental LLC'],
  },
  {
    id: 'hcc',
    name: 'IC Construction Corp',
    shortName: 'IC Construction',
    industry: 'Rail & Highway Construction',
    employees: 1200,
    opCos: 1,
    initials: 'CC',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Heavy civil construction — rail, highway, and bridge projects across 36 states',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hrsi',
    name: 'IC Rail Services',
    shortName: 'IC Rail',
    industry: 'Railroad Maintenance & Equipment',
    employees: 380,
    opCos: 1,
    initials: 'RS',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Ballast maintenance, track renewal, and specialized railroad equipment operations',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hsi',
    name: 'IC Testing Services',
    shortName: 'IC Services',
    industry: 'Ultrasonic Rail Testing',
    employees: 220,
    opCos: 1,
    initials: 'TS',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Non-destructive rail flaw detection and FRA compliance testing nationwide',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'hti',
    name: 'IC Technologies',
    shortName: 'IC Tech',
    industry: 'Signal & PTC Systems',
    employees: 310,
    opCos: 1,
    initials: 'TK',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Positive Train Control, signal design, and communication system integration',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'htsi',
    name: 'IC Transit Services',
    shortName: 'IC Transit',
    industry: 'Passenger Rail Operations',
    employees: 480,
    opCos: 1,
    initials: 'TR',
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Commuter and intercity passenger rail operations and maintenance',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'he',
    name: 'IC Energy',
    shortName: 'IC Energy',
    industry: 'Energy Infrastructure',
    employees: 120,
    opCos: 1,
    initials: 'EN',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Solar, wind, and energy infrastructure construction and maintenance',
    category: 'company',
    parentId: 'meridian',
  },
  {
    id: 'gg',
    name: 'IC Environmental LLC',
    shortName: 'IC Environmental',
    industry: 'Environmental Services',
    employees: 90,
    opCos: 1,
    initials: 'EV',
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Environmental remediation, compliance monitoring, and waste stream management',
    category: 'company',
    parentId: 'meridian',
  },
  // ─── Other Demo Companies ───────────────────────────────────────────────
  {
    id: 'oakwood',
    name: 'Oakwood Insurance Group',
    shortName: 'Oakwood Insurance',
    industry: 'Insurance',
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
    employees: 2100,
    opCos: 4,
    initials: 'AM',
    currency: '$',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'All three pillars running as one machine',
    category: 'company',
  },
  // ─── Northbridge Industries (Conglomerate) ──────────────────────────────
  {
    id: 'northbridge',
    name: 'Northbridge Industries Group',
    shortName: 'Northbridge Industries',
    industry: 'Diversified Industrial',
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
    employees: 8200,
    opCos: 1,
    initials: 'NA',
    currency: '$',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Flight-readiness certification and supply chain verification',
    category: 'conglomerate',
    parentId: 'northbridge',
  },
  {
    id: 'nb-energy',
    name: 'Northbridge Energy',
    shortName: 'NB Energy',
    industry: 'Energy & Utilities',
    employees: 11500,
    opCos: 1,
    initials: 'NE',
    currency: '$',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'SCADA modernization and predictive grid management',
    category: 'conglomerate',
    parentId: 'northbridge',
  },
  {
    id: 'nb-financial',
    name: 'Northbridge Financial Services',
    shortName: 'NB Financial',
    industry: 'Financial Services',
    employees: 6200,
    opCos: 1,
    initials: 'NF',
    currency: '$',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'Regulatory compliance automation and risk analytics',
    category: 'conglomerate',
    parentId: 'northbridge',
  },
  {
    id: 'nb-health',
    name: 'Northbridge Health Sciences',
    shortName: 'NB Health Sciences',
    industry: 'Pharmaceuticals & Biotech',
    employees: 16100,
    opCos: 1,
    initials: 'NH',
    currency: '$',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'Clinical trial data pipelines and manufacturing quality',
    category: 'conglomerate',
    parentId: 'northbridge',
  },
  // ─── Republic of Estonia (Sovereign) ────────────────────────────────────
  {
    id: 'estonia',
    name: 'Republic of Estonia — Digital Government',
    shortName: 'Republic of Estonia',
    industry: 'Digital Government',
    employees: 28500,
    opCos: 8,
    initials: 'EE',
    currency: '€',
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
    employees: 4200,
    opCos: 1,
    initials: 'MF',
    currency: '€',
    pillar: 'verification',
    pillarLabel: 'Verification Ops',
    tagline: 'Tax compliance automation and fiscal transparency',
    category: 'sovereign',
    parentId: 'estonia',
  },
  {
    id: 'ee-social',
    name: 'Ministry of Social Affairs',
    shortName: 'Min. of Social Affairs',
    industry: 'Healthcare & Social Welfare',
    employees: 8400,
    opCos: 1,
    initials: 'MS',
    currency: '€',
    pillar: 'readiness',
    pillarLabel: 'Readiness Ops',
    tagline: 'Benefits eligibility verification and health records integration',
    category: 'sovereign',
    parentId: 'estonia',
  },
  {
    id: 'ee-economic',
    name: 'Ministry of Economic Affairs',
    shortName: 'Min. of Economic Affairs',
    industry: 'Trade & Digital Economy',
    employees: 5200,
    opCos: 1,
    initials: 'ME',
    currency: '€',
    pillar: 'adoption',
    pillarLabel: 'Adoption Ops',
    tagline: 'e-Residency program optimization and trade facilitation',
    category: 'sovereign',
    parentId: 'estonia',
  },
  {
    id: 'ee-ria',
    name: 'Information System Authority (RIA)',
    shortName: 'RIA',
    industry: 'Cybersecurity & IT Infrastructure',
    employees: 480,
    opCos: 1,
    initials: 'RI',
    currency: '€',
    pillar: 'full',
    pillarLabel: 'Full Operating System',
    tagline: 'X-Road infrastructure, cybersecurity, and national IT governance',
    category: 'sovereign',
    parentId: 'estonia',
  },
];

interface CompanyContextValue {
  company: Company;
  companies: Company[];
  setCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function getInitialCompany(): string {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('company');
  if (fromUrl && companies.some((c) => c.id === fromUrl)) return fromUrl;
  return 'meridian';
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyIdState] = useState(getInitialCompany);
  const company = companies.find((c) => c.id === companyId) ?? companies[0];

  const setCompanyId = useCallback((id: string) => {
    setCompanyIdState(id);
    const url = new URL(window.location.href);
    if (id === 'meridian') {
      url.searchParams.delete('company');
    } else {
      url.searchParams.set('company', id);
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Sync on popstate (browser back/forward)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('company');
      if (fromUrl && companies.some((c) => c.id === fromUrl)) {
        setCompanyIdState(fromUrl);
      } else {
        setCompanyIdState('meridian');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

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
