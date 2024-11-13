import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";

const UserFormData = z.object({
  name: z.string().min(2, "이름은 2자이상 입력해 주세요."),
  email: z.string(),
  password: z.string(),
  // 'confirm-password': z.string(),
});

const DATA_USERS_URL = 'https://jsonplaceholder.typicode.com/users'
const API_KEY: string = process.env.DATA_API_KEY as string


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

  if (validation.success) {
    // 
    await User.create(userInfo);
  } else {
    return NextResponse.json(validation);
  }

  return NextResponse.json({success: true, result: userInfo})
}

export async function DELETE(request: NextRequest) {
  await connectDB();

  const { id }: Partial<User> = await request.json();

  const res = await fetch(`${DATA_USERS_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY,
    }
  });

  return NextResponse.json({ "message": `${id}가 삭제 되었습니다.`})
}