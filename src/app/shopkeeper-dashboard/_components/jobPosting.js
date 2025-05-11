'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { skillsData } from "@/app/skillsDatabase";
import toast from "react-hot-toast";
import './jobPosting.css';
import ShopkeeperNavbar from "@/app/shopkeeper-dashboard/_components/ShopkeeperNavbar";

const JobPosting = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [shopkeeperId, setShopkeeperId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false); // For dropdown visibility
  const [loading, setLoading] = useState(true); // Start with loading true for auth check
  const [authError, setAuthError] = useState(null);

  // Authentication verification
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
        
        // Use ID from session/API instead of localStorage for security
        const verifiedUserId = userData.id;
        setShopkeeperId(verifiedUserId);
        setLoading(false); // Auth check complete, no longer loading
      } catch (error) {
        console.error("Authentication verification error:", error);
        setAuthError("Failed to verify authentication. Please try again.");
        toast.error("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    
    verifyAuth();
  }, [status, router]);

  const filteredSkills = skillsData.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);
    setSkills(prevSkills =>
      prevSkills.includes(value)
        ? prevSkills.filter(skillId => skillId !== value)
        : [...prevSkills, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify we have the authenticated shopkeeper ID
    if (!shopkeeperId) {
      toast.error("Authentication error. Please try again.");
      return;
    }

    // Ensure description is at least 100 words
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 100) {
      toast.error('Description must be at least 100 words.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating job posting...");
  
    const jobPost = { 
      title, 
      description, 
      skills, 
      userID: shopkeeperId // Use the verified ID from auth
    };
    
    try {
      const response = await fetch('/api/job_posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPost),
      });
      const data = await response.json();
  
      toast.dismiss(toastId);
      if (response.ok) {
        toast.success('Job posting created successfully!');
        console.log('Job posting created:', data);
        
        // Clear the form fields
        setTitle('');
        setDescription('');
        setSkills([]);
        setSearch('');
        setDropdownVisible(false); // Optionally hide the dropdown
      } else {
        toast.error(data.message || 'Error creating job posting');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to create job posting');
      console.error("Error creating job posting:", error);
    } finally {
      setLoading(false);
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

  // Show loading indicator while checking authentication
  if (status === 'loading' || (loading && !shopkeeperId)) {
    return (
      <div className="container mt-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <ShopkeeperNavbar/>
      <div className="container mt-5">
        <h2>Create Job Posting</h2>
        <p className="description-note">* Note: The job description must be of atleast 100 words.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Job Description</label>
            <textarea
              className="form-control"
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Search and Select Skills</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search for skills..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownVisible(true);
              }}
              onClick={() => setDropdownVisible(true)}
            />
            {dropdownVisible && (
              <div className="skills-dropdown">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <div className="form-check" key={skill.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={skill.id}
                        id={`skill-${skill.id}`}
                        onChange={handleCheckboxChange}
                        checked={skills.includes(skill.id)}
                      />
                      <label className="form-check-label" htmlFor={`skill-${skill.id}`}>
                        {skill.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No skills found</p>
                )}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default JobPosting;