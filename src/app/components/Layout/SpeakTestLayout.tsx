import type { Metadata } from 'next'
import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata: Metadata = {
  title: "스피킹 테스트",
  description: "일본어 스피킹 실력을 테스트하고 점검하세요.",
};

export default function SpeakTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout>
        {/* Header */}
        <HeaderTitle titleKey="layout.speakTest" />
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
