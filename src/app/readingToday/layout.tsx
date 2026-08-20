import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/readingToday",
  "오늘의 독해",
  "일본어 독해 지문으로 읽기 실력을 향상하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
