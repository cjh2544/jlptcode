import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/todaySpeak",
  "하루3문장 일본어회화",
  "매일 일본어 회화 문장 3개를 랜덤으로 학습하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
