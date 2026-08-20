import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/sentenceToday",
  "오늘의 문장",
  "실용적인 일본어 문장으로 표현력을 키워보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
