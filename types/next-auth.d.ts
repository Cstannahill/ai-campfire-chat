import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database ID. */
      id: string;
      // ...other properties like name, email, image can also be explicitly typed if needed
    } & DefaultSession["user"]; // Keep the default properties
  }

  // Extend the built-in User type
  interface User extends DefaultUser {
    /** The user's database ID. */
    id: string;
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    id: string; // Add the id property to the JWT type
  }
}
