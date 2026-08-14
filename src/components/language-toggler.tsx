"use client";

import { useRouter } from "next/navigation";
import { Language } from "@/components/icons";
import { cn } from "@/lib/utils";

export function LanguageToggler({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const router = useRouter();

  const isBn = lang === "bn";

  const toggleLanguage = () => {
    const nextLang = isBn ? "en" : "bn";
    // biome-ignore lint/suspicious/noDocumentCookie: Client side translation toggle
    document.cookie = `NEXT_LOCALE=${nextLang}; path=/; max-age=31536000`;
    router.refresh();
  };

  const label = isBn ? "en" : "বাং";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center justify-center font-medium hover:text-muted-foreground transition-colors",
        className,
      )}
      aria-label="Toggle language"
    >
      <Language size={24} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
