// src/app/components/Faq.jsx
"use client";                  // ← add this line

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlobButton from "../components/BlobButton";

const faqs = [
  {
    q: "How can I request a laborer for my shop?",
    a: `To request a laborer, simply log in to our platform and navigate to the "Request Labor" section. 
        Enter the details of the task, your shop’s location, and the required time frame. Once submitted, 
        we will match you with a suitable laborer based on your needs.`,
  },
  {
    q: "What types of tasks can laborers assist with?",
    a: `Our laborers can assist with a variety of tasks, including stocking shelves, organizing inventory, 
        handling customer service, and more. If you have a specific task in mind, please detail it in your request 
        so we can match you with a laborer who has the appropriate skills.`,
  },
  {
    q: "How are laborers vetted and selected?",
    a: `All laborers on our platform are thoroughly vetted through background checks and skill assessments. 
        We ensure they meet our quality standards before they are listed on the platform. Additionally, you can 
        view reviews and ratings from other shopkeepers to help you make an informed choice.`,
  },
  {
    q: "What are the payment terms for hiring a laborer?",
    a: `Payment is handled through the platform. You will be billed based on the hours worked or the task completed, 
        as agreed upon when hiring. Payments are processed securely, and you will receive an invoice for each transaction. 
        You can also review and manage payment details in your account settings.`,
  },
  {
    q: "Can I cancel or reschedule a labor request?",
    a: `Yes, you can cancel or reschedule a labor request through the platform. Please note that cancellations made within 
        24 hours of the scheduled start time may incur a cancellation fee. For rescheduling, simply contact our support team 
        or adjust the request details in your account.`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col items-center mt-16 px-4">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[rgb(var(--foreground))] mb-4">
          We’re here to answer all your questions
        </h1>
        <p className="text-lg text-[rgb(var(--muted-foreground))]">
          This section will help you learn more about the platform
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-4">
        <AnimatePresence initial={false}>
          {faqs.map((item, i) => {
            const isOpen = i === openIndex;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[rgb(var(--card))] rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-[rgb(var(--foreground))] font-medium">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-[rgb(var(--primary))] ml-4"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="px-6 overflow-hidden"
                    >
                      <p className="py-4 text-[rgb(var(--foreground))]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Replace this: */}
      {/* <motion.a
        href="/contact"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 inline-block px-8 py-3 rounded-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold uppercase tracking-wide shadow-lg transition-colors duration-300 hover:bg-[rgb(var(--ring))]"
      >
        Got more questions? Get in touch
      </motion.a> */}

      {/* With your reusable blob button: */}
      <div className="mt-12">
        <BlobButton
          href="/contact"
          className="w-46 text-primary-foreground"  // adjust width or text colour as you like
        >
          Get in touch
        </BlobButton>
      </div>
    </div>
  );
}
