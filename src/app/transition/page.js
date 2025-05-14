"use client";
import { useEffect, useState, useRef } from 'react';

export default function TransitionPage() {
  const [loadingText, setLoadingText] = useState("Loading...");
  const [authStatus, setAuthStatus] = useState("checking");
  const [redirectUrl, setRedirectUrl] = useState(null);
  const requestRef = useRef();
  const circleRef = useRef();
  const triangleRef = useRef();
  const squareRef = useRef();
  const startTimeRef = useRef(null);
  
  // Animation loop using requestAnimationFrame
  const animate = (time) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }
    
    const elapsed = time - startTimeRef.current;
    
    // Circle animation
    if (circleRef.current) {
      const circleProgress = (elapsed % 3000) / 3000;
      const circleX = Math.sin(circleProgress * Math.PI * 2) * 100;
      circleRef.current.style.transform = `translateX(${circleX}px)`;
    }
    
    // Triangle animation
    if (triangleRef.current) {
      const triangleProgress = ((elapsed + 750) % 3000) / 3000;
      const triangleX = Math.sin(triangleProgress * Math.PI * 2) * 100;
      const triangleY = Math.sin(triangleProgress * Math.PI * 4) * 20;
      triangleRef.current.style.transform = `translateX(${triangleX}px) translateY(${triangleY}px)`;
    }
    
    // Square animation
    if (squareRef.current) {
      const squareProgress = ((elapsed + 1500) % 3000) / 3000;
      const squareX = Math.sin(squareProgress * Math.PI * 2) * 100;
      const rotation = elapsed / 10 % 360;
      squareRef.current.style.transform = `translateX(${squareX}px) rotate(${rotation}deg)`;
    }
    
    // Continue the animation loop
    requestRef.current = requestAnimationFrame(animate);
  };

  // Set up the animation
  useEffect(() => {
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Set up text cycling for loading state
    const textCycle = ["Loading...", "Login page", "Transition page", "Dashboard page"];
    let textIndex = 0;
    
    const textInterval = setInterval(() => {
      // Only cycle text if we're still in loading state
      if (authStatus === "checking") {
        textIndex = (textIndex + 1) % textCycle.length;
        setLoadingText(textCycle[textIndex]);
      }
    }, 2000);
    
    // Clean up
    return () => {
      cancelAnimationFrame(requestRef.current);
      clearInterval(textInterval);
    };
  }, [authStatus]);
  
  // Check auth status and handle redirects
  useEffect(() => {
    // Simulate authentication check
    const checkAuthStatus = async () => {
      try {
        // Check if user is authenticated by fetching session
        const sessionRes = await fetch('/api/auth/session');
        
        if (!sessionRes.ok) {
          setAuthStatus("unauthenticated");
          setLoadingText("You need to log in first. Redirecting...");
          setRedirectUrl("/login");
          return;
        }
        
        const session = await sessionRes.json();
        
        if (!session || !session.user) {
          setAuthStatus("unauthenticated");
          setLoadingText("Session expired. Redirecting to login...");
          setRedirectUrl("/login");
          return;
        }
        
        // User is authenticated, check role
        setLoadingText("Authentication verified. Checking user role...");
        
        try {
          const userRes = await fetch("/api/user");
          if (userRes.ok) {
            const userData = await userRes.json();
            
            if (userData.role === 'shopkeeper') {
              setLoadingText("Role verified: shopkeeper. Redirecting to dashboard...");
              setRedirectUrl(`/shopkeeper-dashboard?userID=${userData.id}`);
            } else if (userData.role === 'labour') {
              setLoadingText("Role verified: employee. Redirecting to dashboard...");
              setRedirectUrl(`/employee-dashboard?userID=${userData.id}`);
            } else {
              setLoadingText("Redirecting to dashboard...");
              setRedirectUrl("/dashboard");
            }
          } else {
            setLoadingText("Unable to verify role. Redirecting to default dashboard...");
            setRedirectUrl("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoadingText("Error checking user data. Redirecting to dashboard...");
          setRedirectUrl("/dashboard");
        }
        
        setAuthStatus("authenticated");
      } catch (error) {
        console.error("Authentication check error:", error);
        setLoadingText("Something went wrong. Redirecting to login...");
        setRedirectUrl("/login");
        setAuthStatus("error");
      }
    };
    
    // Start the auth check after a brief delay
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle redirect when a URL is set
  useEffect(() => {
    if (redirectUrl) {
      const redirectTimer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [redirectUrl]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Animation container */}
      <div className="relative w-64 h-32 mb-16">
        <div 
          ref={circleRef}
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-blue-500"
        ></div>
        <div 
          ref={triangleRef}
          className="absolute top-8 left-24"
          style={{
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '24px solid #3b82f6'
          }}
        ></div>
        <div 
          ref={squareRef}
          className="absolute top-16 left-48 w-12 h-12 bg-blue-500"
        ></div>
      </div>
      
      {/* Text container */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Getting Ready</h1>
        <p className="text-xl transition-all duration-500">{loadingText}</p>
      </div>
    </div>
  );
}