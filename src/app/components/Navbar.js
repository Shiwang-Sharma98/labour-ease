"use client";

import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    // apply your semantic text color once here
    <nav className="py-2 text-foreground dark:text-foreground">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2">
        
        {/* Left: Theme toggle */}
        <div className="flex items-center gap-4">
          <div className="px-1 py-1 rounded-full">
            <ThemeToggle />
          </div>
        </div>

        {/* Center nav links */}
        <ul className="flex gap-6 px-6 py-2 rounded-full text-sm font-medium shadow-md">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
          </li>
        </ul>

        {/* Right: Create Account link */}
        <div className="flex items-center gap-2">
          <Link href="/register" className="flex items-center gap-1 text-sm hover:underline">
            <User className="w-4 h-4" /> Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
