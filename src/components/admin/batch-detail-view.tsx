"use client";

import { useState } from "react";
import { BatchExamsTab } from "@/components/admin/batch-exams-tab";
import { BatchMembersTab } from "@/components/admin/batch-members-tab";
import type { BatchDetail } from "@/types";

export function BatchDetailView({ batch }: { batch: BatchDetail }) {
  const [activeTab, setActiveTab] = useState<"members" | "exams">("members");

  const members = (batch.members || []) as unknown as Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: { name: string; email: string };
  }>;

  const batchExams = batch.batchExams || [];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-12 pt-2 md:py-8 gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {batch.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          স্লাগ: {batch.slug} | স্ট্যাটাস: {batch.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          type="button"
          className={`pb-2 font-medium px-1 border-b-2 transition-colors ${
            activeTab === "members"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("members")}
        >
          সদস্যরা ({members.length})
        </button>
        <button
          type="button"
          className={`pb-2 font-medium px-1 border-b-2 transition-colors ${
            activeTab === "exams"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("exams")}
        >
          পরীক্ষাসমূহ ({batchExams.length})
        </button>
      </div>

      {activeTab === "members" ? (
        <BatchMembersTab batchId={batch.id} members={members} />
      ) : (
        <BatchExamsTab batchId={batch.id} batchExams={batchExams} />
      )}
    </div>
  );
}
