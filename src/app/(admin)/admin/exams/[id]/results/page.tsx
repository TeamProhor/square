import { notFound } from "next/navigation";
import { getExamResultsAdmin } from "@/lib/actions/admin-exam";

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data: submissions } = await getExamResultsAdmin(id);

  if (!success) {
    return notFound();
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">পরীক্ষার ফলাফল</h1>
        <p className="text-muted-foreground mt-1">
          Total Submissions: {submissions?.length || 0}
        </p>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">Student Name</th>
              <th className="p-3 font-medium">Score</th>
              <th className="p-3 font-medium">Time Taken</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {submissions?.map((sub: any) => (
              <tr key={sub.id}>
                <td className="p-3">{sub.user?.name || sub.userId}</td>
                <td className="p-3 font-bold">
                  {sub.score} / {sub.totalMarks}
                </td>
                <td className="p-3">{sub.timeTakenSeconds}s</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${sub.status === "submitted" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {sub.submittedAt
                    ? new Date(sub.submittedAt).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
            {(!submissions || submissions.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  কোনো ফলাফল পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
