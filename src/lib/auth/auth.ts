import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { AUTH_COPY, AUTH_PROVIDERS, USER_ROLES } from "@/constants/auth";
import { authConfig } from "@/lib/auth/auth.config";
import { credentialsSchema } from "@/lib/auth/schemas";
import {
  findAuthUserByEmail,
  upsertGoogleUser,
} from "@/lib/auth/users";
import type { UserRole } from "@/types/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: AUTH_PROVIDERS.CREDENTIALS,
      credentials: {
        email: { label: AUTH_COPY.email, type: "email" },
        password: { label: AUTH_COPY.password, type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await findAuthUserByEmail(parsed.data.email);
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role ?? USER_ROLES.USER,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === AUTH_PROVIDERS.GOOGLE) {
        const saved = await upsertGoogleUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });
        return Boolean(saved);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await findAuthUserByEmail(user.email);
        if (dbUser) {
          token.id = String(dbUser._id);
          token.role = dbUser.role ?? USER_ROLES.USER;
          token.picture = dbUser.image ?? user.image ?? token.picture;
          return token;
        }
      }

      if (user) {
        token.role = (user.role as UserRole | undefined) ?? USER_ROLES.USER;
        token.id = user.id;
        token.picture = user.image ?? token.picture;
      }

      return token;
    },
  },
});
