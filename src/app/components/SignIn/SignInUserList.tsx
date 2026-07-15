"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";

const SignInUserList = () => {
  const { data: session } = useSession();
  const { t } = useTranslations();

  const isAdmin = useCallback(() => {
    return session?.user?.role && session?.user?.role?.includes("admin");
  }, [session]);

  return (
    <>
      {isAdmin() && (
        <>
          <hr className="my-4 md:min-w-full" />
          <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
            {t("sidebar.memberInfo")}
          </h6>
          <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
            <li className="items-center">
              <Link
                scroll={false}
                href="/member/list"
                className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
              >
                <i className="fas fa-list-ol text-blueGray-400 mr-2 text-sm"></i>{" "}
                {t("sidebar.memberList")}
              </Link>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default SignInUserList;
