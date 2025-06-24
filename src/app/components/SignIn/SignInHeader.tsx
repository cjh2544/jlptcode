"use client"; // 필수!
import { formatInSeoul } from "@/app/utils/common";
import { includes } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";

const SignInHeaderPage = () => {
  const { data: session } = useSession();

  const handleClickSignout = () => {
    signOut();
  };
  
  const handleClickUserModify = () => {
    // signOut();
  };

  return (
    <div className="flex gap-2 ml-auto">
      {
        session
        ? <>
          <div className="group relative">
            <button className="rounded-lg border border-white px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" type="button">
              {session.user?.name}님
              <i className="fas fa-right-from-bracket ml-1" />
            </button>

            <div className="pt-1">
              <div className="z-10 absolute hidden group-hover:block bg-white divide-y divide-gray-300 rounded-lg shadow w-64">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {session?.paymentInfo?.isValid && (
                    <li>
                      <div className="text-ligtBlue-700 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        <i className="fas fa-star mr-1" />유료기간<br /> {formatInSeoul(session?.paymentInfo?.startDate, 'yyyy-MM-dd')} ~ {formatInSeoul(session?.paymentInfo?.endDate, 'yyyy-MM-dd')}
                      </div>
                    </li>
                  )}
                  <li>
                    <a href="/auth/modify" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <i className="fas fa-user mr-1" />회원정보 수정
                    </a>
                  </li>
                  <li>
                    <a href="/auth/delete" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <i className="fas fa-user mr-1" />회원탈퇴
                    </a>
                  </li>
                </ul>
                <div className="py-2">
                  <a onClick={handleClickSignout} className="block px-4 py-2 hover:bg-gray-100 text-red-500 font-medium" href="#">
                    <i className="fas fa-right-from-bracket mr-1" />
                    로그아웃
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
        : <>
          <button onClick={() => signIn()} className="rounded-lg border border-white px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" type="button">
            로그인
            <i className="fas fa-right-to-bracket ml-1" />
          </button>
        </>
      }
    </div>
  )
}

export default SignInHeaderPage
