import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";

const SignInUserList = () => {
  const { data: session } = useSession();

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes('admin');
  }, [session])
  
  return (
    <>
      {
        isAdmin() && (
          <>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              회원정보
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link scroll={false} href="/member/list" className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block">
                <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                회원목록
                </Link>
              </li>
            </ul>
          </>
        )
      }
    </>
  )
}

export default SignInUserList
