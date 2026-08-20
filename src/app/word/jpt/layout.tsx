import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/word/jpt",
  "JPT 단어외우기",
  "JPT 대비 일본어 단어를 학습하세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
