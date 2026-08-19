"use client";

import { useEffect, useMemo, useState } from "react";
import { ManageEnrollmentModal } from "@/components/admin/manage-enrollment-modal";
import { Danger, Search, User } from "@/components/icons";
import { QuickList } from "@/components/quick-list";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface EnrollmentRequestsListProps {
  readonly requests: readonly EnrollmentRequestRow[];
}

const ITEMS_PER_PAGE = 8;

export function EnrollmentRequestsList({
  requests,
}: EnrollmentRequestsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((row) => {
      // 1. Status Filter
      if (statusFilter !== "all") {
        const rowStatus = row.request.status || "pending";
        if (rowStatus !== statusFilter) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const userName = (row.user?.name || "").toLowerCase();
        const userEmail = (row.user?.email || "").toLowerCase();
        const paymentMethod = (row.request.paymentMethod || "").toLowerCase();
        const transactionId = (row.request.transactionId || "").toLowerCase();
        const senderNumber = (row.request.senderNumber || "").toLowerCase();
        const courseTitle = (row.course?.title || "").toLowerCase();

        return (
          userName.includes(query) ||
          userEmail.includes(query) ||
          paymentMethod.includes(query) ||
          transactionId.includes(query) ||
          senderNumber.includes(query) ||
          courseTitle.includes(query)
        );
      }

      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // Pagination calculations
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const toBanglaDigits = (str: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(str).replace(
      /[0-9]/g,
      (digit) => bnDigits[Number(digit)] || digit,
    );
  };

  const listItems = paginatedRequests.map((row) => ({
    title: `${row.user?.name || "অজানা শিক্ষার্থী"} - ৳${row.request.amountPaid}`,
    description: `কোর্স: ${row.course?.title || "অজানা কোর্স"} | মেথড: ${row.request.paymentMethod.toUpperCase()}`,
    icon: <User className="size-5 md:size-6" />,
    iconBg:
      row.request.status === "pending"
        ? "bg-amber-500/10 text-amber-500"
        : row.request.status === "approved"
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-destructive/10 text-destructive",
    rightElement: (
      <div className="flex gap-2 items-center">
        <span
          className={`hidden sm:inline-flex text-xs font-bold px-2 py-0.5 rounded-md ${
            row.request.status === "approved"
              ? "text-emerald-600 bg-emerald-500/10"
              : row.request.status === "rejected"
                ? "text-destructive bg-destructive/10"
                : "text-amber-600 bg-amber-500/10"
          }`}
        >
          {row.request.status === "approved"
            ? "অনুমোদিত"
            : row.request.status === "rejected"
              ? "বাতিল"
              : "পেন্ডিং"}
        </span>
        <ManageEnrollmentModal row={row} />
      </div>
    ),
    hideCaret: true,
  }));

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-transparent p-0">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ইমেইল, কোর্স বা ট্রানজেকশন আইডি..."
            className="pl-10 rounded-xl w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            ফিল্টার:
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] rounded-xl font-bold bg-background text-xs h-9 cursor-pointer">
              <SelectValue placeholder="স্ট্যাটাস সিলেক্ট করুন" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border/80 bg-popover shadow-md">
              <SelectItem
                value="all"
                className="text-xs font-semibold cursor-pointer rounded-lg"
              >
                সবগুলো
              </SelectItem>
              <SelectItem
                value="pending"
                className="text-xs font-semibold cursor-pointer rounded-lg"
              >
                পেন্ডিং
              </SelectItem>
              <SelectItem
                value="approved"
                className="text-xs font-semibold cursor-pointer rounded-lg"
              >
                অনুমোদিত
              </SelectItem>
              <SelectItem
                value="rejected"
                className="text-xs font-semibold cursor-pointer rounded-lg"
              >
                বাতিল
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests List */}
      <div className="mt-4 space-y-6">
        {paginatedRequests.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground border rounded-2xl bg-card flex flex-col items-center gap-3">
            <Danger className="size-8 opacity-40" />
            <p className="text-sm font-semibold">
              কোনো ম্যাচিং রিকোয়েস্ট পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <>
            <QuickList items={listItems} variant="list" gap="sm" />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-2">
                <Pagination>
                  <PaginationContent className="flex items-center justify-center gap-1.5">
                    <PaginationItem>
                      <PaginationPrevious
                        text="পূর্ববর্তী"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={`cursor-pointer rounded-xl h-9 text-xs font-bold ${
                          currentPage === 1
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            className="cursor-pointer rounded-xl h-9 w-9 text-xs font-bold flex items-center justify-center"
                          >
                            {toBanglaDigits(page)}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        text="পরবর্তী"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={`cursor-pointer rounded-xl h-9 text-xs font-bold ${
                          currentPage === totalPages
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
