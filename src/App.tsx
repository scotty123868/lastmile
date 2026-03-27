import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import LiveWorkflows from './pages/LiveWorkflows';
import VerificationLedger from './pages/VerificationLedger';
import ContextPipeline from './pages/ContextPipeline';
import AdoptionPulse from './pages/AdoptionPulse';
import Integrations from './pages/Integrations';
import Impact from './pages/Impact';
import DataIntelligence from './pages/DataIntelligence';
import Assistant from './pages/Assistant';
import Analytics from './pages/Analytics';
import Assessment from './pages/Assessment';
import ExecutiveBriefing from './pages/ExecutiveBriefing';
import Connectors from './pages/Connectors';
import Reliability from './pages/Reliability';
import Adoption from './pages/Adoption';
import { useCompany } from './data/CompanyContext';
import { SimulationProvider } from './data/SimulationEngine';
import EventToast from './components/EventToast';

const routeTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/executive-briefing': 'Executive Briefing',
  '/operations': 'Operations',
  '/assessment': 'Assessment',
  '/impact': 'Impact',
  '/intelligence': 'Intelligence',
  '/verification': 'Verification Ledger',
  '/connectors': 'System Connectors',
  '/reliability': 'AI Reliability',
  // Legacy routes (redirected, but just in case)
  '/workflows': 'Operations',
  '/analytics': 'Overview',
  '/assistant': 'Intelligence',
  '/context': 'Operations',
  '/adoption': 'Adoption',
  '/adoption-pulse': 'Impact',
  '/integrations': 'Overview',
  '/data-intelligence': 'Intelligence',
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const { company } = useCompany();
  const pageTitle = routeTitles[location.pathname] || 'Overview';

  return (
    <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-8 h-12">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:text-ink hover:bg-surface-sunken transition-colors lg:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-ink">{pageTitle}</span>
            <span className="text-ink-faint">&middot;</span>
            <span className="text-[12px] text-ink-tertiary">{company.shortName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-live" />
            <span className="text-[11px] font-medium text-green">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="h-full"
      >
        <Routes location={location}>
          {/* Executive Briefing — default landing page */}
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/executive-briefing" element={<ExecutiveBriefing />} />

          {/* Primary routes */}
          <Route path="/overview" element={<Analytics />} />
          <Route path="/operations" element={<LiveWorkflows />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/intelligence" element={<Assistant />} />
          <Route path="/verification" element={<VerificationLedger />} />
          <Route path="/connectors" element={<Connectors />} />
          <Route path="/reliability" element={<Reliability />} />

          {/* Legacy routes still accessible (not in nav) */}
          <Route path="/context" element={<ContextPipeline />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/adoption-pulse" element={<AdoptionPulse />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/data-intelligence" element={<DataIntelligence />} />

          {/* Redirects for old routes */}
          <Route path="/analytics" element={<Navigate to="/overview" replace />} />
          <Route path="/workflows" element={<Navigate to="/operations" replace />} />
          <Route path="/assistant" element={<Navigate to="/intelligence" replace />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const isFullBleed = false; // Executive briefing now renders within app layout

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <SimulationProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar — hidden on full-bleed pages */}
        {!isFullBleed && (
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
        )}

        {/* Mobile sidebar overlay — hidden on full-bleed pages */}
        <AnimatePresence>
          {sidebarOpen && !isFullBleed && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                onClick={closeSidebar}
              />
              <motion.div
                key="panel"
                initial={{ x: -232 }}
                animate={{ x: 0 }}
                exit={{ x: -232 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
              >
                <Sidebar onClose={closeSidebar} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className={`flex-1 flex flex-col overflow-hidden ${isFullBleed ? 'bg-nav-bg' : 'bg-surface'}`}>
          {!isFullBleed && <TopBar onMenuClick={() => setSidebarOpen(true)} />}
          <div className="flex-1 overflow-y-auto">
            <AnimatedRoutes />
          </div>
        </main>

        <EventToast />
      </div>
    </SimulationProvider>
  );
}
