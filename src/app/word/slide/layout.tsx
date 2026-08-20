import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/word/slide",
  "단어 슬라이드",
  "슬라이드로 일본어 단어를 빠르게 외워보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
