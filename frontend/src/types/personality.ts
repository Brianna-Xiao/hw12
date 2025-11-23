export type Role = "investor" | "advisor";

export interface QuizAnswer {
	questionIndex: number;
	value: number; // 1-7 scale
}

export interface PersonalityScores {
	shortTermVsLongTerm: number; // -3 to +3 (negative = short-term, positive = long-term)
	highRiskVsLowRisk: number; // -3 to +3 (negative = high-risk, positive = low-risk)
	clarityVsComplexity: number; // -3 to +3 (negative = clarity, positive = complexity)
	consistentVsLumpSum: number; // -3 to +3 (negative = consistent, positive = windfall)
}

export interface PersonalityType {
	code: string; // 4-letter code (e.g., "LHCW")
	name: string;
	description: string;
	color: string; // group color (Red, Yellow, Green, or Blue)
	group?: string; // group name: "Bold", "Fast", "Safe", or "Steady"
}
export interface UserProfile {
	id: string;
	name: string;
	pronouns?: string;
	role: Role;
	bio?: string;
	avatar?: string;
	personalityType: PersonalityType;
	scores: PersonalityScores;
}

export interface ETF {
	id: string;
	ticker: string;
	name: string;
	description: string;
	expenseRatio: number;
	tags: string[];
	personalityMatch: string[];
	chartData?: number[];
}

export interface ETFPost {
	id: string;
	etf: ETF;
	author: UserProfile;
	timestamp: Date;
	comments: Comment[];
}

export interface Comment {
	id: string;
	author: UserProfile;
	content: string;
	timestamp: Date;
}

export interface Match {
	id: string;
	user: UserProfile;
	score: number; // 0-100
	reason: string;
}
