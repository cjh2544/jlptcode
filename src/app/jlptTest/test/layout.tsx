import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("모의고사 응시");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
