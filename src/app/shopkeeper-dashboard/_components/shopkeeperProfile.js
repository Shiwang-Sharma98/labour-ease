'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Store, MapPin, Phone, FileText, Edit } from 'lucide-react';
import ShopkeeperSidebar from './ShopkeeperSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import anime from 'animejs/lib/anime.es.js';

export default function ShopkeeperProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Refs for animations
  const profileCardRef = useRef(null);
  const modalRef = useRef(null);
  const cardItemsRef = useRef([]);
  const modalOverlayRef = useRef(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        toast.error('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        if (userData.role !== 'shopkeeper') {
          setAuthError('Access denied. Only shopkeepers can access this page.');
          toast.error('Access denied. Only shopkeepers can access this page.');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }
        fetchShopkeeperData(userData.id);
      } catch {
        setAuthError('Failed to verify authentication. Please try again.');
        toast.error('Authentication error. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
      }
    }
    verifyAuth();
  }, [status, router]);
  
  // Profile card animation on load - with cleanup to prevent multiple animations
  useEffect(() => {
    let profileAnimation;
    let itemsAnimation;
    
    if (!loading && profile && profileCardRef.current) {
      // Animate profile card entrance
      profileAnimation = anime({
        targets: profileCardRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });
      
      // Animate card items with staggered effect
      itemsAnimation = anime({
        targets: cardItemsRef.current,
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(100, {start: 300}),
        duration: 800,
        easing: 'easeOutQuad'
      });
    }
    
    // Cleanup function to prevent animation duplicates
    return () => {
      if (profileAnimation && profileAnimation.pause) profileAnimation.pause();
      if (itemsAnimation && itemsAnimation.pause) itemsAnimation.pause();
    };
  }, [loading, profile]);
  
  // Modal animation with cleanup
  useEffect(() => {
    let modalAnimation;
    let overlayAnimation;
    
    if (isEditing && modalRef.current && modalOverlayRef.current) {
      // Animate modal overlay
      overlayAnimation = anime({
        targets: modalOverlayRef.current,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInOutQuad'
      });
      
      // Animate modal entrance
      modalAnimation = anime({
        targets: modalRef.current,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 400,
        easing: 'easeOutCubic'
      });
    }
    
    // Cleanup function to prevent animation duplicates
    return () => {
      if (modalAnimation && modalAnimation.pause) modalAnimation.pause();
      if (overlayAnimation && overlayAnimation.pause) overlayAnimation.pause();
    };
  }, [isEditing]);

  const fetchShopkeeperData = async (userID) => {
    try {
      const res = await fetch(`/api/updateShopkeeper?id=${userID}`);
      const data = await res.json();
      setProfile(data);
    } catch {
      toast.error('Error loading profile information');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({});
  
  // Initialize form data when editing starts
  useEffect(() => {
    if (isEditing && profile) {
      // Ensure all fields have default values to prevent uncontrolled to controlled error
      const initialFormData = {
        shop_name: '',
        shop_address: '',
        shop_phone: '',
        bio: '',
        ...profile
      };
      setFormData(initialFormData);
    }
  }, [isEditing, profile]);
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Animate modal exit
    if (modalRef.current && modalOverlayRef.current) {
      const modalAnimation = anime({
        targets: modalRef.current,
        opacity: 0,
        scale: 0.9,
        duration: 300,
        easing: 'easeInOutQuad'
      });
      
      const overlayAnimation = anime({
        targets: modalOverlayRef.current,
        opacity: 0,
        duration: 300,
        easing: 'easeInOutQuad'
      });
      
      // Wait for animation to complete before closing modal
      await Promise.all([
        new Promise(resolve => modalAnimation.finished.then(resolve)),
        new Promise(resolve => overlayAnimation.finished.then(resolve))
      ]);
    }
    
    setIsEditing(false);
    
    try {
      const res = await fetch('/api/updateShopkeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      
      // Only update the profile after successful API call
      setProfile(json.data);
      toast.success('Profile updated successfully');
      
      // Highlight updated content with a subtle flash animation
      setTimeout(() => {
        anime({
          targets: cardItemsRef.current,
          backgroundColor: ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0)'],
          duration: 1500,
          easing: 'easeOutQuad'
        });
      }, 100);
    } catch {
      toast.error('Error updating profile');
    }
  };
  
  const closeModal = async () => {
    // Animate modal exit
    if (modalRef.current && modalOverlayRef.current) {
      const modalAnimation = anime({
        targets: modalRef.current,
        opacity: 0,
        scale: 0.9,
        duration: 300,
        easing: 'easeInOutQuad'
      });
      
      const overlayAnimation = anime({
        targets: modalOverlayRef.current,
        opacity: 0,
        duration: 300,
        easing: 'easeInOutQuad'
      });
      
      // Wait for animation to complete before closing modal
      await Promise.all([
        new Promise(resolve => modalAnimation.finished.then(resolve)),
        new Promise(resolve => overlayAnimation.finished.then(resolve))
      ]);
    }
    
    setIsEditing(false);
  };

  const getInitials = name => name ? name.charAt(0).toUpperCase() : 'N/A';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg shadow-md">
          {authError}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <p className="text-muted-foreground">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ShopkeeperSidebar />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[250px]'} md:ml-[250px]`}>      
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Shopkeeper Profile</h1>
          <div 
            ref={profileCardRef} 
            className="bg-card border border-border rounded-lg shadow-md overflow-hidden opacity-0"
          >
            <div className="flex flex-col md:flex-row border-b border-border p-6">
              <div 
                className="flex-shrink-0 mb-4 md:mb-0 md:mr-6"
                ref={el => cardItemsRef.current[0] = el}
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {getInitials(profile.shop_name)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                {[
                  { icon: Store, label: 'Shop Name' },
                  { icon: MapPin, label: 'Shop Address' },
                  { icon: Phone, label: 'Shop Phone' },
                  { icon: FileText, label: 'Bio' }
                ].map(({ icon: Icon, label }, index) => (
                  <div 
                    key={label} 
                    className="flex items-center text-muted-foreground"
                    ref={el => cardItemsRef.current[index + 1] = el}
                  >
                    <Icon size={18} className="mr-2 text-secondary-foreground" />
                    <p className="text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              {['shop_name','shop_address','shop_phone','bio'].map((field, idx) => {
                const Icon = [Store,MapPin,Phone,FileText][idx];
                const label = ['Shop Name','Shop Address','Shop Phone','Bio'][idx];
                return (
                  <div 
                    key={field} 
                    className="mb-6"
                    ref={el => cardItemsRef.current[idx + 5] = el}
                  >
                    <h3 className="flex items-center text-lg font-medium text-foreground mb-2">
                      <Icon size={20} className="mr-2 text-primary" />{label}
                    </h3>
                    <p className="text-foreground">{profile[field]}</p>
                  </div>
                );
              })}
              <button
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                onClick={() => setIsEditing(true)}
                ref={el => cardItemsRef.current[9] = el}
              >
                <Edit size={18} className="mr-2" />Edit Profile
              </button>
            </div>
          </div>
          {isEditing && (
            <>
              <div 
                ref={modalOverlayRef}
                className="fixed inset-0 bg-black/50 z-40" 
                onClick={closeModal} 
              />
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div 
                  ref={modalRef}
                  className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 opacity-0"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">Edit Profile</h2>
                  <form onSubmit={handleSubmit}>
                    {['shop_name','shop_address','shop_phone','bio'].map((field, idx) => (
                      <div key={field} className="mb-4">
                        <label className="block text-foreground font-medium mb-2 capitalize">{field.replace('_',' ')}</label>
                        {field === 'bio' || field === 'shop_address' ? (
                          <textarea
                            name={field}
                            rows={field==='shop_address'?4:4}
                            className="w-full border border-border rounded px-3 py-2 focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
                            value={formData[field] || ''}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          <input
                            type={field==='shop_phone'?'tel':'text'}
                            name={field}
                            className="w-full border border-border rounded px-3 py-2 focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
                            value={formData[field] || ''}
                            onChange={handleChange}
                            required
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/90 transition-colors"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}