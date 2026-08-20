import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("글쓰기");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
