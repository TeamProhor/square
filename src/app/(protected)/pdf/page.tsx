"use client";

import { Warning } from "@/components/icons";
import { PdfSuggestionView } from "@/components/pdf/pdf-suggestion-view";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function PDFSuggestionsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-7xl mx-auto w-full gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <Alert className="max-w-sm border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Warning className="size-4 text-amber-500" />
          <AlertTitle>পিডিএফ লোড না হলে সরাসরি ভিউ বাটনে ক্লিক করুন।</AlertTitle>
        </Alert>
      </div>

      <PdfSuggestionView />
    </div>
  );
}
