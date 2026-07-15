import Sidebar from "@/app/components/Sidebar/Sidebar";
import Footer from "@/app/components/Footers/Footer";
import HeaderTitle from "../Headers/HeaderTitle";

export const metadata = {
  title: "회원가입",
  description: "회원가입, 로그인",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 bg-blueGray-200">
          {children}
        </div>
        <div className="flex-1 sm:hidden">
            <img
              className="object-cover object-center w-full h-full"
              src={'/images/main_bg.png'}
              alt="nature image"
            />
        </div>
      </div>
    </>
  )
}
