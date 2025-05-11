"use client";

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}