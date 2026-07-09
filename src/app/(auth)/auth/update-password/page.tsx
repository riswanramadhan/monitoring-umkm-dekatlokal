import { Logo } from "@/components/brand/logo";
import { UpdatePasswordForm } from "@/features/auth/auth-form";

export default function UpdatePasswordPage() {
  return (
    <div>
      <Logo className="mb-10 lg:hidden" />
      <p className="text-sm font-semibold text-[#0255F5]">Keamanan akun</p>
      <h2 className="mt-2 text-3xl font-semibold text-[#101828]">
        Buat password baru
      </h2>
      <p className="mt-2 mb-8 text-sm text-[#667085]">
        Gunakan minimal 10 karakter dan jangan gunakan ulang password lain.
      </p>
      <UpdatePasswordForm />
    </div>
  );
}
