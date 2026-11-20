"use client";

import React, { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ImageProps = {
  image: any;
  className?: string;
  skeletonClassName?: string;
};

function toDisplaySrc(src: string) {
  if (/^https?:\/\//i.test(src)) {
    return `/api/image?url=${encodeURIComponent(src)}`;
  }
  return src;
}

const LoadingDots = () => (
  <div className="app-image-loading-dots" role="status" aria-label="loading">
    <span className="app-image-loading-dot" />
    <span className="app-image-loading-dot" />
    <span className="app-image-loading-dot" />
  </div>
);

const CardImage = (props: ImageProps) => {
  const { image, className, skeletonClassName } = props;
  const { name, link } = image || {};
  const src = typeof link === "string" ? link.trim() : "";
  const displaySrc = src ? toDisplaySrc(src) : "";
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [displaySrc]);

  if (!src) return null;

  return (
    <div className={cn("app-question-media relative", className)}>
      {!loaded && (
        <div
          className={cn(
            "app-question-image-skeleton flex h-48 w-full max-w-full items-center justify-center rounded-lg bg-muted/70",
            skeletonClassName,
          )}
          aria-hidden
        >
          <LoadingDots />
        </div>
      )}
      <img
        src={displaySrc}
        alt={name || ""}
        className={cn(
          "app-question-image",
          !loaded && "pointer-events-none absolute inset-0 h-full w-full opacity-0",
        )}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
};

export default memo(CardImage);
