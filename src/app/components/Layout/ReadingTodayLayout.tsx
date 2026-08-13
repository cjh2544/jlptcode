import type { Metadata } from 'next'
import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata: Metadata = {
  title: "오늘의 독해",
  description: "일본어 독해 지문으로 읽기 실력을 향상하세요.",
};

export default function ReadingTodayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout>
        {/* Header */}
        <HeaderTitle titleKey="layout.readingToday" />
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
