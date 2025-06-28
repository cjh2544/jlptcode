import { useWordStore } from '@/app/store/wordStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import ModalConfirm from '@/app/components/Modals/ModalConfirm';

type SearchProps = {
  onSearch?: () => any,
}

const SearchBar = (props: SearchProps) => {

  const {
    onSearch
  } = props

  const { data: session } = useSession();
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)

  const searchInfo =useWordStore((state:any) => state.searchInfo);
  const pageInfo = useWordStore((state:any) => state.pageInfo);
  const codeList = useCommonCodeStore((state:any) => state.codeList) || [];
  const yearCodeList = useCommonCodeStore((state:any) => state.yearCodeList) || [];
  const setSearchInfo = useWordStore((state:any) => state.setSearchInfo);
  const getPageInfo = useWordStore((state:any) => state.getPageInfo);
  const getWordList = useWordStore((state:any) => state.getWordList);
  const setPageInfo = useWordStore((state:any) => state.setPageInfo);
  const init = useWordStore((state:any) => state.init);
  const getCodeList = useCommonCodeStore((state:any) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore((state:any) => state.getYearCodeList);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}

    if(!session?.paymentInfo?.isValid) {
      if('wordType' === e.target.name && '1' !== e.target.value) {
        setSearchInfo({...searchInfo, [e.target.name]: '1'});
        setConfirmMsg(<>유료회원만이 이용가능합니다.<br />문의게시판에 “유료회원안내”을 확인해 주세요.</>);
        setShowConfirm(true);
        return;
      }
    }

    if(e.target.name === 'parts') {
      eObj = {[e.target.name]: e.target.value ? [e.target.value] : []};
    } else {
      eObj = {[e.target.name]: e.target.value}
    }

    setSearchInfo({...searchInfo, ...eObj});
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    setPageInfo({...pageInfo, currentPage: 1});
    getWordList();
    getPageInfo();
  }

  const getCodeDetailList = useCallback((code: string) => {
    return codeList.find((data) => data.code === code)?.details || []
  }, [codeList]);

  const getYearCodeDetailList = useCallback(() => {
    return yearCodeList.find((data) => data.wordType === searchInfo.wordType && data.level === 'N' + searchInfo.level)?.details || []
  }, [yearCodeList, searchInfo]);

  useEffect(() => {
    init();
    getCodeList(['level', 'parts', 'wordType']);
    getYearCodeList(['word', 'sentence', 'grammar']);
  }, []);

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">검색</h6>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 place-items-end p-4'>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="level"
              >
                급수
              </label>
              <select id="level" name="level" onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('level').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="wordType"
              >
                단어유형
              </label>
              <select id="wordType" name="wordType" value={searchInfo.wordType} onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('wordType').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
              <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => setShowConfirm(visible)} />
            </div>
            {/* 기본단어 일 경우 */}
            {searchInfo.wordType === '1' && (
              <div className="w-full">
                <label
                  className="block uppercase text-blueGray-600 mb-1"
                  htmlFor="parts"
                >
                  품사
                </label>
                <select id="parts" name="parts" onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <option value="">전체</option>
                  {getCodeDetailList('parts').map((data: CodeDetail, idx:number) => {
                    return (<option key={idx} value={data.key}>{data.value}</option>)
                  })}
                </select>
              </div>
            )}
            {/* 기본단어 외 일 경우 */}
            {searchInfo.wordType !== '1' && (
              <div className="w-full">
                <label
                  className="block uppercase text-blueGray-600 mb-1"
                  htmlFor="year"
                >
                  출제년도
                </label>
                <select id="year" name="year" onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                  <option value="">전체</option>
                  {getYearCodeDetailList().map((year: string, idx:number) => {
                    return (<option key={idx} value={year}>{year}</option>)
                  })}
                </select>
              </div>
            )}
            <div className="w-full">
              <button
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full"
                type="button"
                onClick={(e) => handleSearch(e)}
              >
                <i className="fas fa-search"></i> 조회
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar