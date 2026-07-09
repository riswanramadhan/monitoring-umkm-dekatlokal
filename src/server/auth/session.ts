import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authAccounts, SESSION_COOKIE } from "@/server/auth/credentials";
import type { AppRole } from "@/lib/permissions";

export interface SessionProfile {
  id: string;
  email: string | null;
  fullName: string;
  role: AppRole;
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const cookieStore = await Promise.resolve(cookies());
  const sessionEmail = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionEmail) return null;
  const account = authAccounts.find(
    (item) => item.email.toLowerCase() === sessionEmail.toLowerCase(),
  );
  if (!account) return null;
  return {
    id: account.email,
    email: account.email,
    fullName: account.fullName,
    role: account.role,
  };
}

export async function requireSession() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  return session;
}

export async function requireApiSession() {
  return getSessionProfile();
}
