import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { AddCourseModal } from "@/components/admin/add-course-modal";
import { EditCourseModal } from "@/components/admin/edit-course-modal";
import { BookOpen, Trash2 } from "@/components/icons";
import { QuickList } from "@/components/quick-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { deleteCourse } from "@/lib/actions/admin-course";

export const dynamic = "force-dynamic";

async function togglePublish(formData: FormData) {
  "use server";
  const courseId = formData.get("courseId") as string;
  const currentStatus = formData.get("currentStatus") === "true";

  await db
    .update(courses)
    .set({ isPublished: !currentStatus })
    .where(eq(courses.id, courseId));

  revalidatePath("/admin/courses");
}

async function handleDelete(formData: FormData) {
  "use server";
  const courseId = formData.get("courseId") as string;
  await deleteCourse(courseId);
}

export default async function AdminCoursesPage() {
  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(desc(courses.createdAt));

  const listItems = allCourses.map((course) => ({
    title: course.title,
    description: `ব্যাচ: ${course.hscBatch} | ফি: ৳${course.price}`,
    icon: <BookOpen className="size-5 md:size-6" />,
    iconBg: course.isPublished
      ? "bg-primary/10 text-primary"
      : "bg-muted text-muted-foreground",
    rightElement: (
      <div className="flex justify-end gap-2 items-center">
        <form action={togglePublish}>
          <input type="hidden" name="courseId" value={course.id} />
          <input
            type="hidden"
            name="currentStatus"
            value={course.isPublished ? "true" : "false"}
          />
          <Badge
            variant={course.isPublished ? "default" : "secondary"}
            className="cursor-pointer"
          >
            <button type="submit" className="outline-none">
              {course.isPublished ? "পাবলিশড" : "ড্রাফট"}
            </button>
          </Badge>
        </form>
        <EditCourseModal course={course} />
        <form action={handleDelete}>
          <input type="hidden" name="courseId" value={course.id} />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </form>
      </div>
    ),
    hideCaret: true,
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">ম্যানেজ কোর্সেস</h1>
        <AddCourseModal />
      </div>

      <div className="mt-4">
        {allCourses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
            কোনো কোর্স পাওয়া যায়নি
          </div>
        ) : (
          <QuickList items={listItems} variant="list" gap="md" />
        )}
      </div>
    </div>
  );
}
