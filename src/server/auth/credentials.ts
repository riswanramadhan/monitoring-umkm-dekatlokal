import type { AppRole } from "@/lib/permissions";

export const SESSION_COOKIE = "dekatlokal_session";

export interface AuthAccount {
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
}

export const authAccounts: AuthAccount[] = [
  {
    email: "hello@dekatlokal.com",
    password: "dekatlokal0110",
    fullName: "Superadmin DekatLokal",
    role: "superadmin",
  },
  {
    email: "partner@dekatlokal.com",
    password: "dekatlokal0110",
    fullName: "Partner UMKM",
    role: "viewer",
  },
];

export function authenticate(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return (
    authAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalized &&
        account.password === password,
    ) ?? null
  );
}
