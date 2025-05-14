'use client'
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function Contact() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    emailjs
      .sendForm("service_ujhxo2s", "template_ssabsif", form.current, {
        publicKey: "p3vgRF-Nwfvf5bui5",
      })
      .then(
        () => {
          toast.success("Message sent successfully!");
          setIsSubmitting(false);
        },
        (error) => {
          toast.error("Failed to send message. Please try again.");
          console.error("FAILED...", error.text);
          setIsSubmitting(false);
        }
      );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <Toaster reverseOrder={false} />
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <Image
            src="/images/contact.avif"
            alt="Contact Us"
            width={700}
            height={475}
            layout="responsive"
            className="rounded-lg object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label htmlFor="user_name" className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                className="w-full px-4 py-2 border rounded-md bg-transparent border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="user_email" className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="user_email"
                id="user_email"
                className="w-full px-4 py-2 border rounded-md bg-transparent border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">Message</label>
              <textarea
                name="message"
                id="message"
                rows="6"
                className="w-full px-4 py-2 border rounded-md bg-transparent border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                placeholder="Enter your message"
                required
              />
            </div>
            <button
              type="submit"
              className="blob-btn disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <span className="relative z-10">{isSubmitting ? "Sending..." : "Send"}</span>
              <span className="blob-btn__inner" />
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob" />
                <span className="blob-btn__blob" />
                <span className="blob-btn__blob" />
                <span className="blob-btn__blob" />
              </span>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" 
                    values="1 0 0 0 0  
                            0 1 0 0 0  
                            0 0 1 0 0  
                            0 0 0 20 -10" 
                    result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
            </svg>
          </form>
        </div>
      </div>
    </div>
  );
}
