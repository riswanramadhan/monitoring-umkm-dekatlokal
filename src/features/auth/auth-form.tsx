"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Loader2, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthActionState } from "./actions";
import {
  loginAction,
  requestResetAction,
  updatePasswordAction,
} from "./actions";

const initialState: AuthActionState = {};

function Message({ state }: { state: AuthActionState }) {
  if (state.error)
    return (
      <p
        role="alert"
        className="rounded-lg bg-[#FEE2E2] px-3 py-2 text-sm text-[#B91C1C]"
      >
        {state.error}
      </p>
    );
  if (state.success)
    return (
      <p
        role="status"
        className="rounded-lg bg-[#DCFCE7] px-3 py-2 text-sm text-[#15803D]"
      >
        {state.success}
      </p>
    );
  return null;
}

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute top-3 left-3 size-4 text-[#98A2B3]" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-9"
            placeholder="nama@dekatlokal.com"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/login?mode=forgot"
            className="text-xs font-semibold text-[#0255F5] hover:underline"
          >
            Lupa password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole className="absolute top-3 left-3 size-4 text-[#98A2B3]" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="pl-9"
          />
        </div>
      </div>
      <Message state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}
        Masuk ke Dashboard
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestResetAction,
    initialState,
  );
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="reset-email">Email terdaftar</Label>
        <Input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@dekatlokal.com"
        />
      </div>
      <Message state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}Kirim tautan
        reset
      </Button>
      <Button asChild variant="ghost" className="w-full">
        <Link href="/login">
          <ArrowLeft />
          Kembali ke login
        </Link>
      </Button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="new-password">Password baru</Label>
        <Input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmation">Ulangi password</Label>
        <Input
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </div>
      <Message state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}Simpan password
      </Button>
    </form>
  );
}
