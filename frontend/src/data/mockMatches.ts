import { Match, UserProfile } from "@/types/personality";

const mockProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    pronouns: "they/them",
    role: "advisor",
    bio: "Helping clients build sustainable wealth",
    personalityType: {
      code: "LRIG",
      name: "The Steady Builder",
      description: "Long-term, risk-averse, simple strategies",
      color: "hsl(var(--long-term))",
    },
    scores: {
      shortTermVsLongTerm: 8,
      highRiskVsLowRisk: 7,
      clarityVsComplexity: -5,
      consistentVsLumpSum: -6,
    },
  },
  {
    id: "2",
    name: "Jordan Martinez",
    pronouns: "she/her",
    role: "investor",
    bio: "Tech investor | Long-term thinker",
    personalityType: {
      code: "LRXB",
      name: "The Methodical Architect",
      description: "Patient and detail-oriented",
      color: "hsl(var(--long-term))",
    },
    scores: {
      shortTermVsLongTerm: 9,
      highRiskVsLowRisk: 6,
      clarityVsComplexity: 7,
      consistentVsLumpSum: 5,
    },
  },
  {
    id: "3",
    name: "Sam Wilson",
    pronouns: "he/him",
    role: "advisor",
    bio: "Financial advisor specializing in growth",
    personalityType: {
      code: "LCIG",
      name: "The Balanced Grower",
      description: "Simplicity and consistency",
      color: "hsl(var(--low-risk))",
    },
    scores: {
      shortTermVsLongTerm: 7,
      highRiskVsLowRisk: 8,
      clarityVsComplexity: -4,
      consistentVsLumpSum: -7,
    },
  },
  {
    id: "4",
    name: "Morgan Lee",
    pronouns: "she/her",
    role: "investor",
    bio: "Early-stage investor | Risk enthusiast",
    personalityType: {
      code: "SRXB",
      name: "The Technical Gambler",
      description: "Complex short-term strategies",
      color: "hsl(var(--high-risk))",
    },
    scores: {
      shortTermVsLongTerm: -6,
      highRiskVsLowRisk: -7,
      clarityVsComplexity: 6,
      consistentVsLumpSum: 5,
    },
  },
  {
    id: "5",
    name: "Casey Brown",
    pronouns: "they/them",
    role: "advisor",
    bio: "CFP® | Building financial futures",
    personalityType: {
      code: "LCXB",
      name: "The Masterful Strategist",
      description: "Intricate, conservative long-term plans",
      color: "hsl(var(--long-term))",
    },
    scores: {
      shortTermVsLongTerm: 9,
      highRiskVsLowRisk: 9,
      clarityVsComplexity: 8,
      consistentVsLumpSum: 6,
    },
  },
];

export function generateMatches(userScores: any, userRole: string): Match[] {
  return mockProfiles
    .filter((profile) => profile.role !== userRole)
    .map((profile) => {
      // Simple compatibility calculation
      const scoreDiff = Math.abs(
        Math.abs(userScores.shortTermVsLongTerm) -
          Math.abs(profile.scores.shortTermVsLongTerm)
      );
      const score = Math.max(60, 100 - scoreDiff * 3);

      let reason = "";
      if (score > 85) {
        reason = "Very similar financial personality - great match!";
      } else if (score > 75) {
        reason = "Strong compatibility in investment approach";
      } else {
        reason = "Complementary financial perspectives";
      }

      return {
        id: profile.id,
        user: profile,
        score,
        reason,
      };
    })
    .sort((a, b) => b.score - a.score);
}
