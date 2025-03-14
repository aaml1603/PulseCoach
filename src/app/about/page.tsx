import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import {
  Users,
  Award,
  Target,
  Dumbbell,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Us - PulseCoach",
  description:
    "Learn about PulseCoach's mission, team, and commitment to helping fitness professionals succeed.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About PulseCoach
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Empowering fitness professionals with the tools they need to
                deliver exceptional client results
              </p>
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <Target className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      At PulseCoach, our mission is to transform how fitness
                      professionals manage their business and deliver results to
                      clients. We believe that by providing powerful, intuitive
                      tools, we can help coaches focus on what they do best:
                      changing lives through fitness.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      We're dedicated to continuous innovation, exceptional
                      support, and creating technology that makes a real
                      difference in the fitness industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at PulseCoach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Client-Centered</h3>
                <p className="text-muted-foreground">
                  We design every feature with the coach-client relationship in
                  mind, ensuring our platform enhances the personal connection
                  that's at the heart of effective coaching.
                </p>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We're committed to delivering a premium platform that exceeds
                  expectations in functionality, reliability, and user
                  experience, helping coaches deliver excellence to their
                  clients.
                </p>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We believe in the power of community to elevate the fitness
                  industry. Our platform fosters connections between coaches and
                  clients while supporting a broader network of fitness
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A passionate group of fitness enthusiasts and technology experts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Alex Morgan",
                  role: "Founder & CEO",
                  bio: "Former personal trainer with 10+ years of experience who saw the need for better technology in the fitness industry.",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                },
                {
                  name: "Jamie Chen",
                  role: "Head of Product",
                  bio: "Fitness technology specialist with a background in UX design and a passion for creating intuitive, powerful tools for coaches.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
                },
                {
                  name: "Sam Wilson",
                  role: "Lead Developer",
                  bio: "Full-stack developer and CrossFit enthusiast who brings technical expertise and a user's perspective to our platform.",
                  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="aspect-square relative bg-muted/50">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card border border-border/40 rounded-xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have questions or want to learn more about PulseCoach? We'd
                  love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Email Us</h3>
                  <a
                    href="mailto:contact@pulsecoach.org"
                    className="text-primary hover:underline"
                  >
                    contact@pulsecoach.org
                  </a>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Fitness Street
                    <br />
                    San Francisco, CA 94103
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg">
                  <Link href="/sign-up">Start Your Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
