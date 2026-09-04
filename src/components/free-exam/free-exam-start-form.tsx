"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flash, SecurityCard, User } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { startFreeGuestExamAction } from "@/lib/actions/free-exam";

interface FreeExamStartFormProps {
  exam: {
    id: string;
    title: string;
    slug: string;
    durationMinutes: number;
    totalMarks: number;
  };
}

export function FreeExamStartForm({ exam }: FreeExamStartFormProps) {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [college, setCollege] = useState("");
  const [hscBatch, setHscBatch] = useState("HSC 26");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await startFreeGuestExamAction({
      examId: exam.id,
      studentName: studentName.trim(),
      college: college.trim(),
      hscBatch: hscBatch.trim(),
    });

    if (res.success && res.data) {
      // Store in sessionStorage for fast recovery in browser
      sessionStorage.setItem(
        `free_exam_${exam.id}`,
        JSON.stringify({
          submissionId: res.data.submissionId,
          guestUserId: res.data.guestUserId,
          studentName: res.data.studentName,
          college: college.trim(),
        }),
      );

      router.push(
        `/free-exam/${exam.slug}/take?submissionId=${res.data.submissionId}`,
      );
    } else {
      setLoading(false);
      setError(res.error || "পরীক্ষা শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <Card className="rounded-3xl border-2 border-primary/40 bg-card shadow-lg overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-4 bg-gradient-to-br from-primary/10 via-card to-card border-b border-border/60">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
          <Flash className="size-4" />
          <span>তাত্ক্ষণিক অংশ নিন</span>
        </div>
        <CardTitle className="text-lg sm:text-xl font-black text-foreground pt-1">
          আপনার তথ্য দিন
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-relaxed">
          কোনো লগইন বা একাউন্ট ছাড়াই সরাসরি পরীক্ষা দিতে নিচের তথ্যগুলো পূরণ করুন।
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleStartExam}>
        <CardContent className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="student-name" className="text-xs font-bold flex items-center gap-1">
              <span>আপনার নাম *</span>
            </Label>
            <Input
              id="student-name"
              required
              placeholder="e.g. সাদমান সাকিব"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="rounded-xl font-medium text-sm h-11"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="college-name" className="text-xs font-bold">
              কলেজ / শিক্ষা প্রতিষ্ঠান (ঐচ্ছিক)
            </Label>
            <Input
              id="college-name"
              placeholder="e.g. ঢাকা কলেজ / নটর ডেম কলেজ"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="rounded-xl font-medium text-sm h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hsc-batch" className="text-xs font-bold">
              HSC ব্যাচ / টার্গেট
            </Label>
            <Input
              id="hsc-batch"
              placeholder="e.g. HSC 26 / Admission"
              value={hscBatch}
              onChange={(e) => setHscBatch(e.target.value)}
              className="rounded-xl font-medium text-sm h-11"
            />
          </div>
        </CardContent>

        <CardFooter className="p-5 sm:p-6 pt-2">
          <Button
            type="submit"
            disabled={loading || !studentName.trim()}
            className="w-full rounded-2xl font-black text-sm h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer gap-2"
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                <span>পরীক্ষা প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Flash className="size-4" />
                <span>পরীক্ষা শুরু করুন</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
