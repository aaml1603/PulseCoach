import { createClient } from "../../../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeleteProgressPictureButton from "@/components/delete-progress-picture-button";

export default async function ProgressPictureDetailPage({
  params,
}: {
  params: { id: string; pictureId: string };
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

  // Fetch the specific progress picture
  const { data: picture, error: pictureError } = await supabase
    .from("progress_pictures")
    .select("*")
    .eq("id", params.pictureId)
    .eq("client_id", params.id)
    .single();

  if (pictureError || !picture) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${params.id}/pictures`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Progress Picture Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              Picture from {new Date(picture.date).toLocaleDateString()}
            </span>
            <DeleteProgressPictureButton
              pictureId={picture.id}
              clientId={params.id}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image
                  src={picture.image_url}
                  alt={`Progress picture from ${new Date(picture.date).toLocaleDateString()}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-medium">Date</h3>
                <p>{new Date(picture.date).toLocaleString()}</p>
              </div>

              {picture.notes && (
                <div>
                  <h3 className="text-lg font-medium">Notes</h3>
                  <p className="whitespace-pre-wrap">{picture.notes}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium">Client</h3>
                <p>{client.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/clients/${params.id}/pictures`}>
              Back to All Pictures
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={picture.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Size
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
