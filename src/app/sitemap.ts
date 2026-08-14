import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://prohor-nextjs-starter-kit.vercel.app";
  const lastModified = new Date().toISOString();

  const routes = ["", "/login"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of ["en", "bn"]) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            bn: `${baseUrl}/bn${route}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
