import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("문제풀이");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
