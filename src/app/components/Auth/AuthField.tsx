"use client";

import React from "react";
import { cn } from "@/lib/utils";

type AuthFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  invalid?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function AuthField({
  label,
  htmlFor,
  error,
  invalid = false,
  children,
  className,
}: AuthFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className={cn("app-auth-label", invalid && "text-[var(--destructive)]")}
      >
        {label}
      </label>
      {children}
      {error && <p className="app-auth-error">{error}</p>}
    </div>
  );
}

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("app-auth-input", invalid && "app-auth-input--invalid", className)}
      {...props}
    />
  ),
);
AuthInput.displayName = "AuthInput";

export function AuthReadonly({ value }: { value?: string | null }) {
  return <p className="app-auth-readonly">{value || "-"}</p>;
}
