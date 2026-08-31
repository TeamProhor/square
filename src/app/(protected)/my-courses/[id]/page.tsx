import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CourseClassroomView } from "@/components/classroom/course-classroom-view";
import { getUserCourseById } from "@/lib/actions/course";
import { getBatchClassroomData } from "@/lib/actions/course-content";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyCourseClassroomPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect(`/login?callbackUrl=/my-courses/${id}`);
  }

  const [userBatch, classroomData] = await Promise.all([
    getUserCourseById(userId, id),
    getBatchClassroomData(id),
  ]);

  if (!classroomData.batch && !userBatch) {
    notFound();
  }

  const batch = userBatch || classroomData.batch;

  return (
    <CourseClassroomView
      batch={batch}
      classes={classroomData.classes}
      pdfs={classroomData.pdfs}
      exams={classroomData.exams}
    />
  );
}
