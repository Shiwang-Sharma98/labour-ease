// components/AnimatedBackgroundStars.jsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { useTheme } from "next-themes";

export default function AnimatedBackgroundStars() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // keep hooks stable
  if (!mounted) return null;

  const current = theme === "system" ? resolvedTheme : theme;
  const starColor = current === "dark" ? "#ffffff" : "#000000";

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "stars",
        fullScreen: { enable: false },
        particles: {
          color: { value: starColor },
          number: { value: 120, density: { enable: true, area: 800 } },
          move: { enable: true, speed: 0.2, direction: "bottom", outMode: "out" },
          opacity: {
            value: current === "dark" ? 0.7 : 0.9,
            random: { enable: true, minimumValue: 0.2 },
            animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
          },
          size: {
            value: { min: 1, max: 3 },
            random: true,
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1,
              color: { value: starColor },
             
            },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
