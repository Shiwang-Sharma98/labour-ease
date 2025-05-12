'use client';

// pages/dashboard.js
import Sidebar from "./EmployeeNavbar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-16 sm:ml-64">
        {/* Dashboard Overview */}
        <div className="flex flex-wrap justify-between gap-4 p-4">
          <div className="bg-green-500 text-white p-6 rounded-lg flex-1">
            <h3 className="text-xl">34 Applied Jobs</h3>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg flex-1">
            <h3 className="text-xl">121 Favorite Jobs</h3>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg flex-1">
            <h3 className="text-xl">56 Job Alerts</h3>
          </div>
        </div>

        {/* Profile Editing Reminder */}
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p>Your profile editing is not completed.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit Profile</button>
        </div>

        {/* Recently Applied Jobs */}
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Recently Applied</h2>
          <div className="mt-4">
            {[
              { title: 'Network Engineer', location: 'Washington, USA', salary: '$107K-$170K/month', date: 'Feb 5, 2024', status: 'Active' },
              { title: 'UX Designer', location: 'Chandigarh, India', salary: '$107K-$170K/month', date: 'Jan 13, 2024', status: 'Active' },
              // Add more jobs here...
            ].map((job, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>{job.location}</p>
                <p>{job.salary}</p>
                <p>Status: {job.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


