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
import { UserCircle, Menu, X, LogOut, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "./notification-bell";
import { ThemeToggle } from "./ui/theme-toggle";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" prefetch className="flex items-center gap-2">
            <div className="h-10 w-10 relative hover:rotate-12 transition-transform group">
              <img
                src="https://i.imgur.com/xFQGdgC.png"
                alt="PulseCoach Logo"
                className="h-full w-full object-contain group-hover:animate-heartbeat"
              />
            </div>
            <span className="text-xl font-bold font-heading">PulseCoach</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/messages">
              <MessageSquare className="h-5 w-5" />
            </Link>
          </Button>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-4 space-y-4">
          <div className="flex justify-between items-center">
            <ThemeToggle />
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <NotificationBell />
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/dashboard/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/dashboard/settings">
              <User className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
              setIsMenuOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      )}
    </nav>
  );
}
