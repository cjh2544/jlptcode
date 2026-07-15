"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { signOut, useSession } from "next-auth/react";
import {
  DeleteAccountLink,
  EditProfileLink,
  PaymentPeriodInfo,
  SignInButton,
  UserNameLabel,
} from "./SignInShared";

const SignInHeaderPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslations();

  const handleClickSignout = () => {
    signOut();
  };

  return (
    <div className="flex gap-2 ml-auto">
      {session ? (
        <div className="group relative">
          <button
            className="rounded-lg border border-white px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75"
            type="button"
          >
            <UserNameLabel className="xs:hidden mr-1" />
            <i className="fas fa-right-from-bracket" />
          </button>

          <div className="pt-1">
            <div className="z-10 absolute sm:right-0 hidden group-hover:block bg-white divide-y divide-gray-300 rounded-lg shadow w-64">
              <ul className="py-2 text-sm text-gray-700">
                {session?.paymentInfo?.isValid && (
                  <li>
                    <PaymentPeriodInfo className="block px-4 py-2 text-ligtBlue-700" />
                  </li>
                )}
                <li>
                  <EditProfileLink className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" />
                </li>
                <li>
                  <DeleteAccountLink className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" />
                </li>
              </ul>
              <div className="py-2">
                <a
                  onClick={handleClickSignout}
                  className="block px-4 py-2 hover:bg-gray-100 text-red-500 font-medium"
                  href="#"
                  aria-label={t("auth.signOut")}
                >
                  <i className="fas fa-right-from-bracket mr-1" />
                  {t("auth.signOut")}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SignInButton className="rounded-lg border border-white px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75" />
      )}
    </div>
  );
};

export default SignInHeaderPage;
