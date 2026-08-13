"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import Navbar from "./components/Navbars/MainNavbar";
import Footer from "./components/Footers/Footer";
import MainBackground from "./components/Images/MainBackground";
import MainBackgroundTitle from "./components/Images/MainBackgroundTitle";
import Link from "next/link";
import { useMemo } from "react";

const HOME_CARDS = [
  {
    key: "home.speakToday",
    link: "/speakToday",
    icon: "fas fa-comment-dots",
    gradient: "from-emerald-500 to-teal-600",
    descKey: "home.speakTodayDesc",
  },
  {
    key: "home.jlpt",
    link: "/levelUp?level=N1",
    icon: "fas fa-list-ol",
    gradient: "from-brand-500 to-brand-700",
    descKey: "home.jlptDesc",
  },
  {
    key: "home.wordToday",
    link: "/wordToday",
    icon: "fas fa-paper-plane",
    gradient: "from-rose-500 to-orange-500",
    descKey: "home.wordTodayDesc",
  },
  {
    key: "home.jpt",
    link: "/jptLevelUp",
    icon: "fas fa-graduation-cap",
    gradient: "from-sky-500 to-blue-600",
    descKey: "home.jptDesc",
    koOnly: true,
  },
] as const;

export default function Home() {
  const { t, locale } = useTranslations();
  const cards = useMemo(
    () => HOME_CARDS.filter((card) => locale === "ko" || !("koOnly" in card && card.koOnly)),
    [locale],
  );

  return (
    <>
      <Navbar />

      <section className="relative isolate flex min-h-screen-75 items-center justify-center overflow-hidden pt-16 pb-32">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <MainBackground />
          </div>
          <div
            className="absolute inset-0 bg-black/45"
            aria-hidden
          />
        </div>

        {/* Hero content */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <MainBackgroundTitle />
            <p className="home-hero-subtitle mt-8 text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl lg:text-3xl">
              {t("home.subtitle")}
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full fill-blue-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 2560 100"
          >
            <polygon points="2560 0 2560 100 0 100" />
          </svg>
        </div>
      </section>

      <section className="relative z-20 app-page-bg -mt-24 pb-20 pt-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground">{t("home.startLearning")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("home.startLearningHint")}</p>
          </div>
          <div
            className={`grid gap-6 sm:grid-cols-2 ${
              cards.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {cards.map((card) => (
              <Link key={card.key} scroll={false} href={card.link} className="group block">
                <div className="home-card h-full p-6 text-center">
                  <div
                    className={`home-card-icon mx-auto mb-4 bg-linear-to-br ${card.gradient}`}
                  >
                    <i className={`${card.icon} text-lg`} />
                  </div>
                  <h6 className="text-lg font-bold text-foreground transition-colors group-hover:text-brand-600">
                    {t(card.key)}
                  </h6>
                  <p className="mt-2 text-sm text-muted-foreground">{t(card.descKey)}</p>
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
