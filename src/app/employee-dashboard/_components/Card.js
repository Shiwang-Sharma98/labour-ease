'use client';
import React, { useState, useEffect } from 'react';
import './Card.css';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Card({ job }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Authentication check when component mounts
    if (status === 'unauthenticated') {
      toast.error('Please log in to apply for jobs');
    }
  }, [status]);

  const handleApply = async () => {
    // Check authentication status
    if (status === 'loading') {
      toast.loading('Checking authentication...');
      return;
    }

    if (status === 'unauthenticated') {
      toast.error('Please log in to apply for jobs');
      router.push('/login');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Applying for job...');

    try {
      // Get user data from API for additional verification
      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      
      if (!userData.id) {
        toast.error('Unable to verify user credentials');
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/applyJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.job_id,
          labourId: userData.id, // Use verified ID from session
        }),
      });

      if (response.ok) {
        toast.success('Job Applied Successfully!');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to apply for the job:', errorData);

        if (response.status === 409) {
          toast.error('You have already applied for this job.');
        } else {
          toast.error(`Failed to apply for the job. Error: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="d-flex align-items-stretch">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{job.title}</h5>
          <p className="card-text text-truncate overflow-hidden" style={{ maxHeight: '4.5em' }}>
            {truncateText(job.description, 100)}
          </p>
          <div className="mt-auto">
            <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog">
          <div className="modal-container">
            <div className="modal-header">
              <h5 className="modal-title">{job.title}</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Skills Required:</strong> {job.skills}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleApply}
                disabled={loading || status === 'loading'}
              >
                {loading ? 'Applying...' : 'Apply for Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}