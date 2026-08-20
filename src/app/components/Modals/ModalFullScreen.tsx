"use client";

import React, { ReactNode, useState } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";

type ModalFullScreenProps = {
  title?: string;
  visible: boolean;
  onChange?: (fullScreen: boolean) => void;
  children: any;
  navInfo?: string;
  actions?: ReactNode;
};

const ModalFullScreen = (props: ModalFullScreenProps) => {
  const { title, visible = false, onChange, children, navInfo, actions } =
    props;
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const { t } = useTranslations();

  const handleChangeScreen = (size: string | undefined) => {
    const isFull = size === "full";
    setFullScreen(isFull);
    onChange?.(isFull);
  };

  return (
    <div
      className={`${isFullScreen ? "fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden" : "mt-4 flex flex-wrap"} ${visible ? "" : "hidden"}`}
    >
      <div className={`w-full min-h-0 ${isFullScreen ? "flex h-full flex-col" : "mb-4"}`}>
        <div
          className={`app-panel w-full overflow-hidden shadow-lg ${isFullScreen ? "flex h-full min-h-0 flex-col rounded-none" : "rounded-lg"}`}
        >
          <div className="app-panel-header relative z-20 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <h6 className="truncate text-lg font-bold">{title}</h6>
                {navInfo && (
                  <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-white/95">
                    {navInfo}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {actions}
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 bg-white/15 text-white hover:bg-white/25 hover:text-white"
                  onClick={() =>
                    handleChangeScreen(isFullScreen ? "" : "full")
                  }
                >
                  <i
                    className={`fas ${isFullScreen ? "fa-compress" : "fa-expand"}`}
                    aria-hidden
                  />
                  {isFullScreen
                    ? t("modal.exitFullscreen")
                    : t("modal.fullscreen")}
                </Button>
              </div>
            </div>
          </div>
          <div className={isFullScreen ? "min-h-0 flex-1 overflow-hidden" : ""}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFullScreen;
