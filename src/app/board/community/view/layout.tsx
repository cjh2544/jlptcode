import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("게시글");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
