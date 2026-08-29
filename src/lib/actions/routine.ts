"use server";

import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { batches, examRoutines, siteSettings } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Batch, CalendarSettings, ExamRoutine } from "@/types";

export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  title: "স্কয়ার এইচএসসি ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচী",
  subtitle: "এইচএসসি ও সমমান বোর্ড পরীক্ষা ২০২৬ চূড়ান্ত রুটিন",
};

export async function getCalendarSettings(): Promise<CalendarSettings> {
  try {
    const setting = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, "calendar_settings"),
    });

    if (setting?.value && typeof setting.value === "object") {
      const val = setting.value as Partial<CalendarSettings>;
      return {
        title: val.title?.trim() || DEFAULT_CALENDAR_SETTINGS.title,
        subtitle: val.subtitle?.trim() || DEFAULT_CALENDAR_SETTINGS.subtitle,
      };
    }
    return DEFAULT_CALENDAR_SETTINGS;
  } catch (error) {
    console.error("Failed to fetch calendar settings:", error);
    return DEFAULT_CALENDAR_SETTINGS;
  }
}

export async function updateCalendarSettings(
  settings: Partial<CalendarSettings>,
): Promise<{ success: boolean; data?: CalendarSettings; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    const current = await getCalendarSettings();
    const updated: CalendarSettings = {
      title: settings.title?.trim() || current.title,
      subtitle: settings.subtitle?.trim() || current.subtitle,
    };

    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, "calendar_settings"),
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          value: updated,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, "calendar_settings"));
    } else {
      await db.insert(siteSettings).values({
        key: "calendar_settings",
        value: updated,
        updatedAt: new Date(),
      });
    }

    revalidatePath("/calendar");
    revalidatePath("/print/calendar");
    revalidatePath("/admin/exams/routines");
    revalidatePath("/admin/exams");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Failed to update calendar settings:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ক্যালেন্ডার সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।",
    };
  }
}

export interface CreateRoutinePayload {
  batchId: string;
  title: string;
  subject: string;
  syllabus?: string;
  examDate: string;
  durationMinutes?: number;
  totalMarks?: number;
}

export async function getBatches(): Promise<Batch[]> {
  try {
    return (await db
      .select()
      .from(batches)
      .orderBy(desc(batches.createdAt))) as unknown as Batch[];
  } catch (error) {
    console.error("Error fetching batches:", error);
    return [];
  }
}

export async function getExamRoutines(
  batchId?: string,
): Promise<ExamRoutine[]> {
  try {
    const query = db.select().from(examRoutines);
    if (batchId && batchId !== "all") {
      return (await query
        .where(eq(examRoutines.batchId, batchId))
        .orderBy(asc(examRoutines.examDate))) as ExamRoutine[];
    }
    return (await query.orderBy(asc(examRoutines.examDate))) as ExamRoutine[];
  } catch (error) {
    console.error("Error fetching exam routines:", error);
    return [];
  }
}

export async function createExamRoutine(
  payload: CreateRoutinePayload,
): Promise<{ success: boolean; data?: ExamRoutine; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    if (
      !payload.title?.trim() ||
      !payload.subject?.trim() ||
      !payload.examDate?.trim()
    ) {
      return { success: false, message: "পরীক্ষার নাম, বিষয় এবং তারিখ আবশ্যক।" };
    }

    // Ensure batch exists, or create default HSC 2026 batch
    let finalBatchId = payload.batchId;
    if (!finalBatchId) {
      let defaultBatch = await db.query.batches.findFirst({
        where: (b, { eq }) => eq(b.slug, "hsc-2026"),
      });

      if (!defaultBatch) {
        const [newB] = await db
          .insert(batches)
          .values({
            name: "HSC 2026 ব্যাচ",
            slug: "hsc-2026",
            description: "HSC 2026 মূল ব্যাচ",
            hscBatch: "HSC 26",
            price: 0,
            image: "",
          })
          .returning();
        defaultBatch = newB;
      }
      finalBatchId = defaultBatch.id;
    }

    const [newRoutine] = await db
      .insert(examRoutines)
      .values({
        batchId: finalBatchId,
        title: payload.title.trim(),
        subject: payload.subject.trim(),
        syllabus: payload.syllabus?.trim() || null,
        examDate: new Date(payload.examDate.trim()),
        durationMinutes: payload.durationMinutes || 30,
        totalMarks: payload.totalMarks || 25,
      })
      .returning();

    revalidatePath("/calendar");
    revalidatePath("/print/calendar");
    revalidatePath("/admin/exams/routines");
    revalidatePath("/admin/exams");

    return { success: true, data: newRoutine as ExamRoutine };
  } catch (error: unknown) {
    console.error("Error creating exam routine:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "রুটিন যুক্ত করতে ব্যর্থ হয়েছে।",
    };
  }
}

export async function deleteExamRoutine(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    if (!id) {
      return { success: false, message: "রুটিন আইডি আবশ্যক।" };
    }

    await db.delete(examRoutines).where(eq(examRoutines.id, id));

    revalidatePath("/calendar");
    revalidatePath("/print/calendar");
    revalidatePath("/admin/exams/routines");
    revalidatePath("/admin/exams");

    return { success: true, message: "রুটিন সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error: unknown) {
    console.error("Error deleting exam routine:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "রুটিন মুছতে ব্যর্থ হয়েছে।",
    };
  }
}

export async function seedDemoRoutines(
  type: "hsc" | "admission" = "hsc",
): Promise<{ success: boolean; count: number; message?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        count: 0,
        message: "অনুমতি নেই। শুধুমাত্র এডমিন এক্সেস প্রয়োজন।",
      };
    }

    const batchSlug = type === "hsc" ? "hsc-2026" : "admission-2026";
    let defaultBatch = await db.query.batches.findFirst({
      where: (b, { eq }) => eq(b.slug, batchSlug),
    });

    if (!defaultBatch) {
      const [newB] = await db
        .insert(batches)
        .values({
          name: type === "hsc" ? "HSC 2026 ব্যাচ" : "ভার্সিটি এডমিশন ২০২৬",
          slug: batchSlug,
          description:
            type === "hsc"
              ? "HSC 2026 মূল ব্যাচ"
              : "ইঞ্জিনিয়ারিং ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ব্যাচ",
          hscBatch: type === "hsc" ? "HSC 26" : "Admission 26",
          price: 0,
          image: "",
        })
        .returning();
      defaultBatch = newB;
    }

    const demoHsc = [
      {
        title: "বাংলা ১ম পত্র চূড়ান্ত পরীক্ষা",
        subject: "বাংলা ১ম পত্র",
        syllabus: "সম্পূর্ণ সিলেবাস (গদ্য ও পদ্য)",
        examDate: new Date("2026-06-21T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
      {
        title: "বাংলা ২য় পত্র চূড়ান্ত পরীক্ষা",
        subject: "বাংলা ২য় পত্র",
        syllabus: "ব্যাকরণ ও নির্মিতি অংশ",
        examDate: new Date("2026-06-23T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
      {
        title: "ইংরেজি ১ম পত্র চূড়ান্ত পরীক্ষা",
        subject: "ইংরেজি ১ম পত্র",
        syllabus: "Full Syllabus & Reading Comprehension",
        examDate: new Date("2026-06-25T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
      {
        title: "ইংরেজি ২য় পত্র চূড়ান্ত পরীক্ষা",
        subject: "ইংরেজি ২য় পত্র",
        syllabus: "Grammar Items & Guided Writing",
        examDate: new Date("2026-06-27T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
      {
        title: "তথ্য ও যোগাযোগ প্রযুক্তি",
        subject: "আইসিটি (ICT)",
        syllabus: "অধ্যায় ১-৫ পূর্ণাঙ্গ সিলেবাস",
        examDate: new Date("2026-06-30T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
      {
        title: "পদার্থবিজ্ঞান ১ম পত্র চূড়ান্ত পরীক্ষা",
        subject: "পদার্থবিজ্ঞান ১ম পত্র",
        syllabus: "ভেক্টর, গতিবিদ্যা, নিউটনিয়ান বলবিদ্যা ও কাজ-শক্তি",
        examDate: new Date("2026-07-02T10:00:00.000Z"),
        durationMinutes: 180,
        totalMarks: 100,
      },
    ];

    const demoAdmission = [
      {
        title: "বুয়েট প্রাথমিক প্রিলিমিনারি পরীক্ষা",
        subject: "বুয়েট প্রিলিমিনারি টেস্ট",
        syllabus: "পদার্থবিজ্ঞান, রসায়ন ও উচ্চতর গণিত",
        examDate: new Date("2026-10-15T10:00:00.000Z"),
        durationMinutes: 60,
        totalMarks: 100,
      },
      {
        title: "ঢাকা বিশ্ববিদ্যালয় 'ক' ইউনিট ভর্তি পরীক্ষা",
        subject: "ঢাবি ক-ইউনিট বিজ্ঞান",
        syllabus: "ফিজিক্স, কেমিস্ট্রি, ম্যাথ, বায়োলজি",
        examDate: new Date("2026-10-24T10:00:00.000Z"),
        durationMinutes: 90,
        totalMarks: 120,
      },
      {
        title: "চুয়েট, কুয়েট, রুয়েট সমন্বিত ভর্তি পরীক্ষা",
        subject: "ইঞ্জিনিয়ারিং গুচ্ছ ভর্তি পরীক্ষা",
        syllabus: "উচ্চতর গণিত, পদার্থবিজ্ঞান, রসায়ন ও ইংরেজি",
        examDate: new Date("2026-11-07T10:00:00.000Z"),
        durationMinutes: 150,
        totalMarks: 500,
      },
      {
        title: "জিএসটি (GST) সাধারণ ও বিজ্ঞান প্রযুক্তি গুচ্ছ",
        subject: "জিএসটি সমন্বিত বিজ্ঞান পরীক্ষা",
        syllabus: "বিজ্ঞান শাখা পূর্ণাঙ্গ সিলেবাস",
        examDate: new Date("2026-11-21T11:00:00.000Z"),
        durationMinutes: 60,
        totalMarks: 100,
      },
    ];

    const listToInsert = type === "hsc" ? demoHsc : demoAdmission;

    for (const item of listToInsert) {
      await db.insert(examRoutines).values({
        batchId: defaultBatch.id,
        title: item.title,
        subject: item.subject,
        syllabus: item.syllabus,
        examDate: item.examDate,
        durationMinutes: item.durationMinutes,
        totalMarks: item.totalMarks,
      });
    }

    revalidatePath("/calendar");
    revalidatePath("/print/calendar");
    revalidatePath("/admin/exams/routines");
    revalidatePath("/admin/exams");

    return { success: true, count: listToInsert.length };
  } catch (error: unknown) {
    console.error("Error seeding routines:", error);
    return {
      success: false,
      count: 0,
      message:
        error instanceof Error ? error.message : "ডেমো রুটিন যুক্ত করতে ব্যর্থ হয়েছে।",
    };
  }
}
