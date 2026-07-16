"use client";

import { useSession } from "next-auth/react";
import React, { memo, MouseEvent } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";

type Props = {
  name?: string;
  className?: string;
  iconClassName?: string;
  color?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
};

const PaidButton = ({
  name,
  className,
  iconClassName = "fa-search",
  color = "lightBlue",
  onClick,
}: Props) => {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const isEnabled = session?.paymentInfo?.isValid;
  const label = name ?? t("common.query");

  return (
    <button
      disabled={!isEnabled}
      onClick={(e) => onClick?.(e)}
      className={`text-white active:bg-${color}-600 font-bold uppercase px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${className} ${
        isEnabled
          ? `bg-${color}-500 hover:bg-${color}-600`
          : `bg-${color}-500 cursor-not-allowed`
      }`}
    >
      <>
        {iconClassName && <i className={`fas ${iconClassName}`}></i>}
        {isEnabled ? label : t("common.paidFeature")}
      </>
    </button>
  );
};

export default memo(PaidButton);
