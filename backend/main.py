from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Models ===

class PersonalityType(BaseModel):
    code: str
    name: str
    description: str

class PersonalityScores(BaseModel):
    shortTermVsLongTerm: float
    highRiskVsLowRisk: float
    clarityVsComplexity: float
    consistentVsLumpSum: float

class InvestorReportRequest(BaseModel):
    personality: PersonalityType
    scores: PersonalityScores
    role: str

# === Endpoint ===

@app.post("/generate_investor_report")
async def generate_investor_report(req: InvestorReportRequest):

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

    model = genai.GenerativeModel("gemini-2.5-flash-lite")
    response = model.generate_content(prompt)

    text = response.text

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
          "description": f"Fallback: {time_pct}% toward long-term vs short-term preferences. Use this as a placeholder while the AI response is being debugged."
        },
        "riskTolerance": {
          "dominantLabel": dominant_label_from_pct(risk_pct, ["High Risk", "Low Risk"]),
          "description": f"Fallback: {risk_pct}% toward conservative vs risky preferences."
        },
        "complexity": {
          "dominantLabel": dominant_label_from_pct(complexity_pct, ["Clarity", "Complex"]),
          "description": f"Fallback: {complexity_pct}% toward complexity vs clarity preferences."
        },
        "consistency": {
          "dominantLabel": dominant_label_from_pct(strategy_pct, ["Consistent Yield", "Lump Sum"]),
          "description": f"Fallback: {strategy_pct}% toward lump-sum vs consistent strategies."
        }
      },
      "raw": text
    }

    return fallback
