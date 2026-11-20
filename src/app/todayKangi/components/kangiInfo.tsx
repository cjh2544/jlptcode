"use client";
import VisibilityIcon from "@/app/components/Icons/VisibilityIcon";
import React, { memo } from "react";
import CardImage from "@/app/components/Cards/CardImage";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/app/providers/I18nProvider";

type KangiInfoProps = {
  kangiInfo: any;
  onClick?: (data: any) => void;
};

const KangiInfo = ({ kangiInfo, onClick }: KangiInfoProps) => {
  const { t } = useTranslations();
  const {
    sortNo,
    word,
    image,
    hideWord = false,
    hideImage = false,
  } = kangiInfo;

  const handleClick = (colType: string) => {
    let visibleInfo = {};
    if (colType === "word") visibleInfo = { hideWord: !hideWord };
    else if (colType === "image") visibleInfo = { hideImage: !hideImage };
    onClick?.({ ...kangiInfo, ...visibleInfo });
  };

  const masked = "\u2022".repeat(12);

  return (
    <article className="app-today-item">
      <div className="app-today-item-header">
        <div className="app-today-item-meta">
          <span className="app-today-no">
            {t("today.number")} {sortNo}
          </span>
        </div>
      </div>
      <div className="app-today-item-body">
        <div className="app-today-field">
          <span className="app-today-field-label">{t("common.kangi")}</span>
          <div
            className={`app-today-field-value text-3xl font-bold ${hideWord ? "app-today-field-value--masked" : ""}`}
            aria-hidden={hideWord}
          >
            {hideWord ? masked : word || "\u00A0"}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleClick("word")}
            title={hideWord ? t("today.show") : t("today.hide")}
            aria-label={hideWord ? t("today.show") : t("today.hide")}
          >
            <VisibilityIcon hidden={hideWord} />
          </Button>
        </div>

        <div className="app-today-field app-today-field--image">
          <div
            className={`app-today-field-value ${hideImage ? "app-today-field-value--masked" : ""}`}
            aria-hidden={hideImage}
          >
            {hideImage ? (
              masked
            ) : image ? (
              <CardImage
                key={image}
                image={{ link: image }}
                skeletonClassName="min-h-48"
              />
            ) : (
              "\u00A0"
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleClick("image")}
            title={hideImage ? t("today.show") : t("today.hide")}
            aria-label={hideImage ? t("today.show") : t("today.hide")}
          >
            <VisibilityIcon hidden={hideImage} />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default memo(KangiInfo);
