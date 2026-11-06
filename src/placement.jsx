import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Placement from './Placement';
import './placement.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Placement />
  </StrictMode>,
);
