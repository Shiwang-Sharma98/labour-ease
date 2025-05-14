import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { verifyOTP } from "../../../lib/otp-helper";

export async function POST(req, res) {
  try {
    const { email, otp, userId } = await req.json();

    // Verify OTP
    const isOTPValid = await verifyOTP(email, otp);
    if (!isOTPValid) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification code" }),
        { status: 400 }
      );
    }

    // Retrieve pending user details
    const pendingUserResult = await sql`
      SELECT username, password, email, role
      FROM pending_users
      WHERE email = ${email} AND id = ${userId}
    `;

    if (pendingUserResult.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "User registration not found" }),
        { status: 404 }
      );
    }

    const { username, password, role } = pendingUserResult.rows[0];

    // Insert user into main users table
    await sql`
      INSERT INTO users (id, username, password, email, role)
      VALUES (${userId}, ${username}, ${password}, ${email}, ${role})
    `;

    // Insert role-specific details
    if (role === "shopkeeper") {
      await sql`
        INSERT INTO shopkeepers (id, shop_name, shop_address, shop_phone, bio)
        VALUES (${userId}, 'Edit', 'Edit', 'Edit', 'Edit')
      `;
    } else if (role === "labour") {
      await sql`
        INSERT INTO labours (id, name, phone, address, experience)
        VALUES (${userId}, 'Edit', 'Edit', 'Edit', 'Edit')
      `;
    }

    // Remove from pending users
    await sql`
      DELETE FROM pending_users
      WHERE email = ${email} AND id = ${userId}
    `;

    // Generate a JWT token
    const token = jwt.sign(
      { id: userId, email, role },   // payload
      process.env.JWT_SECRET || "your-secret-key", // secret (use env var!)
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        token,
        userId,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to verify user" }),
      { status: 500 }
    );
  }
}
