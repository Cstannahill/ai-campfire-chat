// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Example: Protect admin routes based on token role
    // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
    //   return new NextResponse("You are not authorized!");
    // }

    // Return NextResponse.next() to continue processing the request
    // This part is usually not needed unless you have specific logic like the role check above
    // If you only want basic protection (redirect if not logged in),
    // the withAuth default behavior handles it.
    // console.log("Middleware running for:", req.nextUrl.pathname, "Token:", req.nextauth.token);
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback determines if the user is authorized.
      // Returning true allows the request to proceed.
      // Returning false triggers redirection to the login page.
      authorized: ({ req, token }) => {
        // !!token means return true if token exists (user is logged in), false otherwise
        // You could add role checks here too: !!token && token.role === "admin"
        return !!token;
      },
    },
    // Redirect configuration: Tell withAuth where your login page is.
    // This ensures it redirects correctly if `authorized` returns false.
    pages: {
      signIn: "/login", // Your custom login page path
      // error: "/auth/error", // Optional error page
    },
  }
);

// Apply middleware to all routes EXCEPT:
// - /login (your sign-in page)
// - /signup (your sign-up page)
// - /api routes (especially /api/auth/**)
// - _next/static files
// - _next/image files
// - favicon.ico
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (your login page)
     * - signup (your signup page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|/).*)",
  ],
};
