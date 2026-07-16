import type { Metadata } from "next";
import { getSiteUrl } from "@/app/utils/siteUrl";

const siteUrl = getSiteUrl();

export const SITE_NAME = "JLPTCODE";

export const SITE_DESCRIPTION =
  "일본어능력시험, 일본어 등급별, 년도별, 과목별 기출문제 풀이와 단어외우기를 학습할수 있고, 해석기능과 채점기능을 제공합니다.";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "JLPTCODE - %s",
    default: "JLPTCODE",
  },
  authors: [{ name: "JLPTCODE" }],
  description: SITE_DESCRIPTION,
  keywords: [
    "일본어능력시험",
    "일본어",
    "JLPT",
    "JPT",
    "일본어 기출문제",
    "기출문제 풀이",
    "일본어 단어",
    "단어외우기",
    "모쿠모쿠 일본어",
    "일본",
    "일본여행",
    "동경",
    "오사카",
    "나고야",
    "일본친구",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: SITE_NAME,
    title: "JLPTCODE",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/main_bg_title.png",
        width: 500,
        height: 200,
        alt: "JLPTCODE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JLPTCODE",
    description: SITE_DESCRIPTION,
    images: ["/images/main_bg_title.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
