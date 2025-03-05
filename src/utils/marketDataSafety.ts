
/**
 * Utility functions to safely handle market data values
 */

/**
 * Returns a number formatted to specified decimal places, handling null/undefined values
 * @param value The number to format
 * @param decimals Number of decimal places
 * @param fallback Fallback value if input is null/undefined
 * @returns Formatted string or fallback value
 */
export const safeNumberFormat = (
  value: number | null | undefined, 
  decimals: number = 2,
  fallback: string = "0"
): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value.toFixed(decimals);
};

/**
 * Returns a percentage formatted with % symbol, handling null/undefined values
 * @param value The percentage value
 * @param decimals Number of decimal places
 * @param fallback Fallback value if input is null/undefined
 * @returns Formatted percentage string
 */
export const safePercentFormat = (
  value: number | null | undefined, 
  decimals: number = 1,
  fallback: string = "0%"
): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  return `${value.toFixed(decimals)}%`;
};

/**
 * Safely access nested object properties
 * @param obj The object to access
 * @param path Path to the property as array of keys
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value or default value
 */
export const safeObjectAccess = <T,>(
  obj: any,
  path: (string | number)[],
  defaultValue: T
): T => {
  if (!obj) return defaultValue;
  
  let current = obj;
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current !== null && current !== undefined) ? current as T : defaultValue;
};

/**
 * Ensures a data array is never null, returning empty array instead
 * @param data The array to check
 * @returns The original array or an empty array
 */
export const safeArray = <T,>(data: T[] | null | undefined): T[] => {
  return data || [];
};
