import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string;

const UserFormData = z.object({
  name: z.string().min(2, "이름은 2자이상 입력해 주세요.").max(20, "이름은 최대 20자리까지 입력해 주세요."),
  email: z.string().email("이메일 형식이 올바르지 않습니다.").max(100, "이메일은 최대 100자리까지 입력해 주세요."),
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
  'confirm-password': z.string().min(6, "비밀번호 확인은 6자이상 입력해 주세요.").max(20, "비밀번호 확인은 최대 20자리까지 입력해 주세요."),
}).refine((data) => data.password === data[`confirm-password`], {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm-password"], // path of error
});

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  const userList = await User.find().select('-password');

  return NextResponse.json(userList)
}

export async function POST(req: NextRequest, res: NextResponse) {
  await connectDB();
  const body = await req.formData();
  const userInfo = Object.fromEntries(body.entries());
  const validation = UserFormData.safeParse(userInfo);
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  if (validation.success) {
    // 회원정보 조회
    const existUserInfo = await User.find({
      email: userInfo.email,
      provider: 'credentials'
    })

    if(isEmpty(existUserInfo)) {
      await User.create({
        ...userInfo,
        password: bcrypt.hashSync(userInfo.password as string, Number(BCRYPT_SALT_ROUNDS))
      });
      resultInfo = { success: true, message: '회원가입이 완료 되었습니다.' };
    } else {
      resultInfo = { success: false, message: '이미 등록된 이메일 입니다.' };
    }
  } else {
    resultInfo = validation;
  }

  return NextResponse.json(resultInfo)
}

export async function DELETE(request: NextRequest) {
  await connectDB();

  // const { id }: Partial<User> = await request.json();

  // const res = await fetch(`${DATA_USERS_URL}/${id}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': API_KEY,
  //   }
  // });

  return NextResponse.json({ "message": `삭제 되었습니다.`})
}