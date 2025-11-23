import React, { createContext, useContext, useState, ReactNode } from "react";
import {
	Role,
	QuizAnswer,
	PersonalityScores,
	PersonalityType,
	UserProfile,
} from "@/types/personality";

interface UserContextType {
	role: Role | null;
	setRole: (role: Role) => void;
	quizAnswers: QuizAnswer[];
	addQuizAnswer: (answer: QuizAnswer) => void;
	personalityScores: PersonalityScores | null;
	setPersonalityScores: (scores: PersonalityScores) => void;
	personalityType: PersonalityType | null;
	setPersonalityType: (type: PersonalityType) => void;
	currentUser: UserProfile | null;
	setCurrentUser: (user: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<Role | null>(null);
	const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
	const [personalityScores, setPersonalityScores] = useState<PersonalityScores | null>(null);
	const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
	const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

	const addQuizAnswer = (answer: QuizAnswer) => {
		setQuizAnswers((prev) => {
			const existing = prev.findIndex((a) => a.questionIndex === answer.questionIndex);
			if (existing !== -1) {
				const updated = [...prev];
				updated[existing] = answer;
				return updated;
			}
			return [...prev, answer];
		});
	};

	return (
		<UserContext.Provider
			value={{
				role,
				setRole,
				quizAnswers,
				addQuizAnswer,
				personalityScores,
				setPersonalityScores,
				personalityType,
				setPersonalityType,
				currentUser,
				setCurrentUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
