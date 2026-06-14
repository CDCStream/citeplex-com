import { redirect } from "next/navigation";
import { AuthAside } from "@/components/auth/auth-aside";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Reset password — CitePlex" };

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <ForgotPasswordForm />
      </div>
      <AuthAside />
    </div>
  );
}
