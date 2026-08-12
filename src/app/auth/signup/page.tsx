"use client";

import { signIn } from "next-auth/react";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useCallback, useState } from "react";
import { z } from "zod";
import { find, includes, isEmpty } from "lodash";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import Link from "next/link";
import { useTranslations } from "@/app/providers/I18nProvider";
import AuthShell from "@/app/components/Auth/AuthShell";
import { AuthField, AuthInput } from "@/app/components/Auth/AuthField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const SignUpPage = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<any> | null>(null);
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors(null);

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/user", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(Object.fromEntries(formData));
        setConfirmMsg(t("auth.signUpComplete"));
        setShowConfirm(true);
        setSuccess(true);
      } else {
        if (data.error) {
          setErrors(data.error.issues);
        } else {
          setConfirmMsg(data.message);
          setShowConfirm(true);
        }
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

  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);

    if (isSuccess) {
      signIn("credentials", { ...userInfo, redirect: true });
    }
  };

  return (
    <>
      <SignUpLayout>
        <AuthShell
          title={t("auth.signUp")}
          footer={
            <p>
              {t("auth.alreadyHaveAccount")}{" "}
              <Link href="/auth/signin" className="app-auth-link" scroll={false}>
                {t("auth.signIn")}
              </Link>
            </p>
          }
        >
          <form onSubmit={onSubmit} className="app-auth-form">
            <AuthField
              label={t("member.name")}
              htmlFor="name"
              invalid={!isValid("name")}
              error={getErrorMessage("name")}
            >
              <AuthInput
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={20}
                invalid={!isValid("name")}
                placeholder={t("auth.namePlaceholder")}
                autoComplete="name"
              />
            </AuthField>
            <AuthField
              label={t("auth.email")}
              htmlFor="email"
              invalid={!isValid("email")}
              error={getErrorMessage("email")}
            >
              <AuthInput
                id="email"
                name="email"
                type="email"
                required
                minLength={2}
                maxLength={100}
                invalid={!isValid("email")}
                placeholder="name@company.com"
                autoComplete="email"
              />
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
                autoComplete="new-password"
              />
            </AuthField>
            <AuthField
              label={t("auth.confirmPassword")}
              htmlFor="confirm-password"
              invalid={!isValid("confirm-password")}
              error={getErrorMessage("confirm-password")}
            >
              <AuthInput
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                minLength={6}
                maxLength={20}
                invalid={!isValid("confirm-password")}
                placeholder="••••••"
                autoComplete="new-password"
              />
            </AuthField>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="h-10 w-full gap-2 font-semibold"
            >
              {isLoading && <Spinner />}
              {isLoading ? t("common.processing") : t("auth.signUp")}
            </Button>
          </form>
        </AuthShell>
      </SignUpLayout>
      <ModalConfirm
        message={confirmMsg}
        visible={isShowConfirm}
        onClose={(visible: boolean) => handleCloseModal(visible)}
      />
    </>
  );
};

export default SignUpPage;
