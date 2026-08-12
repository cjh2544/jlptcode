"use client";

import Link from "next/link";
import React, { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const AuthShell = ({ title, description, children, footer }: AuthShellProps) => {
  return (
    <section className="app-auth-page">
      <div className="app-auth-inner">
        <Link href="/" className="app-auth-brand" scroll={false} aria-label="JLPTCODE">
          <span className="app-auth-logo">
            <img
              className="app-auth-favicon"
              src="/images/logo.png"
              alt=""
              aria-hidden
              width={32}
              height={32}
              decoding="async"
            />
            <span className="app-auth-logo-jlpt">JLPT</span>
            <span className="app-auth-logo-code">CODE</span>
          </span>
        </Link>

        <div className="app-auth-card">
          <div className="app-auth-card-header">
            <h1 className="app-auth-title">{title}</h1>
            {description && (
              <p className="app-auth-desc">{description}</p>
            )}
          </div>
          <div className="app-auth-card-body">{children}</div>
          {footer && <div className="app-auth-card-footer">{footer}</div>}
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
