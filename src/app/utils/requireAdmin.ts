import { options } from "@/app/api/auth/[...nextauth]/options";
import { isAdminRole } from "@/app/constants/constants";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(options);

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "로그인 정보가 없습니다." },
        { status: 401 },
      ),
    };
  }

  if (!isAdminRole(session.user.role)) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "처리 권한이 없습니다." },
        { status: 403 },
      ),
    };
  }

  return { session, error: null };
}
