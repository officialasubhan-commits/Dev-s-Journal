import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { verify } from "otplib";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
        totp: { label: "Authenticator Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials.");
        }

        // Allow login by email or username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email }
            ]
          }
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        // Check Account Lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is locked due to multiple failed attempts. Try again later.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        if (!isPasswordValid) {
          const newAttempts = user.failedLoginAttempts + 1;
          const lockedUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: newAttempts, lockedUntil }
          });
          throw new Error("Invalid credentials.");
        }

        // 2FA Verification
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.totp) {
            throw new Error("TOTP_REQUIRED"); // Special flag caught by frontend
          }
          const isValid = await verify({ token: credentials.totp, secret: user.twoFactorSecret });
          if (!isValid) {
            throw new Error("Invalid authenticator code.");
          }
        }

        // Reset failed attempts & update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null, lastLogin: new Date() }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days rolling session
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.picture = (user as any).image || user.image;
        token.profileCompleted = (user as any).profileCompleted || false;
      }
      
      if (trigger === "update" && session) {
        token = { ...token, ...session };
        
        // If we really need to update from DB on a session update, we could do it here,
        // but typically session update passes the new values directly.
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.image = token.picture as string | null | undefined;
        (session.user as any).username = token.username;
        (session.user as any).profileCompleted = token.profileCompleted as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

