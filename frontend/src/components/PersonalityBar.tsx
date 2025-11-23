import { useEffect, useState } from "react";

interface PersonalityBarProps {
  label1: string;
  label2: string;
  percentage: number; // 0-100, where 0 = fully label1, 100 = fully label2
  color: string;
  delay?: number;
  onHover?: () => void;
  onLeave?: () => void;
}

const PersonalityBar = ({ label1, label2, percentage, color, delay = 0, onHover, onLeave }: PersonalityBarProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const dominantLabel = percentage >= 50 ? label2 : label1;
  const dominantPercentage = percentage >= 50 ? percentage : 100 - percentage;

  return (
    <div 
      className="space-y-3 cursor-pointer transition-opacity hover:opacity-90"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex justify-between items-center text-sm font-medium">
        <span>{label1}</span>
        <span>{label2}</span>
      </div>
      
      <div className="relative h-4 rounded-full overflow-visible" style={{ backgroundColor: color }}>
        <div
          className="absolute top-1/2 transition-all duration-1000 ease-out"
          style={{
            left: animated ? `calc(${percentage}% - 8px)` : '-16px',
            transform: 'translateY(-50%)',
          }}
        >
          <div className="relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
              <span 
                className="text-sm font-bold"
                style={{ color: color }}
              >
                {dominantPercentage}% {dominantLabel}
              </span>
            </div>
            <div className="w-4 h-4 rounded-full bg-white shadow-lg border border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityBar;
