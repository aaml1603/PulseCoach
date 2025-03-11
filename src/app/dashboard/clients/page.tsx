import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusCircle,
  UserCircle,
  Mail,
  Phone,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ClientSearch from "@/components/client-search";

export default async function ClientsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch clients for the logged-in coach
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq("coach_id", user?.id)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Clients</h1>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <ClientSearch clients={clients || []} />
          <Button asChild>
            <Link href="/dashboard/clients/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Link>
          </Button>
        </div>
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="block">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="flex items-start gap-4 no-underline"
                    >
                      <div className="bg-blue-100 rounded-full p-3">
                        <UserCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{client.email || "No email"}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone || "No phone"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-4">
                      <div className="text-sm">
                        <span className="font-medium">Goal:</span>{" "}
                        {client.goal || "No goal set"}
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-1 ${client.status === "active" ? "text-green-600" : "text-gray-500"}`}
                        >
                          {client.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4 bg-gray-50 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/clients/${client.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/clients/${client.id}/workouts/assign`}
                      >
                        Workouts
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No clients yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by adding your first client.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/clients/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
