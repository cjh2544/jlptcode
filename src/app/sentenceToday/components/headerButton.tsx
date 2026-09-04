'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import { useSentenceTodayStore } from '@/app/store/sentenceTodayStore';
import { Button } from "@/components/ui/button";
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type HeaderButtonProps = {
  colName: string,
  label: string,
}

const HeaderButton = ({colName, label}: HeaderButtonProps) => {
  const { t } = useTranslations();
  const hideAll = useSentenceTodayStore(state => state.hideAll);
  const setHideAllInfo = useSentenceTodayStore(state => state.setHideAllInfo);
  const hidden = hideAll[colName];

  const handleClickHeader = () => {
    setHideAllInfo({...hideAll, [colName]: !hidden});
  }

  return (
    <Button
      type="button"
      onClick={handleClickHeader}
      variant={hidden ? "default" : "outline"}
      size="sm"
      className={
        hidden
          ? "gap-1.5 border-primary shadow-sm"
          : "gap-1.5 border-primary text-primary hover:bg-primary/10 hover:text-primary"
      }
      aria-pressed={hidden}
      title={hidden ? t('today.show') : t('today.hide')}
    >
      <VisibilityIcon hidden={hidden} />
      <span>{label}</span>
    </Button>
  )
}

export default memo(HeaderButton)
