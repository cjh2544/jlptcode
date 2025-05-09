import Sidebar from "@/app/components/Sidebar/Sidebar";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: '게시판',
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 font-nanumGothic">
        {/* Header */}
        <HeaderTitle title="게시판" />
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="px-4 mx-auto w-full m-10">
            <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-blueGray-100 border-0">
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}
