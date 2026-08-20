import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/jlpt",
  "JLPT",
  "JLPT 기출문제로 일본어능력시험을 준비하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
