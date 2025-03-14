"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function TrialEligibilityCheck() {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    eligible: boolean;
    reason?: string;
  } | null>(null);

  const checkEligibility = async () => {
    if (!email || !email.includes("@")) {
      setResult({
        eligible: false,
        reason: "Please enter a valid email address",
      });
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      const response = await fetch("/api/check-trial-eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check eligibility");
      }

      setResult(data);
    } catch (error: any) {
      setResult({
        eligible: false,
        reason: error.message || "An error occurred while checking eligibility",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Check Trial Eligibility</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email to check if you're eligible for a free trial
        </p>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={checkEligibility} disabled={isChecking}>
            {isChecking ? "Checking..." : "Check"}
          </Button>
        </div>

        {result && (
          <div
            className={`p-3 rounded-md text-sm flex items-start ${result.eligible ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {result.eligible ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">You're eligible!</p>
                  <p>You can sign up for a free trial.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Not eligible</p>
                  <p>{result.reason}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
