"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CTAButton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/dashboard"
        className="inline-flex items-center px-6 py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Get Started Now
        <ArrowUpRight className="ml-2 w-4 h-4" />
      </Link>
      <Link
        href="#pricing"
        className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        View Pricing
      </Link>
    </div>
  );
}
