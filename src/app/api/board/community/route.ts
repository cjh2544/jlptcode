import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import { getServerSession } from "next-auth";
import BoardCommunity from "@/app/models/boardCommunityModel";

const BoardFormData = z.object({
  title: z.string().min(2, "제목은 2자이상 입력해 주세요.").max(100, "제목은 최대 100자리까지 입력해 주세요."),
  contents: z.string().min(2, "내용은 2자이상 입력해 주세요.").max(5000, "내용은 최대 5000자리까지 입력해 주세요."),
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

  if(!session?.user?.email) {
    resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
  } else {
    if (validation.success) {
      const resultInsert = await BoardCommunity.create({
        ...boardInfo,
        email: session.user.email,
        name: session.user.name,
      });

      if(isEmpty(resultInsert)) {
        resultInfo = { success: false, message: '등록 되지 않았습니다.' };
      } else {
        resultInfo = { success: true, message: '등록 되었습니다.' };
      }
    } else {
      resultInfo = validation;
    }
  }

  return NextResponse.json(resultInfo)
}  

export async function PATCH(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();
  const boardInfo = await req.json();

  if(!session?.user?.email) {
    return NextResponse.json({ success: false, message: '로그인 정보가 없습니다.' })
  }
  
  if(boardInfo.email !== session.user.email) {
    return NextResponse.json({ success: false, message: '수정 권한이 없습니다.' })
  }

  const validation = BoardFormData.safeParse(boardInfo);
  
  if (validation.success) {
    await connectDB();

    const resultUpdate = await BoardCommunity.updateOne({
      _id: boardInfo._id,
      email: session.user.email
    }, {
      title: boardInfo.title,
      contents: boardInfo.contents
    });
    
    if(isEmpty(resultUpdate) || resultUpdate.modifiedCount === 0) {
      resultInfo = { success: false, message: '처리 되지 않았습니다.' };
    } else {
      resultInfo = { success: true, message: '수정 되었습니다.' };
    }
  } else {
    resultInfo = validation;
  }

  return NextResponse.json(resultInfo)
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

  const session = await getServerSession();
  const boardInfo = await req.json();

  if(!session?.user?.email) {
    resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
  } else {
    await connectDB();

    // 게시판 등록정보 조회
    const existBoardInfo = await BoardCommunity.findOne({
      _id: boardInfo._id,
      email: session.user.email
    });

    if(isEmpty(existBoardInfo)) {
      resultInfo = { success: false, message: '등록된 정보가 없습니다.' };
    } else {
      const matchEmail = boardInfo.email as string === existBoardInfo.email;
      
      if(matchEmail) {
        // 삭제
        const deleteInfo = await BoardCommunity.deleteOne({
          _id: boardInfo._id,
          email: session?.user.email
        });

        if(isEmpty(deleteInfo) || deleteInfo.deletedCount !== 1) {
          resultInfo = { success: false, message: '처리 되지 않았습니다.' };
        } else {
          resultInfo = { success: true, message: '삭제 되었습니다.' };
        }
      } else {
        resultInfo = { success: false, message: '삭제 권한이 없습니다.' };
      }
    }
  }

  return NextResponse.json(resultInfo)
}