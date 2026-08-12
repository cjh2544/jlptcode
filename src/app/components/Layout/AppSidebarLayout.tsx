"use client";

import Sidebar, { SidebarMobileBar } from "@/app/components/Sidebar/Sidebar";
import { useSidebarStore } from "@/app/store/sidebarStore";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type AppSidebarLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function AppSidebarLayout({
  children,
  className,
}: AppSidebarLayoutProps) {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);

  return (
    <>
      <Sidebar />
      {mobileOpen && (
        <button
          type="button"
          className="app-sidebar-backdrop md:hidden"
          aria-label="Close menu"
          onClick={() => useSidebarStore.getState().setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "app-sidebar-main relative app-page-bg",
          collapsed ? "md:ml-0" : "md:ml-64",
          className,
        )}
      >
        <SidebarMobileBar />
        {children}
      </div>
    </>
  );
}
