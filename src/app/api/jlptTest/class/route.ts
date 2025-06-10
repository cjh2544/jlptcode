import JlptTest from "@/app/models/jlptTestModel";
import connectDB from "@/app/utils/database";
import { sortBy } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  await connectDB();
  
  const searchParams = request.nextUrl.searchParams;
  
  const jlptTestClassInfo = await JlptTest.aggregate([
    { 
      '$group' : {
        _id: {
          level: "$level",
          classification: "$classification",
        },
        'tests' : {'$addToSet' : { $concat: ['$test']}}
      }
    },
    { 
      '$group' : {
        _id: {
          level: "$_id.level",
        },
        classifications : { 
          $push: { 
            classification: '$_id.classification', 
            years: {
              $sortArray: { input: "$tests", sortBy: 1 }
            },
            classificationNm: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id.classification', 'vocabulary'] }, then: '[ 문자어휘 / 文字語彙 / Vocabulary ]' },
                  { case: { $eq: ['$_id.classification', 'grammar'] }, then: '[ 문법 / 文法 / Grammar ]' },
                  { case: { $eq: ['$_id.classification', 'reading'] }, then: '[ 독해 / 読解 / Reading ]' },
                  { case: { $eq: ['$_id.classification', 'listening'] }, then: '[ 청해 / 聴解 / Listening ]' },
                ],
                default: ''
              }
            },
            sortNo: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id.classification', 'vocabulary'] }, then: '0' },
                  { case: { $eq: ['$_id.classification', 'grammar'] }, then: '1' },
                  { case: { $eq: ['$_id.classification', 'reading'] }, then: '2' },
                  { case: { $eq: ['$_id.classification', 'listening'] }, then: '3' },
                ],
                default: 4
              }
            }
          } 
        }
      }
    },
    {
      $project: {
        _id: 0,
        level: '$_id.level',
        classifications: {
          $sortArray: { input: "$classifications", sortBy: { sortNo: 1 } }
        }
      }
    },
    { $sort: { level: 1 } },
  ]);

  return NextResponse.json(jlptTestClassInfo)
}