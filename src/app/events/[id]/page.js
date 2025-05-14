"use client";

import React from "react";
import { useParams } from "next/navigation";
import { eventsData } from "../../eventDatabase";
import Link from "next/link";

export default function EventDetails() {
  const { id } = useParams();
  const event = eventsData.find((e) => e.id === parseInt(id, 10));

  if (!event) {
    return (
      <div className="flex justify-center items-center h-full py-16">
        <p className="text-[rgb(var(--foreground))]">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Back link */}
      <Link
        href="/events"
        className="
          self-start mb-6
          text-[rgb(var(--primary))] font-medium
          hover:text-[rgb(var(--ring))] transition-colors
        "
      >
        ← Back to Events List
      </Link>

      {/* Main container */}
      <div
        className="
          w-full max-w-4xl
          flex flex-col md:flex-row gap-8
          bg-[rgb(var(--card))] border border-[rgb(var(--border))]
          rounded-lg shadow-lg overflow-hidden
        "
      >
        {/* Image */}
        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-6 space-y-4">
          <h1 className="text-3xl font-extrabold text-[rgb(var(--foreground))]">
            {event.name}
          </h1>

          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            <strong className="text-[rgb(var(--foreground))]">{event.year}</strong>{" "}
            – {event.month}
          </p>

          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            <strong className="text-[rgb(var(--foreground))]">Location:</strong>{" "}
            {event.location}
          </p>

          <p className="text-base text-[rgb(var(--foreground))]">
            {event.description || "No additional details available for this event."}
          </p>
        </div>
      </div>
    </div>
  );
}
