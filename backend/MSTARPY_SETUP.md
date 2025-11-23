# MStarpy Integration Guide

## What is MStarpy?

MStarpy is a Python library that provides access to Morningstar fund and stock data, including:
- Historical NAV (Net Asset Value) data
- Fund holdings
- Stock prices and financial statements
- Fund screening capabilities

## Installation

The package is already added to `requirements.txt`. Install it with:

```bash
cd backend
pip install -r requirements.txt
```

Or install directly:
```bash
pip install mstarpy
```

## API Endpoints

### 1. Get Fund Information
```
GET /api/fund/{ticker}
```
Returns comprehensive fund data including NAV, holdings, and historical data.

**Example:**
```bash
curl http://localhost:8000/api/fund/VTSAX
```

**Response:**
```json
{
  "ticker": "VTSAX",
  "nav": 150.01,
  "totalReturn": 232.37,
  "lastUpdated": "2025-07-10",
  "historicalNav": [...],
  "holdings": [...]
}
```

### 2. Get Historical NAV
```
GET /api/fund/{ticker}/nav?days=30
```
Returns historical NAV data for the specified number of days.

**Example:**
```bash
curl http://localhost:8000/api/fund/VTSAX/nav?days=30
```

### 3. Get Fund Holdings
```
GET /api/fund/{ticker}/holdings?limit=10
```
Returns top holdings of the fund.

**Example:**
```bash
curl http://localhost:8000/api/fund/VTSAX/holdings?limit=10
```

## Supported Fund Tickers

MStarpy supports various fund tickers. Common examples:
- **VTSAX** - Vanguard Total Stock Market Index Fund
- **VOO** - Vanguard S&P 500 ETF
- **QQQ** - Invesco QQQ Trust
- **BND** - Vanguard Total Bond Market ETF
- **VTI** - Vanguard Total Stock Market ETF
- **SPY** - SPDR S&P 500 ETF Trust

## Frontend Integration

The frontend automatically fetches real fund data when viewing an ETF detail page. The data includes:
- Current NAV (Net Asset Value)
- Total Return
- Top Holdings
- Recent Performance Chart

## Usage in Code

### Backend (Python)
```python
from fund_service import get_fund_info, get_fund_nav, get_fund_holdings

# Get comprehensive fund info
fund_info = get_fund_info("VTSAX")

# Get historical NAV
nav_data = get_fund_nav("VTSAX", days=30)

# Get top holdings
holdings = get_fund_holdings("VTSAX", limit=10)
```

### Frontend (TypeScript)
```typescript
import { getFundInfo, getFundNav, getFundHoldings } from '@/services/fundService';

// Get comprehensive fund info
const fundInfo = await getFundInfo('VTSAX');

// Get historical NAV
const navData = await getFundNav('VTSAX', 30);

// Get top holdings
const holdings = await getFundHoldings('VTSAX', 10);
```

## Error Handling

If a fund ticker is not found or there's an error:
- The API will return an error message
- The frontend will gracefully fall back to showing static/mock data
- Errors are logged to the console for debugging

## Notes

- MStarpy uses Morningstar's free tier, which may have rate limits
- Some fund tickers may not be available in Morningstar's database
- Historical data availability depends on the fund and Morningstar's data

## Testing

1. Start your backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Test the endpoint:
   ```bash
   curl http://localhost:8000/api/fund/VTSAX
   ```

3. View an ETF in the frontend - it will automatically load real data!

