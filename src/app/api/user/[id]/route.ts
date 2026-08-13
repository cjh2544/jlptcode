import User from "@/app/models/userModel";
import connectDB from "@/app/utils/database";
import { requireAdmin } from "@/app/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB()
  const { id } = await params;
  // .select('-password') 비밀번호는 빼고 조회
  const user = await User.findOne({_id: id}).select('-password');

  return NextResponse.json(user)
}