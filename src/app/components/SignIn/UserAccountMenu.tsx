"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import UserAccountPanel from "./UserAccountPanel";

type UserAccountMenuProps = {
  variant?: "header" | "sidebar";
};

function getInitial(name?: string | null) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

const UserAccountMenu = ({ variant = "header" }: UserAccountMenuProps) => {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const isHeader = variant === "header";

  if (!session) {
    return (
      <Button
        type="button"
        size="sm"
        variant={isHeader ? "outline" : "ghost"}
        className={cn(
          "h-9 gap-2 font-semibold",
          isHeader
            ? "border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            : "text-foreground/70 hover:text-foreground",
        )}
        onClick={() => signIn()}
        aria-label={t("auth.signIn")}
      >
        <i className="fas fa-right-to-bracket" aria-hidden />
        <span className={isHeader ? "hidden lg:inline" : undefined}>
          {t("auth.signIn")}
        </span>
      </Button>
    );
  }

  const name = session.user?.name || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={isHeader ? "outline" : "ghost"}
          className={cn(
            "h-9 gap-2 px-2 font-semibold",
            isHeader
              ? "border-white/70 bg-white/10 px-1.5 text-white hover:bg-white/20 hover:text-white data-[state=open]:bg-white/25 lg:px-2"
              : "text-foreground/80 hover:text-foreground data-[state=open]:bg-muted",
          )}
          aria-label={t("auth.accountMenu")}
        >
          <span
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-full text-[0.7rem] font-bold",
              isHeader
                ? "bg-white text-[var(--primary)]"
                : "bg-primary text-primary-foreground",
            )}
          >
            {getInitial(name)}
          </span>
          <span className={cn("max-w-28 truncate", isHeader && "hidden lg:inline")}>
            {name}
            {t("auth.userSuffix")}
          </span>
          <i
            className={cn(
              "fas fa-chevron-down text-[0.65rem] opacity-80",
              isHeader && "hidden lg:inline",
            )}
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="app-account-menu w-72 p-0"
      >
        <UserAccountPanel variant="dropdown" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountMenu;
