'use client';

import React, { useState, useEffect } from 'react';
import './Card.css';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Card({ job, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Authentication check when component mounts
    if (status === 'unauthenticated') {
      toast.error('Please log in to manage jobs');
    }
  }, [status]);

  const handleDelete = async () => {
    // Check authentication status
    if (status === 'loading') {
      toast.loading('Checking authentication...');
      return;
    }

    if (status === 'unauthenticated') {
      toast.error('Please log in to delete jobs');
      router.push('/login');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Deleting job...');

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

      // Call the passed onDelete function with necessary authentication
      await onDelete(job.id);
      
      // Close the modal after successful deletion
      setShowModal(false);
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('An error occurred while deleting the job. Please try again later.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="d-flex align-items-stretch">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{job.title}</h5>
          <p className="card-text text-truncate overflow-hidden" style={{ maxHeight: '4.5em' }}>
            {job.description}
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading || status === 'loading'}
              >
                {loading ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}