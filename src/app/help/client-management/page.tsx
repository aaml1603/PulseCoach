import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Client Management Help - PulseCoach",
  description:
    "Learn how to effectively manage your clients using PulseCoach's client management features.",
};

export default async function ClientManagementHelpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/help">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Client Management Help</h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Managing Your Clients</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I add a new client?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To add a new client to your PulseCoach account:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to your Dashboard</li>
                    <li>Click on "Clients" in the navigation menu</li>
                    <li>Click the "Add New Client" button</li>
                    <li>
                      Fill out the required information (name, email, etc.)
                    </li>
                    <li>Click "Save" to create the client profile</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I edit client information?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To edit an existing client's information:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to your Dashboard → Clients</li>
                    <li>Find the client you want to edit</li>
                    <li>Click on their name to view their profile</li>
                    <li>Click the "Edit" button</li>
                    <li>Update the information as needed</li>
                    <li>Click "Save Changes"</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I delete a client?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To remove a client from your account:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to your Dashboard → Clients</li>
                    <li>Find the client you want to delete</li>
                    <li>Click on their name to view their profile</li>
                    <li>Click the "Delete Client" button</li>
                    <li>Confirm the deletion when prompted</li>
                  </ol>
                  <p className="text-sm text-red-500 mt-2">
                    Note: Deleting a client will permanently remove all their
                    data, including workout history, metrics, and messages. This
                    action cannot be undone.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I communicate with my clients?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    PulseCoach offers several ways to communicate with your
                    clients:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Messaging:</strong> Send direct messages through
                      the platform by going to Dashboard → Clients → [Client
                      Name] → Messages
                    </li>
                    <li>
                      <strong>Notes:</strong> Add private notes to client
                      profiles that only you can see
                    </li>
                    <li>
                      <strong>Workout Feedback:</strong> Provide feedback on
                      completed workouts
                    </li>
                    <li>
                      <strong>Client Portal:</strong> Share information through
                      their personalized client portal
                    </li>
                  </ul>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I organize my clients?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    You can organize your clients using these features:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Search:</strong> Use the search bar to quickly
                      find specific clients
                    </li>
                    <li>
                      <strong>Sort:</strong> Sort your client list by name,
                      activity, or other criteria
                    </li>
                    <li>
                      <strong>Filter:</strong> Filter clients by status (active,
                      inactive) or other attributes
                    </li>
                    <li>
                      <strong>Tags:</strong> Create custom tags to categorize
                      clients (e.g., "weight loss", "strength training")
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 shadow-sm text-center">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                <Mail className="h-6 w-6 text-primary" /> Still Need Help?
              </h2>
              <p className="text-lg mb-4">
                If you couldn't find the answer to your question, our support
                team is here to help.
              </p>
              <Button asChild size="lg">
                <Link href="/help">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
