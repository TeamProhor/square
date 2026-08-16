"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseCircle, TickCircle } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveRequest, rejectRequest } from "@/lib/actions/admin-enrollments";

interface EnrollmentRequestRow {
  request: {
    id: string;
    courseId: string;
    userId: string;
    status: string | null;
    paymentMethod: string;
    amountPaid: number;
    transactionId: string | null;
    senderNumber: string | null;
  };
  user: {
    name: string | null;
    email: string;
  } | null;
  course: {
    title: string;
    hscBatch: string;
  } | null;
}

export function ManageEnrollmentModal({ row }: { row: EnrollmentRequestRow }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await approveRequest(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await rejectRequest(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="এনরোলমেন্ট রিকোয়েস্ট"
      trigger={
        <Button size="sm" variant="outline" className="text-xs">
          ম্যানেজ করুন
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-3 border-b pb-2">
            <span className="text-muted-foreground">শিক্ষার্থী:</span>
            <span className="col-span-2 font-medium">
              {row.user?.name} ({row.user?.email})
            </span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <span className="text-muted-foreground">কোর্স:</span>
            <span className="col-span-2 font-medium">
              {row.course?.title} - {row.course?.hscBatch}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <span className="text-muted-foreground">স্ট্যাটাস:</span>
            <span className="col-span-2">
              <Badge
                variant={
                  row.request.status === "approved"
                    ? "default"
                    : row.request.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {row.request.status}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <span className="text-muted-foreground">মেথড ও অ্যামাউন্ট:</span>
            <span className="col-span-2 font-medium uppercase">
              {row.request.paymentMethod} - ৳{row.request.amountPaid}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <span className="text-muted-foreground">ট্রানজেকশন আইডি:</span>
            <span className="col-span-2 font-mono font-medium">
              {row.request.transactionId || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-muted-foreground">সেন্ডার নাম্বার:</span>
            <span className="col-span-2 font-mono font-medium">
              {row.request.senderNumber || "N/A"}
            </span>
          </div>
        </div>

        {row.request.status === "pending" && (
          <div className="flex flex-col gap-4 mt-6">
            <form onSubmit={handleApprove} className="w-full">
              <input type="hidden" name="requestId" value={row.request.id} />
              <input
                type="hidden"
                name="courseId"
                value={row.request.courseId}
              />
              <input type="hidden" name="userId" value={row.request.userId} />
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2"
                disabled={loading}
              >
                <TickCircle className="size-4" /> এপ্রুভ করুন
              </Button>
            </form>

            <form onSubmit={handleReject} className="w-full space-y-3">
              <input type="hidden" name="requestId" value={row.request.id} />
              <div className="space-y-1">
                <Label
                  htmlFor="adminNote"
                  className="text-xs text-muted-foreground"
                >
                  বাতিলের কারণ (ঐচ্ছিক)
                </Label>
                <Input
                  id="adminNote"
                  name="adminNote"
                  placeholder="Payment mismatch"
                  defaultValue="Payment mismatch"
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full gap-2"
                disabled={loading}
              >
                <CloseCircle className="size-4" /> রিজেক্ট করুন
              </Button>
            </form>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
