"use client";

import { useSession } from "next-auth/react";
import { ReactNode, memo } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";

type PaidGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** When true, render fallback instead of returning null when unpaid */
  showFallback?: boolean;
};

export function useIsPaid() {
  const { data: session } = useSession();
  return Boolean(session?.paymentInfo?.isValid);
}

/**
 * Renders children only when the session has a valid paid subscription.
 * Use with PaidButton for actions, or wrap paid-only UI sections.
 */
const PaidGate = ({
  children,
  fallback = null,
  showFallback = true,
}: PaidGateProps) => {
  const isPaid = useIsPaid();
  const { t } = useTranslations();

  if (isPaid) {
    return <>{children}</>;
  }

  if (!showFallback) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <p className="text-sm text-muted-foreground py-2" role="status">
      {t("common.paidOnly")}
    </p>
  );
};

export default memo(PaidGate);
