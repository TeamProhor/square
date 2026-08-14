"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function loginWithPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন" };
  }

  try {
    const res = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    if (!res) {
      return { error: "ভুল ইমেইল অথবা পাসওয়ার্ড" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "লগইন ব্যর্থ হয়েছে" };
  }
}

export async function signUpWithPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন" };
  }

  if (password.length < 6) {
    return { error: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" };
  }

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName || email.split("@")[0],
      },
      headers: await headers(),
    });

    if (!res) {
      return { error: "সাইন আপ ব্যর্থ হয়েছে" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "সাইন আপ ব্যর্থ হয়েছে" };
  }
}

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUserAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) return null;

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as any).role || "student",
      image: session.user.image,
      profile: session.user,
    };
  } catch {
    return null;
  }
}
