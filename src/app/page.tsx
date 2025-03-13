import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Dumbbell,
  ClipboardCheck,
  LineChart,
  Bell,
  Users,
  ArrowRight,
  BarChart3,
  Layers,
  MessageSquare,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingButton from "@/components/pricing-button";
import CTAButton from "@/components/cta-button";
import Link from "next/link";

// Add structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PulseCoach",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "20.00",
    priceCurrency: "USD",
  },
  description:
    "A comprehensive platform for fitness coaches to track client progress, manage workout plans, and analyze performance data.",
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke("get-plans");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Add structured data script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2">
              Now with 7-day free trial! No credit card required.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              The Complete{" "}
              <span className="text-primary">Client Management</span> Platform
              for Fitness Coaches
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track client progress, create personalized workout plans, and grow
              your fitness business with our all-in-one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/sign-up">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-muted/30">
              <div className="text-4xl font-bold mb-2 text-primary">5,000+</div>
              <div className="text-muted-foreground font-medium">
                Active Coaches
              </div>
            </div>
            <div className="p-6 rounded-xl bg-muted/30">
              <div className="text-4xl font-bold mb-2 text-primary">
                50,000+
              </div>
              <div className="text-muted-foreground font-medium">
                Clients Managed
              </div>
            </div>
            <div className="p-6 rounded-xl bg-muted/30">
              <div className="text-4xl font-bold mb-2 text-primary">98%</div>
              <div className="text-muted-foreground font-medium">
                Client Retention Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Tools for Fitness Coaches
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform helps fitness professionals manage clients, track
              progress, and grow their business with cutting-edge technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Client Management",
                description:
                  "Easily organize and track all your clients in one place with custom profiles and detailed history",
              },
              {
                icon: <Dumbbell className="w-6 h-6" />,
                title: "Workout Builder",
                description:
                  "Create custom workout plans with our intuitive exercise library featuring over 500+ exercises",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Progress Tracking",
                description:
                  "Monitor client metrics with interactive charts, body measurements, and progress photos",
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Smart Notifications",
                description:
                  "Automated alerts for milestones, missed workouts, and client feedback in real-time",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border/40 flex flex-col h-full"
              >
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines your coaching business from client
              onboarding to progress tracking
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border/40 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Your Clients</h3>
              <p className="text-muted-foreground">
                Easily onboard clients with our simple interface and organize
                them into groups with custom tags and categories
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border border-border/40 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Create Workout Plans
              </h3>
              <p className="text-muted-foreground">
                Design personalized workout routines using our extensive
                exercise library with video demonstrations
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border border-border/40 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor client metrics, analyze performance with AI-powered
                insights, and adjust plans for optimal results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful tools that make PulseCoach the preferred
              platform for fitness professionals worldwide
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <MessageSquare className="h-5 w-5" />,
                title: "Client Portal Access",
                description:
                  "Provide clients with their own secure portal to view workouts, log progress, and communicate with you directly",
              },
              {
                icon: <Layers className="h-5 w-5" />,
                title: "Progress Photo Tracking",
                description:
                  "Securely store and compare client progress photos to visually demonstrate transformation over time",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: "Comprehensive Metrics",
                description:
                  "Track weight, body measurements, body fat percentage, and custom metrics with beautiful visualization tools",
              },
              {
                icon: <Bell className="h-5 w-5" />,
                title: "Real-time Notifications",
                description:
                  "Get instant alerts when clients complete workouts, provide feedback, or reach important milestones",
              },
              {
                icon: <Dumbbell className="h-5 w-5" />,
                title: "Exercise Library",
                description:
                  "Access 500+ pre-loaded exercises with detailed instructions, or create custom exercises for your unique training methods",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Dark Mode Support",
                description:
                  "Enjoy a comfortable viewing experience in any lighting condition with our beautiful dark mode interface",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 items-start bg-card p-6 rounded-xl border border-border/40 shadow-sm"
              >
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-24 bg-muted/20 border-y border-border/40"
        id="pricing"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your coaching business. No hidden
              fees.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-full bg-card border border-primary/20 rounded-xl overflow-hidden shadow-md">
              <div className="bg-primary text-white text-center py-3 px-4">
                <h3 className="text-xl font-medium">Recommended Plan</h3>
              </div>

              <div className="p-8 text-center">
                <div className="text-6xl font-bold mb-2">
                  <span>$20</span>
                  <span className="text-2xl text-muted-foreground">/month</span>
                </div>

                <div className="space-y-4 mt-8 text-left">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Unlimited clients</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Advanced analytics</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Priority support</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Custom workout builder</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <span>Client portal access</span>
                  </div>
                </div>

                <PricingButton
                  priceId="coach_pro_plan"
                  userId={user?.id}
                  isLoggedIn={!!user}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Coaches Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from fitness professionals who have transformed their
              business with our platform
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "John Miller",
                role: "Personal Trainer, NYC",
                quote:
                  "This platform has completely transformed how I manage my clients. The workout builder saves me hours each week, and my clients love the progress tracking features. I've grown my client base by 40% in just 3 months!",
              },
              {
                name: "Sarah Johnson",
                role: "Fitness Studio Owner",
                quote:
                  "Managing 50+ clients used to be a nightmare. Now I can see everyone's progress at a glance and provide better coaching with less administrative work. The client portal feature has revolutionized how we communicate with clients.",
              },
              {
                name: "David Parker",
                role: "Online Fitness Coach",
                quote:
                  "The analytics tools have helped me identify patterns in client progress that I never would have noticed otherwise. My retention rate has increased by 35% since I started using this platform, and the progress photo feature is a game-changer!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl shadow-sm border border-border/40 flex flex-col h-full"
              >
                <div className="mb-6">
                  <svg
                    className="h-8 w-8 text-primary/40"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-muted-foreground italic flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6 pt-6 border-t border-border/40">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of fitness professionals who are growing their
            business and delivering better results to clients. Start your 7-day
            free trial today!
          </p>
          <CTAButton />
        </div>
      </section>

      <Footer />
    </div>
  );
}
