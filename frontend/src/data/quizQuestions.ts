export interface QuizQuestion {
  id: number;
  text: string;
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
    axis: "riskTolerance",
    reverse: true,
  },
  {
    id: 9,
    text: "You feel more confident when things are explained in a simple, straightforward way.",
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
    axis: "complexity",
  },
  {
    id: 13,
    text: "You'd rather see small, steady progress than wait a long time for one big result.",
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
    axis: "timeHorizon",
    reverse: true,
  },
];
