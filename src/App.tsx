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
import { useCompany } from './data/CompanyContext';

const routeTitles: Record<string, string> = {
  '/workflows': 'Live Workflows',
  '/verification': 'Verification Ledger',
  '/context': 'Context Pipeline',
  '/adoption': 'Adoption Pulse',
  '/integrations': 'Integrations',
  '/impact': 'Impact',
  '/data-intelligence': 'Data Intelligence',
  '/assistant': 'AI Assistant',
  '/analytics': 'Analytics',
};

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const { company } = useCompany();
  const pageTitle = routeTitles[location.pathname] || 'Live Workflows';

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
            <span className="text-ink-faint">·</span>
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
          <Route path="/workflows" element={<LiveWorkflows />} />
          <Route path="/verification" element={<VerificationLedger />} />
          <Route path="/context" element={<ContextPipeline />} />
          <Route path="/adoption" element={<AdoptionPulse />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/data-intelligence" element={<DataIntelligence />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/workflows" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
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
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <AnimatedRoutes />
        </div>
      </main>
    </div>
  );
}
