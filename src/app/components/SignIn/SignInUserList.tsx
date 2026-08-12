"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const SignInUserList = () => {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const pathname = usePathname();

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes("admin");
  }, [session]);

  if (!isAdmin()) return null;

  const href = "/member/list";
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <section className="app-sidebar-section">
      <h2 className="app-sidebar-section-title">{t("sidebar.memberInfo")}</h2>
      <ul className="app-sidebar-list">
        <li>
          <Link
            scroll={false}
            href={href}
            className={cn("app-sidebar-link", active && "app-sidebar-link--active")}
            aria-current={active ? "page" : undefined}
          >
            <span className="app-sidebar-link-icon">
              <i className="fas fa-users" aria-hidden />
            </span>
            <span className="app-sidebar-link-label">
              {t("sidebar.memberList")}
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default SignInUserList;
