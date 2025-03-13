"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export default function DebugSendGridPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [configData, setConfigData] = useState<any>(null);

  const checkConfiguration = async () => {
    setIsCheckingConfig(true);
    setError(null);
    setConfigData(null);

    try {
      // Create a simple endpoint to check environment variables
      const response = await fetch("/api/debug-sendgrid-config", {
        method: "GET",
      });

      const data = await response.json();
      setConfigData(data);

      if (!data.hasSendGridApiKey) {
        setError(
          "SENDGRID_API_KEY is not properly configured in environment variables",
        );
      } else if (!data.hasSendGridFromEmail) {
        setError(
          "SENDGRID_FROM_EMAIL is not properly configured in environment variables",
        );
      }
    } catch (err: any) {
      setError(
        "Failed to check configuration: " + (err.message || "Unknown error"),
      );
    } finally {
      setIsCheckingConfig(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResponseData(null);

    try {
      console.log("Sending debug email to:", email);
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResponseData(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      setSuccess(data.message || "Test email sent successfully");
    } catch (err: any) {
      console.error("Debug email error:", err);
      setError(err.message || "An error occurred sending the email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">SendGrid Debug Tool</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Check SendGrid Configuration</CardTitle>
            <CardDescription>
              Verify that your SendGrid environment variables are properly set
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md flex items-start">
              <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Environment Variables Check</p>
                <p className="text-sm">
                  This will check if your SendGrid API key and sender email are
                  properly configured.
                </p>
              </div>
            </div>

            <Button
              onClick={checkConfiguration}
              disabled={isCheckingConfig}
              variant="outline"
              className="w-full"
            >
              {isCheckingConfig ? "Checking..." : "Check Configuration"}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {configData && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Configuration Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${configData.hasSendGridApiKey ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span>
                      SENDGRID_API_KEY:{" "}
                      {configData.hasSendGridApiKey
                        ? "Configured"
                        : "Not configured"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${configData.hasSendGridFromEmail ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span>
                      SENDGRID_FROM_EMAIL:{" "}
                      {configData.hasSendGridFromEmail
                        ? "Configured"
                        : "Not configured"}
                    </span>
                  </div>
                  {configData.fromEmail && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">From Email:</span>{" "}
                      {configData.fromEmail}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>
              Send a test email to verify SendGrid integration
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Success</p>
                    <p className="text-sm">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the email address where you want to receive the test
                  email
                </p>
              </div>

              {responseData && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Response Data</h3>
                  <pre className="text-xs overflow-auto p-2 bg-muted/50 rounded">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/email-deliverability">
                  Deliverability Guide
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading || !email}>
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" /> Send Test Email
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
            <CardDescription>
              Common issues and solutions for SendGrid integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">1. Environment Variables</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ensure both SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are set
                  in your .env.local file. Make sure there are no spaces or
                  quotes around the values.
                </p>
              </div>

              <div>
                <h3 className="font-medium">2. SendGrid API Key</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Verify your API key is active in the SendGrid dashboard.
                  Create a new API key if necessary.
                </p>
              </div>

              <div>
                <h3 className="font-medium">3. Sender Email Verification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The sender email (SENDGRID_FROM_EMAIL) must be verified in
                  your SendGrid account. Check the "Sender Authentication"
                  section in your SendGrid dashboard.
                </p>
              </div>

              <div>
                <h3 className="font-medium">4. Server Restart</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  After updating environment variables, restart your development
                  server for changes to take effect.
                </p>
              </div>

              <div>
                <h3 className="font-medium">5. SendGrid Limits</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Check if you've reached any sending limits on your SendGrid
                  account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
