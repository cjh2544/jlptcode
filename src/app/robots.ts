import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/app/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/member/",
        "/mypage/",
        "/auth/modify",
        "/auth/delete",
        "/auth/resetPass",
        "/board/community/write",
        "/board/community/modify",
        "/board/community/reply",
        "/board/community/view",
        "/api/",
        "/dashboard",
        "/protected/",
        "/profile/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
