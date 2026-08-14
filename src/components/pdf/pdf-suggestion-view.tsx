"use client";

import { useState } from "react";
import {
  ArrowRight2,
  Download,
  Export,
  FileDown,
  FileText,
  Flash,
  Lock,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function PdfSuggestionView() {
  const [subject, setSubject] = useState("physics");
  const [paper, setPaper] = useState("1st");
  const [chapter, setChapter] = useState("");
  const [standard, setStandard] = useState("board");

  const [isLoading, setIsLoading] = useState(false);

  const pdfUrl = "";
  const filename = `File_${standard === "board" ? "Board" : "Admission"}_Suggestion.pdf`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto mt-2">
      {/* Left Column: Controls */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-muted/30">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              ফিল্টার সাজেশন
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              আপনার প্রয়োজনীয় টপিক নির্বাচন করুন
            </p>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Item */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                ১. বিষয়
              </span>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full h-10 bg-background shadow-sm border-muted-foreground/20">
                  <SelectValue placeholder="বিষয় সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="physics">পদার্থবিজ্ঞান (Physics)</SelectItem>
                    <SelectItem value="chemistry">রসায়ন (Chemistry)</SelectItem>
                    <SelectItem value="math">
                      উচ্চতর গণিত (Higher Math)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Paper */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                ২. পত্র
              </span>
              <ToggleGroup
                type="single"
                value={paper}
                onValueChange={(v) => v && setPaper(v)}
                className="w-full h-10 p-1 bg-muted/40 rounded-lg border border-transparent hover:border-border transition-colors"
              >
                <ToggleGroupItem
                  value="1st"
                  className="flex-1 rounded-md text-sm font-medium"
                >
                  ১ম পত্র
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="2nd"
                  className="flex-1 rounded-md text-sm font-medium"
                >
                  ২য় পত্র
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Subitem */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                ৩. অধ্যায়
              </span>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="w-full h-10 bg-background shadow-sm border-muted-foreground/20">
                  <SelectValue placeholder="অধ্যায় সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="ch1">অধ্যায় ১</SelectItem>
                    <SelectItem value="ch2">অধ্যায় ২</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Standard */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                ৪. ক্যাটাগরি
              </span>
              <ToggleGroup
                type="single"
                value={standard}
                onValueChange={(v) => v && setStandard(v)}
                className="w-full h-10 p-1 bg-muted/40 rounded-lg border border-transparent hover:border-border transition-colors"
              >
                <ToggleGroupItem
                  value="board"
                  className="flex-1 rounded-md text-xs font-medium"
                >
                  বোর্ড স্ট্যান্ডার্ড
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="admission"
                  className="flex-1 rounded-md text-xs font-medium"
                >
                  এডমিশন স্ট্যান্ডার্ড
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Additional Help Widget */}
        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
            <Flash className="size-24" />
          </div>
          <h4 className="font-bold text-primary flex items-center gap-1.5 mb-2 relative z-10 text-sm">
            <Flash className="size-4" /> প্রো-টিপস
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
            বোর্ড পরীক্ষার জন্য 'বোর্ড' এবং ভার্সিটির জন্য 'এডমিশন' স্ট্যান্ডার্ড পিডিএফগুলো
            পড়ুন। প্রতিটি সাজেশন বিগত ৩ বছরের প্রশ্ন অ্যানালাইসিস করে তৈরি।
          </p>
        </div>
      </div>

      {/* Right Column: PDF Viewer */}
      <div className="flex-1 flex flex-col">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col h-[550px] lg:h-[calc(100vh-160px)] lg:min-h-[650px]">
          {/* Viewer Header */}
          <div className="h-14 bg-muted/30 border-b px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex gap-1.5 shrink-0 hidden sm:flex">
                <div className="size-3 rounded-full bg-destructive/80 shadow-sm" />
                <div className="size-3 rounded-full bg-amber-500/80 shadow-sm" />
                <div className="size-3 rounded-full bg-green-500/80 shadow-sm" />
              </div>
              <div className="h-4 w-px bg-border hidden sm:block mx-1" />
              <Badge
                variant="outline"
                className="font-mono text-[10px] sm:text-xs truncate max-w-[150px] sm:max-w-xs font-medium bg-background/50"
              >
                {filename}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <a
                  href={pdfUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Export className="size-3.5" />{" "}
                  <span className="hidden sm:inline">ওপেন</span>
                </a>
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <a
                  href={pdfUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="size-3.5" />{" "}
                  <span className="hidden sm:inline">ডাউনলোড</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Viewer Body */}
          <div className="flex-1 relative bg-muted/10 flex flex-col">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                <div className="size-10 border-[3px] border-muted border-t-primary rounded-full animate-spin mb-3 shadow-sm" />
                <p className="text-sm font-bold text-foreground">
                  ফাইল লোড হচ্ছে...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  দয়া করে অপেক্ষা করুন
                </p>
              </div>
            )}

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Suggestion Viewer"
                className="w-full h-full border-none"
                allow="autoplay"
                sandbox="allow-scripts"
                onLoad={() => setIsLoading(false)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-5 border border-primary/10 relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
                  <FileDown className="size-8 text-primary/40 relative z-10" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  ফাইল সিলেক্ট করা হয়নি
                </h3>
                <p className="text-sm text-muted-foreground max-w-[260px] mt-2">
                  বামপাশের প্যানেল থেকে বিষয় এবং অধ্যায় নির্বাচন করলে এখানে প্রিভিউ দেখতে
                  পাবেন।
                </p>
              </div>
            )}
          </div>

          {/* Viewer Footer */}
          <div className="h-10 bg-muted/40 border-t px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <Lock className="size-3 text-emerald-500" />
              <span>সিকিউরড পিডিএফ ভিউয়ার</span>
            </div>
            <a
              href={pdfUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium group"
            >
              ব্রাউজার ব্লক করলে এখানে ক্লিক করুন
              <ArrowRight2 className="size-3 transform group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
