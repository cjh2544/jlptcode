import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/levelUp",
  "JLPT 레벨업",
  "JLPT 레벨업 문제풀이로 등급별 실력을 키워보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
