import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ETFCard from "@/components/ETFCard";
import { mockETFs } from "@/data/mockETFs";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Invest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredETFs = mockETFs.filter(
    (etf) =>
      etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etf.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen md:pl-20 pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-3xl font-bold">Invest</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ETFs by ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full shadow-soft"
            />
          </div>
        </div>

        <Tabs defaultValue="world" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="world">World</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="world" className="space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredETFs.map((etf) => (
                <ETFCard
                  key={etf.id}
                  etf={etf}
                  onClick={() => navigate(`/etf/${etf.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="space-y-4 animate-fade-in">
            <div className="text-center py-12 text-muted-foreground">
              <p>Connect with friends to see their ETF recommendations</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Invest;
