import type { Metadata } from "next";
import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata: Metadata = {
  title: "관리자",
  description: "JLPTCODE 관리자",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarLayout>
        {/* Header */}
        <HeaderTitle titleKey="layout.admin" />
        <div className="px-4 md:px-10 mx-auto w-full">
          {children}
          <Footer />
        </div>
    </AppSidebarLayout>
  )
}
