"use client";

import { useSession } from "next-auth/react";
import {
  DeleteAccountLink,
  EditProfileLink,
  PaymentPeriodInfo,
  SignInLink,
  SignOutLink,
  UserNameLabel,
} from "./SignInShared";

const sidebarLinkClass =
  "text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block";

const SignInSidebarListPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <li>
          <SignInLink className={sidebarLinkClass} />
        </li>
      </ul>
    );
  }

  return (
    <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
      <li>
        <EditProfileLink className={sidebarLinkClass} />
      </li>
      <li>
        <DeleteAccountLink className={sidebarLinkClass} />
      </li>
      <PaymentPeriodInfo
        as="li"
        className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
      />
      <li>
        <span className={sidebarLinkClass}>
          <UserNameLabel />
        </span>
      </li>
      <li>
        <SignOutLink className={sidebarLinkClass} />
      </li>
    </ul>
  );
};

export default SignInSidebarListPage;
