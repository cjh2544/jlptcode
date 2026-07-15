"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { formatInSeoul } from "@/app/utils/common";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function PaymentPeriodInfo({
  className,
  as = "div",
}: {
  className?: string;
  as?: "div" | "li";
}) {
  const { data: session } = useSession();
  const { t } = useTranslations();

  if (!session?.paymentInfo?.isValid) {
    return null;
  }

  const content = (
    <>
      <i className="fas fa-star mr-1" />
      {t("auth.paidPeriod")}
      <br />
      {formatInSeoul(session.paymentInfo.startDate, "yyyy-MM-dd")} ~{" "}
      {formatInSeoul(session.paymentInfo.endDate, "yyyy-MM-dd")}
    </>
  );

  if (as === "li") {
    return <li className={className}>{content}</li>;
  }

  return <div className={className}>{content}</div>;
}

export function EditProfileLink({ className }: { className: string }) {
  const { t } = useTranslations();

  return (
    <Link scroll={false} href="/auth/modify" className={className}>
      <i className="fas fa-user mr-1" />
      {t("auth.editProfile")}
    </Link>
  );
}

export function DeleteAccountLink({ className }: { className: string }) {
  const { t } = useTranslations();

  return (
    <Link scroll={false} href="/auth/delete" className={className}>
      <i className="fas fa-user mr-1" />
      {t("auth.deleteAccount")}
    </Link>
  );
}

export function SignOutLink({ className }: { className: string }) {
  const { t } = useTranslations();

  return (
    <a
      onClick={() => signOut()}
      href="#"
      className={className}
      aria-label={t("auth.signOut")}
    >
      <i className="fas fa-right-from-bracket mr-1" />
      {t("auth.signOut")}
    </a>
  );
}

export function SignInLink({ className }: { className: string }) {
  const { t } = useTranslations();

  return (
    <a
      onClick={() => signIn()}
      href="#"
      className={className}
      aria-label={t("auth.signIn")}
    >
      <i className="fas fa-right-from-bracket mr-1" />
      {t("auth.signIn")}
    </a>
  );
}

export function SignInButton({
  className,
  showLabel = true,
  hideLabelOnXs = true,
}: {
  className: string;
  showLabel?: boolean;
  hideLabelOnXs?: boolean;
}) {
  const { t } = useTranslations();
  const labelClass = hideLabelOnXs ? "xs:hidden mr-1" : "mr-1";

  return (
    <button
      onClick={() => signIn()}
      className={className}
      type="button"
      aria-label={t("auth.signIn")}
    >
      {showLabel && <span className={labelClass}>{t("auth.signIn")}</span>}
      <i className={`fas fa-right-to-bracket${showLabel && !hideLabelOnXs ? " ml-1" : ""}`} />
    </button>
  );
}

export function UserNameLabel({ className }: { className?: string }) {
  const { data: session } = useSession();
  const { t } = useTranslations();

  if (!session?.user?.name) {
    return null;
  }

  return (
    <span className={className}>
      {session.user.name}
      {t("auth.userSuffix")}
    </span>
  );
}
