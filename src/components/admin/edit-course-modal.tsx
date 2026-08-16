"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCourse } from "@/lib/actions/admin-course";

interface Course {
  id: string;
  title: string;
  slug: string;
  hscBatch: string;
  price: number;
  originalPrice: number | null;
  description: string;
  image: string;
}

export function EditCourseModal({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("courseId", course.id);

    try {
      await updateCourse(formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="কোর্স এডিট করুন"
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
        >
          <Edit className="size-4" />
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">কোর্সের নাম</Label>
          <Input id="title" name="title" required defaultValue={course.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">স্লাগ (URL)</Label>
          <Input id="slug" name="slug" required defaultValue={course.slug} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hscBatch">ব্যাচ</Label>
          <Input
            id="hscBatch"
            name="hscBatch"
            required
            defaultValue={course.hscBatch}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">ডিসকাউন্ট ফি (৳)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              defaultValue={course.price}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">রেগুলার ফি (৳)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              defaultValue={course.originalPrice || ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">সংক্ষিপ্ত বর্ণনা</Label>
          <Input
            id="description"
            name="description"
            required
            defaultValue={course.description}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">ব্যানার ইমেজ URL</Label>
          <Input id="image" name="image" required defaultValue={course.image} />
        </div>

        <Button type="submit" className="w-full font-bold" disabled={loading}>
          {loading ? "আপডেট হচ্ছে..." : "সেভ করুন"}
        </Button>
      </form>
    </ResponsiveDialog>
  );
}
