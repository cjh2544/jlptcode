import { options } from "@/app/api/auth/[...nextauth]/options";
import MyPageLayout from "@/app/components/Layout/MyPageLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { noIndexMetadata } from "@/app/seo/pageMetadata";

export const metadata = noIndexMetadata("마이페이지");

export default async function MypageRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <MyPageLayout>{children}</MyPageLayout>;
}
