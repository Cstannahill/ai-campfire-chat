// app/api/register/route.ts

import prisma from "@/lib/prisma/prisma"; // Adjust import path if needed
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // --- Input Validation ---
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing name, email, or password" },
        { status: 400 }
      );
    }

    // Basic email format check (consider a more robust library for production)
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Basic password length check
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // --- Check if user already exists ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Hash Password ---
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // --- Create User ---
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    // --- Return Success Response ---
    // Avoid sending back sensitive data like the password hash
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
