
import React, { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Features from './components/Features';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Industries from './components/Industries';
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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/market-data" element={<MarketDataTables />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Lazy-loaded market pages */}
        <Route path="/housing-market" element={<Suspense fallback={<div>Loading...</div>}><HousingMarket /></Suspense>} />
        <Route path="/agriculture-market" element={<Suspense fallback={<div>Loading...</div>}><AgricultureMarket /></Suspense>} />
        <Route path="/mining-market" element={<Suspense fallback={<div>Loading...</div>}><MiningMarket /></Suspense>} />
        <Route path="/green-hydrogen-market" element={<Suspense fallback={<div>Loading...</div>}><GreenHydrogenMarket /></Suspense>} />
        <Route path="/financial-market" element={<Suspense fallback={<div>Loading...</div>}><FinancialMarket /></Suspense>} />
        <Route path="/cryptocurrency-market" element={<Suspense fallback={<div>Loading...</div>}><CryptocurrencyMarket /></Suspense>} />

        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
