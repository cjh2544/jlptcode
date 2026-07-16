/**
 * Canonical site origin for SEO (metadataBase, sitemap, robots, JSON-LD).
 * Prefer NEXT_PUBLIC_SITE_URL in production.
 */
export function getSiteUrl(): string {
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromPublic) {
    return fromPublic.replace(/\/$/, "");
  }

  const fromAuth = process.env.NEXTAUTH_URL?.trim();
  if (fromAuth) {
    return fromAuth.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
