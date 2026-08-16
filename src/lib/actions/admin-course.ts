"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courseDetails, courses } from "@/db/schema";

export async function createCourse(formData: FormData) {
  const id = nanoid();
  const slug = formData.get("slug") as string;

  await db.transaction(async (tx) => {
    // 1. Create base course
    await tx.insert(courses).values({
      id,
      title: formData.get("title") as string,
      slug,
      hscBatch: formData.get("hscBatch") as string,
      price: parseInt(formData.get("price") as string, 10),
      originalPrice:
        parseInt(formData.get("originalPrice") as string, 10) || null,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Create empty course details to satisfy the 1-to-1 relationship mapping
    await tx.insert(courseDetails).values({
      id: nanoid(),
      courseId: id,
      features: [],
      instructors: [],
      modules: [],
      faqs: [],
    });
  });
}

export async function deleteCourse(courseId: string) {
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/admin/courses");
}

export async function updateCourse(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const originalPriceRaw = formData.get("originalPrice") as string;

  await db
    .update(courses)
    .set({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      hscBatch: formData.get("hscBatch") as string,
      price: parseInt(formData.get("price") as string, 10),
      originalPrice: originalPriceRaw ? parseInt(originalPriceRaw, 10) : null,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId));

  revalidatePath("/admin/courses");
}
