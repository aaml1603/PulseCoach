import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import {
  Shield,
  Lock,
  Server,
  FileText,
  Key,
  AlertTriangle,
  Eye,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Security - PulseCoach",
  description:
    "Learn about how PulseCoach protects your data and maintains the security of our platform.",
};

export default async function SecurityPage() {
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
                Security Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                How we protect your data and maintain platform security
              </p>
            </div>

            {/* Content with styled sections */}
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">Data Protection</h2>
                    <p className="text-muted-foreground">
                      PulseCoach employs industry-standard security measures to
                      protect your personal and client information. All data is
                      encrypted both in transit and at rest using strong
                      encryption protocols.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          End-to-end encryption for all sensitive data
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Regular security audits and vulnerability assessments
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Secure database architecture with multiple protection
                          layers
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">
                      Infrastructure Security
                    </h2>
                    <p>
                      Our platform is built on secure, enterprise-grade
                      infrastructure with multiple redundancies and safeguards:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>
                            Cloud infrastructure with built-in security controls
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Regular security patches and updates</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>DDoS protection and mitigation</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>
                            Continuous monitoring for suspicious activities
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Automated backup systems</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>Disaster recovery protocols</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">
                      Account Security
                    </h2>
                    <p>
                      We implement multiple layers of protection for user
                      accounts:
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Strong password requirements and secure password
                          storage
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Multi-factor authentication options</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Automatic session timeouts and secure login protocols
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Account activity monitoring and suspicious login
                          detection
                        </span>
                      </li>
                    </ul>
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
                      Privacy Controls
                    </h2>
                    <p>We give you control over your data and privacy:</p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Granular permission settings for client data access
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Data export and deletion options</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Transparent data usage policies</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Client consent management tools</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mt-0">
                      Incident Response
                    </h2>
                    <p>
                      In the unlikely event of a security incident, we have
                      comprehensive protocols in place:
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Dedicated security response team</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Prompt notification of affected users</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>Transparent communication about incidents</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>
                          Continuous improvement of security measures based on
                          incidents
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 shadow-sm text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                  <Mail className="h-6 w-6 text-primary" /> Report Security
                  Issues
                </h2>
                <p className="text-lg mb-4">
                  If you discover a security vulnerability or have concerns
                  about our security practices, please contact us immediately
                  at:
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
