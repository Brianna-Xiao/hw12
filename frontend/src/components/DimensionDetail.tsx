import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DimensionDetailProps {
  title: string;
  percentage: number;
  dominantLabel: string;
  color: string;
  description: string;
  illustration?: React.ReactNode;
}

const DimensionDetail = ({ title, percentage, dominantLabel, color, description, illustration }: DimensionDetailProps) => {
  return (
    <Card className="p-6 space-y-6 shadow-elevated h-full">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p 
          className="text-3xl font-bold"
          style={{ color: color }}
        >
          {percentage}% {dominantLabel}
        </p>
      </div>

      {illustration && (
        <div className="flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg">
          {illustration}
        </div>
      )}

      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>

      <Button 
        variant="link" 
        className="p-0 h-auto font-semibold"
        style={{ color: color }}
      >
        LEARN MORE
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </Card>
  );
};

export default DimensionDetail;

