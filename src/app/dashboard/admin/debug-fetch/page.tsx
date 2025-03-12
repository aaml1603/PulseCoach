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
import { ArrowLeft, Globe, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DebugFetchPage() {
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1",
  );
  const [edgeFunctionUrl, setEdgeFunctionUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEdgeFunctionLoading, setIsEdgeFunctionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edgeFunctionError, setEdgeFunctionError] = useState<string | null>(
    null,
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [edgeFunctionSuccess, setEdgeFunctionSuccess] = useState<string | null>(
    null,
  );
  const [responseData, setResponseData] = useState<any>(null);
  const [edgeFunctionResponseData, setEdgeFunctionResponseData] =
    useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResponseData(null);

    try {
      console.log("Testing fetch to:", url);
      const response = await fetch(
        `/api/debug-fetch?url=${encodeURIComponent(url)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setSuccess(`Successfully fetched from ${url}`);
      setResponseData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const testEdgeFunction = async () => {
    setIsEdgeFunctionLoading(true);
    setEdgeFunctionError(null);
    setEdgeFunctionSuccess(null);
    setEdgeFunctionResponseData(null);

    try {
      const supabase = (window as any).supabase;
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      console.log("Testing edge function:", edgeFunctionUrl);
      const { data, error } = await supabase.functions.invoke(edgeFunctionUrl, {
        body: { test: true },
      });

      if (error) {
        throw error;
      }

      setEdgeFunctionSuccess(
        `Successfully invoked edge function: ${edgeFunctionUrl}`,
      );
      setEdgeFunctionResponseData(data);
    } catch (err: any) {
      setEdgeFunctionError(err.message || "An error occurred");
    } finally {
      setIsEdgeFunctionLoading(false);
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
        <h1 className="text-3xl font-bold">Debug Fetch Issues</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test External URL Fetch</CardTitle>
            <CardDescription>
              Test if the server can fetch external URLs
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
                <Label htmlFor="url">URL to Test</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to test if the server can fetch it
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
              <Button type="submit" disabled={isLoading || !url}>
                {isLoading ? (
                  "Testing..."
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" /> Test URL Fetch
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Edge Function</CardTitle>
            <CardDescription>
              Test if edge functions can be invoked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {edgeFunctionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{edgeFunctionError}</p>
                </div>
              </div>
            )}

            {edgeFunctionSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Success</p>
                  <p className="text-sm">{edgeFunctionSuccess}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edgeFunctionUrl">Edge Function Name</Label>
              <Input
                id="edgeFunctionUrl"
                value={edgeFunctionUrl}
                onChange={(e) => setEdgeFunctionUrl(e.target.value)}
                placeholder="send-email"
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the name of the edge function to test (e.g., send-email)
              </p>
            </div>

            {edgeFunctionResponseData && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Response Data</h3>
                <pre className="text-xs overflow-auto p-2 bg-muted/50 rounded">
                  {JSON.stringify(edgeFunctionResponseData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={testEdgeFunction}
              disabled={isEdgeFunctionLoading || !edgeFunctionUrl}
              variant="outline"
            >
              {isEdgeFunctionLoading ? "Testing..." : <>Test Edge Function</>}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Troubleshooting</CardTitle>
            <CardDescription>
              Common issues and solutions for fetch failures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Common Fetch Failure Causes</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>CORS issues (when fetching from browser)</li>
                  <li>Network connectivity problems</li>
                  <li>DNS resolution failures</li>
                  <li>Firewall or proxy blocking requests</li>
                  <li>SSL/TLS certificate issues</li>
                  <li>Timeout due to slow response</li>
                  <li>Server-side environment restrictions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Edge Function Specific Issues</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>Edge function not deployed correctly</li>
                  <li>Missing environment variables</li>
                  <li>Function execution timeout</li>
                  <li>Memory limits exceeded</li>
                  <li>Incorrect function name when invoking</li>
                  <li>Permissions issues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
