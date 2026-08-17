import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://prohor-nextjs-starter-kit.vercel.app"),
  title: "Prohor HSC Question Bank & Preparation Kit",
  description:
    "Modern HSC Question Bank and preparation platform built by Prohor.",
  keywords: [
    "Next.js starter",
    "HSC Question Bank",
    "Tailwind CSS boilerplate",
    "Prohor Starter Kit",
    "React framework",
    "AI friendly Next.js",
  ],
  authors: [{ name: "Prohor Team", url: "https://github.com/TeamProhor" }],
  creator: "Prohor Team",
  publisher: "Prohor Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "bn-BD": "/bn",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Prohor HSC Question Bank & Preparation Kit",
    description:
      "Modern HSC Question Bank and preparation platform built by Prohor.",
    type: "website",
    siteName: "Prohor",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: "https://prohor-nextjs-starter-kit.vercel.app/",
    images: [
      {
        url: "https://prohor-nextjs-starter-kit.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prohor HSC Question Bank & Preparation Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prohor HSC Question Bank & Preparation Kit",
    description:
      "Launch your next web project faster with Prohor Question Bank. Featuring modern UI styling, strict Biome linting, and seamless developer experience built-in.",
    site: "@TeamProhor",
    creator: "@TeamProhor",
    images: ["https://prohor-nextjs-starter-kit.vercel.app/og-image.png"],
  },
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://prohor-nextjs-starter-kit.vercel.app/#website",
      url: "https://prohor-nextjs-starter-kit.vercel.app/",
      name: "Prohor",
      description:
        "Modern HSC Question Bank and preparation platform built by Prohor.",
      inLanguage: ["en-US", "bn-BD"],
    },
    {
      "@type": "Organization",
      "@id": "https://prohor-nextjs-starter-kit.vercel.app/#organization",
      name: "Prohor Team",
      url: "https://prohor-nextjs-starter-kit.vercel.app/",
      sameAs: ["https://github.com/TeamProhor"],
      logo: "https://prohor-nextjs-starter-kit.vercel.app/icon.svg",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Prohor HSC Question Bank",
      operatingSystem: "All",
      applicationCategory: "EducationalApplication",
      description:
        "A fast, modern, and reliable HSC preparation platform fully equipped with PostgreSQL, Tailwind CSS, and Biome.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BDT",
      },
    },
  ],
};
