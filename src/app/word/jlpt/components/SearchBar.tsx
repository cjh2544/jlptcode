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
  const setSearchInfo = useWordStore((state) => state.setSearchInfo);
  const getPageInfo = useWordStore((state) => state.getPageInfo);
  const getWordList = useWordStore((state) => state.getWordList);
  const pageInfo = useWordStore((state) => state.pageInfo);
  const setPageInfo = useWordStore((state) => state.setPageInfo);
  const getCodeList = useCommonCodeStore((state) => state.getCodeList);
  const codeList = useCommonCodeStore((state) => state.codeList) || [];

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

  useEffect(() => {
    getCodeList(['level', 'parts']);
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
          <div className="flex-auto mt-3 lg:px-10 py-10 pt-0">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 md:py-0 md:px-4 sm:py-0 sm:px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    급수
                  </label>
                  <select name="level" onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    {getCodeDetailList('level').map((data: CodeDetail, idx:number) => {
                      return (<option key={idx} value={data.key}>{data.value}</option>)
                    })}
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 pl-4 md:py-0 md:px-4 sm:py-0 sm:px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    품사
                  </label>
                  <select name="parts" onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    <option value="">전체</option>
                    {getCodeDetailList('parts').map((data: CodeDetail, idx:number) => {
                      return (<option key={idx} value={data.key}>{data.value}</option>)
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className='md:py-0 md:px-4 sm:py-0 sm:px-4'>
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