import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma/prisma"; // Adjust the import path as necessary
export const authOptions: NextAuthOptions = {
  // Add the adapter
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // Your existing authorize logic is correct for checking credentials
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // No user found OR user signed up with OAuth previously (no password)
        if (!user || !user.password) {
          // Consider throwing a specific error or returning null
          // Returning null is often preferred to avoid hinting if email exists
          return null;
          // throw new Error("Invalid email or password");
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password // user.password should exist here based on above check
        );
        if (!validPassword) {
          // throw new Error("Invalid password");
          return null; // Return null on invalid password
        }

        // Return essential user info for the session/JWT
        // The adapter handles DB user creation/updates
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Keep JWT if you prefer stateless sessions
    // strategy: "database", // Or switch to database sessions if needed
    maxAge: 60 * 60 * 24 * 7 * 30, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // JWT callback to include user ID in the token
    async jwt({ token, user, account, profile }) {
      // 'user' is available on initial sign-in
      // 'account' & 'profile' are available on OAuth sign-in
      if (user) {
        token.id = user.id;
      }
      // You could potentially add OAuth access tokens here if needed
      // if (account) {
      //   token.accessToken = account.access_token;
      // }
      return token;
    },
    // Session callback to make user ID available on the session object
    async session({ session, token }) {
      // 'token' contains the data from the jwt callback
      if (token.id && session?.user) {
        session.user.id = token.id as string;
      }
      // if (token.accessToken && session) {
      //   session.accessToken = token.accessToken;
      // }
      return session;
    },
  },
};
