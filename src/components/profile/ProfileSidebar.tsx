"use client";

import type { ReactElement } from "react";
import { Camera, Crown, Flame, Phone, Trophy } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileBadgeProps {
  readonly icon: typeof Trophy;
  readonly label: string;
  readonly value?: string;
  readonly variant: "amber" | "orange" | "blue";
}

function ProfileBadge({
  icon: Icon,
  label,
  value,
  variant,
}: ProfileBadgeProps): ReactElement {
  const variantStyles = {
    amber:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-500",
    orange:
      "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-500",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-500",
  };

  return (
    <div
      className={`size-7 md:size-8 rounded-lg flex items-center justify-center border group/badge cursor-help relative ${variantStyles[variant]}`}
    >
      <Icon size={16} />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 md:w-28 bg-foreground text-background text-[9px] md:text-[10px] font-bold p-1.5 rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none z-30 text-center shadow-xl mb-1">
        {label}
        {value && `: ${value}`}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 md:size-1.5 bg-foreground rotate-45" />
      </div>
    </div>
  );
}

export function ProfileSidebar(): ReactElement {
  return (
    <aside className="shrink-0 w-full lg:w-[340px] flex flex-col gap-4 md:gap-5 lg:sticky lg:top-8 lg:self-start">
      <div className="flex flex-col items-center gap-1 bg-card text-card-foreground shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[24px] w-full border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-b from-primary/10 to-transparent" />

        {/* Avatar Upload Container */}
        <div className="relative z-10 group cursor-pointer">
          <Avatar className="size-20 md:size-24 border-4 border-card shadow-md transition-transform active:scale-95">
            <AvatarImage
              src="https://api.readingzonebd.com/storage/v1/object/public/profiles/56d252d9-ad98-4cf8-bebb-98f9369b616e/1779631819312.webp"
              alt="Fahhhh"
              className="object-cover"
            />
            <AvatarFallback className="text-xl">F</AvatarFallback>
          </Avatar>

          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera size={24} className="text-white" />
          </div>
          <input
            className="hidden"
            accept="image/*"
            type="file"
            aria-label="Upload profile picture"
          />
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center gap-0.5 md:gap-1 mt-2 md:mt-3 text-center z-10 w-full">
          <h4 className="font-bold text-lg md:text-xl text-card-foreground leading-tight">
            Fahhhh
          </h4>
          <p className="text-muted-foreground text-xs md:text-[13px] font-medium mt-0.5">
            @ff_4096
          </p>

          <p className="text-muted-foreground text-[11px] md:text-xs font-bold bg-muted px-2 py-0.5 rounded-full mt-1 border border-border/50">
            রোল: RdZ-০০৫
          </p>

          <p className="text-muted-foreground text-[11px] md:text-xs font-bold mt-1 flex items-center gap-1">
            <Phone size={12} />
            ০১৮১৬৫১৫৭৮৫
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-3 md:mt-4">
            <ProfileBadge icon={Trophy} label="Top Scorer" variant="amber" />
            <ProfileBadge
              icon={Flame}
              label="Streak"
              value="2"
              variant="orange"
            />
            <ProfileBadge icon={Crown} label="Early Bird" variant="blue" />
          </div>
        </div>
      </div>
    </aside>
  );
}
