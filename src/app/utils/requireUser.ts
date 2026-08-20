import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await getServerSession(options);
  const email = session?.user?.email;

  if (!email) {
    return {
      user: null,
      session: null,
      error: NextResponse.json(
        { success: false, message: "로그인 정보가 없습니다." },
        { status: 401 },
      ),
    };
  }

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    return {
      user: null,
      session,
      error: NextResponse.json(
        { success: false, message: "로그인 정보가 없습니다." },
        { status: 401 },
      ),
    };
  }

  return { user, session, error: null };
}

export async function getOptionalUser() {
  const session = await getServerSession(options);
  const email = session?.user?.email;
  if (!email) return null;

  await connectDB();
  return User.findOne({ email });
}

export function userIdOf(user: { id?: string; _id?: string }) {
  return String(user.id || user._id || "");
}
