import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Match } from "@/types/personality";
import { TrendingUp, Users } from "lucide-react";

interface MatchCardProps {
  match: Match;
  onConnect: () => void;
}

const MatchCard = ({ match, onConnect }: MatchCardProps) => {
  const { user, score, reason } = match;

  return (
    <Card className="p-8 text-center space-y-6 shadow-elevated hover-lift animate-scale-in max-w-md mx-auto">
      <div className="space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarFallback className="text-2xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {user.pronouns && (
            <p className="text-sm text-muted-foreground">{user.pronouns}</p>
          )}
          <Badge variant="outline" className="gap-1">
            {user.role === "advisor" ? (
              <>
                <Users className="w-3 h-3" />
                Financial Advisor
              </>
            ) : (
              <>
                <TrendingUp className="w-3 h-3" />
                Investor
              </>
            )}
          </Badge>
        </div>

        {user.bio && (
          <p className="text-muted-foreground">{user.bio}</p>
        )}

        <div
          className="inline-block px-6 py-3 rounded-full font-bold text-2xl"
          style={{
            backgroundColor: user.personalityType.color,
            color: "white",
          }}
        >
          {user.personalityType.code}
        </div>

        <div>
          <p className="font-semibold">{user.personalityType.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {user.personalityType.description}
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <div
            className="text-4xl font-bold"
            style={{ color: user.personalityType.color }}
          >
            {score}% Match
          </div>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full spring-press"
        onClick={onConnect}
      >
        Connect
      </Button>
    </Card>
  );
};

export default MatchCard;
