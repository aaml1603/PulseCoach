import { createClient } from "../../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ClientPicturesPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch client details
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .eq("coach_id", user.id)
    .single();

  if (clientError || !client) {
    return notFound();
  }

  // Fetch progress pictures for this client
  const { data: pictures, error: picturesError } = await supabase
    .from("progress_pictures")
    .select("*")
    .eq("client_id", params.id)
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/clients/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Progress Pictures: {client.name}
          </h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/clients/${params.id}/pictures/upload`}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Pictures
          </Link>
        </Button>
      </div>

      {pictures && pictures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pictures.map((picture) => (
            <Card key={picture.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={picture.image_url}
                  alt={`Progress picture from ${new Date(picture.date).toLocaleDateString()}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {new Date(picture.date).toLocaleDateString()}
                    </p>
                    {picture.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {picture.notes}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/clients/${params.id}/pictures/${picture.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No progress pictures yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start tracking your client's visual progress by adding their first
            progress picture.
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/dashboard/clients/${params.id}/pictures/upload`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add First Picture
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
