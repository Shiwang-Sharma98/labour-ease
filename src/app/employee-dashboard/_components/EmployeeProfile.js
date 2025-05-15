// components/EmployeeProfile.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import anime from 'animejs';

import Sidebar from './EmployeeNavbar';
import DashboardHeader from './DashboardHeader';

export default function EmployeeProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  experience: '',
});

  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    async function verifyAndFetch() {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        toast.error('Session expired. Please log in again.');
        return router.push('/login');
      }

      const u = await fetch('/api/user').then(r => r.json());
      if (u.role !== 'labour') {
        toast.error('Access denied.');
        return setTimeout(() => router.push('/dashboard'), 2000);
      }

      const p = await fetch(`/api/updateLabour?id=${u.id}`);
      if (!p.ok) toast.error('Failed to load profile');
      else setProfile(await p.json());

      fetch('/api/username')
        .then(r => r.json())
        .then(d => setUsername(d.username || ''))
        .catch(() => {});

      setLoading(false);
    }
    verifyAndFetch();
  }, [status, router]);

  useEffect(() => {
    if (!loading && cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 800,
      });
    }
  }, [loading]);

  const getInitial = n => (n ? n.charAt(0).toUpperCase() : 'E');

  const startFlip = (toEdit) => {
    if (!innerRef.current) return;
    const sign = toEdit ? 180 : 0;
    anime({
      targets: innerRef.current,
      rotateY: sign,
      duration: 600,
      easing: 'easeInOutQuad',
      complete: () => setIsEditing(toEdit),
    });
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setFormValues({ ...profile });
    startFlip(true);
  };

  const handleSave = async () => {
    // call update API here
    // await fetch('/api/updateLabour', { method: 'POST', body: JSON.stringify(formValues) });
    startFlip(false);
    setProfile(formValues);
    toast.success('Profile updated successfully!');
  };

  const handleChange = (field) => (e) => {
    setFormValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (status === 'loading' || loading) return <div className="p-4 text-center text-white">Loading profile…</div>;
  if (!profile) return <div className="p-4 text-red-600">Profile not found.</div>;

  return (
    <div className="flex bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen transition-colors">
      <Sidebar />
      <div className="flex-1 ml-16 sm:ml-64 flex flex-col">
        <DashboardHeader />
        <main className="flex-grow flex justify-center items-start pt-16 px-4 pb-10 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="perspective w-full max-w-2xl">
            <div
              ref={innerRef}
              className="w-full bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] shadow-lg rounded-2xl p-8 transform-style-3d"
              style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}>
              {/* Front Face */}
              <div style={{ backfaceVisibility: 'hidden' }}>
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.243 0 4.355.553 6.205 1.533m1.362 1.298A12.042 12.042 0 0112 21c-2.278 0-4.422-.612-6.247-1.672" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-4">
                      {profile.imageUrl ? <img src={profile.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-4xl text-white">{getInitial(username)}</div>}
                    </div>
                    <button onClick={handleEditClick} className="mt-2 px-3 py-1.5 text-sm uppercase tracking-wider border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition">
                      Edit Profile
                    </button>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <Field label="First name" value={profile.firstName || ''} />
                    <Field label="Last name" value={profile.lastName || ''} />
                    <Field label="Phone number" value={profile.phone || ''} />
                    <Field label="Email address" value={profile.email || ''} />
                    <Field label="Address" value={profile.address || ''} />
                    <Field label="Experience" value={profile.experience || ''} />
                  </div>
                </div>
              </div>
              {/* Back Face */}
              <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-4">
                      {profile.imageUrl ? <img src={profile.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-4xl text-white">{getInitial(username)}</div>}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <EditableField label="First name" value={formValues.firstName} onChange={handleChange('firstName')} />
                    <EditableField label="Last name" value={formValues.lastName} onChange={handleChange('lastName')} />
                    <EditableField label="Phone number" value={formValues.phone} onChange={handleChange('phone')} />
                    <EditableField label="Email address" value={formValues.email} onChange={handleChange('email')} />
                    <EditableField label="Address" value={formValues.address} onChange={handleChange('address')} />
                    <EditableField label="Experience" value={formValues.experience} onChange={handleChange('experience')} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => startFlip(false)} className="mr-4 px-4 py-2 rounded-full border border-gray-400">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-full bg-blue-500 text-white">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
      />
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-white">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
      />
    </div>
  );
}
