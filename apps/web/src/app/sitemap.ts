import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/advocacy", "/plans", "/organizations", "/academy", "/academy/cna", "/academy/specialty", "/academy/cpr", "/shop", "/about", "/blog", "/faq", "/contact", "/book",
    ...services.map((s) => `/advocacy/${s.slug}`), ...articles.map((a) => `/blog/${a.slug}`)];
  return paths.map((p) => ({ url: site.url + p, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
