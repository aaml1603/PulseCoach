"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Search, MessageSquare, Send } from "lucide-react";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  email?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
};

export default function MessagesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Get all clients with their latest message
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, name, email")
          .eq("coach_id", user.id)
          .order("name");

        if (clientsError) throw clientsError;

        // For each client, get their latest message and unread count
        const clientsWithMessages = await Promise.all(
          (clientsData || []).map(async (client) => {
            // Get latest message
            const { data: messages } = await supabase
              .from("messages")
              .select("*")
              .eq("client_id", client.id)
              .order("created_at", { ascending: false })
              .limit(1);

            // Get unread count
            const { count: unreadCount } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("client_id", client.id)
              .eq("is_from_client", true)
              .eq("is_read", false);

            const latestMessage = messages && messages[0];

            return {
              ...client,
              lastMessage: latestMessage?.content,
              lastMessageDate: latestMessage?.created_at,
              unreadCount: unreadCount || 0,
            };
          }),
        );

        // Sort by latest message date
        const sortedClients = clientsWithMessages.sort((a, b) => {
          if (!a.lastMessageDate) return 1;
          if (!b.lastMessageDate) return -1;
          return (
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
          );
        });

        setClients(sortedClients);
        setFilteredClients(sortedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your client message threads</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : filteredClients.length > 0 ? (
                <div className="divide-y">
                  {filteredClients.map((client) => (
                    <Link
                      key={client.id}
                      href={`/dashboard/clients/${client.id}/messages`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 p-4 hover:bg-muted transition-colors cursor-pointer relative">
                        <Avatar>
                          <AvatarFallback>
                            {client.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">
                              {client.name}
                            </h4>
                            {client.lastMessageDate && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(client.lastMessageDate)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        {client.unreadCount > 0 && (
                          <div className="absolute right-4 top-4 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {client.unreadCount}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery
                    ? "No clients found"
                    : "No clients with messages"}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[500px] text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">
              Choose a client from the list to view your conversation history
              and send messages.
            </p>
            <Button asChild>
              <Link href="/dashboard/clients">View All Clients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
