
export const formatCryptoPrice = (value: number): string => {
  // For high-value cryptocurrencies like BTC
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  }
  
  // For mid-range values
  if (value >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 4
    }).format(value);
  }
  
  // For low-value cryptocurrencies (e.g., SHIB, DOGE)
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 6
    }).format(value);
};

export const formatMarketCap = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
  }).format(value);
};

export const formatVolume = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(value);
};

export const formatPercentChange = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const formatSupply = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
  }).format(value);
};

export const getColorForChange = (value: number): string => {
  if (value > 0) return 'text-emerald-500';
  if (value < 0) return 'text-red-500';
  return 'text-slate-400';
};

export const getBackgroundColorForChange = (value: number): string => {
  if (value > 0) return 'bg-emerald-500';
  if (value < 0) return 'bg-red-500';
  return 'bg-slate-400';
};
