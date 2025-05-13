'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { skillsData } from '@/app/skillsDatabase';
import toast from 'react-hot-toast';
import ShopkeeperNavbar from '@/app/shopkeeper-dashboard/_components/ShopkeeperNavbar';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 0, label: 'Job Title', field: 'title', type: 'text', placeholder: 'Enter job title...' },
  { id: 1, label: 'Job Description', field: 'description', type: 'textarea', placeholder: 'Describe the job (min. 100 words)...' },
  { id: 2, label: 'Search Skills', field: 'skills', type: 'skills', placeholder: 'Type to filter skills…' },
];

export default function JobPosting() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [shopkeeperId, setShopkeeperId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: [],
    search: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const stepRefs = useRef(steps.map(() => React.createRef()));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auth check
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      toast.error('Please log in.');
      router.push('/login');
      return;
    }
    fetch('/api/user')
      .then(r => r.json())
      .then(user => {
        if (user.role !== 'shopkeeper') throw new Error('Access denied');
        setShopkeeperId(user.id);
        setLoadingAuth(false);
      })
      .catch(err => {
        setAuthError(err.message);
        toast.error(err.message);
        setTimeout(() => router.push('/dashboard'), 1500);
      });
  }, [status]);

  // Detect outside click for skills dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredSkills = skillsData.filter(s =>
    s.name.toLowerCase().includes(form.search.toLowerCase())
  );

  const updateField = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const toggleSkill = id => {
    updateField(
      'skills',
      form.skills.includes(id)
        ? form.skills.filter(x => x !== id)
        : [...form.skills, id]
    );
  };

  const nextStep = () => {
    if (steps[currentStep].field === 'description') {
      const wc = form.description.trim().split(/\s+/).length;
      if (wc < 100) {
        toast.error('Description needs at least 100 words.');
        return;
      }
    }
    setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    stepRefs.current[currentStep + 1]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    stepRefs.current[currentStep - 1]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const toastId = toast.loading('Submitting…');
    try {
      const res = await fetch('/api/job_posting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          skills: form.skills,
          userID: shopkeeperId,
        }),
      });
      const json = await res.json();
      toast.dismiss(toastId);
      if (!res.ok) throw new Error(json.message || 'Error');
      toast.success('Posted!');
      router.push('/dashboard');
    } catch (e) {
      toast.dismiss(toastId);
      toast.error(e.message || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-red-500">{authError}</p>
      </div>
    );
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="h-12 w-12 border-4 border-t-[var(--primary-color)] rounded-full border-gray-300"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen flex flex-col items-center py-12 bg-background text-foreground">
        <div className="w-full max-w-xl px-6">
          {/* Progress Bar */}
          <div className="flex mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 mx-1 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {steps.map((step, i) =>
              i === currentStep ? (
                <motion.div
                  key={step.id}
                  ref={stepRefs.current[i]}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium">{step.label}</label>

                  {/* TEXT INPUT */}
                  {step.type === 'text' && (
                    <input
                      type="text"
                      placeholder={step.placeholder}
                      value={form.title}
                      onChange={e => updateField('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary bg-input-bg text-input-text"
                    />
                  )}

                  {/* TEXTAREA */}
                  {step.type === 'textarea' && (
                    <textarea
                      rows={6}
                      placeholder={step.placeholder}
                      value={form.description}
                      onChange={e => updateField('description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary resize-none bg-input-bg text-input-text"
                    />
                  )}

                  {/* SKILLS INPUT */}
                  {step.type === 'skills' && (
                    <div className="relative" ref={dropdownRef}>
                      <input
                        type="text"
                        placeholder={step.placeholder}
                        value={form.search}
                        onChange={e => {
                          updateField('search', e.target.value);
                          setDropdownOpen(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-primary bg-input-bg text-input-text"
                      />
                      {dropdownOpen && (
                        <motion.div
                          className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-background border border-gray-200 rounded-lg shadow-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {filteredSkills.map(s => (
                            <label
                              key={s.id}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={form.skills.includes(s.id)}
                                onChange={() => toggleSkill(s.id)}
                                className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                              <span>{s.name}</span>
                            </label>
                          ))}
                          {filteredSkills.length === 0 && (
                            <p className="p-4 text-gray-500">No skills found</p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevStep}
                      disabled={i === 0}
                      className="px-6 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-50"
                    >
                      Back
                    </button>
                    {i < steps.length - 1 ? (
                      <button
                        onClick={nextStep}
                        className="px-6 py-2 rounded-md bg-primary text-white text-sm"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-50"
                      >
                        {submitting ? 'Submitting…' : 'Submit'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
