"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Chart,
  FileDown,
  Send,
  User,
} from "@/components/icons";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <nav
      id="main-nav"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 cursor-pointer group">
          <div className="size-14 p-0.5 border-2 border-transparent group-hover:border-foreground rounded-xl transition-all duration-300 flex items-center justify-center">
            <Image
              alt="Logo"
              className="size-full object-contain"
              src="https://raw.githubusercontent.com/shuyaib105/square/refs/heads/main/1536-removebg-preview.png"
              width={56}
              height={56}
              unoptimized
            />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">
            Engr. Platform
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggler variant="circle" />

          <Button
            asChild
            className="rounded-full px-6 py-2.5 font-bold shadow-md bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-102 text-sm"
          >
            <Link href="/login" className="flex items-center gap-2">
              <User data-icon="inline-start" className="size-4" />
              <span>লগইন</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function LandingFooter() {
  return (
    <footer
      id="main-footer"
      className="bg-black text-white pt-12 pb-8 border-t border-slate-900 mt-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 bg-white p-1 rounded-xl flex items-center justify-center">
                <Image
                  alt="Logo"
                  className="size-full object-contain"
                  src="https://raw.githubusercontent.com/shuyaib105/square/refs/heads/main/1536-removebg-preview.png"
                  width={36}
                  height={36}
                  unoptimized
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Engr. Platform
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-loose italic border-l-2 border-slate-700 pl-3">
              &quot;শুধু পড়াশোনা নয়, তৈরি করো নিজেকে যুগের সাথে তাল মিলিয়ে। ইঞ্জিনিয়ারিং প্রস্তুতি এবার বাড়ির কাছে।&quot;
            </p>
          </div>

          {/* Useful resources */}
          <div>
            <h4 className="text-xs font-black mb-4 text-slate-300 uppercase tracking-widest">
              সহায়ক রিসোর্স
            </h4>
            <ul className="space-y-3 text-slate-400 text-xs font-semibold">
              <li>
                <Link
                  href="/pdf"
                  className="hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <FileDown data-icon="inline-start" className="size-3.5 text-red-500" />
                  <span>সাজেশন পিডিএফ পোর্টাল</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Calendar data-icon="inline-start" className="size-3.5 text-indigo-500" />
                  <span>এইচএসসি ২০২৬ পরীক্ষার দিনপঞ্জি</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/poll"
                  className="hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Chart data-icon="inline-start" className="size-3.5 text-blue-500" />
                  <span>লাইভ পোল ও এমসিকিউ কুইজ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-black mb-4 text-slate-300 uppercase tracking-widest">
              যোগাযোগ ও সোশ্যাল মিডিয়া
            </h4>
            <ul className="space-y-3 text-slate-400 text-xs font-semibold">
              <li>
                <a
                  href="https://t.me/shu_yaib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2.5 transition-colors group"
                >
                  <Send data-icon="inline-start" className="size-3.5 text-sky-400" />
                  <span>টেলিগ্রাম গ্রুপে যুক্ত হোন</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white flex items-center gap-2.5 transition-colors group"
                >
                  <User data-icon="inline-start" className="size-3.5 text-blue-500" />
                  <span>ফেসবুক সাপোর্ট কমিউনিটি</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-slate-500 text-xs">
          © 2026 Engr. Platform. All rights reserved. Developed with absolute craft &amp; precision.
        </div>
      </div>
    </footer>
  );
}

