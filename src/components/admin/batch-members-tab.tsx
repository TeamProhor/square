"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  addMemberToBatchAction,
  removeMemberFromBatchAction,
} from "@/lib/actions/batch";

interface BatchMembersTabProps {
  batchId: string;
  members: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: { name: string; email: string };
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
          <label className="text-sm font-medium">
            ইউজার আইডি দিয়ে সদস্য যোগ করুন
          </label>
          <Input
            value={memberUserId}
            onChange={(e) => setMemberUserId(e.target.value)}
            placeholder="ইউজার আইডি লিখুন"
            className="rounded-xl"
          />
        </div>
        <Button
          type="submit"
          className="rounded-xl"
          disabled={isAddingMember}
        >
          {isAddingMember ? (
            <>
              <Spinner className="size-4 mr-2" /> যোগ হচ্ছে...
            </>
          ) : (
            "সদস্য যোগ করুন"
          )}
        </Button>
      </form>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">নাম</th>
              <th className="p-3 font-medium">ইউজার আইডি</th>
              <th className="p-3 font-medium">ভূমিকা</th>
              <th className="p-3 font-medium">যুক্ত হয়েছেন</th>
              <th className="p-3 font-medium text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {members?.map((m) => (
              <tr key={m.id}>
                <td className="p-3">{m.user?.name || "অজানা"}</td>
                <td className="p-3 text-muted-foreground text-xs">
                  {m.userId}
                </td>
                <td className="p-3 capitalize">{m.role}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(m.joinedAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
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
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          ডিলিট
                        </Button>
                      }
                    />
                </td>
              </tr>
            ))}
            {(!members || members.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  কোনো সদস্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
