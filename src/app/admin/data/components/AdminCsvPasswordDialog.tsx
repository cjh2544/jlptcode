"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminCsvPasswordDialogProps = {
  open: boolean;
  mode: "download" | "upload";
  busy?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

const AdminCsvPasswordDialog = ({
  open,
  mode,
  busy = false,
  errorMessage = "",
  onClose,
  onConfirm,
}: AdminCsvPasswordDialogProps) => {
  const { t } = useTranslations();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!password.trim() || busy) return;
    onConfirm(password);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !busy && onClose()}>
      <DialogContent
        className="w-[min(22rem,calc(100%-2rem))] max-w-[22rem] p-4 sm:max-w-[22rem]"
        showCloseButton={!busy}
      >
        <DialogHeader className="mb-1 md:mb-2">
          <DialogTitle className="text-lg md:text-xl">
            {mode === "download" ? t("admin.csvDownload") : t("admin.csvUpload")}
          </DialogTitle>
          <DialogDescription className="text-xs leading-snug md:text-sm">
            {t("admin.csvPasswordDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="grid gap-1.5 text-left">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {t("admin.csvPassword")}
            </span>
            <input
              type="password"
              autoComplete="current-password"
              autoFocus
              disabled={busy}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-base outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-60 md:h-10 md:text-sm"
              placeholder={t("admin.csvPasswordPlaceholder")}
            />
          </label>
          {errorMessage ? (
            <p className="text-left text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              className="h-11 md:h-10"
              onClick={onClose}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={busy || !password.trim()}
              className="h-11 md:h-10"
            >
              {busy ? t("common.processing") : t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCsvPasswordDialog;
