import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import Navigation from "@/components/Navigation";
import { TrendingUp, Users } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { personalityType, role } = useUser();

  useEffect(() => {
    if (!personalityType) {
      navigate("/");
    }
  }, [personalityType, navigate]);

  if (!personalityType) {
    return null;
  }

  const mockActivities = [
    { id: "1", type: "comment", content: "Great ETF for long-term growth!", etf: "VOO" },
    { id: "2", type: "comment", content: "Interesting risk profile", etf: "ARKK" },
    { id: "3", type: "comment", content: "Perfect for my portfolio", etf: "SCHD" },
  ];

  return (
    <div className="min-h-screen md:pl-20 pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-8 text-center space-y-6 shadow-elevated animate-slide-up">
          <Avatar className="w-32 h-32 mx-auto">
            <AvatarFallback className="text-4xl">
              {role === "investor" ? "I" : "A"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Your Name</h1>
            <p className="text-muted-foreground">they/them</p>
            <Badge variant="outline" className="gap-1">
              {role === "advisor" ? (
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

          <p className="text-muted-foreground max-w-md mx-auto">
            Building wealth through thoughtful, personality-driven investment strategies.
          </p>

          <div
            className="inline-block px-8 py-4 rounded-full font-bold text-3xl"
            style={{
              backgroundColor: personalityType.color,
              color: "white",
            }}
          >
            {personalityType.code}
          </div>

          <div>
            <p className="font-semibold text-xl">{personalityType.name}</p>
            <p className="text-muted-foreground mt-2">
              {personalityType.description}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Financial Traits</h2>
          <div className="flex flex-wrap gap-2">
            <Badge className="text-sm" style={{ backgroundColor: "hsl(var(--long-term))" }}>
              #LongTerm
            </Badge>
            <Badge className="text-sm" style={{ backgroundColor: "hsl(var(--low-risk))" }}>
              #LowRisk
            </Badge>
            <Badge className="text-sm" style={{ backgroundColor: "hsl(var(--primary))" }}>
              #Simple
            </Badge>
            <Badge className="text-sm" style={{ backgroundColor: "hsl(var(--low-risk))" }}>
              #Consistent
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {mockActivities.map((activity) => (
              <Card key={activity.id} className="p-4 space-y-2 shadow-card">
                <Badge variant="outline" className="text-xs">{activity.etf}</Badge>
                <p className="text-sm">{activity.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
