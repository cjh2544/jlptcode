import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/auth/signup",
  "회원가입",
  "JLPTCODE 회원가입으로 일본어 학습을 시작하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
