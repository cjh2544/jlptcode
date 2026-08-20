import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { hashSync } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string;

const Schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "비밀번호는 6자이상 입력해 주세요.")
    .max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
});

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const body = await request.json();
  const validation = Schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  const { email, password } = validation.data;

  const result = await User.updateOne(
    { email },
    { password: hashSync(password, Number(BCRYPT_SALT_ROUNDS)) }
  );

  if (!result || result.modifiedCount === 0) {
    return NextResponse.json({ success: false, message: "처리되지 않았습니다." });
  }

  return NextResponse.json({
    success: true,
    message: "비밀번호가 초기화되었습니다.",
  });
}
