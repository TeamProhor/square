"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addMemberToBatchAction,
  assignExamToBatchAction,
  removeExamFromBatchAction,
  removeMemberFromBatchAction,
} from "@/lib/actions/batch";
import type { BatchDetail } from "@/types";

export default function BatchDetailClient({ batch }: { batch: BatchDetail }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"members" | "exams">("members");

  const [memberUserId, setMemberUserId] = useState("");
  const [examId, setExamId] = useState("");

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberUserId) return;
    await addMemberToBatchAction(batch.id, memberUserId);
    setMemberUserId("");
    router.refresh();
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm("Are you sure?")) return;
    await removeMemberFromBatchAction(memberId, batch.id);
    router.refresh();
  }

  async function handleAssignExam(e: React.FormEvent) {
    e.preventDefault();
    if (!examId) return;
    await assignExamToBatchAction(batch.id, examId);
    setExamId("");
    router.refresh();
  }

  async function handleRemoveExam(batchExamId: string) {
    if (!confirm("Are you sure?")) return;
    await removeExamFromBatchAction(batchExamId, batch.id);
    router.refresh();
  }

  // Define proper types for the populated fields to avoid TS errors mapping over user
  const members = batch.members as unknown as Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: { name: string; email: string };
  }>;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {batch.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Slug: {batch.slug} | Status: {batch.isActive ? "Active" : "Inactive"}
        </p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          className={`pb-2 font-medium px-1 border-b-2 transition-colors ${activeTab === "members" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("members")}
        >
          সদস্যরা ({batch.members?.length || 0})
        </button>
        <button
          className={`pb-2 font-medium px-1 border-b-2 transition-colors ${activeTab === "exams" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("exams")}
        >
          পরীক্ষাসমূহ ({batch.batchExams?.length || 0})
        </button>
      </div>

      {activeTab === "members" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddMember}
            className="flex gap-3 items-end p-4 border rounded-xl bg-card"
          >
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Add Member by User ID
              </label>
              <Input
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
                placeholder="Enter User ID"
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="rounded-xl">
              Add Member
            </Button>
          </form>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">User ID</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Joined At</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card">
                {members?.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3">{m.user?.name || "Unknown"}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {m.userId}
                    </td>
                    <td className="p-3 capitalize">{m.role}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveMember(m.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!members || members.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "exams" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAssignExam}
            className="flex gap-3 items-end p-4 border rounded-xl bg-card"
          >
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Assign Exam by ID</label>
              <Input
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                placeholder="Enter Exam ID"
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="rounded-xl">
              Assign Exam
            </Button>
          </form>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 font-medium">Exam Title</th>
                  <th className="p-3 font-medium">Exam ID</th>
                  <th className="p-3 font-medium">Schedule</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card">
                {batch.batchExams?.map((be) => (
                  <tr key={be.id}>
                    <td className="p-3">{be.exam?.title || "Unknown"}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {be.examId}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {be.startsAt
                        ? new Date(be.startsAt).toLocaleString()
                        : "Anytime"}{" "}
                      -{" "}
                      {be.endsAt
                        ? new Date(be.endsAt).toLocaleString()
                        : "Anytime"}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveExam(be.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!batch.batchExams || batch.batchExams.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No exams assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
