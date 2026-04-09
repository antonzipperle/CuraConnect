import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CuraPilot } from './components/CuraPilot.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CuraPilot />
  </StrictMode>,
);
