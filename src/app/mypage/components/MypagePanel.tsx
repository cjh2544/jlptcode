"use client";

import { useTranslations } from "@/app/providers/I18nProvider";

export default function MypagePanel({
  titleKey,
  actions,
  children,
}: {
  titleKey: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useTranslations();

  return (
    <div className="px-0 sm:px-4 mx-auto w-full my-4 sm:my-10">
      <div className="app-panel w-full">
        <div className="app-panel-header">
          <div className={actions ? "flex items-center justify-between gap-3" : undefined}>
            <h6 className="text-lg font-bold">{t(titleKey)}</h6>
            {actions}
          </div>
        </div>
        <div className="app-panel-body">{children}</div>
      </div>
    </div>
  );
}
