import Sidebar from "@/app/components/Sidebar/Sidebar";
import HeaderTitle from "../Headers/HeaderTitle";
import Footer from "@/app/components/Footers/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JLPT",
  description: "JLPT 기출문제로 일본어능력시험을 준비하세요.",
};

export default function JlptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* Header */}
        <HeaderTitle titleKey="layout.jlpt" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
      </div>
    </>
  )
}
