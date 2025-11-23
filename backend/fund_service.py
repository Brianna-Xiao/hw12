from datetime import datetime, timedelta, date
from typing import Optional, Dict, List, Any

# Optional import - only use if mstarpy is installed
try:
    import mstarpy as ms
    MSTARPY_AVAILABLE = True
except ImportError:
    MSTARPY_AVAILABLE = False
    print("Warning: mstarpy not installed. Fund data features will be unavailable.")

def get_fund_nav(ticker: str, days: int = 30) -> List[Dict[str, Any]]:
    """
    Get historical NAV (Net Asset Value) and total return for a fund
    
    Args:
        ticker: Fund ticker symbol (e.g., "VTSAX", "VOO")
        days: Number of days of historical data to retrieve
    
    Returns:
        List of dictionaries with nav, totalReturn, and date
    """
    if not MSTARPY_AVAILABLE:
        print(f"mstarpy not available. Cannot fetch NAV for {ticker}")
        return []
    
    try:
        funds = ms.Funds(ticker)
        # mstarpy requires date objects, not datetime objects
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        print(f"[get_fund_nav] Fetching NAV for {ticker} from {start_date} to {end_date}")
        nav_data = funds.nav(start_date, end_date)
        print(f"[get_fund_nav] Successfully fetched {len(nav_data)} NAV points for {ticker}")
        return nav_data
    except Exception as e:
        print(f"[get_fund_nav] Error fetching NAV for {ticker}: {e}")
        import traceback
        traceback.print_exc()
        return []

def get_fund_holdings(ticker: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Get top holdings of a fund
    
    Args:
        ticker: Fund ticker symbol
        limit: Maximum number of holdings to return
    
    Returns:
        List of dictionaries with ticker, securityName, weighting, and marketValue
    """
    if not MSTARPY_AVAILABLE:
        print(f"mstarpy not available. Cannot fetch holdings for {ticker}")
        return []
    
    try:
        funds = ms.Funds(ticker)
        holdings = funds.holdings()
        
        # Convert to list of dictionaries and limit results
        if isinstance(holdings, list):
            return holdings[:limit]
        elif hasattr(holdings, 'to_dict'):
            # If it's a pandas DataFrame
            return holdings.head(limit).to_dict('records')
        else:
            return []
    except Exception as e:
        print(f"Error fetching holdings for {ticker}: {e}")
        return []

def get_fund_info(ticker: str) -> Dict[str, Any]:
    """
    Get comprehensive fund information including NAV and holdings
    
    Args:
        ticker: Fund ticker symbol
    
    Returns:
        Dictionary with fund information
    """
    if not MSTARPY_AVAILABLE:
        print(f"mstarpy not available. Cannot fetch fund info for {ticker}")
        return {
            "ticker": ticker,
            "nav": None,
            "totalReturn": None,
            "lastUpdated": None,
            "historicalNav": [],
            "holdings": [],
            "error": "mstarpy not installed"
        }
    
    try:
        print(f"[get_fund_info] Starting fetch for {ticker}")
        funds = ms.Funds(ticker)
        
        # Get recent NAV data (last 30 days) - limit to avoid timeouts
        print(f"[get_fund_info] Fetching NAV data...")
        nav_data = get_fund_nav(ticker, days=30)
        
        # Get top holdings
        print(f"[get_fund_info] Fetching holdings...")
        holdings = get_fund_holdings(ticker, limit=10)
        
        # Get latest NAV
        latest_nav = nav_data[-1] if nav_data else None
        
        print(f"[get_fund_info] Successfully fetched data for {ticker}: {len(nav_data)} NAV points, {len(holdings)} holdings")
        
        return {
            "ticker": ticker,
            "name": None,  # Will be filled from frontend mock data
            "description": None,  # mstarpy doesn't provide this easily
            "expenseRatio": None,  # mstarpy doesn't provide this easily
            "nav": latest_nav["nav"] if latest_nav else None,
            "totalReturn": latest_nav["totalReturn"] if latest_nav else None,
            "lastUpdated": latest_nav["date"] if latest_nav else None,
            "historicalNav": nav_data,
            "holdings": holdings,
        }
    except Exception as e:
        print(f"[get_fund_info] Error fetching fund info for {ticker}: {e}")
        import traceback
        traceback.print_exc()
        return {
            "ticker": ticker,
            "nav": None,
            "totalReturn": None,
            "lastUpdated": None,
            "historicalNav": [],
            "holdings": [],
            "error": str(e)
        }

