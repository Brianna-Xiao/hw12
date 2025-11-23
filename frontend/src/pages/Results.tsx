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
import { generateInvestorReport, InvestorReport } from "@/utils/generateInvestorReport";

const Results = () => {
  const navigate = useNavigate();
  const { personalityType, personalityScores, role } = useUser();
  const [hoveredDimension, setHoveredDimension] = useState<keyof InvestorReport["dimensions"] | null>(null);

  const [report, setReport] = useState<InvestorReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    if (!personalityType || !personalityScores) return;

    (async () => {
      setLoadingReport(true);
      try {
        const result = await generateInvestorReport(personalityType, personalityScores, role);
        setReport(result);
      } catch (err) {
        console.error("AI error:", err);
      }
      setLoadingReport(false);
    })();
  }, [personalityType, personalityScores, role]);

  if (!personalityType || !personalityScores) {
    return null;
  }

  const percentages = getPercentages(personalityScores);

  const getAIDimensionDetail = (dimension: keyof InvestorReport["dimensions"]) => {
  if (!report) return null;

    return {
      title:
        dimension === "timeHorizon"
          ? "Time Horizon"
          : dimension === "riskTolerance"
          ? "Risk Tolerance"
          : dimension === "complexity"
          ? "Investment Complexity"
          : "Investment Style",

      percentage:
        dimension === "timeHorizon"
          ? percentages.longTerm
          : dimension === "riskTolerance"
          ? percentages.lowRisk
          : dimension === "complexity"
          ? percentages.complexity
          : percentages.lumpSum,

      dominantLabel: report.dimensions[dimension].dominantLabel,
      description: report.dimensions[dimension].description,
      color:
        dimension === "timeHorizon"
          ? "#4398b4"
          : dimension === "riskTolerance"
          ? "#e4ae3a"
          : dimension === "complexity"
          ? "#33a474"
          : "#f25e62",

      illustration:
        dimension === "timeHorizon"
          ? <Users className="w-32 h-32 text-muted-foreground/20" />
          : dimension === "riskTolerance"
          ? <TrendingUp className="w-32 h-32 text-muted-foreground/20" />
          : dimension === "complexity"
          ? <BarChart3 className="w-32 h-32 text-muted-foreground/20" />
          : <Target className="w-32 h-32 text-muted-foreground/20" />,
    };
  };

  const currentDetail = hoveredDimension ? getAIDimensionDetail(hoveredDimension) : null;

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
