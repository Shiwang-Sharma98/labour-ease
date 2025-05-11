import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the user data from the session
    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}