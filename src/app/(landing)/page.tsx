import { CoursesPricingSection } from "@/components/courses-pricing-section";
import { HeroSlider } from "@/components/hero-slider";
import { LandingFooter, LandingHeader } from "@/components/landing-nav";
import { ServicesGridSection } from "@/components/services-grid-section";

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground flex flex-col font-sans selection:bg-black selection:text-white transition-colors duration-300">
      <LandingHeader />

      <main className="flex-1">
        <div className="animate-tab-content">
          {/* Hero Slider */}
          <HeroSlider />

          {/* All Services Grid */}
          <ServicesGridSection />

          {/* Courses Pricing Section */}
          <CoursesPricingSection />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
