import { sql } from "@vercel/postgres";
import { generateOTP, saveOTP } from "../../../lib/otp-helper";
import { sendVerificationEmail } from "../../../helpers/sendVerficationEmails";

function generateUserId(email) {
  const localPart = email.split("@")[0];
  let hash = 5381;
  
  for (let i = 0; i < localPart.length; i++) {
    const char = localPart.charCodeAt(i);
    hash = (hash << 5) + hash + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash);
}

export async function POST(req) {
  try {
    // Parse request body
    const { username, password, email, role } = await req.json();
    
    // Input validation
    if (!username || !password || !email || !role) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400 }
      );
    }
    
    // Check if email already exists in users table
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existingUser.rowCount > 0) {
      return new Response(
        JSON.stringify({ error: "User already registered" }),
        { status: 409 }
      );
    }
    
    // Check if email already exists in pending_users table
    const existingPendingUser = await sql`
      SELECT id FROM pending_users WHERE email = ${email}
    `;
    if (existingPendingUser.rowCount > 0) {
      return new Response(
        JSON.stringify({ error: "Registration already in progress for this email" }),
        { status: 409 }
      );
    }
    
    // Generate unique user ID
    const userId = generateUserId(email);
    
    // Generate verification OTP
    const verifyCode = generateOTP();
    
    // Send verification email
    const emailResult = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResult.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to send verification email",
          details: emailResult.error,
        }),
        { status: 500 }
      );
    }
    
    // Save OTP
    await saveOTP(email, verifyCode);
    
    // Insert new pending user
    try {
      await sql`
        INSERT INTO pending_users (id, username, password, email, role)
        VALUES (${userId}, ${username}, ${password}, ${email}, ${role})
      `;
    } catch (dbError) {
      // Handle case where there was a collision on the ID
      if (dbError.code === '23505') { // PostgreSQL unique constraint violation code
        console.error("Database insertion error:", dbError);
        return new Response(
          JSON.stringify({ 
            error: "Registration failed due to database conflict. Please try again." 
          }),
          { status: 500 }
        );
      }
      throw dbError; // Re-throw other database errors
    }
    
    return new Response(
      JSON.stringify({
        message: "Verification code sent",
        userId,
        email,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to register user",
        details: error.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}