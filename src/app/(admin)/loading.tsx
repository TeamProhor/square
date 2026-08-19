"use client";

import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-3 py-12">
      <Spinner className="size-8 text-primary" />
      <span className="text-sm font-semibold text-muted-foreground animate-pulse">
        লোডিং হচ্ছে...
      </span>
    </div>
  );
}
