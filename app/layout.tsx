import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/utility/Providers";
import Navbar from "@/components/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRON AI Assistant",
  description: "TRON AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} "bg-brand-surface antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            {" "}
            {/* Ensure layout takes height */}
            <Navbar /> {/* Navbar at the top */}
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
