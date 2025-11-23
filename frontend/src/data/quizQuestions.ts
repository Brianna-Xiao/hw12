export interface QuizQuestion {
	id: number;
	text: string;
	advisorText?: string; // Alternative text for financial advisors
	axis: "timeHorizon" | "riskTolerance" | "complexity" | "consistency";
	reverse?: boolean; // if true, higher scores favor the opposite trait
}

export const quizQuestions: QuizQuestion[] = [
	{
		id: 1,
		text: "You tend to focus more on what's happening in the next few months than on where you'll be many years from now.",
		axis: "timeHorizon",
		reverse: true,
	},
	{
		id: 2,
		text: "Planning far ahead (5–10+ years) feels motivating rather than overwhelming to you.",
		advisorText:
			"When advising clients, you naturally focus on helping them build long-term plans rather than short-term wins.",
		axis: "timeHorizon",
	},
	{
		id: 3,
		text: "You often prefer options that give you a quick result, even if the long-term outcome is uncertain.",
		axis: "timeHorizon",
		reverse: true,
	},
	{
		id: 4,
		text: "You are comfortable waiting a long time for a goal if you believe the payoff will be worth it.",
		axis: "timeHorizon",
	},
	{
		id: 5,
		text: "You enjoy the excitement of uncertain outcomes, even if there's a real chance things won't work out.",
		axis: "riskTolerance",
		reverse: true,
	},
	{
		id: 6,
		text: "You usually choose the safer path, even when a riskier option might bring a bigger reward.",
		advisorText:
			"You feel more aligned with strategies that prioritize stability and lower risk over uncertain, high-upside opportunities.",
		axis: "riskTolerance",
	},
	{
		id: 7,
		text: "You'd rather avoid losing money than chase the chance of making a lot more.",
		axis: "riskTolerance",
	},
	{
		id: 8,
		text: "Being an early adopter or trying something unproven appeals to you.",
		advisorText:
			"You're comfortable guiding clients through situations where the outcome isn't fully predictable.",
		axis: "riskTolerance",
		reverse: true,
	},
	{
		id: 9,
		text: "You feel more confident when things are explained in a simple, straightforward way.",
		advisorText:
			"You prefer presenting clients with clear, simple explanations even when the underlying strategy is more complex.",
		axis: "complexity",
		reverse: true,
	},
	{
		id: 10,
		text: "You're naturally drawn to complex systems, even if they take longer to fully understand.",
		axis: "complexity",
	},
	{
		id: 11,
		text: "Given two choices, you usually pick the one that is easier to understand, even if the other might be more powerful.",
		axis: "complexity",
		reverse: true,
	},
	{
		id: 12,
		text: "You enjoy digging into the fine print and details before you feel comfortable with a decision.",
		advisorText:
			"You enjoy diving into detailed financial structures when helping clients understand their options.",
		axis: "complexity",
	},
	{
		id: 13,
		text: "You'd rather see small, steady progress than wait a long time for one big result.",
		advisorText:
			"You tend to favor steady, incremental progress for clients rather than strategies with large but infrequent outcomes.",
		axis: "consistency",
		reverse: true,
	},
	{
		id: 14,
		text: "You are okay with getting nothing for a while if it means a larger outcome later.",
		axis: "consistency",
	},
	{
		id: 15,
		text: "Regular, predictable 'wins' keep you more motivated than occasional big breakthroughs.",
		axis: "consistency",
		reverse: true,
	},
	{
		id: 16,
		text: "You don't mind ups and downs along the way as long as the overall result is strong.",
		axis: "consistency",
	},
	{
		id: 17,
		text: "Spontaneous opportunities often feel more exciting to you than carefully scheduled plans.",
		axis: "timeHorizon",
		reverse: true,
	},
	{
		id: 18,
		text: "You feel more at ease when there is a clear plan and structure for how things will unfold.",
		advisorText:
			"You feel most effective when there is a clear plan or roadmap guiding your client's financial decisions.",
		axis: "consistency",
		reverse: true,
	},
	{
		id: 19,
		text: "When you commit to something, you prefer to stick with it for a long time rather than change directions frequently.",
		axis: "timeHorizon",
	},
	{
		id: 20,
		text: "You're comfortable adjusting your path quickly if you see a potentially better option.",
		advisorText:
			"You're comfortable adjusting your recommendations quickly when new information or opportunities appear.",
		axis: "timeHorizon",
		reverse: true,
	},
];

export const advisorQuestions: QuizQuestion[] = [
	{
		id: 1,
		text: "When advising clients, you naturally focus on helping them build long-term plans rather than short-term wins.",
		axis: "timeHorizon",
	},
	{
		id: 2,
		text: "You feel more aligned with strategies that prioritize stability and lower risk over uncertain, high-upside opportunities.",
		axis: "riskTolerance",
	},
	{
		id: 3,
		text: "You're comfortable guiding clients through situations where the outcome isn't fully predictable.",
		axis: "riskTolerance",
		reverse: true,
	},
	{
		id: 4,
		text: "You prefer presenting clients with clear, simple explanations even when the underlying strategy is more complex.",
		axis: "complexity",
		reverse: true,
	},
	{
		id: 5,
		text: "You enjoy diving into detailed financial structures when helping clients understand their options.",
		axis: "complexity",
	},
	{
		id: 6,
		text: "You tend to favor steady, incremental progress for clients rather than strategies with large but infrequent outcomes.",
		axis: "consistency",
		reverse: true,
	},
	{
		id: 7,
		text: "You feel most effective when there is a clear plan or roadmap guiding your client's financial decisions.",
		axis: "consistency",
		reverse: true,
	},
	{
		id: 8,
		text: "You're comfortable adjusting your recommendations quickly when new information or opportunities appear.",
		axis: "timeHorizon",
		reverse: true,
	},
];
