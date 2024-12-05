import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

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

const UserUpdateFormData = z.object({
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
  'confirm-password': z.string().min(6, "비밀번호 확인은 6자이상 입력해 주세요.").max(20, "비밀번호 확인은 최대 20자리까지 입력해 주세요."),
}).refine((data) => data.password === data[`confirm-password`], {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm-password"], // path of error
});

const UserDeleteFormData = z.object({
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
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

export async function PATCH(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();

  if(!session?.user.email) {
    resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
  } else {
    await connectDB();
    const body = await req.formData();
    const userInfo = Object.fromEntries(body.entries());
    const validation = UserUpdateFormData.safeParse(userInfo);

    if (validation.success) {
      const resultUpdate = await User.updateOne({
        email: session?.user.email
      }, 
      {
        ...userInfo,
        password: bcrypt.hashSync(userInfo.password as string, Number(BCRYPT_SALT_ROUNDS))
      });
      
      if(isEmpty(resultUpdate)) {
        resultInfo = { success: false, message: '처리 되지 않았습니다.' };
      } else {
        resultInfo = { success: true, message: '회원정보가 수정 되었습니다.' };
      }
    } else {
      resultInfo = validation;
    }
  }

  return NextResponse.json(resultInfo)
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();

  if(!session?.user.email) {
    resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
  } else {
    await connectDB();
    const body = await req.formData();
    const userInfo = Object.fromEntries(body.entries());
    const validation = UserDeleteFormData.safeParse(userInfo);

    if (validation.success) {
      // 회원정보 조회
      const existUserInfo = await User.findOne({
        email: session?.user.email,
        provider: 'credentials'
      });

      if(isEmpty(existUserInfo)) {
        resultInfo = { success: false, message: '회원정보가 없습니다.' };
      } else {
        const matchPassword = bcrypt.compareSync(userInfo.password as string
          , existUserInfo.password)
        
        if(matchPassword) {
          // 삭제
          const deleteInfo = await User.deleteOne({
            email: session?.user.email,
            provider: 'credentials'
          });

          if(isEmpty(deleteInfo) || deleteInfo.deletedCount !== 1) {
            resultInfo = { success: false, message: '처리 되지 않았습니다.' };
          } else {
            resultInfo = { success: true, message: '회원정보가 삭제 되었습니다.' };
          }
        } else {
          resultInfo = { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }
      }
    } else {
      resultInfo = validation;
    }
  }

  return NextResponse.json(resultInfo)
}