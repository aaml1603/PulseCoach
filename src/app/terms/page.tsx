import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";

export const metadata = {
  title: "Terms of Service - PulseCoach",
  description:
    "Read the terms and conditions that govern your use of PulseCoach's services.",
};

export default async function TermsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using PulseCoach's services, you agree to be bound
              by these Terms of Service and all applicable laws and regulations.
              If you do not agree with any of these terms, you are prohibited
              from using or accessing our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              PulseCoach provides a platform for fitness professionals to manage
              clients, create workout plans, track progress, and communicate
              with clients. We reserve the right to modify, suspend, or
              discontinue any aspect of our services at any time.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our services, you must create an
              account. You are responsible for maintaining the confidentiality
              of your account information and for all activities that occur
              under your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>

            <h2>4. Subscription and Payments</h2>
            <p>
              Some of our services require payment of fees. By subscribing to a
              paid service, you agree to pay all fees in accordance with the
              billing terms in effect at the time. Subscription fees are
              non-refundable except as required by law or as explicitly stated
              in our refund policy.
            </p>

            <h2>5. Free Trial</h2>
            <p>
              We may offer a free trial period for our services. At the end of
              the trial period, your account will automatically be charged for
              the subscription unless you cancel before the trial ends. You may
              be required to provide payment information to start a free trial.
            </p>

            <h2>6. User Content</h2>
            <p>
              You retain all rights to any content you submit, post, or display
              on or through our services. By providing content, you grant us a
              worldwide, non-exclusive, royalty-free license to use, reproduce,
              modify, adapt, publish, and display such content in connection
              with providing our services.
            </p>

            <h2>7. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the operation of our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Collect user information without consent</li>
              <li>Use our services to send unsolicited communications</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              Our services and all content, features, and functionality are
              owned by PulseCoach or its licensors and are protected by
              copyright, trademark, and other intellectual property laws. You
              may not copy, modify, distribute, sell, or lease any part of our
              services without our explicit permission.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST
              EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
              PULSECOACH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
              DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR
              ACCESS TO OR USE OF OUR SERVICES.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless PulseCoach and its
              officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, and expenses arising out of or in
              any way connected with your access to or use of our services or
              your violation of these Terms.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our
              services at any time, without prior notice or liability, for any
              reason, including if you violate these Terms. Upon termination,
              your right to use our services will immediately cease.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to its conflict of
              law provisions. Any legal action or proceeding arising out of or
              relating to these Terms shall be brought exclusively in the
              federal or state courts located in the United States.
            </p>

            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              provide notice of significant changes by posting the updated Terms
              on our website. Your continued use of our services after such
              changes constitutes your acceptance of the new Terms.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a
                href="mailto:contact@pulsecoach.org"
                className="text-primary hover:underline"
              >
                contact@pulsecoach.org
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
