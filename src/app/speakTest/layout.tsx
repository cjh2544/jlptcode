import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/speakTest",
  "스피킹 테스트",
  "일본어 스피킹 실력을 테스트하고 점검하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
