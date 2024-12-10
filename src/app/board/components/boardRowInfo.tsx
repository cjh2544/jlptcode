'use client';
import React, {memo, useState} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";
import { format } from "date-fns";
import CardBoardDetailInfo from "@/app/components/Cards/CardBoardDetailInfo";

type BoardRowInfoProps = {
  boardInfo: Board,
  onClick?: () => void
}

const BoardRowInfo = (props:BoardRowInfoProps) => {
  const { 
    boardInfo, 
    onClick
  } = props;

  const [showReply, setShowReply] = useState(false);

  const handleClickDetail = () => {
    setShowReply(!showReply);
  }

  return (
    <>
      <tr onClick={() => handleClickDetail()} className='cursor-pointer hover:font-bold'>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                  {boardInfo.title}
              </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                  {boardInfo.name}
              </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                  {format(boardInfo.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
              </p>
          </td>
      </tr>
      {showReply && (
        <tr className="even:bg-blue-gray-50/50">
          <td colSpan={4} className="p-4 border-b border-blue-gray-50">
            <CardBoardDetailInfo boardInfo={boardInfo} />
          </td>
        </tr>
      )}
    </>
  );
}

export default memo(BoardRowInfo);
