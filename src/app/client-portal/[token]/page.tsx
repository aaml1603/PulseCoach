import { Metadata } from "next";
import ClientPortalContent from "@/components/client-portal-content";

export const metadata: Metadata = {
  title: "Client Portal - PulseCoach",
  description:
    "Access your workouts and track your fitness progress with your personal trainer",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientPortalPage({
  params,
}: {
  params: { token: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  return <ClientPortalContent token={params.token} />;
}
