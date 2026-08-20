"use client";

import { useTranslations } from "@/app/providers/I18nProvider";
import { useDatabase } from "@/app/providers/DatabaseProvider";
import type { DatabaseType } from "@/app/lib/database-type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DATABASES: DatabaseType[] = ["mysql", "mongodb"];

const DATABASE_SHORT: Record<DatabaseType, string> = {
  mysql: "SQL",
  mongodb: "MG",
};

type DatabaseSwitcherProps = {
  variant?: "navbar" | "sidebar";
  menuAlign?: "start" | "end" | "center";
};

export default function DatabaseSwitcher({
  variant = "navbar",
  menuAlign = "start",
}: DatabaseSwitcherProps) {
  const { t } = useTranslations();
  const { databaseType, setDatabaseType } = useDatabase();
  const isSidebar = variant === "sidebar";

  const label = (type: DatabaseType) =>
    type === "mongodb" ? t("common.databaseMongodb") : t("common.databaseMysql");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t("common.databaseSelect")}
          className={cn(
            "db-switcher h-8 gap-1.5 px-2 font-semibold",
            isSidebar
              ? "border-border bg-card text-foreground hover:bg-muted"
              : "main-nav-utility-btn border-0 bg-transparent text-white shadow-none hover:bg-white/15 hover:text-white data-[state=open]:bg-white/20",
          )}
        >
          <i className="fas fa-database text-[0.7rem] opacity-90" aria-hidden />
          <span className="text-[0.7rem] tracking-wide">
            {DATABASE_SHORT[databaseType]}
          </span>
          <i
            className="fas fa-chevron-down text-[0.55rem] opacity-75"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={menuAlign}
        className="db-switcher-menu min-w-40 p-1"
      >
        {DATABASES.map((type) => {
          const active = type === databaseType;
          return (
            <DropdownMenuItem
              key={type}
              className={cn("cursor-pointer gap-2.5 px-2 py-2", active && "bg-accent")}
              onSelect={() => {
                if (type !== databaseType) setDatabaseType(type);
              }}
            >
              <i className="fas fa-database text-[0.7rem] opacity-80" aria-hidden />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-bold leading-tight">{label(type)}</span>
                <span className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground">
                  {DATABASE_SHORT[type]}
                </span>
              </span>
              {active && (
                <i className="fas fa-check text-[0.65rem] text-primary" aria-hidden />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
