import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/board/community/list",
  "게시판",
  "JLPTCODE 문의 게시판에서 궁금한 점을 남겨주세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
