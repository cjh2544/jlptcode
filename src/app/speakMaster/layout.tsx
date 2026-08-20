import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/speakMaster",
  "스피킹 완전정복 100일",
  "100일 커리큘럼으로 일본어 스피킹을 완전 정복하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
