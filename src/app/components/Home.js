"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import JobSlider from "./JobSlider";
import BlobButton from "./BlobButton";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";

// Create a motion-enabled version of Next’s Link
const MotionLink = motion(Link);

const aboutContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const aboutItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.02 },
};

export default function Home() {
  const AnimatedBackgroundStars = dynamic(
    () => import("./AnimatedBackgroundStars"),
    { ssr: false }
  );
  const AnimatedBackground = dynamic(
    () => import("./AnimatedBackground"),
    { ssr: false }
  );

  // Button animation variants
  const btnHover = { scale: 1.05 };
  const btnTap = { scale: 0.95 };
  const btnTransition = { type: "spring", stiffness: 300 };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="
          relative flex flex-col items-center justify-center
          h-screen
          bg-background dark:bg-background
          text-foreground dark:text-foreground
          text-center px-4
        "
      >
        {/* Stardust layer */}
        <AnimatedBackgroundStars />

        <div className="relative z-10 max-w-2xl space-y-6">
          {/* Animated shape */}
          <AnimatedBackground />

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Find a job that suits<br />your interests and skills
          </h1>

          <TypeAnimation
            sequence={[
              "Find local work fast and easy.",
              2000,
              "Connect with neighborhood shops.",
              2000,
              "Build your community sustainably.",
              2000,
            ]}
            speed={50}
            cursor={true}
            repeat={Infinity}
            style={{ whiteSpace: "pre", minHeight: "1.5em" }}
            className="text-base sm:text-lg"
          />

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
  <BlobButton 
    href="/login" 
    className="w-48 text-primary-foreground"
  >
    Sign In
  </BlobButton>

  <BlobButton 
    href="#about" 
    className="w-48 text-foreground border-foreground"
  >
    Discover More
  </BlobButton>
</div>

        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Job Slider */}
        <section className="mb-12">
          <JobSlider />
        </section>

        {/* About Us */}
        <motion.section
  id="about"
  className="py-12 text-foreground dark:text-foreground"
  initial="hidden"
  animate="show"
  variants={aboutContainer}
>
  <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
    {/* Left Side - Text Content */}
    <motion.div
      className="space-y-6"
      variants={aboutItem}
      whileHover="hover"
    >
      <motion.h2
        className="text-4xl font-bold mb-4"
        variants={aboutItem}
      >
        About Us
      </motion.h2>
      <motion.p
        className="mb-6 transition-colors duration-500"
        variants={aboutItem}
      >
        We’re on a mission to strengthen local communities by connecting small-scale laborers with neighborhood businesses for meaningful, consistent work. Our platform enables seamless, trusted collaboration—and we go beyond just job matching. Through local events, workshops, and networking meetups, we bring people together to share skills, build relationships, and grow stronger, more sustainable communities.
      </motion.p>
      <motion.div
        className="flex gap-4"
        variants={aboutItem}
      >
        <motion.a
          href="/register"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Now
        </motion.a>
        <motion.a
          href="/events"
          className="px-6 py-3 border border-foreground rounded-full shadow hover:bg-foreground/10"
          whileHover={{ scale: 1.05 }}
        >
          Explore Events
        </motion.a>
      </motion.div>
    </motion.div>

    {/* Right Side - Stats Boxes */}
    <motion.div
      className="grid sm:grid-cols-2 gap-6"
      variants={aboutItem}
    >
      {[
        { label: "Connections Built", value: "1,000+" },
        { label: "Local Businesses Engaged", value: "500+" },
        { label: "Happy Customers", value: "1M+" },
      ].map((stat, idx) => (
        <motion.div
          key={stat.label}
          className="bg-card text-card-foreground p-6 rounded-md shadow-md flex flex-col items-center"
          variants={aboutItem}
          whileHover="hover"
        >
          <span className="text-3xl font-extrabold">{stat.value}</span>
          <span className="text-sm">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  </div>
</motion.section>
         {/* How It Works */}
      <section className="py-16 bg-background dark:bg-background">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <h2 className="text-4xl font-extrabold text-center">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "1. Browse Local Jobs",
                desc: "See all open gigs in your neighborhood with real-time updates.",
                icon: "🗺️",
              },
              {
                title: "2. Apply Instantly",
                desc: "One-click applications—no resumes, no hassle. Get matched fast.",
                icon: "✉️",
              },
              {
                title: "3. Get Paid Securely",
                desc: "On-platform payments with transparent fees and instant payouts.",
                icon: "💰",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                className="p-6 bg-card text-card-foreground rounded-2xl shadow-xl flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center pt-8">
  <MotionLink
    href="/register"
    className="
      relative inline-flex items-center justify-center px-8 py-4
      text-white font-semibold uppercase tracking-wider
      rounded-full overflow-hidden group z-10 transition-all duration-300
    "
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative z-10">Get Started</span>

    {/* Solid background layer (like :after) */}
    <span
      className="absolute inset-0 bg-cyan-400 rounded-full z-[-2]"
    />

    {/* Animated hover layer (like :before) */}
    <span
      className="
        absolute inset-0 bg-cyan-500 rounded-full z-[-1]
        w-0 group-hover:w-full transition-all duration-300 ease-in-out
      "
    />

    {/* Optional arrow on hover */}
    <motion.svg
      className="ml-3 w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </motion.svg>
  </MotionLink>
</div>




        </div>
      </section>
      </div>
    </>
  );
}
