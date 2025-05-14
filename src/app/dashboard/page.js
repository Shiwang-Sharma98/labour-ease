"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('Loading your dashboard...');
  const [debugInfo, setDebugInfo] = useState({});
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session loading state
        if (status === 'loading') {
          setMessage('Checking authentication status...');
          return;
        }
        
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
          setMessage('You are not authenticated. Redirecting to login...');
          router.push('/login');
          return;
        }
        
        setMessage('Authentication verified. Checking user role...');
        
        // Verify session data with server
        const userResponse = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setDebugInfo(userData);
          
          // Redirect based on role
          if (userData.role === 'shopkeeper') {
            setMessage(`Role verified: shopkeeper. Redirecting to shopkeeper dashboard...`);
            router.push(`/shopkeeper-dashboard?userID=${userData.id}`);
          } else if (userData.role === 'labour') {
            setMessage(`Role verified: employee. Redirecting to employee dashboard...`);
            router.push(`/employee-dashboard?userID=${userData.id}`);
          } else {
            setMessage(`Unknown role: ${userData.role}. Please contact support.`);
          }
        } else {
          const errorData = await userResponse.json();
          setMessage(`API Error: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
        console.error("Dashboard redirect error:", error);
      }
    };
    
    checkAuth();
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="mb-2">{message}</p>
          <div className="text-sm text-gray-600">
            <p>Session status: {status}</p>
            {session && (
              <p>Logged in as: {session.user?.email}</p>
            )}
          </div>
        </div>
        
        {/* Debug information */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}