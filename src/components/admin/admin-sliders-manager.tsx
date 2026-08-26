"use client";

import Image from "next/image";
import { useState } from "react";
import { Add, Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SliderItem, updateHeroSliders } from "@/lib/actions/settings";

export function AdminSlidersManager({
  initialSliders,
}: {
  initialSliders: SliderItem[];
}) {
  const [sliders, setSliders] = useState<SliderItem[]>(initialSliders);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddSlide = () => {
    const newSlide: SliderItem = {
      id: `slide-${Date.now()}`,
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      alt: `Poster ${sliders.length + 1}`,
      link: "",
    };
    setSliders([...sliders, newSlide]);
  };

  const handleRemoveSlide = (index: number) => {
    setSliders(sliders.filter((_, i) => i !== index));
  };

  const handleUpdateSlide = (
    index: number,
    field: keyof SliderItem,
    value: string,
  ) => {
    const updated = [...sliders];
    updated[index] = { ...updated[index], [field]: value };
    setSliders(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const res = await updateHeroSliders(sliders);
    setIsSaving(false);

    if (res.success) {
      setMessage({
        type: "success",
        text: "হিরো পোস্টার ও তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!",
      });
    } else {
      setMessage({
        type: "error",
        text: res.error || "সংরক্ষণ করতে সমস্যা হয়েছে",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            হোমপেজ হিরো পোস্টার ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            হিরো ব্যানারে কোনো টেক্সট ছাড়া শুধু পোস্টার ইমেজ শো হবে। এখান থেকে টেবিল আকারে
            পোস্টার লিঙ্ক ও রিডাইরেক্ট লিঙ্ক যোগ/এডিট করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSlide}
            className="gap-2 rounded-xl h-10 font-bold"
          >
            <Add className="size-4" />
            নতুন পোস্টার যোগ করুন
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl h-10 font-bold px-6 shadow-sm"
          >
            {isSaving ? (
              <>
                <Spinner className="size-4 mr-2" /> সংরক্ষণ হচ্ছে...
              </>
            ) : (
              "সংরক্ষণ করুন"
            )}
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-16 text-center font-bold">#</TableHead>
                <TableHead className="w-36 font-bold">প্রিভিউ</TableHead>
                <TableHead className="min-w-[280px] font-bold">
                  পোস্টার ইমেজ লিঙ্ক (Direct URL)
                </TableHead>
                <TableHead className="min-w-[220px] font-bold">
                  ক্লিক করলে যে লিঙ্কে যাবে (Action Link)
                </TableHead>
                <TableHead className="min-w-[150px] font-bold">
                  Alt Text (বিবরণ)
                </TableHead>
                <TableHead className="w-20 text-center font-bold">
                  অ্যাকশন
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sliders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground font-medium"
                  >
                    কোনো পোস্টার পাওয়া যায়নি। উপরে &quot;নতুন পোস্টার যোগ করুন&quot; বাটনে
                    ক্লিক করুন।
                  </TableCell>
                </TableRow>
              ) : (
                sliders.map((slide, index) => (
                  <TableRow key={slide.id || index} className="align-top">
                    <TableCell className="text-center font-bold text-muted-foreground pt-4">
                      {index + 1}
                    </TableCell>
                    <TableCell className="pt-3">
                      <div className="relative aspect-video w-28 rounded-lg overflow-hidden bg-muted border border-border/60 shadow-xs">
                        <Image
                          src={
                            slide.url ||
                            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                          }
                          alt={slide.alt || "Poster Preview"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pt-3">
                      <Input
                        value={slide.url}
                        onChange={(e) =>
                          handleUpdateSlide(index, "url", e.target.value)
                        }
                        placeholder="https://example.com/poster.jpg"
                        className="rounded-lg text-xs h-9 bg-background"
                      />
                    </TableCell>
                    <TableCell className="pt-3">
                      <Input
                        value={slide.link || ""}
                        onChange={(e) =>
                          handleUpdateSlide(index, "link", e.target.value)
                        }
                        placeholder="/courses/hsc-26 বা https://..."
                        className="rounded-lg text-xs h-9 bg-background"
                      />
                    </TableCell>
                    <TableCell className="pt-3">
                      <Input
                        value={slide.alt || ""}
                        onChange={(e) =>
                          handleUpdateSlide(index, "alt", e.target.value)
                        }
                        placeholder="পোস্টারের বর্ণনা"
                        className="rounded-lg text-xs h-9 bg-background"
                      />
                    </TableCell>
                    <TableCell className="text-center pt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSlide(index)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 p-0 rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
