import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/wordToday",
  "오늘의 단어",
  "매일 새로운 일본어 단어로 어휘력을 쌓아보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
