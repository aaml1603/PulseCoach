"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "./notification-bell";
import { ThemeToggle } from "./ui/theme-toggle";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="flex items-center gap-2">
            <div className="h-10 w-10 relative hover:rotate-12 transition-transform group">
              <img
                src="https://i.imgur.com/xFQGdgC.png"
                alt="FitCoach Logo"
                className="h-full w-full object-contain group-hover:animate-heartbeat"
              />
            </div>
            <span className="text-xl font-bold font-heading">PulseCoach</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
