'use client';

import React, { useEffect, useState } from 'react';
import Card from '../_components/Card';
import toast from 'react-hot-toast';
import Sidebar from './EmployeeNavbar';

const JobData = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [viewMode, setViewMode] = useState('list');

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
      <Sidebar />
      <div className="max-w-7xl mx-auto p-6 bg-muted rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6 font-poppins">
          Available Job Postings
        </h2>

        {/* Search Bar at the top */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition"
          >
            Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
        </div>

        {/* Job Listings */}
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 '
              : 'flex flex-col gap-4'
          }`}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card
                key={job.id || `${job.title}-${job.postedAt}`}
                job={job}
                viewMode={viewMode}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground text-lg col-span-full">
              No job postings available
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default JobData;
