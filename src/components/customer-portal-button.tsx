"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

interface CustomerPortalButtonProps {
  customerId?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export default function CustomerPortalButton({
  customerId,
  className,
  variant = "default",
  size = "default",
  children,
}: CustomerPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    if (!customerId) {
      console.error("No customer ID provided");
      // Instead of returning early, we'll redirect to pricing
      window.location.href = "/pricing";
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/dashboard/billing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      // Redirect to Stripe Customer Portal
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert(
        "There was an error opening the customer portal. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleOpenPortal}
      disabled={isLoading || !customerId}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {children || "Manage Subscription"}
          {!children && <ExternalLink className="ml-2 h-4 w-4" />}
        </>
      )}
    </Button>
  );
}
