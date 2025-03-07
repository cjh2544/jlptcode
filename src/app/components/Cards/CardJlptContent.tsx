import { isEmpty } from "lodash";
import React, {memo} from "react";
import CardAudio from "./CardAudio";
import CardImage from "./CardImage";
import { Button, Card, CardBody, Collapse, Typography } from "@material-tailwind/react";

type JlptContentProps = {
  questionType?: string,
  question?: any,
  sentence?: any,
}

const CardJlptContent = (props:JlptContentProps) => {
  const {questionType, question, sentence = {}} = props;
  const {content = '', audio = {}, image = {}} = question;
  const {translation, reading} = sentence;

  const [openTranslate, setOpenTranslate] = React.useState(false);
  const [openRead, setOpenRead] = React.useState(false);
  const toggleOpenTranslate = () => setOpenTranslate((cur) => !cur);
  const toggleOpenRead = () => setOpenRead((cur) => !cur);

  const parseHtml = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html.replaceAll('\\r\\n', '<br>').replaceAll('\\n', '<br>').replaceAll(/\s/g, "&nbsp;") }} />;
  };

  return (
    <>
      <div className="flex flex-col min-w-0 break-words rounded mb-1">
        {!isEmpty(content) && (<div className="flex-auto px-4 py-2">
          <div className="flex flex-wrap">
            <div className="bg-blueGray-200 rounded-lg p-4 flex-col">
              {parseHtml(content || '')}
              {sentence?.translation && (
                <span><Button onClick={toggleOpenTranslate} className="px-2 py-1">해석</Button></span>
              )}
              {sentence?.reading && (
                <span><Button onClick={toggleOpenRead} className="px-2 py-1 ml-1">읽기</Button></span>
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
              {openRead && (
                <div className="flex flex-wrap">
                  <Collapse open={openRead} className="w-full mt-1">
                    <Card>
                      <CardBody className="px-3 py-2 font-nanumGothic">
                        {parseHtml(sentence?.reading || '')}
                      </CardBody>
                    </Card>
                  </Collapse>
                </div>
              )}
            </div>
          </div>
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

export default memo(CardJlptContent);
