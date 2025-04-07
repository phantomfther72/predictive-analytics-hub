
export const formatTooltipValue = (value: any, name: string | number | undefined) => {
  if (typeof value !== 'number') return value;
  
  if (typeof name === 'string') {
    // Format price values
    if (name.toLowerCase().includes('price')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    } 
    // Format market cap values
    else if (name.toLowerCase().includes('market cap')) {
      if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)}B`;
      } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
      }
      return `$${value.toLocaleString()}`;
    } 
    // Format percentage changes
    else if (name.toLowerCase().includes('change')) {
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
  }
  
  return value.toLocaleString();
};
