import React, {memo} from "react";
import { useLevelUpStore } from '@/app/store/levelUpStore';
import CardLevelUpQuestion from "@/app/components/Cards/CardLevelUpQuestion";
import CardLevelUpContent from "@/app/components/Cards/CardLevelUpContent";
import CardLevelUpAnswer from "@/app/components/Cards/CardLevelUpAnswer";
import CardAudio from "@/app/components/Cards/CardAudio";
import CardImage from "@/app/components/Cards/CardImage";
import { Button, Typography } from "@material-tailwind/react";

type WordInfoProps = {
  wordInfo?: any
}

const WordInfo = (props:WordInfoProps) => {
  const { wordInfo } = props;
  const { 
    level, 
    year, 
    wordNo, 
    word, 
    read, 
    means, 
    sentence, 
    sentence_read, 
    sentence_translate,
    question
  } = wordInfo;

  // const handleClick = (selectedData: any) => {
  //   setLevelUpAnswer(selectedData);
  // }

  return (
    <>
      <tr className="even:bg-blue-gray-50/50">
        <td className="p-4 border-b border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {year}
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {wordNo}
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            <div className="flex justify-between items-center">
              <p>{word}</p>
              <p>
                <Typography as="a" href="#" variant="small" color="blue" className="font-normal">
                  [隠す]
                </Typography>
              </p>
            </div> 
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            <div className="flex justify-between items-center">
              <p>{read}</p>
              <p>
                <Typography as="a" href="#" variant="small" color="blue" className="font-normal">
                  [隠す]
                </Typography>
              </p>
            </div> 
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            <div className="flex justify-between items-center">
              <p>{means}</p>
              <p>
                <Typography as="a" href="#" variant="small" color="blue" className="font-normal">
                  [隠す]
                </Typography>
              </p>
            </div> 
          </Typography>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Typography as="a" href="#" variant="small" color="blue" className="font-normal">
            [確認]
          </Typography>
        </td>
      </tr>
    </>
  );
}

export default memo(WordInfo);
