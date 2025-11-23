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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function generateInvestorReport(
  personality: PersonalityType,
  scores: PersonalityScores,
  role: string
): Promise<InvestorReport> {
  console.log("Generating investor report...", { personality, scores, role });
  console.log("API URL:", `${API_BASE_URL}/generate_investor_report`);

  try {
    const res = await fetch(`${API_BASE_URL}/generate_investor_report`, {
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

    console.log("Response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Backend error (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Received investor report data:", data);

    if (data.error) {
      console.error("Error in response:", data.error);
      throw new Error("Gemini JSON error: " + data.error);
    }

    // Validate the response has the expected structure
    if (!data.dimensions) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid response format from backend");
    }

    return data as InvestorReport;
  } catch (error: any) {
    console.error("Error generating investor report:", error);
    
    // Provide more helpful error messages
    if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
      throw new Error("Cannot connect to backend. Make sure the server is running on port 8000.");
    }
    
    throw error;
  }
}
