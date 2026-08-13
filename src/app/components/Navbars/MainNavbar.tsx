"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import SignInHeaderPage from "../SignIn/SignInHeader";
import LanguageSwitcher from "./LanguageSwitcher";

const YOUTUBE_URL = "https://www.youtube.com/@JLPTCODE";

const NAV_LINKS = [
  {
    key: "nav.speakToday",
    link: "/speakToday",
    icon: "fas fa-comment-dots",
  },
  {
    key: "nav.jlpt",
    link: "/levelUp?level=N1",
    icon: "fas fa-list-ol",
  },
  {
    key: "nav.wordToday",
    link: "/wordToday",
    icon: "fas fa-book-open",
  },
  {
    key: "nav.jpt",
    link: "/jptLevelUp",
    icon: "fas fa-graduation-cap",
    koOnly: true,
  },
  {
    key: "nav.community",
    link: "/board/community/list",
    icon: "fas fa-comments",
  },
] as const;

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      scroll={false}
      className={`main-nav-brand ${light ? "main-nav-brand--light" : ""}`}
      aria-label="JLPTCODE"
    >
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden
        className="main-nav-brand-icon"
        width={20}
        height={20}
        decoding="async"
      />
      <span className="main-nav-brand-text">
        <span className="main-nav-brand-jlpt">JLPT</span>
        <span className="main-nav-brand-code">CODE</span>
      </span>
    </Link>
  );
}

function YouTubeButton({
  className = "main-nav-youtube",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <a
      className={className}
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="YouTube"
    >
      <i className="fa-brands fa-youtube" aria-hidden />
      {showLabel && <span>YouTube</span>}
    </a>
  );
}

export default function MainNavbar() {
  const { t, locale } = useTranslations();
  const [openNav, setOpenNav] = useState(false);

  const menuList = useMemo(
    () =>
      NAV_LINKS.filter((item) => locale === "ko" || !("koOnly" in item && item.koOnly)).map(
        (item) => ({
          name: t(item.key),
          link: item.link,
          icon: item.icon,
        }),
      ),
    [t, locale],
  );

  return (
    <nav className="main-nav absolute top-0 z-50 w-full">
      <div className="main-nav-inner">
        <div className="main-nav-left">
          <BrandMark light />
        </div>

        <div className="main-nav-center" aria-label={t("common.menu")}>
          <ul className="main-nav-desktop-list">
            {menuList.map((item) => (
              <li key={item.link}>
                <Link
                  scroll={false}
                  href={item.link}
                  className="main-nav-desktop-link"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-nav-right">
          <div className="main-nav-actions">
            <SignInHeaderPage />
            <div
              className="main-nav-utilities"
              aria-label={t("common.languageSelect")}
            >
              <LanguageSwitcher menuAlign="end" />
              <YouTubeButton />
            </div>
          </div>

          <div className="main-nav-mobile">
            <SignInHeaderPage />
            <Sheet open={openNav} onOpenChange={setOpenNav}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="main-nav-menu-btn"
                  type="button"
                  aria-label={t("common.menu")}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="main-nav-sheet w-[min(100%,22rem)] gap-0 p-0"
              >
                <SheetHeader className="main-nav-sheet-header space-y-0 text-left">
                  <SheetTitle className="sr-only">JLPTCODE</SheetTitle>
                  <SheetDescription className="sr-only">
                    {t("common.menu")}
                  </SheetDescription>
                  <BrandMark />
                </SheetHeader>

                <nav
                  className="main-nav-sheet-nav"
                  aria-label={t("common.menu")}
                >
                  <ul className="main-nav-sheet-list">
                    {menuList.map((item) => (
                      <li key={item.link}>
                        <Link
                          scroll={false}
                          href={item.link}
                          onClick={() => setOpenNav(false)}
                          className="main-nav-sheet-link"
                        >
                          <span className="main-nav-sheet-link-icon">
                            <i className={item.icon} aria-hidden />
                          </span>
                          <span className="main-nav-sheet-link-label">
                            {item.name}
                          </span>
                          <i
                            className="fas fa-chevron-right main-nav-sheet-link-arrow"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="main-nav-sheet-footer">
                  <div className="main-nav-sheet-footer-lang">
                    <LanguageSwitcher variant="sidebar" menuAlign="end" />
                  </div>
                  <YouTubeButton
                    className="main-nav-sheet-youtube"
                    showLabel
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
