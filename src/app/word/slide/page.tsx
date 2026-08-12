"use client";

import { useEffect } from "react";
import WordLayout from "@/app/components/Layout/WordLayout";
import WordContent from "./components/WordContent";
import SearchBar from "./components/SearchBar";
import { useWordStore } from "@/app/store/wordStore";

const SlidePage = () => {
  const init = useWordStore((state: any) => state.init);
  const getWordList = useWordStore((state: any) => state.getWordList);
  const getPageInfo = useWordStore((state: any) => state.getPageInfo);

  useEffect(() => {
    init();
    getWordList();
    getPageInfo();
  }, []);

  return (
    <WordLayout>
      <SearchBar />
      <div
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        className="relative w-full"
      >
        <WordContent />
      </div>
    </WordLayout>
  );
};

export default SlidePage;
