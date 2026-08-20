import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/jptStrategy",
  "JPT 집중공략",
  "JPT 유형별 집중 공략으로 고득점을 노려보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
