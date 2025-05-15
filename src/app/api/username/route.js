import { getServerSession } from "next-auth";
import { authOptions } from "../auth/options"; // Adjust path if needed
import { NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use .env for DB credentials
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();

    const result = await client.query(
      "SELECT id, username, email FROM users WHERE email = $1",
      [session.user.email]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Return only the username
    return NextResponse.json({
      username: result.rows[0]?.username || "User",
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
