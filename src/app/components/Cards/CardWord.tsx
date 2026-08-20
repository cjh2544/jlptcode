import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import { SaveWordButton } from "@/app/components/Buttons/SaveButtons";
import { memo } from "react";
import CardSentence from "./CardSentence";

type TableCellProps = {
  data: any,
  align?: 'left' | 'center' | 'right',
  type?: 'string' | 'number' | 'array' | 'button',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  onClick?: any,
  className?: string,
}

const CardWord = ({
  data, 
  align = 'left', 
  type = 'string', 
  size = 'md',
  onClick,
  className
}: TableCellProps) => {
  
  const {
    word,
    read,
    means,
    hideWord = false,
    hideRead = false,
    hideMeans = false,
  } = data;

  const handleClick = (colType: string) => {
    let visibleInfo = {};

    if('word' === colType) {
      visibleInfo = { hideWord: !hideWord };
    } else if('read' === colType) {
      visibleInfo = { hideRead: !hideRead };
    } else if('means' === colType) {
      visibleInfo = { hideMeans: !hideMeans };
    }

    onClick && onClick({...data, ...visibleInfo});
  }

  return (
    <>
      <li className={` ${className}`}>
        <div className="flex items-center">
          <div className="flex-1 min-w-0 py-3">
            <div className={`text-${size} text-gray-900 text-gray-900 truncate flex justify-between items-center px-6 border-b whitespace-normal`}>
              <div className="flex items-center gap-2">
                <span className={`${hideWord ? 'invisible' : ''}`}>{word}</span>
                <SaveWordButton item={data} source="jptWord" compact />
              </div>
              <div>
                <button onClick={(e) => handleClick('word')} className="text-blue-500 focus:outline-hidden">
                  <VisibilityIcon hidden={!!hideWord} />
                </button>
              </div>
            </div>
            <div className={`text-${size} text-gray-900 text-gray-900 truncate flex justify-between items-center px-6 border-b whitespace-normal`}>
              <div className={`${hideRead ? 'invisible' : ''}`}>{read}</div>
              <div>
                <button onClick={(e) => handleClick('read')} className="text-blue-500 focus:outline-hidden">
                  <VisibilityIcon hidden={!!hideRead} />
                </button>
              </div>
            </div>
            <div className={`text-${size} text-gray-900 text-gray-900 truncate flex justify-between items-center px-6 whitespace-normal`}>
              <div className={`${hideMeans ? 'invisible' : ''}`}>{means}</div>
              <div>
                <button onClick={(e) => handleClick('means')} className="text-blue-500 focus:outline-hidden">
                  <VisibilityIcon hidden={!!hideMeans} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  )
}

export default memo(CardWord);