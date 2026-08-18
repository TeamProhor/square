import { desc, eq } from "drizzle-orm";
import { EnrollmentRequestsList } from "@/components/admin/enrollment-requests-list";
import { db } from "@/db";
import { courseEnrollmentRequests, courses, user } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const requests = await db
    .select({
      request: courseEnrollmentRequests,
      user: {
        name: user.name,
        email: user.email,
      },
      course: {
        title: courses.title,
        hscBatch: courses.hscBatch,
      },
    })
    .from(courseEnrollmentRequests)
    .leftJoin(user, eq(courseEnrollmentRequests.userId, user.id))
    .leftJoin(courses, eq(courseEnrollmentRequests.courseId, courses.id))
    .orderBy(desc(courseEnrollmentRequests.createdAt));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          পেমেন্ট ও এনরোলমেন্ট
        </h1>
      </div>

      <EnrollmentRequestsList requests={requests} />
    </div>
  );
}
