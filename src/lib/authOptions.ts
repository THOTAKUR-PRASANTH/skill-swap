// src/lib/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { authenticator } from 'otplib'; // 👈 ADD THIS IMPORT

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" }, // We need this for the 2nd step
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          return null;
        }

        // --- 👇 NEW MFA VERIFICATION LOGIC --- 👇
        
        // If MFA is enabled for the user, we need to verify their token
        if (user.mfaEnabled) {
          if (!credentials.mfaToken) {
            // If the user has MFA enabled but hasn't provided a token yet,
            // we throw this special error to tell the frontend to ask for the token.
            throw new Error("MFA"); 
          }
          if (!user.mfaSecret) {
             // This is a server-side issue, should not happen in normal flow
             throw new Error("MFA secret is not configured for this user.");
          }
          
          // Verify the MFA token provided by the user
          const isMfaTokenCorrect = authenticator.check(credentials.mfaToken, user.mfaSecret);

          if (!isMfaTokenCorrect) {
            // If the MFA token is incorrect, fail the login
            return null;
          }
        }
        
        // --- 👆 END OF MFA LOGIC --- 👆

        // If password is correct AND (MFA is disabled OR MFA token is correct)
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 60 , //  minutes
  },
  
  jwt: {
    maxAge: 10 * 60, //  minutes
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
};