"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import "./rateLabours.css"; // Add your custom styles here

const RateLabours = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [labours, setLabours] = useState([]); // State to hold labours list
  const [loading, setLoading] = useState(true); // Loading state
  const [rating, setRating] = useState({}); // Rating state per labour
  const [review, setReview] = useState({}); // Review state per labour
  const [shopkeeperId, setShopkeeperId] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Authentication and data fetching
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
        
        // Fetch labours for the authenticated shopkeeper
        fetchLaboursForShopkeeper(verifiedUserId);
      } catch (error) {
        console.error("Authentication verification error:", error);
        setAuthError("Failed to verify authentication. Please try again.");
        toast.error("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    
    verifyAuth();
  }, [status, router]);

  const fetchLaboursForShopkeeper = async (shopkeeperId) => {
    if (!shopkeeperId) return;
    
    const toastId = toast.loading("Fetching labours...");

    try {
      const response = await fetch("/api/getLaboursForShopkeeper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopkeeper_id: shopkeeperId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLabours(data.labours);
        toast.success("Labours fetched successfully!");
      } else {
        toast.error(`Failed to fetch labours: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching labours:", error);
      toast.error("An error occurred while fetching labours.");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  // Handle Rating Change
  const handleRatingChange = (labourId, value) => {
    setRating((prev) => ({
      ...prev,
      [labourId]: value,
    }));
  };

  // Handle Review Change
  const handleReviewChange = (labourId, value) => {
    setReview((prev) => ({
      ...prev,
      [labourId]: value,
    }));
  };

  // Submit rating and review for a labour
  const handleSubmitReview = async (labourId) => {
    if (!shopkeeperId) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    const reviewText = review[labourId];
    const ratingValue = rating[labourId];

    if (!ratingValue || !reviewText) {
      toast.error("Rating and review are required.");
      return;
    }

    const toastId = toast.loading("Submitting review...");
    try {
      const response = await fetch("/api/submitReviewShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopkeeper_id: shopkeeperId,
          labour_id: labourId,
          rating: ratingValue,
          review: reviewText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        // Optionally clear the form after submission
        setRating((prev) => ({ ...prev, [labourId]: "" }));
        setReview((prev) => ({ ...prev, [labourId]: "" }));
      } else {
        toast.error(`Failed to submit review: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  // If there's an authentication error, show the error message
  if (authError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {authError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Rate and Review Labourers</h2>

      {loading ? (
        <p>Loading labours...</p>
      ) : labours.length > 0 ? (
        <ul className="list-group">
          {labours.map((labour) => (
            <li key={labour.labour_id} className="list-group-item">
              <div className="labour-info">
                <h5>{labour.name}</h5>
                <p>{labour.phone}</p>
              </div>

              {/* Rating Input */}
              <div className="rating-input">
                <label htmlFor={`rating-${labour.labour_id}`}>Rating: </label>
                <input
                  id={`rating-${labour.labour_id}`}
                  type="number"
                  min="1"
                  max="5"
                  value={rating[labour.labour_id] || ""}
                  onChange={(e) =>
                    handleRatingChange(labour.labour_id, e.target.value)
                  }
                />
              </div>

              {/* Review Input */}
              <div className="review-input">
                <label htmlFor={`review-${labour.labour_id}`}>Review: </label>
                <textarea
                  id={`review-${labour.labour_id}`}
                  value={review[labour.labour_id] || ""}
                  onChange={(e) =>
                    handleReviewChange(labour.labour_id, e.target.value)
                  }
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary mt-2"
                onClick={() => handleSubmitReview(labour.labour_id)}
              >
                Submit Review
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No labours found.</p>
      )}
    </div>
  );
};

export default RateLabours;