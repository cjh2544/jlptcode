import Link from "next/link";
import React from "react";

export default function Footer() {
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
                <li>
                  <Link scroll={false} href={'/speakToday'} className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75">
                    일본어스피킹
                  </Link>
                </li>
                <li>
                  <Link scroll={false} href={'/levelUp?level=N1'} className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75">
                    JLPT
                  </Link>
                </li>
                <li>
                  <Link scroll={false} href={'/wordToday'} className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75">
                    오늘의 일본어
                  </Link>
                </li>
                <li>
                  <Link scroll={false} href={'/jptLevelUp'} className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75">
                    JPT
                  </Link>
                </li>
                <li>
                  <Link scroll={false} href={'/board/community/list'} className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75">
                    문의 게시판
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
