"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/client";

export default function TestSupabasePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [bucketStatus, setBucketStatus] = useState<string>("Checking...");
  const [buckets, setBuckets] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // Test basic connection by getting user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          throw new Error(`Authentication error: ${userError.message}`);
        }

        setConnectionStatus("Connected");

        // Test storage access by listing buckets
        const { data: bucketsData, error: bucketsError } =
          await supabase.storage.listBuckets();

        if (bucketsError) {
          setBucketStatus(`Error: ${bucketsError.message}`);
        } else {
          setBucketStatus(`Found ${bucketsData.length} buckets`);
          setBuckets(bucketsData.map((bucket) => bucket.name));
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        setConnectionStatus("Failed");
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  const testCreateBucket = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-storage-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketName: "progress-pictures" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create bucket");
      }

      // Refresh bucket list
      const supabase = createClient();
      const { data: bucketsData } = await supabase.storage.listBuckets();
      setBucketStatus(`Found ${bucketsData.length} buckets`);
      setBuckets(bucketsData.map((bucket) => bucket.name));

      alert("Bucket creation attempt completed: " + data.message);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      alert("Error creating bucket: " + err.message);
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
        <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Supabase Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Basic authentication test
                </p>
              </div>
              <div className="flex items-center">
                {connectionStatus === "Connected" ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>{connectionStatus}</span>
                  </div>
                ) : connectionStatus === "Checking..." ? (
                  <div className="flex items-center text-blue-600">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                    <span>{connectionStatus}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{connectionStatus}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Storage Buckets</h3>
                <p className="text-sm text-muted-foreground">
                  Storage access test
                </p>
              </div>
              <div className="flex items-center">
                {bucketStatus.includes("Found") ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>{bucketStatus}</span>
                  </div>
                ) : bucketStatus === "Checking..." ? (
                  <div className="flex items-center text-blue-600">
                    <div className="h-5 w-5 mr-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                    <span>{bucketStatus}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{bucketStatus}</span>
                  </div>
                )}
              </div>
            </div>

            {buckets.length > 0 && (
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Available Buckets:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {buckets.map((bucket, index) => (
                    <li key={index} className="text-sm">
                      {bucket} {bucket === "progress-pictures" && "✓"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Test
              </Button>
              <Button onClick={testCreateBucket} disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : "Create progress-pictures Bucket"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Once the connection is verified, you can test the progress
              pictures functionality by uploading a new picture:
            </p>
            <Button asChild>
              <Link href="/dashboard/clients">Go to Clients</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
