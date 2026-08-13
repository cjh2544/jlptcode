"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { useSidebarStore } from "@/app/store/sidebarStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import LanguageSwitcher from "../Navbars/LanguageSwitcher";
import SignInSidebarPage from "../SignIn/SignInSidebar";
import SignInSidebarListPage from "../SignIn/SignInSidebarList";
import SignInUserList from "../SignIn/SignInUserList";

const YOUTUBE_URL = "https://www.youtube.com/@JLPTCODE";

type NavItem = {
  key: string;
  href: string;
  icon: string;
  badge?: "recommended" | "new";
};

type NavSection = {
  titleKey: string;
  titleBadge?: "recommended" | "new";
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    titleKey: "nav.speakToday",
    titleBadge: "recommended",
    items: [
      {
        key: "sidebar.speakConversation",
        href: "/speakToday",
        icon: "fas fa-comment-dots",
      },
      {
        key: "sidebar.speakMaster100",
        href: "/speakMaster",
        icon: "fas fa-microphone",
      },
    ],
  },
  {
    titleKey: "nav.jlpt",
    items: [
      {
        key: "sidebar.levelUp",
        href: "/levelUp?level=N1",
        icon: "fas fa-chart-line",
      },
      {
        key: "sidebar.strategy",
        href: "/strategy",
        icon: "fas fa-bullseye",
        badge: "recommended",
      },
      {
        key: "sidebar.mockTest",
        href: "/jlptTest?level=N1",
        icon: "fas fa-clipboard-check",
      },
    ],
  },
  {
    titleKey: "nav.wordToday",
    items: [
      {
        key: "sidebar.todayWord",
        href: "/wordToday",
        icon: "fas fa-book-open",
      },
      {
        key: "sidebar.todaySentence",
        href: "/sentenceToday",
        icon: "fas fa-align-left",
      },
      {
        key: "sidebar.todayGrammar",
        href: "/grammarToday",
        icon: "fas fa-pen-ruler",
      },
    ],
  },
  {
    titleKey: "nav.jpt",
    titleBadge: "new",
    items: [
      {
        key: "sidebar.levelUp",
        href: "/jptLevelUp",
        icon: "fas fa-graduation-cap",
      },
      {
        key: "sidebar.strategy",
        href: "/jptStrategy",
        icon: "fas fa-crosshairs",
      },
    ],
  },
  {
    titleKey: "sidebar.wordSection",
    items: [
      {
        key: "sidebar.jlptWord",
        href: "/word/jlpt",
        icon: "fas fa-spell-check",
      },
      {
        key: "sidebar.flashWord",
        href: "/word/slide",
        icon: "fas fa-clone",
      },
    ],
  },
  {
    titleKey: "sidebar.board",
    items: [
      {
        key: "nav.community",
        href: "/board/community/list",
        icon: "fas fa-comments",
      },
    ],
  },
];

function SidebarBadge({
  type,
  label,
  variant = "link",
}: {
  type: "recommended" | "new";
  label: string;
  variant?: "section" | "link";
}) {
  const iconClass =
    type === "recommended" ? "fa-solid fa-star" : "fa-solid fa-sparkles";

  return (
    <span
      className={cn(
        "app-sidebar-badge",
        type === "recommended" && "app-sidebar-badge--recommended",
        type === "new" && "app-sidebar-badge--new",
        variant === "section" && "app-sidebar-badge--section",
      )}
      aria-label={label}
    >
      <i className={cn("app-sidebar-badge-icon", iconClass)} aria-hidden />
      <span className="app-sidebar-badge-text">{label}</span>
    </span>
  );
}

function getBadgeLabel(
  t: (key: string) => string,
  badge?: "recommended" | "new",
) {
  if (badge === "recommended") return t("sidebar.recommended");
  if (badge === "new") return t("sidebar.newBadge");
  return undefined;
}

function isActivePath(pathname: string, href: string) {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

function SidebarNavLink({
  href,
  icon,
  label,
  badge,
  badgeLabel,
  onNavigate,
}: {
  href: string;
  icon: string;
  label: string;
  badge?: "recommended" | "new";
  badgeLabel?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      scroll={false}
      href={href}
      onClick={onNavigate}
      className={cn("app-sidebar-link", active && "app-sidebar-link--active")}
      aria-current={active ? "page" : undefined}
    >
      <span className="app-sidebar-link-icon">
        <i className={icon} aria-hidden />
      </span>
      <span className="app-sidebar-link-label">{label}</span>
      {badge && badgeLabel && (
        <SidebarBadge type={badge} label={badgeLabel} />
      )}
    </Link>
  );
}

export function SidebarMobileBar() {
  const { t } = useTranslations();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const toggleMobileOpen = useSidebarStore((state) => state.toggleMobileOpen);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const handleMenuClick = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      toggleCollapsed();
      return;
    }
    toggleMobileOpen();
  };

  return (
    <div
      className={cn(
        "app-sidebar-mobile-bar",
        !collapsed && "md:hidden",
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="app-sidebar-mobile-btn"
        onClick={handleMenuClick}
        aria-label={
          mobileOpen
            ? t("common.closeMenu")
            : collapsed
              ? t("common.expandMenu")
              : t("common.menu")
        }
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <X className="size-4" />
        ) : (
          <Menu className="size-4" />
        )}
      </Button>
      <Link href="/" scroll={false} className="app-sidebar-mobile-brand">
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden
          width={16}
          height={16}
          decoding="async"
        />
        <span>
          <span className="text-[#ef4444]">JLPT</span>
          <span className="text-primary">CODE</span>
        </span>
      </Link>
      <div className="ml-auto">
        <SignInSidebarPage />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { t } = useTranslations();
  const pathname = usePathname();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <aside
        className={cn(
          "app-sidebar",
          collapsed && "app-sidebar--collapsed",
          mobileOpen && "app-sidebar--mobile-open",
        )}
        aria-label={t("common.menu")}
      >
        <div className="app-sidebar-header">
          <Link href="/" scroll={false} className="app-sidebar-brand">
            <img
              src="/images/logo.png"
              alt=""
              aria-hidden
              className="app-sidebar-brand-icon"
              width={16}
              height={16}
              decoding="async"
            />
            <span className="app-sidebar-brand-text">
              <span className="app-sidebar-brand-jlpt">JLPT</span>
              <span className="app-sidebar-brand-code">CODE</span>
            </span>
          </Link>

          <div className="app-sidebar-header-actions">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="app-sidebar-collapse-btn hidden md:inline-flex"
              onClick={toggleCollapsed}
              aria-label={t("common.collapseMenu")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="app-sidebar-collapse-btn md:hidden"
              onClick={closeMobile}
              aria-label={t("common.closeMenu")}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="app-sidebar-tools">
          <div className="app-sidebar-lang">
            <LanguageSwitcher variant="sidebar" menuAlign="start" />
          </div>
          <a
            className="app-sidebar-youtube"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <i className="fa-brands fa-youtube" aria-hidden />
          </a>
        </div>

        <nav className="app-sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <section key={section.titleKey} className="app-sidebar-section">
              <h2 className="app-sidebar-section-title">
                {t(section.titleKey)}
                {section.titleBadge && (
                  <SidebarBadge
                    type={section.titleBadge}
                    label={getBadgeLabel(t, section.titleBadge) ?? ""}
                    variant="section"
                  />
                )}
              </h2>
              <ul className="app-sidebar-list">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <SidebarNavLink
                      href={item.href}
                      icon={item.icon}
                      label={t(item.key)}
                      badge={item.badge}
                      badgeLabel={getBadgeLabel(t, item.badge)}
                      onNavigate={closeMobile}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <SignInUserList />
        </nav>

        <div className="app-sidebar-footer">
          <SignInSidebarListPage />
        </div>
      </aside>
    </>
  );
}
