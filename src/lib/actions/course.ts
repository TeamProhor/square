"use server";

import { and, desc, eq, type SQL } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  courseEnrollmentRequests,
  courseEnrollments,
  courses,
} from "@/db/schema";

export async function getCourses(batch?: string) {
  let condition: SQL | undefined = eq(courses.isPublished, true);

  if (batch) {
    condition = and(condition, eq(courses.hscBatch, batch));
  }

  const results = await db.query.courses.findMany({
    where: condition,
    with: {
      details: true,
    },
  });

  return results
    .map((course) => ({
      ...course,
      ...course.details,
      features: course.details?.features || [],
    }))
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
}

export async function getCourseWithDetailsBySlug(slug: string) {
  const result = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    with: {
      details: true,
    },
  });

  return result || null;
}

export async function submitEnrollmentRequest(data: {
  userId: string;
  courseId: string;
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  amountPaid: number;
}) {
  const id = nanoid();

  await db.insert(courseEnrollmentRequests).values({
    id,
    userId: data.userId,
    courseId: data.courseId,
    paymentMethod: data.paymentMethod,
    senderNumber: data.senderNumber,
    transactionId: data.transactionId,
    amountPaid: data.amountPaid,
    status: "pending",
    createdAt: new Date(),
  });

  revalidatePath(`/courses/[slug]`, "page");
  revalidatePath(`/admin/enrollments`, "page");

  return { success: true, id };
}

export async function checkEnrollmentStatus(userId: string, courseId: string) {
  // Check if active enrollment exists
  const activeEnrollment = await db.query.courseEnrollments.findFirst({
    where: and(
      eq(courseEnrollments.userId, userId),
      eq(courseEnrollments.courseId, courseId),
      eq(courseEnrollments.status, "active"),
    ),
  });

  if (activeEnrollment)
    return { status: "active", enrollment: activeEnrollment };

  // Check if pending request exists
  const pendingRequest = await db.query.courseEnrollmentRequests.findFirst({
    where: and(
      eq(courseEnrollmentRequests.userId, userId),
      eq(courseEnrollmentRequests.courseId, courseId),
    ),
    orderBy: [desc(courseEnrollmentRequests.createdAt)],
  });

  if (pendingRequest)
    return { status: pendingRequest.status, request: pendingRequest };

  return { status: "none" };
}

export async function getUserEnrolledCourses(userId: string) {
  try {
    const enrollments = await db.query.courseEnrollments.findMany({
      where: and(
        eq(courseEnrollments.userId, userId),
        eq(courseEnrollments.status, "active"),
      ),
      orderBy: [desc(courseEnrollments.enrolledAt)],
      with: {
        course: {
          with: {
            details: true,
            batches: true,
          },
        },
      },
    });

    const activeList = enrollments
      .filter((e) => e.course !== null && e.course !== undefined)
      .map((e) => ({
        enrollmentId: e.id,
        enrolledAt: e.enrolledAt,
        status: e.status,
        ...e.course,
        details: e.course?.details,
        features: e.course?.details?.features || [],
        modules: e.course?.details?.modules || [],
        batches: e.course?.batches || [],
      }));

    return { success: true, data: activeList };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch enrolled courses",
      data: [],
    };
  }
}

export async function getUserCourseById(userId: string, courseId: string) {
  try {
    const enrollment = await db.query.courseEnrollments.findFirst({
      where: and(
        eq(courseEnrollments.userId, userId),
        eq(courseEnrollments.courseId, courseId),
        eq(courseEnrollments.status, "active"),
      ),
      with: {
        course: {
          with: {
            details: true,
            batches: {
              with: {
                batchExams: {
                  with: {
                    exam: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment || !enrollment.course) {
      return { success: false, data: null };
    }

    return {
      success: true,
      data: {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        ...enrollment.course,
        details: enrollment.course.details,
        features: enrollment.course.details?.features || [],
        modules: enrollment.course.details?.modules || [],
        instructors: enrollment.course.details?.instructors || [],
        faqs: enrollment.course.details?.faqs || [],
        batches: enrollment.course.batches || [],
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch course details",
      data: null,
    };
  }
}
