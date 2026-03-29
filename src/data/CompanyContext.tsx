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
