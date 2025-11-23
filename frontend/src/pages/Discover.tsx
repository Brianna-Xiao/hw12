import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchCard from "@/components/MatchCard";
import { generateMatches } from "@/data/mockMatches";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Discover = () => {
  const navigate = useNavigate();
  const { personalityScores, role } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (!personalityScores || !role) {
      navigate("/");
      return;
    }

    const generatedMatches = generateMatches(personalityScores, role);
    setMatches(generatedMatches);
  }, [personalityScores, role, navigate]);

  const handleConnect = () => {
    toast({
      title: "Connection Sent!",
      description: "Your connection request has been sent.",
    });
  };

  const handleNext = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="min-h-screen md:pl-20 pb-20 md:pb-8 flex items-center justify-center">
        <Navigation />
        <p className="text-muted-foreground">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pl-20 pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 animate-slide-up">
          <h1 className="text-3xl font-bold">Discover Matches</h1>
          <p className="text-muted-foreground">
            Find {role === "investor" ? "advisors" : "investors"} who match your financial personality
          </p>
        </div>

        <div className="relative">
          <MatchCard
            match={matches[currentIndex]}
            onConnect={handleConnect}
          />

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="spring-press"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {matches.length}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === matches.length - 1}
              className="spring-press"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
