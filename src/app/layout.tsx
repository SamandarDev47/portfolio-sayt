import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "DevFolio",
    template: "%s | DevFolio",
  },
  description:
    "A production-quality platform where developers create, publish, and share recruiter-ready portfolio pages.",
  openGraph: {
    title: "DevFolio",
    description:
      "A polished multi-user developer portfolio platform for public profiles, discoverability, and hiring workflows.",
    siteName: "DevFolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFolio",
    description:
      "A polished multi-user developer portfolio platform for public profiles, discoverability, and hiring workflows.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "en";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
