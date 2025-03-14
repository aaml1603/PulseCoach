import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Client Portal Help - PulseCoach",
  description:
    "Learn how to use and manage the client portal feature in PulseCoach.",
};

export default async function ClientPortalHelpPage() {
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
              <h1 className="text-3xl font-bold">Client Portal Help</h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Client Portal Management</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    What is the client portal?
                  </h3>
                  <p className="text-muted-foreground">
                    The client portal is a personalized web interface where your
                    clients can access their workout plans, track their
                    progress, view their metrics, and communicate with you. It's
                    designed to enhance client engagement and provide a seamless
                    experience for both you and your clients.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I generate a client portal link?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To generate a unique access link for your client:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client you want to create a portal for</li>
                    <li>Click on the "Portal" tab</li>
                    <li>Click "Generate Portal Link"</li>
                    <li>
                      The system will create a unique, secure link for your
                      client
                    </li>
                    <li>
                      You can then copy the link or send it directly to your
                      client via email
                    </li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do clients access their portal?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Clients can access their portal in two ways:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Via direct link:</strong> Using the unique link
                      you send them, which doesn't require them to create an
                      account or remember a password
                    </li>
                    <li>
                      <strong>Via email invitation:</strong> If you send them an
                      email invitation, they'll receive instructions on how to
                      access their portal
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    The portal link is valid for 90 days by default. You can
                    generate a new link at any time if needed.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    What can clients do in their portal?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    In the client portal, your clients can:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>View and complete assigned workouts</li>
                    <li>Track their progress and view their metrics</li>
                    <li>See their progress pictures</li>
                    <li>Send messages to you</li>
                    <li>View their goals and progress toward them</li>
                    <li>Access any resources you've shared with them</li>
                  </ul>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I customize what clients can see in their portal?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To customize the client portal experience:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Portal" tab</li>
                    <li>Click "Portal Settings"</li>
                    <li>
                      Toggle on/off the features you want to enable or disable
                    </li>
                    <li>Click "Save Settings"</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can control which metrics, workouts, and features each
                    client can access in their portal.
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I revoke access to a client portal?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    If you need to revoke a client's access to their portal:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Portal" tab</li>
                    <li>Click "Revoke Access"</li>
                    <li>Confirm the action when prompted</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will immediately invalidate their current access link.
                    You can generate a new link later if needed.
                  </p>
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
