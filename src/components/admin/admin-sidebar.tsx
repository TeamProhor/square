"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarTick,
  Camera,
  Home,
  Logout,
  StatusUp,
  TaskSquare,
  User,
} from "@/components/icons";

import { Button } from "@/components/ui/button";
import { useLogout, useUser } from "@/hooks/use-auth";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const logoutMutation = useLogout();

  const adminNavItems = [
    { name: "ওভারভিউ", path: "/admin", exact: true, icon: Home },
    {
      name: "পেমেন্ট ও এনরোলমেন্ট",
      path: "/admin/enrollments",
      exact: false,
      icon: TaskSquare,
    },
    { name: "প্রশ্নব্যাংক", path: "/admin/qb", exact: false, icon: TaskSquare },
    { name: "ম্যানেজ ব্যাচ", path: "/admin/batches", exact: false, icon: User },
    {
      name: "ম্যানেজ পরীক্ষা",
      path: "/admin/exams",
      exact: true,
      icon: TaskSquare,
    },
    {
      name: "রুটিন ক্যালেন্ডার",
      path: "/admin/exams/routines",
      exact: false,
      icon: CalendarTick,
    },
    { name: "পিডিএফ সাজেশন", path: "/admin/pdf", exact: false, icon: BookOpen },
    {
      name: "পোল ও কম্যুনিটি",
      path: "/admin/polls",
      exact: false,
      icon: StatusUp,
    },
    {
      name: "হিরো স্লাইডার",
      path: "/admin/sliders",
      exact: false,
      icon: Camera,
    },
  ];

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col justify-between p-4 shrink-0">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2 py-1">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-primary">
              স্কয়ার{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                এডমিন
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === "/admin"
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground truncate">
          <User className="size-4 shrink-0 text-primary" />
          <span className="truncate">{user?.email ?? "এডমিন প্যানেল"}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
        >
          <Logout className="size-4" />
          <span>লগআউট</span>
        </Button>
      </div>
    </aside>
  );
}
