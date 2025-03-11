import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Calendar, BarChart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  id: string;
  name: string;
  description?: string | null;
  exerciseCount?: number;
  duration?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  className?: string;
}

export function WorkoutCard({
  id,
  name,
  description,
  exerciseCount = 0,
  duration = 0,
  difficulty = "intermediate",
  className,
}: WorkoutCardProps) {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <Card
      className={cn(
        "h-full overflow-hidden hover:shadow-md transition-all border-primary/5 hover:border-primary/20",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3 text-primary">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <BarChart className="h-3.5 w-3.5 mr-1" />
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full",
                    difficultyColor[difficulty],
                  )}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              {exerciseCount > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Dumbbell className="h-3.5 w-3.5 mr-1" />
                  <span>{exerciseCount} exercises</span>
                </div>
              )}
              {duration > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{duration} min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 border-t">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/workouts/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
