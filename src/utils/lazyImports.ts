import { lazy } from 'react';

// Lazy load industry pages
export const LazyHousingMarket = lazy(() => import('@/pages/HousingMarket'));
export const LazyAgricultureMarket = lazy(() => import('@/pages/AgricultureMarket'));
export const LazyMiningMarket = lazy(() => import('@/pages/MiningMarket'));
export const LazyGreenHydrogenMarket = lazy(() => import('@/pages/GreenHydrogenMarket'));
export const LazyFinancialMarket = lazy(() => import('@/pages/FinancialMarket'));
export const LazyMedicalMarket = lazy(() => import('@/pages/MedicalMarket'));
export const LazyCryptocurrencyMarket = lazy(() => import('@/pages/CryptocurrencyMarket'));
export const LazyGlobalEquity = lazy(() => import('@/pages/GlobalEquityPage'));
export const LazyOpportunities = lazy(() => import('@/pages/OpportunitiesPage'));
export const LazyInvestorHub = lazy(() => import('@/pages/InvestorHub'));
export const LazyTerminal = lazy(() => import('@/pages/Terminal'));
export const LazyTourism = lazy(() => import('@/pages/Tourism'));
export const LazyEducation = lazy(() => import('@/pages/Education'));
export const LazyInfrastructure = lazy(() => import('@/pages/Infrastructure'));
export const LazyMediaEntertainment = lazy(() => import('@/pages/MediaEntertainment'));