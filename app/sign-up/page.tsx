"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dictionary: dict } = usePreferences();

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage(dict.signUp.passwordMismatch);
      return;
    }

    setIsSubmitting(true);

    const derivedName = email.split("@")[0]?.trim() || "User";

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: derivedName,
      callbackURL: "/dashboard",
    });

    if (error) {
      setErrorMessage(error.message ?? dict.signUp.createError);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f5f4] px-4 py-10 dark:bg-[#12110f]">
      <div className="w-full max-w-md rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614] sm:p-7">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link href="/sign-in">
            <ArrowLeft className="size-4" />
            {dict.signUp.backToSignIn}
          </Link>
        </Button>

        <div className="mb-6 space-y-2 text-center">
          <h3 className="text-[26px] font-bold leading-[1.23] tracking-[-0.625px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">
            {dict.signUp.title}
          </h3>
          <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.signUp.subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
              {dict.signUp.email}
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
              {dict.signUp.password}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={dict.signUp.createPassword}
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? dict.signUp.hidePassword : dict.signUp.showPassword}
                className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-[#615d59] hover:text-[rgba(0,0,0,0.95)] dark:text-[#bbb6af] dark:hover:text-[rgba(255,255,255,0.95)]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-[rgba(0,0,0,0.95)]"
            >
              {dict.signUp.confirmPassword}
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={dict.signUp.confirmYourPassword}
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? dict.signUp.hidePassword : dict.signUp.showPassword}
                className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-[#615d59] hover:text-[rgba(0,0,0,0.95)] dark:text-[#bbb6af] dark:hover:text-[rgba(255,255,255,0.95)]"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-[4px] border border-[#dd5b00]/30 bg-[#ff64c8]/10 px-3 py-2 text-sm text-[#dd5b00]">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? dict.signUp.submitting : dict.signUp.submit}
          </Button>
        </form>
      </div>
    </main>
  );
}
