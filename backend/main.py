from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from firebase_service import save_quiz_result
from fund_service import get_fund_info, get_fund_nav, get_fund_holdings

# Import MSTARPY_AVAILABLE for startup check
try:
    from fund_service import MSTARPY_AVAILABLE
except ImportError:
    MSTARPY_AVAILABLE = False

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Financial Personality Quiz API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("Backend server starting up...")
    print(f"Gemini API configured: {bool(os.getenv('GEMINI_API_KEY'))}")
    print(f"mstarpy available: {MSTARPY_AVAILABLE if 'MSTARPY_AVAILABLE' in globals() else 'Checking...'}")
    print("=" * 50)

# === Models ===

class PersonalityType(BaseModel):
    code: str
    name: str
    description: str
    color: str = "#4398b4"  # Default color if not provided

class PersonalityScores(BaseModel):
    shortTermVsLongTerm: float
    highRiskVsLowRisk: float
    clarityVsComplexity: float
    consistentVsLumpSum: float

class InvestorReportRequest(BaseModel):
    personality: PersonalityType
    scores: PersonalityScores
    role: str

class QuizResultRequest(BaseModel):
    userId: str
    role: str
    quizAnswers: list
    personalityScores: PersonalityScores
    personalityType: PersonalityType

# === Endpoint ===

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

@app.post("/generate_investor_report")
async def generate_investor_report(req: InvestorReportRequest):
    print(f"\n[generate_investor_report] Request received for {req.personality.code}")
    print(f"[generate_investor_report] Role: {req.role}")
    
    # Check if Gemini API key is configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("[generate_investor_report] ERROR: GEMINI_API_KEY not found")
        return {
            "error": "Gemini API key not configured",
            "dimensions": {
                "timeHorizon": {"dominantLabel": "Long-Term", "description": "AI analysis unavailable - API key not configured."},
                "riskTolerance": {"dominantLabel": "Low Risk", "description": "AI analysis unavailable - API key not configured."},
                "complexity": {"dominantLabel": "Simple", "description": "AI analysis unavailable - API key not configured."},
                "consistency": {"dominantLabel": "Consistent", "description": "AI analysis unavailable - API key not configured."}
            }
        }
    
    print(f"[generate_investor_report] Gemini API key found, proceeding...")

    p = req.personality
    s = req.scores

    # Convert raw axis scores (range roughly -15..+15) to 0-100 percentages
    max_possible = 15  # 5 questions * max 3 points each
    time_pct = round(((s.shortTermVsLongTerm + max_possible) / (max_possible * 2)) * 100)
    risk_pct = round(((s.highRiskVsLowRisk + max_possible) / (max_possible * 2)) * 100)
    complexity_pct = round(((s.clarityVsComplexity + max_possible) / (max_possible * 2)) * 100)
    strategy_pct = round(((s.consistentVsLumpSum + max_possible) / (max_possible * 2)) * 100)

    prompt = f"""
Generate a detailed investor personality report based on the following data.

### Personality Code
{p.code} — {p.name}

### Description
{p.description}

### Axis Percentages (0-100%):
- Time Horizon (Short → Long): {time_pct}%
- Risk Tolerance (Risky → Conservative): {risk_pct}%
- Complexity Preference (Simple → Complex): {complexity_pct}%
- Strategy Preference (Gradual → Lump Sum): {strategy_pct}%

### User Role
{req.role}

### REQUIREMENTS
Produce thoughtful, complete insights. Each "dimensions" entry MUST include:
- "dominantLabel": a clear interpretation of the score
- "description": 3–5 sentences explaining how this trait influences investing
- "strengths": 2–4 strengths specifically tied to that dimension
- "weaknesses": 2–4 weaknesses or vulnerabilities
- "blindSpots": 1–3 potential blind spots or risks caused by that dimension

Descriptions must be specific, behavioral, and investment-focused.

### REQUIRED JSON FORMAT (no markdown):

{{
  "strengths": [],
  "weaknesses": [],
  "strategies": [],
  "behaviors": [],
  "advisorTips": [],
  "dimensions": {{
    "timeHorizon": {{
      "dominantLabel": "",
      "description": "",
      "strengths": [],
      "weaknesses": [],
      "blindSpots": []
    }},
    "riskTolerance": {{
      "dominantLabel": "",
      "description": "",
      "strengths": [],
      "weaknesses": [],
      "blindSpots": []
    }},
    "complexity": {{
      "dominantLabel": "",
      "description": "",
      "strengths": [],
      "weaknesses": [],
      "blindSpots": []
    }},
    "consistency": {{
      "dominantLabel": "",
      "description": "",
      "strengths": [],
      "weaknesses": [],
      "blindSpots": []
    }}
  }}
}}

Return ONLY valid JSON — no notes, no extra text.
"""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        print("[generate_investor_report] Calling Gemini API...")
        response = model.generate_content(prompt)
        text = response.text
        print("[generate_investor_report] Gemini API response received")
    except Exception as e:
        print(f"[generate_investor_report] ERROR calling Gemini API: {e}")
        raise

    # Log the raw model output for debugging
    print("[generate_investor_report] model output:")
    print(text)

    # Try strict JSON parse first, then try to recover a JSON substring if the model
    # returned surrounding commentary or extra tokens.
    try:
        return json.loads(text)
    except Exception:
        # Attempt to extract the first JSON object from the text by finding
        # the first '{' and the last '}' and parsing that substring.
        first = text.find('{')
        last = text.rfind('}')
        if first != -1 and last != -1 and last > first:
            candidate = text[first:last+1]
            try:
                return json.loads(candidate)
            except Exception:
                pass

    # If recovery failed, return a simple deterministic fallback so the UI
    # can still show useful content. Also keep the raw model output in the
    # returned structure under `raw` for debugging.
    print("[generate_investor_report] JSON parsing failed, returning fallback")
    def dominant_label_from_pct(pct, labels):
      return labels[0] if pct < 50 else labels[1]

    fallback = {
      "strengths": [],
      "weaknesses": [],
      "strategies": [],
      "behaviors": [],
      "advisorTips": [],
      "dimensions": {
        "timeHorizon": {
          "dominantLabel": dominant_label_from_pct(time_pct, ["Short-Term", "Long-Term"]),
          "description": f"Your time horizon preference is {time_pct}% toward long-term planning. This suggests you prefer investments that compound over years rather than seeking quick returns. Consider strategies that align with your patient approach to wealth building."
        },
        "riskTolerance": {
          "dominantLabel": dominant_label_from_pct(risk_pct, ["High Risk", "Low Risk"]),
          "description": f"Your risk tolerance is {risk_pct}% toward conservative strategies. This indicates you value stability and capital preservation. Focus on diversified portfolios that balance growth potential with downside protection."
        },
        "complexity": {
          "dominantLabel": dominant_label_from_pct(complexity_pct, ["Clarity", "Complex"]),
          "description": f"Your preference for investment complexity is {complexity_pct}% toward simplicity. You likely prefer straightforward, easy-to-understand investment options that don't require deep financial knowledge."
        },
        "consistency": {
          "dominantLabel": dominant_label_from_pct(strategy_pct, ["Consistent Yield", "Lump Sum"]),
          "description": f"Your investment style preference is {strategy_pct}% toward consistent strategies. You likely prefer regular, predictable returns through steady contributions rather than large one-time investments."
        }
      },
      "raw": text[:500] if text else "No response from AI"
    }

    print("[generate_investor_report] Returning fallback response")
    return fallback

# === Quiz Results Endpoint ===

@app.post("/save_quiz_result")
async def save_quiz_result_endpoint(req: QuizResultRequest):
    """
    Save quiz results to Firebase
    """
    try:
        doc_id = save_quiz_result(
            user_id=req.userId,
            role=req.role,
            quiz_answers=req.quizAnswers,
            personality_scores={
                "shortTermVsLongTerm": req.personalityScores.shortTermVsLongTerm,
                "highRiskVsLowRisk": req.personalityScores.highRiskVsLowRisk,
                "clarityVsComplexity": req.personalityScores.clarityVsComplexity,
                "consistentVsLumpSum": req.personalityScores.consistentVsLumpSum,
            },
            personality_type={
                "code": req.personalityType.code,
                "name": req.personalityType.name,
                "description": req.personalityType.description,
                "color": req.personalityType.color,
            }
        )
        
        if doc_id:
            return {"success": True, "documentId": doc_id}
        else:
            return {"success": False, "error": "Failed to save quiz result"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# === Fund Data Endpoints ===

@app.get("/api/fund/{ticker}")
async def get_fund(ticker: str):
    """
    Get comprehensive fund information including NAV, holdings, and historical data
    """
    print(f"[API] GET /api/fund/{ticker}")
    try:
        fund_info = get_fund_info(ticker.upper())
        print(f"[API] Successfully returned fund info for {ticker}")
        return fund_info
    except Exception as e:
        print(f"[API] Error getting fund info for {ticker}: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "ticker": ticker}

@app.get("/api/fund/{ticker}/nav")
async def get_fund_nav_endpoint(ticker: str, days: int = 30):
    """
    Get historical NAV data for a fund
    """
    print(f"[API] GET /api/fund/{ticker}/nav?days={days}")
    try:
        # Limit days to prevent timeouts
        days = min(days, 90)  # Max 90 days
        nav_data = get_fund_nav(ticker.upper(), days=days)
        print(f"[API] Successfully returned {len(nav_data)} NAV points for {ticker}")
        return {"ticker": ticker, "navData": nav_data}
    except Exception as e:
        print(f"[API] Error getting NAV for {ticker}: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "ticker": ticker, "navData": []}

@app.get("/api/fund/{ticker}/holdings")
async def get_fund_holdings_endpoint(ticker: str, limit: int = 10):
    """
    Get top holdings of a fund
    """
    try:
        holdings = get_fund_holdings(ticker.upper(), limit=limit)
        return {"ticker": ticker, "holdings": holdings}
    except Exception as e:
        return {"error": str(e), "ticker": ticker}
