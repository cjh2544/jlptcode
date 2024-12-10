import { isEmpty } from "lodash";
import React, {memo, useState} from "react";
import { Card, CardBody, CardFooter, CardHeader, Radio, Typography } from "@material-tailwind/react";

type BoardDetailProps = {
  boardInfo: Board,
  replyInfo?: BoardReply,
}

const CardBoardDetailInfo = (props:BoardDetailProps) => {
  const { boardInfo, replyInfo } = props;
  const { title, contents, name, createdAt } = boardInfo;

  const parseHtml = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
  };

  return (
    <>
      <Card className="w-full">
        <CardBody>
          <div className="mb-2 font-normal mx-auto">
            {title}
          </div>
        </CardBody>
        <CardFooter className={`pt-0`}>
          <div className={`relative w-full flex items-center font-bold px-4 py-3 rounded-md`}>
            <div>{parseHtml(contents as string)}</div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default memo(CardBoardDetailInfo);
