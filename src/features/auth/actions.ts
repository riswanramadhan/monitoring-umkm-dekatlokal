"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authenticate, SESSION_COOKIE } from "@/server/auth/credentials";

export interface AuthActionState {
  error?: string;
  success?: string;
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    return { error: "Masukkan email valid dan password minimal 8 karakter." };
  const account = authenticate(parsed.data.email, parsed.data.password);
  if (!account)
    return {
      error: "Email atau password salah. Silakan periksa kembali data Anda.",
    };
  const cookieStore = await Promise.resolve(cookies());
  cookieStore.set(SESSION_COOKIE, account.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  const requested = String(formData.get("next") ?? "/dashboard");
  redirect(requested.startsWith("/dashboard") ? requested : "/dashboard");
}

export async function requestResetAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = z.string().email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Masukkan alamat email yang valid." };
  return {
    success: "Permintaan pemulihan akun berhasil diproses.",
  };
}

export async function updatePasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = z
    .object({ password: z.string().min(10), confirmation: z.string() })
    .refine((value) => value.password === value.confirmation, {
      message: "Konfirmasi password tidak sama.",
      path: ["confirmation"],
    })
    .safeParse({
      password: formData.get("password"),
      confirmation: formData.get("confirmation"),
    });
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? "Password tidak valid.",
    };
  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await Promise.resolve(cookies());
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
