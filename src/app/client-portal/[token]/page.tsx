import { Metadata } from "next";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import ClientPortalContent from "@/components/client-portal-content";

export const metadata: Metadata = {
  title: "Client Portal - PulseCoach",
  description: "Access your workouts and track your fitness progress",
};

export default function ClientPortalPage({
  params,
}: {
  params: { token: string };
}) {
  return <ClientPortalContent token={params.token} />;
}
