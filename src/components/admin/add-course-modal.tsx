"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Add } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCourse } from "@/lib/actions/admin-course";

export function AddCourseModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createCourse(formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="নতুন কোর্স তৈরি করুন"
      trigger={
        <Button className="gap-2 font-bold">
          <Add className="size-4" /> নতুন কোর্স
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">কোর্সের নাম</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="HSC 26 পূর্ণাঙ্গ প্রস্তুতি"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">স্লাগ (URL)</Label>
          <Input id="slug" name="slug" required placeholder="hsc-26-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hscBatch">ব্যাচ</Label>
          <Input id="hscBatch" name="hscBatch" required placeholder="HSC 26" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">ডিসকাউন্ট ফি (৳)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              placeholder="6000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">রেগুলার ফি (৳)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              placeholder="8000"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">সংক্ষিপ্ত বর্ণনা</Label>
          <Input
            id="description"
            name="description"
            required
            placeholder="কোর্সের বিবরণ..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">ব্যানার ইমেজ URL</Label>
          <Input
            id="image"
            name="image"
            required
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <Button type="submit" className="w-full font-bold" disabled={loading}>
          {loading ? "তৈরি হচ্ছে..." : "কোর্স তৈরি করুন"}
        </Button>
      </form>
    </ResponsiveDialog>
  );
}
