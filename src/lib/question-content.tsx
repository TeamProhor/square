import React from "react";
import { cn } from "@/lib/utils";

/**
 * Sanitizes and normalizes question / explanation text so that:
 * 1. CSV-escaped quotes like <img class=""qimg"" src=""https://..."" > become <img class="qimg" src="https://..." >
 * 2. Variant markdown image syntax like [!img](url) or [!img}(url) becomes ![](url)
 * 3. Standalone image URLs on their own line become ![](url)
 */
export function sanitizeQuestionContent(content?: string | null): string {
  if (!content) return "";
  let text = String(content);

  // 1. Fix doubled quotes inside HTML tags: e.g. <img class=""qimg"" src=""https://..."" >
  text = text.replace(/(<[^>]+>)/g, (match) => match.replace(/""/g, '"'));

  // 2. Fix variants like [!img](url), [!img}(url), ![img}(url), [!image](url)
  text = text.replace(/\[!(?:img|image)[\]\}]\((https?:\/\/[^\s\)]+)\)/gi, "![]($1)");
  text = text.replace(/!\[([^\]]*)\]\}\((https?:\/\/[^\s\)]+)\)/gi, "![$1]($2)");

  // 3. Standalone image URL on its own line: convert to ![](url)
  text = text.replace(
    /^(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg|bmp))(?:\s*)$/gim,
    "![]($1)",
  );

  return text;
}

/**
 * Custom ReactMarkdown components for proper image rendering and external links
 */
export const markdownComponents = {
  img: ({
    node,
    className,
    src,
    alt,
    ...props
  }: React.ComponentPropsWithoutRef<"img"> & { node?: unknown }) => {
    if (!src) return null;

    return (
      <span className="inline-block my-2 max-w-full overflow-hidden align-middle">
        <img
          src={src}
          alt={alt || "Question Illustration"}
          className={cn(
            "max-w-full h-auto max-h-[420px] rounded-xl border border-border/60 shadow-xs object-contain bg-background cursor-zoom-in hover:opacity-95 transition-all inline-block",
            className,
          )}
          loading="lazy"
          onClick={() => {
            const url = typeof src === "string" ? src : undefined;
            if (typeof window !== "undefined" && url) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }}
          {...props}
        />
      </span>
    );
  },
  a: ({
    node,
    className,
    href,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"a"> & { node?: unknown }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-primary underline font-semibold hover:opacity-80", className)}
      {...props}
    >
      {children}
    </a>
  ),
};
