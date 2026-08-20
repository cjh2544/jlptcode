"use client";

import {
  DATABASE_COOKIE,
  type DatabaseType,
} from "@/app/lib/database-type";
import React, { createContext, useCallback, useContext } from "react";

type DatabaseContextValue = {
  databaseType: DatabaseType;
  setDatabaseType: (type: DatabaseType) => void;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export default function DatabaseProvider({
  children,
  initialType,
}: {
  children: React.ReactNode;
  initialType: DatabaseType;
}) {
  const setDatabaseType = useCallback((type: DatabaseType) => {
    document.cookie = `${DATABASE_COOKIE}=${type};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }, []);

  return (
    <DatabaseContext.Provider value={{ databaseType: initialType, setDatabaseType }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error("useDatabase must be used within DatabaseProvider");
  }
  return ctx;
}
