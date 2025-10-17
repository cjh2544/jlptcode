import { isEmpty } from "lodash";
import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { Button, Card, CardBody, Collapse, Typography } from "@material-tailwind/react";

type JlptQuestionProps = {
  classification?: string,
  questionType?: string,
  question: any,
  id?: string,
  sentence?: any,
  showReadButton?: boolean,
  showTransButton?: boolean,
  speaker?: string,
}

const CardJlptQuestion = (props:JlptQuestionProps) => {
  const {classification, questionType, question, id = '', sentence, showReadButton = true, showTransButton = true, speaker} = props;
  const {content = '', audio = {}, image = {}} = question;
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
        {!isEmpty(content) && (
          <div className={`flex-auto px-4 py-2 rounded-lg ${questionType === 'group' ? 'bg-green-400' : 'bg-green-100'}`}>
            <div className="flex flex-wrap" id={id}>
              {parseHtml(content || '')}
              {showReadButton && sentence?.reading && (
                <span>
                  <Button onClick={toggleOpenRead} className="px-2 py-1 ml-1">
                    {classification === 'listening' ? '문장' : '읽기'}
                  </Button>
                </span>
              )}
              {showTransButton && sentence?.translation && (
                <span><Button onClick={toggleOpenTranslate} className="px-2 py-1 ml-1">해석</Button></span>
              )}
            </div>
            {speaker && <div className="py-1"><CardAudio audio={{name: '', link: speaker}} /></div>}
            {openRead && (
              <div className="flex flex-wrap">
                <Collapse open={openRead} className="w-full mt-1">
                  <Card>
                    <CardBody className="px-3 py-2">
                      {parseHtml(sentence?.reading || '')}
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
                      {parseHtml(sentence?.translation || '')}
                    </CardBody>
                  </Card>
                </Collapse>
              </div>
            )}
          </div>
        )}
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

export default memo(CardJlptQuestion);
