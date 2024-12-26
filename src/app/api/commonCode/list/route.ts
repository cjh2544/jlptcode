import Code from "@/app/models/codeModel";
import connectDB from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const { codeList } = await request.json();
  
  
  // const result = await Code.find({ code: { $in: codeList } })
  //   .populate('details').exec();

  const result = await Code.aggregate([ 
    { $match: { code: { $in: codeList }}},
    { 
      $lookup: { 
        from: 'code_detail', 
        localField: 'code', 
        foreignField: 'code', 
        as: 'details' 
      },
    },
    { $sort : { sort : 1, "details.sort": -1} },
  ]);

  return NextResponse.json(result)
}