const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface FundNavData {
  nav: number;
  totalReturn: number;
  date: string;
}

export interface FundHolding {
  ticker: string;
  securityName: string;
  weighting: number;
  marketValue: number;
}

export interface FundInfo {
  ticker: string;
  name?: string | null;
  description?: string | null;
  expenseRatio?: number | null;
  nav: number | null;
  totalReturn: number | null;
  lastUpdated: string | null;
  historicalNav: FundNavData[];
  holdings: FundHolding[];
  error?: string;
}

/**
 * Get comprehensive fund information
 */
export async function getFundInfo(ticker: string): Promise<FundInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fund/${ticker}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch fund info: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching fund info for ${ticker}:`, error);
    throw error;
  }
}

/**
 * Get historical NAV data for a fund
 */
export async function getFundNav(ticker: string, days: number = 30): Promise<FundNavData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fund/${ticker}/nav?days=${days}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch NAV data: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns {ticker, navData: [...]}
    return data.navData || [];
  } catch (error) {
    console.error(`Error fetching NAV data for ${ticker}:`, error);
    return [];
  }
}

/**
 * Get top holdings of a fund
 */
export async function getFundHoldings(ticker: string, limit: number = 10): Promise<FundHolding[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fund/${ticker}/holdings?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch holdings: ${response.status}`);
    }
    const data = await response.json();
    return data.holdings || [];
  } catch (error) {
    console.error(`Error fetching holdings for ${ticker}:`, error);
    return [];
  }
}

