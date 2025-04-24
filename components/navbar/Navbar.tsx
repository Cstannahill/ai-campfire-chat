// components/Navbar.tsx
"use client";

import { useState } from "react"; // Import useState
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
// Importing icons for menu, close, login, logout, spinner
import {
  PiList,
  PiX,
  PiSpinnerGapBold,
  PiSignOut,
  PiSignIn,
} from "react-icons/pi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to close menu and sign out
  const handleMobileSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsMobileMenuOpen(false);
  };

  // Helper function to close menu and navigate to sign in
  const handleMobileSignIn = () => {
    // Option 1: Navigate to login page (if using Link below, this isn't needed)
    // signIn(); // Option 2: Trigger default sign-in flow
    setIsMobileMenuOpen(false); // Close menu after action initiated
  };

  return (
    // Added relative positioning for absolute positioned mobile menu
    <nav className=" sticky top-0 z-50 w-full bg-brand-surface/80 text-white shadow-md backdrop-blur-md bg-opacity-80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Brand/Logo (Always Visible) */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu if open when clicking brand
              className="flex-shrink-0 text-xl font-bold text-cyan-600 hover:text-blue-800 transition-colors font-[Electrolize]"
            >
              TRON
            </Link>
          </div>

          {/* Right Side: Desktop Auth Status (Hidden below md breakpoint) */}
          <div className="hidden md:flex md:items-center md:ml-6">
            <div className="flex items-center space-x-4">
              {status === "loading" && (
                <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                  <PiSpinnerGapBold className="h-5 w-5 animate-spin" />
                </div>
              )}

              {status === "authenticated" && session?.user && (
                <>
                  <span className="hidden lg:inline text-sm text-cyan-600">
                    {" "}
                    {/* Hide name on medium screens too */}
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <PiSignOut className="mr-1 h-5 w-5" aria-hidden="true" />
                    Logout
                  </button>
                </>
              )}

              {status === "unauthenticated" && (
                <Link
                  href="/login"
                  className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PiSignIn className="mr-1 h-5 w-5" aria-hidden="true" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger Menu Button (Visible below md breakpoint) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <PiX className="block h-6 w-6" aria-hidden="true" /> // Close icon
              ) : (
                <PiList className="block h-6 w-6" aria-hidden="true" /> // Hamburger icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {/* Use transition classes for better effect */}
      <div
        className={`md:hidden absolute top-16 inset-x-0 z-40 transform origin-top shadow-lg ring-1 ring-black ring-opacity-5 transition ease-out duration-100 ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-95 pointer-events-none" // Toggle visibility and pointer events
        }`}
        id="mobile-menu"
      >
        <div className="bg-white px-2 pb-3 pt-2 sm:px-3 space-y-1">
          {/* Mobile Auth Status */}
          {status === "loading" && (
            <div className="flex items-center justify-center px-3 py-4 text-sm font-medium text-gray-500">
              <PiSpinnerGapBold className="h-6 w-6 animate-spin" />
            </div>
          )}

          {status === "authenticated" && session?.user && (
            <>
              <div className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 border-b border-gray-100">
                {session.user.name || session.user.email}
              </div>
              <button
                onClick={handleMobileSignOut} // Use handler to close menu
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100 hover:text-red-700" // Red for logout emphasis
              >
                Logout
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <Link
              href="/login"
              onClick={handleMobileSignIn} // Use handler to close menu
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
            >
              Login
            </Link>
          )}

          {/* Add other mobile navigation links here if needed */}
          {/* <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="...">Dashboard</Link> */}
        </div>
      </div>
      {/* --- End Mobile Menu Dropdown --- */}
    </nav>
  );
}
