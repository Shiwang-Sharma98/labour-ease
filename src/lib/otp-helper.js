import { sql } from "@vercel/postgres";

export function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOTP(email, otp) {
  // Delete any existing OTP for this email first
  await sql`
    DELETE FROM verification_tokens 
    WHERE email = ${email}
  `;

  // Insert new OTP with expiration (10 minutes from now)
  await sql`
    INSERT INTO verification_tokens (email, token, expires_at)
    VALUES (
      ${email}, 
      ${otp}, 
      NOW() + INTERVAL '10 minutes'
    )
  `;
}

export async function verifyOTP(email, otp) {
  try {
    const result = await sql`
      SELECT * FROM verification_tokens
      WHERE email = ${email} 
        AND token = ${otp} 
        AND expires_at > NOW()
    `;

    if (result.rowCount > 0) {
      // Delete the token after successful verification
      await sql`
        DELETE FROM verification_tokens
        WHERE email = ${email} AND token = ${otp}
      `;
      return true;
    }
    return false;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
}
