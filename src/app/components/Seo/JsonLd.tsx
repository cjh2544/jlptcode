import { getSiteUrl } from "@/app/utils/siteUrl";
import { SITE_DESCRIPTION, SITE_NAME } from "@/app/seo/siteConfig";

export default function JsonLd() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        inLanguage: "ko",
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
