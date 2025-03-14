"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Dumbbell, UserCircle, Menu, X } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeToggle } from "./ui/theme-toggle";
import { useState } from "react";

export default function Navbar({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-background py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <div className="h-10 w-10 relative">
            <img
              src="https://i.imgur.com/xFQGdgC.png"
              alt="FitCoach Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-bold">PulseCoach</span>
        </Link>

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
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            Pricing
          </Link>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-4 space-y-3">
          <Link
            href="/"
            className="block py-2 text-sm font-medium hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="block py-2 text-sm font-medium hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="block py-2 text-sm font-medium hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            className="block py-2 text-sm font-medium hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="pt-2 flex items-center justify-between">
            <ThemeToggle />
            {user ? (
              <div className="flex gap-2">
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm">Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
