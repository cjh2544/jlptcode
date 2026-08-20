import { pageMetadata } from "@/app/seo/pageMetadata";

export const metadata = pageMetadata(
  "/strategy",
  "JLPT 집중공략",
  "약한 유형을 집중 공략하며 JLPT 점수를 올리세요.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
