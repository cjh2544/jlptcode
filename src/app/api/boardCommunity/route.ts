import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import BoardCommunity from "@/app/models/boeadCommunityModel";

const BoardFormData = z.object({
  name: z.string().min(2, "이름은 2자이상 입력해 주세요.").max(20, "이름은 최대 20자리까지 입력해 주세요."),
  email: z.string().email("이메일 형식이 올바르지 않습니다.").max(100, "이메일은 최대 100자리까지 입력해 주세요."),
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
  'confirm-password': z.string().min(6, "비밀번호 확인은 6자이상 입력해 주세요.").max(20, "비밀번호 확인은 최대 20자리까지 입력해 주세요."),
}).refine((data) => data.password === data[`confirm-password`], {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm-password"], // path of error
});

const BoardUpdateFormData = z.object({
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
  'confirm-password': z.string().min(6, "비밀번호 확인은 6자이상 입력해 주세요.").max(20, "비밀번호 확인은 최대 20자리까지 입력해 주세요."),
}).refine((data) => data.password === data[`confirm-password`], {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm-password"], // path of error
});

const BoardDeleteFormData = z.object({
  password: z.string().min(6, "비밀번호는 6자이상 입력해 주세요.").max(20, "비밀번호는 최대 20자리까지 입력해 주세요."),
});

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);

  // const communityList = await BoardCommunity.find().select('-password');
  const communityList = await BoardCommunity.find(searchParams);

  return NextResponse.json(communityList)
}

export async function POST(req: NextRequest, res: NextResponse) {
  await connectDB();
  const body = await req.formData();
  const boardInfo = Object.fromEntries(body.entries());
  const validation = BoardFormData.safeParse(boardInfo);
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();

  if(!session?.user.email) {
    resultInfo = { success: true, message: '로그인 정보가 없습니다.' };
  } else {
    if (validation.success) {
      await BoardCommunity.create(boardInfo);

      resultInfo = { success: true, message: '등록 되었습니다.' };
    } else {
      resultInfo = validation;
    }
  }

  return NextResponse.json(resultInfo)
}  

export async function PATCH(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();

  if(!session?.user.email) {
    resultInfo = { success: true, message: '로그인 정보가 없습니다.' };
  } else {
    await connectDB();
    const body = await req.formData();
    const boardInfo = Object.fromEntries(body.entries());
    const validation = BoardUpdateFormData.safeParse(boardInfo);

    if (validation.success) {
      const resultUpdate = await BoardCommunity.updateOne({
        email: session?.user.email,
        _id: boardInfo.id
      }, boardInfo);
      
      if(isEmpty(resultUpdate)) {
        resultInfo = { success: false, message: '처리 되지 않았습니다.' };
      } else {
        resultInfo = { success: true, message: '수정 되었습니다.' };
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
    resultInfo = { success: true, message: '로그인 정보가 없습니다.' };
  } else {
    await connectDB();
    const body = await req.formData();
    const boardInfo = Object.fromEntries(body.entries());
    const validation = BoardDeleteFormData.safeParse(boardInfo);

    if (validation.success) {
      // 게시판 등록정보 조회
      const existBoardInfo = await BoardCommunity.findOne({
        _id: boardInfo.id,
      });

      if(isEmpty(existBoardInfo)) {
        resultInfo = { success: false, message: '등록된 정보가 없습니다.' };
      } else {
        const matchEmail = boardInfo.email as string === existBoardInfo.email;
        
        if(matchEmail) {
          // 삭제
          const deleteInfo = await BoardCommunity.deleteOne({
            email: session?.user.email,
            id: boardInfo.id
          });

          if(isEmpty(deleteInfo) || deleteInfo.deletedCount !== 1) {
            resultInfo = { success: false, message: '처리 되지 않았습니다.' };
          } else {
            resultInfo = { success: true, message: '삭제 되었습니다.' };
          }
        } else {
          resultInfo = { success: false, message: '등록된 정보가 일치하지 않습니다.' };
        }
      }
    } else {
      resultInfo = validation;
    }
  }

  return NextResponse.json(resultInfo)
}