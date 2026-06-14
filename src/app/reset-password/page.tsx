import { AuthAside } from "@/components/auth/auth-aside";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "Set a new password — CitePlex" };

// Reached via the reset link → /auth/callback exchanges the code for a
// recovery session, then forwards here. The form calls updateUser.
export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <ResetPasswordForm />
      </div>
      <AuthAside />
    </div>
  );
}
