"use client";

import { useCommonCodeStore } from "@/app/store/commonCodeStore";
import { useWordStore } from "@/app/store/wordStore";
import {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

type SearchProps = {
  onSearch?: (data: any) => any;
};

const SearchBar = (props: SearchProps) => {
  const { t } = useTranslations();
  const { onSearch } = props;

  const { data: session } = useSession();
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>("");
  const [confirmType] = useState<any>("info");
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const searchInfo = useWordStore((state: any) => state.searchInfo);
  const pageInfo = useWordStore((state: any) => state.pageInfo);
  const codeList = useCommonCodeStore((state: any) => state.codeList) || [];
  const yearCodeList =
    useCommonCodeStore((state: any) => state.yearCodeList) || [];
  const wordList = useWordStore((state: any) => state.wordList);
  const setSearchInfo = useWordStore((state: any) => state.setSearchInfo);
  const getPageInfo = useWordStore((state: any) => state.getPageInfo);
  const getWordList = useWordStore((state: any) => state.getWordList);
  const setWordList = useWordStore((state: any) => state.setWordList);
  const setPageInfo = useWordStore((state: any) => state.setPageInfo);
  const getCodeList = useCommonCodeStore((state: any) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore(
    (state: any) => state.getYearCodeList,
  );
  const init = useWordStore((state: any) => state.init);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj: any = {};

    if (!session?.paymentInfo?.isValid) {
      if ("wordType" === e.target.name && "1" !== e.target.value) {
        setSearchInfo({ ...searchInfo, [e.target.name]: "1" });
        setConfirmMsg(
          <>
            {t("common.paidOnly")}
            <br />
            {t("common.paidOnlyHint")}
          </>,
        );
        setShowConfirm(true);
        return;
      }
    }

    if (e.target.name === "parts") {
      eObj = { [e.target.name]: e.target.value ? [e.target.value] : [] };
    } else {
      eObj = { [e.target.name]: e.target.value };
    }

    setSearchInfo({ ...searchInfo, ...eObj });

    if (e.target.name === "wordShowType") {
      setWordList(
        wordList.map((data: any) => {
          if (e.target.value === "1") {
            data.hideWord = false;
            data.hideRead = false;
            data.hideMeans = false;
          } else if (e.target.value === "2") {
            data.hideWord = false;
            data.hideRead = false;
            data.hideMeans = true;
          } else if (e.target.value === "3") {
            data.hideWord = true;
            data.hideRead = true;
            data.hideMeans = true;
          }
          return data;
        }),
      );
    }
  };

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getWordList();
    onSearch?.(searchInfo);
  };

  const handleChangePageInfo = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageInfo({
      ...pageInfo,
      [e.target.name]: e.target.value,
    });
    getPageInfo();
    getWordList();
  };

  const getCodeDetailList = useCallback(
    (code: string) => {
      return codeList.find((data: any) => data.code === code)?.details || [];
    },
    [codeList],
  );

  const getYearCodeDetailList = useCallback(() => {
    return (
      yearCodeList.find(
        (data: any) =>
          data.wordType === searchInfo.wordType &&
          data.level === "N" + searchInfo.level,
      )?.details || []
    );
  }, [yearCodeList, searchInfo]);

  useEffect(() => {
    init();
    getCodeList(["level", "parts", "wordType", "wordShowType", "pageSize"]);
    getYearCodeList(["word", "sentence", "grammar"]);
  }, []);

  return (
    <div className="mx-auto mb-8 mt-6 w-full">
      <div className="app-panel mb-6 w-full">
        <div className="app-panel-header">
          <div className="flex items-center justify-between gap-4">
            <h6 className="text-lg font-bold">{t("common.search")}</h6>
          </div>
        </div>
        <div className="app-panel-body">
          <div className="grid grid-cols-1 gap-4 place-items-end sm:grid-cols-2 lg:grid-cols-3">
            <div className="w-full">
              <label className="app-label" htmlFor="level">
                {t("common.level")}
              </label>
              <select
                id="level"
                name="level"
                onChange={handleChange}
                className="app-select"
              >
                {getCodeDetailList("level").map(
                  (data: CodeDetail, idx: number) => (
                    <option key={idx} value={data.key}>
                      {data.value}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="w-full">
              <label className="app-label" htmlFor="wordType">
                {t("common.wordType")}
              </label>
              <select
                id="wordType"
                name="wordType"
                value={searchInfo.wordType}
                onChange={handleChange}
                className="app-select"
              >
                {getCodeDetailList("wordType").map(
                  (data: CodeDetail, idx: number) => (
                    <option key={idx} value={data.key}>
                      {data.value}
                    </option>
                  ),
                )}
              </select>
              <ModalConfirm
                type={confirmType}
                message={confirmMsg}
                visible={isShowConfirm}
                onClose={(visible: boolean) => setShowConfirm(visible)}
              />
            </div>
            {searchInfo.wordType === "1" ? (
              <div className="w-full">
                <label className="app-label" htmlFor="parts">
                  {t("common.partOfSpeech")}
                </label>
                <select
                  id="parts"
                  name="parts"
                  onChange={handleChange}
                  className="app-select"
                >
                  <option value="">{t("common.all")}</option>
                  {getCodeDetailList("parts").map(
                    (data: CodeDetail, idx: number) => (
                      <option key={idx} value={data.key}>
                        {data.value}
                      </option>
                    ),
                  )}
                </select>
              </div>
            ) : (
              <div className="w-full">
                <label className="app-label" htmlFor="study">
                  {t("word.study")}
                </label>
                <select
                  id="study"
                  name="study"
                  onChange={handleChange}
                  className="app-select"
                >
                  <option value="">{t("common.all")}</option>
                  {getYearCodeDetailList().map((year: string, idx: number) => (
                    <option key={idx} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-full">
              <label className="app-label" htmlFor="pageSize">
                {t("common.perPage")}
              </label>
              <select
                id="pageSize"
                name="pageSize"
                onChange={handleChangePageInfo}
                className="app-select"
              >
                {getCodeDetailList("pageSize").map(
                  (data: CodeDetail, idx: number) => (
                    <option key={idx} value={data.key}>
                      {data.value}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="w-full">
              <label className="app-label" htmlFor="currentPage">
                {t("common.pageNo")} ({t("common.all")}:{" "}
                {pageInfo?.totalPage || 0})
              </label>
              <select
                id="currentPage"
                name="currentPage"
                onChange={handleChangePageInfo}
                className="app-select"
              >
                {pageInfo?.totalPage &&
                  Array.from({ length: pageInfo?.totalPage || 1 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-full">
              <Button
                type="button"
                size="lg"
                className="h-10 w-full gap-2 font-semibold uppercase tracking-wide"
                onClick={(e) => handleSearch(e)}
              >
                <i className="fas fa-search" aria-hidden />
                {t("common.query")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
