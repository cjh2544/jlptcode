import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시판",
  description: "JLPTCODE 문의 게시판에서 궁금한 점을 남겨주세요.",
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout className="font-nanumGothic">
        {/* Header */}
        <HeaderTitle titleKey="layout.board" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
        <div className="px-4 mx-auto w-full mt-6 mb-10">
            <div className="app-panel w-full overflow-hidden">
              {children}
            </div>
          </div>
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
