"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import Navbar from "./components/Navbars/MainNavbar";
import Footer from "./components/Footers/Footer";
import MainBackground from "./components/Images/MainBackground";
import MainBackgroundTitle from "./components/Images/MainBackgroundTitle";
import Link from "next/link";

const HOME_CARDS = [
  { key: "home.speakToday", link: "/speakToday", icon: "fas fa-comment-dots", color: "bg-emerald-400" },
  { key: "home.jlpt", link: "/levelUp?level=N1", icon: "fas fa-list-ol", color: "bg-lightBlue-400" },
  { key: "home.wordToday", link: "/wordToday", icon: "fas fa-paper-plane", color: "bg-red-400" },
  { key: "home.jpt", link: "/jptLevelUp", icon: "fas fa-list-ol", color: "bg-lightBlue-400" },
] as const;

export default function Home() {
  const { t } = useTranslations();

  return (
    <>
      <Navbar />

      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
        <div className="absolute top-0 w-full h-full bg-center bg-cover">
          <MainBackground />
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-75 bg-black"
          ></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full md:w-6/12 lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <MainBackgroundTitle />
            </div>
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </div>

      <section className="pb-20 bg-blueGray-200 -mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            {HOME_CARDS.map((card) => (
              <Link
                key={card.key}
                scroll={false}
                href={card.link}
                className="w-full lg:w-3/12 px-4 text-center"
              >
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div
                      className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full ${card.color}`}
                    >
                      <i className={card.icon}></i>
                    </div>
                    <h6 className="text-xl font-semibold">{t(card.key)}</h6>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
