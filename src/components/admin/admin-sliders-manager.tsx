"use client";

import Image from "next/image";
import { useState } from "react";
import { Add, Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { type SliderItem, updateHeroSliders } from "@/lib/actions/settings";

export function AdminSlidersManager({
  initialSliders,
}: {
  initialSliders: SliderItem[];
}) {
  const [sliders, setSliders] = useState<SliderItem[]>(initialSliders);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const handleAddSlide = () => {
    const newSlide: SliderItem = {
      id: `slide-${Date.now()}`,
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      alt: `Slider ${sliders.length + 1}`,
      title: "",
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
      setMessage({ type: "success", text: "স্লাইডার ইমেজ ও লিঙ্ক সফলভাবে সংরক্ষণ করা হয়েছে!" });
    } else {
      setMessage({ type: "error", text: res.error || "সংরক্ষণ করতে সমস্যা হয়েছে" });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            হোমপেজ হিরো স্লাইডার ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            হোমপেজের স্লাইডার ইমেজ লিঙ্ক (Direct URL), ক্যাপশন ও বাটন রিডাইরেক্ট লিঙ্ক সহজে এডিট করুন।
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
            নতুন স্লাইড যোগ করুন
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

      <div className="grid grid-cols-1 gap-6">
        {sliders.map((slide, index) => (
          <Card key={slide.id || index} className="overflow-hidden border border-border/70 rounded-2xl shadow-xs">
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Preview Image & Direct Link */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border/50">
                  <Image
                    src={slide.url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"}
                    alt={slide.alt || "Slide Preview"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    ইমেজ ডিরেক্ট লিঙ্ক (Direct Image URL):
                  </Label>
                  <Input
                    value={slide.url}
                    onChange={(e) =>
                      handleUpdateSlide(index, "url", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="h-10 text-xs rounded-xl"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    যেকোনো ইমেজ হোস্ট (imgur, unsplash, cdn ইত্যাদি) এর সরাসরি ইমেজ লিংক দিন।
                  </span>
                </div>
              </div>

              {/* Slide Meta & Links */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      স্লাইড #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSlide(index)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2.5 rounded-lg text-xs"
                    >
                      <Trash2 className="size-3.5 mr-1" />
                      মুছুন
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">স্লাইডার টাইটেল / ক্যাপশন (ঐচ্ছিক):</Label>
                    <Input
                      value={slide.title || ""}
                      onChange={(e) =>
                        handleUpdateSlide(index, "title", e.target.value)
                      }
                      placeholder="যেমন: স্কয়ার বিশেষ অফার বা মডেল টেস্ট"
                      className="rounded-xl h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">ক্লিক করলে যে লিঙ্কে যাবে (Action Link URL / Path):</Label>
                    <Input
                      value={slide.link || ""}
                      onChange={(e) =>
                        handleUpdateSlide(index, "link", e.target.value)
                      }
                      placeholder="যেমন: /courses/hsc-26-organic বা https://facebook.com/..."
                      className="rounded-xl h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Alt Text (বিবরণ):</Label>
                    <Input
                      value={slide.alt || ""}
                      onChange={(e) =>
                        handleUpdateSlide(index, "alt", e.target.value)
                      }
                      placeholder="স্লাইডারের বিবরণ"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
