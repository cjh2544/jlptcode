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

const SignInSidebarPage = () => {
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
            className="flex items-center font-bold leading-snug text-black opacity-50 hover:opacity-75"
            type="button"
          >
            <UserNameLabel />
            <i className="fas fa-right-from-bracket ml-1" />
          </button>

          <div className="pt-1">
            <div className="z-10 absolute right-0 hidden border border-gray-300 group-hover:block bg-white divide-y divide-gray-300 rounded-lg shadow w-64">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {session?.paymentInfo?.isValid && (
                  <li>
                    <PaymentPeriodInfo className="block px-4 py-2" />
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
        <SignInButton
          className="focus:outline-none flex items-center font-bold text-black opacity-50 hover:opacity-75"
          showLabel
          hideLabelOnXs={false}
        />
      )}
    </div>
  );
};

export default SignInSidebarPage;
