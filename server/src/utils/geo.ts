// Country to coordinates mapping for basic geo-tagging

export const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'United States': { lat: 37.0902, lng: -95.7129 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'United Kingdom': { lat: 55.3781, lng: -3.436 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Russia': { lat: 61.524, lng: 105.3188 },
  'Brazil': { lat: -14.235, lng: -51.9253 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Norway': { lat: 60.472, lng: 8.4689 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Taiwan': { lat: 23.6978, lng: 120.9605 },
  'Israel': { lat: 31.0461, lng: 34.8516 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Egypt': { lat: 26.8206, lng: 30.8025 },
  'Nigeria': { lat: 9.082, lng: 8.6753 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Chile': { lat: -35.6751, lng: -71.543 },
  'Colombia': { lat: 4.5709, lng: -74.2973 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Thailand': { lat: 15.87, lng: 100.9925 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Philippines': { lat: 12.8797, lng: 121.774 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
  'Bangladesh': { lat: 23.685, lng: 90.3563 },
  'Qatar': { lat: 25.3548, lng: 51.1839 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'UK': { lat: 55.3781, lng: -3.436 },
};

export function getCountryCoordinates(country: string): { lat: number; lng: number } | null {
  return COUNTRY_COORDINATES[country] || null;
}

export function getCoordinates(country?: string | null, city?: string | null): { lat: number; lng: number } | null {
  if (!country) return null;

  // Try exact country match
  let coords = getCountryCoordinates(country);

  // Try uppercase/alternate names
  if (!coords) {
    const upperCountry = country.toUpperCase();
    coords = getCountryCoordinates(upperCountry);
  }

  return coords;
}
