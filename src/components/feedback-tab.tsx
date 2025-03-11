"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X } from "lucide-react";
import { createClient } from "../../supabase/client";

export default function FeedbackTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Submit feedback to database
      const { error } = await supabase.from("coach_feedback").insert({
        user_id: user?.id,
        feedback: feedback,
        status: "new",
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Show success message
      setSubmitted(true);
      setFeedback("");

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed right-0 bottom-8 z-50">
      {/* Tab button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-orange-500 text-white py-2 px-4 rounded-l-lg shadow-md transition-all ${isOpen ? "translate-x-[300px]" : ""}`}
      >
        <MessageSquare size={18} />
        <span className="font-medium">Feedback</span>
      </button>

      {/* Feedback panel */}
      <div
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 w-[300px] bg-white dark:bg-gray-800 p-4 rounded-l-lg shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Share Your Feedback</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md text-sm">
            Thank you for your feedback! We appreciate your input to help
            improve the platform.
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              Help us improve PulseCoach by sharing your suggestions, reporting
              issues, or requesting new features.
            </p>

            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What would you like to see improved?"
              className="mb-3"
              rows={4}
            />

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
