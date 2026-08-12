"use client";

import UserAccountMenu from "./UserAccountMenu";

const SignInSidebarPage = () => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <UserAccountMenu variant="sidebar" />
    </div>
  );
};

export default SignInSidebarPage;
