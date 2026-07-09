import { Logo } from "@/components/brand/logo";
import { ForgotPasswordForm, LoginForm } from "@/features/auth/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const forgot = params.mode === "forgot";
  return (
    <div>
      <Logo className="mb-10 lg:hidden" />
      <p className="text-sm font-semibold text-[#0255F5]">Dashboard Internal</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101828]">
        {forgot ? "Atur ulang password" : "Selamat datang kembali"}
      </h2>
      <p className="mt-2 mb-8 text-sm leading-6 text-[#667085]">
        {forgot
          ? "Masukkan email terdaftar untuk memulihkan akses akun Anda."
          : "Masukkan email dan password untuk melanjutkan."}
      </p>
      {forgot ? <ForgotPasswordForm /> : <LoginForm next={params.next} />}
      {!forgot ? (
        <p className="mt-6 text-center text-xs text-[#98A2B3]">
          Akses terbatas untuk pengguna yang terdaftar.
        </p>
      ) : null}
    </div>
  );
}
