import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import HeaderTitle from "../Headers/HeaderTitle";
import Footer from "@/app/components/Footers/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "모의고사",
  description: "JLPT 모의고사로 실전 감각을 익혀보세요.",
};

export default function JlptTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout>
        {/* Header */}
        <HeaderTitle titleKey="layout.jlptTest" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
