import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { getPercentages } from "@/utils/personalityCalculator";
import PersonalityBar from "@/components/PersonalityBar";

const Results = () => {
  const navigate = useNavigate();
  const { personalityType, personalityScores, role } = useUser();

  useEffect(() => {
    if (!personalityType || !personalityScores) {
      navigate("/quiz");
    }
  }, [personalityType, personalityScores, navigate]);

  if (!personalityType || !personalityScores) {
    return null;
  }

  const percentages = getPercentages(personalityScores);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card 
          className="p-8 md:p-12 text-center space-y-6 shadow-elevated animate-scale-in"
          style={{ borderTop: `4px solid ${personalityType.color}` }}
        >
          <div className="space-y-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {role === "investor" ? "Investor" : "Financial Advisor"}
            </Badge>
            
            <div className="space-y-2">
              <h1 
                className="text-6xl font-bold tracking-wider"
                style={{ color: personalityType.color }}
              >
                {personalityType.code}
              </h1>
              <h2 className="text-3xl font-bold">{personalityType.name}</h2>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {personalityType.description}
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6 shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-2xl font-bold text-center mb-8">Your Financial Profile</h3>
          
          <div className="space-y-8">
            <PersonalityBar
              label1="Short-Term"
              label2="Long-Term"
              percentage={percentages.longTerm}
              color1="hsl(var(--short-term))"
              color2="hsl(var(--long-term))"
              delay={400}
            />

            <PersonalityBar
              label1="High Risk"
              label2="Low Risk"
              percentage={percentages.lowRisk}
              color1="hsl(var(--high-risk))"
              color2="hsl(var(--low-risk))"
              delay={600}
            />

            <PersonalityBar
              label1="Clarity"
              label2="Complexity"
              percentage={percentages.complexity}
              color1="hsl(var(--primary))"
              color2="hsl(var(--accent))"
              delay={800}
            />

            <PersonalityBar
              label1="Consistent Yield"
              label2="Lump Sum"
              percentage={percentages.lumpSum}
              color1="hsl(var(--low-risk))"
              color2="hsl(var(--high-risk))"
              delay={1000}
            />
          </div>
        </Card>

        <div className="flex justify-center animate-fade-in" style={{ animationDelay: "1200ms" }}>
          <Button
            size="lg"
            className="spring-press text-lg px-8"
            onClick={() => navigate("/invest")}
          >
            View Your Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
