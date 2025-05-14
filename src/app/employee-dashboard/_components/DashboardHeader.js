'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import ThemeToggle from '../../components/ThemeToggle';
import { useRouter } from 'next/navigation';

const getInitials = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

export default function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const name = session?.user?.name || '';

  return (
    <div className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => router.push('/employee-dashboard/employee-profile')}
          className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center hover:bg-indigo-700"
          aria-label="Go to profile"
        >
          {getInitials(name)}
        </button>
      </div>
    </div>
  );
}
