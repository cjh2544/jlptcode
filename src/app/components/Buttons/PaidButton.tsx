"use client";

import React, { memo, MouseEvent } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsPaid } from "@/app/components/Buttons/PaidGate";

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
  const { t } = useTranslations();
  const isEnabled = useIsPaid();
  const label = name ?? t("common.query");
  const isAccent = color === "pink" || color === "red";

  return (
    <Button
      type="button"
      variant={isAccent ? "destructive" : "default"}
      size="lg"
      disabled={!isEnabled}
      onClick={(e) => onClick?.(e)}
      className={cn(
        "h-10 gap-2 rounded-[var(--radius-md)] text-xs font-semibold uppercase tracking-wide",
        !isEnabled && "cursor-not-allowed",
        className,
      )}
    >
      {iconClassName && <i className={`fas ${iconClassName}`} aria-hidden />}
      {isEnabled ? label : t("common.paidFeature")}
    </Button>
  );
};

export default memo(PaidButton);
