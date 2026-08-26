import type { ReactNode } from "react";

export default function PrintLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black p-4 print:p-0 font-sans">
      {children}
    </div>
  );
}
