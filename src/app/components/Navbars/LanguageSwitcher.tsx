"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { LOCALE_LABELS, type Locale } from "@/i18n/config";
import React from "react";

const LOCALES: Locale[] = ["ko", "ja", "en", "zh", "my"];

type TrigramLineType = "solid" | "broken";

function KoTrigramBar({
  x,
  y,
  type,
}: {
  x: number;
  y: number;
  type: TrigramLineType;
}) {
  const h = 0.38;
  const w = 2.2;
  if (type === "solid") {
    return <rect x={x} y={y} width={w} height={h} fill="#000" />;
  }
  return (
    <>
      <rect x={x} y={y} width={0.85} height={h} fill="#000" />
      <rect x={x + w - 0.85} y={y} width={0.85} height={h} fill="#000" />
    </>
  );
}

function KoTrigram({
  x,
  y,
  lines,
}: {
  x: number;
  y: number;
  lines: TrigramLineType[];
}) {
  const step = 0.48;
  return (
    <g>
      {lines.map((line, i) => (
        <KoTrigramBar key={i} x={x} y={y + i * step} type={line} />
      ))}
    </g>
  );
}

/** 태극기: 건(좌상), 감(우상), 이(좌하), 곤(우하) */
function FlagKo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="16" fill="#fff" />
      {/* 건 ☰ */}
      <KoTrigram
        x={1.1}
        y={1}
        lines={["solid", "solid", "solid"]}
      />
      {/* 감 ☵ */}
      <KoTrigram
        x={20.8}
        y={1}
        lines={["solid", "broken", "solid"]}
      />
      {/* 이 ☲ */}
      <KoTrigram
        x={1.1}
        y={12.2}
        lines={["broken", "solid", "broken"]}
      />
      {/* 곤 ☷ */}
      <KoTrigram
        x={20.8}
        y={12.2}
        lines={["broken", "broken", "broken"]}
      />
      <g transform="translate(12 8)">
        <circle r="3.5" fill="#cd2e3a" />
        <path
          fill="#0047a0"
          d="M0,-3.5 A3.5,3.5 0 0,1 0,3.5 A1.75,1.75 0 0,1 0,0 A1.75,1.75 0 0,0 0,-3.5 Z"
        />
        <circle cy="-1.75" r="0.75" fill="#cd2e3a" />
        <circle cy="1.75" r="0.75" fill="#0047a0" />
      </g>
    </svg>
  );
}

function FlagJa({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="3.2" fill="#bc002d" />
    </svg>
  );
}

function FlagEn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="16" fill="#b22234" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 2.46} width="24" height="1.23" fill="#fff" />
      ))}
      <rect width="10" height="8.6" fill="#3c3b6e" />
      <g fill="#fff" opacity="0.9">
        <circle cx="2" cy="1.4" r="0.35" />
        <circle cx="5" cy="1.4" r="0.35" />
        <circle cx="8" cy="1.4" r="0.35" />
        <circle cx="3.5" cy="2.8" r="0.35" />
        <circle cx="6.5" cy="2.8" r="0.35" />
      </g>
    </svg>
  );
}

function FlagZh({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="16" fill="#de2910" />
      <polygon
        points="6,3 6.9,5.8 9.8,5.8 7.4,7.4 8.3,10.2 6,8.6 3.7,10.2 4.6,7.4 2.2,5.8 5.1,5.8"
        fill="#ffde00"
      />
      <circle cx="10.5" cy="2.5" r="0.55" fill="#ffde00" />
      <circle cx="12" cy="4" r="0.55" fill="#ffde00" />
      <circle cx="12" cy="6" r="0.55" fill="#ffde00" />
      <circle cx="10.5" cy="7.5" r="0.55" fill="#ffde00" />
    </svg>
  );
}

function FlagMy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="5.33" y="0" fill="#fecb00" />
      <rect width="24" height="5.34" y="5.33" fill="#34a853" />
      <rect width="24" height="5.33" y="10.67" fill="#ea4335" />
      <polygon
        points="12,5.5 13.1,8.2 16,8.2 13.7,9.9 14.8,12.6 12,10.9 9.2,12.6 10.3,9.9 8,8.2 10.9,8.2"
        fill="#fff"
      />
    </svg>
  );
}

export const FlagIcon: Record<Locale, React.FC<{ className?: string }>> = {
  ko: FlagKo,
  ja: FlagJa,
  en: FlagEn,
  zh: FlagZh,
  my: FlagMy,
};

type LanguageSwitcherProps = {
  variant?: "navbar" | "sidebar";
};

export default function LanguageSwitcher({
  variant = "navbar",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslations();
  const CurrentFlag = FlagIcon[locale];
  const isSidebar = variant === "sidebar";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <div className="relative inline-flex items-center ml-1 sm:ml-2 align-middle">
      <span className="pointer-events-none absolute left-2 z-10 flex items-center">
        <CurrentFlag className="block w-6 h-4 rounded-sm overflow-hidden shadow-sm ring-1 ring-black/15" />
      </span>
      <select
        value={locale}
        onChange={handleChange}
        aria-label={t("common.languageSelect")}
        className={[
          "language-switcher-select appearance-none cursor-pointer rounded bg-transparent py-1.5 pl-9 pr-7 text-xs font-semibold transition focus:outline-none min-w-[7.5rem] sm:min-w-[8.5rem]",
          isSidebar
            ? "language-switcher-select--sidebar border border-blueGray-300 text-blueGray-700 hover:border-blueGray-400 focus:ring-2 focus:ring-blueGray-300"
            : "border border-white/60 text-white hover:border-white focus:ring-2 focus:ring-white/80",
        ].join(" ")}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-white text-gray-900">
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
