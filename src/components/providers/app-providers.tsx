"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 30, 51, 0.92)",
              border: "1px solid rgba(148, 178, 219, 0.14)",
              color: "#f6fbff",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
