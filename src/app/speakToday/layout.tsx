import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/speakToday",
  "회화학습",
  "일본어 회화 학습으로 말하기 실력을 키워보세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
