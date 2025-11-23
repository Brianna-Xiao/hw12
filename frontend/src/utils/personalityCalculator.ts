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
	// Generate 4-letter code based on new criteria
	// First letter: L (Long-term) or S (Short-term)
	const timeCode = scores.shortTermVsLongTerm >= 0 ? "L" : "S";

	// Second letter: H (High-risk) or R (Low-risk)
	const riskCode = scores.highRiskVsLowRisk >= 0 ? "R" : "H";

	// Third letter: C (Complex) or X (Clarity/Simple)
	const complexityCode = scores.clarityVsComplexity >= 0 ? "C" : "X";

	// Fourth letter: W (Windfall) or C (Consistent yield)
	const consistencyCode = scores.consistentVsLumpSum >= 0 ? "W" : "C";
	const code = `${timeCode}${riskCode}${complexityCode}${consistencyCode}`;

	// Determine color based on first two letters (group)
	let color = "hsl(var(--primary))";
	let groupName = "";

	if (timeCode === "L" && riskCode === "H") {
		// RED Group = "Bold" (Long-term + High-risk)
		color = "hsl(var(--high-risk))"; // #f25e62
		groupName = "Bold";
	} else if (timeCode === "S" && riskCode === "H") {
		// YELLOW Group = "Fast" (Short-term + High-risk)
		color = "hsl(var(--short-term))"; // #e2ad3a
		groupName = "Fast";
	} else if (timeCode === "S" && riskCode === "R") {
		// GREEN Group = "Safe" (Short-term + Low-risk)
		color = "hsl(var(--low-risk))"; // #33a474
		groupName = "Safe";
	} else if (timeCode === "L" && riskCode === "R") {
		// BLUE Group = "Steady" (Long-term + Low-risk)
		color = "hsl(var(--long-term))"; // #4398b4
		groupName = "Steady";
	}

	const personalityTypes: Record<string, { name: string; description: string }> = {
		// 🔴 RED Group = "Bold" (Long-term + High-risk)
		LHCC: {
			name: "The Visionary Builder",
			description:
				"Bold and patient, you embrace complex long-term strategies with consistent returns. You're willing to take risks to build something significant over time.",
		},
		LHCW: {
			name: "The Empire Architect",
			description:
				"You design intricate, ambitious long-term plans aimed at major windfalls. Risk doesn't intimidate you when there's potential for transformative gains.",
		},
		LHXC: {
			name: "The Steady Pioneer",
			description:
				"You prefer clear, bold long-term strategies that deliver regular progress. Simple approaches with high upside appeal to your patient yet daring nature.",
		},
		LHXW: {
			name: "The Strategic Gambler",
			description:
				"Simple yet bold, you target significant long-term windfalls. You're comfortable with risk and prefer straightforward approaches to major milestones.",
		},

		// 🟡 YELLOW Group = "Fast" (Short-term + High-risk)
		SHCC: {
			name: "The Dynamic Trader",
			description:
				"Fast-paced and analytical, you thrive on complex short-term strategies with consistent action. You enjoy the thrill of frequent, calculated risks.",
		},
		SHCW: {
			name: "The Aggressive Speculator",
			description:
				"You pursue complex short-term opportunities for major quick windfalls. High risk and high reward excite you when backed by sophisticated analysis.",
		},
		SHXC: {
			name: "The Quick Mover",
			description:
				"Simple and fast, you prefer clear short-term plays with regular opportunities. Speed and simplicity drive your bold decisions.",
		},
		SHXW: {
			name: "The Momentum Chaser",
			description:
				"You seek straightforward short-term opportunities for big, fast windfalls. Risk is acceptable when the potential payoff comes quickly.",
		},

		// 🟢 GREEN Group = "Safe" (Short-term + Low-risk)
		SRCC: {
			name: "The Prudent Tactician",
			description:
				"You favor complex but safe short-term strategies with steady results. Security and sophistication guide your near-term decisions.",
		},
		SRCW: {
			name: "The Careful Opportunist",
			description:
				"Conservative yet tactical, you seek complex short-term strategies for notable but secure windfalls. You balance safety with targeted opportunities.",
		},
		SRXC: {
			name: "The Safe Sprinter",
			description:
				"Simple and secure, you prefer clear short-term approaches with regular, predictable returns. Safety and consistency are your priorities.",
		},
		SRXW: {
			name: "The Conservative Achiever",
			description:
				"You look for straightforward, low-risk short-term opportunities that can yield meaningful windfalls. Security meets ambition in your approach.",
		},

		// 🔵 BLUE Group = "Steady" (Long-term + Low-risk)
		LRCC: {
			name: "The Patient Analyst",
			description:
				"You build complex, secure long-term strategies with consistent returns. Sophistication and safety define your patient approach to wealth building.",
		},
		LRCW: {
			name: "The Methodical Planner",
			description:
				"Complex and conservative, you design long-term strategies for significant secure windfalls. You value both sophistication and stability.",
		},
		LRXC: {
			name: "The Steady Builder",
			description:
				"Simple and secure, you prefer clear long-term approaches with regular progress. Patience, safety, and consistency are your foundation.",
		},
		LRXW: {
			name: "The Reliable Achiever",
			description:
				"Straightforward and patient, you work toward major long-term windfalls with minimal risk. Clarity and security guide your journey to success.",
		},
	};

	const typeInfo = personalityTypes[code] || {
		name: "The Financial Explorer",
		description:
			"Your unique combination of traits makes you adaptable and open to various financial strategies.",
	};

	return {
		code,
		name: typeInfo.name,
		description: typeInfo.description,
		color,
		group: groupName,
	};
}

export function getPercentages(scores: PersonalityScores) {
	// Convert scores to percentages (0-100)
	const maxPossible = 15; // 5 questions per axis * 3 max points

	const calculatePercentage = (score: number) => {
		let percentage = Math.round(((score + maxPossible) / (maxPossible * 2)) * 100);
		// Prevent exactly 50% - tip it to 51%
		if (percentage === 50) {
			percentage = 51;
		}
		return percentage;
	};

	return {
		longTerm: calculatePercentage(scores.shortTermVsLongTerm),
		lowRisk: calculatePercentage(scores.highRiskVsLowRisk),
		complexity: calculatePercentage(scores.clarityVsComplexity),
		windfall: calculatePercentage(scores.consistentVsLumpSum),
	};
}
