import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminFeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is admin (you would need to implement this check based on your user roles)
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = userData?.role === "admin";

  if (!isAdmin) {
    return redirect("/dashboard");
  }

  // Fetch all feedback with user information
  const { data: feedbackItems } = await supabase
    .from("coach_feedback")
    .select(
      `
      *,
      users:user_id (email, name, full_name)
    `,
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coach Feedback</h1>
      <p className="text-muted-foreground">
        Review feedback submitted by coaches to improve the platform.
      </p>

      <div className="grid gap-6">
        {feedbackItems && feedbackItems.length > 0 ? (
          feedbackItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base font-medium">
                    {item.users?.full_name || item.users?.name || "Anonymous"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.users?.email || "No email"}
                  </p>
                </div>
                <Badge variant={item.status === "new" ? "default" : "outline"}>
                  {item.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="whitespace-pre-wrap">{item.feedback}</p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Submitted on {new Date(item.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                No feedback has been submitted yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
