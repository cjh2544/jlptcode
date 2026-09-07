"use client";

import React, { FormEvent, memo, useRef, useState } from "react";
import { useAdminDataStore } from "@/app/store/adminDataStore";
import { useTranslations } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import type { AdminFilterField } from "@/app/admin/data/table-config";
import AdminCsvPasswordDialog from "./AdminCsvPasswordDialog";

type AdminDataTitleProps = {
  title: string;
  table: string;
  filterFields?: AdminFilterField[];
  onAdd: () => void;
};

type CsvProgress = {
  mode: "download" | "upload";
  percent: number | null;
  label: string;
};

const filterInputClass =
  "h-11 w-full min-w-0 rounded-lg border border-white/25 bg-white/15 px-3 text-base text-white placeholder:text-white/60 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 md:h-9 md:text-sm lg:text-xs";

const primaryBtnClass =
  "h-11 w-full shrink-0 bg-white text-[var(--app-header-from)] hover:bg-white/90 md:h-9 md:w-auto";

const ghostBtnClass =
  "h-11 w-full border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white md:h-9 md:w-auto";

const csvDownloadBtnClass =
  "h-11 w-full border-emerald-300/50 bg-emerald-500/15 text-emerald-50 hover:bg-emerald-500/25 hover:text-white md:h-9 md:w-auto";

const csvUploadBtnClass =
  "h-11 w-full border-amber-300/50 bg-amber-500/15 text-amber-50 hover:bg-amber-500/25 hover:text-white md:h-9 md:w-auto";

const AdminDataTitle = ({
  title,
  table,
  filterFields = [],
  onAdd,
}: AdminDataTitleProps) => {
  const { t } = useTranslations();
  const searchInfo = useAdminDataStore((state) => state.searchInfo);
  const isLoading = useAdminDataStore((state) => state.isLoading);
  const pageInfo = useAdminDataStore((state) => state.pageInfo);
  const setPageInfo = useAdminDataStore((state) => state.setPageInfo);
  const setSearchInfo = useAdminDataStore((state) => state.setSearchInfo);
  const getPageInfo = useAdminDataStore((state) => state.getPageInfo);
  const getList = useAdminDataStore((state) => state.getList);
  const setLoading = useAdminDataStore((state) => state.setLoading);

  const [formKey, setFormKey] = useState(0);
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvMessage, setCsvMessage] = useState("");
  const [csvProgress, setCsvProgress] = useState<CsvProgress | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordMode, setPasswordMode] = useState<"download" | "upload">("download");
  const [passwordError, setPasswordError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapPasswordError = (code?: string) => {
    if (code === "PASSWORD_REQUIRED") return t("admin.csvPasswordRequired");
    if (code === "PASSWORD_MISMATCH") return t("admin.csvPasswordMismatch");
    if (code === "PASSWORD_UNAVAILABLE") return t("admin.csvPasswordUnavailable");
    return t("admin.csvPasswordMismatch");
  };

  const reloadList = async (nextSearch: Record<string, string | undefined>) => {
    setLoading(true);
    setSearchInfo(nextSearch);
    setPageInfo({ currentPage: 1 });
    await getPageInfo();
    await getList();
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch: Record<string, string> = {};
    formData.forEach((value, key) => {
      nextSearch[key] = String(value);
    });
    await reloadList(nextSearch);
  };

  const onReset = async () => {
    setFormKey((prev) => prev + 1);
    await reloadList({});
  };

  const openDownloadConfirm = () => {
    setPasswordMode("download");
    setPasswordError("");
    setPendingFile(null);
    setPasswordOpen(true);
  };

  const openUploadPicker = () => {
    fileInputRef.current?.click();
  };

  const onDownloadCsv = async (password: string) => {
    setCsvMessage("");
    setCsvBusy(true);
    setCsvProgress({
      mode: "download",
      percent: null,
      label: t("admin.csvProgressPreparing"),
    });

    try {
      const response = await fetch(`/api/admin/data/${table}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInfo, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = mapPasswordError(data.message);
        if (
          data.message === "PASSWORD_REQUIRED" ||
          data.message === "PASSWORD_MISMATCH" ||
          data.message === "PASSWORD_UNAVAILABLE"
        ) {
          setPasswordError(message);
          setCsvProgress(null);
          return;
        }
        setPasswordOpen(false);
        setCsvMessage(data.message || t("admin.csvExportFailed"));
        setCsvProgress(null);
        return;
      }

      setPasswordOpen(false);

      const reader = response.body?.getReader();
      if (!reader) {
        setCsvMessage(t("admin.csvExportFailed"));
        setCsvProgress(null);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      const csvParts: string[] = [];
      let filename = `${table}.csv`;
      let exportRows = 0;
      let exportError = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type: string;
            current?: number;
            total?: number;
            rows?: number;
            filename?: string;
            text?: string;
            message?: string;
          };

          if (event.type === "start") {
            if (event.filename) filename = event.filename;
            const total = event.total ?? 0;
            setCsvProgress({
              mode: "download",
              percent: total > 0 ? 0 : null,
              label: t("admin.csvProgressExporting")
                .replace("{current}", "0")
                .replace("{total}", String(total)),
            });
          }

          if (event.type === "chunk" && typeof event.text === "string") {
            csvParts.push(event.text);
          }

          if (event.type === "progress") {
            const current = event.current ?? 0;
            const total = event.total ?? 1;
            const percent =
              total > 0 ? Math.min(100, Math.round((current / total) * 100)) : null;
            setCsvProgress({
              mode: "download",
              percent,
              label: t("admin.csvProgressExporting")
                .replace("{current}", String(current))
                .replace("{total}", String(total)),
            });
          }

          if (event.type === "done") {
            exportRows = event.rows ?? 0;
            if (event.filename) filename = event.filename;
            setCsvProgress({
              mode: "download",
              percent: 100,
              label: t("admin.csvProgressDone"),
            });
          }

          if (event.type === "error") {
            exportError = event.message || t("admin.csvExportFailed");
          }
        }
      }

      if (exportError) {
        setCsvMessage(exportError);
        setCsvProgress(null);
        return;
      }

      if (!csvParts.length) {
        setCsvMessage(t("admin.csvExportFailed"));
        setCsvProgress(null);
        return;
      }

      const blob = new Blob(csvParts, { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);

      setCsvMessage(
        t("admin.csvExportSuccess") +
          (exportRows ? ` (${exportRows}${t("admin.csvRowsSuffix")})` : ""),
      );
    } catch {
      setCsvMessage(t("admin.csvExportFailed"));
      setCsvProgress(null);
    } finally {
      setCsvBusy(false);
    }
  };

  const onUploadCsv = async (file: File, password: string) => {
    setCsvMessage("");
    setCsvBusy(true);
    setCsvProgress({
      mode: "upload",
      percent: 0,
      label: t("admin.csvProgressUploading"),
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch(`/api/admin/data/${table}/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = mapPasswordError(data.message);
        if (
          data.message === "PASSWORD_REQUIRED" ||
          data.message === "PASSWORD_MISMATCH" ||
          data.message === "PASSWORD_UNAVAILABLE"
        ) {
          setPasswordError(message);
          setCsvProgress(null);
          return;
        }
        setPasswordOpen(false);
        setCsvMessage(data.message || t("admin.csvImportFailed"));
        setCsvProgress(null);
        return;
      }

      setPasswordOpen(false);
      setPendingFile(null);

      const reader = response.body?.getReader();
      if (!reader) {
        setCsvMessage(t("admin.csvImportFailed"));
        setCsvProgress(null);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let finalCreated = 0;
      let finalUpdated = 0;
      let finalFailed = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type: string;
            current?: number;
            total?: number;
            created?: number;
            updated?: number;
            failed?: number;
          };

          if (event.type === "start" || event.type === "progress") {
            const current = event.current ?? 0;
            const total = event.total ?? 1;
            const percent = Math.min(100, Math.round((current / total) * 100));
            setCsvProgress({
              mode: "upload",
              percent,
              label: t("admin.csvProgressImporting")
                .replace("{current}", String(current))
                .replace("{total}", String(total)),
            });
          }

          if (event.type === "done") {
            finalCreated = event.created ?? 0;
            finalUpdated = event.updated ?? 0;
            finalFailed = event.failed ?? 0;
            setCsvProgress({
              mode: "upload",
              percent: 100,
              label: t("admin.csvProgressDone"),
            });
          }
        }
      }

      setCsvMessage(
        t("admin.csvImportSuccess")
          .replace("{created}", String(finalCreated))
          .replace("{updated}", String(finalUpdated))
          .replace("{failed}", String(finalFailed)),
      );
      await reloadList(searchInfo || {});
    } catch {
      setCsvMessage(t("admin.csvImportFailed"));
      setCsvProgress(null);
    } finally {
      setCsvBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onPasswordConfirm = (password: string) => {
    setPasswordError("");
    if (passwordMode === "download") {
      void onDownloadCsv(password);
      return;
    }
    if (!pendingFile) {
      setPasswordError(t("admin.csvFileRequired"));
      return;
    }
    void onUploadCsv(pendingFile, password);
  };

  const filterLabel = (field: AdminFilterField) =>
    t(field.labelKey ?? `admin.fields.${field.key}`);

  const hasFilters = filterFields.length > 0;
  const busy = isLoading || csvBusy;

  return (
    <div className="app-panel-header">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Title row: mobile stacked / PC side-by-side */}
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
          <h6 className="truncate text-base font-bold leading-snug md:text-lg">
            {title}
            {pageInfo?.total != null ? ` (${pageInfo.total})` : ""}
          </h6>
          <Button
            type="button"
            size="sm"
            disabled={busy}
            className={primaryBtnClass}
            onClick={onAdd}
          >
            <i className="fas fa-plus mr-1.5 text-xs" aria-hidden />
            {t("admin.add")}
          </Button>
        </div>

        {/* Search card */}
        <form
          key={`${table}-search-${formKey}`}
          onSubmit={onSubmit}
          className="rounded-xl border border-white/15 bg-black/10 p-2.5 md:p-3 lg:p-4"
        >
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-white/80 md:mb-3 md:text-xs">
            {t("admin.searchSection")}
          </p>

          <div className="flex flex-col gap-2.5 md:gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
            {hasFilters ? (
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-3">
                {filterFields.map((field) => (
                  <label
                    key={field.key}
                    className="grid min-w-0 gap-1 lg:w-36 lg:shrink-0 xl:w-40"
                  >
                    <span className="truncate text-[11px] text-white/80 md:text-[11px]">
                      {filterLabel(field)}
                    </span>
                    <input
                      name={field.key}
                      defaultValue={searchInfo?.[field.key] ?? ""}
                      className={filterInputClass}
                      placeholder={filterLabel(field)}
                    />
                  </label>
                ))}
              </div>
            ) : null}

            <div className="flex w-full shrink-0 flex-col gap-2 md:flex-row md:items-center lg:w-auto lg:gap-2">
              <div className="relative w-full min-w-0 md:min-w-[14rem] md:flex-1 lg:w-64 lg:flex-none xl:w-72">
                <i
                  className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/70 md:text-[11px]"
                  aria-hidden
                />
                <input
                  name="keyword"
                  defaultValue={searchInfo?.keyword ?? ""}
                  className={`${filterInputClass} pl-9`}
                  placeholder={t("common.search")}
                />
              </div>

              {/* Mobile: equal full-width pair / PC: compact inline */}
              <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:shrink-0">
                <Button
                  type="submit"
                  size="sm"
                  disabled={busy}
                  className={`${primaryBtnClass} min-w-0 md:min-w-[5.5rem]`}
                >
                  <i className="fas fa-search mr-1.5 text-xs" aria-hidden />
                  <span className="truncate">
                    {isLoading ? t("common.searching") : t("common.search")}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={onReset}
                  className={`${ghostBtnClass} min-w-0 md:min-w-[5.5rem]`}
                >
                  <i className="fas fa-undo mr-1.5 text-xs" aria-hidden />
                  <span className="truncate">{t("admin.resetSearch")}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* CSV card */}
        <div className="rounded-xl border border-white/15 bg-black/10 p-2.5 md:p-3 lg:p-4">
          <div className="mb-2 flex flex-col gap-1 md:mb-3 md:flex-row md:items-center md:justify-between md:gap-3">
            <p className="text-[11px] font-semibold tracking-wide text-white/80 md:text-xs">
              {t("admin.csvSection")}
            </p>
            <p className="text-[10px] leading-snug text-white/65 md:text-[11px]">
              {t("admin.csvSectionHint")}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setPendingFile(file);
              setPasswordMode("upload");
              setPasswordError("");
              setPasswordOpen(true);
            }}
          />

          {/* Mobile: 2-col equal buttons / PC: auto-width row */}
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 md:flex md:flex-wrap md:gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              className={csvDownloadBtnClass}
              onClick={openDownloadConfirm}
            >
              <i className="fas fa-file-download mr-1.5 text-xs" aria-hidden />
              <span className="truncate">{t("admin.csvDownload")}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              className={csvUploadBtnClass}
              onClick={openUploadPicker}
            >
              <i className="fas fa-file-upload mr-1.5 text-xs" aria-hidden />
              <span className="truncate">{t("admin.csvUpload")}</span>
            </Button>
          </div>

          {csvProgress ? (
            <div
              className="mt-2.5 rounded-lg border border-white/15 bg-white/10 p-2.5 md:mt-3 md:p-3"
              role="status"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2 text-[11px] text-white/90 md:mb-2 md:items-center md:text-xs">
                <span className="min-w-0 break-words">
                  {csvProgress.mode === "download"
                    ? t("admin.csvDownload")
                    : t("admin.csvUpload")}
                  {" · "}
                  {csvProgress.label}
                </span>
                <span className="shrink-0 tabular-nums">
                  {csvProgress.percent == null ? "…" : `${csvProgress.percent}%`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/25 md:h-2">
                <div
                  className={`h-full rounded-full transition-[width] duration-200 ${
                    csvProgress.percent == null
                      ? "w-1/3 animate-pulse bg-sky-300"
                      : "bg-sky-300"
                  }`}
                  style={
                    csvProgress.percent == null
                      ? undefined
                      : { width: `${csvProgress.percent}%` }
                  }
                />
              </div>
            </div>
          ) : null}

          {csvMessage ? (
            <p className="mt-2 text-xs leading-snug text-white/90 md:text-sm" role="status">
              {csvMessage}
            </p>
          ) : null}
        </div>
      </div>

      <AdminCsvPasswordDialog
        open={passwordOpen}
        mode={passwordMode}
        busy={csvBusy}
        errorMessage={passwordError}
        onClose={() => {
          if (csvBusy) return;
          setPasswordOpen(false);
          setPendingFile(null);
          setPasswordError("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        onConfirm={onPasswordConfirm}
      />
    </div>
  );
};

export default memo(AdminDataTitle);
