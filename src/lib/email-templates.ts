/**
 * Email templates with consistent design to reduce spam likelihood
 */

export function getBaseEmailTemplate(
  content: string,
  recipientEmail?: string,
): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PulseCoach</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .email-header {
      text-align: center;
      padding: 20px 0;
      background-color: #ffffff;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid #eaeaea;
    }
    .email-logo {
      width: 120px;
      height: auto;
    }
    .email-content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .email-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #f97316;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .email-button:hover {
      background-color: #ea580c;
    }
    .email-footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #666;
    }
    .text-muted {
      color: #666;
      font-size: 14px;
    }
    h1 {
      color: #111;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    p {
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://i.imgur.com/xFQGdgC.png" alt="PulseCoach Logo" class="email-logo">
    </div>
    <div class="email-content">
      ${content}
    </div>
    <div class="email-footer">
      <p>© ${currentYear} PulseCoach. All rights reserved.</p>
      ${recipientEmail ? `<p>This email was sent to ${recipientEmail}</p>` : ""}
    </div>
  </div>
</body>
</html>
  `;
}

export function getPortalInviteTemplate(
  clientName: string,
  coachName: string,
  portalUrl: string,
  recipientEmail?: string,
): string {
  const content = `
    <h1>Your Personal Training Portal</h1>
    <p>Hi ${clientName},</p>
    <p>${coachName || "Your coach"} has invited you to access your personal training portal where you can view your workouts, track your progress, and communicate directly.</p>
    <a href="${portalUrl}" class="email-button">Access Your Portal</a>
    <p class="text-muted">If the button above doesn't work, you can copy and paste this link into your browser:</p>
    <p class="text-muted">${portalUrl}</p>
    <p>This link is valid for 90 days and is unique to you.</p>
    <p>Best regards,<br>${coachName || "Your Coach"}</p>
  `;

  return getBaseEmailTemplate(content, recipientEmail);
}

export function getWorkoutAssignedTemplate(
  clientName: string,
  workoutName: string,
  portalUrl: string,
  recipientEmail?: string,
): string {
  const content = `
    <h1>New Workout Assigned</h1>
    <p>Hi ${clientName},</p>
    <p>Your coach has assigned you a new workout: <strong>${workoutName}</strong></p>
    <p>You can view and track your workout by clicking the button below:</p>
    <a href="${portalUrl}" class="email-button">View Your Workout</a>
    <p class="text-muted">If the button above doesn't work, you can copy and paste this link into your browser:</p>
    <p class="text-muted">${portalUrl}</p>
    <p>Thank you for using PulseCoach!</p>
  `;

  return getBaseEmailTemplate(content, recipientEmail);
}

export function getTestEmailTemplate(email: string): string {
  const content = `
    <h1>Test Email from PulseCoach</h1>
    <p>Hi there,</p>
    <p>This is a test email to verify that the email sending functionality is working correctly.</p>
    <p>If you received this email, it means the system is properly configured.</p>
    <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 6px; border: 1px solid #eaeaea;">
      <p style="margin-top: 0;"><strong>Test Details:</strong></p>
      <p style="margin-bottom: 0;">Time: ${new Date().toISOString()}</p>
    </div>
    <p>Thank you for using PulseCoach!</p>
  `;

  return getBaseEmailTemplate(content, email);
}
