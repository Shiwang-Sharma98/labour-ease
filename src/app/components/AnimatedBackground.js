"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, useSpring } from "framer-motion";
import { interpolate } from "flubber";
import { useTheme } from "next-themes";

// how many vertices your “random” blob will have
const TOTAL_POINTS = 32;

// build an SVG path string from random radii
function makePolygonPath() {
  const r1 = Math.random() * 52 + 4;
  const r2 = 56;
  const centerX = 152;
  const centerY = 56;

  const pts = Array.from({ length: TOTAL_POINTS }, (_, i) => {
    const angle = (2 * Math.PI * i) / TOTAL_POINTS - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return [
      centerX + Math.cos(angle) * r,
      centerY + Math.sin(angle) * r,
    ];
  });

  const [firstX, firstY] = pts[0];
  return [
    `M${firstX},${firstY}`,
    ...pts.slice(1).map(([x, y]) => `L${x},${y}`),
    "Z",
  ].join(" ");
}

export default function AnimatedBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const strokeColor = currentTheme === "dark"
    ? "currentColor"
    : "#39ff14";            // neon green in light mode

  // two endpoints of our current interpolation
  const [fromPath, setFromPath] = useState(makePolygonPath());
  const [toPath,   setToPath]   = useState(makePolygonPath());
  const progress    = useMotionValue(0);
  const smoothProg  = useSpring(progress, { stiffness: 80, damping: 12 });
  const [interpolator, setInterpolator] = useState(() =>
    interpolate(fromPath, toPath)
  );

  // wait for client
  useEffect(() => {
    setMounted(true);
  }, []);

  // rebuild interpolator & kick off animation
  useEffect(() => {
    setInterpolator(() => interpolate(fromPath, toPath));
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    });
    return controls.stop;
  }, [fromPath, toPath, progress]);

  // shift paths each interval
  useEffect(() => {
    const iv = setInterval(() => {
      setFromPath(toPath);
      setToPath(makePolygonPath());
    }, 1200);
    return () => clearInterval(iv);
  }, [toPath]);

  // derive the "d" attribute
  const d = useTransform(progress, (t) => interpolator(t));

  // don't render until mounted to avoid SSR mismatch
  if (!mounted) return null;

  return (
    <svg
      viewBox="0 0 304 112"
      preserveAspectRatio="xMidYMid meet"
      className="
        absolute 
        -top-12          
        left-1/2 
        transform -translate-x-1/2
        w-[400px] sm:w-[600px] md:w-[800px]
        overflow-hidden
        opacity-20 pointer-events-none
      "
    >
      <motion.path
        d={d}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
        style={{
          // subtle neon glow in light mode
          filter: currentTheme === "light"
            ? `drop-shadow(0 0 6px ${strokeColor}) drop-shadow(0 0 12px ${strokeColor})`
            : undefined,
        }}
      />
    </svg>
  );
}
