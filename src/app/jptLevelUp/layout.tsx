import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/jptLevelUp",
  "JPT 레벨업",
  "JPT 레벨업 문제풀이로 실력을 향상하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
