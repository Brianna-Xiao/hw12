import { useEffect, useState } from "react";

interface PersonalityBarProps {
  label1: string;
  label2: string;
  percentage: number; // 0-100, where 0 = fully label1, 100 = fully label2
  color1: string;
  color2: string;
  delay?: number;
}

const PersonalityBar = ({ label1, label2, percentage, color1, color2, delay = 0 }: PersonalityBarProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-medium">
        <span>{label1}</span>
        <span>{label2}</span>
      </div>
      
      <div className="relative h-8 bg-secondary rounded-full overflow-hidden">
        <div
          className="absolute inset-0 flex transition-all duration-1000 ease-out"
          style={{
            transform: animated ? 'none' : 'scaleX(0)',
            transformOrigin: 'left',
          }}
        >
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${100 - percentage}%`,
              backgroundColor: color1,
            }}
          />
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${percentage}%`,
              backgroundColor: color2,
            }}
          />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground/80 mix-blend-difference">
            {100 - percentage}% / {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalityBar;
