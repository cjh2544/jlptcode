import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/app/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/member/",
        "/auth/modify",
        "/auth/delete",
        "/board/community/write",
        "/board/community/modify",
        "/board/community/reply",
        "/api/",
        "/dashboard",
        "/protected/",
        "/profile/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
