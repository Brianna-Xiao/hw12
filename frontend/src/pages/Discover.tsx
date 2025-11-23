// ...existing code...
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { getPercentages } from "@/utils/personalityCalculator";

const DIMENSION_COLORS = {
  timeHorizon: "#4398b4",
  riskTolerance: "#e4ae3a",
  complexity: "#33a474",
  consistency: "#f25e62",
};

const MOCK_PROFILES = [
  // friends (all women)
  {
    id: "p1",
    name: "Yasna Moosavi",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    title: "Student at Bayview Secondary School",
    role: "friend",
    matchPercentage: 82,
    personalityDescription: "Short-term oriented, likes quick wins and clear outcomes.",
    personalityPercentages: { longTerm: 35, lowRisk: 60, complexity: 25, lumpSum: 45 },
    tags: ["Short-Term", "Low Risk", "Clarity"],
    bio: "Student interested in personal finance and easy-to-follow investing strategies.",
  },
  {
    id: "p2",
    name: "Maya Collado",
    avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    title: "Kinesiology Student at Western University",
    role: "friend",
    matchPercentage: 76,
    personalityDescription: "Risk-aware and prefers steady, predictable approaches.",
    personalityPercentages: { longTerm: 50, lowRisk: 68, complexity: 30, lumpSum: 20 },
    tags: ["Long-Term", "Low Risk", "Clarity"],
    bio: "Studying kinesiology; exploring long-term saving strategies.",
  },
  {
    id: "p3",
    name: "Emma Sproxton",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Student at Western University",
    role: "friend",
    matchPercentage: 71,
    personalityDescription: "Values consistency and predictable returns over big swings.",
    personalityPercentages: { longTerm: 60, lowRisk: 72, complexity: 40, lumpSum: 35 },
    tags: ["Long-Term", "Low Risk", "Consistent"],
    bio: "Second year business management student exploring steady investing.",
  },
  {
    id: "p4",
    name: "Alexandra Johnson",
    avatarUrl: "https://randomuser.me/api/portraits/women/76.jpg",
    title: "Software Engineer",
    role: "friend",
    matchPercentage: 88,
    personalityDescription: "Enjoys diving into complex strategies and maximizing returns.",
    personalityPercentages: { longTerm: 70, lowRisk: 20, complexity: 85, lumpSum: 60 },
    tags: ["Long-Term", "Complex", "Lump Sum"],
    bio: "Engineer who enjoys quantitative strategies and advanced instruments.",
  },
  {
    id: "p5",
    name: "Sophie Martin",
    avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    title: "Marketing Specialist",
    role: "friend",
    matchPercentage: 67,
    personalityDescription: "Prefers clarity and simple strategies with occasional risk.",
    personalityPercentages: { longTerm: 45, lowRisk: 55, complexity: 30, lumpSum: 40 },
    tags: ["Clarity", "Moderate Risk", "Consistent"],
    bio: "Marketing lead who favors straightforward investment approaches.",
  },
  {
    id: "p6",
    name: "Daniela Reyes",
    avatarUrl: "https://randomuser.me/api/portraits/women/85.jpg",
    title: "Finance Intern",
    role: "friend",
    matchPercentage: 74,
    personalityDescription: "Balanced: open to complexity but prefers some predictability.",
    personalityPercentages: { longTerm: 55, lowRisk: 50, complexity: 55, lumpSum: 50 },
    tags: ["Balanced", "Moderate Complexity"],
    bio: "Intern exploring different investment strategies and learning fast.",
  },

  // advisors (all women)
  {
    id: "a1",
    name: "Dr. Priya Patel",
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    title: "Certified Financial Advisor",
    role: "advisor",
    matchPercentage: 93,
    personalityDescription: "Long-term focused advisor who builds diversified portfolios.",
    personalityPercentages: { longTerm: 85, lowRisk: 70, complexity: 50, lumpSum: 30 },
    tags: ["Long-Term", "Low Risk", "Diversification"],
    bio: "15+ years advising individuals on retirement and portfolio allocation.",
  },
  {
    id: "a2",
    name: "Michelle Chen",
    avatarUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    title: "Wealth Manager",
    role: "advisor",
    matchPercentage: 89,
    personalityDescription: "Comfortable with volatility for higher long-term gains.",
    personalityPercentages: { longTerm: 75, lowRisk: 30, complexity: 65, lumpSum: 70 },
    tags: ["Long-Term", "High Risk Tolerance", "Complex Strategies"],
    bio: "Works with high-net-worth clients on growth-oriented strategies.",
  },
  {
    id: "a3",
    name: "Linda Park",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    title: "Independent Financial Advisor",
    role: "advisor",
    matchPercentage: 81,
    personalityDescription: "Prefers clear, simple strategies and regular contributions.",
    personalityPercentages: { longTerm: 60, lowRisk: 65, complexity: 25, lumpSum: 20 },
    tags: ["Clarity", "Consistent Yield"],
    bio: "Independent advisor focused on savings plans and conservative strategies.",
  },
  {
    id: "a4",
    name: "Esther Brooks",
    avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg",
    title: "Portfolio Strategist",
    role: "advisor",
    matchPercentage: 77,
    personalityDescription: "Uses a mix of complex instruments with disciplined timing.",
    personalityPercentages: { longTerm: 68, lowRisk: 40, complexity: 70, lumpSum: 55 },
    tags: ["Complex", "Lump Sum", "Strategist"],
    bio: "Designs tactical allocations and alternative exposures for clients.",
  },
  {
    id: "a5",
    name: "Nora White",
    avatarUrl: "https://randomuser.me/api/portraits/women/14.jpg",
    title: "Retirement Planner",
    role: "advisor",
    matchPercentage: 84,
    personalityDescription: "Focuses on long-term safety and steady growth for retirement.",
    personalityPercentages: { longTerm: 90, lowRisk: 80, complexity: 20, lumpSum: 10 },
    tags: ["Long-Term", "Low Risk", "Retirement"],
    bio: "Specializes in retirement-ready portfolios and steady income planning.",
  },
  {
    id: "a6",
    name: "Omara Haddad",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    title: "Investment Consultant",
    role: "advisor",
    matchPercentage: 70,
    personalityDescription: "Open to lump-sum opportunities and targeted risk exposures.",
    personalityPercentages: { longTerm: 50, lowRisk: 35, complexity: 60, lumpSum: 80 },
    tags: ["Lump Sum", "Opportunistic", "Complex"],
    bio: "Consults on targeted opportunities and concentrated investments.",
  },
];

const ITEMS_PER_PAGE = 6;

const Discover = () => {
  const navigate = useNavigate();
  const { personalityScores, role } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "advisors">("friends");
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  useEffect(() => {
    // keep original navigation guard
    if (!personalityScores || !role) {
      navigate("/");
      return;
    }

    // seed with the mock data
    setMatches(MOCK_PROFILES);
  }, [personalityScores, role, navigate]);

  const handleConnect = (m?: any) => {
    toast({
      title: "Connection Sent!",
      description: "Your connection request has been sent.",
    });
    // Optionally close modal after connecting
    setSelectedProfile(null);
  };

  const renderPersonalityColor = (match: any) => {
    try {
      const pct = match.personalityPercentages
        ? match.personalityPercentages
        : getPercentages(match.personalityScores || {});
      const dimensionPercentMap = {
        timeHorizon: pct.longTerm ?? 0,
        riskTolerance: pct.lowRisk ?? 0,
        complexity: pct.complexity ?? 0,
        consistency: pct.lumpSum ?? 0,
      };
      const dominant = (Object.keys(dimensionPercentMap) as Array<
        keyof typeof dimensionPercentMap
      >).reduce((a, b) =>
        dimensionPercentMap[a] >= dimensionPercentMap[b] ? a : b
      );
      return DIMENSION_COLORS[dominant];
    } catch {
      return "#000";
    }
  };

  // filter by tab
  const filtered = matches.filter((m) =>
    activeTab === "advisors" ? m.role === "advisor" : m.role !== "advisor"
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    // reset to first page on tab change
    setCurrentPage(1);
  }, [activeTab]);

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

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold">Discover</h1>
            <p className="text-muted-foreground">
              Browse friends and financial advisors who match your financial personality
            </p>
          </div>

          <div className="flex gap-2 bg-muted/40 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md font-medium ${activeTab === "friends" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("friends")}
            >
              Friends
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium ${activeTab === "advisors" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("advisors")}
            >
              Financial Advisors
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card divide-y">
          {pageItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No matches found</div>
          ) : (
            pageItems.map((m: any, idx: number) => {
              const color = renderPersonalityColor(m);
              const avatar = m.avatarUrl || "/avatar-placeholder.png";
              const matchPercent = m.matchPercentage ?? 0;

              return (
                <div
                  key={m.id ?? idx}
                  className="flex items-center p-4 gap-4"
                >
                  {/* left colored bar matching personality */}
                  <div
                    className="w-1 self-stretch rounded-l"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />

                  <img
                    src={avatar}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover border ml-2"
                  />

                  <div className="flex-1 min-w-0 ml-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => setSelectedProfile(m)}
                          className="text-left"
                        >
                          <div className="text-lg font-semibold truncate">{m.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{m.title}</div>
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Match</div>
                        <div className="text-lg font-bold">{matchPercent}%</div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="text-sm truncate"
                        style={{ color }}
                        title={m.personalityDescription}
                      >
                        {m.personalityDescription}
                      </span>
                    </div>

                    {/* extra main-page detail */}
                    <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-2">
                      {m.tags?.slice(0, 3).map((t: string) => (
                        <span key={t} className="px-2 py-1 bg-muted/10 rounded-full text-xs">
                          {t}
                        </span>
                      ))}
                      {m.role === "advisor" && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">Financial Advisor</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProfile(m)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="spring-press"
                      onClick={() => handleConnect(m)}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPageSafe === 1}
            className="spring-press"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPageSafe} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPageSafe >= totalPages}
            className="spring-press"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modal: profile preview (more detailed tags & role) */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedProfile(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex gap-4">
              <img
                src={selectedProfile.avatarUrl || "/avatar-placeholder.png"}
                alt={selectedProfile.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                    <p className="text-muted-foreground">{selectedProfile.title}</p>
                    {selectedProfile.role === "advisor" && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">Financial Advisor</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Match</div>
                    <div className="text-xl font-bold">{selectedProfile.matchPercentage ?? "—"}%</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Personality</h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: renderPersonalityColor(selectedProfile) }}
                  >
                    {selectedProfile.personalityDescription || "No description available."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedProfile.tags || []).map((t: string) => (
                      <span key={t} className="px-3 py-1 bg-muted/10 rounded-full text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Details</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedProfile.bio || "No additional details provided."}
                  </p>

                  {/* show a simple breakdown of personality percentages */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Long-Term</div>
                      <div className="font-medium">{selectedProfile.personalityPercentages?.longTerm ?? "—"}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Low Risk</div>
                      <div className="font-medium">{selectedProfile.personalityPercentages?.lowRisk ?? "—"}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Complexity</div>
                      <div className="font-medium">{selectedProfile.personalityPercentages?.complexity ?? "—"}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lump Sum</div>
                      <div className="font-medium">{selectedProfile.personalityPercentages?.lumpSum ?? "—"}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProfile(null)}>Close</Button>
              <Button onClick={() => handleConnect(selectedProfile)}>Connect</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
// ...existing code...