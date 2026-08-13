import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile",
    "/profile/:path*",
    "/orders",
    "/orders/:id",
  ],
};
