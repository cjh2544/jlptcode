import React, { memo, useEffect, useState } from "react";
import { MouseEvent } from "react";

type TabDefaultProps = {
  data: any[];
  selectedIdx?: number;
  isUseContent?: boolean;
  onSearch?: (data: any) => any;
  onChange?: (data: any) => any;
};

const TabDefault = (props: TabDefaultProps) => {
  const { data, selectedIdx = 0, isUseContent = true, onChange } = props;
  const [openTab, setOpenTab] = useState(selectedIdx);

  const handleClick = (selectedData: any) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpenTab(selectedData.idx);
    onChange && onChange(selectedData);
  };

  useEffect(() => {
    setOpenTab(selectedIdx);
  }, [selectedIdx]);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <ul
          className="mb-0 flex list-none flex-row flex-wrap gap-2 pb-4 pt-3"
          role="tablist"
        >
          {data.map((item: any, idx: number) => (
            <li key={`tab-title-${idx}`} className="flex-auto text-center">
              <a
                className={
                  "block rounded-lg px-5 py-3 text-xs font-bold uppercase leading-normal shadow-sm transition-colors " +
                  (openTab === idx
                    ? "bg-brand-600 text-white shadow-md"
                    : "border border-blue-gray-200 bg-white text-blue-gray-700 hover:bg-brand-50 hover:text-brand-700")
                }
                onClick={handleClick({ idx: idx, level: item.title })}
                data-toggle="tab"
                href={`#link${idx}`}
                role="tablist"
              >
                {item?.displayName || item.title}
              </a>
            </li>
          ))}
        </ul>
        {isUseContent && (
          <div className="app-panel mb-6">
            <div className="app-panel-body">
              <div className="tab-content tab-space">
                {data.map((item, idx) => (
                  <div
                    key={`tab-content-${idx}`}
                    className={openTab === idx ? "block" : "hidden"}
                    id={`link${idx}`}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TabDefault);
