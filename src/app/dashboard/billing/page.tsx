"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CoachSubscriptionManagement from "@/components/coach-subscription-management";

export default function BillingPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
      </div>

      <div className="space-y-6">
        <CoachSubscriptionManagement />

        {/* Payment History Card is now part of the CoachSubscriptionManagement component */}
      </div>
    </div>
  );
}
