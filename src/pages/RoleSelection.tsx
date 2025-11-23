import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { TrendingUp, Users } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setRole } = useUser();

  const handleRoleSelect = (role: "investor" | "advisor") => {
    setRole(role);
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground">Select how you'd like to use the platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 cursor-pointer hover-lift shadow-card transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => handleRoleSelect("investor")}
          >
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Investor</h2>
              <p className="text-muted-foreground">
                Discover your investment personality, explore ETFs, and connect with advisors and fellow investors.
              </p>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover-lift shadow-card transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => handleRoleSelect("advisor")}
          >
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-long-term/10">
                <Users className="w-8 h-8 text-long-term" />
              </div>
              <h2 className="text-2xl font-bold">Financial Advisor</h2>
              <p className="text-muted-foreground">
                Understand client personalities, match with potential clients, and provide personalized recommendations.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
