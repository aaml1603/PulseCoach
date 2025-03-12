"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  is_from_client: boolean;
  created_at: string;
  is_read: boolean;
}

interface CoachMessagingProps {
  clientId: string;
  clientName: string;
}

export default function CoachMessaging({
  clientId,
  clientName,
}: CoachMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();

    // Set up polling for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark client messages as read when viewed
  useEffect(() => {
    const unreadClientMessages = messages
      .filter((msg) => msg.is_from_client && !msg.is_read)
      .map((msg) => msg.id);

    if (unreadClientMessages.length > 0) {
      markMessagesAsRead(unreadClientMessages);
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/client-portal/messages?clientId=${clientId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "Error loading messages");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      await fetch("/api/client-portal/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageIds }),
      });

      // Update local state to mark messages as read
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg,
        ),
      );
    } catch (err) {
      // Silent fail - not critical
      console.error("Failed to mark messages as read", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/client-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          content: newMessage,
          isFromClient: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Add the new message to the list
      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err: any) {
      setError(err.message || "Error sending message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden bg-card w-full">
      {/* Messages header */}
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-medium">Messages with {clientName}</h3>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${!message.is_from_client ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${!message.is_from_client ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <div
                  className={`text-xs mt-1 flex items-center gap-1 ${!message.is_from_client ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  <span>{formatMessageTime(message.created_at)}</span>
                  {!message.is_from_client && message.is_read && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t bg-card">
        {error && (
          <div className="mb-2 text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${clientName}...`}
            className="flex-1 min-h-[60px] max-h-[120px]"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[60px] w-[60px]"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
