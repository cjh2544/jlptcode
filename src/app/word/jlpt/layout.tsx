import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/word/jlpt",
  "JLPT 단어외우기",
  "JLPT 등급별 일본어 단어를 효율적으로 외워보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
