import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the URL to test from query parameters
    const url =
      request.nextUrl.searchParams.get("url") ||
      "https://jsonplaceholder.typicode.com/todos/1";

    console.log(`Testing fetch to: ${url}`);

    // Attempt to fetch the URL
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get response details
    const responseData = await response.text();
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());

    return NextResponse.json({
      success: true,
      status,
      headers,
      responseSize: responseData.length,
      response:
        responseData.substring(0, 1000) +
        (responseData.length > 1000 ? "..." : ""),
    });
  } catch (error: any) {
    console.error("Fetch debug error:", error);
    return NextResponse.json(
      {
        error: `Fetch failed: ${error.message}`,
        stack: error.stack,
        name: error.name,
        cause: error.cause ? JSON.stringify(error.cause) : undefined,
      },
      { status: 500 },
    );
  }
}
