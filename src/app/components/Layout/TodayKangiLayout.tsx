import AppSidebarLayout from "@/app/components/Layout/AppSidebarLayout";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export default function TodayKangiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebarLayout>
      <HeaderTitle titleKey="layout.todayKangi" />
      <div className="px-4 md:px-10 mx-auto w-full">
        {children}
        <Footer />
      </div>
    </AppSidebarLayout>
  );
}
