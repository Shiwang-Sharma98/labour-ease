"use client"
import React from "react";
import Navbar from "./Navbar";
import JobSlider from "./JobSlider";
import Footer from "./Footer";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center
                   h-screen bg-gray-900 bg-[url('/images/hero-bg.jpg')]
                   bg-cover bg-center text-center px-4"
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Find a job that suits<br />your interests and skills
          </h1>

          <TypeAnimation
            sequence={[
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.\n", 
              1000,
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.\nDolorem voluptate repellat modi quidem aliquid eaque ducimus ipsa et,\n",
              1000,
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.\nDolorem voluptate repellat modi quidem aliquid eaque ducimus ipsa et,\nFacere mollitia!",
              2000,
              "",
              1000,
            ]}
            speed={50}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.5rem",
              minHeight: "4.5em",
            }}
            className="text-gray-300 text-base sm:text-lg"
          />

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                         text-white font-medium rounded-md shadow-lg transition"
            >
              Open App
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-white hover:bg-white/10
                         text-white font-medium rounded-md shadow-lg transition"
            >
              Discover More
            </a>
          </div>
           <div className="mt-12 flex justify-center space-x-6">
   <div className="w-px h-20 bg-white/20"></div>
   <div className="w-px h-28 bg-white/30"></div>
   <div className="w-px h-20 bg-white/20"></div>
 </div>
          
        </div>
      </div>

      {/* Rest of the page */}
      <div className="container mx-auto px-4 py-12">
        {/* Job Slider Section */}
        <section className="mb-12">
          <JobSlider />
        </section>

        {/* Popular Job Categories */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold uppercase mb-6">Popular Job Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Cashier",
              "Cleaning Staff",
              "Delivery Personnel",
              "Manager",
              "Floor Supervisor",
              "Customer Service",
              "Caretaker",
              "Housekeeper",
            ].map((cat, i) => (
              <a
                key={i}
                href="#"
                className="px-4 py-2 border border-indigo-600 rounded-full
                           hover:bg-indigo-50 transition"
              >
                {cat}
              </a>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-3 rounded-md shadow-sm mb-4 z-10">
              <nav className="flex space-x-4">
                <a href="#page1" className="font-medium">Page 1</a>
                <a href="#page2" className="font-medium">Page 2</a>
                <div className="relative group">
                  <button className="font-medium inline-flex items-center">
                    More Pages
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 8l5 5 5-5H5z" />
                    </svg>
                  </button>
                  <ul className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <li><a href="#page3" className="block px-4 py-2 hover:bg-gray-100">Page 3</a></li>
                    <li><a href="#page4" className="block px-4 py-2 hover:bg-gray-100">Page 4</a></li>
                  </ul>
                </div>
              </nav>
            </div>

            <div
              id="scrollspy"
              className="space-y-8 overflow-y-auto h-72 pr-2"
              data-bs-spy="scroll"
              data-bs-target="#scrollspy"
              tabIndex={0}
            >
              <div id="page1">
                <h4 className="text-xl font-semibold">Reviews Page 1</h4>
                <h5 className="font-medium">John Doe</h5>
                <p>Lorem ipsum dolor sit amet...</p>
              </div>
              {/* ...page2,3,4 */}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
