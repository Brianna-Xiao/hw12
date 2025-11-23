import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ETF } from "@/types/personality";
import { TrendingUp } from "lucide-react";

interface ETFCardProps {
  etf: ETF;
  onClick?: () => void;
}

const ETFCard = ({ etf, onClick }: ETFCardProps) => {
  const personalityColor = etf.personalityMatch.includes("Long-Term")
    ? "hsl(var(--long-term))"
    : etf.personalityMatch.includes("Short-Term")
    ? "hsl(var(--short-term))"
    : etf.personalityMatch.includes("Low Risk")
    ? "hsl(var(--low-risk))"
    : "hsl(var(--high-risk))";

  return (
    <Card
      className="p-6 cursor-pointer hover-lift shadow-card transition-all duration-300"
      style={{ borderLeft: `4px solid ${personalityColor}` }}
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{etf.ticker}</h3>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{etf.name}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {etf.expenseRatio}% ER
          </Badge>
        </div>

        <p className="text-sm line-clamp-2">{etf.description}</p>

        <div className="flex flex-wrap gap-2">
          {etf.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {etf.personalityMatch.map((match) => (
            <Badge
              key={match}
              className="text-xs"
              style={{
                backgroundColor: personalityColor,
                color: "white",
              }}
            >
              {match}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ETFCard;
