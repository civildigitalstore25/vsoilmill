import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth/auth.config";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LeanUser = {
  _id: { toString(): string };
  email: string;
  name: string;
  role: string;
  passwordHash: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDb();
        const user = (await UserModel.findOne({
          email: parsed.data.email.toLowerCase(),
        }).lean()) as LeanUser | null;

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
          role: user.role,
        };
      },
    }),
  ],
});
