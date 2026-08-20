import { getSiteUrl } from "@/app/utils/siteUrl";
import { SITE_DESCRIPTION, SITE_NAME } from "@/app/seo/siteConfig";

export default function JsonLd() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        inLanguage: "ko",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/logo.png`,
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#school`,
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
