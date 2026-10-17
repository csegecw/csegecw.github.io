import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ExecomCall from './ExecomCall';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExecomCall />
  </StrictMode>,
);
