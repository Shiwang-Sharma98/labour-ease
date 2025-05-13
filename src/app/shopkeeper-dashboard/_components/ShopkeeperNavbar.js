'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import './shopkeeperNavbar.css';

const ShopkeeperNavbar = () => {
  const searchParams = useSearchParams();
  const userID = searchParams.get('userID');
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.clear();
    try {
      const response = await fetch('/api/logoutLabour', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href={`/shopkeeper-dashboard?userID=${userID}`}>Dashboard</a>
        <div className="navbar-links d-flex">
          <a className="nav-link" href={`/shopkeeper-dashboard/profile?userID=${userID}`}>Profile</a>
          <a className="nav-link" href={`/shopkeeper-dashboard/jobPostings?userID=${userID}`}>Add Job Posting</a>
          <a className="nav-link" href={`/shopkeeper-dashboard/job-openings?userID=${userID}`}>See Current Openings</a>
          <a className="nav-link" href={`/shopkeeper-dashboard/rate-labours?userID=${userID}`}>Rate Labour</a>
          <button className="btn nav-link btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default ShopkeeperNavbar;