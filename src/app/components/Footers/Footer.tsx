"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import Link from "next/link";
import React, { useMemo } from "react";

const FOOTER_LINKS = [
  { key: "nav.speakToday", link: "/speakToday" },
  { key: "nav.jlpt", link: "/levelUp?level=N1" },
  { key: "nav.wordToday", link: "/wordToday" },
  { key: "nav.jpt", link: "/jptLevelUp" },
  { key: "nav.community", link: "/board/community/list" },
] as const;

export default function Footer() {
  const { t } = useTranslations();

  const links = useMemo(
    () => FOOTER_LINKS.map((item) => ({ name: t(item.key), link: item.link })),
    [t],
  );

  return (
    <>
      <footer className="block py-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                  className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                >
                  mkjapanese
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                {links.map((item, idx) => (
                  <li key={`footer-link-${idx}`}>
                    <Link
                      scroll={false}
                      href={item.link}
                      className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
