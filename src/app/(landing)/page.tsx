import Image from "next/image";
import Link from "next/link";
import { CoursesPricingSection } from "@/components/courses-pricing-section";
import { FeatureSection } from "@/components/feature-section";
import { Flame } from "@/components/icons";
import { LandingFooter, LandingHeader } from "@/components/landing-nav";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function LandingHomePage() {
  const sliderImages = [
    {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1400",
      tag: "এইচএসসি ২০২৬ স্পেশাল",
      title: "ইঞ্জিনিয়ারিং ও একাডেমিক প্রস্তুতির সেরা প্ল্যাটফর্ম",
      desc: "বুয়েট ও বিশ্ববিদ্যালয় পড়ুয়া অভিজ্ঞ মেন্টরদের সাথে ঘরে বসেই নাও সেরা প্রস্তুতি।",
    },
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1400",
      tag: "প্রশ্নব্যাংক ও অ্যানালাইসিস",
      title: "হাজারো বিগত বছরের প্রশ্ন সমাধান ও ব্যাখ্যা",
      desc: "অধ্যায়ভিত্তিক নির্ভুল এমসিকিউ ও সিকিউ দিয়ে নিজেকে প্রস্তুত করো প্রতিটি পরীক্ষার জন্য।",
    },
    {
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1400",
      tag: "স্মার্ট লার্নিং",
      title: "লাইভ কুইজ, ক্যালেন্ডার ও এক্সক্লুসিভ নোটস",
      desc: "সঠিক সময়ে সঠিক দিকনির্দেশনা ও রুটিন মাফিক ধারাবাহিক পড়াশোনা।",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-8 w-full flex flex-col gap-10 md:gap-14">
        {/* Hero Slider / Carousel */}
        <section className="relative overflow-hidden w-full rounded-2xl md:rounded-3xl border border-border/70 shadow-xs group bg-card">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {sliderImages.map((slide) => (
                <CarouselItem key={slide.title}>
                  <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[300px] md:min-h-[400px] flex items-end p-5 sm:p-8 md:p-10 overflow-hidden">
                    <Image
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 brightness-90 dark:brightness-75"
                      src={slide.url}
                      fill
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent dark:from-background dark:via-background/70 dark:to-transparent" />

                    <div className="relative z-10 max-w-2xl flex flex-col gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 w-fit backdrop-blur-md">
                        <Flame className="size-3.5" /> {slide.tag}
                      </span>
                      <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {slide.desc}
                      </p>
                      <div className="flex items-center gap-2.5 pt-1.5">
                        <Button
                          asChild
                          className="rounded-full px-5 py-2 font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm"
                        >
                          <Link href="#courses-section">কোর্সসমূহ দেখুন</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full px-5 py-2 font-bold bg-background/60 backdrop-blur-md hover:bg-background/90 text-xs sm:text-sm"
                        >
                          <Link href="/qb">ফ্রি প্রশ্নব্যাংক</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 hover:bg-background text-foreground border-border/60 shadow-xs backdrop-blur-md hidden sm:flex" />
            <CarouselNext className="right-4 bg-background/80 hover:bg-background text-foreground border-border/60 shadow-xs backdrop-blur-md hidden sm:flex" />
          </Carousel>
        </section>

        {/* Services / Feature Section (@efferd/features-6) */}
        <section className="flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-1.5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              এক নজরে সকল সার্ভিস
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-lg">
              তোমার প্রস্তুতিকে এক ধাপ এগিয়ে নিতে স্কয়ার প্ল্যাটফর্মের প্রতিটি ফিচার সম্পূর্ণ
              ইন্টারঅ্যাক্টিভ ও গোছানো।
            </p>
          </div>

          <FeatureSection />
        </section>

        {/* Courses Section */}
        <CoursesPricingSection />
      </main>

      <LandingFooter />
    </div>
  );
}
