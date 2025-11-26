"use client"; // 필수!
import { formatInSeoul } from "@/app/utils/common";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const SignInSidebarListPage = () => {
  const { data: session } = useSession();

  const handleClickSignout = () => {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL });
  };

  const handleClickUserModify = () => {
    // signOut();
  };

  return (
    <>
      {
        session
        ? 
        (
          <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li>
              <Link scroll={false} href="/auth/modify" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
              <i className="fas fa-user mr-1" />
                회원정보 수정
              </Link>
            </li>
            <li>
              <Link scroll={false} href="/auth/delete" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
              <i className="fas fa-user mr-1" />
                회원탈퇴
              </Link>
            </li>
            <li>
              <a onClick={() => signOut()} href="#" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                <i className="fas fa-right-from-bracket mr-1" />
                {session.user?.name}님
              </a>
            </li>
            {session?.paymentInfo?.isValid && (
              <li>
                <div className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                  <i className="fas fa-star mr-1" />유료기간<br /> {formatInSeoul(session?.paymentInfo?.startDate, 'yyyy-MM-dd')} ~ {formatInSeoul(session?.paymentInfo?.endDate, 'yyyy-MM-dd')}
                </div>
              </li>
            )}
          </ul>
        )
        :
        (
          <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li>
              <a onClick={() => signIn()} href="#" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                <i className="fas fa-right-from-bracket mr-1" />
                로그인
              </a>
            </li>
          </ul>
        )}
    </>
    // <div className="flex gap-2 ml-auto">
    //   {
    //     session
    //     ? <>
    //       <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
    //         <li>
    //           <a onClick={handleClickUserModify} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
    //             <i className="fas fa-user mr-1" />회원정보 수정
    //           </a>
    //         </li>
    //       </ul>
    //       {/* <button onClick={() => signOut()} className="focus:outline-none flex items-center font-bold leading-snug text-black opacity-50 hover:opacity-75" type="button">
    //         {session.user.name}님
    //         <i className="fas fa-right-from-bracket ml-1" />
    //       </button> */}
    //       <div className="group relative">
    //         <button className="flex items-center font-bold leading-snug text-black opacity-50 hover:opacity-75" type="button">
    //           {session.user.name}님
    //           <i className="fas fa-right-from-bracket ml-1" />
    //         </button>

    //         <div className="pt-1">
    //           <div className="z-10 absolute right-0 hidden border border-gray-300 group-hover:block bg-white divide-y divide-gray-300 rounded-lg shadow w-44">
    //             {/* <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
    //               <li>
    //                 <a onClick={handleClickUserModify} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
    //                   <i className="fas fa-user mr-1" />회원정보 수정
    //                 </a>
    //               </li>
    //             </ul> */}
    //             <div className="py-2">
    //               <a onClick={handleClickSignout} className="block px-4 py-2 hover:bg-gray-100 text-red-500 font-medium" href="#">
    //                 <i className="fas fa-right-from-bracket mr-1" />
    //                 로그아웃
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //     : <>
    //       <button onClick={() => signIn()} className="focus:outline-none flex items-center font-bold text-black opacity-50 hover:opacity-75" type="button">
    //         로그인
    //         <i className="fas fa-right-to-bracket ml-1" />
    //       </button>
    //     </>
    //   }
    // </div>
  )
}

export default SignInSidebarListPage
