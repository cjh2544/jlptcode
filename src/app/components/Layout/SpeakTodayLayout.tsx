import type { Metadata } from 'next'
import Sidebar from "@/app/components/Sidebar/Sidebar";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata: Metadata = {
  title: "회화학습",
  description: "일본어 회화 학습으로 말하기 실력을 키워보세요.",
};

export default function SpeakTodayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* Header */}
        <HeaderTitle titleKey="layout.speakToday" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
      </div>
    </>
  )
}
