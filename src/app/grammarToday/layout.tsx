import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 문법",
  description: "매일 일본어 문법을 학습하고 JLPT에 대비하세요.",
};

export default function GrammarTodayRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
