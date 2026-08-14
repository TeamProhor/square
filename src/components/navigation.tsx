"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggler } from "@/components/language-toggler";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { useLogout, useUser } from "@/hooks/use-auth";
import { getNavItems, sidebarAnnouncement } from "@/lib/navigation";
import type { Dictionary, SidebarProps } from "@/types";
export function Sidebar({ onClose, dict, lang }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: user } = useUser();
  const logoutMutation = useLogout();

  const d = dict.sidebar;
  const isAdmin = pathname.startsWith("/admin");
  const navItems = getNavItems(dict, isAdmin);

  return (
    <aside
      className={`w-full h-full lg:h-[calc(100vh-40px)] lg:m-[20px] shrink-0 z-10 flex flex-col pt-0 lg:pt-[16px] justify-between overflow-x-hidden overflow-y-auto no-scrollbar transition-all duration-[300ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${isCollapsed ? "lg:w-[40px]" : "lg:w-[192px]"}`}
    >
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[48px] lg:gap-0">
          <div className="flex items-center justify-between w-full">
            <Link
              href={`/`}
              onClick={onClose}
              className="flex items-center px-[8px] py-[4px] rounded-[8px] hover:bg-accent transition-colors overflow-hidden shrink-0"
            >
              <Image
                src="/icon.svg"
                width={24}
                height={24}
                className="shrink-0 mr-[12px] size-6"
                alt="Prohor Logo"
              />
              <h3
                className={`font-[800] text-[18px] lg:text-[16px] whitespace-nowrap mt-[3px] transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
              >
                স্কয়ার
              </h3>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex lg:hidden w-fit p-[4px] rounded-[8px] hover:bg-accent transition-colors h-auto"
            >
              <svg
                className="size-7"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Close Sidebar</title>
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.29"
                />
                <path
                  d="M15 19L15 5"
                  stroke="currentColor"
                  strokeWidth="1.29"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-start px-[8px] py-[4px] rounded-[8px] hover:bg-accent transition-colors text-muted-foreground overflow-hidden -mt-[8px] h-auto w-full shrink-0"
        >
          <Image
            src="/icons/chevrons-left.svg"
            alt="arrows"
            width={24}
            height={24}
            className={`shrink-0 mr-[12px] transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
          <span
            className={`text-[14px] whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
            {d.collapse}
          </span>
        </Button>

        <nav className="flex flex-col gap-[4px] lg:-mt-[16px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`relative flex items-center px-[8px] py-[4px] rounded-[8px] transition-colors overflow-hidden shrink-0 ${
                  isActive ? "bg-accent" : "hover:bg-accent"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-[8px]">
                  <Icon size={24} className="shrink-0" />
                  <span
                    className={`text-[14px] text-foreground whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
                  >
                    {item.name}
                  </span>
                </div>
                {item.count && (
                  <div
                    className={`absolute right-[8px] bg-success-badge rounded-[8px] px-[8px] py-[2px] flex items-center transition-opacity duration-200 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                  >
                    <span className="text-success-badge-foreground text-[12px] font-[600]">
                      {item.count}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href={sidebarAnnouncement.href}
          onClick={onClose}
          className={`hidden lg:flex flex-col gap-[8px] bg-background border-[0.5px] border-border rounded-[16px] hover:bg-muted transition-all duration-300 overflow-hidden shrink-0 ${
            isCollapsed
              ? "max-h-0 opacity-0 p-0 border-0 mb-0 pointer-events-none"
              : "max-h-[280px] opacity-100 p-[8px] pb-[12px] mb-[4px]"
          }`}
        >
          <Image
            src={sidebarAnnouncement.imageSrc}
            alt={sidebarAnnouncement.imageAlt}
            width={732}
            height={420}
            className="w-full aspect-[732/420] object-cover rounded-[12px]"
            priority
          />
          <div className="flex flex-col gap-[2px] px-[4px]">
            <h4 className="text-[14px] text-foreground font-semibold">
              {sidebarAnnouncement.title}
            </h4>
            <h6 className="text-[10px] text-muted-foreground leading-normal">
              {sidebarAnnouncement.subtitle}
            </h6>
          </div>
        </Link>
      </div>

      <div className="flex flex-col gap-[12px] mt-[24px] lg:mt-[32px] px-[8px] items-center lg:items-stretch border-t border-border/50 pt-[16px]">
        <div
          className={`flex transition-all duration-300 ${
            isCollapsed
              ? "flex-col items-center gap-[16px] px-0"
              : "flex-row items-center gap-[12px] px-[8px]"
          }`}
        >
          <ThemeToggler variant="circle" />
          <LanguageToggler lang={lang} className="text-[14px]" />
        </div>

        <a
          href={user ? "#" : "mailto:contact@square.com"}
          onClick={
            user
              ? (e) => {
                  e.preventDefault();
                  logoutMutation.mutate();
                }
              : undefined
          }
          title={user ? "ক্লিক করে লগআউট করুন" : undefined}
          className="py-[4px] rounded-[8px] hover:bg-accent transition-colors overflow-hidden whitespace-nowrap"
        >
          <span
            className={`text-[14px] text-foreground transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
            {user?.email ?? "contact@square.com"}
          </span>
        </a>
      </div>
    </aside>
  );
}

interface MobileBottomNavProps {
  readonly dict: Dictionary;
}

export function MobileBottomNav({ dict }: MobileBottomNavProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const navItems = getNavItems(dict, isAdmin);

  return (
    <div className="lg:hidden absolute bottom-[12px] left-[16px] right-[16px] z-20 flex justify-center pointer-events-none">
      <div className="flex items-center justify-between bg-muted/80 backdrop-blur-xl border-[0.5px] border-border rounded-[24px] p-[8px] shadow-lg pointer-events-auto w-full max-w-[400px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.path
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-1 flex-col items-center justify-center py-[8px] px-[4px] rounded-[16px] transition-all duration-300 ${
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon size={24} className="mb-[4px]" />
              <span className="text-[11px] font-[600] tracking-tight whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
