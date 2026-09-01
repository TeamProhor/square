"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface ReactPdfViewerCoreProps {
  fileUrl: string;
}

export function ReactPdfViewerCore({ fileUrl }: ReactPdfViewerCoreProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <Worker workerUrl="/pdfjs/pdf.worker.min.js">
        <div className="w-full h-full flex-1">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
}
