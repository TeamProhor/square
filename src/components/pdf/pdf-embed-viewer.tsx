"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";
import { getPdfProxyUrl } from "@/lib/drive";

// Dynamically import React PDF Viewer to disable SSR
const ReactPdfViewerCore = dynamic(
  () =>
    import("@/components/pdf/react-pdf-viewer-core").then(
      (mod) => mod.ReactPdfViewerCore,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full w-full py-16 gap-2">
        <Spinner className="size-8 text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">
          পিডিএফ রিডার লোড হচ্ছে...
        </p>
      </div>
    ),
  },
);

interface PdfEmbedViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export function PdfEmbedViewer({
  url,
  className = "w-full h-full",
}: PdfEmbedViewerProps) {
  const pdfStreamUrl = getPdfProxyUrl(url);

  return (
    <div className={`relative flex flex-col bg-background h-full w-full ${className}`}>
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <ReactPdfViewerCore fileUrl={pdfStreamUrl} />
      </div>
    </div>
  );
}
