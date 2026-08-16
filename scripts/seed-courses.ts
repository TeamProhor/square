import { nanoid } from "nanoid"; // assuming nanoid is used
import { db } from "@/db";
import { courseDetails, courses } from "@/db/schema";
import { COURSES } from "@/lib/courses";

async function main() {
  console.log("Seeding courses...");

  for (const course of COURSES) {
    const courseId = nanoid();

    // Insert course
    await db.insert(courses).values({
      id: courseId,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || null,
      description: course.description,
      hscBatch: course.hscBatch,
      price: course.price,
      originalPrice: course.originalPrice || null,
      image: course.image,
      badge: course.badge || null,
      isPublished: true,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert course details
    await db.insert(courseDetails).values({
      id: nanoid(),
      courseId: courseId,
      features: course.features as string[],
      modules: course.modules as unknown[],
      faqs: course.faqs as unknown[],
      instructors: course.instructors as unknown[],
    } as typeof courseDetails.$inferInsert);

    console.log(`Inserted course: ${course.title}`);
  }

  console.log("Seeding completed!");
}

main().catch((err) => {
  console.error("Error seeding courses:", err);
  process.exit(1);
});
