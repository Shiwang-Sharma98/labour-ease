"use client";
import React, { useState } from "react";
import Link from "next/link";
import { eventsData } from "../eventDatabase";
import Image from "next/image";
import Navbar from "../components/Navbar";

import "./page.css"

export default function EventsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = eventsData.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center mt-16 px-4">
      <h2 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-8">
        Ongoing Events
      </h2>

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          mb-12 w-full max-w-md
          px-4 py-2
          bg-[rgb(var(--card))] border border-[rgb(var(--border))]
          rounded-lg
          text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))]
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] transition
        "
      />

      <div className="space-y-16 w-full max-w-4xl">
        {filteredEvents.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={event.id}
              className={`
                relative flex flex-col md:flex-row items-center
                bg-transparent
                before:absolute before:inset-0
                before:rounded-[100px]
                before:border-4 before:border-[rgb(var(--primary))]
                before:-z-10
                ${isLeft ? "md:flex-row-reverse" : ""}
              `}
            >
              {/* Text block */}
              <div className="md:w-1/2 p-6 space-y-2">
                <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">
                  {event.name}
                </h3>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  {event.year} – {event.month}
                </p>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  {event.location}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="
                    inline-block mt-4 px-4 py-2 rounded-full
                    bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]
                    font-medium uppercase tracking-wide
                    transition-colors duration-200
                    hover:bg-[rgb(var(--ring))]
                  "
                >
                  View Details
                </Link>
              </div>

              {/* Image block with SVG overlay */}
<div className="md:w-1/2 p-6 flex justify-center">
  <div className="relative w-full max-w-sm image-hover-container">
    {/* Next/Image wrapper */}
    <div className="relative h-48 w-full">
      <Image
        src={event.image}
        alt={event.name}
        fill
        className="object-cover rounded-lg shadow-md"
        priority={true}
      />
    </div>

    {/* overlay SVG for the “drawing” outline */}
<svg
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
  className="image-hover-svg absolute inset-0 w-full h-full pointer-events-none"
>
  <polyline
    points="1,1 99,1 99,99 1,99 1,1"
    stroke="#2323FF"
  />
</svg>
  </div>
</div>

            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
