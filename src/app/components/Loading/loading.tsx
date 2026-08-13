"use client";

import { memo } from "react";

type LoadingProps = {
  text?: string;
};

const Loading = (props: LoadingProps) => {
  const { text } = props;

  return (
    <div
      className="app-loading mx-auto grid h-56 max-w-md place-content-center justify-items-center gap-4 px-4"
      role="status"
      aria-live="polite"
    >
      <div className="app-loading-track" aria-hidden>
        <div className="app-loading-bar" />
      </div>
      <p className="text-sm font-semibold tracking-wide text-muted-foreground">
        {text ? text : "Loading..."}
      </p>
      <span className="sr-only">{text ? text : "Loading..."}</span>
    </div>
  );
};

export default memo(Loading);
