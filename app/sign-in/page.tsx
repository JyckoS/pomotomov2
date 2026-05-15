"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Globe } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSigningIn(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setErrorMessage(error.message ?? "Unable to sign in. Please try again.");
      setIsSigningIn(false);
      return;
    }

    setIsSigningIn(false);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setErrorMessage(error.message ?? "Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
      return;
    }

    setIsGoogleLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f5f4] px-4 py-10">
      <div className="w-full max-w-md rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] sm:p-7">
        <div className="mb-6 space-y-2 text-center">
          <h3 className="text-[26px] font-bold leading-[1.23] tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">
            Sign In
          </h3>
          <p className="text-sm text-[#615d59]">
            Welcome back. Sign in to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-[rgba(0,0,0,0.95)]"
            >
              Email
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[rgba(0,0,0,0.95)]"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0075de] underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-[#615d59] hover:text-[rgba(0,0,0,0.95)]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-[4px] border border-[#dd5b00]/30 bg-[#ff64c8]/10 px-3 py-2 text-sm text-[#dd5b00]">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSigningIn || isGoogleLoading}>
            {isSigningIn ? "Signing in..." : "Login"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
          <span className="text-xs font-semibold tracking-[0.125px] text-[#a39e98]">OR</span>
          <span className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSigningIn}
        >
          <Globe className="size-4" />
          {isGoogleLoading ? "Redirecting..." : "Sign In with Google"}
        </Button>

        <div className="mt-6 text-center text-sm text-[#615d59]">
          Don&apos;t have an account?{" "}
          <Button variant="link" size="sm" className="h-auto p-0 font-semibold" asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
