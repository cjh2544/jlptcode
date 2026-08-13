'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import { useGrammarTodayStore } from '@/app/store/grammarTodayStore';
import { Button } from "@/components/ui/button";
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type HeaderButtonProps = {
  colName: string,
  label: string,
}

const HeaderButton = ({colName, label}: HeaderButtonProps) => {
  const { t } = useTranslations();
  const hideAll = useGrammarTodayStore(state => state.hideAll);
  const setHideAllInfo = useGrammarTodayStore(state => state.setHideAllInfo);
  const hidden = hideAll[colName];

  const handleClickHeader = () => {
    setHideAllInfo({...hideAll, [colName]: !hidden});
  }

  return (
    <Button
      type="button"
      onClick={handleClickHeader}
      variant="outline"
      size="sm"
      className="gap-1.5"
      aria-pressed={hidden}
      title={hidden ? t('today.show') : t('today.hide')}
    >
      <VisibilityIcon hidden={hidden} />
      <span>{label}</span>
    </Button>
  )
}

export default memo(HeaderButton)
