"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import ViewApplicants from './ViewApplicants';
import './shopkeeperDashboard.css';
import ShopkeeperNavbar from '@/app/ShopkeeperNavbar/ShopkeeperNavbar';

const ShopkeeperDashboard = () => {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const userID = searchParams.get('userID');
    const router = useRouter();

    const [jobPostings, setJobPostings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shopkeeperId, setShopkeeperId] = useState('');
    const [filter, setFilter] = useState("all");
    const [viewApplicants, setViewApplicants] = useState(null);
    const [authError, setAuthError] = useState(null);

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

            // Verify user role via API
            try {
                const response = await fetch('/api/user');
                const userData = await response.json();
                
                // Check if user is a shopkeeper
                if (userData.role !== 'shopkeeper') {
                    setAuthError("Access denied. Only shopkeepers can access this page.");
                    toast.error("Access denied. Only shopkeepers can access this page.");
                    setTimeout(() => router.push('/dashboard'), 2000);
                    return;
                }
                
                // Use ID from session/API instead of URL parameter for security
                const verifiedUserId = userData.id;
                setShopkeeperId(verifiedUserId);
                
                // Load data using verified ID
                fetchJobPostingsAndApplicants(verifiedUserId);
                fetchShopkeeperReviews(verifiedUserId);
            } catch (error) {
                console.error("Authentication verification error:", error);
                setAuthError("Failed to verify authentication. Please try again.");
                toast.error("Authentication error. Please log in again.");
                setTimeout(() => router.push('/login'), 2000);
            }
        };
        
        verifyAuth();
    }, [status, router]);

    const fetchJobPostingsAndApplicants = async (id) => {
        setLoading(true);
        const toastId = toast.loading('Fetching job postings...');

        try {
            const response = await fetch('/api/listLabours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopkeeper_id: id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setJobPostings(data.job_postings);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to fetch data. Error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error('An error occurred while fetching job postings. Please try again later.');
            console.error("Job postings fetch error:", error);
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    const fetchShopkeeperReviews = async (shopkeeperId) => {
        try {
            const response = await fetch('/api/shopkeeper-reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shopkeeper_id: shopkeeperId }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setReviews(data.reviews);
            } else {
                console.error("Reviews fetch error:", data.message);
                toast.error("Failed to load reviews");
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    // Handle viewing applicants for a job posting
    const handleViewApplicants = (job) => {
        setViewApplicants({ applicants: job.applicants, jobPostingId: job.job_posting_id });
    };

    const handleBackToJobs = () => {
        setViewApplicants(null);
    };
    
    const getDateDifferenceInDays = (dueDate) => {
        const currentDate = new Date();
        const jobDueDate = new Date(dueDate);
        const timeDiff = jobDueDate - currentDate;
        return Math.floor(timeDiff / (1000 * 3600 * 24));
    };

    const filteredJobs = jobPostings.filter((job) => {
        const daysDifference = getDateDifferenceInDays(job.due_date);

        if (filter === "old") {
            return daysDifference >= 30;
        }
        if (filter === "new") {
            return daysDifference >= 5 && daysDifference <= 10;
        }
        if (filter === "recent") {
            return daysDifference >= 0 && daysDifference <= 5;
        }
        return true;
    });

    // If there's an authentication error, show error message
    if (authError) {
        return (
            <div className="auth-error-container">
                <div className="auth-error-message">
                    <h2>Authentication Error</h2>
                    <p>{authError}</p>
                    <p>Redirecting...</p>
                </div>
            </div>
        );
    }

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="loading-container">
                <p>Verifying your session...</p>
            </div>
        );
    }

    return (
        <>
            {viewApplicants ? (
                <ViewApplicants 
                    applicants={viewApplicants.applicants} 
                    onBack={handleBackToJobs} 
                    jobPostingId={viewApplicants.jobPostingId} 
                    shopkeeperId={shopkeeperId} 
                />
            ) : (
                <>
                    <ShopkeeperNavbar/>

                    <div className="container mt-4">
                        {/* Session status indicator (for testing) */}
                        <div className="session-status mb-3 p-2 rounded bg-light">
                            <small>Session active: {status === 'authenticated' ? 'Yes' : 'No'}</small>
                            <small className="ms-3">Session expires in: {session?.expires ? new Date(session.expires).toLocaleTimeString() : 'N/A'}</small>
                        </div>

                        <div className="dashboard-header d-flex justify-content-between align-items-center mb-3">
                            <h2>Total Job Postings: {jobPostings.length}</h2>
                            <div className="filter">
                                <label>Filter By: </label>
                                <select onChange={(e) => setFilter(e.target.value)} className="ms-2">
                                    <option value="all">All Posts</option>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                    <option value="recent">Recent</option>
                                </select>
                            </div>
                        </div>

                        <div className="job-cards">
                            {loading ? (
                                <p>Loading job postings...</p>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.job_posting_id} className="job-card d-flex justify-content-between align-items-center p-3 mb-2 border rounded">
                                        <div className="job-name">{job.job_title}</div>
                                        <div className="job-details">
                                            <div>Due Date: {job.due_date}</div>
                                            <div>Applicants: {job.applicants.length}</div>
                                        </div>
                                        <div className="view-button">
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => handleViewApplicants(job)}
                                            >
                                                View Applicants
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No job postings found.</p>
                            )}
                        </div>

                        {/* Section to display reviews */}
                        <div className="reviews-section mt-4">
                            <h3>Reviews from Labours</h3>
                            {reviews.length > 0 ? (
                                <ul className="list-group">
                                    {reviews.map((review) => (
                                        <li key={review.id} className="list-group-item">
                                            <strong>Rating: {review.rating}</strong>
                                            <p>{review.review}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ShopkeeperDashboard;