-- Create email_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delete any existing templates with the same name to avoid duplicates
DELETE FROM email_templates WHERE name = 'client_portal_invitation';

-- Insert client portal invitation template
INSERT INTO email_templates (name, subject, html_content, text_content) 
VALUES (
  'client_portal_invitation',
  'Your Personal Training Portal Access',
  E'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to Your Personal Training Portal</h2>
    <p>Hello {{clientName}},</p>
    <p>{{coachName}} has invited you to access your personal training portal where you can view your workouts, track your progress, and communicate directly.</p>
    <p>Click the button below to access your portal:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{portalUrl}}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Your Portal</a>
    </div>
    <p>If the button doesn\'t work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #3b82f6;">{{portalUrl}}</p>
    <p>This link is valid for 90 days and is unique to you. Please don\'t share it with others.</p>
    <p>Best regards,<br>{{coachName}}<br>PulseCoach</p>
  </div>',
  'Hello {{clientName}}, {{coachName}} has invited you to access your personal training portal. Access your portal here: {{portalUrl}}. This link is valid for 90 days and is unique to you.'
);

-- Add realtime publication for email_templates
ALTER PUBLICATION supabase_realtime ADD TABLE email_templates;
