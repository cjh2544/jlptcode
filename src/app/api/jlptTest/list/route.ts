import JlptTest from "@/app/models/jlptTestModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const conditions = await request.json();
  const { level, classification, test } = conditions.params || {};
  if (!level || !classification || !test) {
    return NextResponse.json([]);
  }

  const jlptList = await JlptTest.find({ level, classification, test }).sort({ sortNo: 1 }).exec();
  
  // const userList = await User.find().select('-password');

  return NextResponse.json(jlptList)
}