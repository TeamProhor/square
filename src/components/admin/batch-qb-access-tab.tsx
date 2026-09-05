"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Lock, SecurityCard, TaskSquare, TickCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getBatchQbAccess,
  setBatchQbAccess,
  toggleBatchContainerAccess,
} from "@/lib/actions/qb-access";

interface ContainerItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  isPublic?: boolean;
}

export function BatchQbAccessTab({
  batchId,
  allContainers = [],
}: {
  batchId: string;
  allContainers: ContainerItem[];
}) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [togglingContainerId, setTogglingContainerId] = useState<string | null>(null);

  const { data: initialAccess = [], isLoading } = useQuery<string[]>({
    queryKey: ["batch-qb-access", batchId],
    queryFn: () => getBatchQbAccess(batchId),
  });

  useEffect(() => {
    if (initialAccess) {
      setSelectedIds(initialAccess);
    }
  }, [initialAccess]);

  const saveMutation = useMutation({
    mutationFn: async (containerIds: string[]) => {
      const res = await setBatchQbAccess(batchId, containerIds);
      if (!res.success) throw new Error(res.message || "Failed to update access");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-qb-access", batchId] });
      setHasChanges(false);
      setSaveSuccess(true);
      toast.success("সকল পরিবর্তন সফলভাবে সংরক্ষিত ও কার্যকর হয়েছে");
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err) => {
      toast.error(err.message || "অ্যাক্সেস আপডেট করতে সমস্যা হয়েছে");
    },
  });

  const handleToggle = async (containerId: string) => {
    const isCurrentlyAssigned = selectedIds.includes(containerId);
    const nextState = !isCurrentlyAssigned;
    const updated = nextState
      ? [...selectedIds, containerId]
      : selectedIds.filter((id) => id !== containerId);

    // Optimistic update
    setSelectedIds(updated);
    setTogglingContainerId(containerId);

    try {
      const res = await toggleBatchContainerAccess(batchId, containerId, nextState);
      if (!res.success) {
        // Rollback
        setSelectedIds(selectedIds);
        toast.error(res.message || "অ্যাক্সেস পরিবর্তন করা যায়নি");
      } else {
        queryClient.invalidateQueries({ queryKey: ["batch-qb-access", batchId] });
        toast.success(
          nextState
            ? "প্রশ্নব্যাংক এক্সেস সফলভাবে চালু করা হয়েছে"
            : "প্রশ্নব্যাংক এক্সেস সফলভাবে বন্ধ করা হয়েছে",
        );
      }
    } catch {
      setSelectedIds(selectedIds);
      toast.error("সার্ভার ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setTogglingContainerId(null);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(selectedIds);
  };

  const handleSelectAll = () => {
    const allIds = allContainers.map((c) => c.id);
    setSelectedIds(allIds);
    setHasChanges(true);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <SecurityCard className="size-5 text-primary" />
            প্রশ্নব্যাংক অ্যাক্সেস পারমিশন ({selectedIds.length}/{allContainers.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            এই ব্যাচে এনরোল করা শিক্ষার্থীরা শুধুমাত্র টিক দেওয়া প্রশ্নব্যাংকগুলোর প্রিমিয়াম প্রশ্ন অনুশীলন করতে পারবে।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs rounded-xl h-9"
          >
            সব সিলেক্ট
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="text-xs rounded-xl h-9"
          >
            ক্লিয়ার
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || !hasChanges}
            className="rounded-xl shadow-xs text-xs font-bold h-9 px-5 cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <Spinner className="mr-1.5" /> সংরক্ষণ হচ্ছে...
              </>
            ) : (
              "পরিবর্তন সংরক্ষণ করুন"
            )}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <TickCircle className="size-4 shrink-0" />
          প্রশ্নব্যাংক অ্যাক্সেস সফলভাবে আপডেট ও কার্যকর করা হয়েছে!
        </div>
      )}

      {/* Containers List */}
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center">
          <Spinner className="size-8 text-primary mb-3" />
          <p className="text-sm text-muted-foreground">অ্যাক্সেস লোড হচ্ছে...</p>
        </div>
      ) : allContainers.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl bg-muted/10">
          কোনো প্রশ্নব্যাংক তৈরি করা নেই।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allContainers.map((container) => {
            const isAssigned = selectedIds.includes(container.id);

            return (
              <div
                key={container.id}
                onClick={() => handleToggle(container.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isAssigned
                    ? "bg-primary/5 border-primary shadow-xs"
                    : "bg-card border-border/70 hover:border-border"
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        container.isPublic
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border/60"
                      }`}
                    >
                      {container.isPublic ? "🌐 সবার জন্য উন্মুক্ত (Public)" : "🔒 ব্যাচ নিয়ন্ত্রিত"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base leading-snug">
                    {container.title}
                  </h3>

                  {container.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {container.description}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {togglingContainerId === container.id && (
                    <Spinner className="size-3.5 text-primary" />
                  )}
                  <Switch
                    checked={isAssigned}
                    disabled={togglingContainerId === container.id}
                    onCheckedChange={() => handleToggle(container.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
