import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("WARNING: SendGrid API key is not configured");
}

// Configure SendGrid to reduce spam likelihood
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string,
) => {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@pulsecoach.com";
  const fromName = "PulseCoach";

  // Prepare email message with proper headers to reduce spam likelihood
  const msg = {
    to,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject,
    text,
    html,
    // Add mail settings to improve deliverability
    mailSettings: {
      sandboxMode: {
        enable: false,
      },
      bypassListManagement: {
        enable: true,
      },
    },
    trackingSettings: {
      clickTracking: {
        enable: true,
      },
      openTracking: {
        enable: true,
      },
    },
  };

  return sgMail.send(msg);
};

export default sgMail;
