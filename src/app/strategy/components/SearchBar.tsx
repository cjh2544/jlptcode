import { useStrategyStore } from '@/app/store/strategyStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import PaidButton from '@/app/components/Buttons/PaidButton';
import { useTranslations } from '@/app/providers/I18nProvider';

type SearchProps = {
  onSearch?: () => any,
}

const SearchBar = (props: SearchProps) => {
  const { t } = useTranslations();

  const {
    onSearch
  } = props

  const { data: session } = useSession();
  const [confirmMsg, setConfirmMsg] = useState<ReactNode>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const router = useRouter();
  const levelUpInfo =useStrategyStore((state:any) => state.levelUpInfo);

  // 1️⃣ Zustand 스토어에서 codeList 구독
  const codeListFromStore = useCommonCodeStore((state: any) => state.codeList);
  const yearCodeListFromStore = useCommonCodeStore((state: any) => state.yearCodeList);

  // 2️⃣ 안전하게 useMemo로 감싸기 (undefined 대비)
  const codeList = useMemo(() => codeListFromStore || [], [codeListFromStore]);
  const yearCodeList = useMemo(() => yearCodeListFromStore || [], [yearCodeListFromStore]);
  
  const setLevelUpInfo = useStrategyStore((state:any) => state.setLevelUpInfo);
  const getLevelUpList = useStrategyStore((state:any) => state.getLevelUpList);
  const getCodeList = useCommonCodeStore((state:any) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore((state:any) => state.getYearCodeList);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'classification') {
      eObj = {...eObj, questionGroupType: ''};
    }


    setLevelUpInfo({...levelUpInfo, ...eObj});
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {

    if(!session?.paymentInfo?.isValid) {
      setConfirmMsg(<>{t("common.paidOnly")}<br />{t("common.paidOnlyHint")}</>);
      setShowConfirm(true);
      return;
    }

    getLevelUpList();
    // router.push('/strategy/test', { scroll :false });
  }

  const getCodeDetailList = useCallback((code: string) => {
    return codeList.find((data: any) => data.code === code)?.details || []
  }, [codeList]);

  const getYearCodeDetailList = useCallback(() => {
    return yearCodeList.find((data: any) => data.level === levelUpInfo.level)?.details || []
  }, [yearCodeList, levelUpInfo]);

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
              <h6 className="text-blueGray-700 text-xl font-bold">{t('common.search')}</h6>
              <strong className='text-red-700'>{t('strategy.tip')}</strong>
            </div>
          </div>
          <div className='grid grid-cols-4 gap-4 place-items-end p-4 sm:grid-cols-2'>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="level"
              >
                {t('common.level')}
              </label>
              <select id="level" name="level" value={levelUpInfo.level} onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('level').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.value}>{data.value}</option>)
                })}
              </select>
            </div>
            {/* <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="year"
              >
                년도
              </label>
              <select id="year" name="year" onChange={handleChange} className="uppercase border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">랜덤</option>
                {getYearCodeDetailList().filter((year: string) => year !== 'random').map((year: string, idx:number) => {
                  return (<option key={idx} value={year}>{year}</option>)
                })}
              </select>
            </div> */}
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="classification"
              >
                {t('common.subject')}
              </label>
              <select id="classification" name="classification" value={levelUpInfo.classification} onChange={handleChange} className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                {getCodeDetailList('classification').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
                <option value="vocabulary,grammar,reading">{t('strategy.langAll')}</option>
              </select>
            </div>
            <div className="w-full">
              <label
                className="block uppercase text-blueGray-600 mb-1"
                htmlFor="questionGroupType"
              >
                {t('common.type')}
              </label>
              <select disabled={!levelUpInfo.classification} id="questionGroupType" name="questionGroupType" value={levelUpInfo.questionGroupType} onChange={handleChange} className="disabled:bg-gray-300 border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="">{t('common.all')}</option>
                {getCodeDetailList('strategyType').filter((item: any) => item.levels.includes(levelUpInfo.level) && item.classification === levelUpInfo.classification).map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              {/* <button
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full"
                type="button"
                onClick={(e) => handleSearch(e)}
              >
                <i className="fas fa-search"></i> {t('common.query')}
              </button> */}
              <PaidButton className="w-full sm:col-span-2" onClick={handleSearch} />
              <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => setShowConfirm(visible)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar