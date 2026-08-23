"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface SliderItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  link?: string;
}

const DEFAULT_SLIDERS: SliderItem[] = [
  {
    id: "slide-1",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 1",
    title: "স্কয়ার এডুকেশন প্ল্যাটফর্ম",
  },
  {
    id: "slide-2",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 2",
    title: "অনলাইন প্র্যাকটিস ও পূর্ণাঙ্গ মডেল টেস্ট",
  },
  {
    id: "slide-3",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 3",
    title: "সেরা মেন্টরদের সাথে প্রস্তুতি",
  },
];

export async function getHeroSliders(): Promise<SliderItem[]> {
  try {
    const setting = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, "hero_sliders"),
    });

    if (setting?.value && Array.isArray(setting.value)) {
      return setting.value as SliderItem[];
    }
    return DEFAULT_SLIDERS;
  } catch (error) {
    console.error("Failed to fetch hero sliders:", error);
    return DEFAULT_SLIDERS;
  }
}

export async function updateHeroSliders(sliders: SliderItem[]) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role !== "admin") {
      return {
        success: false,
        error: "অননুমোদিত অ্যাক্সেস। শুধুমাত্র অ্যাডমিনরা স্লাইডার পরিবর্তন করতে পারবেন।",
      };
    }

    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, "hero_sliders"),
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          value: sliders,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, "hero_sliders"));
    } else {
      await db.insert(siteSettings).values({
        key: "hero_sliders",
        value: sliders,
        updatedAt: new Date(),
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/sliders");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "স্লাইডার আপডেট করতে সমস্যা হয়েছে",
    };
  }
}
