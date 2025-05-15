import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { isEmpty } from "lodash";
import { Button, Card, CardBody, Collapse, Typography } from "@material-tailwind/react";

type LevelUpQuestionProps = {
  questionType?: string,
  question: any,
  id?: string
  questionNo?: number,
  sentence?: any,
  showReadButton?: boolean,
  showTransButton?: boolean,
}

const CardLevelUpQuestion = (props:LevelUpQuestionProps) => {
  const {questionType, question, id = '', questionNo, sentence = {}, showReadButton = true, showTransButton = true} = props;
  const {content = '', audio = {}, image = {}, translate, read} = question;
  const {translation, reading} = sentence;
  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);
  
  const parseHtml = (html: string) => {
    return html ? <div dangerouslySetInnerHTML={{ __html: html.toString().replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} /> : <></>;
  };

  return (
    <>
      <div className="flex flex-col min-w-0 break-words rounded mb-1">
        <div className={`flex-auto px-4 py-2 rounded-lg ${questionType === 'group' ? 'bg-green-400' : 'bg-green-100'}`}>
          <div className="flex flex-wrap" id={id}>
            <div className="mr-1">{`${questionNo ? questionNo + '.' : ''}`}</div>
            <div>{parseHtml(content || '')}</div>
            {showReadButton && reading && (
              <span><Button onClick={toggleOpenRead} className="px-2 py-1 inline">읽기</Button></span>
            )}
            {showTransButton && translation && (
              <span><Button onClick={toggleOpenTranslate} className="px-2 py-1 inline ml-1">해석</Button></span>
            )}
          </div>
          {openRead && (
            <div className="flex flex-wrap">
              <Collapse open={openRead} className="w-full mt-1">
                <Card>
                  <CardBody className="px-3 py-2 font-nanumGothic">
                    {parseHtml(reading || '')}
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          )}
          {openTranslate && (
            <div className="flex flex-wrap">
              <Collapse open={openTranslate} className="w-full mt-1">
                <Card>
                  <CardBody className="px-3 py-2 font-nanumGothic">
                    {parseHtml(translation || '')}
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          )}
        </div>
        {!isEmpty(audio) && (
          <div className="flex-auto p-2">
            <CardAudio audio={audio} />
          </div>
        )}
        {!isEmpty(image) && (
          <div className="flex-auto p-2">
            <CardImage image={image} />
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CardLevelUpQuestion);
