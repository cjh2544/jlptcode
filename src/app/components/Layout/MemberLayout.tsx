import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata = {
  title: "회원정보",
  description: "JLPTCODE 회원 관리",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout className="font-nanumGothic">
        {/* Header */}
        <HeaderTitle titleKey="layout.member" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="px-4 mx-auto w-full m-10">
            <div className="app-panel w-full">
              {children}
            </div>
          </div>
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
