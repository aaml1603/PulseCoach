"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  created_at: string;
  updated_at: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        setTemplates(data);
        setSelectedTemplate(data[0]);
        updatePreview(data[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load email templates");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreview = (template: EmailTemplate) => {
    // Replace placeholders with sample values
    let html = template.html_content
      .replace(/\{\{clientName\}\}/g, "John Doe")
      .replace(/\{\{coachName\}\}/g, "Coach Smith")
      .replace(
        /\{\{portalUrl\}\}/g,
        "https://example.com/client-portal/abc123",
      );

    setPreviewHtml(html);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      updatePreview(template);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const supabase = createClient();
      const { error } = await supabase
        .from("email_templates")
        .update({
          subject: selectedTemplate.subject,
          html_content: selectedTemplate.html_content,
          text_content: selectedTemplate.text_content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedTemplate.id);

      if (error) throw error;

      setSuccess("Template saved successfully");
      updatePreview(selectedTemplate);
    } catch (err: any) {
      setError(err.message || "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof EmailTemplate, value: string) => {
    if (!selectedTemplate) return;

    setSelectedTemplate({
      ...selectedTemplate,
      [field]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/admin/feedback">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Email Templates</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/feedback">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Email Templates</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6 flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Select a template to edit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={
                      selectedTemplate?.id === template.id
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {template.name
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTemplate.name
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardTitle>
                <CardDescription>Edit the template content</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="edit">
                  <TabsList className="mb-4">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={selectedTemplate.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="html_content">HTML Content</Label>
                      <div className="text-xs text-muted-foreground mb-2">
                        Available variables: &#123;&#123;clientName&#125;&#125;,
                        &#123;&#123;coachName&#125;&#125;,
                        &#123;&#123;portalUrl&#125;&#125;
                      </div>
                      <Textarea
                        id="html_content"
                        value={selectedTemplate.html_content}
                        onChange={(e) =>
                          handleInputChange("html_content", e.target.value)
                        }
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text_content">Plain Text Content</Label>
                      <Textarea
                        id="text_content"
                        value={selectedTemplate.text_content}
                        onChange={(e) =>
                          handleInputChange("text_content", e.target.value)
                        }
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="border rounded-md p-4 bg-white">
                      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
                        <strong>Subject:</strong> {selectedTemplate.subject}
                      </div>
                      <div
                        className="email-preview"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="ml-auto"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Template
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <p>Select a template to edit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
