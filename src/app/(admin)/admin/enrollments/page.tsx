import { desc, eq } from "drizzle-orm";
import { ManageEnrollmentModal } from "@/components/admin/manage-enrollment-modal";
import { Danger, User } from "@/components/icons";
import { QuickList } from "@/components/quick-list";
import { Badge } from "@/components/ui/badge";
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

  const listItems = requests.map((row) => ({
    title: `${row.user?.name} - ৳${row.request.amountPaid}`,
    description: `কোর্স: ${row.course?.title} | মেথড: ${row.request.paymentMethod.toUpperCase()}`,
    icon: <User className="size-5 md:size-6" />,
    iconBg:
      row.request.status === "pending"
        ? "bg-amber-500/10 text-amber-500"
        : row.request.status === "approved"
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-destructive/10 text-destructive",
    rightElement: (
      <div className="flex gap-2 items-center">
        <Badge
          variant={
            row.request.status === "approved"
              ? "default"
              : row.request.status === "rejected"
                ? "destructive"
                : "secondary"
          }
          className="hidden sm:inline-flex"
        >
          {row.request.status}
        </Badge>
        <ManageEnrollmentModal row={row} />
      </div>
    ),
    hideCaret: true,
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          পেমেন্ট ও এনরোলমেন্ট
        </h1>
      </div>

      <div className="mt-4">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card flex flex-col items-center gap-3">
            <Danger className="size-8 opacity-50" />
            <p>কোনো পেমেন্ট রিকোয়েস্ট নেই</p>
          </div>
        ) : (
          <QuickList items={listItems} variant="list" gap="sm" />
        )}
      </div>
    </div>
  );
}
