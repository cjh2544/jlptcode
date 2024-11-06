'use client';
import React, {memo} from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";

type WordInfoProps = {
  wordInfo: any
  onClick?: any
}

const WordInfo = (props:WordInfoProps) => {
  const { 
    wordInfo, 
    onClick
  } = props;
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
    question,
    hideWord = false,
    hideRead = false,
    hideMeans = false
  } = wordInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('word' === colType) {
      visibleInfo = { hideWord: !hideWord };
    } else if('read' === colType) {
      visibleInfo = { hideRead: !hideRead };
    } else if('means' === colType) {
      visibleInfo = { hideMeans: !hideMeans };
    }

    onClick && onClick({...wordInfo, ...visibleInfo});
  }

  return (
    <>
      <tr className="even:bg-blue-gray-50/50">
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {year}
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            {wordNo}
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideWord ? 'invisible' : ''}`}>{word}</p>
              {/* <button onClick={(e) => handleClick('word')} className="text-blue-500 focus:outline-none">[隠す]</button> */}
              <button onClick={(e) => handleClick('word')} className="text-blue-500 focus:outline-none">
                <i className={`${hideWord ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
              </button>
            </div> 
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideRead ? 'invisible' : ''}`}>{read}</p>
              {/* <button onClick={(e) => handleClick('read')} className="text-blue-500 focus:outline-none">[隠す]</button> */}
              <button onClick={(e) => handleClick('read')} className="text-blue-500 focus:outline-none">
                <i className={`${hideRead ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
              </button>
            </div> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideMeans ? 'invisible' : ''}`}>{means}</p>
              {/* <button onClick={(e) => handleClick('means')} className="text-blue-500 focus:outline-none">[隠す]</button> */}
              <button onClick={(e) => handleClick('means')} className="text-blue-500 focus:outline-none">
                <i className={`${hideMeans ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}`}></i>
              </button>
            </div> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            [確認]
          </div>
        </td>
      </tr>
    </>
  );
}

export default memo(WordInfo);
