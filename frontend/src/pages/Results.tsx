import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { getPercentages } from "@/utils/personalityCalculator";
import PersonalityBar from "@/components/PersonalityBar";
import DimensionDetail from "@/components/DimensionDetail";
import { Users, TrendingUp, BarChart3, Target } from "lucide-react";

const dimensionDetails = {
  timeHorizon: {
    title: "Time Horizon",
    shortTerm: {
      description: "You prefer seeing results quickly and making decisions that provide immediate feedback. Short-term strategies and quick wins keep you motivated and engaged with your investments.",
    },
    longTerm: {
      description: "You likely focus on building wealth steadily over time and prefer strategies that compound over years. Patience and long-term thinking guide your investment decisions.",
    },
  },
  riskTolerance: {
    title: "Risk Tolerance",
    highRisk: {
      description: "You're comfortable with volatility and potential for higher returns. You understand that greater risk can lead to greater rewards and are willing to accept market fluctuations.",
    },
    lowRisk: {
      description: "You prefer stability and security in your investments. Conservative strategies that protect your capital while providing steady growth align with your financial comfort zone.",
    },
  },
  complexity: {
    title: "Investment Complexity",
    clarity: {
      description: "You value simplicity and clear, straightforward investment strategies. Easy-to-understand options that don't require deep financial knowledge work best for you.",
    },
    complexity: {
      description: "You enjoy diving into the details and understanding sophisticated investment strategies. Complex financial instruments and advanced strategies appeal to your analytical nature.",
    },
  },
  consistency: {
    title: "Investment Style",
    consistent: {
      description: "You prefer regular, predictable returns through consistent investment patterns. Steady contributions and gradual growth keep you motivated and on track.",
    },
    lumpSum: {
      description: "You're drawn to opportunities for significant gains, even if they require larger initial investments or waiting periods. Big wins and major milestones drive your investment approach.",
    },
  },
};

const Results = () => {
  const navigate = useNavigate();
  const { personalityType, personalityScores, role } = useUser();
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  useEffect(() => {
    if (!personalityType || !personalityScores) {
      navigate("/quiz");
    }
  }, [personalityType, personalityScores, navigate]);

  if (!personalityType || !personalityScores) {
    return null;
  }

  const percentages = getPercentages(personalityScores);

  const getDimensionDetail = (dimension: string) => {
    const isLongTerm = percentages.longTerm >= 50;
    const isLowRisk = percentages.lowRisk >= 50;
    const isComplex = percentages.complexity >= 50;
    const isLumpSum = percentages.lumpSum >= 50;

    switch (dimension) {
      case "timeHorizon":
        return {
          ...dimensionDetails.timeHorizon,
          percentage: isLongTerm ? percentages.longTerm : 100 - percentages.longTerm,
          dominantLabel: isLongTerm ? "Long-Term" : "Short-Term",
          color: "#4398b4",
          description: isLongTerm 
            ? dimensionDetails.timeHorizon.longTerm.description
            : dimensionDetails.timeHorizon.shortTerm.description,
          illustration: <Users className="w-32 h-32 text-muted-foreground/20" />,
        };
      case "riskTolerance":
        return {
          ...dimensionDetails.riskTolerance,
          percentage: isLowRisk ? percentages.lowRisk : 100 - percentages.lowRisk,
          dominantLabel: isLowRisk ? "Low Risk" : "High Risk",
          color: "#e4ae3a",
          description: isLowRisk
            ? dimensionDetails.riskTolerance.lowRisk.description
            : dimensionDetails.riskTolerance.highRisk.description,
          illustration: <TrendingUp className="w-32 h-32 text-muted-foreground/20" />,
        };
      case "complexity":
        return {
          ...dimensionDetails.complexity,
          percentage: isComplex ? percentages.complexity : 100 - percentages.complexity,
          dominantLabel: isComplex ? "Complexity" : "Clarity",
          color: "#33a474",
          description: isComplex
            ? dimensionDetails.complexity.complexity.description
            : dimensionDetails.complexity.clarity.description,
          illustration: <BarChart3 className="w-32 h-32 text-muted-foreground/20" />,
        };
      case "consistency":
        return {
          ...dimensionDetails.consistency,
          percentage: isLumpSum ? percentages.lumpSum : 100 - percentages.lumpSum,
          dominantLabel: isLumpSum ? "Lump Sum" : "Consistent Yield",
          color: "#f25e62",
          description: isLumpSum
            ? dimensionDetails.consistency.lumpSum.description
            : dimensionDetails.consistency.consistent.description,
          illustration: <Target className="w-32 h-32 text-muted-foreground/20" />,
        };
      default:
        return null;
    }
  };

  const currentDetail = hoveredDimension ? getDimensionDetail(hoveredDimension) : null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 space-y-6 shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-2xl font-bold text-center mb-8">Your Financial Profile</h3>
            
            <div className="space-y-8">
              <PersonalityBar
                label1="Short-Term"
                label2="Long-Term"
                percentage={percentages.longTerm}
                color="#4398b4"
                delay={400}
                onHover={() => setHoveredDimension("timeHorizon")}
                onLeave={() => setHoveredDimension(null)}
              />

              <PersonalityBar
                label1="High Risk"
                label2="Low Risk"
                percentage={percentages.lowRisk}
                color="#e4ae3a"
                delay={600}
                onHover={() => setHoveredDimension("riskTolerance")}
                onLeave={() => setHoveredDimension(null)}
              />

              <PersonalityBar
                label1="Clarity"
                label2="Complexity"
                percentage={percentages.complexity}
                color="#33a474"
                delay={800}
                onHover={() => setHoveredDimension("complexity")}
                onLeave={() => setHoveredDimension(null)}
              />

              <PersonalityBar
                label1="Consistent Yield"
                label2="Lump Sum"
                percentage={percentages.lumpSum}
                color="#f25e62"
                delay={1000}
                onHover={() => setHoveredDimension("consistency")}
                onLeave={() => setHoveredDimension(null)}
              />
            </div>
          </Card>

          <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            {currentDetail ? (
              <DimensionDetail
                title={currentDetail.title}
                percentage={currentDetail.percentage}
                dominantLabel={currentDetail.dominantLabel}
                color={currentDetail.color}
                description={currentDetail.description}
                illustration={currentDetail.illustration}
              />
            ) : (
              <Card className="p-6 space-y-6 shadow-elevated h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg">Hover over a dimension to learn more</p>
                </div>
              </Card>
            )}
          </div>
        </div>

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
