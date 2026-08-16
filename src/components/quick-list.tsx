"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight2 } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface QuickListItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType | React.ReactNode;
  bg?: string;
  text?: string;
  iconBg?: string;
  delay?: string;
  extra?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
  hideCaret?: boolean;
}

interface QuickListProps {
  title?: string;
  titleIcon?: React.ElementType;
  description?: string;
  items: QuickListItem[];
  className?: string;
  gridClassName?: string;
  cardClassName?: string;
  variant?: "grid" | "list";
  gap?: "sm" | "md" | "lg";
  isLoading?: boolean;
  skeletonCount?: number;
  animate?: boolean;
  columns?: {
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
    xl?: 1 | 2 | 3 | 4;
  };
}

export function QuickList({
  title,
  titleIcon: TitleIcon,
  description,
  items,
  className,
  gridClassName,
  cardClassName,
  variant = "grid",
  gap = "md",
  isLoading = false,
  skeletonCount = 3,
  animate = true,
  columns,
}: QuickListProps) {
  const gapMap = {
    sm: "gap-2 md:gap-3",
    md: "gap-3 md:gap-5",
    lg: "gap-4 md:gap-8",
  };

  const getGridCols = () => {
    if (columns) {
      const smCols = columns.sm
        ? {
            1: "sm:grid-cols-1",
            2: "sm:grid-cols-2",
            3: "sm:grid-cols-3",
            4: "sm:grid-cols-4",
          }[columns.sm]
        : "";
      const mdCols = columns.md
        ? {
            1: "md:grid-cols-1",
            2: "md:grid-cols-2",
            3: "md:grid-cols-3",
            4: "md:grid-cols-4",
          }[columns.md]
        : "";
      const lgCols = columns.lg
        ? {
            1: "lg:grid-cols-1",
            2: "lg:grid-cols-2",
            3: "lg:grid-cols-3",
            4: "lg:grid-cols-4",
          }[columns.lg]
        : "";
      const xlCols = columns.xl
        ? {
            1: "xl:grid-cols-1",
            2: "xl:grid-cols-2",
            3: "xl:grid-cols-3",
            4: "xl:grid-cols-4",
          }[columns.xl]
        : "";
      return cn("grid-cols-1", smCols, mdCols, lgCols, xlCols);
    }
    if (variant === "list") return "grid-cols-1";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      {(title || TitleIcon) && (
        <div className="flex flex-col gap-1 px-1">
          <h3 className="text-lg md:text-xl font-black flex items-center gap-2">
            {TitleIcon && <TitleIcon className="text-primary size-5" />}
            {title}
          </h3>
          {description && (
            <p className="text-sm font-bold text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid", getGridCols(), gapMap[gap], gridClassName)}>
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, i) => `ql-sk-${i}`).map(
              (id) => (
                <div
                  key={id}
                  className={cn(
                    "rounded-xl md:rounded-2xl bg-muted animate-pulse",
                    variant === "grid" ? "h-32 md:h-48" : "h-16 md:h-20",
                  )}
                />
              ),
            )
          : items.map((item, idx) => {
              const Icon = item.icon;

              const content = (
                <>
                  {/* Background Accent */}
                  {item.bg && (
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500",
                        item.bg,
                      )}
                    />
                  )}

                  {Icon &&
                  (typeof Icon === "function" ||
                    React.isValidElement(Icon) ||
                    (typeof Icon === "object" && !Array.isArray(Icon))) ? (
                    <div
                      className={cn(
                        "flex items-center justify-center size-10 md:size-12 rounded-lg md:rounded-xl transition-all duration-300 shrink-0 mr-4",
                        item.iconBg || "bg-muted",
                      )}
                    >
                      {typeof Icon === "function"
                        ? React.createElement(Icon as React.ElementType, {
                            className: cn("size-5 md:size-6", item.text),
                          })
                        : Icon}
                    </div>
                  ) : (
                    Icon
                  )}

                  {/* Text Content */}
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div
                        className={cn(
                          "font-black text-sm md:text-base text-foreground group-hover:text-primary transition-colors leading-tight",
                          typeof item.title === "string" && "truncate",
                        )}
                      >
                        {item.title}
                      </div>
                      {item.extra && (
                        <div className="hidden sm:block shrink-0">
                          {item.extra}
                        </div>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-muted-foreground text-[10px] md:text-sm font-bold leading-tight mt-1 line-clamp-2">
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Right Side / Action */}
                  {(item.rightElement ||
                    item.extra ||
                    (!item.hideCaret && item.href)) && (
                    <div className="ml-auto shrink-0 pl-3 flex items-center">
                      {item.rightElement ||
                        item.extra ||
                        (!item.hideCaret && (
                          <ArrowRight2 className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        ))}
                    </div>
                  )}
                </>
              );

              const baseClassName = cn(
                "relative flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl flex-row",
                "bg-card border-2 border-border/50 shadow-sm transition-all duration-300 w-full text-left",
                "group overflow-hidden h-full hover:border-primary/30",
                cardClassName,
                item.className,
              );

              const itemKey =
                item.href ||
                (typeof item.title === "string"
                  ? item.title
                  : `ql-item-${idx}`);

              return (
                <div
                  key={itemKey}
                  className={cn(
                    animate &&
                      "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
                    item.delay,
                  )}
                >
                  {item.href ? (
                    <Link href={item.href} className={baseClassName}>
                      {content}
                    </Link>
                  ) : item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={baseClassName}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={baseClassName}>{content}</div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
