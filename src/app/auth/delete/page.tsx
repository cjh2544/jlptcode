"use client";

import { signOut, useSession } from "next-auth/react";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useCallback, useState } from "react";
import { z } from "zod";
import { find, includes, isEmpty } from "lodash";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import Link from "next/link";
import { useTranslations } from "@/app/providers/I18nProvider";
import AuthShell from "@/app/components/Auth/AuthShell";
import {
  AuthField,
  AuthInput,
  AuthReadonly,
} from "@/app/components/Auth/AuthField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const DeletePage = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<any> | null>(null);
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const { data: session } = useSession();
  const [confirmType, setConfirmType] = useState<any>("info");
  const [isProcSuccess, setProcSuccess] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!confirm(t("auth.deleteConfirm"))) {
      return;
    }

    setIsLoading(true);
    setErrors(null);
    setConfirmType("info");
    setProcSuccess(false);

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/user", {
        method: "DELETE",
        body: formData,
      });

      const data = await response.json();

      setProcSuccess(data.success);

      if (data.success) {
        setConfirmMsg(data.message);
        setShowConfirm(true);
      } else if (data.error) {
        setErrors(data.error.issues);
      } else {
        setConfirmType("warning");
        setConfirmMsg(data.message);
        setShowConfirm(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = useCallback(
    (colName: string) => {
      if (isEmpty(errors)) return "";
      const result = find(errors, (err) => includes(err.path, colName));
      return result?.message;
    },
    [errors],
  );

  const isValid = useCallback(
    (colName: string) => {
      if (isEmpty(errors)) return true;
      const result = find(errors, (err) => includes(err.path, colName));
      return isEmpty(result);
    },
    [errors],
  );

  const handleCloseModal = async (visible: boolean) => {
    setShowConfirm(visible);

    if (isProcSuccess) {
      await signOut();
    }
  };

  return (
    <>
      <SignUpLayout>
        <AuthShell
          title={t("auth.deleteAccount")}
          description={t("auth.deleteConfirm")}
        >
          <form onSubmit={onSubmit} className="app-auth-form">
            <AuthField label={t("member.name")}>
              <AuthReadonly value={session?.user?.name || ""} />
            </AuthField>
            <AuthField label={t("auth.email")}>
              <AuthReadonly value={session?.user?.email || ""} />
            </AuthField>
            <AuthField
              label={t("auth.password")}
              htmlFor="password"
              invalid={!isValid("password")}
              error={getErrorMessage("password")}
            >
              <AuthInput
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                maxLength={20}
                invalid={!isValid("password")}
                placeholder="••••••"
                autoComplete="current-password"
              />
            </AuthField>

            <div className="app-auth-actions">
              <Button
                type="submit"
                name="delete"
                size="lg"
                variant="destructive"
                disabled={isLoading}
                className="h-10 flex-1 gap-2 font-semibold"
              >
                {isLoading && <Spinner />}
                {isLoading ? t("common.processing") : t("auth.deleteAction")}
              </Button>
              <Button
                asChild
                type="button"
                size="lg"
                variant="outline"
                className="h-10 flex-1 font-semibold"
              >
                <Link href="/" scroll={false}>
                  {t("auth.cancel")}
                </Link>
              </Button>
            </div>
          </form>
        </AuthShell>
      </SignUpLayout>
      <ModalConfirm
        type={confirmType}
        message={confirmMsg}
        visible={isShowConfirm}
        onClose={(visible: boolean) => handleCloseModal(visible)}
      />
    </>
  );
};

export default DeletePage;
