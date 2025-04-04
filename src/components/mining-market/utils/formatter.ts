
export const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatNumber = (value: number, notation: 'standard' | 'compact' = 'standard', decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    notation: notation,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatCurrency = (value: number, notation: 'standard' | 'compact' = 'standard'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: notation,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};
