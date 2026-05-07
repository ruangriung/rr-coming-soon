/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MaintenancePage from './pages/MaintenancePage';
import GeneratorPage from './pages/GeneratorPage';

export default function App() {
  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'glass-card text-white text-xs font-bold border-white/10',
          style: {
            background: 'rgba(26, 26, 26, 1)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MaintenancePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
      </Routes>
    </Router>
  );
}


