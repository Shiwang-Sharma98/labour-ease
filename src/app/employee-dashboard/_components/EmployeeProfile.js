"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import "./EmployeeProfile.css";
import { skillsData } from '@/app/skillsDatabase'; // Assuming skillsData is available
import EmployeeNavbar from '@/app/employee-dashboard/_components/EmployeeNavbar';

const EmployeeProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Manage edit mode
  const [skills, setSkills] = useState([]); // For selected skills
  const [search, setSearch] = useState(''); // For skill search
  const [dropdownVisible, setDropdownVisible] = useState(false); // For dropdown visibility
  const [userId, setUserId] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Verify authentication and user role
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
      } catch (error) {
        console.error("Authentication verification error:", error);
        setAuthError("Failed to verify authentication. Please try again.");
        toast.error("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    
    verifyAuth();
  }, [status, router]);

  const fetchEmployeeData = async (id) => {
    const toastId = toast.loading('Fetching profile data...');
    try {
      const response = await fetch(`/api/updateLabour?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setSkills(data.skills || []); // Assuming skills are part of profile
        toast.success('Profile loaded successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch employee data:', errorData.message);
        toast.error(`Failed to load profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('An error occurred while fetching profile data. Please try again later.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

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
    setIsEditing(false);
    
    const toastId = toast.loading('Updating profile...');
    const updatedProfile = { ...profile, skills };
  
    try {
      // First, update the labour profile details
      const response = await fetch("/api/updateLabour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // After updating the profile, update the skills
        const skillsResponse = await fetch("/api/updateSkills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labour_id: userId,
            skills, // Array of skill IDs
          }),
        });
        
        if (skillsResponse.ok) {
          // Fetch the updated profile to ensure we have the latest data
          const updatedResponse = await fetch(`/api/updateLabour?id=${userId}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setProfile(updatedData);
            toast.success('Profile updated successfully!');
          } else {
            const errorData = await updatedResponse.json();
            toast.error(`Failed to fetch updated profile: ${errorData.message || 'Unknown error'}`);
          }
        } else {
          const skillsErrorData = await skillsResponse.json();
          toast.error(`Failed to update skills: ${skillsErrorData.message || 'Unknown error'}`);
        }
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error('An error occurred while updating the profile. Please try again later.');
    } finally {
      toast.dismiss(toastId);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'N/A';
    const firstInitial = name.charAt(0).toUpperCase();
    return firstInitial;
  };

  const filteredSkills = skillsData.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="spinner-container">
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
      <div className="container mt-5">
        {/* Session status indicator (for testing) */}
        <div className="session-status mb-3 p-2 rounded bg-light">
          <small>Session active: {status === 'authenticated' ? 'Yes' : 'No'}</small>
          <small className="ms-3">Session expires in: {session?.expires ? new Date(session.expires).toLocaleTimeString() : 'N/A'}</small>
        </div>
        
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-img-top rounded-circle mx-auto mt-3 d-flex align-items-center justify-content-center profile-initials">
                {profile.name ? getInitials(profile.name) : 'N/A'}
              </div>
              <div className="card-body text-center">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name:</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone:</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={profile.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address:</label>
                      <textarea
                        name="address"
                        className="form-control"
                        value={profile.address}
                        onChange={handleChange}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Experience:</label>
                      <textarea
                        name="experience"
                        className="form-control"
                        value={profile.experience}
                        onChange={handleChange}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Search and Add Skills:</label>
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
                                  onChange={handleCheckboxChange}
                                  checked={skills.includes(skill.id)}
                                />
                                <label className="form-check-label">
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
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{profile.name}</h5>
                    <div className="card-details">
                      <p className="card-text"><strong>📞 Phone:</strong> {profile.phone}</p>
                      <p className="card-text"><strong>🏠 Address:</strong> {profile.address}</p>
                      <p className="card-text"><strong>💼 Experience:</strong> {profile.experience}</p>
                      <p className="card-text"><strong>🛠 Skills:</strong> {profile.skills?.map(skillId => skillsData.find(skill => skill.id === skillId)?.name).join(', ') || 'None'}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                    <Link href="/employee-dashboard">
                      <p className="btn btn-secondary mt-3">Go to Dashboard</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;