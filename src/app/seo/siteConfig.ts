import type { Metadata } from "next";
import { getSiteUrl } from "@/app/utils/siteUrl";

const siteUrl = getSiteUrl();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const SITE_NAME = "JLPTCODE";

export const SITE_TITLE = "JLPTCODE - JLPT·JPT 일본어 학습";

export const SITE_DESCRIPTION =
  "일본어능력시험, 일본어 등급별, 년도별, 과목별 기출문제 풀이와 단어외우기를 학습할수 있고, 해석기능과 채점기능을 제공합니다.";

export const SITE_OG_IMAGE = {
  url: "/images/main_bg_title.png",
  width: 500,
  height: 200,
  alt: SITE_NAME,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    template: "JLPTCODE - %s",
    default: SITE_TITLE,
  },
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    "JLPTCODE",
    "일본어능력시험",
    "일본어 학습",
    "일본어",
    "JLPT",
    "JPT",
    "JLPT N1",
    "JLPT N2",
    "일본어 기출문제",
    "기출문제 풀이",
    "일본어 단어",
    "단어외우기",
    "일본어 문법",
    "일본어 회화",
    "일본어 스피킹",
    "JLPT 모의고사",
    "모쿠모쿠 일본어",
  ],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["ja_JP", "en_US", "zh_CN"],
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};
