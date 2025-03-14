"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface MarkAsCompletedButtonProps {
  clientWorkoutId: string;
  accessToken: string;
  isCompleted: boolean;
  workoutName?: string;
}

export default function MarkAsCompletedButton({
  clientWorkoutId,
  accessToken,
  isCompleted,
  workoutName = "Workout",
}: MarkAsCompletedButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [difficultyRating, setDifficultyRating] = useState(5);

  const handleMarkAsCompleted = async () => {
    if (completed) return;
    setShowFeedbackDialog(true);
  };

  const submitFeedback = async (skipFeedback = false) => {
    setLoading(true);
    setError(null);

    try {
      // If skipping feedback, just mark as completed
      if (skipFeedback) {
        const response = await fetch("/api/client-portal/mark-completed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientWorkoutId, accessToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to mark workout as completed");
        }
      } else {
        // Submit with feedback
        const response = await fetch("/api/client-portal/submit-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientWorkoutId,
            accessToken,
            feedback,
            difficultyRating,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit feedback");
        }
      }

      // Refresh analytics data
      try {
        await fetch("/api/refresh-analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (refreshError) {
        console.error("Failed to refresh analytics:", refreshError);
      }

      setCompleted(true);
      setShowFeedbackDialog(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <Button
        variant="outline"
        className="w-full"
        disabled={completed || loading}
        onClick={handleMarkAsCompleted}
      >
        {completed ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            Completed
          </>
        ) : loading ? (
          "Processing..."
        ) : (
          "Mark as Completed"
        )}
      </Button>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How was your workout?</DialogTitle>
            <DialogDescription>
              Let your coach know how {workoutName} went for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">
                How difficult was this workout? ({difficultyRating}/10)
              </Label>
              <Slider
                id="difficulty"
                min={1}
                max={10}
                step={1}
                value={[difficultyRating]}
                onValueChange={(value) => setDifficultyRating(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Too Easy</span>
                <span>Just Right</span>
                <span>Too Hard</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about this workout..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => submitFeedback(true)}
              disabled={loading}
            >
              Skip Feedback
            </Button>
            <Button
              type="button"
              onClick={() => submitFeedback(false)}
              disabled={loading}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
