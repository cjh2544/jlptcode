'use client';
import React, {memo, MouseEvent, useEffect, useState} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import CardJlptQuestion from "@/app/components/Cards/CardJlptQuestion";
import CardWordQuestion from "@/app/components/Cards/CardWordQuestion";
import { playSpeech } from "@/app/utils/openai";
import { format } from "date-fns";
import CardBoardDetailInfo from "@/app/components/Cards/CardBoardDetailInfo";
import { useBoardReplyInfo } from "@/app/swr/useBoardReply";
import { isEmpty } from "lodash";

type BoardRowInfoProps = {
  boardInfo: Board,
  // showReply?: boolean,
  onClickReply?: () => void
  onClickDetail?: (boardInfo: Board) => void
}

const BoardRowInfo = (props:BoardRowInfoProps) => {
  const { 
    boardInfo, 
    onClickDetail
  } = props;

  const [showReply, setShowReply] = useState(false);

  const {data: replyInfo = {}, isLoading, error} = useBoardReplyInfo({params: {boardId: boardInfo._id}});

  const handleClickDetail = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onClickDetail && onClickDetail(boardInfo);
  }

  const handleClickReply = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setShowReply
  }

  useEffect(() => {
    setShowReply(false);
  }, [boardInfo]);

  return (
    <>
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm items-center whitespace-no-wrap">
          <div className="flex gap-2">
            <p onClick={handleClickDetail} className="text-gray-900 cursor-pointer hover:font-bold underline underline-offset-4">
                {boardInfo.title}
            </p>
            {!isEmpty(replyInfo) && (
              <button type="button" onClick={() => setShowReply(!showReply)} className="focus:outline-none text-xs bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-md">
                답변완료
              </button>
            )}
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
            <p className="text-gray-900">
                {boardInfo.name}
            </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
            <p className="text-gray-900">
                {format(boardInfo.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
            </p>
        </td>
      </tr>
      {showReply && (
        <tr className="even:bg-blue-gray-50/50">
          <td colSpan={4} className="p-4 border-b border-blue-gray-50">
            <CardBoardDetailInfo boardInfo={boardInfo} replyInfo={replyInfo} />
          </td>
        </tr>
      )}
    </>
  );
}

export default memo(BoardRowInfo);
