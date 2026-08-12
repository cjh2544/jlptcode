import type { Metadata } from 'next'
import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata: Metadata = {
  title: "오늘의 문법",
  description: "매일 일본어 문법을 학습하고 JLPT에 대비하세요.",
};

export default function GrammarTodayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout>
        {/* Header */}
        <HeaderTitle titleKey="layout.grammarToday" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
