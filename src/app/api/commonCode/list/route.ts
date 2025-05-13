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
    { $sort : { sort : 1 } },
    { 
      $lookup: { 
        from: 'code_detail', 
        localField: 'code', 
        foreignField: 'code', 
        as: 'details' 
      },
    },
    {
      $project: {
        _id: '$_id',
        code: '$code',
        name: '$name',
        sort: '$sort',
        details: {
          $sortArray: { input: "$details", sortBy: { sort: 1 } }
        }
      }
    },
  ]);

  return NextResponse.json(result)
}