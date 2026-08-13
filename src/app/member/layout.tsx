import { options } from "@/app/api/auth/[...nextauth]/options";
import { isAdminRole } from "@/app/constants/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MemberRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/");
  }

  return children;
}
