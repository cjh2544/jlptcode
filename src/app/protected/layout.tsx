import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("보호된 페이지");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
