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
    <header>
      <nav className="bg-blueGray-800 sm:py-4 p-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center">
            <span className="text-white text-sm uppercase lg:inline-block font-semibold">
              {resolvedTitle}
            </span>
          </a>
          {resolvedSubTitle && (
            <p className="text-white text-sm uppercase lg:inline-block font-semibold">
              {resolvedSubTitle}
            </p>
          )}
        </div>
      </nav>
    </header>
  );
}
