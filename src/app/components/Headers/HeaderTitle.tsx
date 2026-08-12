"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import React from "react";

type HeaderTitleProps = {
  title?: string;
  subTitle?: string;
  titleKey?: string;
  subTitleKey?: string;
};

export default function HeaderTitle(props: HeaderTitleProps) {
  const { title, subTitle, titleKey, subTitleKey } = props;
  const { t } = useTranslations();

  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedSubTitle = subTitleKey ? t(subTitleKey) : subTitle;

  return (
    <header className="app-page-header">
      <div className="app-page-header-inner">
        <div className="app-page-header-accent" aria-hidden />
        <div className="app-page-header-content">
          <div className="app-page-header-main">
            <p className="app-page-header-eyebrow">
              <span className="app-page-header-eyebrow-jlpt">JLPT</span>
              <span className="app-page-header-eyebrow-code">CODE</span>
            </p>
            <h1 className="app-page-header-title">{resolvedTitle}</h1>
          </div>
          {resolvedSubTitle && (
            <p className="app-page-header-subtitle">{resolvedSubTitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
