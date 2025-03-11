"use client";

import { useState, useEffect } from "react";
import { Bell, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "../../supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type: string;
  related_entity_id?: string;
  related_entity_type?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState<{
    name?: string;
    id?: string;
  } | null>(null);
  const [workoutDetails, setWorkoutDetails] = useState<{
    name?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const subscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // Add new notification to the list
          setNotifications((prev) => [payload.new, ...prev.slice(0, 9)]);
          setUnreadCount((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    // Update local state
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const deleteNotification = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").delete().eq("id", id);

    // Update local state
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => {
      const notification = notifications.find((n) => n.id === id);
      return notification && !notification.is_read
        ? Math.max(0, prev - 1)
        : prev;
    });

    // Close the dialog
    setDialogOpen(false);
  };

  const markAllAsRead = async () => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    // Update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const fetchRelatedDetails = async (notification: Notification) => {
    if (
      notification.type === "workout_completed" &&
      notification.related_entity_id
    ) {
      const supabase = createClient();

      // Get client workout details
      const { data: workoutData } = await supabase
        .from("client_workouts")
        .select("client_id, workout_id")
        .eq("id", notification.related_entity_id)
        .single();

      if (workoutData) {
        // Get client details
        const { data: clientData } = await supabase
          .from("clients")
          .select("name, id")
          .eq("id", workoutData.client_id)
          .single();

        if (clientData) {
          setClientDetails(clientData);
        }

        // Get workout details
        const { data: workoutInfo } = await supabase
          .from("workouts")
          .select("name")
          .eq("id", workoutData.workout_id)
          .single();

        if (workoutInfo) {
          setWorkoutDetails(workoutInfo);
        }
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification.id);

    // Set selected notification and open dialog
    setSelectedNotification(notification);
    await fetchRelatedDetails(notification);
    setDialogOpen(true);
  };

  const handleViewClient = () => {
    if (clientDetails?.id) {
      router.push(`/dashboard/clients/${clientDetails.id}`);
      setDialogOpen(false);
      setOpen(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${!notification.is_read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>No notifications</p>
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {formatDateTime(selectedNotification?.created_at || "")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm">{selectedNotification?.message}</p>

            {selectedNotification?.type === "workout_completed" &&
              clientDetails && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        Client: {clientDetails.name}
                      </h4>
                      {workoutDetails && (
                        <p className="text-sm text-muted-foreground">
                          Workout: {workoutDetails.name}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleViewClient}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> View Client
                    </Button>
                  </div>
                </div>
              )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              onClick={() =>
                selectedNotification &&
                deleteNotification(selectedNotification.id)
              }
            >
              Delete
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
