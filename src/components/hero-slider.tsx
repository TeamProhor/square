"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "@/components/icons";

const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 1",
  },
  {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 2",
  },
  {
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    alt: "Slider 3",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  return (
    <section
      className="relative overflow-hidden w-full bg-black group"
      style={{ aspectRatio: "16 / 9", maxHeight: "500px" }}
    >
      <div className="relative w-full h-full">
        {sliderImages.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.alt}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                alt={slide.alt}
                className="w-full h-full object-cover"
                src={slide.url}
                fill
                priority={index === 0}
                unoptimized
              />
              <div className="absolute inset-0 hero-gradient" />
            </div>
          );
        })}
      </div>

      {/* Prev Button */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black p-2.5 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30 cursor-pointer hidden sm:block"
      >
        <ArrowLeft2 className="size-5" />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black p-2.5 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30 cursor-pointer hidden sm:block"
      >
        <ArrowRight2 className="size-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {sliderImages.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.alt}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isActive ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
