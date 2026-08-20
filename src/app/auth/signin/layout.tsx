import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/auth/signin",
  "로그인",
  "JLPTCODE 로그인으로 학습 기록을 이어가세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
