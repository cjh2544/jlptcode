import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/todayKangi",
  "오늘의 한자",
  "매일 일본어 한자를 학습하고 JLPT에 대비하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
