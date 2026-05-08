/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MaintenancePage from './pages/MaintenancePage';
import GeneratorPage from './pages/GeneratorPage';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import PromptList from './pages/PromptList';
import PromptDetail from './pages/PromptDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DataDeletion from './pages/DataDeletion';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

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
        
        {/* Blog / Artikel Routes */}
        <Route path="/artikel" element={<ArticleList />} />
        <Route path="/artikel/:slug" element={<ArticleDetail />} />
        
        {/* Prompt Library Routes */}
        <Route path="/kumpulan-prompt" element={<PromptList />} />
        <Route path="/kumpulan-prompt/:slug" element={<PromptDetail />} />

        {/* Legal & Info Routes */}
        <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />
        <Route path="/ketentuan-layanan" element={<TermsOfService />} />
        <Route path="/penghapusan-data" element={<DataDeletion />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="/tentang-kami" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}
