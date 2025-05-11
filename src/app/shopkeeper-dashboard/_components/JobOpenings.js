'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Card from './Card';
import './jobOpenings.css';
import ShopkeeperNavbar from '@/app/shopkeeper-dashboard/_components/ShopkeeperNavbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const JobData = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check authentication and role
    const verifyAuth = async () => {
      // If still loading session, wait
      if (status === 'loading') return;

      // If not authenticated, redirect to login
      if (status === 'unauthenticated') {
        toast.error("Session expired. Please log in again.");
        router.push('/login');
        return;
      }

      // Fetch jobs after verifying authentication
      await fetchJobs();
    };

    verifyAuth();
  }, [status, router]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Verify user role via API
      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      
      // Check if user is a shopkeeper
      if (userData.role !== 'shopkeeper') {
        setAuthError("Access denied. Only shopkeepers can access this page.");
        toast.error("Access denied. Only shopkeepers can access this page.");
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }
      
      // Use ID from session/API instead of URL parameter for security
      const shopkeeperId = userData.id;
      
      // Fetch jobs with the verified shopkeeper ID
      const response = await fetch(`/api/currentOpenings?shopkeeper_id=${shopkeeperId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error('Failed to fetch job postings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    // Check authentication status before delete
    if (status === 'unauthenticated') {
      toast.error("Session expired. Please log in again.");
      router.push('/login');
      return;
    }

    try {
      // Get user data to verify permissions
      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      
      // Additional verification if needed
      if (userData.role !== 'shopkeeper') {
        toast.error("Access denied. Only shopkeepers can delete job postings.");
        return;
      }
      
      const response = await fetch(`/api/deleteJob`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobId,
          shopkeeperId: userData.id  // Include shopkeeper ID for verification
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the job');
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      toast.success('Job posting deleted successfully');
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(`Failed to delete job posting: ${error.message}`);
    }
  };

  if (authError) {
    return (
      <>
        <ShopkeeperNavbar />
        <div className="container mt-5 text-center">
          <div className="alert alert-danger" role="alert">
            {authError}
          </div>
        </div>
      </>
    );
  }

  if (loading || status === 'loading') {
    return (
      <>
        <ShopkeeperNavbar />
        <div className="spinner-container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading current openings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ShopkeeperNavbar />
      <div className="container mt-5 job-data-container">
        <h2 className="text-center mb-4">Available Job Postings</h2>
        <div className="row">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="col-lg-4 col-md-6 mb-4">
                <Card job={job} onDelete={handleDelete} />
              </div>
            ))
          ) : (
            <p className="text-center">No job postings available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default JobData;