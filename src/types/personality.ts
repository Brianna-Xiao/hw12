import { QuizAnswer, PersonalityScores, PersonalityType } from "@/types/personality";
import { quizQuestions } from "@/data/quizQuestions";

export function calculatePersonalityScores(answers: QuizAnswer[]): PersonalityScores {
  const scores = {
    shortTermVsLongTerm: 0,
    highRiskVsLowRisk: 0,
    clarityVsComplexity: 0,
    consistentVsLumpSum: 0,
  };

  answers.forEach((answer) => {
    const question = quizQuestions[answer.questionIndex];
    // Convert 1-7 scale to -3 to +3
    let score = answer.value - 4;
    
    // Reverse if needed
    if (question.reverse) {
      score = -score;
    }

    switch (question.axis) {
      case "timeHorizon":
        scores.shortTermVsLongTerm += score;
        break;
      case "riskTolerance":
        scores.highRiskVsLowRisk += score;
        break;
      case "complexity":
        scores.clarityVsComplexity += score;
        break;
      case "consistency":
        scores.consistentVsLumpSum += score;
        break;
    }
  });

  return scores;
}

export function getPersonalityType(scores: PersonalityScores): PersonalityType {
  // Generate 4-letter code
  const timeCode = scores.shortTermVsLongTerm >= 0 ? "L" : "S"; // Long-term vs Short-term
  const riskCode = scores.highRiskVsLowRisk >= 0 ? "C" : "R"; // Conservative vs Risky
  const complexityCode = scores.clarityVsComplexity >= 0 ? "X" : "I"; // compleX vs sImple
  const consistencyCode = scores.consistentVsLumpSum >= 0 ? "B" : "G"; // Big wins vs Gradual

  const code = `${timeCode}${riskCode}${complexityCode}${consistencyCode}`;

  // Determine dominant axis and color
  const maxScore = Math.max(
    Math.abs(scores.shortTermVsLongTerm),
    Math.abs(scores.highRiskVsLowRisk),
    Math.abs(scores.clarityVsComplexity),
    Math.abs(scores.consistentVsLumpSum)
  );

  let color = "hsl(var(--primary))";
  if (Math.abs(scores.shortTermVsLongTerm) === maxScore) {
    color = scores.shortTermVsLongTerm >= 0 ? "hsl(var(--long-term))" : "hsl(var(--short-term))";
  } else if (Math.abs(scores.highRiskVsLowRisk) === maxScore) {
    color = scores.highRiskVsLowRisk >= 0 ? "hsl(var(--low-risk))" : "hsl(var(--high-risk))";
  }

  const personalityTypes: Record<string, { name: string; description: string }> = {
    LRIG: {
      name: "The Steady Builder",
      description: "You value long-term, conservative strategies with simple approaches and gradual growth. You're patient and prefer to minimize risk while building wealth steadily over time.",
    },
    LRIB: {
      name: "The Strategic Planner",
      description: "Long-term and risk-averse, you prefer simple strategies that lead to significant milestones. You value patience and security while working toward major financial goals.",
    },
    LRXG: {
      name: "The Complex Accumulator",
      description: "You enjoy understanding intricate financial systems and prefer conservative, long-term strategies with steady growth. Details matter to you.",
    },
    LRXB: {
      name: "The Methodical Architect",
      description: "Patient and detail-oriented, you build complex long-term strategies aimed at big payoffs. You're comfortable with sophisticated approaches as long as risk is managed.",
    },
    LCIG: {
      name: "The Balanced Grower",
      description: "You prefer simplicity and consistency in your conservative long-term approach. Regular, predictable progress keeps you motivated.",
    },
    LCIB: {
      name: "The Patient Achiever",
      description: "Simple and conservative with a long-term view, you work toward major milestones. You value clarity and security on your financial journey.",
    },
    LCXG: {
      name: "The Sophisticated Stabilizer",
      description: "You appreciate complex strategies that deliver steady, reliable results over the long term. You're conservative but intellectually engaged.",
    },
    LCXB: {
      name: "The Masterful Strategist",
      description: "You design intricate, conservative long-term plans aimed at significant achievements. Patience, complexity, and security define your approach.",
    },
    SRIG: {
      name: "The Quick Builder",
      description: "You like seeing results soon with simple, relatively safe approaches that provide steady feedback. Short-term wins keep you motivated.",
    },
    SRIB: {
      name: "The Tactical Opportunist",
      description: "You're open to quick wins through simple strategies that can yield bigger payoffs, even if it means waiting a bit. You balance speed with caution.",
    },
    SRXG: {
      name: "The Analytical Trader",
      description: "You enjoy diving into complex strategies for short-term gains with measured risk. Details and steady progress excite you.",
    },
    SRXB: {
      name: "The Technical Gambler",
      description: "Complex short-term strategies with potential for bigger payoffs appeal to you. You're willing to study the details for calculated risks.",
    },
    SCIG: {
      name: "The Conservative Sprint",
      description: "You prefer simple, low-risk approaches that deliver regular short-term returns. Predictable progress in the near term suits you best.",
    },
    SCIB: {
      name: "The Cautious Climber",
      description: "Simple and conservative, you look for short-term opportunities that can lead to notable gains. You balance safety with the need for results.",
    },
    SCXG: {
      name: "The Detail-Oriented Planner",
      description: "You like sophisticated strategies that produce steady short-term results. Complexity doesn't intimidate you as long as risk is managed.",
    },
    SCXB: {
      name: "The Calculated Innovator",
      description: "Complex and conservative, you seek short-term strategies that can yield significant returns. You balance sophistication with prudence.",
    },
  };

  const typeInfo = personalityTypes[code] || {
    name: "The Financial Explorer",
    description: "Your unique combination of traits makes you adaptable and open to various financial strategies.",
  };

  return {
    code,
    name: typeInfo.name,
    description: typeInfo.description,
    color,
  };
}

export function getPercentages(scores: PersonalityScores) {
  // Convert scores to percentages (0-100)
  const maxPossible = 15; // 5 questions per axis * 3 max points
  
  return {
    longTerm: Math.round(((scores.shortTermVsLongTerm + maxPossible) / (maxPossible * 2)) * 100),
    lowRisk: Math.round(((scores.highRiskVsLowRisk + maxPossible) / (maxPossible * 2)) * 100),
    complexity: Math.round(((scores.clarityVsComplexity + maxPossible) / (maxPossible * 2)) * 100),
    lumpSum: Math.round(((scores.consistentVsLumpSum + maxPossible) / (maxPossible * 2)) * 100),
  };
}
