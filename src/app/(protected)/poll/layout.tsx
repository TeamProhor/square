"use client";

export default function PollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-[1400px] mx-auto w-full gap-6">
      {children}
    </div>
  );
}
