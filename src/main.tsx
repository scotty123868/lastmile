import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { CompanyProvider } from './data/CompanyContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CompanyProvider>
      <App />
    </CompanyProvider>
  </BrowserRouter>,
);
