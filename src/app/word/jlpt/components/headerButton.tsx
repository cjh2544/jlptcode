'use client';
import { useWordStore } from '@/app/store/wordStore';
import { Button } from "@/components/ui/button";
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type HeaderButtonProps = {
  colName: string,
  label: string,
}

const HeaderButton = ({colName, label}: HeaderButtonProps) => {
  const { t } = useTranslations();
  const hideAll = useWordStore(state => state.hideAll);
  const setHideAllInfo = useWordStore(state => state.setHideAllInfo);
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
      <i className={hidden ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'} aria-hidden />
      <span>{label}</span>
    </Button>
  )
}

export default memo(HeaderButton)
