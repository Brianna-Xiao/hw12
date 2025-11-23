import { GoogleGenAI } from "@google/genai";
import { PersonalityScores, PersonalityType } from "@/types/personality";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.GEMINI_API_KEY,
});

export type InvestorReport = {
  strengths: string[];
  weaknesses: string[];
  strategies: string[];
  behaviors: string[];
  advisorTips?: string[];
  dimensions: {
    timeHorizon: {
      dominantLabel: string;
      description: string;
    };
    riskTolerance: {
      dominantLabel: string;
      description: string;
    };
    complexity: {
      dominantLabel: string;
      description: string;
    };
    consistency: {
      dominantLabel: string;
      description: string;
    };
  };
};

export async function generateInvestorReport(
  personality: PersonalityType,
  scores: PersonalityScores,
  role: string
): Promise<InvestorReport> {

  const prompt = `
Generate a structured investor personality report based on the following data.

### Personality Code
${personality.code} — ${personality.name}

### Description
${personality.description}

### Raw Axis Scores:
- Time Horizon (Short → Long): ${scores.shortTermVsLongTerm}
- Risk Tolerance (Risky → Conservative): ${scores.highRiskVsLowRisk}
- Complexity Preference (Simple → Complex): ${scores.clarityVsComplexity}
- Strategy Preference (Gradual → Lump Sum): ${scores.consistentVsLumpSum}

### User Role
${role}

### REQUIRED JSON FORMAT (no markdown):

{
  "strengths": [],
  "weaknesses": [],
  "strategies": [],
  "behaviors": [],
  "advisorTips": [],
  "dimensions": {
    "timeHorizon": {
      "dominantLabel": "",
      "description": ""
    },
    "riskTolerance": {
      "dominantLabel": "",
      "description": ""
    },
    "complexity": {
      "dominantLabel": "",
      "description": ""
    },
    "consistency": {
      "dominantLabel": "",
      "description": ""
    }
  }
}

Return ONLY valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  const text = response.text;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON from Gemini:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}
