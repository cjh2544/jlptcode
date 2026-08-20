import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/grammarToday",
  "오늘의 문법",
  "매일 일본어 문법을 학습하고 JLPT에 대비하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
