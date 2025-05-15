'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Bell, Edit, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      // No need to manually clear localStorage or redirect,
      // signOut does that for you with the callbackUrl
    } catch (err) {
      console.error('Logout error:', err);
    }
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

        <Link
          href="/employee-dashboard/employee-apply"
          className="flex items-center p-4 hover:bg-muted rounded-md"
        >
          <Bell className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Job Alerts</span>
        </Link>

        <Link
          href="/employee-dashboard/employee-profile"
          className="flex items-center p-4 hover:bg-muted rounded-md"
        >
          <Edit className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Edit Profile</span>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 hover:bg-muted rounded-md text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
