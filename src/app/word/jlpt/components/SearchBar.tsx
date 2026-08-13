import { useWordStore } from '@/app/store/wordStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import ModalConfirm from '@/app/components/Modals/ModalConfirm';
import { useTranslations } from '@/app/providers/I18nProvider';
import { Button } from '@/components/ui/button';

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
        setConfirmMsg(<>{t("common.paidOnly")}<br />{t("common.paidOnlyHint")}</>);
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
    return codeList.find((data: any) => data.code === code)?.details || []
  }, [codeList]);

  const getYearCodeDetailList = useCallback(() => {
    return yearCodeList.find((data: any) => data.wordType === searchInfo.wordType && data.level === 'N' + searchInfo.level)?.details || []
  }, [yearCodeList, searchInfo]);

  useEffect(() => {
    init();
    getCodeList(['level', 'parts', 'wordType']);
    getYearCodeList(['word', 'sentence', 'grammar']);
  }, []);

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <h6 className="text-lg font-bold">{t('common.search')}</h6>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 place-items-end p-4'>
            <div className="w-full">
              <label
                className="app-label"
                htmlFor="level"
              >
                {t('common.level')}
              </label>
              <select id="level" name="level" onChange={handleChange} className="app-select">
                {getCodeDetailList('level').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="app-label"
                htmlFor="wordType"
              >
                {t('common.wordType')}
              </label>
              <select id="wordType" name="wordType" value={searchInfo.wordType} onChange={handleChange} className="app-select">
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
                  className="app-label"
                  htmlFor="parts"
                >
                  {t('common.partOfSpeech')}
                </label>
                <select id="parts" name="parts" onChange={handleChange} className="app-select">
                  <option value="">{t('common.all')}</option>
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
                  className="app-label"
                  htmlFor="year"
                >
                  STUDY
                </label>
                <select id="study" name="study" onChange={handleChange} className="app-select">
                  <option value="">{t('common.all')}</option>
                  {getYearCodeDetailList().map((year: string, idx:number) => {
                    return (<option key={idx} value={year}>{year}</option>)
                  })}
                </select>
              </div>
            )}
            <div className="w-full">
              <Button
                type="button"
                size="lg"
                className="h-10 w-full gap-2 font-semibold uppercase tracking-wide"
                onClick={(e) => handleSearch(e)}
              >
                <i className="fas fa-search" aria-hidden />
                {t('common.query')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar