"use client";

import React, { FormEvent, memo, useMemo, useState } from "react";
import { PAYMENT_PERIOD } from "@/app/constants/constants";
import { z } from "zod";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { formatInSeoul } from "@/app/utils/common";
import { useTranslations } from "@/app/providers/I18nProvider";
import { useUserStore } from "@/app/store/userStore";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type MemberRowInfoProps = {
  userInfo: User;
};

const isLifetimeDate = (value?: Date | string | null) => {
  if (!value) return false;
  const year = new Date(value).getFullYear();
  return year >= 9999;
};

const MemberRowInfo = (props: MemberRowInfoProps) => {
  const { t } = useTranslations();
  const { userInfo } = props;
  const getUserList = useUserStore((state: any) => state.getUserList);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmType, setConfirmType] = useState<"info" | "error" | "warning">(
    "info",
  );
  const [showModal, setShowModal] = useState(false);
  const [paymentType, setPaymentType] = useState(
    userInfo?.lastPayment?.paymentType || "M",
  );

  const paidType = userInfo?.lastPayment?.paymentType;
  const isPaid = Boolean(userInfo?.isValid);
  const hasPeriod = Boolean(
    userInfo?.lastPayment?.startDate && userInfo?.lastPayment?.endDate,
  );
  const lifetime = isLifetimeDate(userInfo?.lastPayment?.endDate);

  const periodLabel = useMemo(() => {
    if (!hasPeriod) return t("member.unpaid");
    if (lifetime) return t("member.periodU");
    return `${formatInSeoul(userInfo.lastPayment?.startDate, "yyyy-MM-dd")} ~ ${formatInSeoul(userInfo.lastPayment?.endDate, "yyyy-MM-dd")}`;
  }, [hasPeriod, lifetime, t, userInfo.lastPayment?.endDate, userInfo.lastPayment?.startDate]);

  const statusBadge = isPaid
    ? { className: "app-board-badge--paid", label: t("member.paid") }
    : hasPeriod
      ? { className: "app-board-badge--expired", label: t("member.expired") }
      : { className: "app-board-badge--expired", label: t("member.unpaid") };

  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);
  };

  const handleOpenChange = (open: boolean) => {
    setShowModal(open);
    if (open) {
      setPaymentType(userInfo?.lastPayment?.paymentType || "M");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setConfirmType("info");

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/userPayment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setConfirmMsg(data.message);
        setShowConfirm(true);
        setShowModal(false);
        await getUserList();
      } else if (data.error) {
        setConfirmType("error");
        setConfirmMsg(data.error.issues[0].message);
        setShowConfirm(true);
      } else {
        setConfirmType("warning");
        setConfirmMsg(data.message);
        setShowConfirm(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <tr>
        <td>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium text-[var(--foreground)]">
              {userInfo.name}
            </span>
            <span className={cn("app-board-badge", statusBadge.className)}>
              {statusBadge.label}
            </span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5 text-xs text-[var(--muted-foreground)] lg:hidden">
            <span className="truncate sm:hidden">{userInfo.email}</span>
            <span className="tabular-nums md:hidden">
              {formatInSeoul(userInfo.createdAt, "yyyy-MM-dd HH:mm")}
            </span>
            <span>{periodLabel}</span>
          </div>
        </td>
        <td className="hidden sm:table-cell">
          <span className="block max-w-56 truncate text-sm text-[var(--foreground)]">
            {userInfo.email}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className="text-sm tabular-nums text-[var(--muted-foreground)]">
            {formatInSeoul(userInfo.createdAt, "yyyy-MM-dd HH:mm")}
          </span>
        </td>
        <td className="hidden lg:table-cell">
          <span className="text-sm tabular-nums text-[var(--muted-foreground)]">
            {periodLabel}
          </span>
        </td>
        <td>
          <div className="flex flex-col items-start gap-1.5">
            {paidType && (
              <span className="hidden text-xs text-[var(--muted-foreground)] sm:inline">
                {t(`member.period${paidType}`)}
              </span>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={() => handleOpenChange(true)}
            >
              <CalendarPlus className="size-3.5" aria-hidden />
              <span className="lg:hidden">{t("member.apply")}</span>
              <span className="hidden lg:inline">{t("member.applyPaid")}</span>
            </Button>
          </div>
        </td>
      </tr>

      <Dialog open={showModal} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <form onSubmit={onSubmit} className="contents">
            <input type="hidden" name="email" value={userInfo?.email ?? ""} />
            <DialogHeader className="mb-4">
              <DialogTitle>{userInfo.name}</DialogTitle>
              <DialogDescription>
                {t("member.applyPaidDesc").replace(
                  "{name}",
                  userInfo.name || "",
                )}
              </DialogDescription>
            </DialogHeader>
            <fieldset className="mb-4 grid gap-2">
              <legend className="mb-1 text-xs font-semibold text-muted-foreground">
                {t("member.selectPlan")}
              </legend>
              {PAYMENT_PERIOD.map((item: { name: string; value: string }) => (
                <label
                  key={`payment-period-${item.value}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm transition-colors",
                    paymentType === item.value &&
                      "border-[color-mix(in_oklab,var(--primary)_45%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))]",
                  )}
                >
                  <input
                    type="radio"
                    className="size-4 accent-[var(--primary)]"
                    name="paymentType"
                    value={item.value}
                    checked={paymentType === item.value}
                    onChange={() => setPaymentType(item.value)}
                    required
                  />
                  <span>{t(`member.period${item.value}`)}</span>
                </label>
              ))}
            </fieldset>
            <DialogFooter className="flex-row sm:justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-9 min-w-0 flex-1 gap-1.5 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {t("common.processing")}
                  </>
                ) : (
                  t("member.apply")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 min-w-0 flex-1 sm:flex-none"
                onClick={() => handleOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ModalConfirm
        type={confirmType}
        message={confirmMsg}
        visible={isShowConfirm}
        onClose={(visible: boolean) => handleCloseModal(visible)}
      />
    </>
  );
};

export default memo(MemberRowInfo);
