"use client"; // 필수!
import Link from "next/link";
import InfoLayout from "@/app/components/Layout/InfoLayout";
const NotFound = () => {
  

  return (
    <>
        <InfoLayout>
            <section className="grid place-content-center h-screen font-nanumGothic">
                <div className="flex flex-col items-center justify-center px-6 py-8 max-w-md md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-2 text-2xl font-semibold text-gray-900">
                        <img className="w-auto" src={'/images/main_bg_title.png'} alt="JLPTCODE" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow-lg p-3">
                        <div class="text-center">
                            <p class="text-base font-semibold text-indigo-600">404</p>
                            <h1 class="mt-4 text-xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">페이지를 찾을수 없습니다.</h1>
                            <div class="mt-10 flex items-center justify-center gap-x-6">
                                <a href="/" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">홈으로 이동</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </InfoLayout>
    </>
  )
}

export default NotFound
