"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import {
  ArrowRight2,
  Bookmark,
  BookOpen,
  Camera,
  Clipboard,
  Danger,
  Download,
  FileText,
  Gamepad,
  Information,
  Logout,
  Notification,
  SecurityCard,
  Send,
  ShieldCheck,
  Trash2,
  User,
  Warning,
} from "@/components/icons";

interface MenuItemProps {
  readonly icon: typeof User;
  readonly label: string;
  readonly iconColorClass?: string;
  readonly path?: string;
  readonly badge?: string | number;
  readonly badgeDestructive?: boolean;
  readonly activeBorder?: boolean;
}

function MenuItem({
  icon: Icon,
  label,
  iconColorClass = "text-muted-foreground",
  path,
  badge,
  badgeDestructive = true,
  activeBorder = false,
}: MenuItemProps): ReactElement {
  const content = (
    <div
      className={`cursor-pointer p-3.5 md:p-4.5 flex items-center justify-between transition-colors hover:bg-muted/40 active:bg-muted/70 outline-none ${
        activeBorder ? "border-l-4 border-l-primary bg-primary/[0.02]" : ""
      }`}
    >
      <div className="flex items-center">
        <Icon
          size={22}
          className={`shrink-0 ${activeBorder ? "text-primary" : iconColorClass}`}
        />
        <span
          className={`ml-3.5 md:ml-4.5 font-semibold text-sm md:text-[15px] ${activeBorder ? "text-primary" : "text-card-foreground"}`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {badge !== undefined && (
          <span
            className={`px-1.5 py-0.5 text-[10px] md:text-[11px] font-black rounded-lg ${
              badgeDestructive
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {badge}
          </span>
        )}
        <ArrowRight2 size={16} className="text-muted-foreground/40" />
      </div>
    </div>
  );

  if (path) {
    return (
      <Link
        href={path}
        className="block border-b border-border last:border-0 first:rounded-t-xl md:first:rounded-t-2xl last:rounded-b-xl md:last:rounded-b-2xl overflow-hidden"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border-b border-border last:border-0 first:rounded-t-xl md:first:rounded-t-2xl last:rounded-b-xl md:last:rounded-b-2xl overflow-hidden">
      {content}
    </div>
  );
}

export function ProfileMenu(): ReactElement {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 md:gap-6">
      <div className="w-full pb-20">
        {/* Section 1: Core Profile Info */}
        <div className="bg-card shadow-sm rounded-xl md:rounded-2xl w-full overflow-hidden border border-border mb-4 md:mb-6">
          <MenuItem
            icon={User}
            label="ব্যক্তিগত তথ্য"
            iconColorClass="text-primary"
            activeBorder
          />
          <MenuItem icon={Camera} label="অ্যাভাটার এডিট" />
          <MenuItem
            icon={Send}
            label="টেলিগ্রাম কানেক্ট"
            iconColorClass="text-chart-2"
            badge="সংযুক্ত"
          />
        </div>

        {/* Section 2: Activity & Questions */}
        <div className="bg-card shadow-sm rounded-xl md:rounded-2xl w-full overflow-hidden border border-border mb-4 md:mb-6">
          <MenuItem
            icon={Notification}
            label="নোটিফিকেশন"
            path="/profile/notifications"
            badge={0}
          />
          <MenuItem
            icon={Danger}
            label="রিপোর্টেড প্রশ্ন"
            iconColorClass="text-destructive"
            path="/profile/reports"
            badge={0}
          />
          <MenuItem
            icon={Bookmark}
            label="বুকমার্ক"
            iconColorClass="text-chart-4"
            path="/profile/bookmarks"
            badge={0}
          />
          <MenuItem
            icon={Warning}
            label="ভুল ব্যাংক"
            iconColorClass="text-chart-3"
            path="/profile/wrong-bank"
            badge={43}
          />
          <MenuItem
            icon={Clipboard}
            label="গত পরীক্ষাগুলো"
            path="/profile/past-exams"
            badge={16}
          />
          <MenuItem
            icon={Gamepad}
            label="গত ব্যাটেলগুলো"
            iconColorClass="text-chart-1"
            path="/profile/past-battles"
            badge={3}
          />
        </div>

        {/* Section 3: App Info & Resources */}
        <div className="bg-card shadow-sm rounded-xl md:rounded-2xl w-full overflow-hidden border border-border mb-4 md:mb-6">
          <MenuItem icon={BookOpen} label="ব্লগ" path="/blog" />
          <MenuItem icon={Information} label="আমাদের সম্পর্কে" />
          <MenuItem icon={FileText} label="নীতিমালা" />
          <MenuItem icon={ShieldCheck} label="গোপনীয়তা নীতি" />
          <MenuItem icon={SecurityCard} label="অ্যাকাউন্ট ইনফো" />
          <MenuItem
            icon={Download}
            label="অ্যাপ ডাউনলোড করুন"
            iconColorClass="text-primary"
            path="/ReadingZone.apk"
          />
        </div>

        {/* Section 4: Account Danger Zone */}
        <div className="bg-card shadow-sm rounded-xl md:rounded-2xl w-full overflow-hidden border border-border mb-4 md:mb-6">
          <MenuItem
            icon={Trash2}
            label="অ্যাকাউন্ট ডিলিট"
            iconColorClass="text-destructive"
          />
        </div>

        {/* Section 5: Log Out */}
        <div className="bg-card shadow-sm rounded-xl md:rounded-2xl w-full overflow-hidden border border-border mb-4 md:mb-6">
          <MenuItem
            icon={Logout}
            label="লগ আউট"
            iconColorClass="text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
