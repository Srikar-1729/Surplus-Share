// auth.js or route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          
          const { data: user, error } = await supabase
            .from("auth_users")
            .select("*")
            .eq("email", email)
            .single();

          if (error || !user) {
            console.error("User not found:", error);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.error("Invalid password");
            return null;
          }
          
          // Only include fields that exist in your database
          return { 
            id: user.id, 
            email: user.email,
            // Only include role if it exists in your database
            ...(user.role && { role: user.role })
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "auth/login", // Change this to your login page
    error: "auth/login", // Redirect to login page on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Only add role if it exists
        if (user.role) token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        // Only add role if it exists
        if (token.role) session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development",
});

export const GET = handler;
export const POST = handler;