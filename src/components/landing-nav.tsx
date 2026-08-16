"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "@/components/icons";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 md:size-10 rounded-xl bg-transparent flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-200">
            <Image
              alt="Square Logo"
              className="w-full h-full object-contain"
              src="https://raw.githubusercontent.com/shuyaib105/square/refs/heads/main/1536-removebg-preview.png"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
              স্কয়ার
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold text-muted-foreground tracking-wide mt-0.5">
              Engr. Platform
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler variant="circle" />

          <Button
            asChild
            variant="ghost"
            className="hidden sm:inline-flex rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <Link href="#courses-section">কোর্সসমূহ</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="hidden sm:inline-flex rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <Link href="/qb">প্রশ্নব্যাংক</Link>
          </Button>

          <Button
            asChild
            className="rounded-full px-5 md:px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 text-xs md:text-sm shadow-none"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <User className="size-4" />
              <span>লগইন</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border/60 text-foreground pt-10 pb-8 mt-10 md:mt-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-background border border-border/60 p-1 flex items-center justify-center">
                <Image
                  alt="Logo"
                  className="w-full h-full object-contain"
                  src="https://raw.githubusercontent.com/shuyaib105/square/refs/heads/main/1536-removebg-preview.png"
                  width={36}
                  height={36}
                  unoptimized
                />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground">
                স্কয়ার • Engr. Platform
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed italic border-l-2 border-primary/40 pl-3">
              "শুধু পড়াশোনা নয়, তৈরি করো নিজেকে যুগের সাথে তাল মিলিয়ে। ইঞ্জিনিয়ারিং
              প্রস্তুতি এবার বাড়ির কাছে।"
            </p>
          </div>

          {/* Useful resources */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              সহায়ক রিসোর্স
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link
                  href="/pdf"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/60" />
                  সাজেশন পিডিএফ পোর্টাল
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/60" />
                  এইচএসসি ২০২৬ পরীক্ষার দিনপঞ্জি
                </Link>
              </li>
              <li>
                <Link
                  href="/poll"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/60" />
                  লাইভ পোল ও এমসিকিউ কুইজ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              যোগাযোগ ও সোশ্যাল মিডিয়া
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <a
                  href="https://t.me/shu_yaib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/60" />
                  টেলিগ্রাম গ্রুপে যুক্ত হোন
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/60" />
                  ফেসবুক সাপোর্ট কমিউনিটি
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 text-center text-muted-foreground text-xs">
          © 2026 স্কয়ার (Engr. Platform). All rights reserved. Designed with
          craftsmanship & precision.
        </div>
      </div>
    </footer>
  );
}
