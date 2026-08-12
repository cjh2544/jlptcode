import { useJptWordStore } from '@/app/store/jptWordStore';
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

  const searchInfo =useJptWordStore((state:any) => state.searchInfo);
  const pageInfo = useJptWordStore((state:any) => state.pageInfo);
  const codeList = useCommonCodeStore((state:any) => state.codeList) || [];
  const setSearchInfo = useJptWordStore((state:any) => state.setSearchInfo);
  const getPageInfo = useJptWordStore((state:any) => state.getPageInfo);
  const getWordList = useJptWordStore((state:any) => state.getWordList);
  const setPageInfo = useJptWordStore((state:any) => state.setPageInfo);
  const init = useJptWordStore((state:any) => state.init);
  const getCodeList = useCommonCodeStore((state:any) => state.getCodeList);

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

  useEffect(() => {
    init();
    getCodeList(['level-jpt']);
  }, []);

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex justify-between items-center gap-4">
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
                <option value={'고득점(900)'}>{t('word.high900')}</option>
                {getCodeDetailList('level-jpt').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.key}>{data.value}</option>)
                })}
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