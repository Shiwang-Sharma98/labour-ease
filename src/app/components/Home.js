"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import JobSlider from "./JobSlider";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";

// Create a motion-enabled version of Next’s Link
const MotionLink = motion(Link);

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
          <motion.div
            className="flex flex-wrap justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Sign In */}
            <MotionLink
              href="/login"
              className="
                w-48 px-6 py-3
                bg-primary text-primary-foreground
                font-medium rounded-full shadow-lg
                flex items-center justify-center
              "
              whileHover={btnHover}
              whileTap={btnTap}
              transition={btnTransition}
            >
              Sign In
            </MotionLink>

            {/* Discover More */}
            <MotionLink
              href="#about"
              className="
                w-48 px-6 py-3
                border border-foreground text-foreground
                font-medium rounded-full shadow-lg
                flex items-center justify-center
                hover:border-transparent hover:bg-foreground/10
                dark:hover:bg-foreground/10
              "
              whileHover={btnHover}
              whileTap={btnTap}
              transition={btnTransition}
            >
              Discover More
            </MotionLink>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Job Slider */}
        <section className="mb-12">
          <JobSlider />
        </section>

        {/* About Us */}
        <section id="about" className="py-12 text-foreground dark:text-foreground">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-in duration-1000">
              <h2 className="text-4xl font-bold mb-4">About Us</h2>
              <p className="mb-6 transition-colors duration-500">
                We are dedicated to empowering local communities by bridging the gap between
                small-scale laborers and neighborhood shopkeepers. Our platform facilitates
                seamless collaboration, enabling laborers to find consistent work and shopkeepers
                to access trusted services locally — creating a sustainable, supportive ecosystem
                for everyone involved.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 animate-fade-in-up duration-1000">
              <div className="bg-card text-card-foreground p-6 rounded-md shadow-md">
                <h3 className="text-2xl font-semibold">1,000+</h3>
                <p className="text-sm">Connections Built</p>
              </div>
              <div className="bg-card text-card-foreground p-6 rounded-md shadow-md">
                <h3 className="text-2xl font-semibold">500+</h3>
                <p className="text-sm">Local Businesses Engaged</p>
              </div>
              <div className="bg-card text-card-foreground p-6 rounded-md shadow-md col-span-2 relative">
                <h3 className="text-2xl font-semibold">1M +</h3>
                <p className="text-sm mb-3">Happy Customers</p>
                <div className="h-2 bg-muted rounded">
                  <div className="h-2 bg-primary rounded w-[85%] transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
