import { useWordStore } from '@/app/store/wordStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';

type SearchProps = {
  onSearch?: () => any,
}

const SearchBar = (props: SearchProps) => {

  const {
    onSearch
  } = props

  const searchInfo =useWordStore((state) => state.searchInfo);
  const pageInfo = useWordStore((state) => state.pageInfo);
  const codeList = useCommonCodeStore((state) => state.codeList) || [];
  const yearCodeList = useCommonCodeStore((state) => state.yearCodeList) || [];
  const setSearchInfo = useWordStore((state) => state.setSearchInfo);
  const getPageInfo = useWordStore((state) => state.getPageInfo);
  const getWordList = useWordStore((state) => state.getWordList);
  const setPageInfo = useWordStore((state) => state.setPageInfo);
  const getCodeList = useCommonCodeStore((state) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore((state) => state.getYearCodeList);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}

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
    return yearCodeList.find((data) => data.level === 'N' + searchInfo.level)?.details || []
  }, [yearCodeList, searchInfo]);

  useEffect(() => {
    getCodeList(['level', 'classification', 'strategyType', 'wordType']);
    getYearCodeList(['strategy']);
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
          <div className='grid grid-cols-4 gap-4 place-items-end p-4 sm:grid-cols-2'>
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
                htmlFor="classification"
              >
                과목
              </label>
              <select id="classification" name="classification" onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('classification').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="strategyType"
              >
                문제유형
              </label>
              <select id="strategyType" name="strategyType" onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">전체</option>
                {getCodeDetailList('strategyType').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
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