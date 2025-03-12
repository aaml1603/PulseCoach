"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link2, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../supabase/client";

interface ClientPortalLinkProps {
  clientId: string;
  clientName: string;
}

export default function ClientPortalLink({
  clientId,
  clientName,
}: ClientPortalLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check for existing portal link when dialog opens
  useEffect(() => {
    if (isOpen) {
      checkExistingLink();
    }
  }, [isOpen]);

  const checkExistingLink = async () => {
    setIsCheckingExisting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: client, error } = await supabase
        .from("clients")
        .select("access_token, access_token_expires_at")
        .eq("id", clientId)
        .single();

      if (error) throw error;

      if (client?.access_token) {
        // Check if token is still valid
        const expiryDate = client.access_token_expires_at
          ? new Date(client.access_token_expires_at)
          : null;
        const isValid = expiryDate && expiryDate > new Date();

        if (isValid) {
          // Construct the portal URL
          const baseUrl = window.location.origin;
          const url = `${baseUrl}/client-portal/${client.access_token}`;
          setPortalUrl(url);
        }
      }
    } catch (err: any) {
      console.error("Error checking existing link:", err);
      // Don't show error to user, just proceed as if no link exists
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const generateLink = async () => {
    setIsLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/client-portal/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate link");
      }

      setPortalUrl(data.portalUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && portalUrl) {
      navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full"
          onClick={() => setIsOpen(true)}
        >
          <Link2 className="h-4 w-4" />
          Portal Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Portal Access</DialogTitle>
          <DialogDescription>
            {portalUrl ? "Manage the access link" : "Generate a unique link"}{" "}
            for {clientName} to access their workouts without needing to create
            an account. This link will be valid for 90 days.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {isCheckingExisting ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !portalUrl ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              This will generate a new access link that will be valid for 90
              days.{" "}
              <span className="text-amber-600 font-medium">
                Note: This will invalidate any previous links.
              </span>
            </p>
            <p className="text-sm text-blue-600 mb-4 bg-blue-900/20 p-2 rounded-md">
              <strong>Important:</strong> Your coach profile will be visible to{" "}
              {clientName} when they access this portal. Make sure your profile
              is up to date in the{" "}
              <Link href="/dashboard/profile" className="underline">
                profile settings
              </Link>
              .
            </p>
            <Button
              onClick={generateLink}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Access Link"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="link">Active portal access link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="link"
                  value={portalUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with your client. They can use it to access their
              assigned workouts without needing to create an account.
            </p>
            <div className="mt-2">
              <Button
                onClick={generateLink}
                disabled={isLoading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {isLoading ? "Regenerating..." : "Regenerate Link"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-amber-600 font-medium">Warning:</span>{" "}
                This will create a new link and invalidate the current one.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
