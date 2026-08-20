import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("대시보드");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
