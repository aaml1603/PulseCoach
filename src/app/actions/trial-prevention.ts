"use server";

import { createClient } from "../../../supabase/server";

// Check if an email domain has been used for trials too many times
export async function checkEmailDomainForTrialAbuse(email: string) {
  const supabase = await createClient();

  // Extract the domain from the email
  const domain = email.split("@")[1];

  if (!domain) return { allowed: true };

  // Count how many trial users exist with this email domain
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .like("email", `%@${domain}`)
    .not("trial_start_date", "is", null);

  if (error) {
    console.error("Error checking email domain:", error);
    // If there's an error, we'll allow the trial to be safe
    return { allowed: true };
  }

  // If there are too many trials from this domain, block it
  // Adjust the threshold as needed
  const MAX_TRIALS_PER_DOMAIN = 3;
  if (count && count >= MAX_TRIALS_PER_DOMAIN) {
    return {
      allowed: false,
      reason: "Too many trial accounts from this email domain",
    };
  }

  return { allowed: true };
}

// Check if an IP address has been used for trials too many times
export async function checkIPForTrialAbuse(ip: string) {
  const supabase = await createClient();

  // Get the count of trials associated with this IP
  const { data, error } = await supabase
    .from("trial_ip_tracking")
    .select("count")
    .eq("ip_address", ip)
    .single();

  if (error && error.code !== "PGSQL_ERROR_NO_DATA_FOUND") {
    console.error("Error checking IP for trial abuse:", error);
    // If there's an error, we'll allow the trial to be safe
    return { allowed: true };
  }

  // If this IP has been used for too many trials, block it
  const MAX_TRIALS_PER_IP = 2;
  if (data && data.count >= MAX_TRIALS_PER_IP) {
    return {
      allowed: false,
      reason: "Too many trial accounts from this IP address",
    };
  }

  return { allowed: true };
}

// Record a new trial signup with the IP address
export async function recordTrialSignup(
  userId: string,
  email: string,
  ip: string,
) {
  const supabase = await createClient();

  // Record the IP in our tracking table
  const { error: ipError } = await supabase.from("trial_ip_tracking").upsert(
    {
      ip_address: ip,
      count: 1,
      last_signup_at: new Date().toISOString(),
      last_user_id: userId,
    },
    {
      onConflict: "ip_address",
      ignoreDuplicates: false,
    },
  );

  if (ipError) {
    console.error("Error recording IP for trial tracking:", ipError);
  }

  return { success: !ipError };
}
