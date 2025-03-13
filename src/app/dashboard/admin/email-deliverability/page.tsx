"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function EmailDeliverabilityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliverabilityData, setDeliverabilityData] = useState<any>(null);

  useEffect(() => {
    const fetchDeliverabilityInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/email-deliverability");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load deliverability information",
          );
        }

        setDeliverabilityData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliverabilityInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/admin/debug-sendgrid">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Email Deliverability Guide</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/debug-sendgrid">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Email Deliverability Guide</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Avoiding Spam Filters
            </CardTitle>
            <CardDescription>
              Key strategies to ensure your emails reach client inboxes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6">
              <p className="font-medium">Why emails get marked as spam:</p>
              <p className="text-sm mt-1">
                Email providers use sophisticated algorithms to detect spam.
                Common triggers include poor sender reputation, suspicious
                content, missing authentication, and recipient behavior.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Current Implementation:</h3>
              <ul className="space-y-2">
                {deliverabilityData?.spamAvoidanceMeasures.map(
                  (measure: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{measure}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deliverability Best Practices</CardTitle>
            <CardDescription>
              Follow these guidelines to maximize email deliverability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Technical Setup</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Set up SPF, DKIM, and DMARC records for your domain
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Use a dedicated IP address for sending emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Verify your sending domain in SendGrid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Implement proper bounce handling</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Content Guidelines</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Avoid excessive capitalization and exclamation marks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain a good text-to-image ratio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Use clear, relevant subject lines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Include unsubscribe options in all emails</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Sender Reputation</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Gradually increase sending volume (warm up)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Maintain consistent sending patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Monitor bounce rates and spam complaints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Use a consistent sender name and email address</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
            <CardDescription>
              Your email sending configuration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">SendGrid API Key:</span>
                <span
                  className={
                    deliverabilityData?.configurationStatus.sendgridApiKey
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {deliverabilityData?.configurationStatus.sendgridApiKey
                    ? "Configured"
                    : "Not Configured"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">From Email:</span>
                <span>
                  {deliverabilityData?.configurationStatus.sendgridFromEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">From Name:</span>
                <span>{deliverabilityData?.configurationStatus.fromName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Template System:</span>
                <span>
                  {deliverabilityData?.configurationStatus.templateSystem}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Authentication:</span>
                <span>
                  {deliverabilityData?.configurationStatus.authentication}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/admin/debug-sendgrid">
                Test Email Configuration
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
