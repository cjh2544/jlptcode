"use client";

import React, { FormEvent, memo, useMemo, useState } from "react";
import { PAYMENT_PERIOD, isAdminRole } from "@/app/constants/constants";
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
import { CalendarPlus, KeyRound, ShieldCheck, ShieldOff } from "lucide-react";
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

  const isAdmin = isAdminRole(userInfo.role);

  const [isLoading, setIsLoading] = useState(false);

  // result confirm (info / error after API call)
  const [resultConfirm, setResultConfirm] = useState<{
    visible: boolean;
    type: "info" | "error" | "warning";
    message: string;
  }>({ visible: false, type: "info", message: "" });

  // role change confirm
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);

  // password reset dialog
  const [showResetPw, setShowResetPw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showResetPwConfirm, setShowResetPwConfirm] = useState(false);

  // payment dialog
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

  const showResult = (
    type: "info" | "error" | "warning",
    message: string,
  ) => {
    setResultConfirm({ visible: true, type, message });
  };

  // ── Role change ──
  const executeRoleChange = async () => {
    setIsLoading(true);
    try {
      const newRole = isAdmin ? ["user"] : ["user", "admin"];
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInfo.email, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        showResult("info", data.message);
        await getUserList();
      } else {
        showResult("error", data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Password reset ──
  const executeResetPassword = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInfo.email, password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showResult("info", data.message);
        setNewPassword("");
      } else if (data.error?.issues) {
        showResult("error", data.error.issues[0].message);
      } else {
        showResult("error", data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Payment submit ──
  const handleOpenChange = (open: boolean) => {
    setShowModal(open);
    if (open) {
      setPaymentType(userInfo?.lastPayment?.paymentType || "M");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/userPayment", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        showResult("info", data.message);
        setShowModal(false);
        await getUserList();
      } else if (data.error) {
        showResult("error", data.error.issues[0].message);
      } else {
        showResult("warning", data.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextRoleLabel = isAdmin ? t("member.roleUser") : t("member.roleAdmin");

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
        <td>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "app-board-badge",
                isAdmin ? "app-board-badge--paid" : "app-board-badge--expired",
              )}
            >
              {isAdmin ? t("member.roleAdmin") : t("member.roleUser")}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              disabled={isLoading}
              title={t("member.changeRole")}
              onClick={() => setShowRoleConfirm(true)}
            >
              {isAdmin ? (
                <ShieldOff className="size-3.5" aria-hidden />
              ) : (
                <ShieldCheck className="size-3.5" aria-hidden />
              )}
            </Button>
          </div>
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
            <div className="flex items-center gap-1.5">
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
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1.5"
                onClick={() => {
                  setNewPassword("");
                  setShowResetPw(true);
                }}
              >
                <KeyRound className="size-3.5" aria-hidden />
                <span className="hidden lg:inline">{t("member.resetPassword")}</span>
              </Button>
            </div>
          </div>
        </td>
      </tr>

      {/* ── Role change confirm ── */}
      <ModalConfirm
        type="warning"
        message={t("member.confirmRoleChange")
          .replace("{name}", userInfo.name || "")
          .replace("{role}", nextRoleLabel)}
        visible={showRoleConfirm}
        showCancel
        onClose={() => setShowRoleConfirm(false)}
        onConfirm={executeRoleChange}
      />

      {/* ── Password reset dialog (input) ── */}
      <Dialog open={showResetPw} onOpenChange={setShowResetPw}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader className="mb-4">
            <DialogTitle>{t("member.resetPassword")}</DialogTitle>
            <DialogDescription>
              {t("member.resetPasswordDesc").replace("{name}", userInfo.name || "")}
            </DialogDescription>
          </DialogHeader>
          <input
            type="password"
            autoComplete="new-password"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            placeholder={t("member.newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            maxLength={20}
          />
          <DialogFooter className="flex-row sm:justify-end">
            <Button
              type="button"
              disabled={isLoading || newPassword.length < 6}
              className="h-9 min-w-0 flex-1 gap-1.5 sm:flex-none"
              onClick={() => {
                setShowResetPw(false);
                setShowResetPwConfirm(true);
              }}
            >
              {t("member.resetPassword")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 min-w-0 flex-1 sm:flex-none"
              onClick={() => setShowResetPw(false)}
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Password reset confirm ── */}
      <ModalConfirm
        type="warning"
        message={t("member.confirmResetPassword")}
        visible={showResetPwConfirm}
        showCancel
        onClose={() => setShowResetPwConfirm(false)}
        onConfirm={executeResetPassword}
      />

      {/* ── Payment dialog ── */}
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

      {/* ── Result confirm ── */}
      <ModalConfirm
        type={resultConfirm.type}
        message={resultConfirm.message}
        visible={resultConfirm.visible}
        onClose={() => setResultConfirm((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default memo(MemberRowInfo);
