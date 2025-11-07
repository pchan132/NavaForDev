import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

declare module "GoogleProvider" {
  interface Profile {
    sub: string;
    name: string;
    email: string;
    picture: string;
  }
}

declare module "session" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}
declare module "jwt" {
  interface JWT {
    id: string;
    picture?: string;
  }
}
