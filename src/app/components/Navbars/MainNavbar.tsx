"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { Collapse } from "@material-tailwind/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import SignInHeaderPage from "../SignIn/SignInHeader";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { key: "nav.speakToday", link: "/speakToday" },
  { key: "nav.jlpt", link: "/levelUp?level=N1" },
  { key: "nav.wordToday", link: "/wordToday" },
  { key: "nav.jpt", link: "/jptLevelUp" },
  { key: "nav.community", link: "/board/community/list" },
] as const;

export default function MainNavbar() {
  const { t } = useTranslations();
  const [openNav, setOpenNav] = useState(false);

  const menuList = useMemo(
    () => NAV_LINKS.map((item) => ({ name: t(item.key), link: item.link })),
    [t],
  );

  const handleClickMenuBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpenNav(!openNav);
  };

  useEffect(() => {
    window.addEventListener("resize", () => setOpenNav(false));
  }, []);

  return (
    <>
      <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
            <div className="mr-4 flex flex-wrap items-center">
              <a
                className="text-lg font-bold leading-relaxed inline-block mr-2 py-2 whitespace-no-wrap uppercase text-white"
                href="/"
              >
                JLPTCODE
              </a>
              <LanguageSwitcher />
              <a
                className="text-lg font-bold leading-relaxed inline-block py-2 ml-2 whitespace-no-wrap uppercase text-red-500"
                href="https://www.youtube.com/@JLPTCODE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-youtube text-red-500"></i>
              </a>
            </div>
            <div className="flex items-center">
              <div className="lg:hidden">
                <SignInHeaderPage />
              </div>
              <button
                onClick={(e) => handleClickMenuBtn(e)}
                className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
              >
                <span className="block relative w-6 h-px rounded-sm bg-white"></span>
                <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
              </button>
            </div>
          </div>
          <div className="flex-col md:flex-row list-none items-center hidden lg:flex">
            <SignInHeaderPage />
            <ul className="flex flex-col lg:flex-row list-none ml-auto">
              {menuList.map((item, idx) => (
                <li key={`main-nav-menu-${idx}`} className="nav-item">
                  <Link
                    scroll={false}
                    href={item.link}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Collapse open={openNav}>
            <div className="p-4 rounded-lg bg-white">
              <ul className="flex flex-col lg:flex-row list-none ml-auto gap-2">
                {menuList.map((item, idx) => (
                  <li key={`main-nav-dropdown-menu-${idx}`} className="nav-item">
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
          </Collapse>
        </div>
      </nav>
    </>
  );
}
