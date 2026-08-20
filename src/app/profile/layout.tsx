import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("프로필");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
