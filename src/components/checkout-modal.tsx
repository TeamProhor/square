"use client";

import { useState } from "react";
import { Copy, TickCircle } from "@/components/icons";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { submitEnrollmentRequest } from "@/lib/actions/course";

interface CheckoutModalProps {
  courseId: string;
  courseTitle: string;
  price: number;
  userId: string;
  children: React.ReactNode;
}

export function CheckoutModal({
  courseId,
  courseTitle,
  price,
  userId,
  children,
}: CheckoutModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [senderNumber, setSenderNumber] = useState("");

  const PAYMENT_NUMBERS = {
    bkash: "017XXXXXXXX (Personal)",
    nagad: "017XXXXXXXX (Personal)",
    rocket: "017XXXXXXXX-X (Personal)",
  };

  const copyToClipboard = (text: string) => {
    const target = text.split(" ")[0];
    if (typeof window !== "undefined") {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(target).catch(() => {});
        return;
      }
      try {
        const textArea = document.createElement("textarea");
        textArea.value = target;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {}
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSuccess(false);
      setSenderNumber("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber) return;

    setLoading(true);
    try {
      await submitEnrollmentRequest({
        userId,
        courseId,
        paymentMethod,
        senderNumber,
        transactionId: "N/A", // Passing N/A since TrxID is no longer required
        amountPaid: price,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={children}
      title={success ? "পেমেন্ট রিকোয়েস্ট সফল!" : "ভর্তি প্রক্রিয়া"}
      description={
        success ? (
          "আপনার পেমেন্ট ভেরিফাই করার পর খুব শীঘ্রই আপনাকে কোর্সে যুক্ত করা হবে। অনুগ্রহ করে অপেক্ষা করুন।"
        ) : (
          <span>
            {courseTitle} - মোট ফি:{" "}
            <span className="font-bold text-foreground">৳{price}</span>
          </span>
        )
      }
      className={success ? "sm:max-w-md text-center" : "sm:max-w-lg"}
    >
      {success ? (
        <div className="flex flex-col items-center gap-4 py-2">
          <TickCircle className="size-16 text-emerald-500" />
          <Button
            onClick={() => handleOpenChange(false)}
            className="mt-4 w-full"
          >
            ঠিক আছে
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-bold">
              ১. পেমেন্ট মেথড নির্বাচন করুন
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries({
                bkash: "বিকাশ",
                nagad: "নগদ",
                rocket: "রকেট",
              }).map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setPaymentMethod(key)}
                  className={`cursor-pointer border rounded-xl p-3 text-center font-bold transition-colors ${
                    paymentMethod === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border/60">
            <Label className="text-sm font-bold text-foreground mb-2 block">
              ২. এই নাম্বারে Send Money করুন:
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-background px-3 py-2 rounded-lg border font-mono text-lg flex-1">
                {PAYMENT_NUMBERS[paymentMethod as keyof typeof PAYMENT_NUMBERS]}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  copyToClipboard(
                    PAYMENT_NUMBERS[
                      paymentMethod as keyof typeof PAYMENT_NUMBERS
                    ],
                  )
                }
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-bold block">
              ৩. পেমেন্ট তথ্য দিন
            </Label>

            <div className="space-y-2">
              <Label htmlFor="sender">যে নাম্বার থেকে টাকা পাঠিয়েছেন</Label>
              <Input
                id="sender"
                placeholder="01XXXXXXXXX"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-bold py-6 text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="size-4 mr-2" /> সাবমিট হচ্ছে...
              </>
            ) : (
              "পেমেন্ট সাবমিট করুন"
            )}
          </Button>
        </form>
      )}
    </ResponsiveDialog>
  );
}
