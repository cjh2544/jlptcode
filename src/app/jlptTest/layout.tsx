import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/jlptTest",
  "모의고사",
  "JLPT 모의고사로 실전 감각을 익혀보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
