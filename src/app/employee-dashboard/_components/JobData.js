'use client';

import React, { useEffect, useState } from 'react';
import Card from '../_components/Card';
import toast from 'react-hot-toast';
import Link from 'next/link'; // ✅ Import for client-side navigation

const JobData = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getJobPostings');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (error) {
        toast.error('Failed to fetch job postings');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const skillsMatch = Array.isArray(job.skills)
        ? job.skills.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
        : job.skills?.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || skillsMatch;
    });
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-b-transparent border-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground text-lg">Loading job postings...</p>
      </div>
    );
  }

  return (
    <>
      {/* 🔙 Back to Dashboard Link */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/employee-dashboard" className="text-blue-500 hover:underline flex items-center gap-1">
          <span className="text-xl">←</span> Back to Employee Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto p-6 bg-muted rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6 font-poppins">
          Available Job Postings
        </h2>

        {/* Search Bar */}
        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search by job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-input rounded-md shadow-sm bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id || `${job.title}-${job.postedAt}`} job={job} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-lg">
              No job postings available
            </p>
          )}

        </div>
      </div>
    </>
  );
};

export default JobData;
