import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Globe,
  Clock,
  Users,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy - PulseCoach",
  description:
    "Learn about how PulseCoach collects, uses, and protects your personal information.",
};

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64">
            <Shield className="w-full h-full" />
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64">
            <Lock className="w-full h-full" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header section with visual elements */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                How we collect, use, and protect your personal information
              </p>
              <div className="mt-6 text-muted-foreground inline-flex items-center px-4 py-2 bg-muted/50 rounded-full">
                <Clock className="h-4 w-4 mr-2" />
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Content with styled sections */}
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">Introduction</h2>
                    <p className="text-muted-foreground">
                      PulseCoach ("we", "our", or "us") is committed to
                      protecting your privacy. This Privacy Policy explains how
                      we collect, use, disclose, and safeguard your information
                      when you use our website and services.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">
                      Information We Collect
                    </h2>
                    <p>
                      We collect information that you provide directly to us,
                      including:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>
                            Personal information (name, email address, phone
                            number)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Account credentials</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Profile information</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Client data you input into our system</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Payment information</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Communications with us</span>
                        </li>
                      </ul>
                    </div>

                    <p className="mt-6">
                      We also automatically collect certain information when you
                      use our services:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>
                            Log data (IP address, browser type, pages visited)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Device information</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Usage information</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Cookies and similar technologies</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">
                      How We Use Your Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>
                              Provide, maintain, and improve our services
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>Process transactions</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>
                              Send you technical notices and support messages
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>Respond to your comments and questions</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>Develop new products and services</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>Monitor and analyze trends and usage</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>
                              Detect and prevent fraudulent transactions
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>Personalize your experience</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-card border border-border/40 rounded-xl p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" /> Data Security
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We implement appropriate technical and organizational
                    measures to protect the security of your personal
                    information. However, no method of transmission over the
                    Internet or electronic storage is 100% secure, so we cannot
                    guarantee absolute security.
                  </p>
                </section>

                <section className="bg-card border border-border/40 rounded-xl p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> Data Retention
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We retain your information for as long as your account is
                    active or as needed to provide you services, comply with our
                    legal obligations, resolve disputes, and enforce our
                    agreements.
                  </p>
                </section>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-card border border-border/40 rounded-xl p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Children's
                    Privacy
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Our services are not directed to children under 16, and we
                    do not knowingly collect personal information from children
                    under 16. If we learn we have collected personal information
                    from a child under 16, we will delete that information.
                  </p>
                </section>

                <section className="bg-card border border-border/40 rounded-xl p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" /> International
                    Data Transfers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your information may be transferred to, and processed in,
                    countries other than the country in which you reside. These
                    countries may have data protection laws that are different
                    from the laws of your country.
                  </p>
                </section>
              </div>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" /> Changes to This
                  Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 shadow-sm text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                  <Mail className="h-6 w-6 text-primary" /> Contact Us
                </h2>
                <p className="text-lg mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <a
                  href="mailto:contact@pulsecoach.org"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" /> contact@pulsecoach.org
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
