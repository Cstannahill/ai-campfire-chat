"use client"; // Keep this at the top if the whole file needs client features

import React, { useState, FormEvent, Suspense } from "react"; // Import Suspense
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { PiSpinnerGapBold } from "react-icons/pi";

// --- Inner Component that uses useSearchParams ---
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook is called here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Get callbackUrl from query params, default to home page
  // This calculation now happens inside the component wrapped by Suspense
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // --- Handle Credentials Sign In ---
  const handleCredentialsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoadingCreds(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else {
          setError(`Error: ${result.error}`); // Show other errors
        }
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        // Handle cases where result might be ok: false but no specific error code
        setError("Sign in failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoadingCreds(false);
    }
  };

  // --- Handle Google Sign In ---
  const handleGoogleSignIn = () => {
    setIsLoadingGoogle(true);
    signIn("google", { callbackUrl });
  };

  // --- JSX for the form elements ---
  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign In
      </h2>

      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoadingCreds || isLoadingGoogle}
        className="mb-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
      >
        {isLoadingGoogle ? (
          <PiSpinnerGapBold className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" aria-hidden="true" />
        )}
        Sign in with Google
      </button>

      {/* Separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Display Error Messages */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Credentials Form */}
      <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoadingCreds || isLoadingGoogle}
              className="block w-full appearance-none rounded-md border text-black border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-60"
            />
          </div>
        </div>
        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoadingCreds || isLoadingGoogle}
              className="block w-full appearance-none rounded-md border text-black border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-60"
            />
          </div>
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoadingCreds || isLoadingGoogle}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {isLoadingCreds && (
              <PiSpinnerGapBold className="mr-2 h-5 w-5 animate-spin" />
            )}
            Sign in with Email
          </button>
        </div>
      </form>

      {/* Optional: Link to Sign Up */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/register")}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
