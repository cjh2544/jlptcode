import { isEmpty } from "lodash";
import React, {memo} from "react";
import { Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { format } from "date-fns";
import { formatInSeoul } from "@/app/utils/common";

type BoardDetailProps = {
  boardInfo: Board,
  replyInfo?: BoardReply,
}

const CardBoardDetailInfo = (props:BoardDetailProps) => {
  const { boardInfo, replyInfo } = props;

  return (
    <>
      <Card className="w-full">
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-2 flex gap-2 justify-between items-center">
            <span>{boardInfo?.title}</span>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {formatInSeoul(boardInfo?.updatedAt ||  boardInfo?.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </Typography>
          <div style={{ whiteSpace: "pre-wrap" }}>{boardInfo?.contents as string}</div>
        </CardBody>
        {!isEmpty(replyInfo) && (
          <CardFooter className={`border-t`}>
            <Typography variant="h6" color="blue-gray" className="mb-2 flex gap-2 justify-between items-center">
              <span>답변</span>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {formatInSeoul(replyInfo?.updatedAt ||  replyInfo?.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
              </span>
            </Typography>
            <div style={{ whiteSpace: "pre-wrap" }}>{replyInfo?.contents as string}</div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

export default memo(CardBoardDetailInfo);
