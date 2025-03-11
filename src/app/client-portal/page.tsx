import { redirect } from "next/navigation";

export default function ClientPortalPage() {
  // Redirect to home page if someone tries to access /client-portal directly
  redirect("/");
}
