"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  assignExamToBatchAction,
  removeExamFromBatchAction,
} from "@/lib/actions/batch";

interface BatchExamsTabProps {
  batchId: string;
  batchExams: any[];
}

export function BatchExamsTab({ batchId, batchExams }: BatchExamsTabProps) {
  const router = useRouter();
  const [examId, setExamId] = useState("");
  const [isAssigningExam, setIsAssigningExam] = useState(false);

  async function handleAssignExam(e: React.FormEvent) {
    e.preventDefault();
    if (!examId) return;
    setIsAssigningExam(true);
    try {
      await assignExamToBatchAction(batchId, examId);
      setExamId("");
      router.refresh();
    } finally {
      setIsAssigningExam(false);
    }
  }



  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAssignExam}
        className="flex gap-3 items-end p-4 border rounded-xl bg-card"
      >
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">
            পরীক্ষার আইডি দিয়ে যুক্ত করুন
          </label>
          <Input
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            placeholder="পরীক্ষার আইডি লিখুন"
            className="rounded-xl"
          />
        </div>
        <Button
          type="submit"
          className="rounded-xl"
          disabled={isAssigningExam}
        >
          {isAssigningExam ? (
            <>
              <Spinner className="size-4 mr-2" /> যুক্ত হচ্ছে...
            </>
          ) : (
            "পরীক্ষা যুক্ত করুন"
          )}
        </Button>
      </form>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">পরীক্ষার নাম</th>
              <th className="p-3 font-medium">পরীক্ষা আইডি</th>
              <th className="p-3 font-medium">সময়সূচি</th>
              <th className="p-3 font-medium text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {batchExams?.map((be) => (
              <tr key={be.id}>
                <td className="p-3">{be.exam?.title || "অজানা"}</td>
                <td className="p-3 text-muted-foreground text-xs">
                  {be.examId}
                </td>
                <td className="p-3 text-muted-foreground text-xs">
                  {be.startsAt
                    ? new Date(be.startsAt).toLocaleString()
                    : "যেকোনো সময়"}{" "}
                  -{" "}
                  {be.endsAt
                    ? new Date(be.endsAt).toLocaleString()
                    : "যেকোনো সময়"}
                </td>
                <td className="p-3 text-right">
                    <DeleteConfirmDialog
                      title="পরীক্ষা ডিলিট নিশ্চিতকরণ"
                      description={`আপনি কি নিশ্চিত এই ব্যাচ থেকে "${be.exam?.title || "পরীক্ষা"}" ডিলিট করতে চান?`}
                      onConfirm={async () => {
                        await removeExamFromBatchAction(be.id, batchId);
                        router.refresh();
                      }}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          ডিলিট
                        </Button>
                      }
                    />
                </td>
              </tr>
            ))}
            {(!batchExams || batchExams.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-muted-foreground"
                >
                  কোনো পরীক্ষা যুক্ত করা হয়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
