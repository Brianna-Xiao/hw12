import { Card } from "@/components/ui/card";

interface DimensionDetailProps {
  title: string;
  percentage: number;
  dominantLabel: string;
  color: string;
  description: string;
}

const DimensionDetail = ({ title, percentage, dominantLabel, color, description }: DimensionDetailProps) => {
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

      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Card>
  );
};

export default DimensionDetail;

