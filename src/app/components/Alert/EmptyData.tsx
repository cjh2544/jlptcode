"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { memo } from "react";

type LoadingProps = {
  text?: string;
  className?: string;
};

const EmptyData = (props: LoadingProps) => {
  const { text, className } = props;
  const { t } = useTranslations();

  return (
    <div className={`p-4 text-sm bg-white ${className}`}>
      {text || t("common.empty")}
    </div>
  );
};

export default memo(EmptyData);
