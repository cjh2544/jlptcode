"use client";

import { isEmpty } from "lodash";
import React, {memo} from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatInSeoul } from "@/app/utils/common";
import { useTranslations } from "@/app/providers/I18nProvider";

type BoardDetailProps = {
  boardInfo: Board,
  replyInfo?: BoardReply,
}

const CardBoardDetailInfo = (props:BoardDetailProps) => {
  const { boardInfo, replyInfo } = props;
  const { t } = useTranslations();

  return (
    <>
      <Card className="w-full">
        <CardContent>
          <h6 className="mb-2 flex gap-2 justify-between items-center text-base font-semibold text-blue-gray-900">
            <span>{boardInfo?.title}</span>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {formatInSeoul(boardInfo?.updatedAt ||  boardInfo?.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </h6>
          <div style={{ whiteSpace: "pre-wrap" }}>{boardInfo?.contents as string}</div>
        </CardContent>
        {!isEmpty(replyInfo) && (
          <CardFooter className={`border-t`}>
            <div className="w-full">
              <h6 className="mb-2 flex gap-2 justify-between items-center text-base font-semibold text-blue-gray-900">
                <span>{t('board.reply')}</span>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {formatInSeoul(replyInfo?.updatedAt ||  replyInfo?.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </h6>
              <div style={{ whiteSpace: "pre-wrap" }}>{replyInfo?.contents as string}</div>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

export default memo(CardBoardDetailInfo);
