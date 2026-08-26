"use client";

import { BatchExamsTab } from "@/components/admin/batch-exams-tab";
import { BatchMembersTab } from "@/components/admin/batch-members-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BatchDetail } from "@/types";

export function BatchDetailView({ batch }: { batch: BatchDetail }) {
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

      <Tabs defaultValue="members" className="w-full space-y-6">
        <div className="w-full border-b pb-2 overflow-x-auto no-scrollbar">
          <TabsList className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 bg-transparent p-0 h-auto min-w-max mx-auto">
            <TabsTrigger
              value="members"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] font-medium text-xs sm:text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:font-semibold transition-colors shrink-0 whitespace-nowrap"
            >
              <span>সদস্যরা</span>
              <span className="bg-primary/10 text-primary font-bold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-[6px]">
                {members.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] font-medium text-xs sm:text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:font-semibold transition-colors shrink-0 whitespace-nowrap"
            >
              <span>পরীক্ষাসমূহ</span>
              <span className="bg-muted text-muted-foreground font-bold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-[6px]">
                {batchExams.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="members">
          <BatchMembersTab batchId={batch.id} members={members} />
        </TabsContent>

        <TabsContent value="exams">
          <BatchExamsTab batchId={batch.id} batchExams={batchExams} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
