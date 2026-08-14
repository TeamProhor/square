"use client";

import { DocumentDownload, Warning } from "@/components/icons";
import { PdfSuggestionView } from "@/components/pdf/pdf-suggestion-view";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function PDFSuggestionsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-7xl mx-auto w-full gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <DocumentDownload className="size-7 text-destructive" />{" "}
            চ্যাপ্টার-ভিত্তিক স্পেশাল সাজেশন পিডিএফ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            আপনার প্রয়োজনীয় বিষয়, পত্র ও অধ্যায় সিলেক্ট করে সম্পূর্ণ সাজানো পিডিএফ ডাউনলোড বা
            প্রিভিউ করুন।
          </p>
        </div>
        <Alert className="max-w-sm border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Warning className="size-4 text-amber-500" />
          <AlertTitle>পিডিএফ লোড না হলে সরাসরি ভিউ বাটনে ক্লিক করুন।</AlertTitle>
        </Alert>
      </div>

      <PdfSuggestionView />
    </div>
  );
}
