/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/UI/ScrollToTop';
import MaintenancePage from './pages/MaintenancePage';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import GalleryPage from './pages/GalleryPage';
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
      <ScrollToTop />
      <Toaster 
        position="top-center"
        toastOptions={{
          className: '!bg-[#1a1a1a] !text-white text-xs font-bold !border !border-white/10 shadow-xl !rounded-2xl',
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/qr-generator" element={<QRGeneratorPage />} />
        <Route path="/koleksi" element={<GalleryPage />} />
        
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
