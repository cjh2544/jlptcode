import type { Metadata } from "next";

export function pageMetadata(
  path: string,
  title: string,
  description: string,
  extra?: Metadata,
): Metadata {
  return {
    title,
    description,
    ...extra,
    alternates: {
      canonical: path,
      ...extra?.alternates,
    },
    openGraph: {
      title,
      description,
      url: path,
      ...extra?.openGraph,
    },
    twitter: {
      title,
      description,
      ...extra?.twitter,
    },
  };
}

export function noIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
