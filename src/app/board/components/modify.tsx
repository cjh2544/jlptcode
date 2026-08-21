"use client";

import React, {
  FormEvent,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBoardCommunityStore } from "@/app/store/boardCommunityStore";
import { find, includes, isEmpty } from "lodash";
import Link from "next/link";
import { z } from "zod";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useTranslations } from "@/app/providers/I18nProvider";
import { formatInSeoul } from "@/app/utils/common";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Calendar,
  CircleAlert,
  Pencil,
  Trash2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TITLE_MAX = 100;
const CONTENT_MAX = 5000;

const BoardModify = () => {
  const { t } = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const boardInfo: Board = useBoardCommunityStore(
    (state: any) => state.boardInfo,
  );
  const isLoading = useBoardCommunityStore((state: any) => state.isLoading);
  const errors = useBoardCommunityStore((state: any) => state.errors);
  const showConfirm = useBoardCommunityStore((state: any) => state.showConfirm);
  const confirmMsg = useBoardCommunityStore((state: any) => state.confirmMsg);
  const messageType = useBoardCommunityStore((state: any) => state.messageType);
  const success = useBoardCommunityStore((state: any) => state.success);
  const procType = useBoardCommunityStore((state: any) => state.procType);
  const setLoading = useBoardCommunityStore((state: any) => state.setLoading);
  const setBoardInfo = useBoardCommunityStore((state: any) => state.setBoardInfo);
  const setErrors = useBoardCommunityStore((state: any) => state.setErrors);
  const setShowConfirm = useBoardCommunityStore(
    (state: any) => state.setShowConfirm,
  );
  const setConfirmMsg = useBoardCommunityStore(
    (state: any) => state.setConfirmMsg,
  );
  const setSuccess = useBoardCommunityStore((state: any) => state.setSuccess);
  const setMessageType = useBoardCommunityStore(
    (state: any) => state.setMessageType,
  );
  const setProcType = useBoardCommunityStore((state: any) => state.setProcType);
  const updateBoardInfo = useBoardCommunityStore(
    (state: any) => state.updateBoardInfo,
  );
  const deleteBoardInfo = useBoardCommunityStore(
    (state: any) => state.deleteBoardInfo,
  );

  const [titleLen, setTitleLen] = useState(
    () => (boardInfo.title || "").length,
  );
  const [contentLen, setContentLen] = useState(
    () => (boardInfo.contents || "").length,
  );

  const handleResult = useCallback(
    (data: any, formBoardInfo: Record<string, FormDataEntryValue>) => {
      if (data.success) {
        setBoardInfo(formBoardInfo);
        setMessageType("info");
        setConfirmMsg(data.message);
        setShowConfirm(true);
        setSuccess(true);
      } else if (data.error) {
        setMessageType("error");
        setErrors(data.error.issues);
      } else {
        setMessageType("warning");
        setConfirmMsg(data.message);
        setShowConfirm(true);
      }
    },
    [
      setBoardInfo,
      setConfirmMsg,
      setErrors,
      setMessageType,
      setShowConfirm,
      setSuccess,
    ],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcType("update");
    setLoading(true);
    setErrors(null);

    try {
      const formData = new FormData(event.currentTarget);
      const formBoardInfo = Object.fromEntries(formData.entries());
      const data: any = await updateBoardInfo(formBoardInfo);
      handleResult(data, formBoardInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMessageType("error");
        setConfirmMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!formRef.current) return;

    setProcType("delete");
    setLoading(true);
    setErrors(null);

    try {
      const formData = new FormData(formRef.current);
      const formBoardInfo = Object.fromEntries(formData.entries());
      const data: any = await deleteBoardInfo(formBoardInfo);
      handleResult(data, formBoardInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMessageType("error");
        setConfirmMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = useCallback(
    (colName: string) => {
      if (isEmpty(errors)) {
        return "";
      }
      const result = find(errors, (err) => includes(err.path, colName));
      return result?.message;
    },
    [errors],
  );

  const isValid = useCallback(
    (colName: string) => {
      if (isEmpty(errors)) {
        return true;
      }
      const result = find(errors, (err) => includes(err.path, colName));
      return isEmpty(result);
    },
    [errors],
  );

  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);

    if (success) {
      router.push("list", { scroll: false });
    }
  };

  const isMyWrite = Boolean(
    session?.user?.email && session.user.email === boardInfo.email,
  );
  const isAdmin = Boolean(
    session?.user?.role && session.user.role.includes("admin"),
  );
  const isNotice = boardInfo?.noticeYn === "Y";
  const titleValid = isValid("title");
  const contentValid = isValid("contents");

  return (
    <>
      <div className="app-board-view">
        <header className="app-board-view-header">
          <div className="flex flex-wrap items-center gap-2">
            {isNotice && (
              <span className="app-board-badge app-board-badge--notice">
                {t("board.notice")}
              </span>
            )}
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("board.editAction")}
            </span>
          </div>
          <h1 className="app-board-view-title">{t("board.editTitle")}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("board.editGuide")}
          </p>
          <div className="app-board-view-meta">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" aria-hidden />
              {boardInfo.name || session?.user?.name || "-"}
            </span>
            {(boardInfo.updatedAt || boardInfo.createdAt) && (
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Calendar className="size-3.5" aria-hidden />
                {formatInSeoul(
                  boardInfo.updatedAt || boardInfo.createdAt,
                  "yyyy-MM-dd HH:mm",
                )}
              </span>
            )}
          </div>
        </header>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
        >
          {isAdmin && (
            <fieldset className="app-board-field">
              <legend className="app-board-view-label">
                {t("board.noticeYn")}
              </legend>
              <div className="flex flex-wrap gap-2">
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm transition-colors",
                    "has-[:checked]:border-[color-mix(in_oklab,var(--primary)_45%,var(--border))] has-[:checked]:bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))]",
                  )}
                >
                  <input
                    type="radio"
                    className="size-4 accent-[var(--primary)]"
                    name="noticeYn"
                    value="Y"
                    defaultChecked={boardInfo.noticeYn === "Y"}
                  />
                  <span>{t("board.noticeYes")}</span>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm transition-colors",
                    "has-[:checked]:border-[color-mix(in_oklab,var(--primary)_45%,var(--border))] has-[:checked]:bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))]",
                  )}
                >
                  <input
                    type="radio"
                    className="size-4 accent-[var(--primary)]"
                    name="noticeYn"
                    value="N"
                    defaultChecked={boardInfo.noticeYn !== "Y"}
                  />
                  <span>{t("board.noticeNo")}</span>
                </label>
              </div>
            </fieldset>
          )}

          <div className="app-board-field">
            <div className="flex items-end justify-between gap-2">
              <label
                htmlFor="title"
                className={cn(
                  "app-board-view-label !mb-0",
                  !titleValid && "text-destructive",
                )}
              >
                {t("board.subject")}
                <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">
                  {t("board.titleLen")}
                </span>
              </label>
              <span
                className={cn(
                  "tabular-nums text-xs text-muted-foreground",
                  titleLen >= TITLE_MAX && "font-semibold text-destructive",
                )}
              >
                {t("board.charCount")
                  .replace("{n}", String(titleLen))
                  .replace("{max}", String(TITLE_MAX))}
              </span>
            </div>
            <input
              required
              maxLength={TITLE_MAX}
              type="text"
              name="title"
              id="title"
              defaultValue={boardInfo.title || ""}
              aria-invalid={!titleValid}
              className={cn("app-board-input", !titleValid && "is-invalid")}
              placeholder={t("board.placeholderTitle")}
              onChange={(e) => setTitleLen(e.target.value.length)}
            />
            {!titleValid && (
              <p className="app-board-field-error">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                {getErrorMessage("title")}
              </p>
            )}
          </div>

          <div className="app-board-field">
            <div className="flex items-end justify-between gap-2">
              <label
                htmlFor="contents"
                className={cn(
                  "app-board-view-label !mb-0",
                  !contentValid && "text-destructive",
                )}
              >
                {t("board.content")}
                <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">
                  {t("board.contentLen")}
                </span>
              </label>
              <span
                className={cn(
                  "tabular-nums text-xs text-muted-foreground",
                  contentLen >= CONTENT_MAX && "font-semibold text-destructive",
                )}
              >
                {t("board.charCount")
                  .replace("{n}", String(contentLen))
                  .replace("{max}", String(CONTENT_MAX))}
              </span>
            </div>
            <textarea
              name="contents"
              id="contents"
              required
              maxLength={CONTENT_MAX}
              rows={10}
              defaultValue={boardInfo.contents || ""}
              aria-invalid={!contentValid}
              className={cn("app-board-textarea", !contentValid && "is-invalid")}
              placeholder={t("board.placeholderContent")}
              onChange={(e) => setContentLen(e.target.value.length)}
            />
            {!contentValid && (
              <p className="app-board-field-error">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                {getErrorMessage("contents")}
              </p>
            )}
          </div>

          <p className="app-board-form-hint">{t("board.editHint")}</p>

          <footer className="app-board-view-actions">
            {isMyWrite && (
              <>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="h-10 min-w-0 flex-1 gap-1.5 sm:min-w-28 sm:flex-none"
                >
                  {isLoading && procType === "update" ? (
                    <>
                      <Spinner />
                      {t("common.processing")}
                    </>
                  ) : (
                    <>
                      <Pencil className="size-4" aria-hidden />
                      {t("board.update")}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={isLoading}
                  variant="destructive"
                  size="lg"
                  className="h-10 min-w-0 flex-1 gap-1.5 sm:min-w-28 sm:flex-none"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  {isLoading && procType === "delete" ? (
                    <>
                      <Spinner />
                      {t("common.processing")}
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" aria-hidden />
                      {t("board.delete")}
                    </>
                  )}
                </Button>
              </>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-10 min-w-0 flex-1 gap-1.5 sm:min-w-28 sm:flex-none"
            >
              <Link href="view" scroll={false}>
                <X className="size-4" aria-hidden />
                {t("common.cancel")}
              </Link>
            </Button>
          </footer>
        </form>
      </div>
      <ModalConfirm
        type="error"
        title={t("board.deleteTitle")}
        message={
          <>
            {t("board.deleteConfirm")}
            {boardInfo.title ? (
              <>
                <br />
                <span className="font-medium text-gray-800">
                  「{boardInfo.title}」
                </span>
              </>
            ) : null}
          </>
        }
        visible={showDeleteConfirm}
        showCancel
        confirmLabel={t("board.delete")}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={executeDelete}
      />
      <ModalConfirm
        type={messageType}
        message={confirmMsg}
        visible={showConfirm}
        onClose={(visible: boolean) => handleCloseModal(visible)}
      />
    </>
  );
};

export default memo(BoardModify);
