// Accurate Namibia regions with proper names, codes, and aliases
export interface NamibiaRegion {
  code: string;
  name: string;
  aliases?: string[];
  capital: string;
  population: number;
  area: number; // km²
  coordinates: { lat: number; lon: number };
  // SVG path coordinates for simplified map
  mapX: number;
  mapY: number;
}

export const namibiaRegions: NamibiaRegion[] = [
  {
    code: 'KH',
    name: 'Khomas',
    aliases: ['Khomas Region', 'Windhoek'],
    capital: 'Windhoek',
    population: 431000,
    area: 36804,
    coordinates: { lat: -22.5597, lon: 17.0832 },
    mapX: 50,
    mapY: 60
  },
  {
    code: 'ER',
    name: 'Erongo',
    aliases: ['Erongo Region', 'Walvis Bay', 'Swakopmund'],
    capital: 'Swakopmund',
    population: 178000,
    area: 63539,
    coordinates: { lat: -22.6792, lon: 14.5269 },
    mapX: 30,
    mapY: 50
  },
  {
    code: 'ON',
    name: 'Oshana',
    aliases: ['Oshana Region', 'Oshakati'],
    capital: 'Oshakati',
    population: 196000,
    area: 8647,
    coordinates: { lat: -17.7833, lon: 15.7000 },
    mapX: 45,
    mapY: 20
  },
  {
    code: 'KE',
    name: 'Kavango East',
    aliases: ['Kavango East Region', 'Rundu', 'Kavango'],
    capital: 'Rundu',
    population: 223000,
    area: 25576,
    coordinates: { lat: -17.9333, lon: 19.7667 },
    mapX: 70,
    mapY: 25
  },
  {
    code: 'ZA',
    name: 'Zambezi',
    aliases: ['Zambezi Region', 'Caprivi', 'Katima Mulilo'],
    capital: 'Katima Mulilo',
    population: 142000,
    area: 14785,
    coordinates: { lat: -17.5000, lon: 24.2667 },
    mapX: 85,
    mapY: 25
  },
  {
    code: 'KA',
    name: 'ǁKaras',
    aliases: ['Karas', '||Karas', 'Karas Region', 'Keetmanshoop', 'Lüderitz'],
    capital: 'Keetmanshoop',
    population: 78000,
    area: 161215,
    coordinates: { lat: -26.5833, lon: 18.1333 },
    mapX: 25,
    mapY: 85
  },
  {
    code: 'OD',
    name: 'Otjozondjupa',
    aliases: ['Otjozondjupa Region', 'Otjiwarongo', 'Grootfontein'],
    capital: 'Otjiwarongo',
    population: 185000,
    area: 105460,
    coordinates: { lat: -20.4633, lon: 16.6474 },
    mapX: 55,
    mapY: 45
  },
  {
    code: 'KU',
    name: 'Kunene',
    aliases: ['Kunene Region', 'Opuwo', 'Khorixas'],
    capital: 'Opuwo',
    population: 97000,
    area: 115260,
    coordinates: { lat: -18.0667, lon: 13.8333 },
    mapX: 20,
    mapY: 30
  },
  {
    code: 'OM',
    name: 'Omusati',
    aliases: ['Omusati Region', 'Outapi', 'Okahao'],
    capital: 'Outapi',
    population: 254000,
    area: 26551,
    coordinates: { lat: -17.5000, lon: 15.0000 },
    mapX: 35,
    mapY: 15
  },
  {
    code: 'OH',
    name: 'Ohangwena',
    aliases: ['Ohangwena Region', 'Eenhana'],
    capital: 'Eenhana',
    population: 269000,
    area: 10706,
    coordinates: { lat: -17.4667, lon: 16.3167 },
    mapX: 50,
    mapY: 15
  },
  {
    code: 'OS',
    name: 'Oshikoto',
    aliases: ['Oshikoto Region', 'Tsumeb', 'Omuthiya'],
    capital: 'Tsumeb',
    population: 213000,
    area: 38685,
    coordinates: { lat: -19.2333, lon: 17.7167 },
    mapX: 60,
    mapY: 25
  },
  {
    code: 'HA',
    name: 'Hardap',
    aliases: ['Hardap Region', 'Mariental', 'Rehoboth'],
    capital: 'Mariental',
    population: 92000,
    area: 109781,
    coordinates: { lat: -24.6333, lon: 17.9667 },
    mapX: 45,
    mapY: 75
  },
  {
    code: 'OE',
    name: 'Omaheke',
    aliases: ['Omaheke Region', 'Gobabis'],
    capital: 'Gobabis',
    population: 78000,
    area: 84981,
    coordinates: { lat: -22.4500, lon: 18.9667 },
    mapX: 70,
    mapY: 55
  },
  {
    code: 'KW',
    name: 'Kavango West',
    aliases: ['Kavango West Region', 'Nkurenkuru'],
    capital: 'Nkurenkuru',
    population: 113000,
    area: 24591,
    coordinates: { lat: -17.6167, lon: 18.6000 },
    mapX: 60,
    mapY: 20
  }
];

// Helper function to normalize region names for matching
export function normalizeRegionName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ǁ|]/g, '') // Remove special characters
    .replace(/\s+region$/i, '') // Remove "Region" suffix
    .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric
}

// Helper function to find region by name or alias
export function findRegionByName(name: string): NamibiaRegion | undefined {
  const normalized = normalizeRegionName(name);
  
  return namibiaRegions.find(region => {
    if (normalizeRegionName(region.name) === normalized) return true;
    if (normalizeRegionName(region.code) === normalized) return true;
    if (region.aliases?.some(alias => normalizeRegionName(alias) === normalized)) return true;
    return false;
  });
}

// Test fixture data for QA
export const testFixtureData = [
  { region: 'Khomas', growth_rate: 15.5, risk_score: 1, investment: 850000 },
  { region: 'Zambezi', growth_rate: 2.3, risk_score: 3, investment: 45000 },
  { region: 'Erongo', growth_rate: 12.4, risk_score: 2, investment: 620000 },
  { region: 'Oshana', growth_rate: 6.7, risk_score: 2, investment: 180000 },
  { region: 'Kavango East', growth_rate: 3.1, risk_score: 3, investment: 95000 },
  { region: 'ǁKaras', growth_rate: 18.3, risk_score: 1, investment: 1200000 },
  { region: 'Otjozondjupa', growth_rate: 9.1, risk_score: 2, investment: 340000 },
  { region: 'Kunene', growth_rate: 4.5, risk_score: 3, investment: 75000 },
  { region: 'Omusati', growth_rate: 5.2, risk_score: 2, investment: 120000 },
  { region: 'Ohangwena', growth_rate: 4.8, risk_score: 2, investment: 105000 },
  { region: 'Oshikoto', growth_rate: 7.9, risk_score: 2, investment: 280000 },
  { region: 'Hardap', growth_rate: 6.3, risk_score: 2, investment: 160000 },
  { region: 'Omaheke', growth_rate: 5.7, risk_score: 2, investment: 135000 },
  // Kavango West intentionally missing to test "no data" display
];