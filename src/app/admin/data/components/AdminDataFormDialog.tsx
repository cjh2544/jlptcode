"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  buildFormPayload,
  emptyFormValues,
  recordToFormValues,
  type AdminFieldConfig,
} from "@/app/admin/data/table-config";
import { useAdminDataStore } from "@/app/store/adminDataStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminDataFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  recordId?: string;
  fields: AdminFieldConfig[];
  defaultValues?: Record<string, unknown>;
  onClose: () => void;
  onSaved: () => void;
};

const AdminDataFormDialog = ({
  open,
  mode,
  recordId,
  fields,
  defaultValues,
  onClose,
  onSaved,
}: AdminDataFormDialogProps) => {
  const { t } = useTranslations();
  const table = useAdminDataStore((state) => state.table);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studyRoundHint, setStudyRoundHint] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowSaveConfirm(false);
      setShowSaveSuccess(false);
      return;
    }

    const load = async () => {
      setErrorMsg("");
      if (mode === "create") {
        setValues(emptyFormValues(fields, defaultValues));
        return;
      }

      if (!recordId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/data/${table}/${recordId}`);
        const data = await response.json();
        if (!response.ok) {
          setErrorMsg(data.message || t("admin.loadFailed"));
          return;
        }
        setValues(recordToFormValues(fields, data as Record<string, unknown>));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [open, mode, recordId, table, fields, defaultValues, t]);

  useEffect(() => {
    if (!open || table !== "level_up") {
      setStudyRoundHint("");
      return;
    }

    const level = values.level?.trim();
    const year = values.year?.trim();
    if (!level || !year) {
      setStudyRoundHint("");
      return;
    }
    if (year === "random") {
      setStudyRoundHint("random");
      return;
    }
    if (!year.includes("(")) {
      setStudyRoundHint("");
      return;
    }

    let cancelled = false;
    const load = async () => {
      const response = await fetch(
        `/api/admin/data/level_up/jlpt-map?level=${encodeURIComponent(level)}`,
      );
      const data = await response.json();
      if (cancelled || !response.ok) return;
      setStudyRoundHint(data.yearToTest?.[year] ?? "");
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [open, table, values.level, values.year]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setShowSaveConfirm(true);
  };

  const executeSave = async () => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const payload = buildFormPayload(fields, values);
      const url =
        mode === "create"
          ? `/api/admin/data/${table}`
          : `/api/admin/data/${table}/${recordId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      let data: { success?: boolean; message?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data?.success) {
        setErrorMsg(data?.message || t("admin.saveFailed"));
        return;
      }

      setShowSaveSuccess(true);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setErrorMsg(t("admin.invalidJson"));
      } else if (error instanceof Error && error.message.startsWith("invalid number:")) {
        setErrorMsg(t("admin.invalidNumber"));
      } else {
        setErrorMsg(t("admin.saveFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuccessClose = () => {
    setShowSaveSuccess(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" showCloseButton>
        <form onSubmit={onSubmit} className="contents">
          <DialogHeader className="mb-2">
            <DialogTitle>
              {mode === "create" ? t("admin.add") : t("admin.edit")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {fields.map((field) => (
              <label key={field.key} className="grid gap-1.5">
                <span className="text-sm font-medium">
                  {t(`admin.fields.${field.key}`)}
                  {field.required ? " *" : ""}
                </span>
                {field.type === "json" ? (
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                    rows={field.rows ?? 6}
                    className="min-h-28 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    placeholder="{}"
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                    rows={field.rows ?? 3}
                    required={field.required}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={values[field.key] ?? ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                    required={field.required}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                )}
                {table === "level_up" && field.key === "year" ? (
                  <span className="text-xs text-muted-foreground">
                    {studyRoundHint
                      ? `${t("admin.fields.studyRound")}: ${studyRoundHint}`
                      : t("admin.levelUpStudyRoundHint")}
                  </span>
                ) : null}
              </label>
            ))}
          </div>

          {errorMsg ? (
            <p className="text-sm text-destructive">{errorMsg}</p>
          ) : null}

          <DialogFooter className="flex-row sm:justify-end">
            <Button type="submit" disabled={isLoading} className="h-9">
              {isLoading ? t("common.processing") : t("admin.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={onClose}
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <ModalConfirm
        type="warning"
        message={
          mode === "create" ? t("admin.saveConfirm") : t("admin.updateConfirm")
        }
        visible={showSaveConfirm}
        showCancel
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={executeSave}
      />

      <ModalConfirm
        type="info"
        message={t("admin.saveSuccess")}
        visible={showSaveSuccess}
        onClose={handleSaveSuccessClose}
      />
    </Dialog>
  );
};

export default AdminDataFormDialog;
