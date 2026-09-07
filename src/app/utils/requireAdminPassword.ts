import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/models/userModel";
import { requireAdmin } from "@/app/utils/requireAdmin";
import connectDB from "@/app/utils/database";
import { compareSync } from "bcrypt-ts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/** Verify the signed-in admin's account password for sensitive CSV ops. */
export async function requireAdminPassword(password: unknown) {
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error, session: null };

  const plain = typeof password === "string" ? password : "";
  if (!plain.trim()) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "PASSWORD_REQUIRED" },
        { status: 400 },
      ),
    };
  }

  await connectDB();
  const session = auth.session ?? (await getServerSession(options));
  const email = session?.user?.email;
  if (!email) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "로그인 정보가 없습니다." },
        { status: 401 },
      ),
    };
  }

  const user = await User.findOne({ email });
  if (!user?.password) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "PASSWORD_UNAVAILABLE" },
        { status: 400 },
      ),
    };
  }

  if (!compareSync(plain, user.password)) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "PASSWORD_MISMATCH" },
        { status: 403 },
      ),
    };
  }

  return { session: auth.session, error: null };
}
