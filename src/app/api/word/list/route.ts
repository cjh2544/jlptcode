import GrammarToday from "@/app/models/grammarTodayModel";
import User from "@/app/models/userModel";
import Word from "@/app/models/wordModel";
import WordToday from "@/app/models/wordTodayModel";
import connectDB from "@/app/utils/database";
import { isEmpty, unset } from "lodash";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await connectDB();
  
  const {pageInfo, searchInfo} = await request.json();

  const { wordType } = searchInfo;

  if(isEmpty(searchInfo.parts)) {
    unset(searchInfo, 'parts');
  }

  unset(searchInfo, 'wordType');
  unset(searchInfo, 'wordShowType');

  let wordList:any = [];
  let wordSearchInfo = {};

  if(wordType === '1') {
    unset(searchInfo, 'year');
  } else {
    unset(searchInfo, 'parts');
    unset(searchInfo, 'type');

    if(isEmpty(searchInfo.year)) {
      unset(searchInfo, 'year');
    }

    wordSearchInfo = {...searchInfo, level: 'N' + searchInfo.level }
  }

  if(wordType === '1') {
    wordList = await Word.find(searchInfo)
      .limit(pageInfo.pageSize * 1)
      .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
      .exec();
  } else if(wordType === '2') {
    wordList = await WordToday.find(wordSearchInfo)
      .limit(pageInfo.pageSize * 1)
      .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
      .exec();
  } else if(wordType === '3') {
    wordList = await WordToday.find(wordSearchInfo)
      .limit(pageInfo.pageSize * 1)
      .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
      .exec();

    wordList.map((data: any) => {
      data.word = data.sentence;
      data.read = data.sentence_read;
      data.means = data.sentence_translate;

      return data;
    });
  } else if(wordType === '4') {
    wordList = await GrammarToday.find(wordSearchInfo)
      .limit(pageInfo.pageSize * 1)
      .skip((pageInfo.currentPage - 1) * pageInfo.pageSize)
      .exec();

    wordList = wordList.map((data: any) => {
      return {
        ...data, 
        word: data.sentence,
        read: data.sentence_read,
        means: data.sentence_translate
      };
    });
  }

  return NextResponse.json(wordList)
}