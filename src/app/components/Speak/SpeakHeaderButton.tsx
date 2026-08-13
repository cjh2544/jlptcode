'use client';
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import { useSpeakTodayStore } from '@/app/store/speakTodayStore';
import { Button } from '@/components/ui/button';
import { memo } from 'react';
import { useTranslations } from '@/app/providers/I18nProvider';

type SpeakHeaderButtonProps = {
  colName: string;
  label: string;
};

const SpeakHeaderButton = ({ colName, label }: SpeakHeaderButtonProps) => {
  const { t } = useTranslations();
  const hideAll = useSpeakTodayStore((state) => state.hideAll);
  const setHideAllInfo = useSpeakTodayStore((state) => state.setHideAllInfo);
  const hidden = hideAll[colName];

  const handleClickHeader = () => {
    setHideAllInfo({ ...hideAll, [colName]: !hidden });
  };

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
  );
};

export default memo(SpeakHeaderButton);
