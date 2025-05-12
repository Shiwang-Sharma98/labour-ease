'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Home, Briefcase, Heart, Bell, Settings } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all ${
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
        <Link href="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
          <Home className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Overview</span>
        </Link>
        <Link href="/applied-jobs" className="flex items-center p-4 hover:bg-gray-700">
          <Briefcase className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Applied Jobs</span>
        </Link>
        <Link href="/favorite-jobs" className="flex items-center p-4 hover:bg-gray-700">
          <Heart className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Favourite Jobs</span>
        </Link>
        <Link href="/job-alerts" className="flex items-center p-4 hover:bg-gray-700">
          <Bell className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Job Alerts</span>
        </Link>
        <Link href="/settings" className="flex items-center p-4 hover:bg-gray-700">
          <Settings className="w-5 h-5" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} sm:block`}>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
