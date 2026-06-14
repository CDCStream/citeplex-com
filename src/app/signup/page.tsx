import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthAside } from "@/components/auth/auth-aside";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign up — CitePlex" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <AuthForm mode="signup" redirect={params.redirect || "/dashboard"} initialError={params.error} />
      </div>
      <AuthAside />
    </div>
  );
}
