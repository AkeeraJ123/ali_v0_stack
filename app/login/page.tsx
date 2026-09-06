import { AuthForm } from "@/components/auth/AuthForm";
import { BrandMark } from "@/components/layout/BrandMark";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-cherry-radial px-6 py-16">
      <BrandMark />
      <AuthForm mode="login" />
    </main>
  );
}
