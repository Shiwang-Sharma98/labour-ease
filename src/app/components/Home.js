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
             h-screen bg-background text-foreground
             bg-[url('/images/hero-bg.jpg')] bg-cover bg-center text-center px-4"
>

        
       {/* Optional overlay */}
<div className="absolute inset-0 bg-white/30 dark:bg-black/60 "></div>


        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className=" text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
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
            className=" text-base sm:text-lg"
          />

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                         text-white font-medium rounded-md shadow-lg transition"
            >
              Login
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-white hover:bg-white/10
                          font-medium rounded-md shadow-lg transition"
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

       

      </div>

      {/* <Footer /> */}
    </>
  );
}
