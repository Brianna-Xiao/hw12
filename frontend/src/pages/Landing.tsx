import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero">
      <div className="max-w-3xl text-center space-y-8 animate-slide-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-high-risk bg-clip-text text-transparent">
          Discover Your Financial Personality
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover yourself. Grow your wealth.
        </p>

        <Button
          size="lg"
          className="text-lg px-8 py-6 rounded-full spring-press shadow-elevated hover:shadow-hover"
          onClick={() => navigate("/role-selection")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Landing;
