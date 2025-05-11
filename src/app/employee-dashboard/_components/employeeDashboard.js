"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import "./employeeDashboard.css";
import EmployeeNavbar from "@/app/employee-dashboard/_components/EmployeeNavbar";

const EmpDashboardPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Check authentication and role
  useEffect(() => {
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
        
        // Check if user is a labour/employee
        if (userData.role !== 'labour') {
          setAuthError("Access denied. Only labours can access this page.");
          toast.error("Access denied. Only labours can access this page.");
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }
        
        // Use ID from session/API instead of URL parameter for security
        const verifiedUserId = userData.id;
        setUserId(verifiedUserId);
        
        // Load data using verified ID
        fetchEmployeeData(verifiedUserId);
        fetchShopkeepers();
      } catch (error) {
        console.error("Authentication verification error:", error);
        setAuthError("Failed to verify authentication. Please try again.");
        toast.error("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    
    verifyAuth();
  }, [status, router]);

  // Fetch employee data
  const fetchEmployeeData = async (id) => {
    setLoading(true);
    const toastId = toast.loading('Fetching profile data...');
    
    try {
      const response = await fetch(`/api/updateLabour?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to fetch profile data. Error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error('An error occurred while fetching profile data. Please try again later.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  // Fetch shopkeepers for reviews
  const fetchShopkeepers = async () => {
    try {
      const response = await fetch('/api/listShopkeepers');
      if (response.ok) {
        const data = await response.json();
        setShopkeepers(data.shopkeepers || []);
        
        // Initialize reviews state with shopkeeper IDs
        const initialReviews = (data.shopkeepers || []).map(shopkeeper => ({
          id: shopkeeper.id,
          rating: 0,
          review: ''
        }));
        setReviews(initialReviews);
      } else {
        console.error("Failed to fetch shopkeepers");
      }
    } catch (error) {
      console.error("Error fetching shopkeepers:", error);
    }
  };

  const handleReviewChange = (shopkeeperId, field, value) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === shopkeeperId ? { ...review, [field]: value } : review
      )
    );
  };

  const handleReviewSubmit = async (shopkeeperId) => {
    const currentReview = reviews.find((review) => review.id === shopkeeperId);
    if (!currentReview) return;

    // Validate rating
    if (currentReview.rating < 1 || currentReview.rating > 5) {
      toast.error("Please provide a rating between 1 and 5");
      return;
    }

    // Validate review text
    if (!currentReview.review.trim()) {
      toast.error("Please provide a review comment");
      return;
    }

    const toastId = toast.loading('Submitting review...');
    try {
      const response = await fetch("/api/submitReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopkeeperId,
          labourId: userId,
          rating: currentReview.rating,
          review: currentReview.review,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully!");
        handleReviewChange(shopkeeperId, "rating", 0);
        handleReviewChange(shopkeeperId, "review", "");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit review: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error('An error occurred while submitting the review. Please try again later.');
    } finally {
      toast.dismiss(toastId);
    }
  };

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

  if (loading) {
    return (
      <div className="dashboard-spinner-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <>
      <EmployeeNavbar />
      <div className="dashboard-container">
        {/* Session status indicator (for testing) */}
        <div className="session-status mb-3 p-2 rounded bg-light">
          <small>Session active: {status === 'authenticated' ? 'Yes' : 'No'}</small>
          <small className="ms-3">Session expires in: {session?.expires ? new Date(session.expires).toLocaleTimeString() : 'N/A'}</small>
        </div>

        <h1 className="dashboard-welcome">Welcome {profile.name}</h1>
        <div className="dashboard-shopkeepers">
          <h2>Rate and Review Shopkeepers</h2>
          {shopkeepers.length === 0 ? (
            <p>No shopkeepers available.</p>
          ) : (
            <ul>
              {shopkeepers.map((shopkeeper) => (
                <li key={shopkeeper.id}>
                  <h3>{shopkeeper.shop_name}</h3>
                  <div>
                    <label className="dashboard-form-label">
                      Rating (1-5):
                    </label>
                    <input
                      className="dashboard-form-input"
                      type="number"
                      value={
                        reviews.find((review) => review.id === shopkeeper.id)
                          ?.rating || 0
                      }
                      onChange={(e) =>
                        handleReviewChange(
                          shopkeeper.id,
                          "rating",
                          Number(e.target.value)
                        )
                      }
                      min="1"
                      max="5"
                    />
                  </div>
                  <div>
                    <label className="dashboard-form-label">Review:</label>
                    <textarea
                      className="dashboard-form-textarea"
                      value={
                        reviews.find((review) => review.id === shopkeeper.id)
                          ?.review || ""
                      }
                      onChange={(e) =>
                        handleReviewChange(shopkeeper.id, "review", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="dashboard-btn"
                    onClick={() => handleReviewSubmit(shopkeeper.id)}
                  >
                    Submit Review
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default EmpDashboardPage;