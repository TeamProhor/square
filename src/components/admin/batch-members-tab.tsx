"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ManageEnrollmentModal } from "@/components/admin/manage-enrollment-modal";
import { QuickList } from "@/components/admin/quick-list";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  addMemberToBatchAction,
  removeMemberFromBatchAction,
} from "@/lib/actions/batch";

interface EnrollmentRequestData {
  request: {
    id: string;
    batchId: string;
    userId: string;
    status: string | null;
    paymentMethod: string;
    amount: number;
    transactionId: string | null;
    senderNumber: string | null;
  };
  user: { name: string | null; email: string } | null;
  course: { title: string; hscBatch: string } | null;
}

interface BatchMembersTabProps {
  batchId: string;
  members: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: { name: string; email: string };
    enrollmentRequest?: EnrollmentRequestData | null;
  }>;
}

export function BatchMembersTab({ batchId, members }: BatchMembersTabProps) {
  const router = useRouter();
  const [memberUserId, setMemberUserId] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberUserId) return;
    setIsAddingMember(true);
    try {
      await addMemberToBatchAction(batchId, memberUserId);
      setMemberUserId("");
      router.refresh();
    } finally {
      setIsAddingMember(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAddMember}
        className="flex gap-3 items-end p-4 border rounded-xl bg-card"
      >
        <div className="flex-1 space-y-2">
          <label htmlFor="memberUserId" className="text-sm font-medium">
            ইউজার আইডি দিয়ে সদস্য যোগ করুন
          </label>
          <Input
            id="memberUserId"
            value={memberUserId}
            onChange={(e) => setMemberUserId(e.target.value)}
            placeholder="ইউজার আইডি লিখুন"
            className="rounded-xl"
          />
        </div>
        <Button type="submit" className="rounded-xl" disabled={isAddingMember}>
          {isAddingMember ? (
            <>
              <Spinner className="size-4 mr-2" /> যোগ হচ্ছে...
            </>
          ) : (
            "সদস্য যোগ করুন"
          )}
        </Button>
      </form>

      <div className="mt-4">
        {!members || members.length === 0 ? (
          <div className="py-12 text-center border border-dashed rounded-xl text-muted-foreground bg-card">
            কোনো সদস্য পাওয়া যায়নি।
          </div>
        ) : (
          <QuickList
            items={members.map((m) => ({
              title: m.user?.name || "অজানা",
              description: `${m.user?.email || ""} • ভূমিকা: ${m.role}`,
              icon: () => (
                <div className="flex items-center justify-center size-10 bg-primary/10 rounded-xl text-primary font-bold text-sm">
                  {m.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              ),
              rightElement: (
                <div className="flex items-center gap-1">
                  {m.enrollmentRequest && (
                    <ManageEnrollmentModal row={m.enrollmentRequest} />
                  )}
                  <DeleteConfirmDialog
                    title="সদস্য ডিলিট নিশ্চিতকরণ"
                    description={`আপনি কি নিশ্চিত এই ব্যাচ থেকে "${m.user?.name || "সদস্য"}" কে ডিলিট করতে চান?`}
                    onConfirm={async () => {
                      await removeMemberFromBatchAction(m.id, batchId);
                      router.refresh();
                    }}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg text-xs"
                      >
                        ডিলিট
                      </Button>
                    }
                  />
                </div>
              ),
            }))}
            columns={{ sm: 1, md: 2 }}
            gap="md"
          />
        )}
      </div>
    </div>
  );
}
