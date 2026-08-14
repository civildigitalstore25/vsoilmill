import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { AUTH_COPY, AUTH_PROVIDERS, USER_ROLES } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: ROUTES.LOGIN,
  },
  providers: [
    Google,
    Credentials({
      name: AUTH_PROVIDERS.CREDENTIALS,
      credentials: {
        email: { label: AUTH_COPY.email, type: "email" },
        password: { label: AUTH_COPY.password, type: "password" },
      },
      authorize: async () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isAdminRoute = path.startsWith(ROUTES.ADMIN.ROOT);
      const isProtectedUserRoute =
        path.startsWith(ROUTES.PROFILE) ||
        path.startsWith(ROUTES.ORDERS) ||
        path.startsWith(ROUTES.CHECKOUT);

      if (isAdminRoute) {
        return Boolean(auth?.user && auth.user.role === USER_ROLES.ADMIN);
      }

      if (isProtectedUserRoute) {
        return Boolean(auth?.user);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user.role as UserRole | undefined) ?? USER_ROLES.USER;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role =
          (token.role as UserRole | undefined) ?? USER_ROLES.USER;
        session.user.image = (token.picture as string | undefined) ?? session.user.image;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
