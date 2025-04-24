// components/Providers.tsx
"use client"; // <--- Mark this component as a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
  // We don't need to pass the session prop here for App Router
}

export default function Providers({ children }: Props) {
  return (
    // SessionProvider will automatically fetch the session on the client
    <SessionProvider>{children}</SessionProvider>
  );
}
