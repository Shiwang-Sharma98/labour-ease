'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Card({ job }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please log in to apply for jobs');
    }
  }, [status]);

  const handleApply = async () => {
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
          labourId: userData.id,
        }),
      });

      if (response.ok) {
        toast.success('Job Applied Successfully!');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.error('You have already applied for this job.');
        } else {
          toast.error(`Failed to apply: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  return (
    <div className="w-full max-w-md p-4">
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-200">
        <div className="p-5 flex flex-col h-full">
          <h5 className="text-xl font-semibold mb-3 text-foreground">{job.title}</h5>
          <p className="text-muted-foreground mb-4 overflow-hidden text-ellipsis" style={{ maxHeight: '4.5em' }}>
            {truncateText(job.description, 100)}
          </p>
          <button
            className="mt-auto w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-opacity-90 transition"
            onClick={() => setShowModal(true)}
          >
            View Details
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <button
                className="text-2xl font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Skills Required:</strong> {job.skills}</p>
            </div>
            <div className="flex justify-end gap-4 border-t border-border px-6 py-4">
              <button
                className="bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-muted transition"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-opacity-90 transition"
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
