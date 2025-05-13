'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  FileText,
  Users,
  Star,
  Menu,
  X,
  User
} from 'lucide-react';

const ShopkeeperSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      name: 'Profile',
      path: '/shopkeeper-dashboard/profile',
      icon: <User size={20} />
    },
    {
      name: 'Job Postings',
      path: '/shopkeeper-dashboard/jobPostings',
      icon: <FileText size={20} />
    },
    {
      name: 'Post New Job',
      path: '/shopkeeper-dashboard/job-openings',
      icon: <FileText size={20} />
    },
    {
      name: 'View Applicants',
      path: '/shopkeeper-dashboard',
      icon: <Users size={20} />
    },
    {
      name: 'Rate Labours',
      path: '/shopkeeper-dashboard/rate-labours',
      icon: <Star size={20} />
    },
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="flex relative">
      <div className={`h-screen bg-card border-r border-border/20 flex flex-col fixed z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-[70px]' : 'w-[250px]'}`}>
        <div className="h-[60px] flex items-center justify-between px-4 border-b border-border/20">
          <div className="flex items-center gap-3 text-primary font-bold text-xl">
            <Store size={24} />
            {!collapsed && <span>Shopkeeper</span>}
          </div>
          <button 
            className="bg-transparent border-none text-foreground cursor-pointer p-2 rounded transition-colors hover:bg-accent/50"
            onClick={toggleSidebar}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        <div className="flex flex-col py-4 flex-grow">
          {navItems.map((item, index) => (
            <Link 
              href={item.path} 
              key={index}
              className={`flex items-center px-4 py-3 text-foreground no-underline gap-4 transition-colors border-l-3 ${
                isActive(item.path) 
                  ? 'bg-primary/10 text-primary border-l-3 border-l-primary' 
                  : 'border-l-transparent hover:bg-accent/50 hover:text-primary'
              }`}
            >
              <div className="flex items-center justify-center w-6">
                {item.icon}
              </div>
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar} 
        />
      )}
    </div>
  );
};

export default ShopkeeperSidebar;