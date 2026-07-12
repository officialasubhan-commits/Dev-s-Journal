import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string | null;
      profileCompleted?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    username?: string | null;
    profileCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username?: string | null;
    profileCompleted?: boolean;
  }
}
