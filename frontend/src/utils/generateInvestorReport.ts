import { PersonalityScores, PersonalityType } from "@/types/personality";

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

  const res = await fetch("http://localhost:8000/generate_investor_report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personality,
      scores,
      role,
    }),
  });

  if (!res.ok) {
    throw new Error("Backend error: " + res.statusText);
  }

  const data = await res.json();

  console.log("Received investor report data:", data);

  if (data.error) {
    throw new Error("Gemini JSON error: " + data.error);
  }

  return data as InvestorReport;
}
