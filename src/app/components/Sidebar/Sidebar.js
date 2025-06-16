'use client';
import React from "react";
import Link from "next/link";
// import { useRouter } from "next/router";

import { useRouter, usePathname } from 'next/navigation';
import SignInSidebarPage from "../SignIn/SignInSidebar";
import SignInSidebarListPage from "../SignIn/SignInSidebarList";
import SignInUserList from "../SignIn/SignInUserList";

// import NotificationDropdown from "@/app/components/Dropdowns/NotificationDropdown";
// import UserDropdown from "@/app/components/Dropdowns/UserDropdown";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link scroll={false} href="/" passHref legacyBehavior>
            <a
              href="#"
              className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            >
              JLPTCODE
            </a>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <SignInSidebarPage />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link scroll={false} href="/" passHref legacyBehavior>
                    <a
                      href="#"
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    >
                      JLPTCODE
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <SignInSidebarListPage />

            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              오늘의 일본어
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li className="items-center">
                <Link scroll={false} href="/wordToday" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  오늘의 단어
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/sentenceToday" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  오늘의 문장
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/grammarToday" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  오늘의 문법
                </Link>
              </li>
              {/* <li className="items-center">
                <Link scroll={false} href="/readingToday" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  오늘의 독해
                  <span className="bg-red-500 text-white text-xs font-medium ml-2 px-1 rounded-sm">N</span>
                </Link>
              </li> */}
              <li className="items-center">
                <Link scroll={false} href="/speakToday" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  오늘의 회화학습
                  <span className="bg-red-500 text-white text-xs font-medium ml-2 px-1 rounded-sm">N</span>
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              레벨업(Level up)
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li className="items-center">
                <Link scroll={false} href="/levelUp?level=N1" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N1
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/levelUp?level=N2" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N2
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/levelUp?level=N3" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N3
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/levelUp?level=N4" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N4
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/levelUp?level=N5" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N5
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/strategy" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  집중공략
                  <span className="bg-red-500 text-white text-xs font-medium ml-2 px-1 rounded-sm">N</span>
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              모의고사(TEST)<span className="bg-red-500 text-white text-xs font-medium ml-2 px-1 rounded-sm">N</span>
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li className="items-center">
                <Link scroll={false} href="/jlptTest?level=N1" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N1
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlptTest?level=N2" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N2
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlptTest?level=N3" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N3
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlptTest?level=N4" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N4
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlptTest?level=N5" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-paper-plane text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N5
                </Link>
              </li>
            </ul>

            {/* Divider */}
            {/* <hr className="my-4 md:min-w-full" /> */}
            {/* Heading */}
            {/* <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              JLPT(2024~2010)
            </h6> */}
            {/* Navigation */}

            {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link scroll={false} href="/jlpt?level=N1" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N1
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlpt?level=N2" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N2
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlpt?level=N3" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N3
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlpt?level=N4" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N4
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/jlpt?level=N5" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  N5
                </Link>
              </li>
            </ul> */}

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              단어 | 単語 | WORD
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link scroll={false} href="/word/jlpt" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-spell-check text-blueGray-400 mr-2 text-sm"></i>{" "}
                  JLPT(N1~N5)
                </Link>
              </li>
              <li className="items-center">
                <Link scroll={false} href="/word/slide" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-spell-check text-blueGray-400 mr-2 text-sm"></i>{" "}
                  깜빡이 일본어
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              게시판
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link scroll={false} href="/board/community/list" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                  문의 게시판
                </Link>
              </li>
              <SignInUserList />
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
