"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { formatInSeoul } from "@/app/utils/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

type UserAccountPanelProps = {
  variant?: "dropdown" | "sidebar";
};

function getInitial(name?: string | null) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

export default function UserAccountPanel({
  variant = "sidebar",
}: UserAccountPanelProps) {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const isSidebar = variant === "sidebar";

  if (!session) {
    return (
      <div
        className={cn(
          "app-account-panel",
          isSidebar && "app-account-panel--sidebar",
        )}
      >
        <div className="app-account-panel-guest">
          <p className="app-account-panel-guest-text">{t("auth.noAccount")}</p>
          <Button
            type="button"
            size="sm"
            className="w-full font-semibold"
            onClick={() => signIn()}
          >
            <i className="fas fa-right-to-bracket" aria-hidden />
            {t("auth.signIn")}
          </Button>
        </div>
      </div>
    );
  }

  const name = session.user?.name || "";
  const email = session.user?.email || "";
  const paid = session.paymentInfo?.isValid;

  return (
    <div
      className={cn(
        "app-account-panel",
        isSidebar && "app-account-panel--sidebar",
      )}
    >
      {!isSidebar && (
        <div className="app-account-menu-header">
          <span className="app-account-menu-avatar">{getInitial(name)}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {name}
              {t("auth.userSuffix")}
            </p>
            {email && (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            )}
          </div>
        </div>
      )}

      {paid && (
        <div
          className={cn(
            "app-account-menu-paid",
            isSidebar && "app-account-menu-paid--sidebar",
          )}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-[color-mix(in_oklab,var(--primary)_75%,black)]">
            <i className="fas fa-crown text-[0.7rem]" aria-hidden />
            {t("auth.paidPeriod")}
          </div>
          <p className="mt-1 text-xs tabular-nums text-muted-foreground">
            {formatInSeoul(session.paymentInfo?.startDate, "yyyy-MM-dd")} ~{" "}
            {formatInSeoul(session.paymentInfo?.endDate, "yyyy-MM-dd")}
          </p>
        </div>
      )}

      {isSidebar ? (
        <div className="app-sidebar-account-actions">
          <Link
            scroll={false}
            href="/auth/modify"
            className="app-sidebar-account-action"
            title={t("auth.editProfile")}
            aria-label={t("auth.editProfile")}
          >
            <i className="fas fa-user-pen" aria-hidden />
            <span>{t("auth.editProfileShort")}</span>
          </Link>
          <Link
            scroll={false}
            href="/auth/delete"
            className="app-sidebar-account-action"
            title={t("auth.deleteAccount")}
            aria-label={t("auth.deleteAccount")}
          >
            <i className="fas fa-user-slash" aria-hidden />
            <span>{t("auth.deleteAccountShort")}</span>
          </Link>
          <button
            type="button"
            className="app-sidebar-account-action app-sidebar-account-action--logout"
            onClick={() => signOut()}
            title={t("auth.signOut")}
            aria-label={t("auth.signOut")}
          >
            <i className="fas fa-right-from-bracket" aria-hidden />
            <span>{t("auth.signOut")}</span>
          </button>
        </div>
      ) : (
        <>
          <div className="app-account-panel-section">
            <p className="app-account-panel-label">{t("auth.accountMenu")}</p>
            <ul className="app-account-panel-list">
              <li>
                <Link
                  scroll={false}
                  href="/auth/modify"
                  className="app-account-panel-link"
                >
                  <i
                    className="fas fa-user-pen w-4 text-center text-muted-foreground"
                    aria-hidden
                  />
                  {t("auth.editProfile")}
                </Link>
              </li>
              <li>
                <Link
                  scroll={false}
                  href="/auth/delete"
                  className="app-account-panel-link"
                >
                  <i
                    className="fas fa-user-slash w-4 text-center text-muted-foreground"
                    aria-hidden
                  />
                  {t("auth.deleteAccount")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="app-account-panel-footer">
            <button
              type="button"
              className="app-account-panel-logout"
              onClick={() => signOut()}
            >
              <i
                className="fas fa-right-from-bracket w-4 text-center"
                aria-hidden
              />
              {t("auth.signOut")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
