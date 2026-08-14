import { NextResponse } from "next/server";
import { AUTH_ERRORS, USER_ROLES } from "@/constants/auth";
import { auth } from "@/lib/auth/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: AUTH_ERRORS.unauthorized },
        { status: 401 },
      ),
    };
  }

  return { ok: true as const, session };
}
