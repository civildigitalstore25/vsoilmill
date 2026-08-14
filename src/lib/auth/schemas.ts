import { z } from "zod";
import { AUTH, USER_ROLES } from "@/constants/auth";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(AUTH.passwordMinLength),
});

export const registerSchema = credentialsSchema.extend({
  name: z.string().min(AUTH.nameMinLength),
  phone: z.string().optional(),
});

export const adminCreateUserSchema = registerSchema.extend({
  role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]).default(USER_ROLES.USER),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().min(AUTH.nameMinLength).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(AUTH.passwordMinLength).optional(),
  role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]).optional(),
});

export const adminUpdateRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum([USER_ROLES.USER, USER_ROLES.ADMIN]),
});

export const adminIdSchema = z.object({
  id: z.string().min(1),
});
