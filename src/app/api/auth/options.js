// app/api/auth/options.js
import { sql } from "@vercel/postgres";
import CredentialsProvider from 'next-auth/providers/credentials';

// Define the generateUserId function for consistent user identification
function generateUserId(email) {
  const localPart = email.split('@')[0];
  let hash = 5381;  // Initial value for DJB2 algorithm
  for (let i = 0; i < localPart.length; i++) {
    const char = localPart.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; // hash * 33 + char
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);  // Ensure positive value
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }
          
          // Generate the unique ID from the provided email
          const uniqueId = generateUserId(credentials.email);
          
          // Fetch user with the provided unique ID
          const result = await sql`
            SELECT * FROM users
            WHERE id = ${uniqueId}
          `;
          
          const user = result.rows[0];
          
          if (!user) {
            throw new Error('No user found with this email');
          }
          
          // Compare provided password with the stored password
          // Note: In production, you should use hashed passwords with bcrypt
          if (credentials.password === user.password) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
              name: user.name || user.email.split('@')[0]
            };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // When sign in occurs, add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        // Add an issued-at time to help with expiry validation
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      // If it's a session update, check if we need to update the token
      if (trigger === "update" && session) {
        // Merge any updates from the session
        return { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour in seconds (not 2 minutes)
  },
  jwt: {
    // Enforce max age on JWT token directly
    maxAge: 60 * 60, // 1 hour in seconds
  },
  cookies: {
    // Configure secure cookies in production
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login', // Error page
  },
  debug: process.env.NODE_ENV === 'development',
};