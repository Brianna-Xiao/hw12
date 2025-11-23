import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuizQuestion from "@/components/QuizQuestion";
import { quizQuestions, advisorQuestions } from "@/data/quizQuestions";
import { useUser } from "@/contexts/UserContext";
import { calculatePersonalityScores, getPersonalityType } from "@/utils/personalityCalculator";
import { saveQuizResults, getUserId } from "@/services/firebaseService";
import { toast } from "sonner";

const Quiz = () => {
	const navigate = useNavigate();
	const { role, quizAnswers, addQuizAnswer, setPersonalityScores, setPersonalityType } =
		useUser();
	const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});

	// Use advisor questions if role is advisor, otherwise use investor questions
	const questions = role === "advisor" ? advisorQuestions : quizQuestions;

	useEffect(() => {
		if (!role) {
			navigate("/role-selection");
		}
	}, [role, navigate]);

	useEffect(() => {
		// Load existing answers
		const answersMap: Record<number, number> = {};
		quizAnswers.forEach((answer) => {
			answersMap[answer.questionIndex] = answer.value;
		});
		setCurrentAnswers(answersMap);
	}, [quizAnswers]);

	const handleAnswerChange = (questionIndex: number, value: number) => {
		setCurrentAnswers((prev) => ({
			...prev,
			[questionIndex]: value,
		}));
		addQuizAnswer({ questionIndex, value });
	};

	const handleSubmit = async () => {
		const allAnswers = Object.entries(currentAnswers).map(([index, value]) => ({
			questionIndex: parseInt(index),
			value,
		}));

		const scores = calculatePersonalityScores(allAnswers);
		const type = getPersonalityType(scores);

		setPersonalityScores(scores);
		setPersonalityType(type);

		// Navigate immediately - don't wait for Firebase
		navigate("/results");

		// Save to Firebase in the background (non-blocking)
		if (!role) {
			console.error("Role is required to save quiz results");
			return;
		}

		// Save asynchronously without blocking navigation
		saveQuizResults(getUserId(), role, allAnswers, scores, type)
			.then(() => {
				console.log("Quiz results saved to Firebase successfully");
				// Optionally show a subtle notification
				toast.success("Results saved", { duration: 2000 });
			})
			.catch((error) => {
				console.error("Failed to save quiz results to Firebase:", error);
				// Don't show error toast - save failed silently in background
				// User already navigated away, so they don't need to see this
			});
	};

	const answeredCount = Object.keys(currentAnswers).length;
	const progress = (answeredCount / questions.length) * 100;
	const isComplete = answeredCount === questions.length;

	return (
		<div className="min-h-screen py-12 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="space-y-4 animate-slide-up">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold">Financial Personality Quiz</h1>
						<span className="text-sm text-muted-foreground">
							{answeredCount} / {questions.length}
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<Card className="p-6 shadow-card">
					<div className="space-y-4">
						{questions.map((question, index) => (
							<QuizQuestion
								key={question.id}
								questionNumber={index + 1}
								totalQuestions={questions.length}
								questionText={question.text}
								value={currentAnswers[index] || 0}
								onChange={(value) => handleAnswerChange(index, value)}
							/>
						))}
					</div>
				</Card>

				<div className="flex justify-end">
					<Button
						size="lg"
						onClick={handleSubmit}
						disabled={!isComplete}
						className="spring-press"
					>
						View Results
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Quiz;
