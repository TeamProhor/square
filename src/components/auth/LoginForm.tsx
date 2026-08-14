"use client";

import Image from "next/image";
import { useState } from "react";
import { Lock, Send, User } from "@/components/icons";
import { MadeWithFooter } from "@/components/shared/made-with-footer";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePasswordLogin, usePasswordSignUp } from "@/hooks/use-auth";
import type { LoginFormProps } from "@/types";

export default function LoginForm({ dict }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const loginMutation = usePasswordLogin();
  const signUpMutation = usePasswordSignUp();

  const isLoading = loginMutation.isPending || signUpMutation.isPending;
  const error = loginMutation.error || signUpMutation.error;
  const isSuccess = loginMutation.isSuccess || signUpMutation.isSuccess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (mode === "signup") {
      formData.append("fullName", fullName);
      signUpMutation.mutate(formData);
    } else {
      loginMutation.mutate(formData);
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-[24px] md:py-[40px]">
      <div className="flex flex-col items-center gap-[36px] w-full max-w-[400px] px-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 w-full">
          <Image
            src="/icon.svg"
            width={48}
            height={48}
            className="size-12"
            alt="Square Logo"
          />

          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-balance font-bold text-2xl md:text-3xl text-foreground">
              {mode === "signin" ? "সাইন ইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
            </h1>
            <p className="text-pretty text-muted-foreground text-sm">
              {mode === "signin" ? "অ্যাকাউন্ট নেই? " : "ইতিমধ্যে অ্যাকাউন্ট আছে? "}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  loginMutation.reset();
                  signUpMutation.reset();
                }}
              >
                {mode === "signin" ? "বিনামূল্যে সাইন আপ করুন" : "সাইন ইন করুন"}
              </button>
            </p>
          </div>

          {error && (
            <div className="w-full p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
              {error.message}
            </div>
          )}

          {isSuccess ? (
            <div className="w-full flex flex-col gap-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                {mode === "signup"
                  ? "সাইন আপ সফল হয়েছে! আপনার অ্যাকাউন্ট তৈরি করা হয়েছে।"
                  : "সাইন ইন সফল হয়েছে! স্বাগতম।"}
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              {mode === "signup" && (
                <Field>
                  <div className="relative">
                    <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      className="w-full rounded-xl bg-background pl-10"
                      placeholder="আপনার নাম"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </Field>
              )}

              <Field>
                <div className="relative">
                  <Send className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    required
                    className="w-full rounded-xl bg-background pl-10"
                    placeholder="ইমেইল এড্রেস"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Field>

              <Field>
                <div className="relative">
                  <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    required
                    className="w-full rounded-xl bg-background pl-10"
                    placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Field>

              <Button
                type="submit"
                className="w-full rounded-xl mt-2 font-bold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading
                  ? "প্রসেস হচ্ছে..."
                  : mode === "signin"
                    ? "সাইন ইন করুন"
                    : "সাইন আপ করুন"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <MadeWithFooter
        madeWithText={dict.submit.madeWith}
        andText={dict.submit.and}
        className="gap-[12px] mt-auto lg:hidden pt-[48px] pb-[32px]"
      />
    </div>
  );
}
