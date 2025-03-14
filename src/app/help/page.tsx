import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Users,
  Dumbbell,
  LineChart,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Help Center - PulseCoach",
  description:
    "Get help with PulseCoach. Contact our support team for assistance with your fitness coaching platform.",
};

export default async function HelpPage() {
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
            {/* Header section */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Help Center
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get support for your PulseCoach account and services
              </p>
            </div>

            {/* Contact Form Card */}
            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
                  <p className="text-muted-foreground mb-6">
                    Have a question or need assistance? Fill out the form and
                    our support team will get back to you as soon as possible.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          <a
                            href="mailto:contact@pulsecoach.org"
                            className="text-primary hover:underline"
                          >
                            contact@pulsecoach.org
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">
                          Available for premium subscribers in the dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <form
                    action="/api/help-request"
                    method="POST"
                    className="space-y-4"
                  >
                    <input
                      type="hidden"
                      name="userEmail"
                      value={user?.email || ""}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        defaultValue={user?.user_metadata?.full_name || ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        defaultValue={user?.email || ""}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your issue or question in detail"
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Help Categories */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Browse Help by Category
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Account & Billing",
                    icon: <Mail className="h-6 w-6 text-primary" />,
                    link: "/help/account-billing",
                  },
                  {
                    title: "Client Management",
                    icon: <Users className="h-6 w-6 text-primary" />,
                    link: "/help/client-management",
                  },
                  {
                    title: "Workout Builder",
                    icon: <Dumbbell className="h-6 w-6 text-primary" />,
                    link: "/help/workout-builder",
                  },
                  {
                    title: "Progress Tracking",
                    icon: <LineChart className="h-6 w-6 text-primary" />,
                    link: "/help/progress-tracking",
                  },
                  {
                    title: "Client Portal",
                    icon: <Users className="h-6 w-6 text-primary" />,
                    link: "/help/client-portal",
                  },
                  {
                    title: "Getting Started",
                    icon: <BookOpen className="h-6 w-6 text-primary" />,
                    link: "/help/getting-started",
                  },
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={category.link}
                    className="bg-card border border-border/40 rounded-xl p-6 shadow-sm flex flex-col items-center hover:border-primary/40 transition-colors"
                  >
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      {category.icon}
                    </div>
                    <h3 className="font-medium">{category.title}</h3>
                    <div className="mt-2 text-primary text-sm flex items-center">
                      <span>View articles</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "How do I reset my password?",
                    answer:
                      "You can reset your password by clicking on the 'Forgot Password' link on the sign-in page. You'll receive an email with instructions to create a new password.",
                  },
                  {
                    question: "How do I add a new client?",
                    answer:
                      "To add a new client, go to your Dashboard, click on 'Clients' in the navigation menu, then click the 'Add New Client' button and fill out the required information.",
                  },
                  {
                    question: "Can I export client data?",
                    answer:
                      "Yes, you can export client data from the client's profile page. Look for the 'Export Data' option in the client actions menu.",
                  },
                  {
                    question: "How do I create a workout plan?",
                    answer:
                      "To create a workout plan, navigate to the 'Workouts' section from your dashboard, click 'Create New Workout', then add exercises and configure sets and reps.",
                  },
                  {
                    question: "How do clients access their portal?",
                    answer:
                      "Clients can access their portal through a unique link that you can generate and send to them from their client profile page.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border/40 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
