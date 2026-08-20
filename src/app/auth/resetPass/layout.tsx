import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("비밀번호 초기화");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
