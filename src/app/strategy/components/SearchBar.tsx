import { useStrategyStore } from '@/app/store/strategyStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';

type SearchProps = {
  onSearch?: () => any,
}

const SearchBar = (props: SearchProps) => {

  const {
    onSearch
  } = props

  const router = useRouter();
  const levelUpInfo =useStrategyStore((state) => state.levelUpInfo);
  const codeList = useCommonCodeStore((state) => state.codeList) || [];
  const yearCodeList = useCommonCodeStore((state) => state.yearCodeList) || [];
  const setLevelUpInfo = useStrategyStore((state) => state.setLevelUpInfo);
  const getLevelUpList = useStrategyStore((state) => state.getLevelUpList);
  const getCodeList = useCommonCodeStore((state) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore((state) => state.getYearCodeList);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}

    eObj = {[e.target.name]: e.target.value}

    setLevelUpInfo({...levelUpInfo, ...eObj});
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    getLevelUpList();
    // router.push('/strategy/test', { scroll :false });
  }

  const getCodeDetailList = useCallback((code: string) => {
    return codeList.find((data) => data.code === code)?.details || []
  }, [codeList]);

  useEffect(() => {
    getCodeList(['level', 'classification', 'strategyType', 'wordType']);
  }, []);

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">검색</h6>
              <strong className='text-red-700'>★ 점수가 부족한 부분을 집중적으로 학습하세요!!</strong>
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
              <select id="level" name="level" value={levelUpInfo.level} onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('level').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.value}>{data.value}</option>)
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
              <select id="classification" name="classification" value={levelUpInfo.classification} onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">전체</option>
                {getCodeDetailList('classification').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="questionGroupType"
              >
                유형
              </label>
              <select disabled={!levelUpInfo.classification} id="questionGroupType" name="questionGroupType" value={levelUpInfo.questionGroupType} onChange={handleChange} className="disabled:bg-gray-300 border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">전체</option>
                {getCodeDetailList('strategyType').filter((item: any) => item.levels.includes(levelUpInfo.level)).map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
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