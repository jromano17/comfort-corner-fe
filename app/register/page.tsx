import Link from "next/link";
import { Armchair } from "lucide-react";
import { RegisterForm } from "@/components/register-form";

export const metadata = {
  title: "Create Account | Comfort Corner",
  description: "Create your Comfort Corner account",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Armchair className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join Comfort Corner today
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline">
            Back to catalogue
          </Link>
        </p>
      </div>
    </main>
  );
}
