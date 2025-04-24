import { Suspense } from "react";
import { PiSpinnerGapBold } from "react-icons/pi";
import LoginForm from "@/components/login/LoginForm"; // Import the LoginForm component

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Wrap the component using useSearchParams in Suspense */}
        <Suspense fallback={<LoadingFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

// --- Simple Loading Fallback Component ---
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center rounded-2xl bg-white p-8 shadow-xl min-h-[400px]">
      {" "}
      {/* Give it some height */}
      <PiSpinnerGapBold className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}
