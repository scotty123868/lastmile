import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { CompanyProvider } from './data/CompanyContext';
import PasswordGate from './components/PasswordGate';

createRoot(document.getElementById('root')!).render(
  <PasswordGate>
    <BrowserRouter>
      <CompanyProvider>
        <App />
      </CompanyProvider>
    </BrowserRouter>
  </PasswordGate>,
);
