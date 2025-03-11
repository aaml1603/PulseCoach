"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  formatCmToFeetInches,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
} from "@/utils/unit-conversion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../../../../../supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewClientMetricsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);

  // Update height in cm when feet/inches change
  const updateHeightFromImperial = () => {
    const heightInCm = feetInchesToCm(feet, inches);
    // Add a marker to prevent the reverse update
    setHeight(heightInCm.toString() + "_imperial");
  };

  // Update feet/inches when cm changes
  useEffect(() => {
    if (height && !isNaN(parseFloat(height))) {
      // Skip the update if it was triggered by the imperial inputs
      if (!height.endsWith("_imperial")) {
        const { feet: ft, inches: inch } = cmToFeetInches(parseFloat(height));
        setFeet(ft);
        setInches(inch);
      }
    }
  }, [height]);

  // Fetch client data when component mounts
  useEffect(() => {
    const fetchClient = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setClientData(data);
      }
    };

    fetchClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const weight = formData.get("weight")
      ? parseFloat(formData.get("weight") as string)
      : null;
    const bodyFat = formData.get("bodyFat")
      ? parseFloat(formData.get("bodyFat") as string)
      : null;
    const chest = formData.get("chest")
      ? parseFloat(formData.get("chest") as string)
      : null;
    const waist = formData.get("waist")
      ? parseFloat(formData.get("waist") as string)
      : null;
    const hip = formData.get("hip")
      ? parseFloat(formData.get("hip") as string)
      : null;
    const arm = formData.get("arm")
      ? parseFloat(formData.get("arm") as string)
      : null;
    const thigh = formData.get("thigh")
      ? parseFloat(formData.get("thigh") as string)
      : null;
    const notes = formData.get("notes") as string;
    const heightValue = height ? parseFloat(height) : null;

    try {
      const supabase = createClient();

      // Insert the new metrics
      const { data, error: insertError } = await supabase
        .from("client_metrics")
        .insert({
          client_id: params.id,
          date: new Date().toISOString(),
          weight,
          body_fat_percentage: bodyFat,
          chest_measurement: chest,
          waist_measurement: waist,
          hip_measurement: hip,
          arm_measurement: arm,
          thigh_measurement: thigh,
          notes: notes || null,
        });

      if (insertError) {
        throw insertError;
      }

      // Update client with gender and height if provided
      if (gender || heightValue) {
        const updateData: any = {};
        if (gender) updateData.gender = gender;
        if (heightValue) updateData.height = heightValue;

        const { error: updateError } = await supabase
          .from("clients")
          .update(updateData)
          .eq("id", params.id);

        if (updateError) {
          throw updateError;
        }
      }

      // Redirect to the client details page
      router.push(`/dashboard/clients/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to add metrics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Log Client Metrics</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Fitness Metrics for {clientData?.name || "Client"}
          </CardTitle>
          <CardDescription>
            Record your client's current measurements to track their progress
            over time.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center">
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          min="0"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="175"
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                          cm
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Select
                          value={feet.toString()}
                          onValueChange={(value) => {
                            setFeet(parseInt(value));
                            updateHeightFromImperial();
                          }}
                        >
                          <SelectTrigger className="w-20 rounded-r-none">
                            <SelectValue placeholder="ft" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => i + 4).map(
                              (ft) => (
                                <SelectItem key={ft} value={ft.toString()}>
                                  {ft} ft
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Select
                          value={inches.toString()}
                          onValueChange={(value) => {
                            setInches(parseInt(value));
                            updateHeightFromImperial();
                          }}
                        >
                          <SelectTrigger className="w-20 rounded-l-none border-l-0">
                            <SelectValue placeholder="in" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i).map(
                              (inch) => (
                                <SelectItem key={inch} value={inch.toString()}>
                                  {inch} in
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center">
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="70.5"
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                          kg
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="weight_lbs"
                        name="weight_lbs"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="155.4"
                        className="rounded-r-none"
                        onChange={(e) => {
                          const lbs = parseFloat(e.target.value);
                          if (!isNaN(lbs)) {
                            const kg = lbsToKg(lbs);
                            document.getElementById("weight").value =
                              kg.toString();
                          }
                        }}
                      />
                      <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        lbs
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
                  <Input
                    id="bodyFat"
                    name="bodyFat"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="20.5"
                  />
                </div>
              </div>

              {/* Body Measurements */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Body Measurements (cm)
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chest">Chest</Label>
                  <Input
                    id="chest"
                    name="chest"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="95"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waist">Waist</Label>
                  <Input
                    id="waist"
                    name="waist"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hip">Hip</Label>
                  <Input
                    id="hip"
                    name="hip"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arm">Arms (bicep)</Label>
                    <Input
                      id="arm"
                      name="arm"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="35"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thigh">Thighs</Label>
                    <Input
                      id="thigh"
                      name="thigh"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="55"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional observations or comments about the client's current condition"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/clients/${params.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Metrics"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
