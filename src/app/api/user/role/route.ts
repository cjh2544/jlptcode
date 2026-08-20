import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { USER_ROLE } from "@/app/constants/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const { email, role } = await request.json();

  if (!email || !role) {
    return NextResponse.json(
      { success: false, message: "이메일과 권한 정보가 필요합니다." },
      { status: 400 }
    );
  }

  const validRoles = [USER_ROLE.USER, USER_ROLE.ADMIN];
  const newRoles: string[] = Array.isArray(role) ? role : [role];
  if (newRoles.some((r) => !validRoles.includes(r))) {
    return NextResponse.json(
      { success: false, message: "유효하지 않은 권한입니다." },
      { status: 400 }
    );
  }

  if (session?.user?.email === email) {
    return NextResponse.json(
      { success: false, message: "자신의 권한은 변경할 수 없습니다." },
      { status: 400 }
    );
  }

  const result = await User.updateOne({ email }, { role: newRoles });

  if (!result || result.modifiedCount === 0) {
    return NextResponse.json({ success: false, message: "처리되지 않았습니다." });
  }

  return NextResponse.json({ success: true, message: "권한이 변경되었습니다." });
}
