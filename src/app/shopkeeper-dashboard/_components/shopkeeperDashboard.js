"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ViewApplicants from './ViewApplicants';
import ShopkeeperSidebar from './ShopkeeperSidebar';

const ShopkeeperDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [jobPostings, setJobPostings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shopkeeperId, setShopkeeperId] = useState('');
    const [filter, setFilter] = useState("all");
    const [viewApplicants, setViewApplicants] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
                    <p className="mb-4 text-gray-700">{authError}</p>
                    <p className="text-gray-500">Redirecting...</p>
                </div>
            </div>
        );
    }

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Verifying your session...</p>
            </div>
        );
    }

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <ShopkeeperSidebar />
            
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[250px]'} md:ml-[250px]`}>
                {viewApplicants ? (
                    <ViewApplicants 
                        applicants={viewApplicants.applicants} 
                        onBack={handleBackToJobs} 
                        jobPostingId={viewApplicants.jobPostingId} 
                        shopkeeperId={shopkeeperId} 
                    />
                ) : (
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
                        
                        {/* Session status indicator (for testing) */}
                        <div className="mb-6 p-3 rounded bg-gray-100 text-gray-600 text-sm">
                            <span>Session active: {status === 'authenticated' ? 'Yes' : 'No'}</span>
                            <span className="ml-4">Session expires in: {session?.expires ? new Date(session.expires).toLocaleTimeString() : 'N/A'}</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-3 md:mb-0">Total Job Postings: {jobPostings.length}</h2>
                            <div className="flex items-center">
                                <label className="text-gray-600 mr-2">Filter By: </label>
                                <select 
                                    onChange={(e) => setFilter(e.target.value)} 
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="all">All Posts</option>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                    <option value="recent">Recent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <p className="text-gray-600">Loading job postings...</p>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div 
                                        key={job.job_posting_id} 
                                        className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="font-medium text-lg text-gray-800 mb-2 md:mb-0">{job.job_title}</div>
                                        <div className="text-gray-600 mb-2 md:mb-0 md:mx-4">
                                            <div>Due Date: {job.due_date}</div>
                                            <div>Applicants: {job.applicants.length}</div>
                                        </div>
                                        <button 
                                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                                            onClick={() => handleViewApplicants(job)}
                                        >
                                            View Applicants
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No job postings found.</p>
                            )}
                        </div>

                        {/* Section to display reviews */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Reviews from Labours</h3>
                            {reviews.length > 0 ? (
                                <ul className="space-y-3">
                                    {reviews.map((review) => (
                                        <li key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                            <div className="font-medium mb-2">Rating: {review.rating}</div>
                                            <p className="text-gray-600">{review.review}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No reviews available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopkeeperDashboard;