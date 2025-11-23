import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  value: number;
  onChange: (value: number) => void;
}

const QuizQuestion = ({ questionNumber, totalQuestions, questionText, value, onChange }: QuizQuestionProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const labels = [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Disagree",
    "Neutral",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree",
  ];

  return (
    <div className="space-y-6 py-8 border-b border-border last:border-0">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {questionNumber} of {totalQuestions}</span>
        </div>
        <h3 className="text-lg font-medium">{questionText}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((val) => (
            <button
              key={val}
              onClick={() => onChange(val)}
              onMouseEnter={() => setHoveredValue(val)}
              onMouseLeave={() => setHoveredValue(null)}
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all duration-200 spring-press",
                value === val
                  ? "bg-primary border-primary scale-110 shadow-lg"
                  : hoveredValue === val
                  ? "border-primary/50 scale-105"
                  : "border-border hover:border-primary/30"
              )}
              aria-label={labels[val - 1]}
            >
              {value === val && <div className="w-full h-full rounded-full bg-white/20" />}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>

        {(value > 0 || hoveredValue) && (
          <div className="text-center text-sm text-primary font-medium animate-fade-in">
            {labels[(hoveredValue || value) - 1]}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
