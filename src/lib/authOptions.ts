import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { authenticator } from 'otplib';

import { admin } from './firebaseAdmin'; // Import our new admin helper


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
          mfaToken: { label: "MFA Token", type: "text" },
        },
        // --- This 'authorize' function is perfect, NO CHANGES NEEDED ---
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
          if (user.mfaEnabled) {
            if (!credentials.mfaToken) {
              throw new Error("MFA"); 
            }
            if (!user.mfaSecret) {
               throw new Error("MFA secret is not configured for this user.");
            }
            const isMfaTokenCorrect = authenticator.check(credentials.mfaToken, user.mfaSecret);
            if (!isMfaTokenCorrect) {
              return null;
            }
          }
          return user; // Successfully authorized!
        }
      })
    ],
    session: {
      strategy: "jwt",
      maxAge: 10 * 60 , // 10 minutes
    },
    
    jwt: {
      maxAge: 10 * 60, // 10 minutes
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, user }) {
        // 'user' is only passed on the *initial* login.
        // This runs for Credentials, Google, AND GitHub.
        if (user) {
    console.log("Attempting to create Firebase token for user ID:", user.id);
          token.id = user.id;
          token.emailVerified = user.emailVerified;

          // --- 👇 NEW FIREBASE BRIDGE LOGIC --- 👇
          try {
            // Use the user's database ID (from Cockroach/Prisma) to create a Firebase token
            // This ID will be the same for Google, GitHub, and Credentials users
            // because the PrismaAdapter handles it.
            const firebaseToken = await admin.auth().createCustomToken(user.id);
            token.firebaseToken = firebaseToken; // Add the token to the JWT
          } catch (error) {
            console.error("Error creating Firebase custom token:", error);
            token.firebaseToken = null; // Set to null on error
          }
          // --- 👆 END OF FIREBASE LOGIC --- 👆
        }
        return token; // This token is now stored in the session cookie
      },

      async session({ session, token }) {
        if (token && session.user) {
          // Pass the standard user ID and email verification
          session.user.id = token.id as string;
          session.user.emailVerified = token.emailVerified as (null);

          // --- 👇 NEW LOGIC TO PASS TOKEN TO CLIENT --- 👇
          // This exposes the Firebase token to your client-side React components
          // We cast 'session' to 'any' here, but for strict TypeScript,
          // you should define this 'firebaseToken' in a 'next-auth.d.ts' type file.
          (session as any).firebaseToken = token.firebaseToken;
          // --- 👆 END OF NEW LOGIC --- 👆
        }
        return session;
      },
    },
  };
