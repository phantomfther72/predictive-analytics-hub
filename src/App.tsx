
import React, { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import MarketDataTables from './components/MarketDataTables';
import { Toaster } from './components/ui/toaster';
import Pricing from './pages/Pricing';

// Lazy load market pages to improve performance
const HousingMarket = lazy(() => import('./pages/HousingMarket'));
const AgricultureMarket = lazy(() => import('./pages/AgricultureMarket'));
const MiningMarket = lazy(() => import('./pages/MiningMarket'));
const GreenHydrogenMarket = lazy(() => import('./pages/GreenHydrogenMarket'));
const FinancialMarket = lazy(() => import('./pages/FinancialMarket'));
const CryptocurrencyMarket = lazy(() => import('./pages/CryptocurrencyMarket'));
const MedicalMarket = lazy(() => import('./pages/MedicalMarket'));

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/market-data" element={<MarketDataTables />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Lazy-loaded market pages */}
          <Route path="/housing-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <HousingMarket />
            </Suspense>
          } />
          <Route path="/agriculture-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <AgricultureMarket />
            </Suspense>
          } />
          <Route path="/mining-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <MiningMarket />
            </Suspense>
          } />
          <Route path="/green-hydrogen-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <GreenHydrogenMarket />
            </Suspense>
          } />
          <Route path="/financial-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <FinancialMarket />
            </Suspense>
          } />
          <Route path="/cryptocurrency-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <CryptocurrencyMarket />
            </Suspense>
          } />
          <Route path="/medical-market" element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <MedicalMarket />
            </Suspense>
          } />

          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
