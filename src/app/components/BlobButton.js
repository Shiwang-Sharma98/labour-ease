// components/BlobButton.jsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function BlobButton({ href, children, className = "", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* MotionLink will render a single <a> under the hood */}
      <MotionLink
        href={href}
        className={`blob-btn ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {/* Goo layer */}
        <span className="blob-btn__inner" />
        <span className="blob-btn__blobs">
          <span className="blob-btn__blob" />
          <span className="blob-btn__blob" />
          <span className="blob-btn__blob" />
          <span className="blob-btn__blob" />
        </span>

        {/* Button label */}
        <span className="relative z-10">{children}</span>
      </MotionLink>
    </motion.div>
  );
}
