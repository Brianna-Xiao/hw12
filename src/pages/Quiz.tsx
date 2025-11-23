import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuizQuestion from "@/components/QuizQuestion";
import { quizQuestions } from "@/data/quizQuestions";
import { useUser } from "@/contexts/UserContext";
import { calculatePersonalityScores, getPersonalityType } from "@/utils/personalityCalculator";

const Quiz = () => {
  const navigate = useNavigate();
  const { role, quizAnswers, addQuizAnswer, setPersonalityScores, setPersonalityType } = useUser();
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});

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

  const handleSubmit = () => {
    const allAnswers = Object.entries(currentAnswers).map(([index, value]) => ({
      questionIndex: parseInt(index),
      value,
    }));

    const scores = calculatePersonalityScores(allAnswers);
    const type = getPersonalityType(scores);

    setPersonalityScores(scores);
    setPersonalityType(type);
    navigate("/results");
  };

  const answeredCount = Object.keys(currentAnswers).length;
  const progress = (answeredCount / quizQuestions.length) * 100;
  const isComplete = answeredCount === quizQuestions.length;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Financial Personality Quiz</h1>
            <span className="text-sm text-muted-foreground">
              {answeredCount} / {quizQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 shadow-card">
          <div className="space-y-4">
            {quizQuestions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                questionNumber={index + 1}
                totalQuestions={quizQuestions.length}
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
