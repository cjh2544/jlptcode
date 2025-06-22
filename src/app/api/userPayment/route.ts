import User from "@/app/models/userModel";
import UserPayment from "@/app/models/userPaymentModel";
import connectDB from "@/app/utils/database";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { options } from "../auth/[...nextauth]/options";
import { PAYMENT_PERIOD, USER_ROLE } from "@/app/constants/constants";

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string;

const UserPaymentFormData = z.object({
  paymentType: z.string({ message: "유료구분이 선택되지 않았습니다." }),
  email: z.string({ message: "이메일이 입력되지 않았습니다." }).email("이메일 형식이 올바르지 않습니다.").max(100, "이메일은 최대 100자리까지 입력해 주세요."),
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

// export async function GET(request: NextRequest) {
//   await connectDB();

//   const { searchParams } = new URL(request.url);

//   const userList = await User.find().select('-password');

//   return NextResponse.json(userList)
// }

export async function POST(req: NextRequest, res: NextResponse) {
  let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };
  const session = await getSession();

  // if(!session?.user?.role?.includes(USER_ROLE.ADMIN)) {
  //   resultInfo = { success: false, message: '처리 권한이 없습니다.' };
  //   return NextResponse.json(resultInfo);
  // }

  const body = await req.formData();
  const userPaymentInfo = Object.fromEntries(body.entries());
  const validation = UserPaymentFormData.safeParse(userPaymentInfo);
  
  if (validation.success) {
    await connectDB();

    // 회원정보 조회
    const userInfo:any = await User.find({
      email: userPaymentInfo.email
    });

    if(isEmpty(userInfo)) {
      resultInfo = { success: false, message: '회원정보가 없습니다.' };
    } else {

      // 회원 결제정보 조회
      const userPayInfo:any = await UserPayment.findOne({
        email: userPaymentInfo.email
      });

      // 조건: 항목이 input 범위와 겹치면 포함
      const filtered = userPayInfo?.payments[userPayInfo?.payments.length - 1];
      let sDate = new Date();
      let eDate = new Date();

      if(filtered) {
        // 유효기간이 남아 있을 경우
        if(filtered.endDate > new Date()) {
          sDate = new Date(filtered.startDate.getTime());
          eDate = new Date(filtered.endDate.getTime());
        }
      }

      // 결제구분
      if('M' === userPaymentInfo.paymentType) {
        if(eDate < new Date('9999-12-31')) {
          // 한달
          eDate.setMonth(eDate.getMonth() + 1);
        }
      } else if('Y' === userPaymentInfo.paymentType) {
        if(eDate < new Date('9999-12-31')) {
          // 1년
          eDate.setFullYear(eDate.getFullYear() + 1);
        }
      } else if('P' === userPaymentInfo.paymentType) {
        // 프리미엄
        eDate = new Date('9999-12-31');
      } else if('U' === userPaymentInfo.paymentType) {
        // 평생회원
        eDate = new Date('9999-12-31');
      }

      // 기간 계산
      let paymentInfo: any = {
        paymentType: userPaymentInfo.paymentType,
        startDate: sDate,
        endDate: eDate,
      }

      // 등록된 정보가 없을 경우
      if(isEmpty(userPayInfo)) {
        const resultInsert = await UserPayment.create({
          email: userPaymentInfo.email,
          payments: [
            paymentInfo
          ]
        });

        if(isEmpty(resultInsert)) {
          resultInfo = { success: false, message: '처리되지 않았습니다.' };
        } else {
          resultInfo = { success: true, message: '정상처리 되었습니다.' };
        }
      } else {
        const resultUpdate = await UserPayment.updateOne({
          email: userPaymentInfo.email,
        }, {
          $push: { payments: paymentInfo }
        });
        
        if(isEmpty(resultUpdate)) {
          resultInfo = { success: false, message: '처리되지 않았습니다.' };
        } else {
          resultInfo = { success: true, message: '정상처리 되었습니다.' };
        }
      }

    }
  } else {
    resultInfo = validation;
  }

  return NextResponse.json(resultInfo)
}  

// export async function PATCH(req: NextRequest, res: NextResponse) {
//   let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

//   const session = await getServerSession();

//   if(!session?.user?.email) {
//     resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
//   } else {
//     await connectDB();
//     const body = await req.formData();
//     const userInfo = Object.fromEntries(body.entries());
//     const validation = UserUpdateFormData.safeParse(userInfo);

//     if (validation.success) {
//       const resultUpdate = await User.updateOne({
//         email: session?.user.email
//       }, 
//       {
//         ...userInfo,
//         password: bcrypt.hashSync(userInfo.password as string, Number(BCRYPT_SALT_ROUNDS))
//       });
      
//       if(isEmpty(resultUpdate) || isEmpty(resultUpdate.modifiedCount === 0)) {
//         resultInfo = { success: false, message: '처리 되지 않았습니다.' };
//       } else {
//         resultInfo = { success: true, message: '회원정보가 수정 되었습니다.' };
//       }
//     } else {
//       resultInfo = validation;
//     }
//   }

//   return NextResponse.json(resultInfo)
// }

// export async function DELETE(req: NextRequest, res: NextResponse) {
//   let resultInfo: {success: boolean, result?: any, message?: string | undefined} = { success: false };

//   const session = await getServerSession();

//   if(!session?.user?.email) {
//     resultInfo = { success: false, message: '로그인 정보가 없습니다.' };
//   } else {
//     await connectDB();
//     const body = await req.formData();
//     const userInfo = Object.fromEntries(body.entries());
//     const validation = UserDeleteFormData.safeParse(userInfo);

//     if (validation.success) {
//       // 회원정보 조회
//       const existUserInfo = await User.findOne({
//         email: session?.user.email,
//         provider: 'credentials'
//       });

//       if(isEmpty(existUserInfo)) {
//         resultInfo = { success: false, message: '회원정보가 없습니다.' };
//       } else {
//         const matchPassword = bcrypt.compareSync(userInfo.password as string
//           , existUserInfo.password)
        
//         if(matchPassword) {
//           // 삭제
//           const deleteInfo = await User.deleteOne({
//             email: session?.user.email,
//             provider: 'credentials'
//           });

//           if(isEmpty(deleteInfo) || deleteInfo.deletedCount !== 1) {
//             resultInfo = { success: false, message: '처리 되지 않았습니다.' };
//           } else {
//             resultInfo = { success: true, message: '회원정보가 삭제 되었습니다.' };
//           }
//         } else {
//           resultInfo = { success: false, message: '비밀번호가 일치하지 않습니다.' };
//         }
//       }
//     } else {
//       resultInfo = validation;
//     }
//   }

//   return NextResponse.json(resultInfo)
// }