import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/app/utils/siteUrl";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const PUBLIC_ROUTES: SitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/speakToday", priority: 0.9, changeFrequency: "weekly" },
  { path: "/speakMaster", priority: 0.9, changeFrequency: "weekly" },
  { path: "/wordToday", priority: 0.9, changeFrequency: "weekly" },
  { path: "/grammarToday", priority: 0.9, changeFrequency: "weekly" },
  { path: "/sentenceToday", priority: 0.9, changeFrequency: "weekly" },
  { path: "/levelUp", priority: 0.9, changeFrequency: "weekly" },
  { path: "/strategy", priority: 0.9, changeFrequency: "weekly" },
  { path: "/jlptTest", priority: 0.9, changeFrequency: "weekly" },
  { path: "/speakTest", priority: 0.8, changeFrequency: "weekly" },
  { path: "/readingToday", priority: 0.8, changeFrequency: "weekly" },
  { path: "/jptLevelUp", priority: 0.8, changeFrequency: "weekly" },
  { path: "/jptStrategy", priority: 0.8, changeFrequency: "weekly" },
  { path: "/word/jlpt", priority: 0.8, changeFrequency: "weekly" },
  { path: "/word/slide", priority: 0.8, changeFrequency: "weekly" },
  { path: "/board/community/list", priority: 0.8, changeFrequency: "daily" },
  { path: "/auth/signin", priority: 0.5, changeFrequency: "monthly" },
  { path: "/auth/signup", priority: 0.5, changeFrequency: "monthly" },
  { path: "/word", priority: 0.5, changeFrequency: "weekly" },
  { path: "/word/jpt", priority: 0.5, changeFrequency: "weekly" },
  { path: "/levelUpNew", priority: 0.5, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
