'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import { skillsData } from '@/app/skillsDatabase';

const EmployeeProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        toast.error('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user');
        const user = await res.json();

        if (user.role !== 'labour') {
          toast.error('Access denied. Only labours can view this page.');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }

        const profileRes = await fetch(`/api/updateLabour?id=${user.id}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
        } else {
          toast.error('Failed to load profile');
        }
      } catch (err) {
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [status, router]);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'E';
  };

  if (status === 'loading' || loading) {
    return <div className="p-4 text-center text-white">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-4 text-red-600">Access denied or profile not found.</div>;
  }

  return (
    <div className="flex justify-center items-center px-4 py-10 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="w-full max-w-lg bg-slate-950 shadow-lg rounded-2xl p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center">
          {/* Avatar with Initial */}
          <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-md">
            {getInitials(profile.name)}
          </div>

          {/* Full Name */}
          <h2 className="text-2xl font-bold">{profile.name || 'Unnamed'}</h2>

          {/* Optional Username Display */}
          {profile.username && (
            <p className="text-sm text-gray-400 mt-1">@{profile.username}</p>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-3 text-sm sm:text-base">
          <ProfileField label="📧 Email" value={profile.email} />
          <ProfileField label="📞 Phone" value={profile.phone || 'Not provided'} />
          <ProfileField label="🏠 Address" value={profile.address || 'Not provided'} />
          <ProfileField label="💼 Experience" value={profile.experience || 'Not specified'} />
          <ProfileField
            label="🛠 Skills"
            value={
              profile.skills?.length
                ? profile.skills
                    .map((id) => skillsData.find(skill => skill.id === id)?.name)
                    .filter(Boolean)
                    .join(', ')
                : 'None'
            }
          />
          <ProfileField label="🔐 Role" value={profile.role || 'Not assigned'} />
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/employee-dashboard"
            className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

// Reusable Field Component
const ProfileField = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="font-semibold">{label}:</span>
    <span className="text-slate-300">{value}</span>
  </div>
);

export default EmployeeProfile;
