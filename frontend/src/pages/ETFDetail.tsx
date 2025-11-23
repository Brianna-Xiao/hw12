import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockETFs } from "@/data/mockETFs";
import { ArrowLeft, Bookmark, TrendingUp } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const ETFDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; author: string; content: string }>>([
    { id: "1", author: "Sarah", content: "Great ETF for long-term growth!" },
    { id: "2", author: "Mike", content: "Low fees and solid performance." },
  ]);

  const etf = mockETFs.find((e) => e.id === id);

  if (!etf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">ETF Not Found</h1>
          <Button onClick={() => navigate("/invest")}>Back to Invest</Button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        { id: Date.now().toString(), author: "You", content: comment },
      ]);
      setComment("");
    }
  };

  const personalityColor = etf.personalityMatch.includes("Long-Term")
    ? "hsl(var(--long-term))"
    : etf.personalityMatch.includes("Short-Term")
    ? "hsl(var(--short-term))"
    : etf.personalityMatch.includes("Low Risk")
    ? "hsl(var(--low-risk))"
    : "hsl(var(--high-risk))";

  return (
    <div className="min-h-screen md:pl-20 pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/invest")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card
          className="p-8 space-y-6 shadow-elevated animate-slide-up"
          style={{ borderTop: `4px solid ${personalityColor}` }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{etf.ticker}</h1>
                <TrendingUp className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground">{etf.name}</p>
            </div>
            <Button variant="outline" size="icon" className="spring-press">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{etf.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Expense Ratio</h3>
                <p className="text-2xl font-bold">{etf.expenseRatio}%</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Level</h3>
                <Badge
                  style={{ backgroundColor: personalityColor }}
                  className="text-white"
                >
                  {etf.personalityMatch[1] || "Medium"}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5-Year Performance</h3>
              <div className="h-32 flex items-end gap-1">
                {etf.chartData?.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${(value / 200) * 100}%`,
                      backgroundColor: personalityColor,
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Why it fits your personality</h3>
              <div className="flex flex-wrap gap-2">
                {etf.personalityMatch.map((match) => (
                  <Badge
                    key={match}
                    style={{ backgroundColor: personalityColor }}
                    className="text-white"
                  >
                    {match}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This ETF aligns with your financial personality traits, making it a suitable
                match for your investment goals and risk tolerance.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 shadow-card animate-fade-in">
          <h3 className="text-xl font-bold">Comments</h3>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{c.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm">{c.author}</p>
                  <p className="text-sm text-muted-foreground">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} className="spring-press">
              Post
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ETFDetail;
