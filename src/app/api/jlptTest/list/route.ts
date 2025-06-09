import JlptTest from "@/app/models/jlptTestModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const jlptList = await JlptTest.find(conditions.params).sort({'sortNo': 1}).exec();

  
  // const userList = await User.find().select('-password');

  return NextResponse.json(jlptList)
}