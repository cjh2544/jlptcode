import { useJptStore } from '@/app/store/jptStore';
import { useCommonCodeStore } from '@/app/store/commonCodeStore';
import { ChangeEvent, MouseEvent, useCallback, useEffect } from 'react';
import { isEmpty, reverse, sortBy } from 'lodash';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();
  const jptInfo =useJptStore((state:any) => state.jptInfo);
  const codeList = useCommonCodeStore((state:any) => state.codeList) || [];
  const yearCodeList = useCommonCodeStore((state:any) => state.yearCodeList) || [];
  const setJptInfo = useJptStore((state:any) => state.setJptInfo);
  const getJptList = useJptStore((state:any) => state.getJptList);
  const getCodeList = useCommonCodeStore((state:any) => state.getCodeList);
  const getYearCodeList = useCommonCodeStore((state:any) => state.getYearCodeList);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let eObj:any = {}

    eObj = {[e.target.name]: e.target.value};

    if(e.target.name === 'classification') {
      eObj = {...eObj, part: ''};
    }

    setJptInfo({...jptInfo, ...eObj});
  }

  const handleSearch = (e: MouseEvent<HTMLElement>) => {
    if(!jptInfo.part) {
      alert(t('strategy.selectType'));
      return false;
    }

    getJptList();
  }

  const getCodeDetailList = useCallback((code: string) => {
    return codeList.find((data: any) => data.code === code)?.details || []
  }, [codeList]);

  useEffect(() => {
    getCodeList(['level-jpt', 'classification', 'part-jpt']);
    
    setJptInfo({
      level: '고급(800)',
      classification: 'listening',
      part: 'part2'
    });

    getJptList();
  }, []);

  return (
    <>
      <div className="px-4 mx-auto w-full m-10 mb-12">
        <div className="app-panel w-full mb-6">
          <div className="app-panel-header">
            <div className="flex justify-between items-center gap-4">
              <h6 className="text-lg font-bold">{t('common.search')}</h6>
              <strong className='app-panel-tip'>{t('strategy.tip')}</strong>
            </div>
          </div>
          <div className='grid grid-cols-4 gap-4 place-items-end p-4 sm:grid-cols-2'>
            <div className="w-full">
              <label
                className="app-label"
                htmlFor="level"
              >
                {t('common.level')}
              </label>
              <select id="level" name="level" value={jptInfo.level} onChange={handleChange} className="app-select">
                {getCodeDetailList('level-jpt').map((data: CodeDetail, idx:number) => {
                  return (<option key={idx} value={data.value}>{data.value}</option>)
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="app-label"
                htmlFor="classification"
              >
                {t('common.subject')}
              </label>
              <select id="classification" name="classification" value={jptInfo.classification} onChange={handleChange} className="app-select">
                {sortBy(getCodeDetailList('classification'), 'key').map((data: CodeDetail, idx:number) => {
                  return ['listening', 'reading'].includes(data.key) ? (<option key={idx} value={data.key}>{data.value}</option>) : ''
                })}
              </select>
            </div>
            <div className="w-full">
              <label
                className="app-label"
                htmlFor="part"
              >
                {t('common.type')}
              </label>
              <select id="part" name="part" value={jptInfo.part} onChange={handleChange} className="disabled:bg-gray-300 app-select">
                <option value="">{t('common.select')}</option>
                {getCodeDetailList('part-jpt').filter((item: any) => 'listening' === jptInfo.classification ? ['part2','part3'].includes(item.key) : ['part5','part7','part8'].includes(item.key)).map((data: CodeDetail, idx:number) => {
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