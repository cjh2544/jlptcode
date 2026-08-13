'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, {memo} from "react";

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
    _id,
    type,
    level,
    word,
    read,
    means,
    parts,
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
            <div className="flex justify-between items-center">
              <div className={`${hideWord ? 'invisible' : ''}`}>{word}</div>
              <div>
                <button onClick={(e) => handleClick('word')} className="text-blue-500 focus:outline-hidden">
                  <VisibilityIcon hidden={!!hideWord} />
                </button>
              </div>
            </div> 
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideRead ? 'invisible' : ''}`}>{read}</p>
              <button onClick={(e) => handleClick('read')} className="text-blue-500 focus:outline-hidden">
                <VisibilityIcon hidden={!!hideRead} />
              </button>
            </div> 
          </div> 
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="font-normal">
            <div className="flex justify-between items-center">
              <p className={`${hideMeans ? 'invisible' : ''}`}>{means}</p>
              <button onClick={(e) => handleClick('means')} className="text-blue-500 focus:outline-hidden">
                <VisibilityIcon hidden={!!hideMeans} />
              </button>
            </div> 
          </div> 
        </td>
      </tr>
    </>
  );
}

export default memo(WordInfo);
