import Hero from "@/components/hero";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingButton from "@/components/pricing-button";
import CTAButton from "@/components/cta-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke("get-plans");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-background">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Client Management",
                description:
                  "Easily organize and track all your clients in one place with custom profiles and detailed history",
                image:
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
              },
              {
                icon: <Dumbbell className="w-6 h-6" />,
                title: "Workout Builder",
                description:
                  "Create custom workout plans with our intuitive exercise library featuring over 500+ exercises",
                image:
                  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Progress Tracking",
                description:
                  "Monitor client metrics with interactive charts, body measurements, and progress photos",
                image:
                  "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80",
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Smart Notifications",
                description:
                  "Automated alerts for milestones, missed workouts, and client feedback in real-time",
                image:
                  "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&q=80",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="text-orange-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                {feature.image && (
                  <div className="mt-auto rounded-lg overflow-hidden h-40 w-full">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-orange-100">Active Coaches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-orange-100">Clients Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines your coaching business from client
              onboarding to progress tracking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-600 text-2xl font-bold">1</span>
              </div>
              <div className="rounded-lg overflow-hidden h-48 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"
                  alt="Add clients"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Your Clients</h3>
              <p className="text-muted-foreground">
                Easily onboard clients with our simple interface and organize
                them into groups with custom tags and categories
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-600 text-2xl font-bold">2</span>
              </div>
              <div className="rounded-lg overflow-hidden h-48 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&q=80"
                  alt="Create workout plans"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Create Workout Plans
              </h3>
              <p className="text-muted-foreground">
                Design personalized workout routines using our extensive
                exercise library with video demonstrations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-600 text-2xl font-bold">3</span>
              </div>
              <div className="rounded-lg overflow-hidden h-48 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&q=80"
                  alt="Track progress"
                  className="w-full h-full object-cover"
                />
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

      {/* Pricing Section */}
      <section className="py-24 bg-muted/30" id="pricing">
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
              <div className="bg-orange-500 text-white text-center py-3 px-4">
                <h3 className="text-xl font-medium">Recommended Plan</h3>
              </div>

              <div className="p-8 text-center">
                <div className="text-6xl font-bold mb-2">
                  <span>$20</span>
                  <span className="text-2xl text-muted-foreground">/month</span>
                </div>

                <div className="space-y-4 mt-8 text-left">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>Unlimited clients</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>Advanced analytics</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>Priority support</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>Custom workout builder</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80"
                    alt="John Miller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">John Miller</h4>
                  <p className="text-sm text-muted-foreground">
                    Personal Trainer, NYC
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "This platform has completely transformed how I manage my
                clients. The workout builder saves me hours each week, and my
                clients love the progress tracking features. I've grown my
                client base by 40% in just 3 months!"
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80"
                    alt="Sarah Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">
                    Fitness Studio Owner
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Managing 50+ clients used to be a nightmare. Now I can see
                everyone's progress at a glance and provide better coaching with
                less administrative work. The client portal feature has
                revolutionized how we communicate with clients."
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80"
                    alt="David Parker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">David Parker</h4>
                  <p className="text-sm text-muted-foreground">
                    Online Fitness Coach
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The analytics tools have helped me identify patterns in client
                progress that I never would have noticed otherwise. My retention
                rate has increased by 35% since I started using this platform,
                and the progress photo feature is a game-changer!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful tools that make PulseCoach the preferred
              platform for fitness professionals worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Client Portal Access
                </h3>
                <p className="text-muted-foreground">
                  Provide clients with their own secure portal to view workouts,
                  log progress, and communicate with you directly
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Progress Photo Tracking
                </h3>
                <p className="text-muted-foreground">
                  Securely store and compare client progress photos to visually
                  demonstrate transformation over time
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Comprehensive Metrics
                </h3>
                <p className="text-muted-foreground">
                  Track weight, body measurements, body fat percentage, and
                  custom metrics with beautiful visualization tools
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-time Notifications
                </h3>
                <p className="text-muted-foreground">
                  Get instant alerts when clients complete workouts, provide
                  feedback, or reach important milestones
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Exercise Library</h3>
                <p className="text-muted-foreground">
                  Access 500+ pre-loaded exercises with detailed instructions,
                  or create custom exercises for your unique training methods
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Dark Mode Support
                </h3>
                <p className="text-muted-foreground">
                  Enjoy a comfortable viewing experience in any lighting
                  condition with our beautiful dark mode interface
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of fitness professionals who are growing their
            business and delivering better results to clients. Start your 14-day
            free trial today!
          </p>
          <CTAButton />
        </div>
      </section>

      <Footer />
    </div>
  );
}
