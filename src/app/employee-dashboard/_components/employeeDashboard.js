'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './EmployeeNavbar';
import DashboardHeader from './DashboardHeader';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session } = useSession();
  const [name, setName] = useState('User');

useEffect(() => {
  if (!session) return;

  async function fetchUserInfo() {
    try {
      const res = await fetch('/api/username');
      const data = await res.json();
      if (data?.username) {
        setName(data.username);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  }

  fetchUserInfo();
}, [session]);




  const [jobAlertCount, setJobAlertCount] = useState(0);
  useEffect(() => {
    async function fetchJobAlerts() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/currentOpenings?shopkeeper_id=${session.user.id}`);
        const data = await res.json();
        setJobAlertCount(data.total);
      } catch (err) {
        console.error('Failed to fetch job alerts:', err);
      }
    }

    fetchJobAlerts();
  }, [session]);

  return (
    <div className="flex bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen transition-colors">
      <Sidebar />
      <div className="flex-1 ml-16 sm:ml-64">
        <DashboardHeader />

        <div className="p-6">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">👋 {name}</h1>
            <p className="text-muted-foreground">Here is your daily activities and job alerts</p>
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted text-[rgb(var(--foreground))] p-6 rounded-xl">
              <h3 className="text-3xl font-bold">34</h3>
              <p className="text-sm text-muted-foreground mt-1">Applied Jobs</p>
            </div>
            
            <div className="bg-muted text-[rgb(var(--foreground))] p-6 rounded-xl">
              <h3 className="text-3xl font-bold">{jobAlertCount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Job Alerts</p>
            </div>
          </div>

          

          {/* Recently Applied */}
          <div className="bg-[rgb(var(--card))] text-[rgb(var(--foreground))] p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recently Applied</h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="py-2 px-4">Jobs</th>
                    <th className="py-2 px-4">Date Applied</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      company: 'Google',
                      title: 'Network Engineer',
                      tag: 'Remote',
                      location: 'Washington, USA',
                      salary: '$107k-170k/month',
                      date: 'Feb 5, 2024 19:28',
                      status: 'Active'
                    },
                    {
                      company: 'Dribbble',
                      title: 'UX Designer',
                      tag: 'Contract Base',
                      location: 'Chandigarh, India',
                      salary: '$107k-170k/month',
                      date: 'Jan 13, 2024 03:33',
                      status: 'Active'
                    },
                    {
                      company: 'Facebook',
                      title: 'User Researcher',
                      tag: 'Temporary',
                      location: 'London, UK',
                      salary: '$120k-185k/month',
                      date: 'Mar 5, 2024 09:23',
                      status: 'Active'
                    },
                    {
                      company: 'Google',
                      title: 'Software Engineer',
                      tag: 'Remote',
                      location: 'Mumbai, India',
                      salary: '$134k-185k/month',
                      date: 'Mar 9, 2024 12:45',
                      status: 'Active'
                    },
                    {
                      company: 'Facebook',
                      title: 'Network Engineer',
                      tag: 'Contract Base',
                      location: 'Washington, USA',
                      salary: '$134k-210k/month',
                      date: 'Apr 12, 2024 04:28',
                      status: 'Active'
                    },
                  ].map((job, index) => (
                    <tr key={index} className="border-b hover:bg-muted/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          
                          <div>
                            <div className="font-semibold">{job.title}</div>
                            <div className="text-muted-foreground text-xs">{job.location}</div>
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-md inline-block mt-1">{job.tag}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{job.date}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{job.status}</td>
                      <td className="py-3 px-4">
                        <button className="text-primary hover:underline">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
