'use client'; 

import Link from 'next/link';
import { useState } from 'react';
import { Home, Briefcase, Heart, Bell, Edit, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // You can also clear auth tokens or localStorage here if needed
    console.log("Logging out...");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[rgb(var(--sidebar))] text-[rgb(var(--foreground))] transition-all ${
        isOpen ? 'w-64' : 'w-16'
      } sm:w-64`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 sm:justify-center">
        <span className={`text-lg font-bold ${isOpen ? 'block' : 'hidden'} sm:block`}>
          Labour-Ease
        </span>
        <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Navigation Links */}
      <div className="space-y-4 mt-8">
        <Link href="/dashboard" className="flex items-center p-4 hover:bg-muted rounded-md">
          <Home className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Overview</span>
        </Link>
        <Link href="/applied-jobs" className="flex items-center p-4 hover:bg-muted rounded-md">
          <Briefcase className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Applied Jobs</span>
        </Link>
        <Link href="/favorite-jobs" className="flex items-center p-4 hover:bg-muted rounded-md">
          <Heart className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Favourite Jobs</span>
        </Link>
        <Link href="/employee-dashboard/employee-apply" className="flex items-center p-4 hover:bg-muted rounded-md">
          <Bell className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Job Alerts</span>
        </Link>
        <Link href="/profile" className="flex items-center p-4 hover:bg-muted rounded-md">
          <Edit className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Edit Profile</span>
        </Link>
      </div>

      {/* Logout Link */}
      <div className="absolute bottom-4 w-full px-4">
        <Link
          href="/"
          onClick={handleLogout}
          className="flex items-center p-4 hover:bg-muted rounded-md text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
