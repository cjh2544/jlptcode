"use client";

import {
  getCsrfToken,
  signIn,
} from "next-auth/react";
import Link from "next/link";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useEffect, useState } from "react";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/app/providers/I18nProvider";
import AuthShell from "@/app/components/Auth/AuthShell";
import { AuthField, AuthInput } from "@/app/components/Auth/AuthField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const SignInPage = () => {
  const { t } = useTranslations();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [confirmType, setConfirmType] = useState<any>("info");
  const router = useRouter();

  const getCsrf = async () => {
    const csrf = await getCsrfToken();
    setCsrfToken(csrf);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();

    setIsLoading(true);

    const res: any = await signIn("credentials", {
      email,
      password,
      csrfToken,
      redirect: false,
      callbackUrl: "/",
    });

    setIsLoading(false);

    if (!res.ok) {
      setConfirmMsg(res?.error);
      setShowConfirm(true);
      setConfirmType("warning");
    } else {
      router.push("/", { scroll: false });
    }
  };

  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);
  };

  useEffect(() => {
    getCsrf();
  }, []);

  return (
    <>
      <SignUpLayout>
        <AuthShell
          title={t("auth.signIn")}
          description={t("auth.emailSignIn")}
          footer={
            <p>
              {t("auth.noAccount")}{" "}
              <Link href="/auth/signup" className="app-auth-link" scroll={false}>
                {t("auth.signUp")}
              </Link>
            </p>
          }
        >
          <form onSubmit={onSubmit} className="app-auth-form">
            <AuthField label={t("auth.email")} htmlFor="email">
              <AuthInput
                id="email"
                name="email"
                type="email"
                required
                minLength={2}
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </AuthField>
            <AuthField label={t("auth.password")} htmlFor="password">
              <AuthInput
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••"
                autoComplete="current-password"
              />
            </AuthField>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="h-10 w-full gap-2 font-semibold"
            >
              {isLoading && <Spinner />}
              {isLoading ? t("auth.signingIn") : t("auth.signIn")}
            </Button>
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

export default SignInPage;
