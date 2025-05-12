"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "shopkeeper",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme based on localStorage or system setting
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Show modal when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 3 && !isModalOpen) {
        setIsModalOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isModalOpen]);

  const closeModal = () => setIsModalOpen(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    toast.loading("Loading...", { duration: 3000 });
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("You are registered successfully");
      } else if (res.status === 409) {
        toast.error("User already registered");
      } else {
        toast.error(data.error || "Failed to register");
      }
    } catch (err) {
      toast.error("Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative h-[200vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/4957136.jpg')" }}
    >
      

      {/* Scroll Prompt */}
      <div className="fixed top-1/2 left-1/2 flex flex-col items-center text-center  dark:text-background text-3xl font-extrabold -translate-x-1/2 -translate-y-1/2">
        SCROLL DOWN
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="mt-4 w-12 fill-current">
          <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
        </svg>
      </div>

      {/* Registration Modal */}
      <div className={`fixed left-0 bottom-0 w-full h-[60px] bg-black/50 flex flex-col items-center justify-center transition-all duration-400 ${isModalOpen ? 'h-full bg-black/80' : ''}`}>        
        <div className={`flex max-w-2xl w-full rounded-lg overflow-hidden absolute bg-white dark:bg-card transition-all duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto translate-y-0 scale-100' : 'opacity-0 pointer-events-none translate-y-24 scale-40'}`}>          
          <div className={`p-12 bg-white dark:bg-card flex-[1.5] transition-all duration-500 ${isModalOpen ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-20 opacity-0'}`}>            
            <h1 className="text-2xl m-0 font-normal ">Register</h1>
            <form onSubmit={submitHandler}>
              {/* Username */}
              <div className="flex flex-col p-2 border border-gray-300 dark:border-muted rounded mb-5 transition-all duration-300 focus-within:border-[#8c7569]">
                <label htmlFor="username" className="text-xs uppercase font-semibold tracking-wide ">Username</label>
                <input
                  type="text" name="username" id="username"
                  placeholder="Username" value={formData.username} onChange={changeHandler} required
                  className="bg-transparent outline-none border-0 pt-1 text-sm placeholder-gray-300 dark:placeholder-muted-foreground"
                />
              </div>
              {/* Email */}
              <div className="flex flex-col p-2 border border-gray-300 dark:border-muted rounded mb-5 transition-all duration-300 focus-within:border-[#8c7569]">
                <label htmlFor="email" className="text-xs uppercase font-semibold tracking-wide ">Email</label>
                <input
                  type="email" name="email" id="email"
                  placeholder="Email" value={formData.email} onChange={changeHandler} required
                  className="bg-transparent outline-none border-0 pt-1 text-sm placeholder-gray-300 dark:placeholder-muted-foreground"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col p-2 border border-gray-300 dark:border-muted rounded mb-5 transition-all duration-300 focus-within:border-[#8c7569]">
                <label htmlFor="password" className="text-xs uppercase font-semibold tracking-wide ">Password</label>
                <input
                  type="password" name="password" id="password"
                  placeholder="Password" value={formData.password} onChange={changeHandler} required
                  className="bg-transparent outline-none border-0 pt-1 text-sm placeholder-gray-300 dark:placeholder-muted-foreground"
                />
              </div>
              {/* Confirm Password */}
              <div className="flex flex-col p-2 border border-gray-300 dark:border-muted rounded mb-5 transition-all duration-300 focus-within:border-[#8c7569]">
                <label htmlFor="confirmPassword" className="text-xs uppercase font-semibold tracking-wide ">Confirm Password</label>
                <input
                  type="password" name="confirmPassword" id="confirmPassword"
                  placeholder="Confirm Password" value={formData.confirmPassword} onChange={changeHandler} required
                  className="bg-transparent outline-none border-0 pt-1 text-sm placeholder-gray-300 dark:placeholder-muted-foreground"
                />
              </div>
              {/* Role */}
              <div className="flex flex-col p-2 border border-gray-300 dark:border-muted rounded mb-5 transition-all duration-300 focus-within:border-[#8c7569]">
                <label className="text-xs uppercase font-semibold tracking-wide ">Role</label>
                <div className="flex justify-around">                
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="role" value="shopkeeper" checked={formData.role === 'shopkeeper'} onChange={changeHandler} className="mr-1" /> Shopkeeper
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="role" value="labour" checked={formData.role === 'labour'} onChange={changeHandler} className="mr-1" /> Labour
                  </label>
                </div>
              </div>
              {/* Submit */}
              <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="py-2 px-4 bg-[#8c7569] hover:bg-[#55311c] text-white rounded disabled:opacity-50 transition">
                  {isLoading ? 'Loading...' : 'Register'}
                </button>
              </div>
            </form>
            <p className="mt-8 text-sm text-center text-[#8c7569] dark:text-[#e2e8f0]">
              Already have an account? <a href="/login" className="text-[#8c7569] dark:text-[#63b3ed]">Login</a>
            </p>
          </div>
          {/* Image Section */}
         <div className="flex-1 relative min-h-[400px] hidden md:block">
  <Image
    src="/images/image.png"
    alt="Signup Image"
    fill
    className={`object-cover rounded-r-lg transition-transform duration-1000 ${isModalOpen ? 'scale-100' : 'scale-105'}`}
  />
</div>


          {/* Close Button */}
          <button onClick={closeModal} className="absolute top-3 right-3 p-1 rounded-full bg-white/80 dark:bg-black/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-4 h-4">
              <path d="M25 3C12.86 3 3 12.86 3 25s9.86 22 22 22 22-9.86 22-22S37.14 3 25 3zm0 2c10.49 0 19 8.51 19 19s-8.51 19-19 19-19-8.51-19-19S14.51 5 25 5zm-8 10l8 8-8 8 2 2 8-8 8 8 2-2-8-8 8-8-2-2-8 8-8-8-2 2z" />
            </svg>
          </button>
        </div>
        {/* Register Trigger Button */}
        <button onClick={() => setIsModalOpen(true)} className={`mt-4 py-2 px-6 rounded-full bg-white shadow dark:bg-card dark:text-[#e2e8f0] transition-opacity ${isModalOpen ? 'opacity-0 pointer-events-none' : ''}`}>Click here to register</button>
      </div>
    </div>
  );
}
