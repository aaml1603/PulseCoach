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
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DebugEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResponseData(null);

    try {
      console.log("Sending debug email to:", email);
      // Use the email API directly
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Email Debug Test",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Debug Test</h2>
              <p>This is a test email to verify that the email sending functionality is working correctly.</p>
              <p>If you received this email, it means the system is properly configured.</p>
              <p>Time sent: ${new Date().toISOString()}</p>
            </div>
          `,
          text: "This is a test email to verify that the email sending functionality is working correctly.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send debug email");
      }

      setSuccess(data.message || "Debug email sent successfully");
      setResponseData(data);
    } catch (err: any) {
      console.error("Debug email error:", err);
      setError(
        err.message ||
          "An error occurred sending the email. Check the console for details.",
      );
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
        <h1 className="text-3xl font-bold">Email Debug Tool</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Email Functionality</CardTitle>
          <CardDescription>
            Send a test email to diagnose email delivery issues
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs mt-2">
                    If the issue persists, check that your SendGrid API key is
                    properly configured (SENDGRID_API_KEY and
                    SENDGRID_FROM_EMAIL).
                  </p>
                </div>
              </div>
            )}

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
                Enter the email address where you want to receive the test email
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

          <CardFooter>
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Send Debug Email
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Current email sending configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email Provider</h3>
                <p className="text-sm text-muted-foreground">
                  Using SendGrid for email delivery
                </p>
              </div>

              <div>
                <h3 className="font-medium">Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure SENDGRID_API_KEY and SENDGRID_FROM_EMAIL are set in
                  your environment variables
                </p>
              </div>

              <div>
                <h3 className="font-medium">Troubleshooting Steps</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
                  <li>Verify your SendGrid API key is valid and active</li>
                  <li>
                    Ensure the sender email is verified in your SendGrid account
                  </li>
                  <li>
                    Check if your SendGrid account has the necessary permissions
                  </li>
                  <li>
                    Review SendGrid dashboard for any sending limits or
                    restrictions
                  </li>
                  <li>Check server logs for detailed error messages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
