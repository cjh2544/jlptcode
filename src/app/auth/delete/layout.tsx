import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("회원탈퇴");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
