import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ExecomCall from './ExecomCall';
import './execom.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExecomCall />
  </StrictMode>,
);
