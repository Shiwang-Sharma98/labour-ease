"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import "./employeeNavbar.css";

const EmployeeNavbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
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
        setUserId(userData.id);
      } catch (error) {
        console.error("Authentication verification error:", error);
        setAuthError("Failed to verify authentication. Please try again.");
        toast.error("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 2000);
      }
    };
    
    verifyAuth();
  }, [status, router]);

  // Handle logout with NextAuth
  const handleLogout = async () => {
    try {
      // First, call your custom logout API if needed
      await fetch("/api/logoutLabour", { method: "POST" });
      
      // Then use NextAuth's signOut
      await signOut({ redirect: false });
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // If authentication is still loading or there's an error, render a minimal version
  if (status === 'loading' || authError) {
    return (
      <nav className="dashboard-navbar navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">Dashboard</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="dashboard-navbar navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/employee-dashboard">
          Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/employee-profile"
              >
                My Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/employee-apply"
              >
                Apply for Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/view-rate">
                Your Ratings
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;