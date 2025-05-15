import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    // Delete NextAuth session cookie (adjust the cookie name if needed)
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url'); // optional
    // Also delete your custom auth-token if used
    response.cookies.delete('auth-token'); 
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error logging out', error: error.message }, { status: 500 });
  }
}
