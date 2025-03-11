import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dumbbell, Activity, Flame, Trophy } from "lucide-react";

interface FitnessStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: "dumbbell" | "activity" | "flame" | "trophy";
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function FitnessStatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: FitnessStatsCardProps) {
  const iconMap = {
    dumbbell: <Dumbbell className="h-5 w-5" />,
    activity: <Activity className="h-5 w-5" />,
    flame: <Flame className="h-5 w-5" />,
    trophy: <Trophy className="h-5 w-5" />,
  };

  const trendColorMap = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
          {iconMap[icon]}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p
            className={cn(
              "text-xs mt-1",
              trend ? trendColorMap[trend] : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
